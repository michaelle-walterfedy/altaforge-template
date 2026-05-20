# AltaForge App Template

A starter application for AltaML hackathons, intern projects, and demos. It comes wired up with the full AltaForge stack so you can skip the setup and start building.

**What's included:**

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| UI components | `altaforge-ui` — embedded in this repo, no private registry access needed |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Backend | FastAPI (Python 3.11) |
| Tests | Vitest |
| Component explorer | Storybook 10 |

**Running services:**

| Service | URL | What it does |
|---|---|---|
| Frontend | http://localhost:5174 | The React app |
| Storybook | http://localhost:6006 | Browse all `altaforge-ui` components |
| Backend API | http://localhost:8001 | FastAPI stub — add your endpoints here |
| API docs | http://localhost:8001/docs | Auto-generated Swagger UI |

---

## Prerequisites

You need either **Docker** (recommended for running the full stack) or **Node.js + Python** installed locally. Pick one path.

### Option A — Docker with Colima (recommended on Mac)

We use [Colima](https://github.com/abiosoft/colima) instead of Docker Desktop. It's free, runs headlessly, and doesn't require a license.

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker CLI and Colima
brew install docker docker-compose colima

# Start the Colima VM (first run takes ~1 minute)
colima start

# Verify Docker is working
docker info
```

> Colima needs to be running whenever you use Docker. If you restart your Mac, run `colima start` again. You can add it to your shell profile or run it as a background service — see `colima --help` for options.

### Option B — Local (no Docker)

You'll need:

- **Node.js 22+** — install via [nvm](https://github.com/nvm-sh/nvm) (recommended) or [nodejs.org](https://nodejs.org)
- **Python 3.11+** — install via [pyenv](https://github.com/pyenv/pyenv) or [python.org](https://python.org) (only needed if running the backend)
- **uv** — Python package manager used by the backend

```bash
# Node.js via nvm (recommended — lets you switch versions per project)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
# Restart your terminal, then:
nvm install 22
nvm use 22

# uv (Python package manager)
brew install uv
# or: curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## Getting started

### With Docker

```bash
# Clone and enter the repo
git clone --recurse-submodules <repo-url>
cd altaforge-app-template

# Start everything (first run builds Docker images — takes a few minutes)
make run-dev
```

That's it. The three services start in the same terminal. When you see output from all three, you're ready:

- **Frontend** → http://localhost:5174
- **Storybook** → http://localhost:6006
- **Backend** → http://localhost:8001/docs

Stop with `Ctrl+C`, then `docker compose down` to remove the containers.

> **Hot reload** is enabled for all services. Changes you make to files in `frontend/src/`, `altaforge-ui/src/`, or `backend/` are reflected immediately without restarting.

#### When to use `docker compose up --build`

Most day-to-day work just needs `make run-dev` (which already passes `--build`). But if you've run `docker compose up` directly without `--build`, you may have stale images. Rebuild explicitly when:

| Situation | Command |
|---|---|
| You changed `package.json` in any workspace (added/removed a dependency) | `docker compose up --build` |
| You changed `vite.config.ts`, `tsconfig.json`, or another config file at the root of `frontend/` | `docker compose up --build` or `docker compose restart frontend` |
| You changed `backend/pyproject.toml` or installed new Python packages | `docker compose up --build backend` |
| You pulled new commits and something looks broken | `docker compose down && docker compose up --build` |
| You want to rebuild just one service without restarting the others | `docker compose up --build frontend` |

If you're not sure, `docker compose down && make run-dev` is always safe — it tears down all containers and builds fresh images from scratch.

---

### Without Docker

You can run the frontend and backend in separate terminal tabs.

#### Terminal 1 — Frontend

```bash
# Install all workspace dependencies and build the UI library
make install

# Start the frontend dev server
make dev
```

Frontend is available at http://localhost:5174.

#### Terminal 2 — Storybook (optional)

```bash
make storybook
```

Storybook is available at http://localhost:6006.

#### Terminal 3 — Backend (optional)

```bash
cd backend
uv sync          # install Python dependencies
uv run uvicorn main:app --reload --port 8001
```

Backend is available at http://localhost:8001. The frontend automatically proxies `/api/*` requests to it.

> If you don't run the backend, the app still works — it falls back to `authenticated: true` so you can develop the frontend without a running API. The backend indicator on the Dashboard will show "Not connected."

---

## Project structure

```
altaforge-app-template/
├── altaforge-ui/          UI component library (full source — no private registry needed)
│   └── src/components/    Sidebar, NavMenu, StatCard, DataGrid, DatePicker, etc.
├── frontend/              React application
│   └── src/
│       ├── api/           HTTP client functions — one file per resource area
│       ├── components/    Reusable UI components (Layout shell, etc.)
│       ├── config/        Brand theme, nav route definitions
│       ├── contexts/      React Context providers (auth, etc.)
│       ├── hooks/         TanStack Query hooks — one per resource
│       ├── pages/         Route-level page components
│       └── types/         TypeScript interfaces for domain models + API responses
├── backend/               FastAPI application
│   └── main.py            Health check + auth stub endpoints
├── Dockerfile             Multi-target build (dev-frontend, dev-storybook, prod)
├── docker-compose.yml     Runs frontend + storybook + backend
├── Makefile               Common tasks (make dev, make test, make storybook, etc.)
└── package.json           npm workspaces root
```

### Why this structure?

The goal is to keep each layer honest about its job:

- **`pages/`** — Thin. A page component sets up the layout and delegates everything else. No data fetching, no business logic inline.
- **`hooks/`** — Own all data fetching. Each hook wraps a TanStack Query call and returns typed data. If a page needs data, it calls a hook.
- **`api/`** — Own the HTTP layer. Functions here call the backend and return typed results (or null on error). They don't know about React.
- **`components/`** — Presentational. Receive props, render UI. Don't fetch their own data.
- **`types/`** — Shared TypeScript interfaces. If two files need the same shape, it lives here.

---

## Building your app

### Add a new page

**1. Create the page component** in `frontend/src/pages/`:

```tsx
// frontend/src/pages/Agents.tsx
import React from "react";
import { Flex, Heading } from "altaforge-ui/themes";

const Agents: React.FC = () => {
  return (
    <Flex direction="column" gap="4">
      <Heading size="5">Agents</Heading>
      {/* your content */}
    </Flex>
  );
};

export default Agents;
```

**2. Register the route** in `frontend/src/App.tsx`:

```tsx
import Agents from "@/pages/Agents";

// Inside createBrowserRouter children:
{ path: "agents", element: <Agents /> },
```

**3. Add a nav item** in `frontend/src/config/navRoutes.tsx`:

```tsx
import { GearIcon } from "@radix-ui/react-icons";

{ id: "/agents", icon: <GearIcon />, label: "Agents" },
```

### Fetch data from the backend

**1. Add an API function** in `frontend/src/api/`:

```ts
// frontend/src/api/agents.ts
import http from "./client";
import type { Agent } from "@/types/api";

export async function fetchAgents(): Promise<Agent[]> {
  const { data } = await http.get<Agent[]>("/agents");
  return data;
}
```

**2. Wrap it in a hook** in `frontend/src/hooks/`:

```ts
// frontend/src/hooks/useAgents.ts
import { useQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/api/agents";

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });
}
```

**3. Use the hook in your page:**

```tsx
const { data: agents, isLoading } = useAgents();
```

**4. Add the backend endpoint** in `backend/main.py`:

```python
@app.get("/agents")
async def list_agents() -> list[dict]:
    return []  # replace with real data
```

---

## altaforge-ui and Storybook

### What is altaforge-ui?

`altaforge-ui` is AltaML's internal React component library. It provides the building blocks used across all AltaForge applications — layout shells, navigation, data grids, charts, stat cards, date pickers, and more — all built on top of [Radix UI](https://www.radix-ui.com/themes/docs/overview/getting-started).

In most AltaForge projects it's installed from a private Azure DevOps npm registry that requires a PAT. **In this template `altaforge-ui` is included as a git submodule** (tracking the `dev` branch) and linked into the workspace locally. No credentials needed — `make install` initialises the submodule and wires everything up.

### Storybook — your component reference

**Start Storybook before you write a single component.** Every available component has an interactive story showing it in all its states, with live prop controls and auto-generated documentation.

```bash
make storybook          # local → http://localhost:6006
# or alongside the app:
make run-dev            # storybook at http://localhost:6006
# or verify it's running:
curl http://localhost:6006
```

Storybook reads `altaforge-ui/src/` directly via Vite. Changes to component source hot-reload in Storybook instantly.

### Importing components

There are three entry points:

**`altaforge-ui/themes`** — Radix UI primitives. Use these for all layout and typography:

```tsx
import { Box, Card, Flex, Grid, Heading, Text, Button, Badge,
         Separator, Spinner, Table, Tabs, TextField, Select,
         Dialog, Tooltip, Popover } from "altaforge-ui/themes";
```

**`altaforge-ui/components`** — AltaML-specific components:

```tsx
import { AppShell, AppHeader, Sidebar, NavMenu, NavItem, NavGroup,
         StatCard, DataGrid, DatePicker, DateRangePicker,
         MultiSelect, Toolbar, ActionButton, UserMenu,
         ItemDropdown, ThemeToggle } from "altaforge-ui/components";
```

**`altaforge-ui/charts`** — Chart.js for React:

```tsx
import { Bar, Line, Doughnut } from "altaforge-ui/charts";
```

### Component quick-reference

| Component | Purpose |
|---|---|
| `Box`, `Flex`, `Grid` | Layout containers |
| `Card` | Surfaces — `size` (1–4), `variant` (`surface`, `classic`, `ghost`) |
| `Text`, `Heading` | Typography — `size` (1–9), `weight`, `color` |
| `Button` | Actions — `color`, `variant` (`solid`, `soft`, `outline`, `ghost`) |
| `Badge` | Labels and status chips |
| `StatCard` | KPI / metric card with optional sparkline |
| `DataGrid` | AG Grid wrapper with pinned header and scrollable body |
| `DateRangePicker` | Date range selection with presets (today, last 7d, last 30d, etc.) |
| `MultiSelect` | Multi-option dropdown |
| `ItemDropdown` | Row-level action menu (edit, delete, etc.) |
| `Toolbar` + `ActionButton` | Icon button group |
| `UserMenu` | User avatar dropdown with logout |
| `NavMenu`, `NavItem`, `NavGroup` | Navigation lists inside the sidebar |

**Icons** come from `@radix-ui/react-icons` — browse the full set at [radix-ui.com/icons](https://www.radix-ui.com/icons).

### Example page

```tsx
import { Card, Flex, Heading } from "altaforge-ui/themes";
import { StatCard, DataGrid, DateRangePicker } from "altaforge-ui/components";
import { GearIcon } from "@radix-ui/react-icons";

const AgentsPage: React.FC = () => {
  const { data: agents } = useAgents();

  return (
    <Flex direction="column" gap="5">
      <Flex gap="4">
        <StatCard title="Running" value="3" change="+1 today" />
        <StatCard title="Idle" value="7" />
        <StatCard title="Blocked" value="1" />
      </Flex>

      <Card size="3">
        <Heading size="3" mb="3">Agent roster</Heading>
        <DataGrid rowData={agents} columnDefs={columnDefs} />
      </Card>
    </Flex>
  );
};
```

### Modifying the UI library

The frontend dev server resolves `altaforge-ui` imports **directly from `altaforge-ui/src/`** via Vite path aliases. This means:

- Editing a component in `altaforge-ui/src/components/` hot-reloads in the browser **instantly** — no build step, no Docker restart
- The volume mount `./altaforge-ui/src:/workspace/altaforge-ui/src` in `docker-compose.yml` makes this work in Docker too

Each component follows a consistent pattern:

```
src/components/
├── MyComponent.tsx          # Component + exported MyComponentProps interface
├── MyComponent.module.css   # Scoped CSS Modules — no inline styles
└── MyComponent.stories.tsx  # Storybook story
```

TypeScript strict mode is enforced. All public props must be in a named `ComponentNameProps` interface. No `any` types.

> If you want your improvements merged into the shared library, copy the changes to the original `altaforge-ui` repo and open a PR there.

---

## Testing

Tests live alongside source files. Run them with:

```bash
make test                             # single run
npm run test:watch -w frontend        # watch mode (re-runs on file save)
npm run test:coverage -w frontend     # coverage report
```

The test pattern follows `altaforge-cc`:

- **API client tests** — mock axios, test request shape and error handling
- **Hook tests** — mock the API function, test loading/error/data states
- **Utility tests** — pure function tests, no mocking needed

See `frontend/src/api/client.test.ts` for an example of the axios mocking pattern using `vi.hoisted()`.

---

## Modifying the UI library

`altaforge-ui` source lives in `altaforge-ui/src/`. Storybook reads source directly and hot-reloads. The frontend, however, imports from the compiled `dist/` — so if you modify `altaforge-ui/src/`, rebuild before your changes appear in the app:

```bash
npm run build -w altaforge-ui
```

If you're making a component change and want tight iteration, use Storybook — it reflects changes instantly without a rebuild.

---

## Environment variables

Copy the example env file and adjust as needed:

```bash
cp frontend/.env.example frontend/.env   # if it exists, otherwise create it
```

| Variable | Default | Description |
|---|---|---|
| `VITE_BACKEND_URL` | `http://127.0.0.1:8001` | Backend URL for the Vite proxy (local dev only) |
| `FRONTEND_PORT` | `5174` | Override the frontend port (Docker) |
| `STORYBOOK_PORT` | `6006` | Override the Storybook port (Docker) |
| `BACKEND_PORT` | `8001` | Override the backend port (Docker) |

Port overrides are set in a `.env` file at the repo root (next to `docker-compose.yml`).

---

## Common tasks

```bash
make install        # install all deps + build UI library (run this first)
make dev            # start frontend dev server
make storybook      # start Storybook
make test           # run tests once
make typecheck      # TypeScript type check
make lint           # ESLint with auto-fix
make run-dev        # start all services via Docker Compose
make build          # production Docker image
```

---

## Troubleshooting

**`colima start` fails or Docker says "Cannot connect to the Docker daemon"**

Colima isn't running. Start it:
```bash
colima start
```

If that doesn't work, try:
```bash
colima stop && colima start --cpu 4 --memory 8
```

---

**`make run-dev` fails on first run with a network error**

The Docker build downloads dependencies. If it times out, retry — it will pick up from the cache:
```bash
make run-dev
```

---

**Frontend shows "Not connected" for the backend**

The backend isn't running or isn't reachable. Check it's up:
```bash
curl http://localhost:8001/health
# should return: {"status":"ok","version":"0.1.0"}
```

If using Docker, check container logs:
```bash
docker logs template-backend-dev
```

---

**`npm run build -w altaforge-ui` fails after modifying source**

Run `npm run typecheck -w altaforge-ui` first to see the TypeScript errors before building.

---

**Port already in use**

Something else on your machine is using 5174, 6006, or 8001. Either stop that process, or override the port:
```bash
FRONTEND_PORT=3000 make run-dev
```

---

**`make install` fails with `ENOENT` or module resolution errors**

Delete `node_modules` and reinstall from scratch:
```bash
rm -rf node_modules frontend/node_modules altaforge-ui/node_modules
make install
```
