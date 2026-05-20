.PHONY: check-azure-token configure-npm-auth setup-dev-env install build lint format typecheck clean help storybook build-storybook test test-ci

###############
## VARIABLES ##
###############
SHELL := /bin/bash
RESET=`tput sgr0`
RED=`tput setaf 1`

#########################	
## AZURE CONFIGURATION ##
#########################

ifndef AZURE_SUBSCRIPTION_NAME
	AZURE_SUBSCRIPTION_NAME := altaml-maz-invent
endif

AZURE_TOKEN := $(shell az account get-access-token --subscription "$(AZURE_SUBSCRIPTION_NAME)" --query accessToken -o tsv 2>/dev/null)
AZURE_DEVOPS_PAT := $(AZURE_TOKEN)

# Check if we have a valid Azure token
check-azure-token:
	@if [ -z "$(AZURE_TOKEN)" ]; then \
		echo "${RED}AZURE_TOKEN is not set. Please run:${RESET}"; \
		echo "export AZURE_TOKEN=\$$(az account get-access-token --query accessToken -o tsv)"; \
		exit 1; \
	fi

export AZURE_TOKEN
export AZURE_DEVOPS_PAT

ifeq ($(shell uname -s),Darwin)
	BASE64_FLAGS := -b0
else
	BASE64_FLAGS := -w0
endif

#######################
## ENVIRONMENT SETUP ##
#######################
configure-npm-auth: | check-azure-token
	@if [ -z "$${AZURE_TOKEN}" ] && [ -z "$${AZURE_DEVOPS_PAT}" ]; then \
		echo "${RED}AZURE_TOKEN or AZURE_DEVOPS_PAT is not set. Please set one as an environment variable.${RESET}"; \
		exit 1; \
	fi
	@set +x && \
	TOKEN=$${AZURE_DEVOPS_PAT:-$${AZURE_TOKEN}} && \
	[ -z "$${TOKEN}" ] && TOKEN=$$(az account get-access-token --query accessToken -o tsv 2>/dev/null) || true && \
	[ -z "$${TOKEN}" ] && (echo "${RED}Error: No token available${RESET}"; exit 1) || true && \
	PAT_B64=$$(echo -n "$${TOKEN}" | base64 $(BASE64_FLAGS)) && \
	echo "registry=https://pkgs.dev.azure.com/altaml-prod/AltaForge-ui/_packaging/AltaForge-ui/npm/registry/" > .npmrc && \
	echo "always-auth=true" >> .npmrc && \
	echo "//pkgs.dev.azure.com/altaml-prod/AltaForge-ui/_packaging/AltaForge-ui/npm/registry/:username=altaml-prod" >> .npmrc && \
	echo "//pkgs.dev.azure.com/altaml-prod/AltaForge-ui/_packaging/AltaForge-ui/npm/registry/:_password=$${PAT_B64}" >> .npmrc && \
	echo "//pkgs.dev.azure.com/altaml-prod/AltaForge-ui/_packaging/AltaForge-ui/npm/registry/:email=npm requires email to be set but doesn't use the value" >> .npmrc && \
	echo "//pkgs.dev.azure.com/altaml-prod/AltaForge-ui/_packaging/AltaForge-ui/npm/:username=altaml-prod" >> .npmrc && \
	echo "//pkgs.dev.azure.com/altaml-prod/AltaForge-ui/_packaging/AltaForge-ui/npm/:_password=$${PAT_B64}" >> .npmrc && \
	echo "//pkgs.dev.azure.com/altaml-prod/AltaForge-ui/_packaging/AltaForge-ui/npm/:email=npm requires email to be set but doesn't use the value" >> .npmrc;

setup-dev-env: | configure-npm-auth
	npm ci

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: configure-npm-auth ## Install dependencies
	npm install

build: ## Build the project
	npm run build

lint: ## Lint and auto-fix code
	npm run lint

format: ## Format code with Prettier
	npm run format

typecheck: ## Type check without building
	npm run typecheck

clean: ## Remove build artifacts
	rm -rf dist
	rm -rf node_modules

test: ## Run tests
	npm test

test-ci: ## Install Playwright and run all tests once (no watch mode, for CI)
	npx playwright install --with-deps chromium
	npm test -- run

