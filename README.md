# VMC Operator HMI — Startup Guidance

A responsive full-stack HMI that walks one VMC operator through the machine
startup sequence — Machine Checks → Required Tools → Workpiece Setup → Ready
Review → Operation — one stage at a time, with large touch controls and a
real API + persistence behind it.

Built for the Primeform Labs Software Engineer technical assignment.

## Assumptions / mock scenario

Per the assignment, order creation and acceptance are out of scope — one job
is preloaded and hardcoded (see `packages/shared/src/mockScenario.ts`):

- **Operation:** Milling – Bracket Housing, Qty 25
- **Material:** Aluminum 6061-T6, Drawing Rev C
- **CNC Program:** O1042 Rev 3
- **Fixture:** Vise Fixture #2, Work Offset G54
- **Tools:** T01 Face Mill Ø50 (roughing), T02 End Mill Ø10 (profiling), T03 Drill Ø8.5 (holes)
- **Machine checks:** Power/control available, E-stop released, Guard/door closed, No active alarm, Lubrication/coolant ready, Reference return complete
- **Workpiece setup:** Fixture mounted, orientation set, clamping torque confirmed, material/drawing revision verified, work offset set

There is no login/auth — this is a single-operator kiosk-style demo and the
link is publicly viewable, so no demo credentials are needed.

## Architecture

Monorepo (npm workspaces) with three packages:

- **`packages/shared`** — Stage/OperationStatus enums, `WorkflowState` types,
  and the mock job scenario above. Single source of truth used by both the
  server and the client.
- **`packages/server`** — Express API + MongoDB persistence.
  - `domain/workflowMachine.ts` — pure, transport- and storage-agnostic
    functions implementing the stage state machine (confirm an item, advance
    a stage, start/stop the operation). No I/O; unit-tested directly.
  - `repositories/` — `IWorkflowRepository` interface with a
    `MongoWorkflowRepository` implementation. The service layer only ever
    depends on the interface, so the storage backend is swappable.
  - `services/WorkflowService.ts` — loads state via the repository, applies a
    domain transition, persists the result. The one place HTTP and Mongo
    concerns meet.
  - `routes/` — thin controllers that call one service method each and map
    domain errors to HTTP status codes (404 for an unknown item, 409 for an
    illegal transition).
- **`packages/client`** — React + Vite + TypeScript + Tailwind.
  - `api/WorkflowApiClient` implements an `IWorkflowClient` interface; the
    `useWorkflow` hook is the only place that depends on it, exposing
    intention-revealing actions to components.
  - `components/stages/*` — one presentational component per stage, driven
    entirely by props. `StageRouter` maps the current stage to its component,
    so adding a stage later doesn't touch the existing ones.
  - `components/shared/SingleItemChecklist` — the operator sees and confirms
    one check/tool/workpiece item at a time (with a compact progress list),
    matching the assignment's "operator follows the instruction currently
    displayed" principle.

In production, Express serves both the API and the built client from a
single process/URL — see `resolveClientDistPath()` in `packages/server/src/server.ts`.
In local dev, the client runs on Vite's own dev server and proxies `/api` to
the Express server, so both hot-reload independently.

## Running locally

Requires Node 20+ and a MongoDB instance (local, Docker, or Atlas).

```bash
npm install

# packages/server/.env (copy from .env.example)
# MONGODB_URI=mongodb://localhost:27017/vmc-operator-hmi
# PORT=4000

npm run dev:server        # Express API on :4000
npm run dev --workspace=@vmc-hmi/client   # Vite dev server on :5173, proxies /api to :4000
```

Open http://localhost:5173.

### Running the production build locally

```bash
npm run build   # builds shared -> server -> client
npm run start    # single process on :4000 serving API + built client
```

Open http://localhost:4000.

### Tests

```bash
npm test   # Vitest — pure domain state machine unit tests
```

## Deployment

Single Render.com Web Service running `npm run build` / `npm run start`,
backed by a MongoDB Atlas free cluster (`MONGODB_URI` env var). A GitHub
Actions workflow pings `/api/health` on a schedule to keep the free Render
instance from idling out between reviews.

### 1. MongoDB Atlas (free M0 cluster)

1. Create a free account/cluster at https://www.mongodb.com/cloud/atlas
2. Database Access → add a database user (username/password auth)
3. Network Access → allow access from anywhere (`0.0.0.0/0`) so Render can connect
4. Get the connection string ("Connect" → "Drivers"), e.g.
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/vmc-operator-hmi`

### 2. Render.com Web Service

Repo includes `render.yaml`, so Render can pick it up as a Blueprint:

1. New → Blueprint, connect the `vmc-operator-hmi` GitHub repo
2. It reads `render.yaml` (build `npm run build`, start `npm run start`, free plan)
3. Set the `MONGODB_URI` env var to the Atlas connection string from step 1
   (this field is intentionally left blank in `render.yaml` — Render prompts
   for it since `sync: false`)
4. Deploy. Render assigns a URL like `https://vmc-operator-hmi.onrender.com`

Alternatively, skip the Blueprint and create a plain Web Service manually
with the same build/start commands and env var.

### 3. Keep-alive cron

Render's free tier spins a web service down after ~15 minutes of inactivity,
which would cold-start on a reviewer's first click. `.github/workflows/keep-alive.yml`
pings `/api/health` every 10 minutes via GitHub Actions to prevent that:

1. Repo → Settings → Secrets and variables → Actions → Variables
2. Add a repository variable `RENDER_APP_URL` set to the deployed URL (no
   trailing slash), e.g. `https://vmc-operator-hmi.onrender.com`
3. The workflow runs automatically on schedule; it can also be triggered
   manually from the Actions tab (`workflow_dispatch`)

GitHub Actions' schedule can drift by a few minutes under load; if the app
still cold-starts occasionally, a no-signup fallback like
[cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com)
pinging the same `/api/health` URL works as a backup.
