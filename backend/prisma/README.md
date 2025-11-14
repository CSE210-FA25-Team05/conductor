# Prisma Setup

Prisma is the ORM (Object-Relational Mapping) tool for this project. It provides type-safe database access.

## Quick Start

1. Install dependencies: `npm install`
2. Set up database connection in `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:<password>@localhost:5432/conductor?schema=public"
   ```
3. Generate Prisma Client: `npm run prisma:generate`

That's it. You're ready to use Prisma.

## Essential Commands

### Generate Prisma Client
Run this after installing dependencies or changing `schema.prisma`:
```bash
npm run prisma:generate
```
This creates the TypeScript types and query functions you use in your code.

## Optional Commands

### View Database in Browser
Open a visual database browser:
```bash
npm run prisma:studio
```
Opens at http://localhost:5555

### Test Database Connection
Quick test to verify Prisma is working:
```bash
npm run test:prisma
```

### Push Schema Changes
If you modify `schema.prisma` and want to update the database:
```bash
npm run prisma:push
```

**Important:** `prisma:push` does NOT destroy all tables. It's safe for most operations:
- Adding new tables or columns - safe, no data loss
- Modifying existing columns (nullable, defaults, etc.) - safe, no data loss
- Adding indexes - safe, no data loss

Data loss only occurs in these specific cases:
- Removing a column deletes that column's data (but other columns remain)
- Removing a table deletes that table and its data (but other tables remain)
- Changing column types incompatibly may lose data

**For production:** Use `prisma:migrate` instead, which creates migration files you can review and version control before applying.

### Create Migration
For production-ready schema changes:
```bash
npm run prisma:migrate
```
This creates migration files that can be version controlled and applied to production.

## Using Prisma in Your Code

```javascript
const prisma = require('./src/prisma');

// Get all users
const users = await prisma.user.findMany();

// Get user by email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Create user
const newUser = await prisma.user.create({
  data: {
    email: 'newuser@example.com',
    firstName: 'John',
    lastName: 'Doe',
    globalRole: 'student'
  }
});
```

## File Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema definition
│   └── README.md          # This file
├── src/
│   └── prisma.js          # Prisma client instance
└── .env                   # Database connection string
```

## Troubleshooting

**Error: Missing DATABASE_URL**
- Make sure `.env` file exists in `backend/` directory
- Check that `DATABASE_URL` is set correctly

**Error: Cannot connect to database**
- Make sure PostgreSQL is running: `brew services start postgresql@15`
- Verify database exists: `psql -d conductor`

**Schema out of sync**
- Run `npm run prisma:generate` after schema changes
- Or run `npm run prisma:push` to sync database with schema
