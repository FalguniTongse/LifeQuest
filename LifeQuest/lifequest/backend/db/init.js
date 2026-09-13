require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

async function initializeDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is missing');
    }

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initializeDatabase();