# ---------------------
REMOTE_USER = root
REMOTE_HOST = 176.124.208.218
REMOTE_PATH = ~/
# ---------------------

.PHONY: build deploy update-docker-compose restart 

build:
	@echo "building site... 🔨"
	@bun run build

deploy: build-site
	@echo "🚀 deploying site to moscow.radioznb.ru..."
	@scp -r .next/ $(REMOTE_USER)@$(REMOTE_HOST):$(REMOTE_PATH)/radioznb
	@ssh $(REMOTE_USER)@$(REMOTE_HOST) "pm2 restart radioznb"
	@echo "✅ website deployed!"

update-docker-compose:
	@echo "🚀 pushing new docker-compose file to the server..."
	@scp docker-compose.yml $(REMOTE_USER)@$(REMOTE_HOST):$(REMOTE_PATH)
	@ssh $(REMOTE_USER)@$(REMOTE_HOST) "cd $(REMOTE_PATH) && docker compose down && docker compose up -d --build"
	@echo "✅ new docker compose file deployed!"

restart:
	@ssh $(REMOTE_USER)@$(REMOTE_HOST) "pm2 restart radioznb"