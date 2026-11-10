import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dist = new URL("../dist/", import.meta.url);
const data = JSON.parse(readFileSync(new URL("../src/data/contacto.json", import.meta.url), "utf8"));
const read = (path) => readFileSync(new URL(path, dist), "utf8");
const languages = { es: "", ca: "ca/", en: "en/" };

test("cada persona tiene una ficha enlazada y una vCard en los tres idiomas", () => {
  assert.equal(new Set(data.contactos.map((person) => person.slug)).size, data.contactos.length);
  for (const [lang, prefix] of Object.entries(languages)) {
    const home = read(`${prefix}index.html`);
    const contact = read(`${prefix}contacto/index.html`);
    for (const person of data.contactos) {
      const path = `${prefix}equipo/${person.slug}`;
      const phone = `+34${person.telefono.replace(/\s/g, "")}`;
      const html = read(`${path}/index.html`);
      const card = read(`${path}.vcf`);
      const unfolded = card.replace(/\r\n /g, "");
      assert.ok(home.includes(`href="/${path}/"`), `${lang}: enlace en portada`);
      assert.ok(contact.includes(`href="/${path}/"`), `${lang}: enlace en contacto`);
      assert.ok(html.includes(`<html lang="${lang}"`));
      assert.ok(html.includes(person.nombre));
      assert.ok(html.includes(`href="tel:${phone}"`));
      assert.ok(html.includes(`href="mailto:${person.email}"`));
      assert.ok(html.includes(`href="/${path}.vcf"`));
      assert.ok(unfolded.includes(`FN:${person.nombre}\r\n`));
      assert.ok(unfolded.includes(`TEL;TYPE=WORK,VOICE:${phone}\r\n`));
      assert.ok(unfolded.includes(`EMAIL;TYPE=WORK:${person.email}\r\n`));
      assert.ok(card.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n"));
      assert.ok(card.endsWith("END:VCARD\r\n"));
      for (const line of card.split("\r\n")) assert.ok(Buffer.byteLength(line) <= 75);
      for (const [code, target] of Object.entries(languages)) {
        assert.ok(html.includes(`hreflang="${code}" href="https://www.gruasdelvalles.com/${target}equipo/${person.slug}/"`));
      }
    }
  }
});

test("la ficha y la vCard usan el idioma seleccionado y aparecen en el sitemap", () => {
  const expected = { es: "Contabilidad", ca: "Contabilitat", en: "Accounting" };
  const sitemap = read("sitemap-0.xml");
  for (const [lang, prefix] of Object.entries(languages)) {
    const path = `${prefix}equipo/rosario-lozano`;
    assert.ok(read(`${path}/index.html`).includes(expected[lang]));
    assert.ok(read(`${path}.vcf`).includes(`TITLE:${expected[lang]}\r\n`));
    assert.ok(sitemap.includes(`https://www.gruasdelvalles.com/${path}/`));
  }
  assert.ok(!sitemap.includes(".vcf"));
});