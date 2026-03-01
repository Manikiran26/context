const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
        req.user = decoded;
        
        // Proactively update last_seen (non-blocking)
        const db = require('../db');
        db.query('UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = $1', [req.user.id]).catch(err => {
            console.error('Failed to update last_seen:', err.message);
        });

        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};
