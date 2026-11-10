import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as nodeModule from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";

test("el 404 ofrece los tres idiomas y enlaces útiles sin JavaScript", () => {
  const html = readFileSync(new URL("../dist/404.html", import.meta.url), "utf8");
  assert.match(html, /name="robots" content="noindex, follow"/);
  for (const [lang, heading, home, services] of [
    ["es", "Esta página no existe", "/?lang=es", "/servicios?lang=es"],
    ["ca", "Aquesta pàgina no existeix", "/ca/", "/ca/servicios"],
    ["en", "This page doesn&#39;t exist", "/en/", "/en/servicios"],
  ]) {
    const section = html.match(new RegExp(`<section lang="${lang}"[^>]*>[\\s\\S]*?</section>`))?.[0];
    assert.ok(section && section.includes(heading), lang);
    assert.doesNotMatch(section, /\shidden(?:\s|>|=)/);
    assert.ok(section.includes(`href="${home}"`));
    assert.ok(section.includes(`href="${services}"`));
  }
});

test("el 404 detecta el idioma y permite cambiarlo sin redirigir", { skip: !nodeModule.stripTypeScriptTypes }, () => {
  const source = nodeModule.stripTypeScriptTypes(readFileSync(new URL("../src/scripts/not-found.ts", import.meta.url), "utf8"));
  function run({ pathname = "/missing", search = "", saved, languages = ["es"], blocked = false } = {}) {
    const sections = ["es", "ca", "en"].map((lang) => ({ dataset: { "404Lang": lang, "404Title": `title ${lang}` }, hidden: false }));
    const choices = ["es", "ca", "en"].map((lang) => ({
      dataset: { "404Choice": lang },
      setAttribute(name, value) { this[name] = value; },
      addEventListener(name, handler) { this.click = handler; },
    }));
    const selector = { hidden: true };
    const document = { documentElement: {}, title: "", querySelectorAll: (query) => query === "[data-404-lang]" ? sections : choices, querySelector: () => selector };
    const storage = { getItem: () => { if (blocked) throw Error(); return saved; }, setItem: (_, value) => { if (blocked) throw Error(); saved = value; } };
    runInNewContext(source, { document, localStorage: storage, window: { location: { pathname, search } }, navigator: { languages, language: languages[0] }, URLSearchParams });
    return { document, sections, choices, selector, get saved() { return saved; } };
  }
  const prefixed = run({ pathname: "/ca/no-existe", saved: "en", languages: ["es"] });
  assert.equal(prefixed.document.documentElement.lang, "ca");
  assert.equal(prefixed.document.title, "title ca");
  assert.deepEqual(prefixed.sections.map((section) => section.hidden), [true, false, true]);
  assert.equal(prefixed.selector.hidden, false);
  prefixed.choices[2].click();
  assert.equal(prefixed.saved, "en");
  assert.equal(prefixed.document.documentElement.lang, "en");
  assert.equal(prefixed.choices[2]["aria-pressed"], "true");
  assert.equal(run({ search: "?lang=es", saved: "ca" }).document.documentElement.lang, "es");
  assert.equal(run({ languages: ["en-GB"], blocked: true }).document.documentElement.lang, "en");
  assert.equal(run({ languages: ["fr"] }).document.documentElement.lang, "es");
});

test("la política identifica todas las páginas con mapas incrustados", () => {
  const expected = {
    es: "Inicio, Contacto y Nosotros.",
    ca: "les pàgines d'Inici, Contacte i Nosaltres.",
    en: "Home, Contact and About us pages.",
  };
  for (const [lang, text] of Object.entries(expected)) {
    const prefix = lang === "es" ? "" : `${lang}/`;
    const read = (path) => readFileSync(new URL(`../dist/${prefix}${path}index.html`, import.meta.url), "utf8");
    for (const path of ["", "contacto/", "nosotros/"]) assert.match(read(path), /google\.com\/maps\/embed/);
    assert.ok(read("legal/politica-cookies/").replace(/\s+/g, " ").includes(text), lang);
  }
});