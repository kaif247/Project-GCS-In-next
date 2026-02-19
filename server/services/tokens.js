const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/env');

const signAccessToken = (payload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

const generateRefreshToken = () => crypto.randomUUID();

const getRefreshExpiry = () => {
  const expires = new Date();
  expires.setDate(expires.getDate() + config.refreshTtlDays);
  return expires;
};

module.exports = {
  signAccessToken,
  generateRefreshToken,
  getRefreshExpiry,
};
