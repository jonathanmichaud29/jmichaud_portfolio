.PHONY: init _check-env _preflight build up reset-js

_check-env:
	@MISSING=$$(grep -E "^[^#].*=REPLACE_ME" .env | cut -d= -f1); \
	if [ -n "$$MISSING" ]; then \
		echo ""; \
		echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; \
		echo "⚠️  Action required — manual credentials needed"; \
		echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; \
		echo ""; \
		echo "The following variables still require manual setup:"; \
		echo ""; \
		for var in $$MISSING; do echo "  • $$var"; done; \
		echo ""; \
		echo "📖 docs/credentials.md"; \
		echo "   https://github.com/your-org/your-repo/blob/main/docs/credentials.md"; \
		echo ""; \
		echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; \
		echo ""; \
	else \
		echo "✅ .env is fully configured — run: make up"; \
	fi

_preflight:
	@test -f .env || { \
		echo "🚫 .env not found — run: make init"; \
		exit 1; \
	}
	@MISSING=$$(grep -E "^[^#].*=REPLACE_ME" .env | cut -d= -f1); \
	if [ -n "$$MISSING" ]; then \
		echo ""; \
		echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; \
		echo "🚫 Build blocked — credentials not configured"; \
		echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; \
		echo ""; \
		echo "The following variables in .env still contain REPLACE_ME:"; \
		echo ""; \
		for var in $$MISSING; do echo "  • $$var"; done; \
		echo ""; \
		echo "📖 docs/credentials.md"; \
		echo "   https://github.com/your-org/your-repo/blob/main/docs/credentials.md"; \
		echo ""; \
		echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; \
		exit 1; \
	fi

init:
	@test -f .env && { echo "⚠️  .env already exists. Delete it manually to reinitialize."; exit 1; } || true
	@cp .env.example .env
	@perl -i -pe "s/^UID=REPLACE_ME/UID=$(shell id -u)/" .env
	@perl -i -pe "s/^GID=REPLACE_ME/GID=$(shell id -g)/" .env
	@perl -i -pe "s/^DB_PASSWORD=REPLACE_ME/DB_PASSWORD=$(shell openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 20)/" .env
	@perl -i -pe "s/^APP_KEY=REPLACE_ME/APP_KEY=$(shell openssl rand -hex 32)/" .env
	@$(MAKE) _check-env

build: 
	_preflight
	docker compose build

up: 
	_preflight
	docker compose up

reset-js:
	docker compose down
	docker volume rm $(shell docker compose config --volumes | grep node_modules)
	docker compose up -d web
	## Add web-2 here when it exists