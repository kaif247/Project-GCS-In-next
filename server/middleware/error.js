const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (res.headersSent) return next(err);
  return res.status(500).json({ error: 'Server error' });
};

module.exports = errorHandler;
