-include .env.deploy

.PHONY: dev dev-d down logs prod-local deploy deploy-check

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
	pnpm build
	docker compose up --build --remove-orphans

# ── Build locally, then deploy files on server ─────────────────────────
# The rsync --delete on dist/ is critical — Astro hashes asset filenames (_astro/chunk.abc123.js). 
# Without --delete, stale hashed files accumulate on the server indefinitely.
# Sequence:
#   1. pnpm build         — produces dist/client/ and dist/server/ locally
#   2. rsync dist/        — ships artifacts to server (--delete removes stale hashed files)
#   3. ssh systemctl      — restarts the Node systemd unit to pick up new dist/server/
#
# Assumptions:
#   - SSH key auth is configured for $(REMOTE_USER)@$(REMOTE_HOST)
#   - Node runs as a systemd unit named jmichaud-blog on the server
#   - dist/ exists at $(REMOTE_DIR)/dist/ on the server (mkdir -p once manually)
deploy:

	@echo "→ Building production artifacts..."
	pnpm build

	@echo "→ Syncing dist/ to server..."
	rsync -avz --delete \
		dist/ \
		$(REMOTE_USER)@$(REMOTE_HOST):$(REMOTE_DIR)/dist/
	
	@echo "✓ Deploy complete — run 'make deploy-check' to verify"

deploy-check:
#	@ssh $(REMOTE_USER)@$(REMOTE_HOST) \
#		"curl -sf http://localhost:4321/ > /dev/null && \
#		 echo '✓ Node process is up' || \
#		 echo '✗ Node is DOWN — check: journalctl -u jmichaud-blog -n 50'"