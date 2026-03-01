const db = require('./db');

async function run() {
  // Create tasks table if it doesn't exist
  await db.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      context_id INTEGER NOT NULL REFERENCES contexts(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('tasks table ready.');

  // Create index for tasks
  await db.query('CREATE INDEX IF NOT EXISTS idx_tasks_context_id ON tasks(context_id)');
  console.log('idx_tasks_context_id ready.');

  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });
