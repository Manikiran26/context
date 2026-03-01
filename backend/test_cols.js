const db = require('./db'); 
db.query("SELECT table_schema, table_name, column_name, data_type FROM information_schema.columns WHERE table_name = 'activity_logs';")
.then(res => console.log(JSON.stringify(res.rows, null, 2)))
.catch(console.error)
.finally(() => process.exit());
