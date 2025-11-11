# Backend

Express server.









# Google OAuth Login Test (Fastify + Dummy Frontend)

This demonstrates how to integrate Google OAuth 2.0 login with backend and a minimal HTML frontend.
Only verified UCSD emails are allowed to sign in.

## Project Structure

```
backend/
├─ src/
│  ├─ routes/              # Fastify route definitions (e.g. /auth/oauth/google)
│  ├─ services/            # Business logic (OAuth login handling)
│  ├─ repos/               # Future DB/data access layer
│  ├─ .env                 # Environment variables (Google OAuth credentials)
│  ├─ server.js            # Main backend entry (for production)
│  └─ server.authtest.js   # Auth-only test server (use this for login testing)
│
└─ dummy_frontend/
   ├─ index.html           # Login page with "Sign in with Google" button
   └─ app.html             # Simple profile display page after login
```

## Run the servers

#### 1.Start backend

```bash
node src/server.authtest.js
```

> The backend runs at **[http://localhost:3001](http://localhost:3001/)**

#### 2.Start dummy frontend

In another terminal:

```
npx serve dummy_frontend/auth -l 3000
```

> The frontend runs at **[http://localhost:3000](http://localhost:3000/)**

## Login Flow

1. Open **[http://localhost:3000](http://localhost:3000/)**
2. Click **“Sign in with Google”**
3. You’ll be redirected to Google’s consent screen
4. After successful login → redirected back to `app.html` showing your UCSD email
