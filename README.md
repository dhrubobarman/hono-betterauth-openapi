# Bun + Hono + Drizzle ORM + PostgreSQL Skeleton

## Setup

1. Install dependencies:

```bash
bun install
```

2. Copy `.env` and set your PostgreSQL connection string:

```
DATABASE_URL=postgres://user:password@localhost:5432/dbname
```

3. Run the development server:

```bash
bun run src/index.ts
```

- Visit [http://localhost:3000](http://localhost:3000)

## Stack
- [Bun](https://bun.sh) (runtime)
- [Hono](https://hono.dev) (web framework)
- [Drizzle ORM](https://orm.drizzle.team) (ORM)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)

## Project Structure
- `src/index.ts` — main entry point
- `.env` — environment variables
- `.gitignore` — recommended ignores

---

This project was created using `bun init` and customized for Hono, Drizzle ORM, and PostgreSQL.
