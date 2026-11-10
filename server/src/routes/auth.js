import { Router } from 'express';
import bcrypt from 'bcryptjs';
const b = bcrypt.default || bcrypt;
import { z } from 'zod';
import { read, insert, findByEmail } from '../db.js';
import { signToken, publicUser, authRequired } from '../middleware/auth.js';

const router = Router();

const credentials = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/register', async (req, res) => {
  const parsed = credentials.extend({ name: z.string().min(2) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
  const { email, password, name } = parsed.data;
  if (await findByEmail('users', email)) return res.status(409).json({ error: 'An account with that email already exists' });
  const user = await insert('users', { name, email, passwordHash: b.hashSync(password, 10), role: 'user' });
  return res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
  const user = await findByEmail('users', parsed.data.email);
  if (!user || !b.compareSync(parsed.data.password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  return res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', authRequired, (req, res) => res.json({ user: req.user }));

router.get('/users', authRequired, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const users = await read('users');
  return res.json({ data: users.map(publicUser) });
});

export default router;