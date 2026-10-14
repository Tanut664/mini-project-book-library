const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// GET all books, with optional search/category/status filters.
app.get('/api/books', (req, res) => {
  const { search = '', category = '', status = '' } = req.query;
  let sql = 'SELECT * FROM books WHERE 1=1';
  const params = {};

  if (search.trim()) {
    sql += ' AND (title LIKE @search OR author LIKE @search)';
    params.search = `%${search.trim()}%`;
  }
  if (category) {
    sql += ' AND category = @category';
    params.category = category;
  }
  if (status) {
    sql += ' AND status = @status';
    params.status = status;
  }
  sql += ' ORDER BY id DESC';

  res.json(db.prepare(sql).all(params));
});

app.get('/api/categories', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM books ORDER BY category').all();
  res.json(rows.map(r => r.category));
});

app.post('/api/books', (req, res) => {
  const { title, author, category, year, status = 'Available' } = req.body;
  if (!title?.trim() || !author?.trim() || !category?.trim()) {
    return res.status(400).json({ error: 'Title, author and category are required.' });
  }
  const result = db.prepare(`
    INSERT INTO books (title, author, category, year, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(title.trim(), author.trim(), category.trim(), year ? Number(year) : null, status);
  res.status(201).json(db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid));
});

app.put('/api/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, author, category, year, status } = req.body;
  if (!title?.trim() || !author?.trim() || !category?.trim()) {
    return res.status(400).json({ error: 'Title, author and category are required.' });
  }
  const result = db.prepare(`
    UPDATE books SET title=?, author=?, category=?, year=?, status=? WHERE id=?
  `).run(title.trim(), author.trim(), category.trim(), year ? Number(year) : null, status || 'Available', id);
  if (!result.changes) return res.status(404).json({ error: 'Book not found.' });
  res.json(db.prepare('SELECT * FROM books WHERE id = ?').get(id));
});

app.delete('/api/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare('DELETE FROM books WHERE id = ?').run(id);
  if (!result.changes) return res.status(404).json({ error: 'Book not found.' });
  res.json({ message: 'Book deleted successfully.' });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', database: 'SQLite' }));

app.get('*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Book Library running at http://localhost:${PORT}`);
  console.log('Database: SQLite (server/data/library.db)');
});
