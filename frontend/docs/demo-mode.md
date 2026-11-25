# Demo mode

The frontend can run **without a backend**. With demo mode on, nothing leaves the browser: an in-browser mock
answers every API call with fictional data, a banner says so, and `/login` offers one-click sample accounts. It
exists so the app can be published for free (e.g. on Vercel) as a portfolio piece that a recruiter can use end to end.

| | Demo mode **on** | Demo mode **off** (default) |
|---|---|---|
| `NEXT_PUBLIC_DEMO_MODE` | `true` | unset or `false` |
| `NEXT_PUBLIC_API_URL` | ignored, leave it unset | **required** for a production build |
| Network | no request to any backend | talks to the real backend |
| Data | fictional, per visitor, in the browser | the backend's database |
| Bundle | includes the demo layer in a separate chunk | contains no demo code at all |

Only the exact value `true` turns it on. Any value other than `true`/`false` makes the build fail.

## Switching modes needs a rebuild

Both variables are `NEXT_PUBLIC_*`, so Next **bakes them into the bundle at build time**. Changing a variable in
a running deployment does nothing: rebuild and redeploy (locally, restart `npm run dev`). Configuration is read in
exactly one place, `src/config/env.ts`, which exposes `isDemoMode` and `apiUrl`; an ESLint rule forbids reading
`process.env` anywhere else.

If demo mode is off and `NEXT_PUBLIC_API_URL` is missing, **`next build` fails** with an explanatory message instead
of shipping a bundle that points at `localhost` (see `next.config.ts`). `npm run dev` keeps its `localhost:8080`
fallback.

## Run it locally

```bash
NEXT_PUBLIC_DEMO_MODE=true npm run dev                    # development
NEXT_PUBLIC_DEMO_MODE=true npm run build && npm start     # production build
```

Or put `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`. With Docker:
`docker build --build-arg NEXT_PUBLIC_DEMO_MODE=true -t trayectoria-web-demo .`

## Deploy on Vercel (no backend)

1. Import the repository in Vercel.
2. **Root Directory:** `frontend` (this is a monorepo).
3. **Environment Variables:** `NEXT_PUBLIC_DEMO_MODE` = `true`. Do **not** set `NEXT_PUBLIC_API_URL`.
4. Deploy. Framework preset (Next.js), build command and output directory stay at their defaults.

Set the variable for the environments you use (Production, and Preview if you want previews to be demos too), and
redeploy after changing it.

## Switch to a real backend

Set `NEXT_PUBLIC_DEMO_MODE=false` (or remove it) and `NEXT_PUBLIC_API_URL=https://your-backend.example.com/api`
(no trailing `/v1`), then rebuild and redeploy. The backend must allow the frontend's origin in its CORS settings.

## Sample accounts

All use the password `Demo1234!`. `/login` has one-click buttons for Sofía and Nimbus.

| Role | Email | Notes |
|---|---|---|
| Candidate | `sofia@demo.trayectoria.dev` | 4 applications (pending, viewed, in review, accepted), saved offers, 3 AI CVs, a finished and an in-progress interview |
| Candidate | `mateo@demo.trayectoria.dev` | one rejected, one in review, one pending |
| Candidate | `camila@demo.trayectoria.dev` | QA / data profile |
| Company | `nimbus@demo.trayectoria.dev` | 3 active offers + 1 draft, applications to review |
| Company | `verde@demo.trayectoria.dev` | |
| Company | `cordillera@demo.trayectoria.dev` | has a closed offer |

Registering new accounts works too; they live in the visitor's state like everything else.

## How it works

```
component → hook (TanStack Query) → features/*/api/*.api.ts → apiClient (axios)
                                                                  │ interceptors (token, 401 → refresh) run as usual
                                                                  ▼
                                          demo off: network adapter        demo on: demo adapter (src/demo)
                                                                                         │ route table → handler
                                                                                         ▼
                                                                         in-memory state ⇄ sessionStorage
```

The features, hooks and components are **unchanged**: the mock is an axios `adapter` that sits *under* the
interceptors, so token handling and the refresh flow behave exactly as against the backend. The second place that
talks to the API outside axios, the bootstrap token refresh, goes through `lib/api/refresh-session.ts`, which
answers locally in demo mode.

### Not in the production bundle

Everything under `src/demo` is reachable through a single module, `@/demo` (`src/demo/index.ts`), loaded only with
`import('@/demo')` (axios adapter, `React.lazy` for the banner, the login shortcuts and the AI notes), always behind
`isDemoMode`. ESLint forbids static imports of it (type-only imports are fine).

Turbopack does not drop a dynamic `import()` just because `isDemoMode` is a constant in another module, so
`next.config.ts` also **aliases `@/demo` to an empty stub** (`src/demo/disabled.ts`) whenever demo mode is off. The
alias is configured for Turbopack, the default builder; with `next build --webpack` the demo would still work, but its
chunk would be emitted (never loaded).

To check a build, search `.next` for strings that only exist in the demo layer:

```bash
NEXT_PUBLIC_API_URL=https://x.example/api npm run build
grep -rlE --include=*.js 'trayectoria-demo-state|demo\.trayectoria\.dev|estás viendo datos ficticios' .next   # expect no output
```

### The mock

- **Routing.** `src/demo/http/router.ts` maps `METHOD + path` (with `:id` variables) to handlers and applies the
  access rule of each route like `SecurityConfig`: no/invalid token → `401` (so the client tries a refresh), wrong role → `403`.
- **Unmocked routes fail loudly:** `501` with a message naming the route plus a `console.warn`. Never an empty 200.
- **Contract.** Response types are the UI's own (`features/*/types`), so drift fails `tsc`. Errors have the backend's shape
  (`status`, `error`, `message`, `details`), including the validation messages (`email: Invalid email format`), so
  `extractApiError` and the UI's error states work the same: invalid credentials, duplicate email, 404, 409, 422…
  Pagination, `/job-offers` filters, skill search, application statuses, company stats and the schema's cascades
  (deleting an offer removes its applications, saved offers and interviews; CVs survive with a null offer) follow the backend.
- **Latency.** 150–400 ms per request, derived from the request (not `Math.random()`), so runs are reproducible.
- **State.** `src/demo/db` holds the "tables" in memory and mirrors them to `sessionStorage` after every mutating request. It is
  **per tab**: nothing is shared between visitors and closing the tab starts again from the fixtures. "Restablecer datos de demo"
  (banner) re-seeds and reloads.
- **Sessions.** Tokens are opaque strings carrying the email; they do not expire. Passwords are stored hashed with a
  non-cryptographic hash only so a password typed while registering is not readable in storage.
- **Uploads (avatar/logo).** No server: the image is shrunk to ≤256 px and returned as a data URL, which survives reloads and
  keeps the state under the `sessionStorage` quota. The real backend has no such endpoints yet, so this is the demo's own behaviour.
- **Simulated AI** (no external calls, and the UI says so):
  - *CV generation* is a deterministic template filled from the profile and the offer (matched skills first, a tailored summary).
  - *Mock interview* is a scripted, rotating list of questions that uses the offer's skills; it closes after 8 answers, like the backend.
  - *Feedback* is computed from what the candidate wrote (length, skills mentioned, figures): the same answers give the same feedback.

### Fictional data

Typed fixtures in `src/demo/fixtures` are a port of `seed/seed.mjs` and `seed/ai-demo.sql` (same people, offers, statuses
and ids), plus an example feedback for the finished interview. They are the only source of demo content; dates are
relative to "now" so the board always looks recently active. Only invented data and `@demo.trayectoria.dev` emails.

## Why not MSW

Mock Service Worker was considered and rejected:

- It needs a service worker file served from `public/` and registered before the first request. Next's SSR/prerender and a cold first
  visit make that race easy to lose, and `next build` output then depends on a generated artefact.
- It intercepts at the network layer, but here the seam already exists: one axios instance, plus one raw `fetch` that is trivial to route.
  An axios adapter needs no worker, runs in dev, prod and tests, and cannot leak a request while the worker is still registering.
- It is one more dependency, and its handlers would have to be excluded from the production bundle with the same alias trick anyway.

## Adding or changing an endpoint

1. Add the handler in `src/demo/handlers/*` (`route(method, pattern, access, handler)`; literal paths such as `/job-offers/mine`
   must be registered before `/job-offers/:id`). Return the response type from `features/*/types`.
2. Map records to the DTO in `src/demo/mappers.ts`. Validate first, then mutate: the state is saved after a successful request.
3. If new data is needed, extend the fixtures and `db/seed.ts`; bump `STATE_VERSION` in `db/store.ts` when `DemoDb` changes shape.

## Known limitations

- Per-tab state: opening the app in a second tab starts from the fixtures. An account registered in a tab does not exist in another one
  (a leftover session there is signed out by the failed refresh).
- No real AI, no email, no voice interview (those endpoints answer `501`).
- Search, filters and pagination run on in-memory lists: fine for fixtures, not a model for the real backend's performance.
