const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=unitylink
DB_PORT=5432