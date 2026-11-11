import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as nodeModule from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";

const dist = process.env.GV_TEST_DIST ? new URL(process.env.GV_TEST_DIST) : new URL("../dist/", import.meta.url);

class Element {
  constructor(initial = []) {
    this.classes = new Set(initial);
    this.attributes = new Map();
    this.handlers = new Map();
    this.classList = {
      add: (...names) => names.forEach((name) => this.classes.add(name)),
      remove: (...names) => names.forEach((name) => this.classes.delete(name)),
      contains: (name) => this.classes.has(name),
      toggle: (name, force = !this.classes.has(name)) => force ? this.classes.add(name) : this.classes.delete(name),
    };
    this.style = {};
    this.inert = false;
    this.focused = false;
  }
  setAttribute(name, value) { this.attributes.set(name, value); }
  getAttribute(name) { return this.attributes.get(name); }
  addEventListener(name, handler) {
    this.handlers.set(name, [...(this.handlers.get(name) ?? []), handler]);
  }
  emit(name, event = {}) { this.handlers.get(name)?.forEach((handler) => handler(event)); }
  focus() { this.focused = true; }
  querySelectorAll() { return []; }
}

test("la cabecera flotante agrupa navegación, teléfono e idiomas sin cubrir el hero", () => {
  for (const prefix of ["", "ca/", "en/"]) {
    const html = readFileSync(new URL(`${prefix}index.html`, dist), "utf8");
    const header = html.match(/<header id="navbar"[\s\S]*?<\/header>/)?.[0];
    assert.ok(header, prefix || "es");
    const opening = header.match(/^<header[^>]*>/)?.[0];
    assert.match(opening, /pointer-events-none/);
    assert.doesNotMatch(opening, /bg-white|border-b/);
    assert.match(header, /<a[^>]*class="[^"]*rounded-full bg-white[^"]*"[^>]*>[\s\S]*?<img[^>]*src="\/logo\.png"/);
    const pill = header.match(/<div class="pointer-events-auto hidden[^"]*rounded-full bg-white[^"]*"[\s\S]*?id="lang-toggle"/)?.[0];
    assert.ok(pill, "navegación y acciones comparten la píldora");
    assert.match(pill.match(/^<div[^>]*>/)?.[0] ?? "", /\bml-auto\b/, "la píldora queda alineada a la derecha y separada del logo");
    assert.match(pill, /<nav/);
    assert.match(pill, /href="tel:\+34938497022"/);
    assert.match(header, /id="menu-toggle"[^>]*rounded-full bg-white/);
    assert.match(html, /<main id="main">\s*<section id="hero"/);
  }
});

test("trabaja con nosotros es el último enlace de navegación en los tres idiomas", () => {
  for (const [prefix, label] of [["", "Trabaja con nosotros"], ["ca/", "Treballa amb nosaltres"], ["en/", "Careers"]]) {
    const html = readFileSync(new URL(`${prefix}index.html`, dist), "utf8");
    const header = html.match(/<header id="navbar"[\s\S]*?<\/header>/)?.[0];
    assert.ok(header, prefix || "es");
    const navs = [...header.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/g)];
    assert.equal(navs.length, 2);
    for (const [, nav] of navs) {
      const links = [...nav.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*class="[^"]*(?:nav-link|mobile-link)[^"]*"[^>]*>\s*([^<]+?)\s*<\/a>/g)];
      assert.deepEqual(links.at(-1)?.slice(1), [`/${prefix}trabaja-con-nosotros`, label]);
    }
  }
});

test("el fondo de las páginas interiores ocupa también el espacio de la cabecera", () => {
  const layout = readFileSync(new URL("../src/layouts/Page.astro", import.meta.url), "utf8");
  assert.match(layout, /\.inner-page > :first-child::before\s*\{[^}]*display:\s*block;[^}]*height:\s*4rem;/);
  for (const prefix of ["", "ca/", "en/"]) {
    for (const page of ["blog/", "servicios/", "legal/privacidad/"]) {
      const html = readFileSync(new URL(`${prefix}${page}index.html`, dist), "utf8");
      assert.match(html, /<main id="main" class="inner-page">\s*<section class="[^"]*bg-surface-alt/);
    }
  }
});

test("los menús se cierran con Escape y devuelven el foco al botón", { skip: !nodeModule.stripTypeScriptTypes }, () => {
  const navbarSource = readFileSync(new URL("../src/components/ui/Navbar.astro", import.meta.url), "utf8");
  const script = navbarSource.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  const toggle = new Element();
  const menu = new Element();
  const navbar = new Element();
  const langToggle = new Element();
  const langMenu = new Element(["hidden"]);
  const chevron = new Element();
  const langContainer = new Element();
  langContainer.contains = (target) => target === langToggle || target === langMenu;
  langMenu.parentElement = langContainer;
  langToggle.querySelector = () => chevron;
  const nodes = { "menu-toggle": toggle, "mobile-menu": menu, navbar, "lang-toggle": langToggle, "lang-menu": langMenu };
  const document = new Element();
  document.documentElement = new Element();
  document.getElementById = (id) => nodes[id];
  const window = new Element();
  window.matchMedia = () => new Element();
  window.scrollY = 0;
  runInNewContext(nodeModule.stripTypeScriptTypes(script), { document, window });

  assert.equal(menu.inert, true);
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.ok(document.documentElement.classList.contains("nav-ready"));
  toggle.emit("click");
  assert.equal(menu.inert, false);
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  document.emit("keydown", { key: "Escape" });
  assert.equal(menu.inert, true);
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.ok(toggle.focused);

  langToggle.emit("click", { stopPropagation() {} });
  assert.equal(langToggle.getAttribute("aria-expanded"), "true");
  assert.equal(langMenu.classList.contains("hidden"), false);
  document.emit("keydown", { key: "Escape" });
  assert.equal(langToggle.getAttribute("aria-expanded"), "false");
  assert.ok(langMenu.classList.contains("hidden"));
  assert.ok(langToggle.focused);
});