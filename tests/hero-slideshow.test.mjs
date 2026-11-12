import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import * as nodeModule from "node:module";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const dist = fileURLToPath(new URL(process.env.GV_TEST_DIST ?? "../dist/", import.meta.url));
const source = readFileSync(new URL("../src/components/sections/Hero.astro", import.meta.url), "utf8");

test("el degradado queda sobre las imágenes pero detrás del contenido del hero", () => {
  assert.match(source, /id="hero-slideshow"\s+class="[^"]*\bz-0\b/);
  assert.match(source, /class="hero-overlay[^\"]*\bz-30\b/);
  assert.match(source, /class="hero-content[^\"]*\bz-10\b/);
  assert.match(source, /\.hero-slide\.is-active\s*\{[^}]*z-index: 2/);
  assert.match(source, /\.hero-content :is\(h1, p, dt, dd, a\[download\]\)\s*\{\s*text-shadow:/);
});

test("el hero incluye los cuatro vídeos y las tres fotos con variantes responsivas", () => {
  const html = readFileSync(join(dist, "index.html"), "utf8");
  assert.ok(!html.includes('id="hero-motion-toggle"'));
  const videos = [...html.matchAll(/<video\b[^>]*class="hero-slide[^>]*>/g)].map(([tag]) => tag);
  assert.equal(videos.length, 4);
  assert.match(videos[0], /src="\/media\/dron\/video\.mp4"/);
  assert.match(videos[0], /poster="\/media\/dron\/1\.avif"/);
  const videoNames = ["DJI_0241_00000000.mp4", "DJI_0242_00000265.mp4", "Timeline 1.mp4"];
  videos.forEach((video, index) => {
    assert.match(video, /\bmuted\b/);
    assert.match(video, /\bplaysinline\b/);
    assert.match(video, /preload="none"/);
    if (index === 0) return;
    const src = video.match(/\bsrc="([^"]+)"/)?.[1];
    assert.ok(src);
    assert.match(src, /\.mp4$/);
    const built = join(dist, decodeURIComponent(src).replace(/^\//, ""));
    const original = new URL(`../src/assets/videos/${videoNames[index - 1]}`, import.meta.url);
    assert.equal(statSync(built).size, statSync(original).size);
    assert.ok(statSync(built).size < 50 * 1024 * 1024, `${videoNames[index - 1]} exceeds 50 MiB`);
  });
  assert.ok(existsSync(join(dist, "media/dron/video.mp4")));
  assert.ok(existsSync(join(dist, "media/dron/1.avif")));
  const tags = [...html.matchAll(/<img\b[^>]*class="hero-slide[^>]*>/g)].map(([tag]) => tag);
  assert.ok(html.indexOf(videos.at(-1)) < html.indexOf(tags[0]));
  const names = ["hero-grua-accion-2024-01.avif", "galeria-industria-ltm1350-2021-01.avif", "operacion-puerto-2020.avif"];
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

function slideshow(initialReducedMotion = false, rejectedVideos = [], pendingVideos = []) {
  const slides = Array.from({ length: 7 }, (_, i) => {
    const classes = new Set(i === 4 ? ["is-active"] : []);
    return { classes, classList: { add: (...names) => names.forEach((name) => classes.add(name)), remove: (...names) => names.forEach((name) => classes.delete(name)) } };
  });
  const videos = Array.from({ length: 4 }, (_, index) => ({
    ended: false,
    readyState: 0,
    preload: "none",
    loads: 0,
    plays: 0,
    pauses: 0,
    events: {},
    load() { this.loads++; },
    play() {
      this.plays++;
      if (rejectedVideos.includes(index)) return Promise.reject(new Error("blocked"));
      if (pendingVideos.includes(index)) return new Promise((resolve) => { this.resolvePlay = resolve; });
      return Promise.resolve();
    },
    pause() { this.pauses++; },
    addEventListener(name, handler) { this.events[name] = handler; },
  }));
  const container = { dataset: { interval: "7" }, querySelectorAll: (selector) => selector === ".hero-slide" ? slides : videos };
  const motion = { matches: initialReducedMotion, addEventListener: (_, listener) => { motion.change = listener; } };
  const timers = new Map();
  let timerId = 0;
  const window = {
    matchMedia: () => motion,
    clearTimeout: (id) => timers.delete(id),
    setTimeout: (fn, ms) => { const id = ++timerId; timers.set(id, { fn, ms }); return id; },
  };
  const document = { getElementById: (id) => id === "hero-slideshow" ? container : null };
  const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  runInNewContext(nodeModule.stripTypeScriptTypes(script), { document, window });
  return {
    slides, motion, videos,
    active: () => slides.findIndex((slide) => slide.classes.has("is-active") && !slide.classes.has("is-leaving")),
    tick: (ms = 7000) => { const timer = [...timers].find(([, value]) => value.ms === ms); if (timer) { timers.delete(timer[0]); timer[1].fn(); } },
    running: () => [...timers.values()].some((timer) => timer.ms === 7000),
    delay: () => [...timers.values()].find((timer) => timer.ms === 7000)?.ms,
  };
}

test("los vídeos se reproducen completos en orden, seguidos de las fotos en bucle", { skip: !nodeModule.stripTypeScriptTypes }, async () => {
  const hero = slideshow();
  const active = hero.active;
  await Promise.resolve();
  assert.equal(active(), 0);
  assert.equal(hero.running(), false);
  for (let i = 0; i < hero.videos.length; i++) {
    assert.equal(active(), i);
    assert.equal(hero.running(), false);
    hero.videos[i].events.ended();
    await Promise.resolve();
  }
  assert.equal(active(), 4);
  assert.equal(hero.delay(), 7000);
  hero.tick();
  assert.equal(active(), 5);
  hero.tick();
  assert.equal(active(), 6);
  hero.tick();
  await Promise.resolve();
  assert.equal(active(), 0);
  assert.equal(hero.videos[0].plays, 2);
});

test("precarga el siguiente vídeo y conserva el fotograma anterior hasta completar la transición", { skip: !nodeModule.stripTypeScriptTypes }, async () => {
  const hero = slideshow(false, [], [1]);
  assert.equal(hero.videos[1].preload, "auto");
  assert.equal(hero.videos[1].loads, 1);
  assert.equal(hero.videos[2].loads, 0);
  await Promise.resolve();
  hero.tick(1500);
  hero.videos[0].events.ended();
  assert.equal(hero.active(), 0);
  assert.equal(hero.videos[0].pauses, 0);
  assert.equal(hero.videos[2].loads, 1);
  hero.videos[1].resolvePlay();
  await Promise.resolve();
  assert.equal(hero.active(), 1);
  assert.ok(hero.slides[0].classes.has("is-active"));
  assert.ok(hero.slides[0].classes.has("is-leaving"));
  assert.equal(hero.videos[0].pauses, 0);
  hero.tick(1500);
  assert.ok(!hero.slides[0].classes.has("is-active"));
  assert.equal(hero.videos[0].pauses, 1);
  assert.match(source, /\.hero-slide\.is-leaving\s*\{\s*z-index: 1/);
  assert.match(source, /hero-overlay[^\n]*z-30/);
});

test("si un vídeo no puede reproducirse, continúa con el siguiente", { skip: !nodeModule.stripTypeScriptTypes }, async () => {
  const hero = slideshow(false, [0, 2]);
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(hero.active(), 1);
  hero.videos[1].events.ended();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(hero.active(), 3);
  hero.videos[3].events.error();
  assert.equal(hero.active(), 4);
  assert.equal(hero.running(), true);
});

test("si fallan todos los vídeos, continúa con las fotos", { skip: !nodeModule.stripTypeScriptTypes }, async () => {
  const hero = slideshow(false, [0, 1, 2, 3]);
  await new Promise((resolve) => setImmediate(resolve));
  assert.ok(hero.videos.every((video) => video.plays === 1));
  assert.equal(hero.active(), 4);
  assert.equal(hero.running(), true);
});

test("el movimiento reducido detiene el vídeo y respeta los cambios de preferencia", { skip: !nodeModule.stripTypeScriptTypes }, async () => {
  const hero = slideshow(true);
  assert.equal(hero.running(), false);
  assert.ok(hero.videos.every((video) => video.plays === 0));
  assert.ok(hero.videos.every((video) => video.loads === 0));
  hero.motion.matches = false;
  hero.motion.change();
  await Promise.resolve();
  assert.equal(hero.active(), 0);
  hero.motion.matches = true;
  hero.motion.change();
  assert.equal(hero.running(), false);
  assert.ok(hero.videos.every((video) => video.pauses > 0));
  assert.equal(hero.active(), 4);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition: none/);
});

test("el movimiento reducido cancela una reproducción pendiente", { skip: !nodeModule.stripTypeScriptTypes }, async () => {
  const hero = slideshow();
  hero.motion.matches = true;
  hero.motion.change();
  await Promise.resolve();
  assert.equal(hero.active(), 4);
  assert.equal(hero.running(), false);
  assert.ok(hero.videos[0].pauses > 0);
});
