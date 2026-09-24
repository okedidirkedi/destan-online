# Okçu atış VFX — beyaz dikdörtgen

Canlı: https://destanonline.com  
Paket: `/_next/static/chunks/7996-1b5514390130a191.js` (deploy `dpl_5hRWmsCwc2meP2y59kS4wbZ2gsYw`)

## Kök neden

Hasar sayısı ve GCD ayrı kanaldan gelir (`showFloatingText`, hotbar). Ok görseli `playProjectileVfx` → `vfxDefs[projectileVfxId]` sprite katmanıdır.

Sprite katmanı `params.mediaSrc` boşsa, 404 ise, veya `vfxSpriteTextureCache` kaydı `null` ise tick fonksiyonu düz beyaz dikdörtgen çizer:

- Dosya: canlı chunk `7996-1b5514390130a191.js`
- Webpack modülü: `61616`
- Fonksiyon: `$` (data-driven VFX tick), `"sprite"===i.type` dalı
- Düğüm: `layer.fallbackGfx` (`PIXI.Graphics`)

```js
e.clear();
e.rect(-n/2, -l/2, n, l);
e.fill({ color: 0xffffff, alpha: /* params.alpha, varsayılan 0.45 */ });
e.visible = true;
```

`n` / `l` = `frameWidth` / `frameHeight` × scale. Tanımsız texture ile bu, ekrandaki dikey beyaz/gri şerit olur. Hasar metni (`376!`) aynı karede `uiContainer` üstüne yazılır; o yüzden sayı dururken ok kutusu beyaz kalır.

Medya çözümlemesi (`37663` / `function n`): id düz ise `/api/media/<id>` (canlıda `https://destanonline.com/gs/api/media/<id>`).

Kanıt (2026-09-24):

| URL | Sonuç |
|---|---|
| `GET /gs/api/media/destan_okcu_attack` | 200, `image/png`, 222849 bayt, 1920×1024 (yürüyüş/saldırı sheet — buna dokunulmadı) |
| `GET /gs/api/media/destan_arrow` | 404 `{"error":"Media not found"}` |
| `GET /gs/api/media/arrow` | 404 aynı gövde |
| `GET /gs/api/media/evfx_shoot` | 404 aynı gövde |
| `GET /gs/api/media/destan_okcu_shot` | 404 aynı gövde |

Önceki EVFX Shoot MZ Demo bağı bu 404 / boş `mediaSrc` yolunu doldurmadı. Motor eksik texture'da sprite'ı gizlemiyor; `fallbackGfx` beyaz rect basıyor.

## Yeni bağ

| Eski | Yeni |
|---|---|
| `vfx.layers[].params.mediaSrc` → `/gs/api/media/<evfx veya boş id>` (404) | `/vfx/projectiles/arrow/0001.png` … `0029.png` (tek sayılar, 15 kare) |
| Beyaz `Graphics.rect` | Aynı kareler, uçuş boyunca bir kez oynar; yüklenemezse VFX gizlenir, konsola `[Okçu VFX] texture load failed` |

| Skill izi | Klasör |
|---|---|
| Temel ok / `ranged` / ekran yolu olan atış | `client/public/vfx/projectiles/arrow/` |
| FireArrow | `fire-arrow/` |
| MagicArrow | `magic-arrow/` |
| ArrowRain | `arrow-rain/` (döngü, 7 ok) |
| FireArrowRain | `fire-arrow-rain/` |
| DarkArrowRain | `dark-arrow-rain/` |

Spear, Bullet, zombie ve EVFX Shoot MZ Demo kullanılmıyor. `5CamoArcher` yürüme/saldırı sheet'leri değişmedi.

Kareler şu an yer tutucu ok çizimi (şeffaf zemin, 128×48, baş sağa). Taner paketini aynı dosya adlarıyla üstüne koy:

`T:\OYUN CANAVARLARI\KARAKTER PAKETİ\İNSANLAR\SKILL\` + `client/public/vfx/projectiles/manifest.json` içindeki `tanerPack`.

Çift numaralı kare yok. Üretim `T:\` okumaz.

## Çalışma

`client/public/vfx/okcu-projectile-vfx.js` yalnızca `__ed5Engine.dataDrivenVfxInstances` üzerinde çalışır.

- Pixi ticker önceliği `-10000`: VFX tick'i beyaz rect'i açtıktan sonra `fallbackGfx.visible = false`.
- Ok, uçuş konteynerinin çocuğu olduğu için yön (`container.rotation`) motordan gelir.
- İsim `spear` / `bullet` / `zombie` ise dokunulmaz.
- HUD, skill bar, GCD yazısı, minimap, `clampCameraToZoneBounds` yok.

## Deploy

1. `client/public/vfx/` içeriğini Next uygulamasının `public/vfx/` altına kopyala (canlı kök `https://destanonline.com/vfx/...`).
2. `data-destan-mobile-hud` enjekte eden yere **yeni** etiket ekle; o scripti düzenleme:

```html
<script src="/vfx/okcu-projectile-vfx.js" data-destan-okcu-vfx="1"></script>
```

3. `pm2 restart destan-ed5-client` yalnızca statik dosya client paketinin içindeyse gerekir. Ayrı nginx/OLS enjeksiyonuysa restart şart değil; HTML kaynağında yeni etiket görünmeli.
4. Oyunda Okçu atışı: Network'te `0001.png` **200**, boyut 128×48 (veya paket boyutu), `content-type: image/png`. Konsolda beyaz fallback yok. Hasar sayısı ve GCD aynı kalır.

Yerel kanıt: `client/public/vfx/dev-test.html` (beyaz `fallbackGfx` her tick açılır, script kapatır). Çalıştırma: `python3 -m http.server` içinde `client/public`, sonra `/vfx/dev-test.html`. Beklenen yazı: `fallback gizli · 128x48 · arrow/00xx.png`. `node client/vfx/okcu-vfx.test.js` sınıflandırma, tek sayılı kare sırası, yağmurda 7 ok ve yükleme hatasında gizlemeyi doğrular. Bu sayfa canlıya kopyalanmak zorunda değil.

DB `vfxDefinitions.mediaSrc` eski id'de kalsa da bu yama beyaz rect'i basmaz. Kalıcı içerik bağı için Studio VFX katmanındaki `mediaSrc` alanını `/vfx/projectiles/arrow/0001.png` yapmak yeterli; script onu da okur, asıl uçuş yine bu kare sırasıdır.
