const db = require('./db'); 
db.query(`SELECT event_object_table, trigger_name, action_statement FROM information_schema.triggers WHERE event_object_table IN ('activity_logs', 'contexts', 'context_members');`).then(res => console.log(JSON.stringify(res.rows, null, 2))).catch(console.error).finally(() => process.exit());
