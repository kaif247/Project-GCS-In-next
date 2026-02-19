const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `select p.id, p.content, p.media_url, p.created_at,
        u.username, u.avatar_url,
        (select count(*) from comments c where c.post_id = p.id) as comments_count,
        (select count(*) from reactions r where r.post_id = p.id) as reactions_count
       from posts p
       join users u on u.id = p.user_id
       order by p.created_at desc
       limit 50`
    );
    return res.json({ posts: result.rows });
  } catch (err) {
    return next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { content, mediaUrl } = req.body || {};
    if (!content) return res.status(400).json({ error: 'Content required' });
    const result = await pool.query(
      'insert into posts (user_id, content, media_url) values ($1, $2, $3) returning id, content, media_url, created_at',
      [req.user.sub, content, mediaUrl || null]
    );
    return res.status(201).json({ post: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      `select p.id, p.content, p.media_url, p.created_at,
        u.username, u.avatar_url
       from posts p
       join users u on u.id = p.user_id
       where p.id = $1`,
      [req.params.id]
    );
    const post = result.rows[0];
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.json({ post });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id/comments', async (req, res, next) => {
  try {
    const result = await pool.query(
      `select c.id, c.text, c.created_at, u.username, u.avatar_url
       from comments c
       join users u on u.id = c.user_id
       where c.post_id = $1
       order by c.created_at asc`,
      [req.params.id]
    );
    return res.json({ comments: result.rows });
  } catch (err) {
    return next(err);
  }
});

router.post('/:id/comments', requireAuth, async (req, res, next) => {
  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Text required' });
    const result = await pool.query(
      'insert into comments (post_id, user_id, text) values ($1, $2, $3) returning id, text, created_at',
      [req.params.id, req.user.sub, text]
    );
    return res.status(201).json({ comment: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
