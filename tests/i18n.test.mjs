import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import * as nodeModule from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { runInNewContext } from "node:vm";

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
  assert.ok(pages.ca.includes("Les pàgines de detall i el catàleg estan disponibles en castellà."));
  assert.ok(pages.en.includes("Detailed pages and the catalogue are available in Spanish."));
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
      const card = pages[lang].match(new RegExp(`<a href="${href}"[\\s\\S]*?</a>`))?.[0];
      assert.ok(card?.includes(title), `${lang}: ${href}`);
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

test("detección y selección explícita respetan idioma, URL y preferencias", { skip: !nodeModule.stripTypeScriptTypes }, () => {
  const source = nodeModule.stripTypeScriptTypes(readFileSync(new URL("../src/scripts/language.ts", import.meta.url), "utf8"));
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
    runInNewContext(source, { document, window, localStorage, navigator: { languages, language: languages[0] }, URLSearchParams });
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
  assert.equal(run({ languages: ["en"], pathname: "/servicios" }).redirected, undefined);
  const session = run({ languages: ["es"] });
  session.select("ca");
  assert.equal(session.stored, "ca");
  assert.equal(run({ languages: ["es"], saved: session.stored }).redirected, "/ca/");
});