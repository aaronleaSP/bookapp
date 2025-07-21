const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  db.query('SELECT * FROM books WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Book not found' });
    res.json(results[0]);
  });
});

router.post('/', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ message: 'Title and author required' });

  db.query('INSERT INTO books (title, author) VALUES (?, ?)', [title, author], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ id: result.insertId, title, author });
  });
});

router.put('/:id', (req, res) => {
  const { title, author } = req.body;
  db.query('UPDATE books SET title = ?, author = ? WHERE id = ?', [title, author, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Book not found' });
    res.json({ id: req.params.id, title, author });
  });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM books WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Book not found' });
    res.status(204).send();
  });
});

module.exports = router;
