const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/timeline?contextId=<id>
router.get('/', auth, async (req, res) => {
    try {
        const { contextId } = req.query;
        const userId = req.user.id;

        let query;
        let params;

        if (contextId) {
            // Validate active membership for scoped queries
            const memCheck = await db.query(
                "SELECT role FROM context_members WHERE context_id = $1 AND user_id = $2 AND status = 'active'",
                [contextId, userId]
            );
            if (memCheck.rows.length === 0) {
                return res.status(403).json({ error: 'Not an active member of this context' });
            }

            query = `
                SELECT a.id, a.action_type, a.metadata, a.created_at, c.name as context_name
                FROM activity_logs a
                LEFT JOIN contexts c ON a.context_id = c.id
                WHERE a.context_id = $1
                ORDER BY a.created_at DESC
                LIMIT 50
            `;
            params = [contextId];
        } else {
            // Global timeline: only logs from contexts the user is an active member of
            query = `
                SELECT a.id, a.action_type, a.metadata, a.created_at, c.name as context_name
                FROM activity_logs a
                JOIN context_members cm ON cm.context_id = a.context_id
                JOIN contexts c ON a.context_id = c.id
                WHERE cm.user_id = $1
                AND cm.status = 'active'
                ORDER BY a.created_at DESC
                LIMIT 50
            `;
            params = [userId];
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
