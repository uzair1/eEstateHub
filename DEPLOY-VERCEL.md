# Deploying EstateHub to Vercel

EstateHub has two parts:
- **Frontend** — a React SPA built with Vite (served as static files).
- **Backend** — an Express API mounted as a Vercel **Serverless Function** at `/api`.

The repo is already configured so **one Vercel project deploys both**. The images you
see on the site are real photos bundled locally in `client/public/images/` (no external
image CDNs), so they deploy with the frontend and can't break.

> **Heads-up on data:** the backend stores demo data in JSON files. On Vercel's read-only
> filesystem it falls back to **in-memory** storage, so listings always load (seeded on
> cold start) but anything you *change* (new messages, favourites, accounts, deleted
> listings) resets when the function sleeps. That's fine for a demo/portfolio site. See
> "Optional upgrades" at the end for persistent storage.

---

## What was added for Vercel
| File | Purpose |
| --- | --- |
| `api/index.js` | Serverless entry — imports the Express app and exports it. |
| `server/src/app.js` | Express app (no `listen`) so it can be reused by the function. |
| `server/src/index.js` | Local/Render runner — imports the app and listens on a port. |
| `package.json` (root) | Lets Vercel install the API's dependencies (express, jwt, etc.). |
| `vercel.json` | Routes `/api/*` → the function, everything else → the built client. |
| `server/src/db.js` | Now degrades gracefully to in-memory if writes fail. |

---

## Step-by-step

### 0. Prerequisites
- A **GitHub** account (recommended) or a local Git repo.
- A **Vercel** account — sign up free at <https://vercel.com> (GitHub sign-in is easiest).
- Your code pushed to a Git repo (GitHub / GitLab / Bitbucket), or ready to upload.

### 1. Push the project to Git
From the `estate-hub` folder:
```bash
git init
git add .
git commit -m "EstateHub real estate site"
# create a repo on GitHub, then:
git remote add origin https://github.com/<you>/estate-hub.git
git push -u origin main
```
Make sure `node_modules/`, `dist/`, `server/data/*.json` and `.env` stay ignored
(the `.gitignore` already handles these).

### 2. Import the project into Vercel
1. Go to <https://vercel.com/new>.
2. **Import** your `estate-hub` repository.
3. Vercel auto-detects the root `vercel.json`. If it asks for a framework, leave the
   default (it will use the `builds` defined in `vercel.json`, not a single framework).

### 3. Build settings (confirm these)
Vercel reads the build config from `vercel.json`. You normally change nothing here, but
verify under **Settings → Build & Development**:
- **Build command** — left as defined by config (client builds via Vite automatically).
- **Output directory** — `client/dist`.
- **Install command** — `npm install` (installs the root API deps; the client installs its own).

### 4. Set environment variables (recommended)
Go to **Settings → Environment Variables** and add:
| Name | Value | Notes |
| --- | --- | --- |
| `JWT_SECRET` | a long random string | Required for login/auth in production. |
| `CLIENT_ORIGIN` | `https://<your-project>.vercel.app` | Optional; restricts CORS to your site. |

You can skip these for a first test (the code has safe dev fallbacks), but **set
`JWT_SECRET` before sharing the login** (`admin@estatehub.com` / `password`).

### 5. Deploy
Click **Deploy**. The first build takes ~1–2 minutes. When it finishes you get a live
URL like `https://estate-hub-xxxx.vercel.app`.

### 6. Verify the deploy
Open the URL and check:
- Home hero, property photos, agent avatars, and gallery all render (they should — they're
  bundled in `client/public/images/`).
- `/properties` filters and paginates.
- A property detail page loads its gallery and "similar properties".
- `/api/health` returns `{"status":"ok"}` at `https://<your-project>.vercel.app/api/health`.
- Sign in with `admin@estatehub.com` / `password` and open `/admin`.

### 7. Custom domain (optional)
**Settings → Domains → Add**, then follow Vercel's DNS instructions. Update
`CLIENT_ORIGIN` to the new domain if you set it.

---

## Ongoing changes
Every push to your main branch auto-deploys. To deploy a different branch, use the
Vercel dashboard or the CLI:
```bash
npm i -g vercel
vercel login
vercel            # preview deployment from the current branch
vercel --prod     # production deployment
```

---

## Optional upgrades (persistent data)

**A. Keep the same JSON approach but persist on Render + Vercel frontend**
Deploy the API to Render/Railway (free tier) which has a writable disk, then point the
frontend at it by setting `VITE_API_URL=https://<your-api>.onrender.com/api` in Vercel's
env vars. This keeps favourites/messages persistent.

**B. Real database on Vercel**
Replace `server/src/db.js`'s file store with a hosted DB — **Vercel Postgres**, **MongoDB
Atlas**, or **Upstash Redis** all have free tiers. The rest of the API already goes through
`read`/`write`/`insert`/`update`/`remove`, so you only swap those functions and nothing else
changes. If you want, ask me to wire in Vercel Postgres specifically.

**C. Real property photography**
The bundled photos are royalty-free demo images. To use your own, drop files into
`client/public/images/props/` and update the `images` array for each listing (or point the
seed at hosted image URLs). No other code changes needed.