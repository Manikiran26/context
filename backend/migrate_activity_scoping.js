const db = require('./db');

async function migrate() {
    try {
        console.log("Starting Phase 13 Migration: Activity Scoping...");

        // 1. Delete orphaned activity rows
        console.log("Deleting orphaned activity rows (missing context_id)...");
        const deleteRes = await db.query('DELETE FROM activity_logs WHERE context_id IS NULL');
        console.log(`Deleted ${deleteRes.rowCount} orphaned rows.`);

        // 2. Add NOT NULL constraint and Foreign Key
        console.log("Applying NOT NULL and FOREIGN KEY constraints to activity_logs...");
        await db.query('BEGIN');

        // Ensure all rows are valid (though we just deleted NULLs, let's be safe)
        // If there are context_ids that don't exist in contexts table, delete them too
        await db.query('DELETE FROM activity_logs WHERE context_id NOT IN (SELECT id FROM contexts)');

        await db.query('ALTER TABLE activity_logs ALTER COLUMN context_id SET NOT NULL');

        // Remove existing FK if it's SET NULL
        try {
            await db.query('ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_context_id_fkey');
        } catch (e) {
            console.log("No existing constraint to drop or error dropping it.");
        }

        await db.query(`
            ALTER TABLE activity_logs 
            ADD CONSTRAINT activity_logs_context_id_fkey 
            FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE
        `);

        // 4. Add status column to context_members
        console.log("Adding status column to context_members...");
        try {
            await db.query("ALTER TABLE context_members ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'");
        } catch (e) {
            console.log("Error adding status column (might already exist):", e.message);
        }

        // 5. Add Indexes
        console.log("Adding indexes to activity_logs...");
        await db.query('CREATE INDEX IF NOT EXISTS idx_activity_logs_context_id ON activity_logs(context_id)');
        await db.query('CREATE INDEX IF NOT EXISTS idx_activity_logs_context_created_desc ON activity_logs(context_id, created_at DESC)');

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
