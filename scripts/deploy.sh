#!/usr/bin/env bash
set -euo pipefail

# Deploy Sergioind on the VPS after git pull.
# Override paths/URLs by exporting env vars before running, e.g.:
#   APP_DIR=/var/www/sergio API_URL=https://sergio-ind.com/api bash scripts/deploy.sh

APP_DIR="${APP_DIR:-/var/www/sergio}"
BRANCH="${BRANCH:-main}"
API_URL="${API_URL:-https://sergio-ind.com/api}"
PM2_APP_NAME="${PM2_APP_NAME:-sergio-backend}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1"
}

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "Repository not found at $APP_DIR"
  echo "Clone it first: git clone https://github.com/MafateehITBU/Sergioind.git $APP_DIR"
  exit 1
fi

cd "$APP_DIR"

log "Pulling latest code from origin/$BRANCH"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

log "Installing backend dependencies"
cd "$APP_DIR/backend"
npm ci --omit=dev

if [[ ! -f ".env" ]]; then
  echo "Missing backend/.env on the server. Create it before deploying."
  exit 1
fi

log "Building frontend"
cd "$APP_DIR/frontend"
npm ci
VITE_BACKEND_URL="$API_URL" npm run build

log "Building dashboard"
cd "$APP_DIR/dashboard"
npm ci
CI=false REACT_APP_BACKEND_URL="$API_URL" npm run build

log "Restarting backend with PM2"
cd "$APP_DIR/backend"

PORT="$(
  grep -E '^PORT=' .env 2>/dev/null | tail -n1 | cut -d '=' -f2- | tr -d ' \r"' || true
)"
PORT="${PORT:-5001}"

log "Stopping PM2 app and freeing port $PORT"
pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
if id "$DEPLOY_USER" >/dev/null 2>&1; then
  sudo -u "$DEPLOY_USER" pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
fi
pkill -9 -f "$APP_DIR/backend/server.js" 2>/dev/null || true
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${PORT}/tcp" 2>/dev/null || true
elif command -v lsof >/dev/null 2>&1; then
  lsof -ti:"$PORT" | xargs -r kill -9 2>/dev/null || true
fi
sleep 3

if ss -lntp 2>/dev/null | grep -q ":${PORT} "; then
  echo "Port $PORT is still in use. Aborting deploy restart."
  ss -lntp | grep ":${PORT} " || true
  exit 1
fi

if id "$DEPLOY_USER" >/dev/null 2>&1; then
  log "Starting backend with PM2 as $DEPLOY_USER (fork mode)"
  sudo -u "$DEPLOY_USER" bash -c "cd '$APP_DIR/backend' && pm2 start server.js --name '$PM2_APP_NAME' -f --time && pm2 save"
  # If this script is run as root, remove any duplicate root-owned PM2 app.
  if [[ "$(id -un)" != "$DEPLOY_USER" ]]; then
    pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
  fi
else
  log "Starting backend with PM2 as $(whoami) (fork mode)"
  pm2 start server.js --name "$PM2_APP_NAME" -f --time
  pm2 save
fi

log "Deploy finished successfully"
