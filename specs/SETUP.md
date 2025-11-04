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

- **Frontend:** Node.js HTTP server on port 3000
- **Backend:** API server on port 3001
- **Frontend calls backend API directly** at `http://localhost:3001/api`

## Project Structure

```
conductor/
├── frontend/          # Frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── server.js
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
- `npm run start:frontend` - Start frontend server
- `npm run start:backend` - Start backend API
