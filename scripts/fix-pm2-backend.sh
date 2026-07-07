#!/usr/bin/env bash
set -euo pipefail

# Emergency stop + clean restart for sergio-backend on the VPS.
# Run as root: bash /var/www/sergio/scripts/fix-pm2-backend.sh

APP_DIR="${APP_DIR:-/var/www/sergio}"
PM2_APP_NAME="${PM2_APP_NAME:-sergio-backend}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
BACKEND_DIR="$APP_DIR/backend"
ENV_FILE="$BACKEND_DIR/.env"

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1"
}

if [[ ! -f "$BACKEND_DIR/server.js" ]]; then
  echo "Backend not found at $BACKEND_DIR"
  exit 1
fi

PORT="$(
  grep -E '^PORT=' "$ENV_FILE" 2>/dev/null | tail -n1 | cut -d '=' -f2- | tr -d ' \r"' || true
)"
PORT="${PORT:-5001}"

log "Stopping PM2 apps named $PM2_APP_NAME (root + $DEPLOY_USER)"
pm2 stop "$PM2_APP_NAME" 2>/dev/null || true
pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
if id "$DEPLOY_USER" >/dev/null 2>&1; then
  sudo -u "$DEPLOY_USER" pm2 stop "$PM2_APP_NAME" 2>/dev/null || true
  sudo -u "$DEPLOY_USER" pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
fi

log "Killing stray node processes for this backend"
pkill -9 -f "$BACKEND_DIR/server.js" 2>/dev/null || true

log "Freeing port $PORT"
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${PORT}/tcp" 2>/dev/null || true
elif command -v lsof >/dev/null 2>&1; then
  lsof -ti:"$PORT" | xargs -r kill -9 2>/dev/null || true
fi

sleep 3

if ss -lntp 2>/dev/null | grep -q ":${PORT} "; then
  echo "Port $PORT is STILL in use:"
  ss -lntp | grep ":${PORT} " || true
  ps aux | grep -E "node|pm2" | grep -v grep || true
  exit 1
fi

log "Starting backend in fork mode on port $PORT"
if id "$DEPLOY_USER" >/dev/null 2>&1; then
  sudo -u "$DEPLOY_USER" bash -c "cd '$BACKEND_DIR' && pm2 start server.js --name '$PM2_APP_NAME' -f --time && pm2 save"
  pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
  sudo -u "$DEPLOY_USER" pm2 list
else
  cd "$BACKEND_DIR"
  pm2 start server.js --name "$PM2_APP_NAME" -f --time
  pm2 save
  pm2 list
fi

sleep 2
curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null && log "Health check OK on port $PORT"
