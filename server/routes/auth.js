const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const { signAccessToken, generateRefreshToken, getRefreshExpiry } = require('../services/tokens');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'insert into users (username, email, password_hash) values ($1, $2, $3) returning id, username, email, avatar_url',
      [username, email, passwordHash]
    );
    const user = result.rows[0];
    const accessToken = signAccessToken({ sub: user.id, username: user.username });
    const refreshToken = generateRefreshToken();
    const expiresAt = getRefreshExpiry();
    await pool.query(
      'insert into sessions (user_id, refresh_token, expires_at) values ($1, $2, $3)',
      [user.id, refreshToken, expiresAt]
    );
    return res.json({ user, accessToken, refreshToken });
  } catch (err) {
    return next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }
    const result = await pool.query(
      'select id, username, email, avatar_url, password_hash from users where username = $1 or email = $1',
      [identifier]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const accessToken = signAccessToken({ sub: user.id, username: user.username });
    const refreshToken = generateRefreshToken();
    const expiresAt = getRefreshExpiry();
    await pool.query(
      'insert into sessions (user_id, refresh_token, expires_at) values ($1, $2, $3)',
      [user.id, refreshToken, expiresAt]
    );
    return res.json({
      user: { id: user.id, username: user.username, email: user.email, avatar_url: user.avatar_url },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });
    const result = await pool.query(
      'select s.id, s.user_id, s.expires_at, u.username from sessions s join users u on u.id = s.user_id where s.refresh_token = $1',
      [refreshToken]
    );
    const session = result.rows[0];
    if (!session) return res.status(401).json({ error: 'Invalid refresh token' });
    if (new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    const accessToken = signAccessToken({ sub: session.user_id, username: session.username });
    return res.json({ accessToken });
  } catch (err) {
    return next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });
    await pool.query('delete from sessions where refresh_token = $1', [refreshToken]);
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      'select id, username, email, avatar_url from users where id = $1',
      [req.user.sub]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
