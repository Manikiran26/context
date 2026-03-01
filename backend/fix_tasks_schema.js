const db = require('./db');

async function migrate() {
    try {
        console.log("Fixing tasks table schema...");
        await db.query('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS title VARCHAR(255)');
        await db.query("UPDATE tasks SET title = SUBSTRING(content FROM 1 FOR 50) WHERE title IS NULL");
        // Also ensure title is NOT NULL if that's what's expected, but let's keep it nullable if no default.
        // Actually, the code uses title || content, so let's make it nullable but allowed.
        console.log("Tasks table schema fixed.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
