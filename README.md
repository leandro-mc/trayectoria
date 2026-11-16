# TrayectorIA

> Leer en español: [README.es.md](README.es.md)

**AI-powered job networking platform** that connects candidates with companies. Candidates build a profile, get an AI-generated CV tailored to a job offer and practice mock interviews; companies publish offers and manage applications.

This monorepo contains both halves of the project, with the full commit history of each one preserved:

| Folder | What it is | Stack |
|---|---|---|
| [`backend/`](backend) | REST API, security, AI integration and persistence | Kotlin, Java 21, Spring Boot 3.5, Spring AI, PostgreSQL, Gradle |
| [`frontend/`](frontend) | Web client for candidates and companies | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |

## Features

**Candidates**
- Public job catalog with search, registration and login
- Profile with experience, education, skills and languages
- Applications with status tracking and saved offers
- **AI-generated CV** tailored to a specific offer
- **AI mock interviews**, chat-style, driven by the instructions of the job offer

**Companies**
- Dashboard with company stats
- Create and edit job offers
- Review applications and update their status

**Platform**
- Two roles (candidate / company) with JWT authentication, refresh tokens and role-based route protection
- Light / dark theme
- Voice interviews: planned (the API only exposes a feature flag for now)

## Highlights

- **Use-case oriented backend:** one class per use case in `application/`, AI behind an output port, JPA and security in `infrastructure/`, controllers and MapStruct mappers in `web/`.
- **Database migrations with Flyway** and integration tests with **JUnit 5 + Testcontainers**.
- **Spring AI + OpenAI** for CV generation and interview simulation.
- **Frontend organised by feature:** each domain module (auth, candidate, company, jobs, applications, ai…) owns its `api/`, `components/`, `hooks/` and `schemas/`. Data flow: component → custom hook (TanStack Query) → API function → Axios client → backend.
- Forms validated with React Hook Form + Zod; server state with TanStack Query; client state with Zustand.
- Interactive API documentation with SpringDoc / Swagger UI, plus Docker and Railway deploy configuration.

## Architecture

```
┌──────────────────────┐   HTTPS / JSON (JWT)   ┌────────────────────────────┐     ┌────────────┐
│  frontend (Next.js)  │ ─────────────────────▶ │  backend (Spring Boot)     │ ──▶ │ PostgreSQL │
│  :3000               │ ◀───────────────────── │  REST API · :8080/api      │ ◀── │   :5434    │
└──────────────────────┘                        └─────────────┬──────────────┘     └────────────┘
                                                              │
                                                              ▼
                                                        OpenAI API (CV + interviews)
```

## Run it locally

Requirements: JDK 21, Docker and Node.js 20+. An OpenAI API key is needed for the AI features.

```bash
git clone https://github.com/leandro-mc/trayectoria.git
cd trayectoria

# 1. Backend  (API on http://localhost:8080/api, Swagger UI at /api/swagger-ui/index.html)
cd backend
cp .env.example .env          # DB, JWT secret, OpenAI key
docker compose up -d          # PostgreSQL only
./gradlew bootRun

# 2. Frontend (new terminal, app on http://localhost:3000)
cd frontend
cp .env.example .env          # NEXT_PUBLIC_API_URL=http://localhost:8080/api
npm install
npm run dev
```

More details in each project's README: [backend](backend/README.md) · [frontend](frontend/README.md).

## Repository notes

This repository was built by merging the former `trayectoria-backend` and `trayectoria-web` repositories (rewritten into `backend/` and `frontend/`) so the history of both is kept: `git log -- backend` and `git log -- frontend` show each project's own commits. Unmerged side branches are preserved as `backend/develop` and `frontend/develop`.

## License

[MIT](backend/LICENSE)
