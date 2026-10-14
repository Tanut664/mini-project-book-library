const Database = require('better-sqlite3');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const fs = require('fs');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'library.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    year INTEGER,
    status TEXT NOT NULL DEFAULT 'Available',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const count = db.prepare('SELECT COUNT(*) AS count FROM books').get().count;
if (count === 0) {
  const insert = db.prepare(`INSERT INTO books (title, author, category, year, status) VALUES (?, ?, ?, ?, ?)`);
  const seed = db.transaction(() => {
    insert.run('Clean Code', 'Robert C. Martin', 'Programming', 2008, 'Available');
    insert.run('The Pragmatic Programmer', 'Andrew Hunt', 'Programming', 1999, 'Borrowed');
    insert.run('Introduction to Algorithms', 'Thomas H. Cormen', 'Computer Science', 2009, 'Available');
    insert.run('Digital Signal Processing', 'John G. Proakis', 'Electrical Engineering', 2007, 'Available');
  });
  seed();
}

module.exports = db;
