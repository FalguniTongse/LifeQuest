// Applies schema.sql to the configured database. Run with: npm run db:init
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

async function init() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  console.log('Applying schema.sql to database...');
  await pool.query(schema);
  console.log('Database schema is up to date.');
  await pool.end();
}

init().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
