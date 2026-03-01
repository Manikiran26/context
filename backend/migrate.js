const db = require('./db');

async function run() {
    try {
        console.log("Creating tasks table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS tasks (
              id SERIAL PRIMARY KEY,
              context_id INTEGER REFERENCES contexts(id) ON DELETE CASCADE,
              content TEXT NOT NULL,
              completed BOOLEAN DEFAULT false,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tasks table created.");

        console.log("Adding size column to files table if it doesn't exist...");
        await db.query(`
            ALTER TABLE files ADD COLUMN IF NOT EXISTS size INTEGER DEFAULT 0;
        `);
        console.log("Files table updated.");
    } catch (e) {
        console.error("Migration error:", e);
    } finally {
        process.exit();
    }
}

run();
