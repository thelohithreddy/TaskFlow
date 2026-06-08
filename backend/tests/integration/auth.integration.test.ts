import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();

describe('Auth Integration', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe('test@example.com');
  });

  it('should login with valid credentials', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'LoginPass123',
      });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'login@example.com',
        password: 'LoginPass123',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.tokens.accessToken).toBeDefined();
  });

  it('should reject invalid login', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'WrongPass123',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
