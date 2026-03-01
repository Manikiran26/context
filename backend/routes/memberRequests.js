const express = require('express');
const db = require('../db');
const { createNotification } = require('../utils/notifications');
const auth = require('../middleware/auth');
const router = express.Router();

// Helper to log activity
const logActivity = async (userId, contextId, type, metadata = {}, client = db) => {
    await client.query(
        'INSERT INTO activity_logs (context_id, user_id, type, metadata) VALUES ($1, $2, $3, $4)',
        [contextId, userId, type, JSON.stringify(metadata)]
    );
};

// POST /api/member-requests/:id/approve
router.post('/:id/approve', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const membershipId = req.params.id;

        // 1. Fetch pending membership details
        const memRes = await client.query(
            'SELECT cm.*, u.email as target_email FROM context_members cm JOIN users u ON cm.user_id = u.id WHERE cm.id = $1',
            [membershipId]
        );

        if (memRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Membership request not found' });
        }

        const member = memRes.rows[0];
        if (member.status !== 'pending') {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Request is not pending' });
        }

        // 2. Validate current user is HOST of that context
        const hostCheck = await client.query(
            "SELECT id FROM context_members WHERE context_id = $1 AND user_id = $2 AND role = 'host' AND status = 'active'",
            [member.context_id, req.user.id]
        );

        if (hostCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Only hosts can approve requests' });
        }

        // 3. Update status to active
        await client.query(
            "UPDATE context_members SET status = 'active' WHERE id = $1",
            [membershipId]
        );

        // 4. Get context name
        const ctxRes = await client.query('SELECT name FROM contexts WHERE id = $1', [member.context_id]);
        const contextName = ctxRes.rows[0]?.name || 'this context';

        // 5. Log Activity
        const actorRes = await client.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
        const actorEmail = actorRes.rows[0].email;

        await logActivity(req.user.id, member.context_id, 'MEMBER_APPROVED', {
            actor_email: actorEmail,
            target_email: member.target_email
        }, client);

        // 6. Notify target user (MEMBER_APPROVED — visible only to target)
        await createNotification(client, {
            userId: member.user_id,
            type: 'MEMBER_APPROVED',
            message: `Your request to join "${contextName}" was approved`,
            contextId: member.context_id,
            metadata: { actor_email: actorEmail, context_name: contextName }
        });

        // 7. Mark original MEMBER_REQUEST notifications as read
        await client.query(
            "UPDATE notifications SET is_read = true WHERE context_id = $1 AND type = 'MEMBER_REQUEST' AND metadata->>'target_email' = $2",
            [member.context_id, member.target_email]
        );

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// POST /api/member-requests/:id/reject
router.post('/:id/reject', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const membershipId = req.params.id;

        const memRes = await client.query(
            'SELECT cm.*, u.email as target_email FROM context_members cm JOIN users u ON cm.user_id = u.id WHERE cm.id = $1',
            [membershipId]
        );

        if (memRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Membership request not found' });
        }
        const member = memRes.rows[0];

        // Verify HOST
        const hostCheck = await client.query(
            "SELECT id FROM context_members WHERE context_id = $1 AND user_id = $2 AND role = 'host' AND status = 'active'",
            [member.context_id, req.user.id]
        );

        if (hostCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Only hosts can reject requests' });
        }

        // Get context name
        const ctxRes = await client.query('SELECT name FROM contexts WHERE id = $1', [member.context_id]);
        const contextName = ctxRes.rows[0]?.name || 'this context';

        // Delete pending row
        await client.query('DELETE FROM context_members WHERE id = $1', [membershipId]);

        // Log Activity
        const actorRes = await client.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
        const actorEmail = actorRes.rows[0].email;

        await logActivity(req.user.id, member.context_id, 'MEMBER_REJECTED', {
            actor_email: actorEmail,
            target_email: member.target_email
        }, client);

        // Notify target user (MEMBER_REJECTED — visible only to target)
        await createNotification(client, {
            userId: member.user_id,
            type: 'MEMBER_REJECTED',
            message: `Your request to join "${contextName}" was rejected`,
            contextId: member.context_id,
            metadata: { target_email: member.target_email, context_name: contextName }
        });

        // Mark original request notification as read
        await client.query(
            "UPDATE notifications SET is_read = true WHERE context_id = $1 AND type = 'MEMBER_REQUEST' AND metadata->>'target_email' = $2",
            [member.context_id, member.target_email]
        );

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

module.exports = router;
