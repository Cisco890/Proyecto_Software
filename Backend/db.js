const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Verify connection
pool.connect((err) => {
  if (err) {
    console.error('Error de conexión a DB:', err.stack);
  } else {
    console.log('Conectado a PostgreSQL');
  }
});

module.exports = pool;