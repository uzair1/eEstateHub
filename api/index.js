// Vercel serverless entry point — self-contained Express app.
// Any /api/* route is routed here by vercel.json.
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV || 'development' });
});

// Seed data (inline so it works on read-only Vercel filesystem)
const AGENTS = [
  { id: '1', name: 'Sarah Mitchell', photo: '/images/agent-1.jpg', phone: '+1 (555) 123-4567', email: 'sarah@estatehub.com', bio: 'Top-selling agent in the Bay Area.', listings: 24 },
  { id: '2', name: 'David Okonkwo', photo: '/images/agent-2.jpg', phone: '+1 (555) 234-5678', email: 'david@estatehub.com', bio: 'Luxury property specialist.', listings: 18 },
  { id: '3', name: 'Elena Ruiz', photo: '/images/agent-3.jpg', phone: '+1 (555) 345-6789', email: 'elena@estatehub.com', bio: 'First-home expert.', listings: 32 },
  { id: '4', name: 'Marcus Lee', photo: '/images/agent-4.jpg', phone: '+1 (555) 456-7890', email: 'marcus@estatehub.com', bio: 'Commercial & investment.', listings: 15 },
];

const PROPERTIES = [
  {
    id: '1', title: 'Modern Hillside Retreat', price: 1250000, location: 'San Francisco, CA',
    city: 'San Francisco', state: 'CA', zip: '94102', type: 'House', status: 'For Sale',
    bedrooms: 4, bathrooms: 3, squareFeet: 3200, description: 'Stunning modern home with bay views.',
    images: ['/images/props/prop-1.jpg', '/images/props/prop-2.jpg', '/images/props/prop-3.jpg', '/images/props/prop-4.jpg', '/images/props/prop-5.jpg'],
    agent: AGENTS[1], createdAt: new Date().toISOString(),
  },
  {
    id: '2', title: 'Downtown Loft', price: 850000, location: 'Denver, CO',
    city: 'Denver', state: 'CO', zip: '80202', type: 'Condo', status: 'For Sale',
    bedrooms: 2, bathrooms: 2, squareFeet: 1400, description: 'Urban loft in the heart of downtown.',
    images: ['/images/props/prop-6.jpg', '/images/props/prop-7.jpg', '/images/props/prop-8.jpg', '/images/props/prop-9.jpg', '/images/props/prop-10.jpg'],
    agent: AGENTS[0], createdAt: new Date().toISOString(),
  },
  {
    id: '3', title: 'Suburban Family Home', price: 675000, location: 'Austin, TX',
    city: 'Austin', state: 'TX', zip: '78701', type: 'House', status: 'For Sale',
    bedrooms: 3, bathrooms: 2, squareFeet: 2100, description: 'Spacious family home with big backyard.',
    images: ['/images/props/prop-11.jpg', '/images/props/prop-12.jpg', '/images/props/prop-13.jpg', '/images/props/prop-14.jpg', '/images/props/prop-15.jpg'],
    agent: AGENTS[2], createdAt: new Date().toISOString(),
  },
  {
    id: '4', title: 'Luxury Penthouse', price: 2200000, location: 'Miami, FL',
    city: 'Miami', state: 'FL', zip: '33139', type: 'Condo', status: 'For Sale',
    bedrooms: 3, bathrooms: 4, squareFeet: 3800, description: 'Oceanfront penthouse with private terrace.',
    images: ['/images/props/prop-16.jpg', '/images/props/prop-17.jpg', '/images/props/prop-18.jpg', '/images/props/prop-19.jpg', '/images/props/prop-20.jpg'],
    agent: AGENTS[3], createdAt: new Date().toISOString(),
  },
  {
    id: '5', title: 'Mountain Cabin', price: 450000, location: 'Boulder, CO',
    city: 'Boulder', state: 'CO', zip: '80302', type: 'House', status: 'For Sale',
    bedrooms: 2, bathrooms: 1, squareFeet: 1100, description: 'Cozy cabin near the trails.',
    images: ['/images/props/prop-21.jpg', '/images/props/prop-22.jpg', '/images/props/prop-23.jpg', '/images/props/prop-24.jpg', '/images/props/prop-25.jpg'],
    agent: AGENTS[2], createdAt: new Date().toISOString(),
  },
];

// Properties routes
app.get('/api/properties', (_req, res) => {
  res.json({ data: PROPERTIES, total: PROPERTIES.length });
});
app.get('/api/properties/:id', (req, res) => {
  const p = PROPERTIES.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Property not found' });
  res.json({ data: p });
});

// Agents routes
app.get('/api/agents', (_req, res) => {
  res.json({ data: AGENTS, total: AGENTS.length });
});
app.get('/api/agents/:id', (req, res) => {
  const a = AGENTS.find((x) => x.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Agent not found' });
  res.json({ data: a });
});

// Misc routes
app.get('/api/testimonials', (_req, res) => {
  res.json({ data: [] });
});
app.get('/api/services', (_req, res) => {
  res.json({ data: [] });
});

// 404 for API
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

export const config = {
  api: { bodyParser: true },
};

export default app;