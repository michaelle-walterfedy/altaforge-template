# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## What This Is

**AltaForge App Template** — a starter application for AltaML hackathons, intern projects, and demos. The stack mirrors production AltaForge apps: React 19 + TypeScript + Vite frontend, FastAPI backend, and the AltaForge design system (`altaforge-ui`) embedded directly in the repo.

`altaforge-ui` lives under `altaforge-ui/` as a full source copy — no Azure DevOps access or PAT required. The frontend resolves it directly from source via Vite path aliases; no separate build step needed during development.

---

## Repository layout

```
altaforge-app-template/
├── altaforge-ui/     Component library source + Storybook (workspace package)
├── frontend/         React app (workspace package)
├── backend/          FastAPI app
├── Dockerfile        Multi-target workspace build
├── docker-compose.yml
├── Makefile
└── package.json      npm workspaces root
```

---

## Quick start

```bash
make install      # npm install + build altaforge-ui → dist/
make dev          # frontend dev server → http://localhost:5174
make storybook    # altaforge-ui Storybook → http://localhost:6006
```

Or with Docker (all three services):

```bash
make run-dev      # frontend + storybook + backend via Docker Compose
```

---

## Common commands

From the repo root:

```bash
make test         # vitest run (frontend)
make typecheck    # tsc --noEmit (frontend)
make lint         # eslint --fix (frontend)

npm run test -w frontend
npm run storybook -w altaforge-ui
```

From `frontend/`:

```bash
npm run test:watch      # vitest watch mode
npm run test:coverage   # coverage report
npm run format          # prettier
```

---

## Frontend architecture

### Entry point and providers

`main.tsx` → wraps in Radix `<Theme>` (config from `src/config/brand.ts`) → `App.tsx` → `QueryClientProvider` → `AuthProvider` → React Router.

### Key patterns

| Layer | Location | Responsibility |
|---|---|---|
| Pages | `src/pages/` | Route-level components. Thin — delegate to hooks. |
| Components | `src/components/` | Reusable presentational components. No data fetching. |
| Hooks | `src/hooks/` | Custom hooks wrapping TanStack Query. One hook per resource. |
| API | `src/api/` | Axios HTTP functions. One file per resource area. |
| Types | `src/types/` | TypeScript interfaces for domain models and API responses. |
| Config | `src/config/` | Constants: brand theme, nav routes, feature flags. |
| Contexts | `src/contexts/` | React Context providers (auth, etc.). |

### Routing

`App.tsx` defines a `createBrowserRouter` tree. `Layout` is the shell at `/`; pages are children. Add routes here and matching nav items in `src/config/navRoutes.tsx`.

### Auth (`src/contexts/AuthContext.tsx`)

Calls `GET /api/auth/status` on mount. **Falls back to `authenticated: true`** when the API is unreachable — the app is fully usable with no backend for pure frontend work.

### API proxy

Vite proxies `/api/*` to `VITE_BACKEND_URL` (default: `http://127.0.0.1:8001`). In Docker, this is `http://backend:8000`.

---

## altaforge-ui — using the component library

**Always prefer `altaforge-ui` components over writing custom ones.** Before building any UI, check Storybook first:

```bash
make storybook        # → http://localhost:6006
curl http://localhost:6006   # verify it's running
```

Storybook shows every component with live examples, prop controls, and auto-generated docs. If a component exists there, use it.

### Import paths

```typescript
// Layout primitives — Box, Card, Flex, Grid, Text, Heading, Button,
// Badge, Separator, Spinner, Table, Tabs, TextField, Dialog, Tooltip, etc.
import { Box, Card, Flex, Text, Heading, Button, Badge } from "altaforge-ui/themes";

// AltaML-specific components
import {
  AppShell, AppHeader, Sidebar, NavMenu, NavItem,
  StatCard, DataGrid, DatePicker, DateRangePicker,
  MultiSelect, Toolbar, ActionButton, UserMenu, ItemDropdown,
} from "altaforge-ui/components";

// Charts (Chart.js wrapped for React)
import { Bar, Line, Doughnut } from "altaforge-ui/charts";
import { DataVisualCard } from "altaforge-ui/components";
```

Icons:

```tsx
import { GearIcon, PlusIcon, ChevronRightIcon } from "@radix-ui/react-icons";
// Full list: https://www.radix-ui.com/icons
```

### Component quick-reference

| Component | Use for |
|---|---|
| `StatCard` | KPI / metric card — `title`, `value`, `subtitle`, `change`, `data` (sparkline) |
| `DataGrid` | Scrollable data table — AG Grid wrapper |
| `DateRangePicker` | Date range selection with preset shortcuts |
| `MultiSelect` | Multi-option dropdown |
| `ItemDropdown` | Per-row action menu (edit, delete, etc.) |
| `Toolbar` + `ActionButton` | Icon button groups in the sidebar icon rail |
| `UserMenu` | User avatar dropdown with logout |
| `DataVisualCard` | Standard card wrapper for charts |

### Storybook in Docker

Storybook is a separate service in `docker-compose.yml`. When running with Docker, it's available at `http://localhost:6006` alongside the app. Edits to `altaforge-ui/src/` hot-reload in Storybook immediately — no rebuild needed.

### Hot reloading in the frontend

The frontend's `vite.config.ts` uses Vite path aliases to resolve `altaforge-ui/themes`, `altaforge-ui/components`, and `altaforge-ui/charts` directly from `altaforge-ui/src/`. This means:

- Changes to `altaforge-ui/src/` hot-reload in the browser immediately
- Docker volume `./altaforge-ui/src:/workspace/altaforge-ui/src` is mounted, so Docker picks up changes too
- **No `npm run build -w altaforge-ui` needed during development**

The only time you need to rebuild is for production builds or if running `tsc` type-checking against the compiled types.

### Theme

`src/config/brand.ts` centralises Radix theme props. Current accent color is `"cyan"` — the AltaForge standard, matching `altaforge-ui`'s Storybook theme. Change here, not inline in components.

---

## Backend

`backend/main.py` is a FastAPI app with health check and auth endpoints. It runs as a Docker service in `docker-compose.yml`.

To run locally without Docker:

```bash
cd backend
uv sync
uv run uvicorn main:app --reload
```

---

## Testing

Tests live alongside source files. Pattern: test utilities and API clients first; component tests where logic is non-trivial.

```bash
make test                          # single run
npm run test:watch -w frontend     # watch mode
npm run test:coverage -w frontend  # coverage report
```

Vitest globals are enabled — `describe`, `it`, `expect` don't need explicit imports. Use `vi.hoisted()` when mock setup must run before module initialization. See `src/api/client.test.ts` for the pattern.

---

## TypeScript

Strict mode: `strict`, `noUnusedLocals`, `noUnusedParameters`. No `any` — use `unknown` with a type guard. All public API functions need return type annotations. Path alias `@/` maps to `frontend/src/`.
