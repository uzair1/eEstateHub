import { Pool } from 'pg';

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/estatehub',
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

export async function seed() {
  const { seedDb } = await import('./db.js');
  await seedDb();
  console.log('Database seeded successfully');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});