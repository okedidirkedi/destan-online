const assert = require("assert");
const vfx = require("../public/vfx/okcu-projectile-vfx.js");

function img(id) {
  return { id: id, width: 128, height: 48 };
}

function assets(set) {
  const bag = {};
  bag[set] = vfx.FRAME_IDS.map(img);
  return bag;
}

class Sprite {
  constructor() {
    this.anchor = { set() {} };
    this.visible = false;
    this.texture = null;
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
  }
}

function instance(def, extra) {
  const fallback = { visible: true, renderable: true };
  const layerState = new Map([["shot", { fallbackGfx: fallback }]]);
  return Object.assign({
    definition: def,
    layerState: layerState,
    container: { scale: { x: 1 }, addChild() {} },
    startTime: 0,
    durationMs: 450,
    screenPath: { fromX: 0, fromY: 0, toX: 10, toY: 0, durationMs: 450 }
  }, extra);
}

const basic = instance({ id: "okcu-shot", name: "Ok Atışı", layers: [{ type: "sprite", params: { mediaSrc: "evfx-shoot-mz" } }] });
assert.strictEqual(vfx.classify(basic.definition, basic), "arrow");

const fire = instance({ name: "FireArrow", layers: [{ params: { mediaSrc: "missing" } }] });
assert.strictEqual(vfx.classify(fire.definition, fire), "fire-arrow");

const magic = instance({ vfxType: "magic_arrow", name: "Büyü Oku" });
assert.strictEqual(vfx.classify(magic.definition, magic), "magic-arrow");

const rain = instance({ name: "ArrowRain" }, { screenPath: null });
assert.strictEqual(vfx.classify(rain.definition, rain), "arrow-rain");

const fireRain = instance({ name: "FireArrowRain" }, { screenPath: null });
assert.strictEqual(vfx.classify(fireRain.definition, fireRain), "fire-arrow-rain");

const darkRain = instance({ name: "DarkArrowRain" }, { screenPath: null });
assert.strictEqual(vfx.classify(darkRain.definition, darkRain), "dark-arrow-rain");

const spear = instance({ name: "Spear Throw", layers: [{ params: { mediaSrc: "spear" } }] });
assert.strictEqual(vfx.classify(spear.definition, spear), null);

assert.deepStrictEqual(vfx.FRAME_IDS, [
  "0001", "0003", "0005", "0007", "0009",
  "0011", "0013", "0015", "0017", "0019",
  "0021", "0023", "0025", "0027", "0029"
]);
assert.strictEqual(vfx.frameIndex({ startTime: 0, durationMs: 450 }, "arrow", 0), 0);
assert.strictEqual(vfx.frameIndex({ startTime: 0, durationMs: 450 }, "arrow", 449), 14);
assert.ok(vfx.frameIndex({ startTime: 0, durationMs: 1000 }, "arrow-rain", 700) !==
  vfx.frameIndex({ startTime: 0, durationMs: 1000 }, "arrow-rain", 0));

const bound = vfx.bindInstance(basic, assets("arrow"), 40, Sprite);
assert.strictEqual(bound.bound, true);
assert.strictEqual(bound.hidden, 1);
assert.strictEqual(basic.layerState.get("shot").fallbackGfx.visible, false);
assert.strictEqual(basic.layerState.get("shot").fallbackGfx.renderable, false);
assert.strictEqual(basic.__destanArrows.length, 1);
assert.strictEqual(basic.__destanArrows[0].visible, true);
assert.ok(basic.__destanArrows[0].width > 20);
assert.notStrictEqual(basic.__destanArrows[0].width, basic.__destanArrows[0].height);

const failed = { arrow: [] };
failed.arrow.__failed = true;
const hidden = vfx.bindInstance(basic, failed, 40, Sprite);
assert.strictEqual(hidden.failed, true);
assert.strictEqual(basic.__destanArrows[0].visible, false);
assert.strictEqual(basic.layerState.get("shot").fallbackGfx.visible, false);

const rainInst = instance({ name: "ArrowRain" }, { screenPath: null });
vfx.bindInstance(rainInst, assets("arrow-rain"), 100, Sprite);
assert.strictEqual(rainInst.__destanArrows.length, 7);

console.log("okcu-vfx tests passed");
