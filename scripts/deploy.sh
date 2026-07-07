#!/usr/bin/env bash
set -euo pipefail

# Deploy Sergioind on the VPS after git pull.
# Override paths/URLs by exporting env vars before running, e.g.:
#   APP_DIR=/var/www/sergio API_URL=https://sergio-ind.com/api bash scripts/deploy.sh

APP_DIR="${APP_DIR:-/var/www/sergio}"
BRANCH="${BRANCH:-main}"
API_URL="${API_URL:-https://sergio-ind.com/api}"
PM2_APP_NAME="${PM2_APP_NAME:-sergio-backend}"

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
if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  pm2 delete "$PM2_APP_NAME"
fi
pm2 start ecosystem.config.cjs
pm2 save

log "Deploy finished successfully"
