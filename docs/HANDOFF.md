# Destan Online — handoff

Türkçe yanıt ver. Ürün adı: **Destan Online**. Site: https://destanonline.com

## Kaynak
- GitHub: https://github.com/okedidirkedi/destan-online
- Studio projesi: Taner disk. Bu repoda `.ed5proj` yok.
- Canlı client: VPS `/home/destanonline.com/apps/ed5` · PM2 `destan-ed5-client` :3010, `destan-ed5-gs` :3011

## Neden ekran İngilizce?
`/cc` page.tsx TR fallback var (`Kahramanını Yarat`, `Sınıf kilitli`).
ED5 `UI_CUSTOMIZATION.copy` + `steps` dolu ve EN ise fallback ezilir → FORGE YOUR HERO / CLASS LOCKED.
Sınıf adları DB’de zaten TR (Savaşçı, Büyücü, Okçu/Bıçakçı, Şifacı).

## Uygula (zorunlu)
1. Studio → UI_CUSTOMIZATION → `locale/cc-tr.json` içindeki `copy` + `steps` yapıştır. Boş bırakma.
2. Vocabulary / Localization `tr` → `locale/game-tr.json`.
3. Site yüzeyi → `locale/site-tr.json` (title MMO→Destan Online, html lang=tr).
4. Login hardcoded → site-tr `login` anahtarları (Sign In, Register, Email Address, Guest).
5. Client page.tsx pin: `copy.title` EN ise yok say, TR fallback kullan.

## Yüklenmeyen
- ED5 Studio exe / `.ed5proj` / PGlite `data/`
- 4krallik
- DB wipe
