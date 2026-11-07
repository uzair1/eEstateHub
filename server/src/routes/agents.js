import { Router } from 'express';
import { z } from 'zod';
import { read, update, remove } from '../db.js';
import { asyncHandler } from '../middleware/error.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const agents = read('agents').map((a) => ({
    ...a,
    activeListings: read('properties').filter((p) => p.agentId === a.id && p.status !== 'Sold').length,
  }));
  res.json({ data: agents, count: agents.length });
});

router.get('/:id', (req, res) => {
  const agent = read('agents').find((a) => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  const listings = read('properties').filter((p) => p.agentId === agent.id);
  return res.json({ data: { ...agent, activeListings: listings.filter((p) => p.status !== 'Sold').length, listings } });
});

const agentSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  photo: z.string().url().optional(),
  bio: z.string().min(10),
  specialties: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
});

router.post('/', authRequired, adminOnly, (req, res) => {
  const parsed = agentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
  const record = { ...parsed.data, rating: 0, reviews: 0, listings: 0 };
  const all = read('agents');
  all.push({ id: `ag_${Date.now().toString(36)}`, createdAt: new Date().toISOString(), ...record });
  return res.status(201).json({ data: record });
});

router.put('/:id', authRequired, adminOnly, (req, res) => {
  const agent = update('agents', req.params.id, req.body);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  return res.json({ data: agent });
});

router.delete('/:id', authRequired, adminOnly, asyncHandler((req, res) => {
  const gone = remove('agents', req.params.id);
  if (!gone) return res.status(404).json({ error: 'Agent not found' });
  return res.json({ data: gone });
}));

export default router;