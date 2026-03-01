const db = require('./db');
const pool = db.pool;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Starting Phase 2 Migration...");

    // 1. Users - add last_seen
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);

    // 2. Context Members - ensure all columns exist
    await client.query(`
      ALTER TABLE context_members
      ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'viewer',
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS added_by INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);

    // 3. Files - add size
    await client.query(`
      ALTER TABLE files
      ADD COLUMN IF NOT EXISTS size INTEGER DEFAULT 0
    `);

    // 4. Update existing owner if missing
    // We assume the creator in context_members should be owner if not set
    await client.query(`
      UPDATE context_members 
      SET role = 'owner', status = 'active'
      WHERE role IS NULL OR role = ''
    `);

    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
