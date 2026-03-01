const db = require('./db');

async function migrate() {
    try {
        console.log("Starting Phase 14 Migration: Activity Schema Hardening...");

        await db.query('BEGIN');

        // 1. Rename column 'action' to 'action_type'
        console.log("Renaming 'action' to 'action_type' in activity_logs...");
        await db.query('ALTER TABLE activity_logs RENAME COLUMN action TO action_type');

        // 2. Add 'metadata' column (JSONB)
        console.log("Adding 'metadata' column to activity_logs...");
        await db.query('ALTER TABLE activity_logs ADD COLUMN metadata JSONB DEFAULT \'{}\'');

        // 3. Update existing rows if any - set action_type or migrate data
        // For now, we keep the existing string in action_type, but new logs will use types

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
