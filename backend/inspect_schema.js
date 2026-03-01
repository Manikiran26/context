const db = require('./db');

async function check() {
    try {
        const tables = ['tasks', 'notes', 'files', 'deadlines', 'activity_logs', 'contexts'];
        for (const table of tables) {
            console.log(`Checking table: ${table}`);
            const res = await db.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [table]);
            console.log(res.rows.map(r => `${r.column_name}: ${r.data_type}`).join(', '));
            console.log('---');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
