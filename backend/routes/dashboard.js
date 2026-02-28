const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const ctxRes = await db.query('SELECT COUNT(*) FROM contexts WHERE user_id = $1', [userId]);
        const activeContexts = parseInt(ctxRes.rows[0].count, 10);

        const actRes = await db.query(
            "SELECT COUNT(*) FROM activity_logs WHERE user_id = $1 AND created_at > NOW() - INTERVAL '24 hours'",
            [userId]
        );
        const recentActivity = parseInt(actRes.rows[0].count, 10);

        const globalStats = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM notes n JOIN contexts c ON n.context_id = c.id WHERE c.user_id = $1) as notes_count,
                (SELECT COUNT(*) FROM files f JOIN contexts c ON f.context_id = c.id WHERE c.user_id = $1) as files_count,
                (SELECT COUNT(*) FROM deadlines d JOIN contexts c ON d.context_id = c.id WHERE c.user_id = $1) as dl_count
        `, [userId]);

        const nC = parseInt(globalStats.rows[0].notes_count, 10) || 0;
        const fC = parseInt(globalStats.rows[0].files_count, 10) || 0;
        const dC = parseInt(globalStats.rows[0].dl_count, 10) || 0;

        let intelligenceScore = (activeContexts * 50) + (nC * 10) + (fC * 15) + (dC * 20) + (recentActivity * 5);
        if (intelligenceScore > 1000) intelligenceScore = 1000;

        res.json({
            activeContexts,
            intelligenceScore,
            recentActivity
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
