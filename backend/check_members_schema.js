require('dotenv').config();
const { pool } = require('./db');

async function check() {
    const client = await pool.connect();

    const schema = await client.query(
        "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'context_members' ORDER BY ordinal_position"
    );
    console.log('=== context_members schema ===');
    console.log(JSON.stringify(schema.rows, null, 2));

    const sample = await client.query('SELECT role, status, COUNT(*) as cnt FROM context_members GROUP BY role, status');
    console.log('\n=== role/status distribution ===');
    console.log(JSON.stringify(sample.rows, null, 2));

    client.release();
    process.exit(0);
}

check().catch(e => { console.error(e.message); process.exit(1); });
