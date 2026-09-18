# Destan VPS köprüsü

Hedef sunucu (DNS):
- destanonline.com → 145.223.116.231
- Hostinger: srv1709686.hstgr.cloud
- Canlı: `/home/destanonline.com/apps/ed5`
- PM2: `destan-ed5-client` :3010 · `destan-ed5-gs` :3011

Bu paket VPS’te Claude Code ajanını kurar. API anahtarını repoya koyma.

## Tek adım (VPS SSH açıkken)

```bash
cd /tmp && git clone https://github.com/okedidirkedi/destan-online.git destan-online && sudo bash destan-online/vps-bridge/install.sh
```

Sonra `~/.claude/settings.json` içine kendi key’ini yaz, `sudo systemctl enable --now destan-agent`.
