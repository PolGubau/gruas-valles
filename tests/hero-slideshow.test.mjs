import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import * as nodeModule from "node:module";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const source = readFileSync(new URL("../src/components/sections/Hero.astro", import.meta.url), "utf8");

test("el hero genera las cuatro fotos de la presentación con variantes responsivas", () => {
  const html = readFileSync(join(dist, "index.html"), "utf8");
  assert.ok(!html.includes('id="hero-motion-toggle"'));
  const tags = [...html.matchAll(/<img\b[^>]*class="hero-slide[^>]*>/g)].map(([tag]) => tag);
  const names = ["flota-liebherr-ltm1650-8-1-01.avif", "hero-grua-accion-2024-01.avif", "galeria-industria-ltm1350-2021-01.avif", "operacion-puerto-2020.avif"];
  assert.equal(tags.length, names.length);
  tags.forEach((tag, i) => {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    assert.ok(src);
    const original = new URL(`../src/assets/images/${names[i]}`, import.meta.url);
    assert.deepEqual(readFileSync(join(dist, decodeURIComponent(src).replace(/^\//, ""))), readFileSync(original));
    assert.match(tag, i === 0 ? /loading="eager"/ : /loading="lazy"/);
    assert.match(tag, /alt=""/);
    const srcset = tag.match(/\bsrcset="([^"]+)"/)?.[1];
    assert.ok(srcset);
    for (const entry of srcset.split(",")) {
      const path = entry.trim().split(" ")[0].replace(/^\//, "");
      assert.ok(existsSync(join(dist, decodeURIComponent(path))), path);
    }
  });
  assert.match(tags[0], /fetchpriority="high"/);
});

function slideshow(initialReducedMotion = false) {
  const slides = Array.from({ length: 4 }, (_, i) => {
    const classes = new Set(i === 0 ? ["is-active"] : []);
    return { classes, classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) } };
  });
  const container = { dataset: { interval: "7" }, querySelectorAll: () => slides };
  const motion = { matches: initialReducedMotion, addEventListener: (_, listener) => { motion.change = listener; } };
  let callback;
  let delay;
  const window = {
    matchMedia: () => motion,
    clearInterval: () => { callback = undefined; },
    setInterval: (fn, ms) => { callback = fn; delay = ms; return 1; },
  };
  const document = { getElementById: (id) => id === "hero-slideshow" ? container : null };
  const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  runInNewContext(nodeModule.stripTypeScriptTypes(script), { document, window });
  return { slides, motion, tick: () => callback?.(), running: () => Boolean(callback), delay: () => delay };
}

test("el carrusel cambia en bucle", { skip: !nodeModule.stripTypeScriptTypes }, () => {
  const hero = slideshow();
  const active = () => hero.slides.findIndex((slide) => slide.classes.has("is-active"));
  assert.equal(hero.delay(), 7000);
  assert.equal(active(), 0);
  hero.tick();
  assert.equal(active(), 1);
  for (let i = 0; i < 3; i++) hero.tick();
  assert.equal(active(), 0);
});

test("el movimiento reducido detiene el bucle y respeta los cambios de preferencia", { skip: !nodeModule.stripTypeScriptTypes }, () => {
  const hero = slideshow(true);
  assert.equal(hero.running(), false);
  hero.motion.matches = false;
  hero.motion.change();
  assert.equal(hero.running(), true);
  hero.motion.matches = true;
  hero.motion.change();
  assert.equal(hero.running(), false);
  hero.motion.matches = false;
  hero.motion.change();
  assert.equal(hero.running(), true);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition: none/);
});