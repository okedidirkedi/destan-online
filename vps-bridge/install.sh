#!/usr/bin/env bash
set -euo pipefail
ROOT=/home/destanonline.com/apps/ed5
echo "[destan-bridge] Node kontrol"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "[destan-bridge] Claude Code"
npm install -g @anthropic-ai/claude-code
mkdir -p /root/.claude "$ROOT"
if [ ! -f /root/.claude/settings.json ]; then
  cp "$(dirname "$0")/settings.json.example" /root/.claude/settings.json
  echo "[destan-bridge] settings.json örnek kopyalandı — ANAHTARI DOLDUR"
fi
install -m 644 "$(dirname "$0")/destan-agent.service" /etc/systemd/system/destan-agent.service
install -m 644 "$(dirname "$0")/CLAUDE.md" "$ROOT/CLAUDE.md"
systemctl daemon-reload
echo "[destan-bridge] bitti"
echo "1) nano /root/.claude/settings.json  → ANAHTARI yaz"
echo "2) systemctl enable --now destan-agent"
echo "3) claude --version && pm2 ls"
