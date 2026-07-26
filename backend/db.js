// ============================================================
// db.js
// Sets up the SQLite database connection using better-sqlite3.
// On first run (or if the DB file is missing/empty) it will
// automatically create the schema and load sample seed data
// from the /database folder at the project root.
// ============================================================

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_DIR = path.join(__dirname, '..', 'database');
const DB_PATH = path.join(DB_DIR, 'scholarship.db');
const SCHEMA_PATH = path.join(DB_DIR, 'schema.sql');
const SEED_PATH = path.join(DB_DIR, 'seed.sql');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function tableExists(name) {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?")
    .get(name);
  return !!row;
}

function initializeDatabase() {
  const needsSchema = !tableExists('applications');

  if (needsSchema) {
    console.log('[db] Initializing schema...');
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schemaSql);

    const count = db.prepare('SELECT COUNT(*) AS c FROM applications').get().c;
    if (count === 0 && fs.existsSync(SEED_PATH)) {
      console.log('[db] Loading seed data...');
      const seedSql = fs.readFileSync(SEED_PATH, 'utf8');
      db.exec(seedSql);
    }
  } else {
    const count = db.prepare('SELECT COUNT(*) AS c FROM applications').get().c;
    if (count === 0 && fs.existsSync(SEED_PATH)) {
      console.log('[db] Table empty, loading seed data...');
      const seedSql = fs.readFileSync(SEED_PATH, 'utf8');
      db.exec(seedSql);
    }
  }
}

initializeDatabase();

module.exports = db;
