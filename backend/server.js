require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const contextRoutes = require('./routes/contexts');
const dashboardRoutes = require('./routes/dashboard');
const searchRoutes = require('./routes/search');
const timelineRoutes = require('./routes/timeline');
const systemRoutes = require('./routes/system');
const memberRequestRoutes = require('./routes/memberRequests');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/contexts', contextRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/member-requests', memberRequestRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, async () => {
    try {
        const db = require('./db');
        await db.query('SELECT 1'); // Verify DB connection
        console.log(`Server running on port ${PORT}. Database connected successfully.`);
    } catch (err) {
        console.error('Failed to connect to database:', err.message);
    }
});
