# Hono Backend with BetterAuth and OpenAPI

A modern backend application built with [Hono](https://hono.dev/), featuring authentication via BetterAuth, OpenAPI documentation, and PostgreSQL database integration using Drizzle ORM.

## Features

- 🚀 Built with [Bun](https://bun.sh/) and [Hono](https://hono.dev/)
- 🔒 Authentication using BetterAuth
- 📖 OpenAPI documentation with Scalar API Reference
- 🗃️ PostgreSQL database with Drizzle ORM
- 🔍 Request validation using Zod
- 📝 Logging with Pino
- ✨ TypeScript for type safety
- 🧪 Testing with Vitest

## Prerequisites

- [Bun](https://bun.sh/) (Latest version)
- PostgreSQL database
- Node.js 18+ (for development tools)

## Setup

1. Install dependencies:

```bash
bun install
```

2. Set up your environment variables:
   Create a `.env` file in the root directory with the following required variables:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/your_database

# Server Configuration
PORT=4000                  # Default port for the server
LOG_LEVEL=debug           # One of: fatal, error, warn, info, debug, trace, silent
NODE_ENV=development     # Environment: development, production, etc.

# OAuth Configuration (for GitHub authentication)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Each variable is validated using Zod schema validation:

- `DATABASE_URL`: PostgreSQL connection string (required)
- `PORT`: Server port number (defaults to 4000)
- `LOG_LEVEL`: Logging level for Pino logger (required)
- `NODE_ENV`: Environment name (defaults to "development")
- `GITHUB_CLIENT_ID`: GitHub OAuth app client ID (required for authentication)
- `GITHUB_CLIENT_SECRET`: GitHub OAuth app client secret (required for authentication)

3. Run database migrations:

```bash
bun run drizzle:push
```

4. Start the development server:

```bash
bun run dev
```

The server will start on `http://localhost:3000` by default.

## Available Scripts

- `bun run dev` - Start the development server with hot reload
- `bun run build` - Build the application
- `bun run test` - Run tests with Vitest
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Fix ESLint issues

### Database Management

- `bun run drizzle:generate` - Generate Drizzle migrations
- `bun run drizzle:migrate` - Run migrations
- `bun run drizzle:push` - Push schema changes to database
- `bun run drizzle:studio` - Open Drizzle Studio for database management

## Project Structure

```
src/
├── db/                 # Database configuration, schemas and migrations
├── lib/               # Core library code and configuration
├── middlewares/       # Hono middlewares (error handling, logging)
├── openapi/           # OpenAPI configuration and schemas
├── routes/            # API routes and handlers
├── types/             # TypeScript type definitions
└── utils/             # Utility functions and error classes
```

## API Documentation

Once the server is running, you can access the API documentation at:

- Visit [http://localhost:3000/reference](http://localhost:3000/reference) - Interactive API documentation using Scalar UI
- `/docs` - OpenAPI documentation in JSON format

The Scalar UI provides a modern, interactive interface for exploring and testing your API endpoints.

## Authentication

This project uses BetterAuth for authentication, providing:

- User registration and login
- Session management
- Two-factor authentication
- Account verification
- JWT management

## Tech Stack

- [Bun](https://bun.sh) - JavaScript runtime and package manager
- [Hono](https://hono.dev) - Fast, lightweight web framework
- [BetterAuth](https://better-auth.dev) - Authentication library
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Zod](https://zod.dev) - TypeScript-first schema validation
- [Pino](https://getpino.io) - Fast Node.js logger
- [Vitest](https://vitest.dev) - Testing framework

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
