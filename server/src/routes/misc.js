import { Router } from 'express';
import { z } from 'zod';
import { read, insert, update, remove } from '../db.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = Router();

/* ---------- testimonials ---------- */
router.get('/testimonials', (req, res) => res.json({ data: read('testimonials') }));

/* ---------- services ---------- */
router.get('/services', (req, res) => res.json({ data: read('services') }));

/* ---------- contact messages ---------- */
const messageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default(''),
  subject: z.string().min(2),
  message: z.string().min(10),
  propertyId: z.string().optional(),
});

router.post('/messages', (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
  return res.status(201).json({ data: insert('messages', { ...parsed.data, status: 'new' }) });
});

router.get('/messages', authRequired, adminOnly, (req, res) => res.json({ data: read('messages').reverse() }));

router.patch('/messages/:id', authRequired, adminOnly, (req, res) => {
  const updated = update('messages', req.params.id, { status: req.body.status || 'read' });
  if (!updated) return res.status(404).json({ error: 'Message not found' });
  return res.json({ data: updated });
});

router.delete('/messages/:id', authRequired, adminOnly, (req, res) => {
  const gone = remove('messages', req.params.id);
  if (!gone) return res.status(404).json({ error: 'Message not found' });
  return res.json({ data: gone });
});

/* ---------- newsletter ---------- */
router.post('/newsletter', (req, res) => {
  const email = String(req.body.email || '').trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'A valid email is required' });
  if (read('newsletter').some((n) => n.email === email)) return res.status(409).json({ error: 'You are already subscribed' });
  return res.status(201).json({ data: insert('newsletter', { email }) });
});

/* ---------- favorites (per user) ---------- */
router.get('/favorites', authRequired, (req, res) => {
  const ids = read('favorites').filter((f) => f.userId === req.user.id).map((f) => f.propertyId);
  const data = read('properties').filter((p) => ids.includes(p.id));
  return res.json({ data, count: data.length });
});

router.post('/favorites', authRequired, (req, res) => {
  const { propertyId } = req.body;
  if (!read('properties').some((p) => p.id === propertyId)) return res.status(404).json({ error: 'Property not found' });
  const existing = read('favorites').find((f) => f.userId === req.user.id && f.propertyId === propertyId);
  if (existing) {
    remove('favorites', existing.id);
    return res.json({ favorited: false });
  }
  insert('favorites', { userId: req.user.id, propertyId });
  return res.json({ favorited: true });
});

/* ---------- stats ---------- */
router.get('/stats', (req, res) => {
  const properties = read('properties');
  const sold = properties.filter((p) => p.status === 'Sold');
  res.json({
    data: {
      listings: properties.length,
      soldVolume: sold.reduce((sum, p) => sum + p.price, 0),
      cities: [...new Set(properties.map((p) => p.city))].length,
      agents: read('agents').length,
      clients: 1240,
      avgRating: Number((read('testimonials').reduce((s, t) => s + t.rating, 0) / read('testimonials').length).toFixed(2)),
    },
  });
});

export default router;