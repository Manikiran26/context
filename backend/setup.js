require('dotenv').config();
const db = require('./db');

async function setup() {
    try {
        console.log('Adding last_active and username columns to users table...');
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS username VARCHAR(255);
        `);

        console.log('Backfilling username column...');
        await db.query(`
            UPDATE users SET username = split_part(email, '@', 1) WHERE username IS NULL;
        `);

        console.log('Creating index on users.last_active...');
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active);
        `);

        console.log('Database setup complete.');
        process.exit(0);
    } catch (err) {
        console.error('Database setup failed:', err);
        process.exit(1);
    }
}

setup();
