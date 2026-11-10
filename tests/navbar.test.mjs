import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as nodeModule from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";

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