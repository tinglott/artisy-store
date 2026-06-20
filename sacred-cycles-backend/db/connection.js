const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_DIR = process.env.DB_DIR || path.join(__dirname, "..", "data");
const DB_PATH = path.join(DB_DIR, "sacred_cycles.db");

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// Create tables on first run
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT    NOT NULL UNIQUE,
    source      TEXT    DEFAULT 'landing_page',
    placement   TEXT,
    confirmed   INTEGER DEFAULT 0,
    unsubscribed INTEGER DEFAULT 0,
    created_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
  CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
`);

module.exports = db;
