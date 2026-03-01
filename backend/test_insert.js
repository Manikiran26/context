const db = require('./db');
async function test() {
    let client;
    try {
        client = await db.getClient();
        await client.query('BEGIN');
        console.log("Inserting activity logs...");
        await client.query(
            'INSERT INTO activity_logs (user_id, context_id, type, metadata) VALUES ($1, $2, $3, $4)',
            [3, 1, 'TEST_LOG', JSON.stringify({ name: 'test' })]
        );
        console.log("Inserted!");
        await client.query('ROLLBACK');
    } catch (e) {
        console.error("Error is:", e.message);
        if (client) await client.query('ROLLBACK');
    } finally {
        if (client) client.release();
        process.exit();
    }
}
test();
