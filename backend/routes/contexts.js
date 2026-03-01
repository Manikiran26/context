const express = require('express');
const db = require('../db');
const { createNotification } = require('../utils/notifications');
const auth = require('../middleware/auth');
const router = express.Router();

// Helper to log activity (no transaction)
const logActivity = async (contextId, userId, type, metadata = {}) => {
    try {
        await db.query(
            'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [contextId, userId, type, JSON.stringify(metadata)]
        );
    } catch (e) {
        console.error("logActivity failed:", e.message);
    }
};

// ─── Intelligence Engine (Shared) ─────────────────────────────────────────────
const calculateIntelligence = async (contextId) => {
    try {
        const tasksRes = await db.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE completed = true) as done FROM tasks WHERE context_id = $1', [contextId]);
        const notesRes = await db.query('SELECT COUNT(*) as count FROM notes WHERE context_id = $1', [contextId]);
        const filesRes = await db.query('SELECT COUNT(*) as count FROM files WHERE context_id = $1', [contextId]);
        const membersRes = await db.query("SELECT COUNT(*) as count FROM context_members WHERE context_id = $1 AND status = 'active'", [contextId]);
        const activityRes = await db.query('SELECT MAX(created_at) as last FROM activity_logs WHERE context_id = $1', [contextId]);

        const totalTasks = parseInt(tasksRes.rows[0].total) || 0;
        const doneTasks = parseInt(tasksRes.rows[0].done) || 0;
        const notesCount = parseInt(notesRes.rows[0].count) || 0;
        const filesCount = parseInt(filesRes.rows[0].count) || 0;
        const membersCount = parseInt(membersRes.rows[0].count) || 0;
        const lastActivityAt = activityRes.rows[0].last ? new Date(activityRes.rows[0].last) : null;

        // 1. Completeness (50%)
        let completeness = 0;
        if (totalTasks > 0) completeness = Math.round((doneTasks / totalTasks) * 100);

        // 2. Connections (25%)
        // Cap at 100. Each item contributes significantly.
        const structureScore = (notesCount * 5) + (totalTasks * 5) + (filesCount * 3) + (membersCount * 6);
        const connections = Math.min(structureScore, 100);

        // 3. Freshness (25%)
        let freshness = 0;
        if (lastActivityAt) {
            const msAgo = Date.now() - lastActivityAt.getTime();
            const hoursAgo = msAgo / (1000 * 60 * 60);
            const decayRate = 0.3; // 100 / 336 hours (~14 days) to reach 0
            freshness = Math.max(0, 100 - (hoursAgo * decayRate));
        }

        // 4. Final Score (Rounded)
        const score = Math.round(
            (completeness * 0.5) + (connections * 0.25) + (freshness * 0.25)
        );

        return { completeness, connections, freshness, score };
    } catch (err) {
        console.error("calculateIntelligence failed:", err.message);
        return { completeness: 0, connections: 0, freshness: 0, score: 0 };
    }
};

// GET /api/contexts
router.get('/', auth, async (req, res) => {
    try {
        const contextsRes = await db.query(
            "SELECT c.*, cm.role FROM contexts c JOIN context_members cm ON c.id = cm.context_id WHERE cm.user_id = $1 AND cm.status = 'active' ORDER BY c.created_at DESC",
            [req.user.id]
        );

        // Enrich with intelligence score
        const contexts = await Promise.all(contextsRes.rows.map(async (ctx) => {
            const intel = await calculateIntelligence(ctx.id);
            return { ...ctx, ...intel }; // Return full intel object
        }));

        res.json(contexts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/contexts
router.post('/', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { name, icon, tag } = req.body;

        // No membership check before creation
        const ctxRes = await client.query(
            'INSERT INTO contexts (user_id, name, icon, tag) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, name, icon, tag]
        );
        const context = ctxRes.rows[0];

        // Ensure creator gets host membership
        await client.query(
            "INSERT INTO context_members (context_id, user_id, role, status) VALUES ($1, $2, 'host', 'active')",
            [context.id, req.user.id]
        );

        await client.query(
            'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [context.id, req.user.id, 'CONTEXT_CREATED', JSON.stringify({ name })]
        );

        await client.query('COMMIT');
        res.status(201).json(context);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// GET /api/contexts/:id
router.get('/:id', auth, async (req, res) => {
    try {
        const result = await db.query(
            "SELECT c.* FROM contexts c JOIN context_members cm ON c.id = cm.context_id WHERE c.id = $1 AND cm.user_id = $2 AND cm.status = 'active'",
            [req.params.id, req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Context not found' });

        const ctx = result.rows[0];
        const intel = await calculateIntelligence(ctx.id);
        res.json({ ...ctx, ...intel }); // Return full intel
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/contexts/:id
router.delete('/:id', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );

        if (memCheck.rows.length === 0 || memCheck.rows[0].role !== 'host') {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Permission denied. Only hosts can delete contexts.' });
        }

        await client.query(
            'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'CONTEXT_DELETED', JSON.stringify({})]
        );

        const result = await client.query('DELETE FROM contexts WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Context not found' });
        }

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// POST /api/contexts/:id/notes
router.post('/:id/notes', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { title, content } = req.body;

        // Validate active membership
        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Not an active member' });
        }

        const result = await client.query(
            'INSERT INTO notes (context_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [req.params.id, title, content]
        );

        await client.query(
            'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'NOTE_CREATED', JSON.stringify({ type: 'note', title: title || 'New Note' })]
        );

        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// GET /api/contexts/:id/notes
router.get('/:id/notes', auth, async (req, res) => {
    try {
        // Validate active membership
        const memCheck = await db.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) return res.status(403).json({ error: 'Not an active member' });

        const result = await db.query('SELECT * FROM notes WHERE context_id = $1 ORDER BY created_at DESC', [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/contexts/:id/notes/:noteId
router.patch('/:id/notes/:noteId', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { title, content } = req.body;
        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Not an active member' });
        }
        const fields = []; const vals = []; let idx = 1;
        if (title !== undefined) { fields.push(`title = $${idx++}`); vals.push(title); }
        if (content !== undefined) { fields.push(`content = $${idx++}`); vals.push(content); }
        if (fields.length === 0) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Nothing to update' }); }
        vals.push(req.params.noteId, req.params.id);
        const result = await client.query(
            `UPDATE notes SET ${fields.join(', ')} WHERE id = $${idx} AND context_id = $${idx + 1} RETURNING *`, vals
        );
        await client.query(
            'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'NOTE_UPDATED', JSON.stringify({ itemId: req.params.noteId, title: title || '' })]
        );
        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (err) { await client.query('ROLLBACK'); res.status(500).json({ error: err.message }); }
    finally { client.release(); }
});

// DELETE /api/contexts/:id/notes/:noteId
router.delete('/:id/notes/:noteId', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Not an active member' }); }
        await client.query('INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'NOTE_DELETED', JSON.stringify({ itemId: req.params.noteId })]
        );
        await client.query('DELETE FROM notes WHERE id = $1 AND context_id = $2', [req.params.noteId, req.params.id]);
        await client.query('COMMIT');
        res.json({ message: 'Note deleted' });
    } catch (err) { await client.query('ROLLBACK'); res.status(500).json({ error: err.message }); }
    finally { client.release(); }
});

// GET /api/contexts/:id/members — only active members returned
router.get('/:id/members', auth, async (req, res) => {
    try {
        // Pure DB truth: Join users and filter by context_id. No session-based filtering.
        const result = await db.query(`
            SELECT u.id, u.email, cm.role, cm.status, cm.joined_at, u.last_seen,
                   (u.last_seen > (CURRENT_TIMESTAMP - INTERVAL '2 minutes')) as is_online
            FROM context_members cm
            JOIN users u ON cm.user_id = u.id
            WHERE cm.context_id = $1 AND cm.status = 'active'
            ORDER BY CASE cm.role WHEN 'host' THEN 1 WHEN 'editor' THEN 2 ELSE 3 END
        `, [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// POST /api/contexts/:id/members — strict host/editor/viewer invite logic
router.post('/:id/members', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { email, targetRole } = req.body;
        console.log("Invite called by:", req.user.id);

        if (!email) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Email is required' });
        }

        // Verify inviter is active member and get their role
        const inviterMem = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (inviterMem.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Only active members can invite others' });
        }
        const inviterRole = inviterMem.rows[0].role;

        // Get inviter email
        const inviterRes = await client.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
        const actorEmail = inviterRes.rows[0].email;

        // Find target user
        const userRes = await client.query('SELECT id, email FROM users WHERE email = $1', [email]);
        if (userRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'No user found with that email' });
        }
        const targetUserId = userRes.rows[0].id;
        const targetEmail = userRes.rows[0].email;

        if (targetUserId === req.user.id) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'You cannot invite yourself' });
        }

        const existingMem = await client.query(
            'SELECT status FROM context_members WHERE context_id = $1 AND user_id = $2',
            [req.params.id, targetUserId]
        );
        if (existingMem.rows.length > 0) {
            await client.query('ROLLBACK');
            const existing = existingMem.rows[0].status;
            return res.status(400).json({ error: `User is already ${existing === 'active' ? 'a member' : 'pending approval'}` });
        }

        // Get context name for messages
        const ctxRes = await client.query('SELECT name FROM contexts WHERE id = $1', [req.params.id]);
        const contextName = ctxRes.rows[0]?.name || 'this context';

        // Prevent non-host from granting host role
        const safeRole = ['editor', 'viewer'].includes(targetRole) ? targetRole : 'viewer';

        if (inviterRole === 'host') {
            // HOST → direct add, status = active
            await client.query(
                "INSERT INTO context_members (context_id, user_id, role, status, added_by) VALUES ($1, $2, $3, 'active', $4)",
                [req.params.id, targetUserId, safeRole, req.user.id]
            );
            await client.query(
                'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
                [req.params.id, req.user.id, 'MEMBER_ADDED', JSON.stringify({ actor_email: actorEmail, target_email: targetEmail })]
            );
            await createNotification(client, {
                userId: targetUserId,
                type: 'MEMBER_ADDED',
                message: `You were added to "${contextName}" by ${actorEmail}`,
                contextId: req.params.id,
                metadata: { actor_email: actorEmail, context_name: contextName }
            });
            await client.query('COMMIT');
            return res.json({ success: true, status: 'active' });
        } else {
            // EDITOR/VIEWER → pending, notify HOST only
            const memRes = await client.query(
                "INSERT INTO context_members (context_id, user_id, role, status, added_by) VALUES ($1, $2, $3, 'pending', $4) RETURNING id",
                [req.params.id, targetUserId, safeRole, req.user.id]
            );
            const membershipId = memRes.rows[0].id;

            await client.query(
                'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
                [req.params.id, req.user.id, 'MEMBER_REQUESTED', JSON.stringify({ actor_email: actorEmail, target_email: targetEmail })]
            );

            // Notify HOST only
            const hostRows = await client.query(
                "SELECT user_id FROM context_members WHERE context_id = $1 AND role = 'host' AND status = 'active'",
                [req.params.id]
            );
            for (const host of hostRows.rows) {
                await createNotification(client, {
                    userId: host.user_id,
                    type: 'MEMBER_REQUEST',
                    message: `${actorEmail} requested to add ${targetEmail} to "${contextName}"`,
                    contextId: req.params.id,
                    metadata: { membership_id: membershipId, actor_email: actorEmail, target_email: targetEmail, context_name: contextName }
                });
            }
            await client.query('COMMIT');
            return res.json({ success: true, status: 'pending' });
        }
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});


// GET /api/contexts/:id/pending-requests (host only)
router.get('/:id/pending-requests', auth, async (req, res) => {
    try {
        const memCheck = await db.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0 || memCheck.rows[0].role !== 'host') {
            return res.status(403).json({ error: 'Only hosts can view pending requests' });
        }

        const result = await db.query(`
            SELECT cm.id as request_id, u.id as user_id, u.email, cm.role, cm.status, cm.context_id, cm.added_by
            FROM context_members cm
            JOIN users u ON cm.user_id = u.id
            WHERE cm.context_id = $1 AND cm.status = 'pending'
            ORDER BY cm.created_at
        `, [req.params.id]);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// GET /api/contexts/:id/intelligence — dynamic score
router.get('/:id/intelligence', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const memCheck = await db.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [id, req.user.id]
        );
        if (memCheck.rows.length === 0) return res.status(403).json({ error: 'Not an active member' });

        const intel = await calculateIntelligence(id);
        res.json(intel);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// GET /api/contexts/:id/graph
router.get('/:id/graph', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const memCheck = await db.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [id, req.user.id]
        );
        if (memCheck.rows.length === 0) return res.status(403).json({ error: 'Not an active member' });

        const ctxRes = await db.query('SELECT * FROM contexts WHERE id = $1', [id]);
        const ctx = ctxRes.rows[0];

        let nodes = [];
        let edges = [];

        nodes.push({
            id: 'ctx-' + ctx.id,
            position: { x: 400, y: 100 },
            data: { label: ctx.name, type: 'context' },
            type: 'custom'
        });

        const notesRes = await db.query('SELECT id, title FROM notes WHERE context_id = $1', [id]);
        const filesRes = await db.query('SELECT id, name FROM files WHERE context_id = $1', [id]);
        const deadlinesRes = await db.query('SELECT id, title FROM deadlines WHERE context_id = $1', [id]);

        let yOffset = 300;
        let xOffset = 100;

        const addToGraph = (items, typeKey, labelKey) => {
            items.forEach((item) => {
                const nodeId = typeKey + '-' + item.id;
                nodes.push({ id: nodeId, position: { x: xOffset, y: yOffset }, data: { label: item[labelKey], type: typeKey }, type: 'custom' });
                edges.push({ id: 'e-ctx-' + nodeId, source: 'ctx-' + ctx.id, target: nodeId, animated: true, style: { stroke: '#374151', strokeWidth: 1.5 } });
                xOffset += 200;
            });
        };

        addToGraph(notesRes.rows, 'note', 'title');
        addToGraph(filesRes.rows, 'file', 'name');
        addToGraph(deadlinesRes.rows, 'deadline', 'title');

        res.json({ nodes, edges });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Tasks ───────────────────────────────────────────────────────────────────

// GET /api/contexts/:id/tasks
router.get('/:id/tasks', auth, async (req, res) => {
    try {
        const memCheck = await db.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) return res.status(403).json({ error: 'Not an active member' });

        const result = await db.query('SELECT * FROM tasks WHERE context_id = $1 ORDER BY created_at ASC', [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/contexts/:id/tasks
router.post('/:id/tasks', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { title, content } = req.body;

        console.log("Creating task in context:", req.params.id);
        console.log("Body:", req.body);
        console.log("User:", req.user.id);

        const memCheck = await client.query(
            "SELECT * FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Not an active member' });
        }

        const result = await client.query(
            'INSERT INTO tasks (context_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [req.params.id, title || content || 'New Task', content || '']
        );

        await client.query(
            'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'TASK_CREATED', JSON.stringify({ type: 'task', title: result.rows[0].title })]
        );

        await client.query('COMMIT');
        return res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Task creation error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// PATCH /api/contexts/:id/tasks/:taskId
router.patch('/:id/tasks/:taskId', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Not an active member' }); }

        const { completed, content, title } = req.body;
        const fields = []; const vals = []; let idx = 1;
        if (completed !== undefined) { fields.push(`completed = $${idx++}`); vals.push(completed); }
        if (content !== undefined) { fields.push(`content = $${idx++}`); vals.push(content); }
        if (title !== undefined) { fields.push(`title = $${idx++}`); vals.push(title); }
        if (fields.length === 0) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'No fields to update' }); }

        vals.push(req.params.taskId, req.params.id);
        const result = await client.query(
            `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx} AND context_id = $${idx + 1} RETURNING *`, vals
        );

        const typeType = completed === true ? 'TASK_COMPLETED' : 'TASK_UPDATED';
        await client.query('INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, typeType, JSON.stringify({ itemId: req.params.taskId, title: title || '' })]
        );

        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (err) { await client.query('ROLLBACK'); res.status(500).json({ error: err.message }); }
    finally { client.release(); }
});


// DELETE /api/contexts/:id/tasks/:taskId
router.delete('/:id/tasks/:taskId', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Not an active member' }); }
        await client.query('INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'TASK_DELETED', JSON.stringify({ itemId: req.params.taskId })]
        );
        await client.query('DELETE FROM tasks WHERE id = $1 AND context_id = $2', [req.params.taskId, req.params.id]);
        await client.query('COMMIT');
        res.json({ message: 'Task deleted' });
    } catch (err) { await client.query('ROLLBACK'); res.status(500).json({ error: err.message }); }
    finally { client.release(); }
});

// ─── Files ───────────────────────────────────────────────────────────────────

// GET /api/contexts/:id/files
router.get('/:id/files', auth, async (req, res) => {
    try {
        const memCheck = await db.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) return res.status(403).json({ error: 'Not an active member' });
        const result = await db.query('SELECT * FROM files WHERE context_id = $1 ORDER BY created_at DESC', [req.params.id]);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/contexts/:id/files
router.post('/:id/files', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { name, size, url } = req.body;

        console.log("Creating file in context:", req.params.id);
        console.log("Body:", req.body);
        console.log("User:", req.user.id);

        const memCheck = await client.query(
            "SELECT * FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Not an active member' });
        }

        const result = await client.query(
            'INSERT INTO files (context_id, name, size, url) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.params.id, name, size || 0, url || '']
        );

        await client.query(
            'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'FILE_UPLOADED', JSON.stringify({ itemId: result.rows[0].id, title: name })]
        );

        await client.query('COMMIT');
        return res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("File creation error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// DELETE /api/contexts/:id/files/:fileId
router.delete('/:id/files/:fileId', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Not an active member' }); }
        await client.query('INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'FILE_DELETED', JSON.stringify({ itemId: req.params.fileId })]
        );
        await client.query('DELETE FROM files WHERE id = $1 AND context_id = $2', [req.params.fileId, req.params.id]);
        await client.query('COMMIT');
        res.json({ message: 'File deleted' });
    } catch (err) { await client.query('ROLLBACK'); res.status(500).json({ error: err.message }); }
    finally { client.release(); }
});


// ─── Activity feed and stats per context ────────────────────────────────────────────────

// GET /api/contexts/:id/activity-stats
router.get('/:id/activity-stats', auth, async (req, res) => {
    try {
        const memCheck = await db.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) return res.status(403).json({ error: 'Not an active member' });

        const result = await db.query(
            `SELECT DATE(created_at) as date, COUNT(*)::int as count
             FROM activity_logs
             WHERE context_id = $1
             GROUP BY DATE(created_at)
             ORDER BY DATE(created_at)`,
            [req.params.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/contexts/:id/activity
router.get('/:id/activity', auth, async (req, res) => {
    try {
        const memCheck = await db.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) return res.status(403).json({ error: 'Not an active member' });

        const result = await db.query(
            `SELECT al.id, al.type, al.metadata, al.created_at, u.email as user_email
             FROM activity_logs al
             JOIN users u ON al.user_id = u.id
             WHERE al.context_id = $1
             ORDER BY al.created_at DESC`,
            [req.params.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/contexts/:id/members/:userId/approve (host only)
router.post('/:id/members/:userId/approve', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0 || memCheck.rows[0].role !== 'host') {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Only hosts can approve members' });
        }

        const ctxRes = await client.query('SELECT name FROM contexts WHERE id = $1', [req.params.id]);
        const contextName = ctxRes.rows[0]?.name || 'this context';

        await client.query(
            "UPDATE context_members SET status = 'active' WHERE context_id = $1 AND user_id = $2 AND status = 'pending'",
            [req.params.id, req.params.userId]
        );

        await client.query(
            'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'MEMBER_APPROVED', JSON.stringify({ approved_user_id: req.params.userId })]
        );

        await createNotification(client, {
            userId: req.params.userId,
            type: 'MEMBER_APPROVED',
            message: `Your request to join "${contextName}" was approved`,
            contextId: req.params.id,
            metadata: { context_name: contextName }
        });

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// POST /api/contexts/:id/members/invite — delegates to main invite logic
router.post('/:id/members/invite', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { email } = req.body;
        console.log("Invite called by:", req.user.id);
        if (!email) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Email is required' }); }

        const inviterMem = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (inviterMem.rows.length === 0) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Only active members can invite others' }); }
        const inviterRole = inviterMem.rows[0].role;

        const inviterRes = await client.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
        const actorEmail = inviterRes.rows[0].email;

        const userRes = await client.query('SELECT id, email FROM users WHERE email = $1', [email]);
        if (userRes.rows.length === 0) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'User not found' }); }
        const targetUser = userRes.rows[0];

        if (targetUser.id === req.user.id) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'You cannot invite yourself' }); }

        const existingMem = await client.query('SELECT status FROM context_members WHERE context_id = $1 AND user_id = $2', [req.params.id, targetUser.id]);
        if (existingMem.rows.length > 0) { await client.query('ROLLBACK'); return res.status(400).json({ error: `User is already ${existingMem.rows[0].status === 'active' ? 'a member' : 'pending approval'}` }); }

        const ctxRes = await client.query('SELECT name FROM contexts WHERE id = $1', [req.params.id]);
        const contextName = ctxRes.rows[0]?.name || 'this context';

        if (inviterRole === 'host') {
            await client.query("INSERT INTO context_members (context_id, user_id, role, status, added_by) VALUES ($1, $2, 'viewer', 'active', $3) ON CONFLICT (context_id, user_id) DO UPDATE SET status = 'active'", [req.params.id, targetUser.id, req.user.id]);
            await client.query('INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)', [req.params.id, req.user.id, 'MEMBER_ADDED', JSON.stringify({ actor_email: actorEmail, target_email: targetUser.email })]);
            await createNotification(client, { userId: targetUser.id, type: 'MEMBER_ADDED', message: `You were added to "${contextName}" by ${actorEmail}`, contextId: req.params.id, metadata: { actor_email: actorEmail, context_name: contextName } });
            await client.query('COMMIT');
            return res.json({ success: true, pending: false });
        } else {
            const memRes = await client.query("INSERT INTO context_members (context_id, user_id, role, status, added_by) VALUES ($1, $2, 'viewer', 'pending', $3) RETURNING id", [req.params.id, targetUser.id, req.user.id]);
            const membershipId = memRes.rows[0].id;
            await client.query('INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)', [req.params.id, req.user.id, 'MEMBER_REQUESTED', JSON.stringify({ actor_email: actorEmail, target_email: targetUser.email })]);
            const hostRows = await client.query("SELECT user_id FROM context_members WHERE context_id = $1 AND role = 'host' AND status = 'active'", [req.params.id]);
            for (const host of hostRows.rows) {
                await createNotification(client, { userId: host.user_id, type: 'MEMBER_REQUEST', message: `${actorEmail} requested to add ${targetUser.email} to "${contextName}"`, contextId: req.params.id, metadata: { membership_id: membershipId, actor_email: actorEmail, target_email: targetUser.email, context_name: contextName } });
            }
            await client.query('COMMIT');
            return res.json({ success: true, pending: true });
        }
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// POST /api/contexts/:id/members/transfer-host — host-only atomic swap
router.post('/:id/members/transfer-host', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { targetUserId } = req.body;
        if (!targetUserId) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'targetUserId is required' }); }

        // Verify requester is host
        const hostCheck = await client.query(
            "SELECT id FROM context_members WHERE context_id = $1 AND user_id = $2 AND role = 'host' AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (hostCheck.rows.length === 0) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Only the host can transfer host role' }); }

        // Verify target is an active member
        const targetCheck = await client.query(
            "SELECT id FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, targetUserId]
        );
        if (targetCheck.rows.length === 0) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Target user is not an active member' }); }

        const ctxRes = await client.query('SELECT name FROM contexts WHERE id = $1', [req.params.id]);
        const contextName = ctxRes.rows[0]?.name || 'this context';

        // Atomic swap inside transaction
        await client.query("UPDATE context_members SET role = 'editor' WHERE context_id = $1 AND user_id = $2 AND role = 'host'", [req.params.id, req.user.id]);
        await client.query("UPDATE context_members SET role = 'host' WHERE context_id = $1 AND user_id = $2", [req.params.id, targetUserId]);

        await client.query(
            'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'HOST_TRANSFERRED', JSON.stringify({ from_user_id: req.user.id, to_user_id: targetUserId })]
        );
        await createNotification(client, {
            userId: targetUserId,
            type: 'HOST_TRANSFERRED',
            message: `You are now host of "${contextName}"`,
            contextId: req.params.id,
            metadata: { context_name: contextName }
        });

        await client.query('COMMIT');
        res.json({ message: 'Host role transferred successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});



// GET /api/contexts/:id/deadlines
router.get('/:id/deadlines', auth, async (req, res) => {
    try {
        const result = await db.query(
            "SELECT d.* FROM deadlines d JOIN context_members cm ON d.context_id = cm.context_id WHERE d.context_id = $1 AND cm.user_id = $2 AND cm.status = 'active' ORDER BY due_at ASC",
            [req.params.id, req.user.id]
        );
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/contexts/:id/deadlines
router.post(['/:id/deadlines', '/:id/events'], auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { title, due_at } = req.body;

        console.log("Creating deadline in context:", req.params.id);
        console.log("Body:", req.body);
        console.log("User:", req.user.id);

        const memCheck = await client.query(
            "SELECT * FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Not an active member' });
        }

        const result = await client.query(
            'INSERT INTO deadlines (context_id, title, due_at) VALUES ($1, $2, $3) RETURNING *',
            [req.params.id, title || 'New Event', due_at]
        );

        await client.query(
            'INSERT INTO activity_logs (user_id, context_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.user.id, req.params.id, 'EVENT_CREATED', JSON.stringify({ title: result.rows[0].title })]
        );

        await client.query('COMMIT');
        return res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Deadline creation error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// DELETE /api/contexts/:id/deadlines/:deadlineId
router.delete('/:id/deadlines/:deadlineId', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Not an active member' }); }
        await client.query('INSERT INTO activity_logs (user_id, context_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.user.id, req.params.id, 'EVENT_DELETED', JSON.stringify({ itemId: req.params.deadlineId })]
        );
        await client.query('DELETE FROM deadlines WHERE id = $1 AND context_id = $2', [req.params.deadlineId, req.params.id]);
        await client.query('COMMIT');
        res.json({ message: 'Deadline deleted' });
    } catch (err) { await client.query('ROLLBACK'); res.status(500).json({ error: err.message }); }
    finally { client.release(); }
});

// ─── Tags ────────────────────────────────────────────────────────────────────

// GET /api/contexts/:id/tags
router.get('/:id/tags', auth, async (req, res) => {
    try {
        const memCheck = await db.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) return res.status(403).json({ error: 'Not an active member' });

        const result = await db.query('SELECT * FROM tags WHERE context_id = $1 ORDER BY created_at ASC', [req.params.id]);

        const itemTagsRes = await db.query(`
            SELECT it.* FROM item_tags it
            JOIN tags t ON it.tag_id = t.id
            WHERE t.context_id = $1
        `, [req.params.id]);

        res.json({ tags: result.rows, itemTags: itemTagsRes.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/contexts/:id/tags
router.post('/:id/tags', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { name } = req.body;
        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Not an active member' }); }

        const result = await client.query(
            'INSERT INTO tags (name, context_id) VALUES ($1, $2) RETURNING *',
            [name, req.params.id]
        );

        await client.query('INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'TAG_CREATED', JSON.stringify({ tag_id: result.rows[0].id, name })]
        );
        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (err) { await client.query('ROLLBACK'); res.status(500).json({ error: err.message }); }
    finally { client.release(); }
});

// POST /api/contexts/:id/items/:itemId/tags
router.post('/:id/items/:itemId/tags', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { tag_id, item_type } = req.body;
        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Not an active member' }); }

        const result = await client.query(
            'INSERT INTO item_tags (item_id, item_type, tag_id) VALUES ($1, $2, $3) RETURNING *',
            [req.params.itemId, item_type, tag_id]
        );

        await client.query('INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'TAG_ATTACHED', JSON.stringify({ item_id: req.params.itemId, item_type, tag_id })]
        );
        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (err) { await client.query('ROLLBACK'); res.status(500).json({ error: err.message }); }
    finally { client.release(); }
});

// DELETE /api/contexts/:id/items/:itemId/tags/:tagId
router.delete('/:id/items/:itemId/tags/:tagId', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Not an active member' }); }

        await client.query(
            'DELETE FROM item_tags WHERE item_id = $1 AND tag_id = $2 AND item_type = $3',
            [req.params.itemId, req.params.tagId, req.query.item_type || req.body.item_type]
        );

        await client.query('INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'TAG_REMOVED', JSON.stringify({ item_id: req.params.itemId, tag_id: req.params.tagId })]
        );
        await client.query('COMMIT');
        res.json({ message: 'Tag removed' });
    } catch (err) { await client.query('ROLLBACK'); res.status(500).json({ error: err.message }); }
    finally { client.release(); }
});

// ─── Chat ────────────────────────────────────────────────────────────────────

// GET /api/contexts/:id/messages
router.get('/:id/messages', auth, async (req, res) => {
    try {
        const memCheck = await db.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) return res.status(403).json({ error: 'Not an active member' });

        const result = await db.query(`
            SELECT m.id, m.content, m.created_at, u.email as user_name, u.id as user_id 
            FROM context_messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.context_id = $1
            ORDER BY m.created_at ASC
        `, [req.params.id]);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/contexts/:id/messages
router.post('/:id/messages', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { content } = req.body;
        const memCheck = await client.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'Not an active member' }); }

        const result = await client.query(
            'INSERT INTO context_messages (context_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
            [req.params.id, req.user.id, content]
        );

        await client.query('INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [req.params.id, req.user.id, 'MESSAGE_SENT', JSON.stringify({ message_id: result.rows[0].id })]
        );
        await client.query('COMMIT');

        // Return full info
        const msgRes = await client.query(`
            SELECT m.id, m.content, m.created_at, u.email as user_name, u.id as user_id 
            FROM context_messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.id = $1
        `, [result.rows[0].id]);

        res.status(201).json(msgRes.rows[0]);
    } catch (err) { await client.query('ROLLBACK'); res.status(500).json({ error: err.message }); }
    finally { client.release(); }
});

// ─── Structure Network Stats ──────────────────────────────────────────────────

// GET /api/contexts/:id/structure-stats
router.get('/:id/structure-stats', auth, async (req, res) => {
    try {
        const memCheck = await db.query(
            "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );
        if (memCheck.rows.length === 0) return res.status(403).json({ error: 'Not an active member' });

        const notesRes = await db.query('SELECT COUNT(*) FROM notes WHERE context_id = $1', [req.params.id]);
        const tasksRes = await db.query('SELECT COUNT(*) FROM tasks WHERE context_id = $1', [req.params.id]);
        const filesRes = await db.query('SELECT COUNT(*) FROM files WHERE context_id = $1', [req.params.id]);
        const membersRes = await db.query(`SELECT COUNT(*) FROM context_members WHERE context_id = $1 AND status = 'active'`, [req.params.id]);

        // goals not fully implemented in schema yet based on earlier context, will set to 0 safely.

        res.json({
            notes: parseInt(notesRes.rows[0].count, 10),
            tasks: parseInt(tasksRes.rows[0].count, 10),
            files: parseInt(filesRes.rows[0].count, 10),
            members: parseInt(membersRes.rows[0].count, 10),
            goals: 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
