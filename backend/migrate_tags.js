require('dotenv').config();
const { pool } = require('./db');

(async () => {
    try {
        console.log("Creating tags table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tags (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                context_id INTEGER NOT NULL REFERENCES contexts(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("tags table created.");

        console.log("Creating item_tags table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS item_tags (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                item_id INTEGER NOT NULL,
                item_type TEXT NOT NULL,
                tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE
            );
        `);
        console.log("item_tags table created.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
})();
