const db = require('./db');

async function migrate() {
    try {
        console.log("Starting Phase 5 Migration: Secure Membership...");

        await db.query('BEGIN');

        // 1. Add added_by to context_members
        console.log("Adding 'added_by' column to context_members...");
        await db.query(`
            ALTER TABLE context_members 
            ADD COLUMN IF NOT EXISTS added_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
        `);

        // 2. Ensure notifications table has correct structure
        console.log("Ensuring 'notifications' table structure...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                type VARCHAR(50) NOT NULL,
                context_id INTEGER REFERENCES contexts(id) ON DELETE CASCADE,
                metadata JSONB DEFAULT '{}',
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Check columns for notifications if it already existed
        await db.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'`);
        await db.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS context_id INTEGER REFERENCES contexts(id) ON DELETE CASCADE`);

        await db.query('COMMIT');
        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (err) {
        await db.query('ROLLBACK');
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
