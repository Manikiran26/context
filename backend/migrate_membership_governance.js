require('dotenv').config();
const { pool } = require('./db');

async function migrate() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Rename 'owner' -> 'host'
        const updated = await client.query(
            "UPDATE context_members SET role = 'host' WHERE role = 'owner' RETURNING id"
        );
        console.log(`Updated ${updated.rowCount} rows: owner -> host`);

        // 2. Verify no 'owner' remains
        const check = await client.query(
            "SELECT COUNT(*) as cnt FROM context_members WHERE role = 'owner'"
        );
        if (parseInt(check.rows[0].cnt) > 0) {
            throw new Error('Some owner rows still remain — aborting');
        }

        // 3. Show final distribution
        const dist = await client.query(
            'SELECT role, status, COUNT(*) as cnt FROM context_members GROUP BY role, status ORDER BY role'
        );
        console.log('\nFinal role/status distribution:');
        dist.rows.forEach(r => console.log(`  role=${r.role} status=${r.status} count=${r.cnt}`));

        await client.query('COMMIT');
        console.log('\nMigration complete. No owner rows remain.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Migration FAILED:', err.message);
        process.exit(1);
    } finally {
        client.release();
        process.exit(0);
    }
}

migrate();
