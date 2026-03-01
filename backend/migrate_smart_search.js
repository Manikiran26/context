const db = require('./db');

async function migrate() {
    let client;
    try {
        client = await db.getClient();
        await client.query('BEGIN');
        
        console.log("Enabling pg_trgm extension if not exists...");
        await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

        console.log("Creating standard indexes...");
        const standardIndexes = [
            'CREATE INDEX IF NOT EXISTS idx_notes_context_id ON notes(context_id);',
            'CREATE INDEX IF NOT EXISTS idx_tasks_context_id ON tasks(context_id);',
            'CREATE INDEX IF NOT EXISTS idx_files_context_id ON files(context_id);',
            'CREATE INDEX IF NOT EXISTS idx_deadlines_context_id ON deadlines(context_id);',
            'CREATE INDEX IF NOT EXISTS idx_context_members_user_context ON context_members(user_id, context_id);'
        ];

        for (const query of standardIndexes) {
            await client.query(query);
            console.log(`Executed: ${query}`);
        }

        console.log("Creating trigram gin indexes for faster search...");
        const ginIndexes = [
            'CREATE INDEX IF NOT EXISTS idx_notes_title ON notes USING gin (title gin_trgm_ops);',
            'CREATE INDEX IF NOT EXISTS idx_tasks_content ON tasks USING gin (content gin_trgm_ops);',
            'CREATE INDEX IF NOT EXISTS idx_files_name ON files USING gin (name gin_trgm_ops);',
            'CREATE INDEX IF NOT EXISTS idx_deadlines_title ON deadlines USING gin (title gin_trgm_ops);'
        ];

        for (const query of ginIndexes) {
            await client.query(query);
            console.log(`Executed: ${query}`);
        }

        await client.query('COMMIT');
        console.log("Smart search migration completed successfully.");
    } catch (err) {
        if (client) await client.query('ROLLBACK');
        console.error("Migration failed:", err);
    } finally {
        if (client) client.release();
        process.exit();
    }
}

migrate();
