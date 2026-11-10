import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const dist = new URL("../dist/", import.meta.url);
const home = readFileSync(new URL("index.html", dist), "utf8");
const contact = readFileSync(new URL("contacto/index.html", dist), "utf8");
const services = JSON.parse(readFileSync(new URL("../src/data/servicios.json", import.meta.url), "utf8"));
const contacts = JSON.parse(readFileSync(new URL("../src/data/contacto.json", import.meta.url), "utf8"));

function section(id) {
  const start = home.indexOf(`id="${id}"`);
  assert.notEqual(start, -1, `Missing section: ${id}`);
  return home.slice(start, home.indexOf("</section>", start));
}

test("la portada presenta las secciones en el orden comercial previsto", () => {
  const ids = ["hero", "servicios", "flota", "como-trabajamos", "trabajos", "donde-estamos", "preguntas-frecuentes", "contacto"];
  const positions = ids.map((id) => home.indexOf(`id="${id}"`));
  assert.ok(positions.every((position) => position >= 0));
  assert.ok(positions.every((position, i) => i === 0 || position > positions[i - 1]));
});

test("el hero ofrece consulta, llamada y catálogo, con dos cifras visibles en móvil", () => {
  const hero = section("hero");
  assert.match(hero, /href="#contacto"[^>]*>[\s\S]*?Consultar una maniobra/);
  assert.match(hero, /href="tel:\+34938497022"[^>]*>[\s\S]*?Llamar/);
  assert.match(hero, /download=/);
  assert.match(hero, /grid-cols-2[^\"]*sm:grid-cols-3/);
  assert.equal((hero.match(/hidden sm:flex/g) ?? []).length, 1);
  assert.match(hero, /<dd[^>]*>\s*28\s*<\/dd>/);
  assert.match(hero, /<dd[^>]*>\s*24\/365\s*<\/dd>/);
  assert.match(hero, /<dd[^>]*>\s*86\s*<\/dd>/);
});

test("los rótulos mantienen una presentación sobria y el hero conserva su texto en cada idioma", () => {
  for (const [path, label] of [
    ["index.html", "Elevación y transporte desde 1968"],
    ["ca/index.html", "Elevació i transport des de 1968"],
    ["en/index.html", "Lifting and transport since 1968"],
  ]) {
    const html = readFileSync(new URL(path, dist), "utf8");
    const hero = html.slice(html.indexOf('id="hero"'), html.indexOf("</section>", html.indexOf('id="hero"')));
    const eyebrow = hero.match(/<p class="eyebrow[^>]*>[\s\S]*?<\/p>/)?.[0];
    assert.ok(eyebrow?.includes(label), path);
    assert.match(eyebrow, /text-white\/85/);
    assert.doesNotMatch(eyebrow, /uppercase|tracking-|<span|·/);
    for (const heading of html.matchAll(/<(?:p|h2) class="eyebrow[^>]*>[\s\S]*?<\/(?:p|h2)>/g)) {
      assert.doesNotMatch(heading[0], /h-px w-8 bg-accent|uppercase|tracking-wider/);
    }
  }
  const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
  const style = css.match(/\.eyebrow\s*\{([^}]*)\}/)?.[1];
  assert.ok(style?.includes("text-sm font-medium"));
  assert.doesNotMatch(style, /uppercase|tracking-wider|text-accent/);
});

test("la cinta muestra todos los clientes y oculta la copia visual a lectores de pantalla", () => {
  const start = home.indexOf('aria-labelledby="clientes-title"');
  assert.notEqual(start, -1);
  const clientes = home.slice(start, home.indexOf("</section>", start));
  assert.match(clientes, /class="logos-marquee"/);
  assert.match(clientes, /<ul class="logos-list" aria-hidden="true"/);
  for (const nombre of ["Acciona", "El Corte Inglés", "Elecnor", "Grifols", "Henkel", "Mango", "Mercadona", "Hormipresa", "Covestro", "Prenavisa (Molins)", "Memyoc", "Tecnyconta", "Prefabricats Planas", "Port de Barcelona", "Marina 92", "Corbion", "COMSA", "Veolia"]) {
    assert.equal(clientes.split(`alt="Logo de ${nombre}"`).length - 1, 1, nombre);
  }
  assert.doesNotMatch(clientes, /llerona/i);
  const lists = [...clientes.matchAll(/<ul class="logos-list"[^>]*>([\s\S]*?)<\/ul>/g)];
  assert.equal(lists.length, 2);
  const sources = lists.map(([, list]) => [...list.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]));
  assert.equal(sources[0].length, 18);
  assert.deepEqual(sources[1], sources[0]);
  assert.equal((lists[1][1].match(/\salt(?:="")?(?=\s|>)/g) ?? []).length, 18);
  for (const src of sources[0]) {
    assert.ok(existsSync(join(fileURLToPath(dist), decodeURIComponent(src))), src);
  }
  assert.match(clientes, /data-pause-label="Pausar logos"/);
  assert.match(clientes, /data-play-label="Reanudar logos"/);
});

test("la cinta se puede pausar y respeta la preferencia de movimiento reducido", () => {
  const component = readFileSync(new URL("../src/components/sections/Clientes.astro", import.meta.url), "utf8");
  assert.match(component, /prefers-reduced-motion: no-preference/);
  assert.match(component, /animation: logos-scroll 96s linear infinite/);
  assert.match(component, /translateX\(-50%\)/);
  assert.match(component, /data-paused[^}]*animation-play-state: paused/);
  assert.match(component, /reducedMotion\.addEventListener\("change", updateMotion\)/);
  assert.match(component, /viewport\.tabIndex = reducedMotion\.matches \? 0 : -1/);
  for (const [path, pause, play] of [
    ["ca/index.html", "Aturar logotips", "Reprendre logotips"],
    ["en/index.html", "Pause logos", "Resume logos"],
  ]) {
    const html = readFileSync(new URL(path, dist), "utf8");
    assert.ok(html.includes(`data-pause-label="${pause}"`));
    assert.ok(html.includes(`data-play-label="${play}"`));
  }
});

test("los controles de la cinta pausarán y reanudarán el movimiento", () => {
  const script = [...home.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)]
    .map((match) => match[1]).find((content) => content.includes("data-logos-marquee"));
  assert.ok(script);
  const attrs = new Set();
  const viewport = { scrollLeft: 0, tabIndex: 0 };
  const button = {
    dataset: { pauseLabel: "Pausar", playLabel: "Reanudar" },
    addEventListener(_event, callback) { this.click = callback; },
  };
  const media = {
    matches: false,
    addEventListener(_event, callback) { this.change = callback; },
  };
  const marquee = {
    querySelector(selector) { return selector === "button" ? button : viewport; },
    toggleAttribute(name, force = !attrs.has(name)) {
      if (force) attrs.add(name); else attrs.delete(name);
      return force;
    },
    removeAttribute(name) { attrs.delete(name); },
  };
  runInNewContext(script, {
    document: { querySelectorAll: () => [marquee] },
    window: { matchMedia: () => media },
  });
  assert.ok(attrs.has("data-animated"));
  assert.equal(button.hidden, false);
  button.click();
  assert.ok(attrs.has("data-paused"));
  assert.equal(button.textContent, "Reanudar");
  assert.equal(viewport.tabIndex, 0);
  viewport.scrollLeft = 100;
  button.click();
  assert.ok(!attrs.has("data-paused"));
  assert.equal(viewport.scrollLeft, 0);
  assert.equal(button.textContent, "Pausar");
  media.matches = true;
  media.change();
  assert.ok(!attrs.has("data-animated"));
  assert.equal(button.hidden, true);
  assert.equal(viewport.tabIndex, 0);
});

test("los trabajos destacados enlazan a artículos e imágenes generadas", () => {
  const trabajos = section("trabajos");
  const slugs = ["instalacion-equipos-en-hospital-de-granollers", "colocacion-modulos-en-hospitalet", "desmontaje-mercat-dels-encants"];
  for (const slug of slugs) {
    const card = trabajos.match(new RegExp(`<a href="/blog/${slug}"[\\s\\S]*?</a>`))?.[0];
    assert.ok(card, `Missing work: ${slug}`);
    assert.ok(existsSync(new URL(`blog/${slug}/index.html`, dist)));
    const image = card.match(/<img[^>]+src="([^"]+)"/)?.[1];
    assert.ok(image && existsSync(join(fileURLToPath(dist), decodeURIComponent(image))));
  }
});

test("los servicios destacados mantienen sus enlaces a las páginas de detalle", () => {
  const featured = section("servicios");
  for (const { slug } of services.categorias) {
    assert.ok(featured.includes(`href="/servicios/${slug}"`), slug);
    assert.ok(existsSync(new URL(`servicios/${slug}/index.html`, dist)), slug);
  }
});

test("las tarjetas de contacto mantienen los enlaces directos de cada departamento", () => {
  const cards = section("contacto");
  for (const person of contacts.contactos) {
    assert.ok(cards.includes(`href="tel:+34${person.telefono.replace(/\s/g, "")}"`), person.nombre);
    assert.ok(cards.includes(`href="mailto:${person.email}"`), person.nombre);
  }
});

test("la portada muestra una selección de flota y enlaza al catálogo completo", () => {
  const flota = section("flota");
  assert.equal((flota.match(/class="novedades-card group"/g) ?? []).length, 3);
  assert.ok(flota.includes('href="/flota"'));
  assert.ok(!flota.includes('id="flota-filters"'));
});

test("las preguntas de la portada también aparecen en contacto", () => {
  const faq = section("preguntas-frecuentes");
  for (const question of ["¿Qué información necesitan para estudiar una maniobra?", "¿Cómo sé qué grúa necesito?"]) {
    assert.ok(faq.includes(question));
    assert.ok(contact.includes(question));
  }
  assert.equal((faq.match(/<details/g) ?? []).length, 4);
});