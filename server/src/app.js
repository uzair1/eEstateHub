import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { initDb, seedDb } from './db.js';
import authRoutes from './routes/auth.js';
import agentRoutes from './routes/agents.js';
import propertyRoutes from './routes/properties.js';
import miscRoutes from './routes/misc.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', async (_req, res) => {
  try {
    await initDb();
    res.json({ status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV || 'development' });
  } catch {
    res.status(500).json({ status: 'db_error', env: process.env.NODE_ENV || 'development' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api', miscRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

// Initialize DB and seed on startup
initDb()
  .then(() => seedDb())
  .then(() => {
    console.log('Database initialized and seeded');
  })
  .catch((err) => {
    console.error('Database init failed:', err);
  });