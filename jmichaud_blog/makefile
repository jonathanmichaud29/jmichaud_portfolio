.PHONY: dev dev-d down logs prod-local

# ── Local dev — HMR via Astro/Vite dev server ──────────────────────────────
# Builds Dockerfile.dev (once, or when deps change) then starts with bind mount.
# Rebuild only needed when package.json / pnpm-lock.yaml changes.
# Access: http://localhost:4321
dev:
	docker compose -f docker-compose.dev.yml up --build

# Same but detached
dev-d:
	docker compose -f docker-compose.dev.yml up --build -d

# ── Teardown ────────────────────────────────────────────────────────────────
down:
	docker compose -f docker-compose.dev.yml down

# ── Logs ────────────────────────────────────────────────────────────────────
logs:
	docker compose -f docker-compose.dev.yml logs -f node

# ── Production-mirror — full build, Nginx in front ─────────────────────────
# Use this to validate nginx.conf changes, SSR endpoint, or pre-deploy smoke test.
# Access: http://localhost:8080
prod-local:
	docker compose up --build --remove-orphans