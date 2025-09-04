## nestjs-react-chat

A full‑stack real-time chat application built with NestJS (Node.js, TypeScript, TypeORM, PostgreSQL) and React (CRA, RTK Query, MUI, socket.io). The backend exposes a REST API with JWT authentication and a Socket.IO gateway; the frontend consumes the API and real-time events.

### Monorepo structure

- `server`: NestJS REST API + Socket.IO gateway (PostgreSQL via TypeORM), Swagger docs
- `client`: React app (CRA) with Redux Toolkit Query and Material UI

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+

## Quick start

1) Configure environment variables (see samples below)
2) Install dependencies for both apps
3) Start backend, then start frontend

### 1) Environment variables

Create `.env` files in `server` and `client`.

Server (`server/.env`):
```env
# App
PORT=4000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chat_app
DB_USERNAME=postgres
DB_PASSWORD=postgres
# Auto-sync entities in dev only (migrations recommended for prod)
DB_SYNC=true

# Auth
JWT_SECRET=supersecret_example
JWT_EXPIRES_IN=7d
```

Client (`client/.env`):
```env
# Base URLs
REACT_APP_API_BASE_URL=http://localhost:4000
REACT_APP_API_SOCKET_URL=http://localhost:4000

# REST endpoints (used by RTK Query)
REACT_APP_API_SIGNUP_URL=/auth/signup
REACT_APP_API_SIGNIN_URL=/auth/signin
REACT_APP_API_CHECK_AUTH_URL=/auth/check

REACT_APP_API_USERS_URL=/users
REACT_APP_API_SEARCH_USERS_URL=/users/search
REACT_APP_API_PASSWORD_UPDATE_URL=/users/password

REACT_APP_API_MESSAGES_URL=/messages

REACT_APP_API_ROOMS_URL=/rooms
REACT_APP_API_SEARCH_ROOMS_URL=/rooms/search
```

Notes:
- The client composes requests as `REACT_APP_API_BASE_URL` + the relative endpoint path values above.
- The Socket.IO client connects to `REACT_APP_API_SOCKET_URL` and authenticates by sending the JWT as `auth.token` during connection.

### 2) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3) Run the apps (development)

Backend (NestJS):
```bash
cd server
npm run start:dev
# Swagger UI: http://localhost:4000/api (if PORT=4000)
```

Frontend (React):
```bash
cd client
npm start
# App: http://localhost:3000
```

## API overview

Base URL: `http://localhost:{PORT}` (default `4000`)

- Auth: `POST /auth/signup`, `POST /auth/signin`, `POST /auth/check`
- Users (JWT required):
  - `GET /users`, `GET /users/:id`
  - `GET /users/search?query=...`
  - `PUT /users` (update profile)
  - `PUT /users/password` (update password)
  - `DELETE /users`
- Rooms (JWT required):
  - `GET /rooms`, `GET /rooms/:id`
  - `GET /rooms/search?query=...`
  - `POST /rooms`, `PUT /rooms/:id`, `DELETE /rooms/:id`
- Messages (JWT required):
  - `GET /messages?roomId=...`
  - `POST /messages`

### Realtime (Socket.IO)

- Namespace: default, CORS enabled
- Auth: client connects with `{ auth: { token: <JWT> } }`
- Events:
  - Client -> Server: `join(roomId)`, `leave(roomId)`, `message({ roomId, content })`, `isTyping(roomId)`
  - Server -> Client: `message(message)`, `isTyping(text)`

## Frontend notes

- RTK Query base URL comes from `REACT_APP_API_BASE_URL`
- Endpoints configured via `client/src/config/index.ts`
- Socket service at `client/src/services/socketService.ts`

## Backend notes

- TypeORM configured from env in `server/src/config/typeorm.config.ts`
- Validation schema in `server/src/validation/env.validation.ts`
- Global validation pipe enabled; CORS enabled
- Swagger configured in `server/src/swagger/index.ts` at `/api`

## Scripts

Backend (run inside `server`):
```bash
# Dev
npm run start:dev

# Prod
npm run build && npm run start:prod

# Lint & format
npm run lint
npm run format

# Tests
npm test
npm run test:e2e
npm run test:cov
```

Frontend (run inside `client`):
```bash
npm start
npm run build
npm test
```

## Common issues

- 401/403 errors: ensure JWT is present, valid, and `Authorization: Bearer <token>` is set (handled automatically by the client once signed in).
- Socket not connecting: verify `REACT_APP_API_SOCKET_URL` matches backend host/port and that the JWT is set before connecting.
- Database connection errors: check `DB_*` variables and that PostgreSQL is running and accessible.

## License

MIT