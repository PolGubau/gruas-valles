import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dist = new URL("../dist/", import.meta.url);
const source = new URL("../src/", import.meta.url);
const read = (base, path) => readFileSync(new URL(path, base), "utf8");
const locales = ["", "ca/", "en/"];

test("el menú móvil de cada idioma permite desplazarse en pantallas bajas", () => {
  for (const prefix of locales) {
    const html = read(dist, `${prefix}index.html`);
    const menu = html.match(/<div id="mobile-menu"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(menu, prefix || "es");
    assert.match(menu, /overflow-y-auto/);
    assert.match(menu, /max-h-\[calc\(100dvh-5rem\)\]/);
    assert.match(menu, /max-sm:max-h-\[calc\(100dvh-9rem-env\(safe-area-inset-bottom,0px\)\)\]/);
    assert.equal((menu.match(/data-language="(?:es|ca|en)"/g) ?? []).length, 3);
  }
});

test("las tarjetas de servicios mantienen el texto completo en los tres idiomas", () => {
  const endings = ["proyectos industriales y de construcción.", "projectes industrials i de construcció.", "industrial and construction projects."];
  for (const [i, prefix] of locales.entries()) {
    const html = read(dist, `${prefix}index.html`);
    const card = html.match(new RegExp(`<a href="/${prefix}servicios/gruas-moviles-autopropulsadas"[\\s\\S]*?</a>`))?.[0];
    assert.ok(card?.includes(endings[i]), prefix || "es");
    assert.doesNotMatch(card, /line-clamp/);
  }
});

test("la selección de flota reserva más ancho para categorías largas", () => {
  const component = read(source, "components/sections/Flota.astro");
  assert.match(component, /@media \(min-width: 640px\)\s*\{\s*\.novedades-track\s*\{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(component, /@media \(min-width: 1024px\)\s*\{\s*\.novedades-track\s*\{\s*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(component, /\.novedades-card-body\s*\{[^}]*overflow-wrap: anywhere/);
  for (const [i, prefix] of locales.entries()) {
    const html = read(dist, `${prefix}index.html`);
    const label = ["Grúas móviles autopropulsadas", "Grues mòbils autopropulsades", "Self-propelled mobile cranes"][i];
    assert.ok(html.includes(label), prefix || "es");
  }
});

test("acciones, filtros y correo admiten textos largos sin anchuras mínimas rígidas", () => {
  const css = read(source, "styles/global.css");
  assert.match(css, /\.btn\s*\{[^}]*max-w-full[^}]*overflow-wrap: anywhere/);
  assert.match(css, /\.btn > svg\s*\{\s*flex-shrink: 0/);
  assert.match(css, /h4\s*\{[^}]*overflow-wrap: anywhere/);
  for (const prefix of locales) {
    const home = read(dist, `${prefix}index.html`);
    const fleet = read(dist, `${prefix}flota/index.html`);
    const services = read(dist, `${prefix}servicios/index.html`);
    assert.match(home, /min-w-0 wrap-anywhere[^>]*>gruasdelvalles@gruasdelvalles\.com/);
    assert.match(fleet, /class="flex min-w-0 max-w-full flex-wrap gap-2" id="flota-filters"/);
    assert.match(fleet, /filter-btn max-w-full wrap-anywhere/);
    assert.match(services, /flex min-w-0 flex-col flex-wrap gap-3 sm:flex-row/);
  }
});