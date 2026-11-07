// Vercel serverless entry point — wraps the Express app as a serverless function.
// Any /api/* route is routed here by vercel.json.
import app from '../server/src/app.js';

export const config = {
  api: { bodyParser: true },
};

export default app;