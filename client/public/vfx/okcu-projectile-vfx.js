/**
 * Okçu projectile VFX bind.
 *
 * Live client (chunk 7996, webpack module 61616, VFX tick `$`) draws a solid
 * white Graphics.rect when a sprite layer's mediaSrc is empty or did not load.
 * This script hides that fallback and plays odd-numbered arrow frames instead.
 * It does not touch the HUD, skill bar, minimap, GCD text, or camera.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DestanOkcuVfx = api;
  if (typeof document !== "undefined") api.install();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var g = typeof globalThis !== "undefined" ? globalThis : window;
  var FRAME_IDS = [];
  for (var n = 1; n <= 29; n += 2) FRAME_IDS.push(n < 10 ? "000" + n : "00" + n);

  var SET_DIRS = {
    arrow: "arrow/",
    "fire-arrow": "fire-arrow/",
    "magic-arrow": "magic-arrow/",
    "arrow-rain": "arrow-rain/",
    "fire-arrow-rain": "fire-arrow-rain/",
    "dark-arrow-rain": "dark-arrow-rain/"
  };

  function arrowWord(text) {
    return /arrow|okcu|okçu|\boku\b|\bok\b|yay|bow|ranged/.test(text);
  }

  function classify(def, inst) {
    var text = "";
    try {
      text = JSON.stringify(def || {}).toLowerCase();
    } catch (e) {
      text = "";
    }
    var rain = /arrowrain|firearrowrain|darkarrowrain|arrow rain/.test(text) ||
      (/rain|yagmur|yağmur/.test(text) && arrowWord(text));
    var fire = /firearrow|fire_arrow|atesok|ateşok|flamearrow/.test(text) ||
      (/fire|ates|ateş|flame|burn/.test(text) && arrowWord(text));
    var dark = /darkarrow|karanlik|karanlık/.test(text);
    var magic = /magicarrow|magic_arrow|buyuoku|büyüok|arcane/.test(text) ||
      (/magic|buyu|büyü|arcane/.test(text) && arrowWord(text));
    var arrowish = arrowWord(text) || /ranged_projectile/.test(text);
    var blocked = /spear|bullet|zombie/.test(text) && !arrowWord(text);
    if (blocked) return null;
    var projectile = !!(inst && inst.screenPath);
    if (!rain && !fire && !magic && !dark && !arrowish && !projectile) return null;
    if (projectile && !arrowish && !rain && !fire && !magic && !dark) {
      if (/fireball|lightning|bolt|meteor|nova/.test(text)) return null;
    }
    if (rain && fire) return "fire-arrow-rain";
    if (rain && dark) return "dark-arrow-rain";
    if (rain) return "arrow-rain";
    if (fire) return "fire-arrow";
    if (magic || dark) return "magic-arrow";
    if (arrowish || projectile) return "arrow";
    return null;
  }

  function frameIndex(inst, set, now) {
    var looping = set.indexOf("rain") !== -1;
    var dur = inst && inst.durationMs > 0 ? inst.durationMs : 420;
    var start = inst && typeof inst.startTime === "number" ? inst.startTime : now;
    var elapsed = Math.max(0, now - start);
    var step = looping ? 70 : dur / FRAME_IDS.length;
    var i = Math.floor(elapsed / Math.max(1, step));
    if (!looping) return Math.min(FRAME_IDS.length - 1, i);
    return ((i % FRAME_IDS.length) + FRAME_IDS.length) % FRAME_IDS.length;
  }

  function hideWhiteFallback(inst) {
    if (!inst || !inst.layerState || typeof inst.layerState.forEach !== "function") return 0;
    var hidden = 0;
    inst.layerState.forEach(function (layer) {
      var gfx = layer && layer.fallbackGfx;
      if (!gfx) return;
      gfx.visible = false;
      if ("renderable" in gfx) gfx.renderable = false;
      hidden += 1;
    });
    return hidden;
  }

  function ensureSprites(inst, count, Sprite) {
    var list = inst.__destanArrows;
    if (!list) {
      list = [];
      inst.__destanArrows = list;
    }
    var parent = inst.container;
    while (list.length < count) {
      var spr = new Sprite(Sprite.__destanEmpty || undefined);
      if (spr.anchor && spr.anchor.set) spr.anchor.set(0.78, 0.5);
      spr.__destanArrow = 1;
      if (parent && parent.addChild) parent.addChild(spr);
      list.push(spr);
    }
    return list;
  }

  function place(spr, tex, scale, x, y) {
    if (!spr) return;
    if (tex && spr.texture !== tex) spr.texture = tex;
    var s = scale > 0 ? scale : 1;
    spr.width = 78 / s;
    spr.height = 28 / s;
    spr.x = x;
    spr.y = y;
    spr.visible = true;
    spr.alpha = 1;
    spr.rotation = 0;
  }

  function bindInstance(inst, assets, now, Sprite) {
    var set = classify(inst && inst.definition, inst);
    if (!set) return { set: null, hidden: 0, bound: false };
    var hidden = hideWhiteFallback(inst);
    var frames = assets && assets[set];
    if (!frames || !frames.length || frames.__failed) {
      if (inst.__destanArrows) {
        for (var i = 0; i < inst.__destanArrows.length; i++) inst.__destanArrows[i].visible = false;
      }
      return { set: set, hidden: hidden, bound: false, failed: true };
    }
    var idx = frameIndex(inst, set, now);
    var tex = frames[Math.min(idx, frames.length - 1)];
    var scale = 1;
    if (inst.container && inst.container.scale && inst.container.scale.x) scale = inst.container.scale.x;
    var rain = set.indexOf("rain") !== -1 && !(inst && inst.screenPath);
    var count = rain ? 7 : 1;
    var sprites = ensureSprites(inst, count, Sprite);
    for (var s = 0; s < sprites.length; s++) {
      if (s >= count) {
        sprites[s].visible = false;
        continue;
      }
      var texN = frames[(idx + s * 2) % frames.length];
      if (rain) {
        var t = (now / 420 + s / count) % 1;
        place(sprites[s], texN, scale, (s - 3) * (18 / scale), (-40 + t * 90) / scale);
      } else {
        place(sprites[s], tex, scale, 0, 0);
      }
    }
    inst.__destanArrowSet = set;
    return { set: set, hidden: hidden, bound: true, frame: FRAME_IDS[idx] };
  }

  function baseUrl() {
    if (typeof document === "undefined") return "/vfx/projectiles/";
    var script = document.currentScript;
    if (script && script.src) return script.src.replace(/okcu-projectile-vfx\.js(?:\?.*)?$/, "projectiles/");
    return "/vfx/projectiles/";
  }

  function install() {
    if (g.__destanOkcuVfx) return;
    g.__destanOkcuVfx = 1;
    var assets = {};
    var logged = {};
    var urlBase = baseUrl();

    function fail(set, url) {
      if (!assets[set]) assets[set] = [];
      assets[set].__failed = true;
      if (logged[url]) return;
      logged[url] = 1;
      console.error("[Okçu VFX] texture load failed: " + url + " — projectile hidden, no white fallback");
    }

    function preload() {
      Object.keys(SET_DIRS).forEach(function (set) {
        var list = new Array(FRAME_IDS.length);
        assets[set] = list;
        FRAME_IDS.forEach(function (id, index) {
          var url = urlBase + SET_DIRS[set] + id + ".png";
          var img = new Image();
          img.decoding = "async";
          img.onload = function () {
            if (!img.naturalWidth || !img.naturalHeight || (img.naturalWidth <= 2 && img.naturalHeight <= 2)) {
              fail(set, url + " (empty bitmap " + img.naturalWidth + "x" + img.naturalHeight + ")");
              return;
            }
            list[index] = { img: img, id: id, url: url };
          };
          img.onerror = function () { fail(set, url); };
          img.src = url;
        });
      });
    }

    function textureFor(engine, record) {
      if (!record) return null;
      if (record.tex) return record.tex;
      var sample = engine.dayNightOverlay;
      var Texture = sample && sample.texture && sample.texture.constructor;
      if (!Texture) return record.img;
      try {
        if (typeof Texture.from === "function") record.tex = Texture.from(record.img);
        else record.tex = new Texture({ source: record.img });
      } catch (err) {
        console.error("[Okçu VFX] texture bind failed: " + record.url + " — " + (err && err.message));
        return null;
      }
      return record.tex;
    }

    function framesFor(engine, set) {
      var list = assets[set];
      if (!list || list.__failed) return list;
      var out = [];
      for (var i = 0; i < FRAME_IDS.length; i++) {
        if (!list[i]) return null;
        var tex = textureFor(engine, list[i]);
        if (!tex) return null;
        out.push(tex);
      }
      return out;
    }

    function sweep(engine) {
      var map = engine && engine.dataDrivenVfxInstances;
      if (!map || typeof map.forEach !== "function") return;
      var sample = engine.dayNightOverlay;
      var Sprite = sample && sample.constructor;
      if (!Sprite) return;
      var now = (g.performance && performance.now()) || Date.now();
      map.forEach(function (inst) {
        var set = classify(inst && inst.definition, inst);
        if (!set) return;
        var packed = framesFor(engine, set);
        if (assets[set] && assets[set].__failed) {
          bindInstance(inst, assets, now, Sprite);
          return;
        }
        if (!packed || !packed.length) {
          hideWhiteFallback(inst);
          return;
        }
        var bag = {};
        bag[set] = packed;
        bindInstance(inst, bag, now, Sprite);
      });
    }

    function hook(engine) {
      if (!engine || engine.__destanOkcuTicker) return;
      var ticker = engine.app && engine.app.ticker;
      if (!ticker || typeof ticker.add !== "function") return;
      engine.__destanOkcuTicker = 1;
      ticker.add(function () { sweep(engine); }, null, -10000);
    }

    preload();
    var timer = setInterval(function () {
      var engine = g.__ed5Engine;
      if (!engine) return;
      hook(engine);
      if (engine.__destanOkcuTicker) clearInterval(timer);
    }, 300);

    g.DestanOkcuVfx._assets = assets;
    g.DestanOkcuVfx._sweep = sweep;
  }

  return {
    FRAME_IDS: FRAME_IDS,
    classify: classify,
    frameIndex: frameIndex,
    hideWhiteFallback: hideWhiteFallback,
    bindInstance: bindInstance,
    install: install
  };
});
