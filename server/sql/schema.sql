-- Run this in psql as the postgres superuser:
--   psql -U postgres -f server/sql/schema.sql
--
-- Or step by step:
--   createdb -U postgres estatehub
--   psql -U postgres -d estatehub -f server/sql/schema.sql

DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS newsletter CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agents (
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

CREATE TABLE properties (
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

CREATE TABLE testimonials (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  rating INTEGER DEFAULT 5,
  property VARCHAR(255),
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE services (
  id VARCHAR(50) PRIMARY KEY,
  icon VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
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

CREATE TABLE newsletter (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE favorites (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  property_id VARCHAR(50) REFERENCES properties(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);