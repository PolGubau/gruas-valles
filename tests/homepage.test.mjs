import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const dist = process.env.GV_TEST_DIST ? new URL(process.env.GV_TEST_DIST) : new URL("../dist/", import.meta.url);
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
  const ids = ["hero", "servicios", "flota", "como-trabajamos", "trabajos", "trabaja-con-nosotros", "donde-estamos", "preguntas-frecuentes", "contacto"];
  const positions = ids.map((id) => home.indexOf(`id="${id}"`));
  assert.ok(positions.every((position) => position >= 0));
  assert.ok(positions.every((position, i) => i === 0 || position > positions[i - 1]));
});

test("la sección de empleo resume la página y enlaza a ella en cada idioma", () => {
  for (const [prefix, heading, summary, label] of [
    ["", "Forma parte de nuestro equipo", "Buscamos operadores, mecánicos y técnicos", "Trabaja con nosotros"],
    ["ca/", "Forma part del nostre equip", "Busquem operadors, mecànics i tècnics", "Treballa amb nosaltres"],
    ["en/", "Join our team", "We are looking for operators, mechanics and technicians", "Careers"],
  ]) {
    const html = readFileSync(new URL(`${prefix}index.html`, dist), "utf8");
    const start = html.indexOf('id="trabaja-con-nosotros"');
    assert.notEqual(start, -1, prefix || "es");
    const section = html.slice(start, html.indexOf("</section>", start));
    assert.ok(section.includes(heading));
    assert.ok(section.includes(summary));
    assert.match(section, new RegExp(`href="/${prefix}trabaja-con-nosotros"[^>]*>\\s*${label}`));
    assert.ok(existsSync(new URL(`${prefix}trabaja-con-nosotros/index.html`, dist)));
  }
});

test("el hero ofrece consulta, llamada y catálogo, con dos cifras visibles en móvil", () => {
  const hero = section("hero");
  assert.match(hero, /href="#contacto"[^>]*>[\s\S]*?Consultar una maniobra/);
  assert.match(hero, /href="tel:\+34938497022"[^>]*>[\s\S]*?Llamar/);
  assert.match(hero, /download=/);
  assert.match(hero, /grid-cols-2[^\"]*sm:grid-cols-3/);
  assert.equal((hero.match(/hidden sm:flex/g) ?? []).length, 1);
  assert.match(hero, /<dd[^>]*>\s*\+30\s*<\/dd>/);
  assert.match(hero, /<dd[^>]*>\s*24\/365\s*<\/dd>/);
  assert.match(hero, /<dd[^>]*>\s*\+90\s*<\/dd>/);
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
  assert.doesNotMatch(clientes, /<button\b/);
});

test("la cinta respeta la preferencia de movimiento reducido y no muestra controles", () => {
  const component = readFileSync(new URL("../src/components/sections/Clientes.astro", import.meta.url), "utf8");
  assert.match(component, /prefers-reduced-motion: no-preference/);
  assert.match(component, /animation: logos-scroll 96s linear infinite/);
  assert.match(component, /translateX\(-50%\)/);
  assert.match(component, /reducedMotion\.addEventListener\("change", updateMotion\)/);
  assert.match(component, /viewport\.tabIndex = reducedMotion\.matches \? 0 : -1/);
  for (const path of ["ca/index.html", "en/index.html"]) {
    const html = readFileSync(new URL(path, dist), "utf8");
    const start = html.indexOf('aria-labelledby="clientes-title"');
    assert.notEqual(start, -1, path);
    assert.doesNotMatch(html.slice(start, html.indexOf("</section>", start)), /<button\b/);
  }
});

test("la cinta reacciona a los cambios de movimiento reducido", () => {
  const script = [...home.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)]
    .map((match) => match[1]).find((content) => content.includes("data-logos-marquee"));
  assert.ok(script);
  const attrs = new Set();
  const viewport = { scrollLeft: 0, tabIndex: 0 };
  const media = {
    matches: false,
    addEventListener(_event, callback) { this.change = callback; },
  };
  const marquee = {
    querySelector(selector) { return selector === ".logos-viewport" ? viewport : null; },
    toggleAttribute(name, force = !attrs.has(name)) {
      if (force) attrs.add(name); else attrs.delete(name);
      return force;
    },
  };
  runInNewContext(script, {
    document: { querySelectorAll: () => [marquee] },
    window: { matchMedia: () => media },
  });
  assert.ok(attrs.has("data-animated"));
  assert.equal(viewport.tabIndex, -1);
  viewport.scrollLeft = 100;
  media.matches = true;
  media.change();
  assert.ok(!attrs.has("data-animated"));
  assert.equal(viewport.scrollLeft, 0);
  assert.equal(viewport.tabIndex, 0);
  media.matches = false;
  media.change();
  assert.ok(attrs.has("data-animated"));
  assert.equal(viewport.tabIndex, -1);
});

test("la portada destaca las tres primeras noticias del blog en cada idioma", () => {
  const cards = (html) => [...html.matchAll(/<a href="([^"]+)" class="group flex flex-col overflow-hidden rounded-sm bg-white[^>]*>[\s\S]*?<\/a>/g)];
  for (const prefix of ["", "ca/", "en/"]) {
    const html = readFileSync(new URL(`${prefix}index.html`, dist), "utf8");
    const start = html.indexOf('id="trabajos"');
    assert.notEqual(start, -1);
    const featured = cards(html.slice(start, html.indexOf("</section>", start)));
    const blog = cards(readFileSync(new URL(`${prefix}blog/index.html`, dist), "utf8"));
    assert.equal(featured.length, 3);
    assert.deepEqual(featured.map((card) => card[1]), blog.slice(0, 3).map((card) => card[1]));
    for (const [card, href] of featured) {
      assert.ok(existsSync(new URL(`${href.slice(1)}/index.html`, dist)), href);
      const image = card.match(/<img[^>]+src="([^"]+)"/)?.[1];
      if (image) assert.ok(existsSync(join(fileURLToPath(dist), decodeURIComponent(image))));
    }
  }
});

test("los servicios destacados mantienen sus enlaces a las páginas de detalle", () => {
  const featured = section("servicios");
  for (const { slug } of services.categorias) {
    assert.ok(featured.includes(`href="/servicios/${slug}"`), slug);
    assert.ok(existsSync(new URL(`servicios/${slug}/index.html`, dist)), slug);
  }
});

test("las tarjetas de servicios y el proceso muestran fotografías en todos los idiomas", () => {
  for (const prefix of ["", "ca/", "en/"]) {
    for (const page of ["index.html", "servicios/index.html"]) {
      const html = readFileSync(new URL(`${prefix}${page}`, dist), "utf8");
      for (const { slug } of services.categorias) {
        const card = html.match(new RegExp(`<a href="/${prefix}servicios/${slug}"[^>]*>[\\s\\S]*?</a>`))?.[0];
        const image = card?.match(/<img\b[^>]*>/)?.[0];
        assert.ok(image, `${prefix}${page}: ${slug}`);
        assert.ok(card.indexOf(image) < card.indexOf("<h3"));
        assert.match(image, /loading="lazy"/);
        const src = image.match(/\bsrc="([^"]+)"/)?.[1];
        assert.ok(src && existsSync(join(fileURLToPath(dist), decodeURIComponent(src))), src);
      }
    }
    const homepage = readFileSync(new URL(`${prefix}index.html`, dist), "utf8");
    const process = homepage.match(/<section id="como-trabajamos"[\s\S]*?<\/section>/)?.[0];
    assert.match(process ?? "", /<img\b[^>]*loading="lazy"/);
  }
});

test("la portada muestra los títulos de servicios sin descripciones y la página dedicada las conserva", () => {
  for (const prefix of ["", "ca/", "en/"]) {
    const homepage = readFileSync(new URL(`${prefix}index.html`, dist), "utf8");
    const servicePage = readFileSync(new URL(`${prefix}servicios/index.html`, dist), "utf8");
    const findCard = (html, slug) => html.match(new RegExp(`<a href="/${prefix}servicios/${slug}"[^>]*>[\\s\\S]*?</a>`))?.[0];
    for (const { slug } of services.categorias) {
      const preview = findCard(homepage, slug);
      const full = findCard(servicePage, slug);
      assert.ok(preview && full, `${prefix}${slug}`);
      assert.match(preview, /<h3\b[^>]*>\s*[^<]+\s*<\/h3>/);
      assert.doesNotMatch(preview, /<p class="text-sm leading-relaxed/);
      assert.match(full, /<p class="text-sm leading-relaxed/);
    }
  }
});

test("la sección de contacto ofrece el teléfono general", () => {
  assert.ok(section("contacto").includes(`href="tel:${contacts.telefono.replace(/\s/g, "")}"`));
});

test("la portada muestra una selección de flota y enlaza al catálogo completo", () => {
  const flota = section("flota");
  assert.equal((flota.match(/class="novedades-card group"/g) ?? []).length, 3);
  assert.ok(flota.includes('href="/flota"'));
  assert.ok(!flota.includes('id="flota-filters"'));
});

test("los CTA de flota indican que llevan al contacto en cada idioma", () => {
  for (const [prefix, label] of [["", "Contactar con el equipo"], ["ca/", "Contactar amb l&#39;equip"], ["en/", "Contact our team"]]) {
    for (const [page, href] of [["index.html", "#contacto"], ["flota/index.html", `/${prefix}#contacto`], ["flota/camion-grua-200-tm-doble-jib/index.html", `/${prefix}#contacto`]]) {
      const html = readFileSync(new URL(`${prefix}${page}`, dist), "utf8");
      assert.match(html, new RegExp(`<a href="${href}"[^>]*>\\s*${label}`), `${prefix}${page}`);
    }
  }
});

test("las preguntas de la portada también aparecen en contacto", () => {
  const faq = section("preguntas-frecuentes");
  for (const question of ["¿Qué información necesitan para estudiar una maniobra?", "¿Cómo sé qué grúa necesito?"]) {
    assert.ok(faq.includes(question));
    assert.ok(contact.includes(question));
  }
  assert.equal((faq.match(/<details/g) ?? []).length, 4);
});