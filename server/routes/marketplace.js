const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/listings', async (req, res, next) => {
  try {
    const result = await pool.query(
      `select l.id, l.title, l.price, l.location, l.description, l.media_url, l.created_at,
        u.username, u.avatar_url
       from listings l
       join users u on u.id = l.seller_id
       order by l.created_at desc`
    );
    return res.json({ listings: result.rows });
  } catch (err) {
    return next(err);
  }
});

router.post('/listings', requireAuth, async (req, res, next) => {
  try {
    const { title, price, location, description, mediaUrl } = req.body || {};
    if (!title || !price) return res.status(400).json({ error: 'Title and price required' });
    const result = await pool.query(
      `insert into listings (seller_id, title, price, location, description, media_url)
       values ($1, $2, $3, $4, $5, $6)
       returning id, title, price, location, description, media_url, created_at`,
      [req.user.sub, title, price, location || null, description || null, mediaUrl || null]
    );
    return res.status(201).json({ listing: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
