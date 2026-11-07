import { read, write } from '../db.js';

export const AGENTS = [
  { id: 'ag_1', name: 'Sarah Mitchell', role: 'Founder & Principal Broker', email: 'sarah@estatehub.com', phone: '+1 (415) 555-0142', photo: '/images/agent-1.jpg', bio: 'Over 18 years in luxury residential real estate across the Bay Area. Sarah has closed more than $420M in volume and is known for discretion and precision.', specialties: ['Luxury Homes', 'Waterfront', 'Estate Sales'], languages: ['English', 'Spanish'], rating: 4.9, reviews: 214, listings: 42 },
  { id: 'ag_2', name: 'David Okonkwo', role: 'Senior Listing Agent', email: 'david@estatehub.com', phone: '+1 (415) 555-0177', photo: '/images/agent-2.jpg', bio: 'David specialises in new developments and investment portfolios. He built the firm\u2019s first-time buyer programme from zero to 900 clients in four years.', specialties: ['New Developments', 'Investment', 'Condos'], languages: ['English', 'French'], rating: 4.8, reviews: 168, listings: 37 },
  { id: 'ag_3', name: 'Elena Ruiz', role: 'Head of Relocation', email: 'elena@estatehub.com', phone: '+1 (415) 555-0190', photo: '/images/agent-3.jpg', bio: 'Corporate relocation specialist helping families and executives settle into new cities. Elena has coordinated over 1,200 corporate moves.', specialties: ['Relocation', 'Family Homes', 'Rentals'], languages: ['English', 'Spanish', 'Portuguese'], rating: 4.9, reviews: 143, listings: 29 },
  { id: 'ag_4', name: 'Marcus Lee', role: 'Commercial Property Lead', email: 'marcus@estatehub.com', phone: '+1 (415) 555-0123', photo: '/images/agent-4.jpg', bio: 'Marcus leads the commercial division covering retail, office and mixed-use assets, with an emphasis on adaptive-reuse development in historic districts.', specialties: ['Commercial', 'Retail', 'Mixed-Use'], languages: ['English', 'Korean'], rating: 4.7, reviews: 96, listings: 21 },
];

const CITIES = ['San Francisco', 'Los Angeles', 'New York', 'Miami', 'Seattle', 'Austin', 'Denver', 'Chicago'];
const TYPES = ['House', 'Condo', 'Townhouse', 'Villa', 'Apartment', 'Penthouse'];
const AMENITIES = ['Pool', 'Garage', 'Garden', 'Gym', 'Elevator', 'Fireplace', 'Balcony', 'Smart Home', 'Waterfront', 'Doorman', 'Solar Panels', 'Guest House'];

const TITLES = [
  'Modern Hillside Retreat', 'Skyline Penthouse', 'Garden Townhouse', 'Lakefront Villa', 'Downtown Loft',
  'Coastal Contemporary', 'Craftsman Residence', 'Sunlit Family Home', 'Investor Duplex', 'City View Condo',
  'Historic Brownstone', 'Desert Modern Villa', 'Waterfront Cottage', 'Executive Residence', 'Starlight Penthouse',
];

const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const PROPERTIES = Array.from({ length: 48 }).map((_, i) => {
  const city = CITIES[i % CITIES.length];
  const type = TYPES[i % TYPES.length];
  const beds = 2 + (i % 5);
  const baths = 2 + (i % 4);
  const sqft = 900 + i * 115;
  const status = i % 12 === 11 ? 'Sold' : i % 7 === 6 ? 'For Rent' : 'For Sale';
  const price = status === 'For Rent' ? 2400 + (i % 9) * 450 : 480000 + i * 72000;
  const amenities = [...new Set(Array.from({ length: 3 + (i % 4) }, (_, a) => AMENITIES[(i * 3 + a * 5) % AMENITIES.length]))];
  return {
    id: `pr_${1000 + i}`,
    slug: `${slug(TITLES[i % TITLES.length])}-${city.toLowerCase().replace(/\s+/g, '-')}-${1000 + i}`,
    title: TITLES[i % TITLES.length],
    description: `${TITLES[i % TITLES.length]} in ${city} \u2014 a meticulously finished ${type.toLowerCase()} offering ${beds} bedrooms, ${baths} bathrooms and ${sqft.toLocaleString()} sq ft of light-filled living space. Premium finishes, generous outdoor areas and effortless access to the best of the neighbourhood.`,
    price,
    status,
    type,
    city,
    state: 'CA',
    address: `${120 + i * 7} ${['Oak', 'Cedar', 'Market', 'Sunset', 'Bay', 'Hill'][i % 6]} Street`,
    beds,
    baths,
    sqft,
    lotSize: Number((0.2 + (i % 9) * 0.15).toFixed(2)),
    yearBuilt: 1965 + (i % 60),
    parking: i % 4,
    amenities,
    images: Array.from({ length: 5 }, (_, k) => `/images/props/prop-${((i * 5 + k) % 12) + 1}.jpg`),
    agentId: AGENTS[i % AGENTS.length].id,
    featured: i % 6 === 0,
    views: 120 + ((i * 97) % 3000),
    listedAt: new Date(Date.now() - (i % 30) * 86400000).toISOString(),
    coordinates: { lat: 37.7 + (i % 10) * 0.05, lng: -122.4 + (i % 10) * 0.07 },
  };
});
export const TESTIMONIALS = [
  { id: 't1', name: 'Jordan & Amy Reyes', location: 'San Francisco, CA', rating: 5, property: 'Bought a family home in Noe Valley', text: 'From the first weekend of open houses to the day we got the keys, the team was three steps ahead of us. They flagged inspection issues nobody else mentioned and negotiated a price 6% under asking.' },
  { id: 't2', name: 'Priya Raman', location: 'New York, NY', rating: 5, property: 'Purchased a 2-bed condo', text: 'I was buying remotely from another country. Virtual walkthroughs, honest advice and constant updates made the whole thing feel effortless. Highly responsive on every message.' },
  { id: 't3', name: 'Thomas Berg', location: 'Austin, TX', rating: 5, property: 'Sold an investment duplex', text: 'They priced it right the first time and we had an accepted offer in nine days. The photography and listing copy were far better than anything else I saw in the market.' },
  { id: 't4', name: 'Sofia Almeida', location: 'Miami, FL', rating: 4, property: 'Relocation rental, 6 months', text: 'Relocating for work is stressful. Elena handled everything from area tours to the lease paperwork. We were fully settled within three weeks of landing.' },
  { id: 't5', name: 'Daniel Kim', location: 'Seattle, WA', rating: 5, property: 'First-time buyer, 2-bed condo', text: 'They patiently explained every number in the mortgage and never once pushed me. I saved enough for the down payment through their buyer programme.' },
  { id: 't6', name: 'Grace Whitfield', location: 'Los Angeles, CA', rating: 5, property: 'Bought a mid-century modern villa', text: 'Sarah understood exactly the kind of home I was after and found it before it even hit the portals. Closing was clean and on schedule.' },
];

export const SERVICES = [
  { id: 's1', icon: 'home', title: 'Residential Sales', text: 'Full-service sales from valuation and staging through to closing, backed by a dedicated listing agent and a 30-day marketing plan.' },
  { id: 's2', icon: 'key', title: 'Property Management', text: 'Rent collection, tenant screening, maintenance and quarterly reporting for owners who live out of state or overseas.' },
  { id: 's3', icon: 'chart', title: 'Investment Advisory', text: 'Rental yield analysis, cap-rate modelling and portfolio strategy so you buy with numbers rather than sentiment.' },
  { id: 's4', icon: 'users', title: 'Relocation Services', text: 'Destination tours, school catchment guidance, temporary housing and visa-timed closing coordination for inbound movers.' },
  { id: 's5', icon: 'handshake', title: 'Mortgage Brokerage', text: 'In-house lending desk comparing 40+ lenders, pre-approval in 24 hours and no hidden fees on your loan.' },
  { id: 's6', icon: 'ruler', title: 'Valuation & Appraisal', text: 'Comparative market analysis with recent closed sales in your exact street, delivered within 48 hours, free of charge.' },
];

const DEFAULT_PASSWORD_HASH = '$2a$10$sbSH1yUwtik5c4A6IBOCIOlRXd1u/.3n0wvyJI/VKgurqdWizO5.2'; // "password"

export function seed() {
  write('agents', AGENTS);
  write('properties', PROPERTIES);
  write('testimonials', TESTIMONIALS);
  write('services', SERVICES);
  write('messages', []);
  write('newsletter', []);
  write('favorites', []);
  write('users', [
    { id: 'u_admin', name: 'Admin', email: 'admin@estatehub.com', passwordHash: DEFAULT_PASSWORD_HASH, role: 'admin', createdAt: new Date().toISOString() },
    { id: 'u_demo', name: 'Demo User', email: 'demo@estatehub.com', passwordHash: DEFAULT_PASSWORD_HASH, role: 'user', createdAt: new Date().toISOString() },
  ]);
}

export const collections = { agents: 'agents', properties: 'properties', testimonials: 'testimonials', services: 'services', messages: 'messages', newsletter: 'newsletter', favorites: 'favorites', users: 'users' };
export { read, write };