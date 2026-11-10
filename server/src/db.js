import { Pool } from 'pg';

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/estatehub',
});

function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function snakeToCamel(str) {
  return str.replace(/(_[a-z])/g, (match) => match[1].toUpperCase());
}

function toSnake(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[camelToSnake(key)] = value;
  }
  return result;
}

function toCamel(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map((item) => (typeof item === 'object' ? toCamel(item) : item));
  if (typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[snakeToCamel(key)] = toCamel(value);
    }
    return result;
  }
  return obj;
}

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

export async function read(name) {
  const res = await query(`SELECT * FROM ${name}`);
  return res.rows.map(toCamel);
}

export async function insert(name, doc) {
  const snake = toSnake(doc);
  const keys = Object.keys(snake);
  const values = Object.values(snake);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const columns = keys.join(', ');
  const res = await query(
    `INSERT INTO ${name} (${columns}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  return toCamel(res.rows[0]);
}

export async function update(name, id, patch) {
  const snake = toSnake(patch);
  const keys = Object.keys(snake);
  const values = Object.values(snake);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const res = await query(
    `UPDATE ${name} SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  return toCamel(res.rows[0]) || null;
}

export async function remove(name, id) {
  const res = await query(`DELETE FROM ${name} WHERE id = $1 RETURNING *`, [id]);
  return toCamel(res.rows[0]) || null;
}

export async function findBy(name, predicate) {
  const rows = await read(name);
  return rows.find(predicate) || null;
}

export async function findByEmail(name, email) {
  const res = await query(`SELECT * FROM ${name} WHERE email = $1`, [email]);
  return toCamel(res.rows[0]) || null;
}

export async function initDb() {
  // Ensure all tables exist — idempotent, safe to run on every serverless cold start.
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS agents (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(100),
      photo TEXT,
      bio TEXT,
      specialties TEXT[] DEFAULT '{}',
      languages TEXT[] DEFAULT '{}',
      rating DECIMAL(3,2) DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      listings INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS properties (
      id VARCHAR(50) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(12,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'For Sale',
      type VARCHAR(100),
      city VARCHAR(100),
      state VARCHAR(50),
      zip VARCHAR(20),
      address VARCHAR(255),
      bedrooms INTEGER DEFAULT 0,
      bathrooms INTEGER DEFAULT 0,
      square_feet INTEGER DEFAULT 0,
      lot_size DECIMAL(6,2) DEFAULT 0,
      year_built INTEGER,
      parking INTEGER DEFAULT 0,
      amenities TEXT[] DEFAULT '{}',
      images TEXT[] DEFAULT '{}',
      agent_id VARCHAR(50) REFERENCES agents(id),
      featured BOOLEAN DEFAULT FALSE,
      views INTEGER DEFAULT 0,
      listed_at TIMESTAMP DEFAULT NOW(),
      coordinates JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS testimonials (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      rating INTEGER DEFAULT 5,
      property VARCHAR(255),
      text TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS services (
      id VARCHAR(50) PRIMARY KEY,
      icon VARCHAR(100),
      title VARCHAR(255) NOT NULL,
      text TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(100),
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      property_id VARCHAR(50) REFERENCES properties(id),
      status VARCHAR(50) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS newsletter (
      id VARCHAR(50) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS favorites (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(50) REFERENCES users(id),
      property_id VARCHAR(50) REFERENCES properties(id),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, property_id)
    );
  `);
  // Verify connectivity
  await query('SELECT 1');
}

export async function seedDb() {
  const { rowCount } = await query('SELECT 1 FROM agents LIMIT 1');
  if (rowCount > 0) return;

  const { AGENTS, PROPERTIES, TESTIMONIALS, SERVICES } = await import('./data/seedData.js');
  const bcrypt = await import('bcryptjs');
  const hash = bcrypt.default.hashSync('password', 10);

  for (const agent of AGENTS) await insert('agents', agent);
  for (const prop of PROPERTIES) {
    const { beds, baths, sqft, ...rest } = prop;
    await insert('properties', {
      ...rest,
      bedrooms: beds,
      bathrooms: baths,
      squareFeet: sqft,
      lotSize: prop.lotSize || 0,
    });
  }
  for (const t of TESTIMONIALS) await insert('testimonials', t);
  for (const s of SERVICES) await insert('services', s);

  await insert('users', {
    id: 'u_admin',
    name: 'Admin',
    email: 'admin@estatehub.com',
    passwordHash: hash,
    role: 'admin',
  });
  await insert('users', {
    id: 'u_demo',
    name: 'Demo User',
    email: 'demo@estatehub.com',
    passwordHash: hash,
    role: 'user',
  });
}

export default { query, read, insert, update, remove, findBy, findByEmail, initDb, seedDb };