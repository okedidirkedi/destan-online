# Destan Online

Site: https://destanonline.com  
Motor: ED5 MMO Studio  
Dil: Türkçe (tam yüzey)

Bu repo yerelleştirme paketidir. `.ed5proj` editör projesi burada yok — o dosya Taner diskindeki Studio projesidir, GitHub’a atılmadı.

## Dosyalar

| Yol | Ne işe yarar |
|-----|----------------|
| `locale/studio-tr.json` | ED5 Studio editör menüleri, sol panel, araçlar |
| `locale/game-tr.json` | Oyun HUD, çanta, sohbet, savaş, Vocabulary |
| `locale/site-tr.json` | destanonline.com görünür metinler |
| `docs/HANDOFF.md` | Uygulama sırası |

## Nasıl uygulanır

1. Studio sol panel → **Vocabulary** → `game-tr.json` içindeki anahtarları yapıştır.
2. Studio sol panel → **Localization** → locale `tr` ekle, içerik adlarını Türkçe yaz.
3. Site / login / HUD hardcoded metinler `site-tr.json` + `game-tr.json`.
4. Editörün kendi File/Edit/View çerçevesi ED5 ürünüdür; resmi TR dil paketi yoksa menü çubugu İngilizce kalır. Oyuncu yüzeyi ve içerik tam TR olur.
