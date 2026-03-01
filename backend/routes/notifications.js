const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/notifications
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, user_id, type, context_id, metadata, is_read AS "isRead", created_at AS "createdAt"
             FROM notifications 
             WHERE user_id = $1 
             ORDER BY created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        const result = await db.query(
            `UPDATE notifications 
             SET is_read = true 
             WHERE id = $1 AND user_id = $2 
             RETURNING id, is_read`,
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found or unauthorized' });
        }

        res.json({ message: 'Notification marked as read', notification: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
