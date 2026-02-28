const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// Helper to log activity
const logActivity = async (userId, contextId, action) => {
    await db.query(
        'INSERT INTO activity_logs (user_id, context_id, action) VALUES ($1, $2, $3)',
        [userId, contextId, action]
    );
};

// GET /api/contexts
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM contexts WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/contexts
router.post('/', auth, async (req, res) => {
    try {
        const { name, icon, tag } = req.body;
        const result = await db.query(
            'INSERT INTO contexts (user_id, name, icon, tag) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, name, icon, tag]
        );
        const context = result.rows[0];
        await logActivity(req.user.id, context.id, `Created context: ${name}`);
        res.status(201).json(context);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/contexts/:id
router.get('/:id', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM contexts WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Context not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/contexts/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM contexts WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Context not found' });
        await logActivity(req.user.id, null, `Deleted a context`);
        res.json({ message: 'Context deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/contexts/:id/notes
router.post('/:id/notes', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const ctxCheck = await db.query('SELECT id FROM contexts WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (ctxCheck.rows.length === 0) return res.status(404).json({ error: 'Context not found' });

        const result = await db.query(
            'INSERT INTO notes (context_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [req.params.id, title, content]
        );
        await logActivity(req.user.id, req.params.id, `Created note: ${title}`);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/contexts/:id/notes
router.get('/:id/notes', auth, async (req, res) => {
    try {
        const ctxCheck = await db.query('SELECT id FROM contexts WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (ctxCheck.rows.length === 0) return res.status(404).json({ error: 'Context not found' });

        const result = await db.query('SELECT * FROM notes WHERE context_id = $1 ORDER BY created_at DESC', [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/contexts/:id/intelligence
router.get('/:id/intelligence', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const notesRes = await db.query('SELECT COUNT(*) FROM notes WHERE context_id = $1', [id]);
        const filesRes = await db.query('SELECT COUNT(*) FROM files WHERE context_id = $1', [id]);
        const deadlinesRes = await db.query('SELECT COUNT(*) FROM deadlines WHERE context_id = $1', [id]);
        const activityRes = await db.query(
            "SELECT COUNT(*) FROM activity_logs WHERE context_id = $1 AND created_at > NOW() - INTERVAL '7 days'",
            [id]
        );

        const notesCount = parseInt(notesRes.rows[0].count, 10);
        const filesCount = parseInt(filesRes.rows[0].count, 10);
        const deadlinesCount = parseInt(deadlinesRes.rows[0].count, 10);
        const activityCount = parseInt(activityRes.rows[0].count, 10);

        let baseScore = (notesCount * 10) + (filesCount * 15) + (deadlinesCount * 20) + (activityCount * 5);
        if (baseScore > 1000) baseScore = 1000;

        res.json({ score: baseScore });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/contexts/:id/graph
router.get('/:id/graph', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const ctxRes = await db.query('SELECT * FROM contexts WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (ctxRes.rows.length === 0) return res.status(404).json({ error: 'Context not found' });

        const ctx = ctxRes.rows[0];
        let nodes = [];
        let edges = [];

        nodes.push({
            id: `ctx-${ctx.id}`,
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
                const nodeId = `${typeKey}-${item.id}`;
                nodes.push({ id: nodeId, position: { x: xOffset, y: yOffset }, data: { label: item[labelKey], type: typeKey }, type: 'custom' });
                edges.push({ id: `e-ctx-${nodeId}`, source: `ctx-${ctx.id}`, target: nodeId, animated: true, style: { stroke: '#374151', strokeWidth: 1.5 } });
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

module.exports = router;
