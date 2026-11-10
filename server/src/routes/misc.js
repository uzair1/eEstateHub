import { Router } from 'express';
import { z } from 'zod';
import { read, insert, update, remove } from '../db.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = Router();

/* ---------- testimonials ---------- */
router.get('/testimonials', async (req, res) => res.json({ data: await read('testimonials') }));

/* ---------- services ---------- */
router.get('/services', async (req, res) => res.json({ data: await read('services') }));

/* ---------- contact messages ---------- */
const messageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default(''),
  subject: z.string().min(2),
  message: z.string().min(10),
  propertyId: z.string().optional(),
});

router.post('/messages', async (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
  return res.status(201).json({ data: await insert('messages', { ...parsed.data, status: 'new' }) });
});

router.get('/messages', authRequired, adminOnly, async (req, res) => {
  const data = await read('messages');
  return res.json({ data: data.reverse() });
});

router.patch('/messages/:id', authRequired, adminOnly, async (req, res) => {
  const updated = await update('messages', req.params.id, { status: req.body.status || 'read' });
  if (!updated) return res.status(404).json({ error: 'Message not found' });
  return res.json({ data: updated });
});

router.delete('/messages/:id', authRequired, adminOnly, async (req, res) => {
  const gone = await remove('messages', req.params.id);
  if (!gone) return res.status(404).json({ error: 'Message not found' });
  return res.json({ data: gone });
});

/* ---------- newsletter ---------- */
router.post('/newsletter', async (req, res) => {
  const email = String(req.body.email || '').trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'A valid email is required' });
  const existing = (await read('newsletter')).some((n) => n.email === email);
  if (existing) return res.status(409).json({ error: 'You are already subscribed' });
  return res.status(201).json({ data: await insert('newsletter', { email }) });
});

/* ---------- favorites (per user) ---------- */
router.get('/favorites', authRequired, async (req, res) => {
  const favorites = await read('favorites');
  const ids = favorites.filter((f) => f.userId === req.user.id).map((f) => f.propertyId);
  const properties = await read('properties');
  const data = properties.filter((p) => ids.includes(p.id));
  return res.json({ data, count: data.length });
});

router.post('/favorites', authRequired, async (req, res) => {
  const { propertyId } = req.body;
  const properties = await read('properties');
  if (!properties.some((p) => p.id === propertyId)) return res.status(404).json({ error: 'Property not found' });
  const favorites = await read('favorites');
  const existing = favorites.find((f) => f.userId === req.user.id && f.propertyId === propertyId);
  if (existing) {
    await remove('favorites', existing.id);
    return res.json({ favorited: false });
  }
  await insert('favorites', { userId: req.user.id, propertyId });
  return res.json({ favorited: true });
});

/* ---------- stats ---------- */
router.get('/stats', async (req, res) => {
  const properties = await read('properties');
  const agents = await read('agents');
  const testimonials = await read('testimonials');
  const sold = properties.filter((p) => p.status === 'Sold');
  res.json({
    data: {
      listings: properties.length,
      soldVolume: sold.reduce((sum, p) => sum + p.price, 0),
      cities: [...new Set(properties.map((p) => p.city))].length,
      agents: agents.length,
      clients: 1240,
      avgRating: testimonials.length
        ? Number((testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(2))
        : 0,
    },
  });
});

export default router;