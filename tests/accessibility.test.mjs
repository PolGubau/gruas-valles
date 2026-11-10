import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { hasTranslations } from "../src/i18n/routes.mjs";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const home = readFileSync(join(dist, "index.html"), "utf8");
const asset = (path) => join(dist, decodeURIComponent(path).replace(/^\/+/, ""));

test("los enlaces internos y sus anclas llevan a contenido generado", () => {
  const links = [...home.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => match[1].replaceAll("&amp;", "&"));
  for (const href of links) {
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const url = new URL(href, "https://www.gruasdelvalles.com/");
    const path = asset(url.pathname);
    const target = existsSync(path) && statSync(path).isFile() ? path : join(path, "index.html");
    assert.ok(existsSync(target), `Destino inexistente: ${href}`);
    if (url.hash && target.endsWith(".html")) {
      assert.ok(readFileSync(target, "utf8").includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Ancla inexistente: ${href}`);
    }
  }
});

test("los enlaces de descarga de la portada apuntan a PDFs válidos", () => {
  const downloads = [...home.matchAll(/<a\b[^>]*\bdownload(?:="[^"]*")?[^>]*>/g)];
  assert.ok(downloads.length > 0);
  for (const [tag] of downloads) {
    const href = tag.match(/\bhref="([^"]+)"/)?.[1];
    assert.ok(href?.startsWith("/"));
    assert.equal(readFileSync(asset(href)).subarray(0, 5).toString(), "%PDF-");
  }
});

test("el sitemap incluye las traducciones reales, pero no las redirecciones interiores", () => {
  const sitemap = readFileSync(join(dist, "sitemap-0.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
  assert.ok(urls.length > 0);
  for (const locale of ["ca", "en"]) {
    assert.ok(urls.some((url) => url.pathname.replace(/\/$/, "") === `/${locale}`));
    assert.ok(urls.some((url) => url.pathname.replace(/\/$/, "") === `/${locale}/contacto`));
    for (const route of ["/nosotros", "/organismos", "/seguridad", "/alquiler-gruas", "/alquiler-gruas/maresme"]) {
      assert.ok(urls.some((url) => url.pathname.replace(/\/$/, "") === `/${locale}${route}`), `${locale}${route}`);
    }
  }
  assert.ok(urls.every((url) => !/^\/(ca|en)\//.test(url.pathname) || hasTranslations(url.pathname.replace(/^\/(ca|en)/, ""))));
  for (const url of urls.filter((item) => !hasTranslations(item.pathname) && !/^\/(ca|en)\//.test(item.pathname) && !/^\/(ca|en)\/?$/.test(item.pathname))) {
    for (const locale of ["ca", "en"]) {
      const redirectPath = join(dist, locale, url.pathname.replace(/^\/+/, ""), "index.html");
      assert.ok(existsSync(redirectPath), `Falta ${locale}${url.pathname}`);
      const redirect = readFileSync(redirectPath, "utf8");
      assert.match(redirect, /http-equiv="refresh"/);
      assert.match(redirect, /name="robots" content="noindex"/);
      assert.ok(redirect.includes(`url=${url.pathname.replace(/\/$/, "")}`), `Destino inesperado: ${locale}${url.pathname}`);
    }
  }
});

test("la imagen principal tiene alternativas móviles y carga prioritaria", () => {
  const hero = home.match(/<img\b[^>]*class="hero-slide[^>]*>/)?.[0];
  assert.ok(hero);
  assert.match(hero, /fetchpriority="high"/);
  assert.match(hero, /loading="eager"/);
  const original = hero.match(/\bsrc="([^"]+)"/)?.[1];
  const srcset = hero.match(/\bsrcset="([^"]+)"/)?.[1];
  assert.ok(original && srcset);
  const mobile = srcset.split(",").map((entry) => entry.trim()).find((entry) => entry.endsWith(" 480w"));
  assert.ok(mobile);
  assert.ok(statSync(asset(mobile.split(" ")[0])).size < statSync(asset(original)).size);
});

test("el contenido principal no depende de animaciones ni JavaScript para mostrarse", () => {
  const hero = home.slice(home.indexOf('id="hero"'), home.indexOf("</section>", home.indexOf('id="hero"')));
  assert.ok(!hero.includes("data-reveal"));
  const styles = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
  assert.ok(!/\[data-reveal\]\s*\{[^}]*opacity\s*:\s*0/.test(styles));
  const navbar = readFileSync(new URL("../src/components/ui/Navbar.astro", import.meta.url), "utf8");
  assert.match(navbar, /:global\(\.nav-ready\) \.mobile-menu/);
});

test("los colores principales mantienen contraste en superficies oscuras y claras", () => {
  const luminance = (hex) => {
    const channels = hex.match(/[0-9a-f]{2}/gi).map((part) => parseInt(part, 16) / 255);
    const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const contrast = (a, b) => {
    const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (values[0] + 0.05) / (values[1] + 0.05);
  };
  assert.ok(contrast("d60b0c", "ffffff") >= 4.5);
  assert.ok(contrast("ff8585", "121212") >= 4.5);
  assert.ok(contrast("c3c3c3", "121212") >= 4.5);
});