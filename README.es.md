# TrayectorIA

> Read in English: [README.md](README.md)

**Plataforma de networking laboral con IA** que conecta candidatos con empresas. Los candidatos arman su perfil, obtienen un CV generado con IA a medida de una oferta y practican entrevistas simuladas; las empresas publican ofertas y gestionan postulaciones.

Este monorepo contiene las dos partes del proyecto, conservando el historial completo de commits de cada una:

| Carpeta | Qué es | Stack |
|---|---|---|
| [`backend/`](backend) | API REST, seguridad, integración con IA y persistencia | Kotlin, Java 21, Spring Boot 3.5, Spring AI, PostgreSQL, Gradle |
| [`frontend/`](frontend) | Cliente web para candidatos y empresas | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |

## Funcionalidades

**Candidatos**
- Catálogo público de ofertas con búsqueda, registro e inicio de sesión
- Perfil con experiencia, educación, habilidades e idiomas
- Postulaciones con seguimiento de estado y ofertas guardadas
- **CV generado con IA** a medida de una oferta
- **Entrevistas simuladas con IA**, en formato chat, guiadas por las instrucciones de la oferta

**Empresas**
- Dashboard con estadísticas de la empresa
- Creación y edición de ofertas
- Revisión de postulaciones y cambio de su estado

**Plataforma**
- Dos roles (candidato / empresa) con autenticación JWT, refresh tokens y protección de rutas por rol
- Tema claro / oscuro
- Entrevistas por voz: planificadas (la API solo expone un feature flag por ahora)

## Puntos destacados

- **Backend orientado a casos de uso:** una clase por caso de uso en `application/`, la IA detrás de un puerto de salida, JPA y seguridad en `infrastructure/`, controladores y mappers MapStruct en `web/`.
- **Migraciones de base de datos con Flyway** y tests de integración con **JUnit 5 + Testcontainers**.
- **Spring AI + OpenAI** para la generación de CV y la simulación de entrevistas.
- **Frontend organizado por feature:** cada módulo de dominio (auth, candidate, company, jobs, applications, ai…) tiene su propio `api/`, `components/`, `hooks/` y `schemas/`. Flujo de datos: componente → hook propio (TanStack Query) → función de API → cliente Axios → backend.
- Formularios validados con React Hook Form + Zod; estado de servidor con TanStack Query; estado de cliente con Zustand.
- Documentación interactiva de la API con SpringDoc / Swagger UI, más configuración de Docker y despliegue en Railway.

## Arquitectura

```
┌──────────────────────┐   HTTPS / JSON (JWT)   ┌────────────────────────────┐     ┌────────────┐
│  frontend (Next.js)  │ ─────────────────────▶ │  backend (Spring Boot)     │ ──▶ │ PostgreSQL │
│  :3000               │ ◀───────────────────── │  API REST · :8080/api      │ ◀── │   :5434    │
└──────────────────────┘                        └─────────────┬──────────────┘     └────────────┘
                                                              │
                                                              ▼
                                                        API de OpenAI (CV + entrevistas)
```

## Ejecutar en local

Requisitos: JDK 21, Docker y Node.js 20+. Para las funciones de IA hace falta una API key de OpenAI.

```bash
git clone https://github.com/leandro-mc/trayectoria.git
cd trayectoria

# 1. Backend  (API en http://localhost:8080/api, Swagger UI en /api/swagger-ui/index.html)
cd backend
cp .env.example .env          # BD, secreto JWT, clave de OpenAI
docker compose up -d          # solo PostgreSQL
./gradlew bootRun

# 2. Frontend (otra terminal, app en http://localhost:3000)
cd frontend
cp .env.example .env          # NEXT_PUBLIC_API_URL=http://localhost:8080/api
npm install
npm run dev
```

Más detalle en el README de cada proyecto: [backend](backend/README.es.md) · [frontend](frontend/README.es.md).

## Notas del repositorio

Este repositorio se armó uniendo los antiguos `trayectoria-backend` y `trayectoria-web` (reescritos dentro de `backend/` y `frontend/`) para conservar el historial de ambos: `git log -- backend` y `git log -- frontend` muestran los commits propios de cada proyecto. Las ramas laterales sin integrar se conservan como `backend/develop` y `frontend/develop`.

## Licencia

[MIT](backend/LICENSE)
