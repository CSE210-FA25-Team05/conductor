# Backend Team Meeting Notes

**Date:** November 6, 2025  
**Location:** Grad Housing (Offline Meeting)

---

## Sprint One Planning

### Assigned Issues

- Google OAuth implementation
- PostgreSQL setup
- ADRs for Fastify
- Research on testing and mock data backend frameworks

---

## Setup & Environment

- Everyone set up Node.js environment
- Tested initial frontend and backend server (working)
- Decided to use **Prisma** as ORM
- Will use **Postman** to test APIs

---

## API Routes Discussion

### Authentication Routes

- `GET /auth/oauth/google` (optional)
- `POST /auth/oauth/google/add_token`
- `POST /auth/logout`

### User Routes

- `GET /users/<uuid>` - Return profile info
- `GET /users` - List of all users (maybe?)

### Course Routes

- `GET /courses` - List all courses
- `GET /courses/<course_id>/users` - Course directory
- `GET /courses/<course_id>/users/<uuid>` - User profile in context of course
- `POST /courses/<course_id>/add-user` - Add user to course
- `POST /courses/<course_id>/delete-user` - Remove user from course

### Additional Notes

- Need to brainstorm more POST APIs to update database

---

## Open Questions / Postponed Items

### Non-UCSD Student Login

- **Postponed** discussion on how to handle non-UCSD student login
- **Current thinking:** Professor can add email addresses of non-UCSD extension students who are allowed to sign in
- **Question:** Should an email be sent when professor adds a student email? (e.g., "You now have access to the Conductor tool")

---

## Domain/Subdomain Discussion

Professor suggested two options:

1. `conductor.ucsd.edu/course_id/` - **Currently leaning towards this**
2. `course_id.conductor.ucsd.edu/...`

---

## Action Items

- [ ] For PRs: Tag the backend team and TA (Sammed)

---
