const db = require('./db'); 
db.query(`SELECT routine_name, routine_definition FROM information_schema.routines WHERE routine_definition ILIKE '%activity_logs%';`)
.then(res => console.log(JSON.stringify(res.rows, null, 2)))
.catch(console.error)
.finally(() => process.exit());
