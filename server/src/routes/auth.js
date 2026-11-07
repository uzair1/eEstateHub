import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { read, insert, findByEmail } from '../db.js';
import { signToken, publicUser, authRequired } from '../middleware/auth.js';

const router = Router();

const credentials = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/register', (req, res) => {
  const parsed = credentials.extend({ name: z.string().min(2) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
  const { email, password, name } = parsed.data;
  if (findByEmail('users', email)) return res.status(409).json({ error: 'An account with that email already exists' });
  const user = insert('users', { name, email, passwordHash: bcrypt.hashSync(password, 10), role: 'user' });
  return res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
  const user = findByEmail('users', parsed.data.email);
  if (!user || !bcrypt.compareSync(parsed.data.password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  return res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', authRequired, (req, res) => res.json({ user: req.user }));

router.get('/users', authRequired, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  return res.json({ data: read('users').map(publicUser) });
});

export default router;