# ---------------------
REMOTE_USER = root
REMOTE_HOST = 176.124.208.218
REMOTE_PATH = ~/radioznb
# proper way to load environment for non-interactive shells
REMOTE_CMD = ssh $(REMOTE_USER)@$(REMOTE_HOST) 'bash -l -c
# ---------------------

.PHONY: deploy restart logs status clean-remote setup-env

# one-time setup: create environment file that works for non-interactive shells
setup-env:
	@echo "🔧 setting up environment on server..."
	@ssh $(REMOTE_USER)@$(REMOTE_HOST) 'echo "export BUN_INSTALL=\"\$$HOME/.bun\"" > ~/.bashenv && echo "export PATH=\"\$$BUN_INSTALL/bin:\$$PATH\"" >> ~/.bashenv && cat ~/.bashenv'
	@echo "✅ environment file created at ~/.bashenv"

# check if package.json or bun.lock changed
check-deps:
	@echo "📦 checking for dependency changes..."
	@if ssh $(REMOTE_USER)@$(REMOTE_HOST) "[ -f $(REMOTE_PATH)/package.json ]"; then \
		scp $(REMOTE_USER)@$(REMOTE_HOST):$(REMOTE_PATH)/package.json /tmp/remote-package.json.tmp 2>/dev/null || true; \
		if ! diff -q package.json /tmp/remote-package.json.tmp > /dev/null 2>&1; then \
			echo "⚠️  package.json changed - will sync dependencies"; \
		fi; \
		rm -f /tmp/remote-package.json.tmp; \
	fi

# fast sync using rsync (excludes heavy folders)
sync-code:
	@echo "📦 syncing code to server..."
	@ssh $(REMOTE_USER)@$(REMOTE_HOST) "mkdir -p $(REMOTE_PATH)"
	@rsync -avz --delete \
		--exclude 'node_modules' \
		--exclude '.next' \
		--exclude '.git' \
		--exclude 'dist' \
		--exclude 'build' \
		--exclude '.env.local' \
		--exclude '.DS_Store' \
		./ $(REMOTE_USER)@$(REMOTE_HOST):$(REMOTE_PATH)/
	@echo "✅ code synced"

# install dependencies on server if needed
install-deps:
	@echo "📥 installing dependencies on server..."
	@$(REMOTE_CMD) "cd ~/radioznb && bun install"'

# build on server with memory constraints
build-remote:
	@echo "🔨 building on server (memory-optimized)..."
	@$(REMOTE_CMD) "cd ~/radioznb && bun --bun run build"'

# main deploy: sync code, install deps if needed, build on server, restart
deploy: check-deps sync-code
	@echo "📥 installing/updating dependencies..."
	@$(REMOTE_CMD) "cd ~/radioznb && bun install"'
	@$(MAKE) build-remote
	@echo "🔄 restarting application..."
	@$(REMOTE_CMD) "cd ~/radioznb && pm2 restart radioznb || pm2 start ecosystem.config.js"'
	@echo "✅ website deployed!"

# force reinstall dependencies (use when package.json changes)
deploy-deps: check-deps sync-code install-deps build-remote
	@echo "🔄 restarting application..."
	@$(REMOTE_CMD) "cd ~/radioznb && pm2 restart radioznb || pm2 start ecosystem.config.js"'
	@echo "✅ website deployed with fresh dependencies!"

restart:
	@$(REMOTE_CMD) "pm2 restart radioznb"'

logs:
	@$(REMOTE_CMD) "pm2 logs radioznb"'

status:
	@$(REMOTE_CMD) "pm2 status radioznb"'

# clean .next folder on server to save space
clean-remote:
	@$(REMOTE_CMD) "cd ~/radioznb && rm -rf .next"'