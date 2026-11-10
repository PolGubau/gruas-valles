import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import * as nodeModule from "node:module";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const source = readFileSync(new URL("../src/components/sections/Hero.astro", import.meta.url), "utf8");

test("el hero incluye el vídeo y las cuatro fotos con variantes responsivas", () => {
  const html = readFileSync(join(dist, "index.html"), "utf8");
  assert.ok(!html.includes('id="hero-motion-toggle"'));
  const video = html.match(/<video\b[^>]*class="hero-slide[^>]*>/)?.[0];
  assert.ok(video);
  assert.match(video, /src="\/media\/dron\/video\.mp4"/);
  assert.match(video, /poster="\/media\/dron\/1\.avif"/);
  assert.match(video, /\bmuted\b/);
  assert.match(video, /\bplaysinline\b/);
  assert.ok(existsSync(join(dist, "media/dron/video.mp4")));
  assert.ok(existsSync(join(dist, "media/dron/1.avif")));
  const tags = [...html.matchAll(/<img\b[^>]*class="hero-slide[^>]*>/g)].map(([tag]) => tag);
  assert.ok(html.indexOf(video) < html.indexOf(tags[0]));
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

function slideshow(initialReducedMotion = false, rejectVideo = false) {
  const slides = Array.from({ length: 5 }, (_, i) => {
    const classes = new Set(i === 1 ? ["is-active"] : []);
    return { classes, classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) } };
  });
  const events = {};
  const video = {
    ended: false,
    plays: 0,
    pauses: 0,
    play() { this.plays++; return rejectVideo ? Promise.reject(new Error("blocked")) : Promise.resolve(); },
    pause() { this.pauses++; },
    addEventListener(name, handler) { events[name] = handler; },
  };
  const container = { dataset: { interval: "7" }, querySelectorAll: () => slides, querySelector: () => video };
  const motion = { matches: initialReducedMotion, addEventListener: (_, listener) => { motion.change = listener; } };
  let callback;
  let delay;
  const window = {
    matchMedia: () => motion,
    clearTimeout: () => { callback = undefined; },
    setTimeout: (fn, ms) => { callback = fn; delay = ms; return 1; },
  };
  const document = { getElementById: (id) => id === "hero-slideshow" ? container : null };
  const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  runInNewContext(nodeModule.stripTypeScriptTypes(script), { document, window });
  return {
    slides, motion, video, events,
    tick: () => { const fn = callback; callback = undefined; fn?.(); },
    running: () => Boolean(callback), delay: () => delay,
  };
}

test("el vídeo se reproduce primero y completo, seguido de las fotos en bucle", { skip: !nodeModule.stripTypeScriptTypes }, async () => {
  const hero = slideshow();
  const active = () => hero.slides.findIndex((slide) => slide.classes.has("is-active"));
  await Promise.resolve();
  assert.equal(active(), 0);
  assert.equal(hero.running(), false);
  hero.events.ended();
  assert.equal(active(), 1);
  assert.equal(hero.delay(), 7000);
  hero.tick();
  assert.equal(active(), 2);
  for (let i = 0; i < 3; i++) hero.tick();
  await Promise.resolve();
  assert.equal(active(), 0);
  assert.equal(hero.video.plays, 2);
});

test("si el vídeo no puede reproducirse, continúa con las fotos", { skip: !nodeModule.stripTypeScriptTypes }, async () => {
  const hero = slideshow(false, true);
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(hero.slides.findIndex((slide) => slide.classes.has("is-active")), 1);
  assert.equal(hero.running(), true);
  hero.tick();
  assert.equal(hero.slides.findIndex((slide) => slide.classes.has("is-active")), 2);
});

test("el movimiento reducido detiene el vídeo y respeta los cambios de preferencia", { skip: !nodeModule.stripTypeScriptTypes }, async () => {
  const hero = slideshow(true);
  assert.equal(hero.running(), false);
  assert.equal(hero.video.plays, 0);
  hero.motion.matches = false;
  hero.motion.change();
  await Promise.resolve();
  assert.equal(hero.slides.findIndex((slide) => slide.classes.has("is-active")), 0);
  hero.motion.matches = true;
  hero.motion.change();
  assert.equal(hero.running(), false);
  assert.ok(hero.video.pauses > 0);
  assert.equal(hero.slides.findIndex((slide) => slide.classes.has("is-active")), 1);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition: none/);
});