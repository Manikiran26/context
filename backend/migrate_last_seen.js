const db = require('./db');

async function migrate() {
    try {
        console.log('Adding last_seen column to users table...');
        await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP;');
        
        // Also ensure member_requests and notifications tables exist if missing from schema.sql
        console.log('Ensuring member_requests table exists...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS member_requests (
                id SERIAL PRIMARY KEY,
                context_id INTEGER REFERENCES contexts(id) ON DELETE CASCADE,
                requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                target_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Ensuring notifications table exists...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                type VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT false,
                related_request_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
