const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { query } = req.body;
        const userId = req.user.id;

        if (!query) return res.json({ contexts: [], notes: [], files: [], deadlines: [] });

        const searchPattern = `%${query}%`;

        const ctxRes = await db.query(
            'SELECT * FROM contexts WHERE user_id = $1 AND name ILIKE $2',
            [userId, searchPattern]
        );

        const notesRes = await db.query(
            'SELECT n.* FROM notes n JOIN contexts c ON n.context_id = c.id WHERE c.user_id = $1 AND (n.title ILIKE $2 OR n.content ILIKE $2)',
            [userId, searchPattern]
        );

        const filesRes = await db.query(
            'SELECT f.* FROM files f JOIN contexts c ON f.context_id = c.id WHERE c.user_id = $1 AND f.name ILIKE $2',
            [userId, searchPattern]
        );

        const deadlinesRes = await db.query(
            'SELECT d.* FROM deadlines d JOIN contexts c ON d.context_id = c.id WHERE c.user_id = $1 AND d.title ILIKE $2',
            [userId, searchPattern]
        );

        res.json({
            contexts: ctxRes.rows,
            notes: notesRes.rows,
            files: filesRes.rows,
            deadlines: deadlinesRes.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
