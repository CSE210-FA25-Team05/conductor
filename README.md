# Conductor

Monorepo containing the full-stack web application with a **JavaScript/HTML/CSS frontend** and a **Node.js + Fastify backend**.

### Start dev server with Docker

```bash
docker compose up --build
```

After it finishes:

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:3001](http://localhost:3001)
* **Postgres:** localhost:5432 (internal service name: `db`)

### Stop Containers

```bash
docker compose down
```

To reset database data:

```bash
docker compose down -v
```

# Technology Versions

* **Node.js:** v22.12.0
* **npm:** 8.19.4
* **PostgreSQL:** 16
* **Docker Compose:** v2+
