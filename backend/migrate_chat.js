require('dotenv').config();
const { pool } = require('./db');

async function migrate() {
    try {
        console.log("Connecting to the database...");
        const client = await pool.connect();

        console.log("Creating context_messages table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS context_messages (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                context_id INTEGER NOT NULL REFERENCES contexts(id) ON DELETE CASCADE,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log("Migration complete.");
        client.release();
        process.exit(0);
    } catch (err) {
        console.error("Migration failed", err);
        process.exit(1);
    }
}

migrate();
