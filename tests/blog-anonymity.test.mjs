import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { blogSlugs, publicBlogSlug } from "../src/lib/blog-slugs.mjs";

const dist = process.env.GV_TEST_DIST ? new URL(process.env.GV_TEST_DIST) : new URL("../dist/", import.meta.url);
const source = new URL("../src/content/blog/", import.meta.url);
const read = (path) => readFileSync(new URL(path, dist), "utf8");
const identifiers = /corte[ -]ingl[eé]s|sabadell|dalmau|premi[aà]|arenys|barcelona|granollers|hospitalet|novartis|adelte|encants|fadfest|fura dels baus|polo music|grove|liebherr|spierings/i;

test("las noticias publicadas y sus imágenes no identifican clientes ni ubicaciones conocidas", () => {
  const ids = readdirSync(source).filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/^\d{4}-\d{2}-\d{2}-/, "").slice(0, -3));
  for (const prefix of ["", "ca/", "en/"]) {
    const index = read(`${prefix}blog/index.html`);
    for (const id of ids) {
      const slug = publicBlogSlug(id);
      const article = read(`${prefix}blog/${slug}/index.html`).match(/<article\b[\s\S]*?<\/article>/)?.[0];
      const card = index.match(new RegExp(`<a href="/${prefix}blog/${slug}"[\\s\\S]*?</a>`))?.[0];
      assert.ok(article && card, `${prefix}${slug}`);
      assert.doesNotMatch(article, identifiers, `${prefix}${slug}: artículo`);
      assert.doesNotMatch(card, identifiers, `${prefix}${slug}: tarjeta`);
      for (const [, src] of article.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
        assert.match(src, /^\/_assets\/[A-Za-z0-9_-]+\.(?:avif|jpe?g|png|webp)$/i);
        assert.ok(existsSync(new URL(src.slice(1), dist)), src);
      }
    }
  }
});

test("las URLs anteriores redirigen a la noticia traducida y no aparecen en el sitemap", () => {
  const sitemap = read("sitemap-0.xml");
  for (const prefix of ["", "ca/", "en/"]) {
    const index = read(`${prefix}blog/index.html`);
    for (const [oldSlug, slug] of Object.entries(blogSlugs)) {
      const oldPath = `/${prefix}blog/${oldSlug}`;
      const target = `/${prefix}blog/${slug}`;
      assert.ok(read(`${prefix}blog/${oldSlug}/index.html`).includes(`content="0;url=${target}"`), oldPath);
      assert.ok(!index.includes(`href="${oldPath}"`), oldPath);
      assert.ok(!sitemap.includes(`${oldPath}/</loc>`), oldPath);
      assert.ok(sitemap.includes(`${target}/</loc>`), target);
    }
  }
});