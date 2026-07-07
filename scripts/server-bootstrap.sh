#!/usr/bin/env bash
set -euo pipefail

# One-time VPS bootstrap for Sergioind auto-deploy.
# Run on the server as root:
#   curl -fsSL <raw-url> | bash
# or copy this file to the server and run:
#   bash server-bootstrap.sh

APP_DIR="${APP_DIR:-/var/www/sergio}"
REPO_URL="${REPO_URL:-https://github.com/MafateehITBU/Sergioind.git}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1"
}

log "Installing system packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y curl git nginx

if ! command -v node >/dev/null 2>&1; then
  log "Installing Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  log "Installing PM2"
  npm install -g pm2
  pm2 startup systemd -u root --hp /root
fi

if [[ ! -d "$APP_DIR/.git" ]]; then
  log "Cloning repository into $APP_DIR"
  mkdir -p "$(dirname "$APP_DIR")"
  git clone "$REPO_URL" "$APP_DIR"
else
  log "Repository already exists at $APP_DIR"
fi

chmod +x "$APP_DIR/scripts/deploy.sh"

if [[ ! -f "$APP_DIR/backend/.env" ]]; then
  log "Create $APP_DIR/backend/.env before the first deploy"
fi

log "Bootstrap complete"
log "Next steps:"
echo "  1. Put backend/.env on the server"
echo "  2. Configure nginx (see scripts/nginx-sergioind.conf)"
echo "  3. Run: cd $APP_DIR && bash scripts/deploy.sh"
echo "  4. Add GitHub secrets for SSH deploy (see workflow comments in repo)"
