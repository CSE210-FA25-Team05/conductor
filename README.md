````markdown
# Conductor

Monorepo with HTML/CSS/JavaScript frontend and backend.

## Quick Start (without Docker)

```bash
npm run install:all
npm run dev
````

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:3001](http://localhost:3001)

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

Opens on [http://localhost:3000](http://localhost:3000)

### Run Only Backend

```bash
npm run dev:backend
```

Opens on [http://localhost:3001](http://localhost:3001)

## Run with Docker (alternative)

If you have Docker installed, you can run the whole stack (database, backend, frontend) with one command.

### Prerequisites

* Docker Desktop (or Docker Engine) installed and running

### Start all services

From the project root:

```bash
docker compose build
docker compose up
```

This will start:

* PostgreSQL database (inside a container)
* Backend API on **[http://localhost:3001](http://localhost:3001)**
* Frontend on **[http://localhost:5173](http://localhost:5173)**

### Access in browser

* Frontend app:
  [http://localhost:5173](http://localhost:5173)

* Backend health check:
  [http://localhost:3001/api/health](http://localhost:3001/api/health)

If everything is working, `/api/health` will return:

```json
{ "ok": true, "time": "..." }
```

### Stop the services

In the same terminal where `docker compose up` is running, press `Ctrl + C`, or run:

```bash
docker compose down
```

If you also want to clear database data:

```bash
docker compose down -v
```

## Technology Versions

### Runtime

* **Node.js**: v22.12.0 (minimum v14+)
* **npm**: 8.19.4 (minimum v6+)

## Development Tools

### Nodemon

We use **nodemon** for development. It automatically restarts the server when you save file changes, so you don't need to manually stop and restart the server after each edit.

**Without nodemon:**

* Edit file → Stop server → Start server → See changes

**With nodemon:**

* Edit file → Changes appear automatically

**Commands:**

* `npm run dev` - Uses nodemon (auto-restart on changes)
* `npm start` - Uses plain node (manual restart required)
