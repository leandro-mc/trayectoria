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

## Ejecutar con Docker (recomendado)

El único requisito es **Docker** (con Compose). No hace falta JDK, Gradle ni Node.

```bash
git clone https://github.com/leandro-mc/trayectoria.git
cd trayectoria
docker compose up --build
```

Después abrí **http://localhost:3000**. El primer build descarga dependencias y tarda unos minutos. En el primer arranque dos servicios de una sola ejecución cargan datos de demo ficticios (empresas, candidatos con perfil completo, ofertas, postulaciones en todos los estados, ofertas guardadas y contenido de IA pre-escrito), para que cada pantalla tenga algo que mostrar desde el principio.

**Cuentas de demo** (contraseña para todas: `Demo1234!`)

| Rol | Email | Qué vas a ver |
|---|---|---|
| Candidata | `sofia@demo.trayectoria.dev` | Perfil completo, 4 postulaciones, ofertas guardadas, CVs adaptados y 2 entrevistas simuladas |
| Candidato | `mateo@demo.trayectoria.dev` | Perfil backend junior, 3 postulaciones, un CV adaptado |
| Candidata | `camila@demo.trayectoria.dev` | Perfil QA / datos, 3 postulaciones |
| Empresa | `nimbus@demo.trayectoria.dev` | 4 ofertas (una en borrador), postulantes por revisar |
| Empresa | `verde@demo.trayectoria.dev` | 3 ofertas, postulantes en distintos estados |
| Empresa | `cordillera@demo.trayectoria.dev` | 3 ofertas (una cerrada) |

| Servicio | URL |
|---|---|
| App web | http://localhost:3000 |
| API | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/api/swagger-ui/index.html |
| PostgreSQL | `localhost:5434` (`trayectoria` / `trayectoria`) |

**Funciones de IA:** todo funciona sin clave de OpenAI y los CVs y entrevistas de demo ya vienen cargados. Para generar CVs nuevos o hacer entrevistas simuladas nuevas, copiá [`.env.example`](.env.example) a `.env` y completá `OPENAI_API_KEY`.

Comandos útiles:

```bash
docker compose up --build -d      # correr en segundo plano
docker compose logs -f backend    # ver los logs de la API
docker compose down               # detener (los datos quedan en un volumen)
docker compose down -v            # detener y borrar la base; los datos de demo se recargan en el próximo up
```

Los puertos, las credenciales de la BD, el secreto JWT y `SEED_DEMO_DATA=false` (arrancar con la base vacía) se configuran en `.env`. El seed es idempotente y también se puede ejecutar a mano contra cualquier instancia en marcha: `node seed/seed.mjs` (API) y `psql -f seed/ai-demo.sql` (contenido de IA).

## Ejecutar sin Docker

Requisitos: JDK 21, Docker (solo para PostgreSQL) y Node.js 20+. Para las funciones de IA hace falta una API key de OpenAI.

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
