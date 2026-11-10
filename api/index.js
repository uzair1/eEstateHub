// Vercel serverless entry point — imports the real Express app from server/src/app.js.
// Any /api/* route is routed here by vercel.json.
// The Express app mounts all routes, applies CORS + rate limiting, and calls
// initDb() + seedDb() on module load. Do NOT call app.listen() — Vercel handles that.
import app from '../server/src/app.js';

export default app;