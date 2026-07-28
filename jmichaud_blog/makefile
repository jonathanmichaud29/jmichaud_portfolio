REMOTE_USER := youruser
REMOTE_HOST := your.server.com
REMOTE_DIR  := /var/www/jmichaud-blog

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
	docker compose up --build --remove-orphans

# ── Build locally, then deploy files on server ─────────────────────────
# The rsync --delete on dist/ is critical — Astro hashes asset filenames (_astro/chunk.abc123.js). 
# Without --delete, stale hashed files accumulate on the server indefinitely.
deploy:
	@echo "→ Building production artifacts locally (inside Docker)..."
	docker compose up --build --remove-orphans
	@# ↑ This runs pnpm build inside node:22.15.0-alpine — guaranteed env

	#@echo "→ Syncing dist/ to server..."
#	rsync -avz --delete \
#		dist/ \
#		$(REMOTE_USER)@$(REMOTE_HOST):$(REMOTE_DIR)/dist/

#	@echo "→ Restarting Node on server..."
#	ssh $(REMOTE_USER)@$(REMOTE_HOST) \
#		"systemctl restart jmichaud-blog"

deploy-check:
#	@ssh $(REMOTE_USER)@$(REMOTE_HOST) \
#		"curl -sf http://localhost:4321/ > /dev/null && \
#		 echo '✓ Node process is up' || \
#		 echo '✗ Node is DOWN — check: journalctl -u jmichaud-blog -n 50'"