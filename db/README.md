# Database Setup Instructions + Scripts

The steps below will guide you through the steps to set up a database from scratch for use with this project. Later sections also contain information on some useful scripts that can help automate some operations like creating, resetting or seeding the database.

## Step 1 - Install Postgres

Install Postgres on your respective system by following the instructions [here](https://neon.com/postgresql/postgresql-getting-started).

Ensure that you have set up a password for the `postgres` user and are able to connect to the (default) `postgres` database as that user using the following command -

```
psql -U postgres -d postgres

# If you get a peer authentication failed error, try this command instead
# sudo -u postgres psql -d postgres
```

## Step 2 - Create a new database

```
createdb -U postgres conductor
```

This will create a new database to keep all our tables in one place. It will make resetting the database easier without affecting any other databases in your system.

## Step 3 - Create DB Schema

```
psql -U postgres -d conductor -f "sql/init_db.sql"
```

## Step 4 - Populate with seed data (Optional)

```
psql -U postgres -d conductor -f "sql/seed_db.sql"
```

## Other Helper Scripts

### Delete all existing data but keep DB schema

```
psql -U postgres -d conductor -f "sql/empty_db.sql"
```

### Delete DB schema and all existing data

```
psql -U postgres -d conductor -f "sql/destroy_db.sql"
```

## Note

The SQL scripts are environment agnostic. If we need to set up a new database for a test environment, we can do so by creating a new database named `test_conductor` as in Step 2 and then simply follow the rest of the steps.
