const db = require('./db');
db.query("DELETE FROM notifications WHERE related_request_id IS NULL AND type = 'member_request' RETURNING id")
  .then(res => console.log('Deleted notifications:', res.rows.length))
  .catch(console.error)
  .finally(() => process.exit());
