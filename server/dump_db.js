const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'agrisage.db'));

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    location TEXT DEFAULT 'India',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

console.log('--- USERS ---');
const users = db.prepare('SELECT id, name, email, location, created_at FROM users').all();
console.table(users);

console.log('\n--- ACTIVITIES ---');
const activities = db.prepare('SELECT * FROM activities ORDER BY timestamp DESC').all();
console.table(activities);
