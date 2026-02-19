const { Pool } = require('pg');
const config = require('../config/env');

if (!config.databaseUrl) {
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL is not set. Backend will not connect to Postgres.');
}

const pool = new Pool({
  connectionString: config.databaseUrl || undefined,
});

module.exports = pool;
