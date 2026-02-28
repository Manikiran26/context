const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
    res.json({
        aiStatus: "active",
        lastAnalyzed: new Date().toISOString()
    });
});

module.exports = router;
