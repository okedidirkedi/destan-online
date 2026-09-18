# Destan Online ajan kuralları

Türkçe yanıt ver. Ürün: Destan Online. Site: https://destanonline.com

## Kökler
- Client + game server: `/home/destanonline.com/apps/ed5`
- PM2: `destan-ed5-client` (3010), `destan-ed5-gs` (3011)
- Repo: https://github.com/okedidirkedi/destan-online
- Studio projesi Taner diskte; burada `.ed5proj` yok.

## Yap
- Site, locale, PM2 restart, nginx, log.
- `pm2 restart destan-ed5-client` / `pm2 restart destan-ed5-gs`

## Yapma
- Veritabanı silme, şifre basma, ADMIN_API_KEY / CONFIG_ENCRYPTION_KEY değiştirme.
- PGlite `data/` ve Studio exe dokunma.
