const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const marketplaceRoutes = require('./routes/marketplace');
const healthRoutes = require('./routes/health');
const errorHandler = require('./middleware/error');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/marketplace', marketplaceRoutes);

app.use(errorHandler);

module.exports = app;
