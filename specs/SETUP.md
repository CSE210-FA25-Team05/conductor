# Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```
   
   (Installs root, frontend, and backend dependencies)

2. **Start both servers:**
   ```bash
   npm run dev
   ```
   
   Or run independently:
   ```bash
   # Terminal 1 - Backend API
   npm run dev:backend
   
   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

3. **Open browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Development

- **Frontend:** Vite dev server on port 3000
- **Backend:** API server on port 3001
- **API Proxy:** Frontend proxies `/api/*` to backend

## Project Structure

```
conductor/
├── frontend/          # Frontend (Vite)
│   ├── index.html
│   └── src/
│       ├── js/
│       └── styles/
└── backend/           # Backend API
    └── src/
        └── server.js
```

## Commands

- `npm run install:all` - Install all dependencies (root, frontend, backend)
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Frontend only (port 3000)
- `npm run dev:backend` - Backend only (port 3001)
- `npm run start:frontend` - Build and preview frontend
- `npm run start:backend` - Start backend API
