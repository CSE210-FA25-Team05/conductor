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

## Adding New Tables

When you need to add a new table to the database:

### Step 1: Add Model to Schema
Edit `prisma/schema.prisma` and add your new model:

```prisma
model NewTable {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar
  created_at DateTime @default(now()) @map("created_at") @db.Timestamp(6)
  updated_at DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamp(6)
  deleted_at DateTime? @map("deleted_at") @db.Timestamp(6)

  @@map("new_table")
}
```

### Step 2: Push to Database
Create the table in the database:
```bash
npm run prisma:push
```

### Step 3: Generate Client
Update Prisma Client with the new model:
```bash
npm run prisma:generate
```

That's it! The new table is created and ready to use.

**For production:** Use `npm run prisma:migrate` instead of `prisma:push` to create version-controlled migration files.

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

### Seed Database
Populate the database with sample data:
```bash
npm run prisma:seed
```

This will:
- Clear existing data (users, courses, teams, enrollments, etc.)
- Insert sample users (professor, TA, students)
- Create sample courses (CSE210, CSE110)
- Set up teams, enrollments, lectures, and attendance records

**Note:** The seed script clears all existing data before inserting. Edit `prisma/seed.js` to customize the seed data.

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

**Where SQL is generated:**
- Migration files are saved to: `prisma/migrations/YYYYMMDDHHMMSS_migration_name/migration.sql`
- Each migration contains the SQL code to apply that change
- These files are version controlled and can be reviewed before applying

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
