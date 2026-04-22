const pg = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'plant_app'
};

const pool = new pg.Pool(dbConfig);
let db = pool;

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Initialize database with tables
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Plants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS plants (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        species TEXT,
        type TEXT,
        location TEXT,
        water_frequency TEXT,
        sunlight_requirement TEXT,
        notes TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Plant analysis records
    await client.query(`
      CREATE TABLE IF NOT EXISTS plant_analysis (
        id SERIAL PRIMARY KEY,
        plant_id INTEGER NOT NULL,
        symptoms TEXT,
        detected_issue TEXT,
        severity TEXT,
        recommendations TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plant_id) REFERENCES plants(id)
      )
    `);

    // Disease/pest database
    await client.query(`
      CREATE TABLE IF NOT EXISTS diseases (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        symptoms TEXT,
        organic_remedies TEXT,
        prevention_tips TEXT,
        affected_plants TEXT,
        severity_level TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Care recommendations
    await client.query(`
      CREATE TABLE IF NOT EXISTS care_tips (
        id SERIAL PRIMARY KEY,
        plant_type TEXT NOT NULL,
        care_category TEXT,
        tip TEXT,
        frequency TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

// Helper functions for database operations
const dbRun = (sql, params = []) => {
  return pool.query(sql, params);
};

const dbGet = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return result.rows[0];
};

const dbAll = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return result.rows;
};

module.exports = {
  db: pool,
  initializeDatabase,
  dbRun,
  dbGet,
  dbAll
};
