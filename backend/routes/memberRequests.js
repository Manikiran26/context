const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// Helper to log activity
const logActivity = async (userId, contextId, actionType, metadata = {}, client = db) => {
    await client.query(
        'INSERT INTO activity_logs (user_id, context_id, action_type, metadata) VALUES ($1, $2, $3, $4)',
        [userId, contextId, actionType, JSON.stringify(metadata)]
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

        // 2. Validate current user is OWNER of that context
        const ownerCheck = await client.query(
            "SELECT id FROM context_members WHERE context_id = $1 AND user_id = $2 AND role = 'owner' AND status = 'active'",
            [member.context_id, req.user.id]
        );

        if (ownerCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Only active owners can approve requests' });
        }

        // 3. Update status
        await client.query(
            "UPDATE context_members SET status = 'active' WHERE id = $1",
            [membershipId]
        );

        // 4. Log Activity
        const actorRes = await client.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
        const actorEmail = actorRes.rows[0].email;

        await logActivity(req.user.id, member.context_id, 'MEMBER_APPROVED', {
            actor_email: actorEmail,
            target_email: member.target_email
        }, client);

        // 5. Notify target user
        await client.query(
            "INSERT INTO notifications (user_id, type, context_id, metadata) VALUES ($1, 'MEMBER_APPROVED', $2, $3)",
            [member.user_id, member.context_id, JSON.stringify({ message: "Your membership was approved", actor_email: actorEmail })]
        );

        // 6. Mark original notification read
        await client.query(
            "UPDATE notifications SET is_read = true WHERE context_id = $1 AND type = 'MEMBER_REQUEST' AND metadata->>'target_email' = $2",
            [member.context_id, member.target_email]
        );

        await client.query('COMMIT');
        res.json({ message: 'Request approved successfully' });
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

        const ownerCheck = await client.query(
            "SELECT id FROM context_members WHERE context_id = $1 AND user_id = $2 AND role = 'owner' AND status = 'active'",
            [member.context_id, req.user.id]
        );

        if (ownerCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Only active owners can reject requests' });
        }

        // 3. Delete row
        await client.query('DELETE FROM context_members WHERE id = $1', [membershipId]);

        // 4. Log Activity
        const actorRes = await client.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
        const actorEmail = actorRes.rows[0].email;

        await logActivity(req.user.id, member.context_id, 'MEMBER_REJECTED', {
            actor_email: actorEmail,
            target_email: member.target_email
        }, client);

        // 5. Notify requester (added_by)
        await client.query(
            "INSERT INTO notifications (user_id, type, context_id, metadata) VALUES ($1, 'MEMBER_REJECTED', $2, $3)",
            [member.added_by, member.context_id, JSON.stringify({ message: "Membership request rejected", target_email: member.target_email })]
        );

        // 6. Mark notification read
        await client.query(
            "UPDATE notifications SET is_read = true WHERE context_id = $1 AND type = 'MEMBER_REQUEST' AND metadata->>'target_email' = $2",
            [member.context_id, member.target_email]
        );

        await client.query('COMMIT');
        res.json({ message: 'Request rejected successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

module.exports = router;
