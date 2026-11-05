import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('Backend API Automation Suite', () => {
  describe('Health Check Endpoint', () => {
    it('GET /health-check should return 200 and healthy status', async () => {
      const res = await request(app).get('/health-check');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'RockLizard Health is fine');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('Route 404 Handler', () => {
    it('GET /api/v1/unknown-route should return 404 with structured error', async () => {
      const res = await request(app).get('/api/v1/unknown-route');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Cannot find /api/v1/unknown-route on this server');
    });
  });

  describe('Authentication & Authorization Guards', () => {
    it('GET /api/v1/auth/me without token should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Missing access token');
    });

    it('GET /api/v1/dashboard/summary without token should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/dashboard/summary');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('POST /api/v1/treks without token should return 401 Unauthorized', async () => {
      const res = await request(app).post('/api/v1/treks').send({ name: 'Test Trek' });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('POST /api/v1/expeditions without token should return 401 Unauthorized', async () => {
      const res = await request(app).post('/api/v1/expeditions').send({ name: 'Test Expedition' });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('Input Validation & Error Handling', () => {
    it('POST /api/v1/auth/login with invalid email and short password should return 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'not-an-email', password: '123' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('errors');
    });

    it('POST /api/v1/enquiries with empty payload should return 400 Bad Request', async () => {
      const res = await request(app).post('/api/v1/enquiries').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('errors');
    });
  });
});

