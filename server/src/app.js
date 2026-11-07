import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { seed } from './data/seedData.js';
import authRoutes from './routes/auth.js';
import agentRoutes from './routes/agents.js';
import propertyRoutes from './routes/properties.js';
import miscRoutes from './routes/misc.js';
import { notFound, errorHandler } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Auto-seed on first boot so the API is never empty (tolerant of read-only FS).
try {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(path.join(dataDir, 'properties.json'))) seed();
} catch {
  seed();
}

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV || 'development' }));
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api', miscRoutes);

// Serve built client if present (single-port / local mode). Not used on Vercel,
// which serves the frontend as static files via its own build.
const clientDist = path.resolve(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use(notFound);
app.use(errorHandler);

export default app;