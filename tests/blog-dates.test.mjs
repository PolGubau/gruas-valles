import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import * as nodeModule from "node:module";
import test from "node:test";
import { publicBlogSlug } from "../src/lib/blog-slugs.mjs";

const dist = process.env.GV_TEST_DIST ? new URL(process.env.GV_TEST_DIST) : new URL("../dist/", import.meta.url);
const source = new URL("../src/content/blog/", import.meta.url);
const read = (path) => readFileSync(new URL(path, dist), "utf8");

test("las noticias se publican por fecha descendente en los tres idiomas", () => {
  const expected = readdirSync(source).filter((name) => name.endsWith(".md")).map((name) => {
    const content = readFileSync(new URL(name, source), "utf8");
    const date = content.match(/^fecha: (\d{4}-\d{2}-\d{2})$/m)?.[1];
    assert.ok(date, `Falta fecha de publicación en ${name}`);
    const parsedDate = new Date(date);
    assert.ok(!Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().startsWith(date), `Fecha inválida en ${name}: ${date}`);
    assert.ok(name.startsWith(`${date}-`), `El nombre de ${name} debe empezar por ${date}-`);
    return { id: name.slice(date.length + 1, -3), date };
  }).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id, "es"));
  assert.ok(expected.length >= 3);

  for (const [lang, prefix] of [["es", ""], ["ca", "ca/"], ["en", "en/"]]) {
    const html = read(`${prefix}blog/index.html`);
    const cards = [...html.matchAll(/<a href="([^"]+)" class="group flex flex-col overflow-hidden rounded-sm bg-white[^>]*>[\s\S]*?<\/a>/g)];
    assert.equal(cards.length, expected.length);
    cards.forEach(([card, href], i) => {
      const { id, date } = expected[i];
      const slug = publicBlogSlug(id);
      assert.equal(href, `/${prefix}blog/${slug}`);
      const formatted = new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(date));
      assert.ok(card.includes(`datetime="${date}"`) && card.includes(formatted), `${lang}: ${slug}`);
      const article = read(`${prefix}blog/${slug}/index.html`);
      assert.ok(article.includes(`datetime="${date}"`) && article.includes(formatted), `${lang}: ${slug}`);
      const schema = [...article.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
        .map((match) => JSON.parse(match[1])).find((item) => item["@type"] === "BlogPosting");
      assert.equal(schema?.datePublished, `${date}T00:00:00.000Z`);
    });
  }
});

test("la fecha prevalece sobre cualquier otro orden y los empates son estables", { skip: !nodeModule.stripTypeScriptTypes }, async () => {
  const sourceText = readFileSync(new URL("../src/lib/blog.ts", import.meta.url), "utf8");
  const js = nodeModule.stripTypeScriptTypes(sourceText);
  const { compareBlogDates } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
  const posts = [
    { slug: "antigua", fecha: new Date("2025-01-01"), orden: 0 },
    { slug: "zeta", fecha: new Date("2026-04-01"), orden: 1 },
    { slug: "alfa", fecha: new Date("2026-04-01"), orden: 2 },
  ];
  assert.deepEqual(posts.sort(compareBlogDates).map((post) => post.slug), ["alfa", "zeta", "antigua"]);
});

test("las imágenes del blog en subcarpetas se generan en el índice y el artículo", () => {
  const index = read("blog/index.html");
  const card = index.match(/<a href="\/blog\/botadura-de-un-barco"[\s\S]*?<\/a>/)?.[0];
  const article = read("blog/botadura-de-un-barco/index.html");
  const image = card?.match(/<img[^>]+src="([^"]+)"/)?.[1];
  assert.ok(image?.startsWith("/_assets/"));
  assert.ok(existsSync(new URL(image.slice(1), dist)));
  assert.ok(article.includes(`src="${image}"`));
});