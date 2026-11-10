import { Router } from 'express';
import { z } from 'zod';
import { read, insert, update, remove } from '../db.js';
import { asyncHandler } from '../middleware/error.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = Router();

async function decorate(p) {
  const agents = await read('agents');
  const agent = agents.find((a) => a.id === p.agentId) || null;
  return {
    ...p,
    agent: agent && { id: agent.id, name: agent.name, role: agent.role, photo: agent.photo, phone: agent.phone, email: agent.email },
  };
}

router.get('/', async (req, res) => {
  const {
    q, city, type, status, minPrice, maxPrice, beds, baths, minSqft, maxSqft, amenity, featured, agentId, sort, page = '1', limit = '12',
  } = req.query;

  let rows = await read('properties');

  if (q) {
    const needle = String(q).toLowerCase();
    rows = rows.filter((p) => [p.title, p.city, p.address, p.description, p.type, p.status].join(' ').toLowerCase().includes(needle));
  }
  if (city) rows = rows.filter((p) => p.city.toLowerCase() === String(city).toLowerCase());
  if (type) rows = rows.filter((p) => p.type.toLowerCase() === String(type).toLowerCase());
  if (status) rows = rows.filter((p) => p.status.toLowerCase() === String(status).toLowerCase());
  if (agentId) rows = rows.filter((p) => p.agentId === agentId);
  if (featured === 'true') rows = rows.filter((p) => p.featured);
  if (minPrice) rows = rows.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) rows = rows.filter((p) => p.price <= Number(maxPrice));
  if (beds) rows = rows.filter((p) => p.bedrooms >= Number(beds));
  if (baths) rows = rows.filter((p) => p.bathrooms >= Number(baths));
  if (minSqft) rows = rows.filter((p) => p.squareFeet >= Number(minSqft));
  if (maxSqft) rows = rows.filter((p) => p.squareFeet <= Number(maxSqft));
  if (amenity) rows = rows.filter((p) => p.amenities.includes(amenity));

  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    newest: (a, b) => new Date(b.listedAt) - new Date(a.listedAt),
    'sqft-desc': (a, b) => b.squareFeet - a.squareFeet,
    'beds-desc': (a, b) => b.bedrooms - a.bedrooms,
    popular: (a, b) => b.views - a.views,
  };
  rows = [...rows].sort(sorters[sort] || sorters.newest);

  const perPage = Math.min(Math.max(Number(limit) || 12, 1), 60);
  const current = Math.max(Number(page) || 1, 1);
  const total = rows.length;
  const paged = rows.slice((current - 1) * perPage, current * perPage);

  const allProperties = await read('properties');
  res.json({
    data: await Promise.all(paged.map(decorate)),
    pagination: { total, page: current, limit: perPage, pages: Math.ceil(total / perPage) || 1 },
    filters: {
      cities: [...new Set(allProperties.map((p) => p.city))].sort(),
      types: [...new Set(allProperties.map((p) => p.type))].sort(),
      amenities: [...new Set(allProperties.flatMap((p) => p.amenities))].sort(),
    },
  });
});

router.get('/:idOrSlug', async (req, res) => {
  const key = req.params.idOrSlug;
  const all = await read('properties');
  const property = all.find((p) => p.id === key) || all.find((p) => p.slug === key);
  if (!property) return res.status(404).json({ error: 'Property not found' });

  await update('properties', property.id, { views: (property.views || 0) + 1 });

  const similar = all
    .filter((p) => p.id !== property.id && (p.city === property.city || p.type === property.type))
    .slice(0, 4)
    .map(decorate);

  return res.json({
    data: { ...(await decorate(property)), views: (property.views || 0) + 1 },
    similar: await Promise.all(similar),
  });
});

const propertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  price: z.coerce.number().positive(),
  status: z.enum(['For Sale', 'For Rent', 'Sold']).default('For Sale'),
  type: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2).default('CA'),
  address: z.string().min(3),
  beds: z.coerce.number().int().min(0),
  baths: z.coerce.number().min(0),
  sqft: z.coerce.number().positive(),
  lotSize: z.coerce.number().min(0).default(0),
  yearBuilt: z.coerce.number().int().min(1800).max(2100),
  parking: z.coerce.number().int().min(0).default(0),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).min(1),
  agentId: z.string().min(1),
  featured: z.coerce.boolean().default(false),
});

router.post('/', authRequired, adminOnly, async (req, res) => {
  const parsed = propertySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
  const base = parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const record = await insert('properties', {
    ...parsed.data,
    slug: `${base}-${Date.now().toString(36)}`,
    views: 0,
    listedAt: new Date().toISOString(),
    coordinates: { lat: 37.7 + Math.random() * 0.5, lng: -122.4 + Math.random() * 0.7 },
  });
  return res.status(201).json({ data: record });
});

router.put('/:id', authRequired, adminOnly, async (req, res) => {
  const updated = await update('properties', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Property not found' });
  return res.json({ data: updated });
});

router.delete('/:id', authRequired, adminOnly, asyncHandler(async (req, res) => {
  const gone = await remove('properties', req.params.id);
  if (!gone) return res.status(404).json({ error: 'Property not found' });
  return res.json({ data: gone });
}));

export default router;