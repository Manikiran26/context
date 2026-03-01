const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const query = req.query.q;
        const type = req.query.type || 'all';

        if (!query) {
            return res.status(400).json({ error: 'Search query (q) is required' });
        }

        const validTypes = ['all', 'notes', 'tasks', 'files', 'deadlines'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid search type' });
        }

        const userId = req.user.id;
        const safeQuery = `%${query}%`;

        let queries = [];

        if (type === 'all' || type === 'notes') {
            queries.push(`
                SELECT n.id, n.context_id, 'note' AS item_type, n.title, n.created_at
                FROM notes n
                JOIN context_members cm ON cm.context_id = n.context_id
                WHERE cm.user_id = $1
                AND cm.status = 'active'
                AND n.title ILIKE $2
            `);
        }

        if (type === 'all' || type === 'tasks') {
            queries.push(`
                SELECT t.id, t.context_id, 'task' AS item_type, t.title, t.created_at
                FROM tasks t
                JOIN context_members cm ON cm.context_id = t.context_id
                WHERE cm.user_id = $1
                AND cm.status = 'active'
                AND (t.title ILIKE $2 OR t.content ILIKE $2)
            `);
        }

        if (type === 'all' || type === 'files') {
            queries.push(`
                SELECT f.id, f.context_id, 'file' AS item_type, f.name AS title, f.created_at
                FROM files f
                JOIN context_members cm ON cm.context_id = f.context_id
                WHERE cm.user_id = $1
                AND cm.status = 'active'
                AND f.name ILIKE $2
            `);
        }

        if (type === 'all' || type === 'deadlines') {
            queries.push(`
                SELECT d.id, d.context_id, 'deadline' AS item_type, d.title, d.created_at
                FROM deadlines d
                JOIN context_members cm ON cm.context_id = d.context_id
                WHERE cm.user_id = $1
                AND cm.status = 'active'
                AND d.title ILIKE $2
            `);
        }

        const fullQuery = queries.map(q => `(${q})`).join(' UNION ALL ') + ' ORDER BY created_at DESC';

        const result = await db.query(fullQuery, [userId, safeQuery]);

        res.json(result.rows);
    } catch (err) {
        console.error('Smart Search Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
