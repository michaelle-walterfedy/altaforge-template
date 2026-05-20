FROM node:22-alpine AS base

WORKDIR /workspace

# Install workspace manifests first for better layer caching
COPY package.json ./
COPY altaforge-ui/package.json ./altaforge-ui/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm install

# ── UI library ────────────────────────────────────────────────────────────────
FROM base AS build-ui

COPY altaforge-ui/ ./altaforge-ui/
RUN npm run build -w altaforge-ui

# ── Frontend dev server ───────────────────────────────────────────────────────
FROM build-ui AS dev-frontend

COPY frontend/ ./frontend/
EXPOSE 5174
CMD ["npm", "run", "dev", "--workspace=frontend"]

# ── Storybook dev server ──────────────────────────────────────────────────────
FROM base AS dev-storybook

COPY altaforge-ui/ ./altaforge-ui/
EXPOSE 6006
CMD ["npx", "--workspace=altaforge-ui", "storybook", "dev", "-p", "6006", "--host", "0.0.0.0"]

# ── Production frontend build ─────────────────────────────────────────────────
FROM build-ui AS build-frontend

COPY frontend/ ./frontend/
RUN npm run build -w frontend

FROM nginx:alpine AS prod-frontend
COPY --from=build-frontend /workspace/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
