IMAGE_NAME ?= altaforge-app-template
TAG        ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo "dev")

.PHONY: help install dev storybook test lint typecheck run-dev build

help:
	@echo "altaforge-app-template"
	@echo ""
	@echo "  make install     Install all workspace deps and build altaforge-ui"
	@echo "  make dev         Start frontend dev server (local)"
	@echo "  make storybook   Start altaforge-ui Storybook (local)"
	@echo "  make test        Run frontend tests"
	@echo "  make lint        Lint the frontend"
	@echo "  make typecheck   Type-check the frontend"
	@echo "  make run-dev     Start frontend + storybook via Docker Compose"
	@echo "  make build       Production build (UI lib + frontend)"

install:
	git submodule update --init --remote
	npm install
	npm run build -w altaforge-ui

dev: install
	npm run dev -w frontend

storybook: install
	npm run storybook -w altaforge-ui

test:
	npm run test -w frontend

lint:
	npm run lint -w frontend

typecheck:
	npm run typecheck -w frontend

run-dev:
	docker compose up --build frontend storybook backend

build:
	docker buildx build \
		--target prod-frontend \
		--tag $(IMAGE_NAME):$(TAG) \
		--load \
		.
