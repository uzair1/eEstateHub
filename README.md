# EstateHub — Real Estate Agency Website

A complete real estate agency website: **React (Vite) frontend** + **Node.js / Express API backend**.

```
estate-hub/
├── server/          Express REST API (JSON-file persistence, JWT auth)
└── client/          React 18 SPA (Vite, React Router)
```

## Quick start

### 1. Backend (port 3001)

```bash
cd server
npm install
npm start        # or: npm run dev  (watch mode)
```

Data auto-seeds on first boot into `server/data/*.json` (48 properties, 4 agents, 6 services, 6 testimonials).
Delete those files and restart to reset the demo data.

### 2. Frontend (port 5173)

```bash
cd client
npm install
npm run dev
```

Vite proxies `/api` → `http://localhost:3001`. Open <http://localhost:5173>.

### Production (single port)

```bash
cd client && npm run build     # emits client/dist
cd ../server && npm start      # serves dist + /api on one port
```

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@estatehub.com` | `password` |
| User | `demo@estatehub.com` | `password` |

## Pages

| Route | Description |
| --- | --- |
| `/` | Hero, search bar, featured listings, stats, process, services, testimonials |
| `/properties` | Filterable/sortable/paginated listing grid (filters live in the URL) |
| `/properties/:idOrSlug` | Gallery + lightbox, specs, amenities, mortgage calculator, inquiry form, agent card, similar homes |
| `/agents`, `/agents/:id` | Team directory and individual profiles with their listings |
| `/services` | Service grid, 5-step process timeline, accordion FAQ |
| `/about` | Story, values, milestone timeline, testimonials |
| `/contact` | Validated contact form, office/hours info, embedded map |
| `/favorites` | Saved properties (localStorage) |
| `/login` | Sign in / register (JWT) |
| `/admin` | Admin-only: stats, listing management, enquiry inbox |
| `*` | 404 page |

## API reference

Base URL: `/api`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | – | Service health |
| GET | `/stats` | – | Listing/agent/city totals, avg rating |
| GET | `/properties` | – | Filters: `q, city, type, status, minPrice, maxPrice, beds, baths, minSqft, maxSqft, amenity, featured, agentId, sort, page, limit`. Returns `data`, `pagination`, `filters` |
| GET | `/properties/:idOrSlug` | – | Single property (+ similar listings, increments views) |
| POST/PUT/DELETE | `/properties`, `/properties/:id` | Admin | Create / update / delete (Zod validated) |
| GET | `/agents`, `/agents/:id` | – (POST/PUT/DELETE: Admin) | Team directory / profile with listings |
| GET | `/testimonials`, `/services` | – | Static content collections |
| POST | `/messages` | – | Contact + property inquiry submissions |
| GET/PATCH/DELETE | `/messages`, `/messages/:id` | Admin | Enquiry inbox |
| POST | `/newsletter` | – | Subscribe (duplicate emails rejected) |
| GET/POST | `/favorites` | User | List / toggle a saved property |
| POST | `/auth/register`, `/auth/login` | – | Returns `{ token, user }` |
| GET | `/auth/me`, `/auth/users` | User / Admin | Current user, all users (admin) |

Rate limiting: 300 requests/minute per IP on `/api`. Security headers via helmet, CORS configurable.

## Configuration

`server/.env` (optional):

```
PORT=3001
JWT_SECRET=change-me-in-production
CLIENT_ORIGIN=http://localhost:5173
```

`client/.env` (optional):

```
VITE_API_URL=http://localhost:3001/api   # defaults to the dev proxy "/api"
```

## Tech notes

- No database required — `server/src/db.js` is a tiny cached JSON store; swap it for MongoDB/Postgres without touching the routes.
- Styling is a single hand-written design system (`client/src/styles.css`): navy + gold palette, Fraunces/Inter typography, fully responsive with no UI library.
- Favorites persist in `localStorage`; the `/api/favorites` endpoints are available for server-side sync.

## Images

All imagery is **bundled locally** (no external image CDNs), so it works offline and can't break.

- Placeholder home/office/hero/avatar artwork lives in `client/public/images/` as lightweight SVGs.
- The backend seed references them via relative `/images/...` paths, which the SPA resolves to its own origin (Vite in dev, Express in production).
- To regenerate the artwork: `cd client && npm run images`.
- To use real photography later, just point the seed data / new listings at your own image URLs or upload files into `client/public/images/`."# eEstateHub" 
