# ================================================================
#  Dockerfile — trayectoria-web (Next.js)
#  Multi-stage build producing a small standalone Node server.
#  You don't need Node installed to use this.
#
#  NEXT_PUBLIC_API_URL is baked into the client bundle at build time
#  and is the URL the *browser* uses to reach the API.
#  NEXT_PUBLIC_DEMO_MODE=true builds the backend-less demo instead (the API URL is then
#  ignored); it is also baked at build time. See docs/demo-mode.md.
#
#  Standalone usage:
#    docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080/api -t trayectoria-web .
#    docker build --build-arg NEXT_PUBLIC_DEMO_MODE=true -t trayectoria-web-demo .
#    docker run -p 3000:3000 trayectoria-web
#  Recommended: use the docker-compose.yml at the repo root.
# ================================================================

# ── Stage 1: Install dependencies ─────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Build ────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:8080/api
ARG NEXT_PUBLIC_DEMO_MODE=false
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_DEMO_MODE=$NEXT_PUBLIC_DEMO_MODE \
    NEXT_OUTPUT=standalone \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: Run ──────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
