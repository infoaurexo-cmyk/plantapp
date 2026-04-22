const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DATABASE_PATH || './plant_app.db';
let db = null;

try {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error(`Database connection error at ${DB_PATH}:`, err.message);
      throw err;
    }
  });
} catch (err) {
  console.error(`Fatal: Cannot initialize database at ${DB_PATH}:`, err.message);
  process.exit(1);
}

// Initialize database with tables
const initializeDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Plants table
    db.run(`
      CREATE TABLE IF NOT EXISTS plants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        species TEXT,
        type TEXT,
        location TEXT,
        water_frequency TEXT,
        sunlight_requirement TEXT,
        notes TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Plant analysis records
    db.run(`
      CREATE TABLE IF NOT EXISTS plant_analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_id INTEGER NOT NULL,
        symptoms TEXT,
        detected_issue TEXT,
        severity TEXT,
        recommendations TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plant_id) REFERENCES plants(id)
      )
    `);

    // Disease/pest database
    db.run(`
      CREATE TABLE IF NOT EXISTS diseases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        symptoms TEXT,
        organic_remedies TEXT,
        prevention_tips TEXT,
        affected_plants TEXT,
        severity_level TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Care recommendations
    db.run(`
      CREATE TABLE IF NOT EXISTS care_tips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_type TEXT NOT NULL,
        care_category TEXT,
        tip TEXT,
        frequency TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database initialized successfully');
  });
};

// Helper functions for database operations
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  db,
  initializeDatabase,
  dbRun,
  dbGet,
  dbAll
};
