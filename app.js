const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// In-Memory Data Store
let todos = [];
let currentId = 1;

// -----------------------------------------------------------------------------
// Health Check Endpoint
// -----------------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// -----------------------------------------------------------------------------
// REST API Endpoints
// -----------------------------------------------------------------------------

// GET /api/todos - Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST /api/todos - Create a todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string.' });
  }

  const newTodo = {
    id: currentId++,
    title: title.trim(),
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id - Update todo title
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string.' });
  }

  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found.' });
  }

  todo.title = title.trim();
  res.json(todo);
});

// PATCH /api/todos/:id/toggle - Toggle completion status
app.patch('/api/todos/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }

  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found.' });
  }

  todo.completed = !todo.completed;
  res.json(todo);
});

// DELETE /api/todos/:id - Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }

  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found.' });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

// 404 Handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

module.exports = app;