# Conductor

Monorepo with HTML/CSS/JavaScript frontend and backend.

## Quick Start

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

See [specs/SETUP.md](specs/SETUP.md) for detailed setup instructions.

## Running Servers

### Run Both (Recommended)

```bash
npm run dev
```

### Run Only Frontend

```bash
npm run dev:frontend
```
Opens on http://localhost:5173

### Run Only Backend

```bash
npm run dev:backend
```

Opens on http://localhost:3001

## Technology Versions

### Runtime

- **Node.js**: v22.12.0 (minimum v14+)
- **npm**: 8.19.4 (minimum v6+)

## Development Tools

### Nodemon

We use **nodemon** for development. It automatically restarts the server when you save file changes, so you don't need to manually stop and restart the server after each edit.

**Without nodemon:**

- Edit file → Stop server → Start server → See changes

**With nodemon:**

- Edit file → Changes appear automatically

**Commands:**

- `npm run dev` - Uses nodemon (auto-restart on changes)
- `npm start` - Uses plain node (manual restart required)
