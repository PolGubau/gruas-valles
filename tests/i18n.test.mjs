import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import * as nodeModule from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { hasTranslations } from "../src/i18n/routes.mjs";

const dist = new URL("../dist/", import.meta.url);
const pages = Object.fromEntries(["es", "ca", "en"].map((lang) => [lang, readFileSync(new URL(lang === "es" ? "index.html" : `${lang}/index.html`, dist), "utf8")]));

test("cada portada está traducida y declara sus versiones alternativas", () => {
  const expected = {
    es: ["Grúas para", "Todo lo que necesitas", "Hable con nuestro equipo"],
    ca: ["Grues per a", "Tot el que necessiteu", "Parleu amb el nostre equip"],
    en: ["Cranes for", "Everything you need", "Speak to our team"],
  };
  for (const [lang, html] of Object.entries(pages)) {
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.doesNotMatch(html, /http-equiv="refresh"/);
    for (const text of expected[lang]) assert.ok(html.includes(text), `${lang}: ${text}`);
    for (const [code, path] of [["es", "/"], ["ca", "/ca/"], ["en", "/en/"]]) {
      assert.ok(html.includes(`hreflang="${code}" href="https://www.gruasdelvalles.com${path}"`));
    }
    assert.ok(html.includes(`rel="canonical" href="https://www.gruasdelvalles.com${lang === "es" ? "/" : `/${lang}/`}"`));
    assert.equal((html.match(/data-language="(?:es|ca|en)"/g) ?? []).length, 6);
  }
  assert.ok(pages.ca.includes("Alguns documents descarregables només estan disponibles en castellà."));
  assert.ok(pages.en.includes("Some downloadable documents are only available in Spanish."));
});

test("los servicios y trabajos conservan su traducción asociada a cada enlace", () => {
  const expected = {
    ca: {
      "/servicios/transportes-especiales": "Transports especials",
      "/servicios/montaje-estructuras-prefabricado": "Muntatge d&#39;estructures prefabricades",
      "/blog/desmontaje-mercat-dels-encants": "Desmuntatge al Mercat dels Encants",
    },
    en: {
      "/servicios/transportes-especiales": "Special transport",
      "/servicios/montaje-estructuras-prefabricado": "Precast structure assembly",
      "/blog/desmontaje-mercat-dels-encants": "Dismantling at Mercat dels Encants",
    },
  };
  for (const [lang, links] of Object.entries(expected)) {
    for (const [href, title] of Object.entries(links)) {
      const target = `/${lang}${href}`;
      const card = pages[lang].match(new RegExp(`<a href="${target}"[\\s\\S]*?</a>`))?.[0];
      assert.ok(card?.includes(title), `${lang}: ${href}`);
    }
  }
});

test("servicios y sus detalles tienen traducciones reales y enlaces localizados", () => {
  const categories = JSON.parse(readFileSync(new URL("../src/data/servicios.json", import.meta.url), "utf8")).categorias;
  const expected = {
    es: ["Soluciones integrales de elevación y transporte", "Trámites y gestiones", "Detalles del servicio"],
    ca: ["Solucions integrals d&#39;elevació i transport", "Tràmits i gestions", "Detalls del servei"],
    en: ["Complete lifting and transport solutions", "Permits and paperwork", "Service details"],
  };
  for (const lang of ["es", "ca", "en"]) {
    const prefix = lang === "es" ? "" : `${lang}/`;
    const index = readFileSync(new URL(`${prefix}servicios/index.html`, dist), "utf8");
    assert.ok(index.includes(expected[lang][0]) && index.includes(expected[lang][1]));
    assert.ok(index.includes(`href="/${prefix}contacto"`));
    for (const category of categories) {
      const route = `servicios/${category.slug}`;
      const html = readFileSync(new URL(`${prefix}${route}/index.html`, dist), "utf8");
      assert.ok(hasTranslations(`/${route}`));
      assert.match(html, new RegExp(`<html lang="${lang}"`));
      assert.doesNotMatch(html, /http-equiv="refresh"/);
      assert.ok(html.includes(expected[lang][2]), `${lang}: ${route}`);
      assert.ok(html.includes(`href="/${prefix}servicios"`));
      assert.ok(html.includes(`href="/${prefix}contacto"`));
      for (const [code, target] of [["es", ""], ["ca", "ca/"], ["en", "en/"]]) {
        assert.ok(html.includes(`hreflang="${code}" href="https://www.gruasdelvalles.com/${target}${route}/`));
      }
    }
  }
});

test("contacto tiene contenido, metadatos y navegación en cada idioma", () => {
  const expected = {
    es: ["Solicite su presupuesto sin compromiso", "Preguntas frecuentes", "Horario de atención"],
    ca: ["Demaneu el vostre pressupost sense compromís", "Preguntes freqüents", "Horari d&#39;atenció"],
    en: ["Request your no-obligation quote", "Frequently asked questions", "Opening hours"],
  };
  for (const lang of ["es", "ca", "en"]) {
    const path = lang === "es" ? "contacto" : `${lang}/contacto`;
    const html = readFileSync(new URL(`${path}/index.html`, dist), "utf8");
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.doesNotMatch(html, /http-equiv="refresh"/);
    for (const text of expected[lang]) assert.ok(html.includes(text), `${lang}: ${text}`);
    assert.equal((html.match(/<details\b/g) ?? []).length, 8);
    const main = html.match(/<main\b[^>]*id="main"[^>]*>[\s\S]*?<\/main>/)?.[0];
    assert.ok(main?.includes('id="contacto"'));
    assert.ok(main?.includes('id="donde-estamos"'));
    assert.ok(main?.includes('id="faq-title"'));
    const faqSchema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]))
      .find((node) => node["@type"] === "FAQPage");
    assert.equal(faqSchema?.mainEntity.length, 8);
    for (const question of faqSchema.mainEntity) assert.ok(main.includes(question.name.replaceAll("'", "&#39;")), `${lang}: FAQ visible`);
    for (const [code, target] of [["es", "/contacto/"], ["ca", "/ca/contacto/"], ["en", "/en/contacto/"]]) {
      assert.ok(html.includes(`hreflang="${code}" href="https://www.gruasdelvalles.com${target}"`));
      const selector = html.match(new RegExp(`<a href="${target}${code === "es" ? "\\?lang=es" : ""}" data-language="${code}"`));
      assert.ok(selector, `${lang} selector: ${code}`);
    }
    assert.ok(html.includes(`rel="canonical" href="https://www.gruasdelvalles.com/${path}/"`));
    assert.ok(pages[lang].includes(`href="/${path}"`), `${lang}: homepage contact link`);
  }
});

test("el catálogo y todas las fichas de flota se generan en los tres idiomas", () => {
  const fleetDir = fileURLToPath(new URL("flota/", dist));
  const models = readdirSync(fleetDir, { withFileTypes: true }).filter((item) => item.isDirectory()).map((item) => item.name);
  assert.ok(models.length > 0);
  const expected = {
    es: ["unidades propias para cualquier maniobra", "Filtrar flota por categoría", "Capacidad máxima"],
    ca: ["unitats pròpies per a qualsevol maniobra", "Filtrar la flota per categoria", "Capacitat màxima"],
    en: ["vehicles in our fleet for every lift", "Filter fleet by category", "Maximum capacity"],
  };
  for (const lang of ["es", "ca", "en"]) {
    const prefix = lang === "es" ? "" : `${lang}/`;
    const index = readFileSync(new URL(`${prefix}flota/index.html`, dist), "utf8");
    assert.ok(index.includes(expected[lang][0]) && index.includes(expected[lang][1]));
    assert.ok(index.includes('data-label-desc='));
    for (const slug of models) {
      const html = readFileSync(new URL(`${prefix}flota/${slug}/index.html`, dist), "utf8");
      assert.match(html, new RegExp(`<html lang="${lang}"`));
      assert.doesNotMatch(html, /http-equiv="refresh"/);
      assert.ok(html.includes(`href="/${prefix}flota"`));
      assert.ok(index.includes(`href="/${prefix}flota/${slug}"`));
      assert.ok(html.includes(`hreflang="${lang}" href="https://www.gruasdelvalles.com/${prefix}flota/${slug}/"`));
    }
    const heavyCrane = readFileSync(new URL(`${prefix}flota/liebherr-ltm-1500-8-1/index.html`, dist), "utf8");
    assert.ok(heavyCrane.includes(expected[lang][2]));
  }
});

test("seguridad mantiene sus acreditaciones y documentos en cada idioma", () => {
  const expected = {
    es: ["La seguridad, en el centro de cada maniobra", "Taller mecánico propio", "Descargar PDF"],
    ca: ["La seguretat, al centre de cada maniobra", "Taller mecànic propi", "Descarregar PDF"],
    en: ["Safety at the heart of every lift", "Our own mechanical workshop", "Download PDF"],
  };
  for (const lang of ["es", "ca", "en"]) {
    const prefix = lang === "es" ? "" : `${lang}/`;
    const html = readFileSync(new URL(`${prefix}seguridad/index.html`, dist), "utf8");
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.doesNotMatch(html, /http-equiv="refresh"/);
    for (const text of expected[lang]) assert.ok(html.includes(text), `${lang}: ${text}`);
    assert.ok(html.includes("0900006812"));
    assert.ok(pages[lang].includes(`href="/${prefix}seguridad"`));
    assert.ok(html.includes(`hreflang="${lang}" href="https://www.gruasdelvalles.com/${prefix}seguridad/"`));
  }
});

test("las asociaciones están traducidas y conservan sus enlaces", () => {
  const expected = {
    es: ["Organismos y asociaciones", "Socio Colaborador desde 1997", "Descargar documento acreditativo"],
    ca: ["Organismes i associacions", "Soci col·laborador des de 1997", "Descarregar document acreditatiu"],
    en: ["Organisations and associations", "Supporting member since 1997", "Download supporting document"],
  };
  for (const lang of ["es", "ca", "en"]) {
    const prefix = lang === "es" ? "" : `${lang}/`;
    const html = readFileSync(new URL(`${prefix}organismos/index.html`, dist), "utf8");
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.doesNotMatch(html, /http-equiv="refresh"/);
    for (const text of expected[lang]) assert.ok(html.includes(text), `${lang}: ${text}`);
    assert.ok(html.includes('href="https://www.anagrual.es"'));
    assert.ok(pages[lang].includes(`href="/${prefix}organismos"`));
    assert.ok(html.includes(`hreflang="${lang}" href="https://www.gruasdelvalles.com/${prefix}organismos/"`));
  }
});

test("la página de empresa traduce historia, instalaciones y navegación", () => {
  const expected = {
    es: ["Empresa familiar de referencia", "Nuestra historia", "Taller mecánico", "Actualidad"],
    ca: ["Empresa familiar de referència", "La nostra història", "Taller mecànic", "Actualitat"],
    en: ["A family business specialising", "Our history", "Mechanical workshop", "Today"],
  };
  for (const lang of ["es", "ca", "en"]) {
    const prefix = lang === "es" ? "" : `${lang}/`;
    const html = readFileSync(new URL(`${prefix}nosotros/index.html`, dist), "utf8");
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.doesNotMatch(html, /http-equiv="refresh"/);
    for (const text of expected[lang]) assert.ok(html.includes(text), `${lang}: ${text}`);
    assert.equal((html.match(/class="timeline-item relative"/g) ?? []).length, 14);
    assert.ok(pages[lang].includes(`href="/${prefix}nosotros"`));
    assert.ok(html.includes(`hreflang="${lang}" href="https://www.gruasdelvalles.com/${prefix}nosotros/"`));
  }
});

test("localidades y cobertura conservan contenido, enlaces y SEO en cada idioma", () => {
  const locations = JSON.parse(readFileSync(new URL("../src/data/localidades.json", import.meta.url), "utf8"));
  const titles = { es: "Alquiler de grúas", ca: "Lloguer de grues", en: "Crane hire" };
  for (const lang of ["es", "ca", "en"]) {
    const prefix = lang === "es" ? "" : `${lang}/`;
    const index = readFileSync(new URL(`${prefix}alquiler-gruas/index.html`, dist), "utf8");
    assert.match(index, new RegExp(`<html lang="${lang}"`));
    assert.ok(index.includes(titles[lang]));
    assert.doesNotMatch(index, /http-equiv="refresh"/);
    assert.ok(pages[lang].includes(`href="/${prefix}alquiler-gruas"`));
    for (const loc of locations) {
      const route = `alquiler-gruas/${loc.slug}`;
      const html = readFileSync(new URL(`${prefix}${route}/index.html`, dist), "utf8");
      assert.match(html, new RegExp(`<html lang="${lang}"`));
      assert.doesNotMatch(html, /http-equiv="refresh"/);
      assert.ok(html.includes(titles[lang]), `${lang}: ${route}`);
      assert.ok(index.includes(`href="/${prefix}${route}"`));
      assert.ok(html.includes(`href="/${prefix}alquiler-gruas"`));
      if (lang !== "es") assert.ok(!html.includes(loc.intro), `${lang}: untranslated introduction for ${loc.slug}`);
      for (const [code, target] of [["es", ""], ["ca", "ca/"], ["en", "en/"]]) {
        assert.ok(html.includes(`hreflang="${code}" href="https://www.gruasdelvalles.com/${target}${route}/`));
      }
      const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
        .map((match) => JSON.parse(match[1])).find((item) => item["@type"] === "Service");
      assert.ok(schema?.serviceType.startsWith(titles[lang]));
      assert.equal(schema.url, `https://www.gruasdelvalles.com/${prefix}${route}`);
    }
  }
  const caMaresme = readFileSync(new URL("ca/alquiler-gruas/maresme/index.html", dist), "utf8");
  assert.ok(caMaresme.includes("Lloguer de grues al Maresme"));
  assert.doesNotMatch(caMaresme, /a el Maresme|de el Maresme/);
});

test("empleo y páginas legales tienen contenido y navegación en cada idioma", () => {
  const expected = {
    es: { "trabaja-con-nosotros": "Forma parte de nuestro equipo", "legal/aviso-legal": "Datos identificativos", "legal/privacidad": "Responsable del tratamiento", "legal/politica-cookies": "¿Qué son las cookies?" },
    ca: { "trabaja-con-nosotros": "Forma part del nostre equip", "legal/aviso-legal": "Dades identificatives", "legal/privacidad": "Responsable del tractament", "legal/politica-cookies": "Què són les galetes?" },
    en: { "trabaja-con-nosotros": "Join our team", "legal/aviso-legal": "Identification details", "legal/privacidad": "Data controller", "legal/politica-cookies": "What are cookies?" },
  };
  for (const [lang, routes] of Object.entries(expected)) {
    const prefix = lang === "es" ? "" : `${lang}/`;
    for (const [route, text] of Object.entries(routes)) {
      const html = readFileSync(new URL(`${prefix}${route}/index.html`, dist), "utf8");
      assert.match(html, new RegExp(`<html lang="${lang}"`));
      assert.doesNotMatch(html, /http-equiv="refresh"/);
      assert.ok(html.includes(text), `${lang}: ${route}`);
      assert.ok(pages[lang].includes(`href="/${prefix}${route}"`));
      for (const [code, target] of [["es", ""], ["ca", "ca/"], ["en", "en/"]]) {
        assert.ok(html.includes(`hreflang="${code}" href="https://www.gruasdelvalles.com/${target}${route}/`));
      }
    }
  }
});

test("todas las noticias están traducidas y enlazadas desde su índice", () => {
  const posts = readdirSync(fileURLToPath(new URL("../src/content/blog/", import.meta.url)))
    .filter((name) => name.endsWith(".md")).map((name) => name.slice(0, -3));
  assert.ok(posts.length > 0);
  for (const lang of ["es", "ca", "en"]) {
    const prefix = lang === "es" ? "" : `${lang}/`;
    const index = readFileSync(new URL(`${prefix}blog/index.html`, dist), "utf8");
    assert.match(index, new RegExp(`<html lang="${lang}"`));
    assert.doesNotMatch(index, /http-equiv="refresh"/);
    for (const slug of posts) {
      const route = `blog/${slug}`;
      const html = readFileSync(new URL(`${prefix}${route}/index.html`, dist), "utf8");
      assert.match(html, new RegExp(`<html lang="${lang}"`));
      assert.doesNotMatch(html, /http-equiv="refresh"/);
      assert.ok(index.includes(`href="/${prefix}${route}"`), `${lang}: ${route}`);
      assert.ok(html.includes(`href="/${prefix}blog"`));
      for (const [code, target] of [["es", ""], ["ca", "ca/"], ["en", "en/"]]) {
        assert.ok(html.includes(`hreflang="${code}" href="https://www.gruasdelvalles.com/${target}${route}/`));
      }
      if (lang !== "es") {
        const spanish = readFileSync(new URL(`${route}/index.html`, dist), "utf8");
        const body = (page) => page.match(/<div class="blog-prose[^>]*>([\s\S]*?)<\/div>/)?.[1];
        assert.ok(body(html));
        assert.notEqual(body(html), body(spanish), `${lang}: ${route}`);
      }
    }
  }
});

test("los enlaces y anclas de cada portada tienen destino generado", () => {
  for (const [lang, html] of Object.entries(pages)) {
    const origin = new URL(lang === "es" ? "/" : `/${lang}/`, "https://www.gruasdelvalles.com");
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^" ]+)"/g)) {
      if (!href.startsWith("/") && !href.startsWith("#")) continue;
      const url = new URL(href.replaceAll("&amp;", "&"), origin);
      const path = join(fileURLToPath(dist), decodeURIComponent(url.pathname));
      const target = existsSync(path) && statSync(path).isFile() ? path : join(path, "index.html");
      assert.ok(existsSync(target), `${lang}: ${href}`);
      if (url.hash && target.endsWith(".html")) {
        assert.ok(readFileSync(target, "utf8").includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${lang}: ${href}`);
      }
    }
  }
});

test("los enlaces internos de todas las páginas generadas tienen destino", () => {
  const root = fileURLToPath(dist);
  function htmlFiles(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? htmlFiles(path) : entry.name === "index.html" ? [path] : [];
    });
  }
  const errors = [];
  for (const file of htmlFiles(root)) {
    const route = file.slice(root.length).replaceAll("\\", "/").replace(/index\.html$/, "");
    const origin = new URL(`/${route}`, "https://www.gruasdelvalles.com");
    const html = readFileSync(file, "utf8");
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^" ]+)"/g)) {
      if (!href.startsWith("/") && !href.startsWith("#")) continue;
      const url = new URL(href.replaceAll("&amp;", "&"), origin);
      const path = join(root, decodeURIComponent(url.pathname));
      const target = existsSync(path) && statSync(path).isFile() ? path : join(path, "index.html");
      if (!existsSync(target)) errors.push(`${route}: ${href} (destino inexistente)`);
      else if (url.hash && target.endsWith(".html") && !readFileSync(target, "utf8").includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) {
        errors.push(`${route}: ${href} (ancla inexistente)`);
      }
    }
  }
  assert.deepEqual(errors, []);
});

test("detección y selección explícita respetan idioma, URL y preferencias", { skip: !nodeModule.stripTypeScriptTypes }, () => {
  const source = nodeModule.stripTypeScriptTypes(readFileSync(new URL("../src/scripts/language.ts", import.meta.url), "utf8")).replace(/^import .*?;\s*/m, "");
  function run({ languages = ["es"], saved, pathname = "/", search = "", hash = "", blocked = false } = {}) {
    let redirected;
    let stored = saved;
    let click;
    const document = { addEventListener: (_, handler) => { click = handler; } };
    const window = { location: { pathname, search, hash, replace: (url) => { redirected = url; } } };
    const localStorage = {
      getItem: () => { if (blocked) throw Error("blocked"); return stored; },
      setItem: (_, value) => { if (blocked) throw Error("blocked"); stored = value; },
    };
    runInNewContext(source, { document, window, localStorage, navigator: { languages, language: languages[0] }, URLSearchParams, hasTranslations });
    return { redirected, get stored() { return stored; }, select: (lang) => click({ target: { closest: () => ({ dataset: { language: lang } }) } }) };
  }
  assert.equal(run({ languages: ["ca-ES"], search: "?utm=campaign", hash: "#contacto" }).redirected, "/ca/?utm=campaign#contacto");
  assert.equal(run({ languages: ["en-GB"] }).redirected, "/en/");
  assert.equal(run({ languages: ["fr-FR"] }).redirected, undefined);
  assert.equal(run({ languages: ["en"], saved: "es" }).redirected, undefined);
  assert.equal(run({ languages: ["en"], search: "?lang=es", blocked: true }).redirected, undefined);
  assert.equal(run({ languages: ["en"], pathname: "/ca/" }).redirected, undefined);
  assert.equal(run({ languages: ["ca"], pathname: "/contacto", search: "?utm=campaign", hash: "#contacto" }).redirected, "/ca/contacto?utm=campaign#contacto");
  assert.equal(run({ languages: ["en"], pathname: "/contacto", search: "?lang=es", blocked: true }).redirected, undefined);
  assert.equal(run({ languages: ["en"], pathname: "/servicios" }).redirected, "/en/servicios");
  assert.equal(run({ languages: ["ca"], pathname: "/servicios/transportes-especiales" }).redirected, "/ca/servicios/transportes-especiales");
  assert.equal(run({ languages: ["en"], pathname: "/flota" }).redirected, "/en/flota");
  assert.equal(run({ languages: ["en"], pathname: "/nosotros" }).redirected, "/en/nosotros");
  assert.equal(run({ languages: ["ca"], pathname: "/alquiler-gruas/maresme" }).redirected, "/ca/alquiler-gruas/maresme");
  assert.equal(run({ languages: ["en"], pathname: "/blog" }).redirected, "/en/blog");
  assert.equal(run({ languages: ["ca"], pathname: "/trabaja-con-nosotros" }).redirected, "/ca/trabaja-con-nosotros");
  assert.equal(run({ languages: ["en"], pathname: "/legal/privacidad" }).redirected, "/en/legal/privacidad");
  const session = run({ languages: ["es"] });
  session.select("ca");
  assert.equal(session.stored, "ca");
  assert.equal(run({ languages: ["es"], saved: session.stored }).redirected, "/ca/");
});