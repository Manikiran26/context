const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/dashboard
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Count only contexts where user is an ACTIVE member
        const ctxRes = await db.query(
            "SELECT COUNT(*) FROM context_members WHERE user_id = $1 AND status = 'active'",
            [userId]
        );
        const activeContexts = parseInt(ctxRes.rows[0].count, 10);

        // Recent activity: only from contexts user is active in
        const actRes = await db.query(
            `SELECT COUNT(*) FROM activity_logs al
             JOIN context_members cm ON cm.context_id = al.context_id
             WHERE cm.user_id = $1 AND cm.status = 'active'
             AND al.created_at > NOW() - INTERVAL '24 hours'`,
            [userId]
        );
        const recentActivity = parseInt(actRes.rows[0].count, 10);

        // Global stats scoped to active memberships
        const globalStats = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM notes n 
                 JOIN context_members cm ON cm.context_id = n.context_id 
                 WHERE cm.user_id = $1 AND cm.status = 'active') as notes_count,
                (SELECT COUNT(*) FROM files f 
                 JOIN context_members cm ON cm.context_id = f.context_id 
                 WHERE cm.user_id = $1 AND cm.status = 'active') as files_count,
                (SELECT COUNT(*) FROM deadlines d 
                 JOIN context_members cm ON cm.context_id = d.context_id 
                 WHERE cm.user_id = $1 AND cm.status = 'active') as dl_count
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
