const db = require('./db');

async function run() {
  console.log('Step 4: Fixing membership status...');
  const r1 = await db.query("UPDATE context_members SET status = 'active' WHERE status IS NULL");
  console.log('Rows updated:', r1.rowCount);

  await db.query("ALTER TABLE context_members ALTER COLUMN status SET NOT NULL");
  console.log('context_members.status is now NOT NULL.');

  await db.query("ALTER TABLE context_members ALTER COLUMN status SET DEFAULT 'active'");
  console.log('context_members.status DEFAULT set to active.');

  const nullRows = await db.query('DELETE FROM activity_logs WHERE context_id IS NULL RETURNING id');
  console.log('Removed NULL context_id rows:', nullRows.rowCount);

  try {
    await db.query('ALTER TABLE activity_logs ALTER COLUMN context_id SET NOT NULL');
    console.log('activity_logs.context_id is now NOT NULL.');
  } catch (e) {
    console.log('Note:', e.message);
  }

  try {
    await db.query('ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_context_id_fkey');
    await db.query('ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_context_id_fkey FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE');
    console.log('FK ON DELETE CASCADE applied.');
  } catch (e) {
    console.log('FK note:', e.message);
  }

  console.log('Migration complete!');
  process.exit(0);
}

run().catch(e => { console.error('Migration failed:', e.message); process.exit(1); });
