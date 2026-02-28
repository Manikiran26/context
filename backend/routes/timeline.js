const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT a.id, a.action, a.created_at, c.name as context_name
            FROM activity_logs a
            LEFT JOIN contexts c ON a.context_id = c.id
            WHERE a.user_id = $1
            ORDER BY a.created_at DESC
            LIMIT 50
        `, [req.user.id]);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
