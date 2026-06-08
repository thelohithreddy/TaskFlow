# TaskFlow Pro

Enterprise-grade task management SaaS built with Node.js, Express, TypeScript, MongoDB, and React. Designed with clean architecture, production security, and deployment readiness.

![Stack](https://img.shields.io/badge/Node.js-20-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-7-green) ![React](https://img.shields.io/badge/React-18-61dafb)

## Project Overview

TaskFlow Pro is a full-stack SaaS application for task management with role-based access control, JWT authentication with refresh tokens, audit logging, admin analytics, and a modern responsive dashboard.

## Features

- **Authentication** — Register, login, logout, JWT access/refresh tokens with rotation
- **User Management** — Profile view/update, password change
- **Task Management** — CRUD, soft delete, pagination, search, filter, sort
- **Admin Panel** — User management, platform-wide tasks, analytics dashboard
- **Audit Logging** — Login, task, and profile events stored in MongoDB
- **API Documentation** — Interactive Swagger UI at `/api-docs`
- **Security** — Helmet, CORS, rate limiting, input validation, bcrypt, sanitization
- **Dark Mode** — Theme toggle on frontend
- **Docker** — Full stack via `docker-compose up`
- **CI/CD** — GitHub Actions pipeline

## Architecture

```
Client (React/Vite) → API Gateway (Express) → Service Layer → Repository Layer → MongoDB
```

**Patterns applied:**
- Clean Architecture with inward dependency flow
- Service Layer for business logic
- Repository Pattern for data access abstraction
- SOLID principles throughout

## Folder Structure

```
taskflow-pro/
├── backend/
│   ├── src/
│   │   ├── config/          # Env, DB, logger, CORS, rate limit, Swagger
│   │   ├── constants/       # Roles, statuses, audit actions
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/v1/       # API route definitions
│   │   ├── middleware/      # Auth, RBAC, validation, errors
│   │   ├── validators/      # express-validator schemas
│   │   ├── utils/           # Helpers, ApiError, ApiResponse
│   │   ├── types/           # TypeScript definitions
│   │   └── scripts/         # Seed script
│   └── tests/               # Unit + integration tests
├── frontend/
│   └── src/
│       ├── components/      # UI, layout, task, admin components
│       ├── pages/           # Route pages
│       ├── context/         # Auth + Theme providers
│       ├── services/        # Axios API clients
│       ├── hooks/           # Custom React hooks
│       └── routes/          # React Router config
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Setup Instructions

### Prerequisites

- Node.js 20+
- MongoDB 7+ (local or Atlas)
- npm

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets (min 32 chars)
npm install
npm run seed    # Optional: seed test data
npm run dev     # http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev     # http://localhost:5173
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection | `mongodb://localhost:27017/taskflow` |
| `JWT_ACCESS_SECRET` | Access token secret (32+ chars) | — |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) | — |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

## API Documentation

Start the backend and visit:

- **Swagger UI:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **OpenAPI JSON:** [http://localhost:5000/api-docs.json](http://localhost:5000/api-docs.json)

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/health` | Public | Health check |
| POST | `/api/v1/auth/register` | Public | Register |
| POST | `/api/v1/auth/login` | Public | Login |
| POST | `/api/v1/auth/refresh` | Public | Refresh tokens |
| POST | `/api/v1/auth/logout` | User | Logout |
| GET | `/api/v1/auth/me` | User | Current user |
| GET | `/api/v1/users/profile` | User | Get profile |
| PATCH | `/api/v1/users/profile` | User | Update profile |
| PATCH | `/api/v1/users/change-password` | User | Change password |
| CRUD | `/api/v1/tasks` | User | Task management |
| GET | `/api/v1/admin/users` | Admin | List users |
| DELETE | `/api/v1/admin/users/:id` | Admin | Delete user |
| GET | `/api/v1/admin/tasks` | Admin | All tasks |
| GET | `/api/v1/admin/analytics` | Admin | Dashboard stats |
| GET | `/api/v1/admin/audit-logs` | Admin | Audit trail |

## Test Credentials

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@taskflow.pro` | `Admin@123456` |
| User | `user@taskflow.pro` | `User@123456` |

## Docker Usage

```bash
# Start entire stack (MongoDB + Backend + Frontend)
docker-compose up --build

# Access:
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# API Docs: http://localhost:5000/api-docs
```

## Deployment

### Backend — Render

1. Connect repo to [Render](https://render.com)
2. Use `backend/render.yaml` blueprint or create a Web Service
3. Set environment variables (`MONGODB_URI`, `FRONTEND_URL`, JWT secrets)
4. Build: `npm install && npm run build`
5. Start: `npm start`

### Backend — Railway

1. Connect repo to [Railway](https://railway.app)
2. Set root directory to `backend`
3. Add MongoDB plugin or use Atlas connection string
4. Configure env vars and deploy

### Frontend — Vercel

1. Import repo to [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Set `VITE_API_URL` to your deployed backend URL
4. Update `vercel.json` rewrite destination to match backend URL

## Testing

```bash
# Backend unit + integration tests
cd backend
npm test

# Type checking
npm run lint        # backend
npm run lint        # frontend (from frontend/)
```

## Scalability Notes

| Strategy | Application |
|----------|-------------|
| **Horizontal Scaling** | Stateless API servers behind a load balancer; JWT eliminates server-side sessions |
| **Load Balancers** | Nginx/ALB distributes traffic; no sticky sessions required |
| **Redis Caching** | Cache analytics dashboard (60s TTL); token revocation blacklist |
| **Queue Systems** | Bull/BullMQ for async audit writes, email notifications, exports |
| **Event-Driven** | Domain events (`task.created`) trigger notifications and analytics updates |
| **Microservices** | Split into Auth, Task, and Notification services at scale |
| **Database Sharding** | Shard by `organizationId` when multi-tenancy is introduced |

## License

MIT
