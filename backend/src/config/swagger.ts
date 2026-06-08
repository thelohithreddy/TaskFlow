import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow Pro API',
      version: '1.0.0',
      description: 'Enterprise Task Management SaaS API Documentation',
      contact: {
        name: 'TaskFlow Pro Support',
        email: 'support@taskflow.pro',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'cancelled'] },
            dueDate: { type: 'string', format: 'date-time' },
            assignedTo: { type: 'string' },
            createdBy: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', example: 'jane@example.com' },
            password: { type: 'string', example: 'SecurePass123' },
            role: { type: 'string', enum: ['user', 'admin'] },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'jane@example.com' },
            password: { type: 'string', example: 'SecurePass123' },
          },
        },
        CreateTaskRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Deploy v2.0' },
            description: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'cancelled'] },
            dueDate: { type: 'string', format: 'date-time' },
            assignedTo: { type: 'string' },
          },
        },
        Analytics: {
          type: 'object',
          properties: {
            totalUsers: { type: 'number' },
            totalTasks: { type: 'number' },
            completedTasks: { type: 'number' },
            pendingTasks: { type: 'number' },
            highPriorityTasks: { type: 'number' },
            recentActivity: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
          },
          responses: {
            201: { description: 'User registered successfully' },
            400: { description: 'Validation error' },
            409: { description: 'Email already exists' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh access token',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { refreshToken: { type: 'string' } },
                },
              },
            },
          },
          responses: { 200: { description: 'Token refreshed' } },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout user',
          responses: { 200: { description: 'Logout successful' } },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          responses: { 200: { description: 'Current user data' } },
        },
      },
      '/users/profile': {
        get: {
          tags: ['Users'],
          summary: 'Get user profile',
          responses: { 200: { description: 'Profile retrieved' } },
        },
        patch: {
          tags: ['Users'],
          summary: 'Update user profile',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Profile updated' } },
        },
      },
      '/users/change-password': {
        patch: {
          tags: ['Users'],
          summary: 'Change password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    currentPassword: { type: 'string' },
                    newPassword: { type: 'string' },
                    confirmPassword: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Password changed' } },
        },
      },
      '/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'List tasks with pagination and filters',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
            { name: 'status', in: 'query', schema: { type: 'string' } },
            { name: 'priority', in: 'query', schema: { type: 'string' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Tasks list' } },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create a new task',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTaskRequest' } } },
          },
          responses: { 201: { description: 'Task created' } },
        },
      },
      '/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Task details' } },
        },
        patch: {
          tags: ['Tasks'],
          summary: 'Update task',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Task updated' } },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Soft delete task',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Task deleted' } },
        },
      },
      '/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'List all users',
          responses: { 200: { description: 'Users list' } },
        },
      },
      '/admin/users/{id}': {
        delete: {
          tags: ['Admin'],
          summary: 'Delete user',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User deleted' } },
        },
      },
      '/admin/tasks': {
        get: {
          tags: ['Admin'],
          summary: 'List all platform tasks',
          responses: { 200: { description: 'All tasks' } },
        },
      },
      '/admin/analytics': {
        get: {
          tags: ['Admin'],
          summary: 'Get platform analytics',
          responses: {
            200: {
              description: 'Analytics data',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Analytics' } } },
            },
          },
        },
      },
      '/admin/audit-logs': {
        get: {
          tags: ['Admin'],
          summary: 'Get audit logs',
          responses: { 200: { description: 'Audit logs' } },
        },
      },
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          security: [],
          responses: { 200: { description: 'Service health status' } },
        },
      },
    },
  },
  apis: ['./src/routes/v1/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'TaskFlow Pro API Docs',
  }));
  app.get('/api-docs.json', (_req, res) => {
    res.json(swaggerSpec);
  });
};
