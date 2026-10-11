# Supabase/PostgreSQL setup

This project uses Prisma with Supabase-hosted PostgreSQL. No database credentials are included in this repository. Copy `.env.example` to the repository-root `.env` file and enter your own values from the Supabase project settings. Prisma CLI commands load this root `.env` file; Next.js also supports `.env.local`.

- `DATABASE_URL`: the Supavisor/session or transaction pooler URL for application traffic. Use the complete URI Supabase provides, including its pooler username (often `postgres.<project-ref>`), host, and port. Retain the provider query parameters and SSL (`sslmode=require`).
- `DIRECT_URL`: the direct, non-pooled PostgreSQL URL for Prisma migrations. Keep SSL enabled (`sslmode=require`). Direct connections may require IPv6; use the Supabase session pooler if your network cannot reach the direct endpoint.
- URL-encode reserved characters in the database password (for example, `@` as `%40`). Do not add surrounding quotes when entering the URL as a Vercel environment variable.
- Configure both variables separately in Vercel for every environment you deploy (at least Production and Preview). Local `.env` values are not automatically uploaded to Vercel. Redeploy after changing a Vercel variable.

Install dependencies and create the client:

```sh
npm install
npm run prisma:generate
```

For local development, create/update the database from the schema with `npm run db:migrate` (Prisma prompts for a migration name). For a fresh deployment, use `npm run db:deploy` to apply checked-in SQL migrations. `npm run db:push` is available for disposable development databases only; do not use it instead of migrations in production. Use `npm run db:studio` to inspect data.

The first migration SQL is checked in at `prisma/migrations/20261010110700_initial_schema`. After setting the environment values, apply it with `npm run db:deploy`, then run `npm run seed` to create/update the configured initial administrator and the existing site seed data. `ADMIN_INITIAL_EMAIL` and `ADMIN_INITIAL_PASSWORD` must be supplied to seed an administrator.

IDs are UUIDs in PostgreSQL. Existing Mongo ObjectId values are not carried forward or translated. This migration changes the schema and application persistence layer only; it does not transfer existing MongoDB data. Back up/export and plan a separate data migration before switching a populated production site.

Supabase may provide a transaction-pooler URL that is appropriate for app queries, but Prisma migrations need a direct connection. Connection details are only used when running the app or Prisma commands; this code change does not validate cloud connectivity.
