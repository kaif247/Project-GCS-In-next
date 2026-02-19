const getEnv = (key, fallback) => process.env[key] ?? fallback;

const config = {
  port: Number(getEnv('PORT', '4000')),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  frontendUrl: getEnv('FRONTEND_URL', 'http://localhost:3000'),
  databaseUrl: getEnv('DATABASE_URL', ''),
  jwtSecret: getEnv('JWT_SECRET', 'dev-secret-change-me'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '15m'),
  refreshTtlDays: Number(getEnv('REFRESH_TTL_DAYS', '30')),
};

module.exports = config;
