const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authRoutes = require('../src/routes/auth');
const leaveRoutes = require('../src/routes/leaves');
const User = require('../src/models/User.model');
const Leave = require('../src/models/Leave.model');
const { errorHandler, notFound } = require('../src/middleware/error');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);
app.use(notFound);
app.use(errorHandler);

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '7d';

let mongoServer;

describe('Route Tests', () => {
  beforeAll(async () => {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }, 60000);

  afterAll(async () => {
    // Clean up and disconnect
    await mongoose.disconnect();
    await mongoServer.stop();
  }, 60000);

  beforeEach(async () => {
    // Clear collections before each test
    await User.deleteMany({});
    await Leave.deleteMany({});
  });

  describe('POST /api/auth/login', () => {
    it('should return token when login is successful', async () => {
      // Create a test user first
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee'
      });
      await user.save();

      // Attempt to login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(typeof response.body.token).toBe('string');
      
      // Verify token is valid
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('sub');
      expect(decoded).toHaveProperty('role', 'employee');
    });
  });

  describe('POST /api/leaves', () => {
    it('should create a leave when authenticated as employee', async () => {
      // Create and authenticate a user
      const user = new User({
        name: 'Employee User',
        email: 'employee@example.com',
        password: 'password123',
        role: 'employee'
      });
      await user.save();

      // Generate token
      const token = jwt.sign(
        { sub: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Create leave request
      const leaveData = {
        startDate: '2025-12-20',
        endDate: '2025-12-22',
        reason: 'Medical appointment'
      };

      const response = await request(app)
        .post('/api/leaves')
        .set('Authorization', `Bearer ${token}`)
        .send(leaveData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('reason', 'Medical appointment');
      expect(response.body).toHaveProperty('status', 'pending');
      expect(response.body).toHaveProperty('employee');
      expect(response.body).toHaveProperty('_id');
    });
  });

  describe('GET /api/leaves', () => {
    it('should return all leaves when authenticated as manager', async () => {
      // Create manager user
      const manager = new User({
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'password123',
        role: 'manager'
      });
      await manager.save();

      // Create employee user
      const employee = new User({
        name: 'Employee User',
        email: 'employee@example.com',
        password: 'password123',
        role: 'employee'
      });
      await employee.save();

      // Create some leave records
      await Leave.create([
        {
          employee: employee._id,
          startDate: new Date('2025-12-20'),
          endDate: new Date('2025-12-25'),
          reason: 'Holiday trip',
          status: 'pending'
        },
        {
          employee: employee._id,
          startDate: new Date('2025-12-15'),
          endDate: new Date('2025-12-16'),
          reason: 'Flu',
          status: 'approved'
        }
      ]);

      // Generate manager token
      const token = jwt.sign(
        { sub: manager._id, role: manager.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Get all leaves
      const response = await request(app)
        .get('/api/leaves')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('status');
      expect(response.body[0]).toHaveProperty('reason');
      expect(response.body[0]).toHaveProperty('employee');
    });
  });
});
