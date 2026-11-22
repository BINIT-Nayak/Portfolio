import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

function harness() {
  const frames = new Map();
  let sequence = 0;
  let disconnected = 0;
  let removedListeners = 0;
  const globals = {
    requestAnimationFrame: (callback) => {
      const id = ++sequence;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    ResizeObserver: class {
      observe() {}
      disconnect() {
        disconnected++;
      }
    },
    matchMedia: () => ({
      addEventListener() {},
      removeEventListener() {
        removedListeners++;
      },
    }),
    window: { devicePixelRatio: 2 },
  };
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
    }).outputText;
    vm.runInNewContext(source, {
      ...globals,
      module,
      exports: module.exports,
      require: (name) => load(path.resolve(path.dirname(filename), name + ".ts")),
    });
    return module.exports;
  }
  const { CometEngine } = load(path.resolve("components/labs/comet/engine/CometEngine.ts"));
  function canvas() {
    const rect = { width: 600, height: 400 };
    const ctx = new Proxy(
      {},
      {
        get: (_, name) =>
          name === "createLinearGradient" || name === "createRadialGradient"
            ? () => ({ addColorStop() {} })
            : () => {},
      }
    );
    return { width: 0, height: 0, getContext: () => ctx, getBoundingClientRect: () => rect, rect };
  }
  function frame(time) {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback(time));
  }
  return {
    CometEngine,
    canvas,
    frames,
    frame,
    cleanup: () => ({ disconnected, removedListeners }),
  };
}
const options = {
  from: { x: 40, y: 40 },
  to: { x: 200, y: 300 },
  duration: 1000,
  particleCount: 0,
};
test("concurrent surfaces share one frame; pausing preserves logical time across long gaps", () => {
  const h = harness();
  const first = new h.CometEngine(h.canvas());
  const second = new h.CometEngine(h.canvas());
  first.launch(options);
  second.launch(options);
  assert.equal(h.frames.size, 1);
  h.frame(0);
  h.frame(200);
  assert.equal(first.comets[0].progress, 0.2);
  first.pause();
  second.pause();
  assert.equal(h.frames.size, 0);
  first.resume();
  h.frame(10000);
  assert.equal(first.comets[0].progress, 0.2);
  h.frame(10100);
  assert.equal(first.comets[0].progress, 0.3);
  first.destroy();
  second.destroy();
  assert.equal(h.frames.size, 0);
  assert.equal(h.cleanup().disconnected, 2);
  assert.equal(h.cleanup().removedListeners, 2);
});
test("idle, clear, and resize release work; canvas backing dimensions respect DPR", () => {
  const h = harness();
  const canvas = h.canvas();
  const engine = new h.CometEngine(canvas);
  assert.equal(canvas.width, 1200);
  engine.launch(options);
  h.frame(0);
  h.frame(3000);
  assert.equal(engine.comets.length, 0);
  assert.equal(h.frames.size, 0);
  engine.launch(options);
  canvas.rect.width = 300;
  engine.resize();
  assert.equal(canvas.width, 600);
  assert.equal(engine.comets.length, 0);
  assert.equal(h.frames.size, 0);
  engine.launch(options);
  engine.clear();
  assert.equal(h.frames.size, 0);
  engine.destroy();
  assert.throws(() => engine.launch(options), /destroy/);
});
test("invalid and unbounded launch requests are rejected", () => {
  const h = harness();
  const engine = new h.CometEngine(h.canvas());
  assert.throws(() => engine.launch({ ...options, duration: 0 }), /positive/);
  assert.throws(() => engine.launch({ ...options, from: { x: NaN, y: 0 } }), /finite/);
  for (let i = 0; i < 16; i++) engine.launch(options);
  assert.throws(() => engine.launch(options), /finish/);
  engine.destroy();
});
