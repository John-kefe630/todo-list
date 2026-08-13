const request = require('supertest');
const app = require('../app');

describe('Todo API Suite', () => {

  // ---------------------------------------------------------------------------
  // 1. Health Check Test
  // ---------------------------------------------------------------------------
  describe('GET /health', () => {
    it('should return 200 OK with status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  // ---------------------------------------------------------------------------
  // 2. GET /api/todos
  // ---------------------------------------------------------------------------
  describe('GET /api/todos', () => {
    it('should return an array of todos', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // 3. POST /api/todos
  // ---------------------------------------------------------------------------
  describe('POST /api/todos', () => {
    it('should create a new todo with valid title', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'Test CI/CD Pipeline' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toEqual('Test CI/CD Pipeline');
      expect(res.body.completed).toEqual(false);
    });

    it('should return 400 Bad Request when title is empty', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: '' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 Bad Request when title is missing', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ---------------------------------------------------------------------------
  // 4. PUT /api/todos/:id
  // ---------------------------------------------------------------------------
  describe('PUT /api/todos/:id', () => {
    it('should update an existing todo title', async () => {
      // Create a todo first
      const created = await request(app)
        .post('/api/todos')
        .send({ title: 'Original Title' });

      const todoId = created.body.id;

      const res = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual('Updated Title');
    });

    it('should return 404 when updating non-existent todo ID', async () => {
      const res = await request(app)
        .put('/api/todos/999999')
        .send({ title: 'Does Not Exist' });

      expect(res.statusCode).toEqual(404);
    });

    it('should return 400 when ID is not a number', async () => {
      const res = await request(app)
        .put('/api/todos/invalid-id')
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toEqual(400);
    });
  });

  // ---------------------------------------------------------------------------
  // 5. PATCH /api/todos/:id/toggle
  // ---------------------------------------------------------------------------
  describe('PATCH /api/todos/:id/toggle', () => {
    it('should toggle completion state of a todo', async () => {
      const created = await request(app)
        .post('/api/todos')
        .send({ title: 'Toggle Test' });

      const todoId = created.body.id;

      // Initial state is false -> toggle to true
      const res1 = await request(app).patch(`/api/todos/${todoId}/toggle`);
      expect(res1.statusCode).toEqual(200);
      expect(res1.body.completed).toEqual(true);

      // Toggle again -> back to false
      const res2 = await request(app).patch(`/api/todos/${todoId}/toggle`);
      expect(res2.statusCode).toEqual(200);
      expect(res2.body.completed).toEqual(false);
    });

    it('should return 404 when toggling non-existent todo ID', async () => {
      const res = await request(app).patch('/api/todos/999999/toggle');
      expect(res.statusCode).toEqual(404);
    });
  });

  // ---------------------------------------------------------------------------
  // 6. DELETE /api/todos/:id
  // ---------------------------------------------------------------------------
  describe('DELETE /api/todos/:id', () => {
    it('should delete an existing todo', async () => {
      const created = await request(app)
        .post('/api/todos')
        .send({ title: 'Delete Me' });

      const todoId = created.body.id;

      const deleteRes = await request(app).delete(`/api/todos/${todoId}`);
      expect(deleteRes.statusCode).toEqual(204);

      // Verify it was deleted
      const listRes = await request(app).get('/api/todos');
      const found = listRes.body.find(t => t.id === todoId);
      expect(found).toBeUndefined();
    });

    it('should return 404 when deleting non-existent todo ID', async () => {
      const res = await request(app).delete('/api/todos/999999');
      expect(res.statusCode).toEqual(404);
    });
  });
});