import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as nodeModule from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";

const readPage = (path) => readFileSync(new URL(`../dist/${path}`, import.meta.url), "utf8");

test("los mapas de los tres idiomas no tienen src hasta recibir consentimiento", () => {
  for (const prefix of ["", "ca/", "en/"]) {
    for (const page of ["", "contacto/", "nosotros/"]) {
      const html = readPage(`${prefix}${page}index.html`);
      const frames = [...html.matchAll(/<iframe\b[^>]*>/g)].map((match) => match[0]);
      assert.equal(frames.length, 1, `${prefix}${page}`);
      assert.match(frames[0], /data-map-src="https:\/\/www\.google\.com\/maps\/embed/);
      assert.doesNotMatch(frames[0], /(?:^|\s)src=/);
      assert.match(frames[0], /\shidden(?:\s|>|=)/);
      assert.match(html, /data-map-allow/);
      assert.match(html, /data-map-deny/);
      assert.match(html, /data-map-revoke/);
    }
  }
});

test("aceptar, rechazar, retirar y caducar controlan el iframe", { skip: !nodeModule.stripTypeScriptTypes }, () => {
  const source = nodeModule.stripTypeScriptTypes(readFileSync(new URL("../src/scripts/map-consent.ts", import.meta.url), "utf8"));
  const now = Date.now();
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  function setup(initial, options = {}) {
    let stored = initial;
    const button = () => ({ hidden: true, addEventListener(_, fn) { this.click = fn; } });
    const allow = button(), deny = button(), revoke = button();
    const frame = {
      dataset: { mapSrc: "https://www.google.com/maps/embed?example" }, hidden: true,
      getAttribute(name) { return this[name] ?? null; },
      setAttribute(name, value) { this[name] = value; },
      removeAttribute(name) { delete this[name]; },
    };
    const placeholder = { hidden: false }, controls = { hidden: true };
    const status = { hidden: true, dataset: { denied: "denied" }, textContent: "" };
    const revoked = { hidden: true, dataset: { message: "revoked" }, focus() { this.focused = true; } };
    const nodes = { "iframe[data-map-src]": frame, "[data-map-placeholder]": placeholder, "[data-map-controls]": controls, "[data-map-status]": status, "[data-map-allow]": allow, "[data-map-deny]": deny };
    const embed = { querySelector: (selector) => nodes[selector] };
    const document = { querySelectorAll: (selector) => selector === "[data-map-embed]" ? [embed] : [revoke], querySelector: () => revoked };
    const localStorage = {
      getItem: () => { if (options.blocked) throw Error(); return stored ?? null; },
      setItem: (_, value) => { if (options.blocked || options.failWrite) throw Error(); stored = value; },
      removeItem: () => { if (options.blocked) throw Error(); stored = null; },
    };
    const window = { addEventListener(_, fn) { this.sync = fn; } };
    let timer;
    runInNewContext(source, { document, window, localStorage, setTimeout: (fn) => { timer = fn; return 1; }, clearTimeout: () => {} });
    return { allow, deny, revoke, frame, placeholder, controls, status, revoked, window, get stored() { return stored; }, sync(value) { stored = value; window.sync({ key: "gv-map-consent" }); }, expire() { stored = JSON.stringify({ allowed: true, timestamp: now - maxAge }); timer(); } };
  }
  const fresh = setup();
  assert.equal(fresh.frame.src, undefined);
  assert.equal(fresh.controls.hidden, false);
  fresh.deny.click();
  assert.equal(fresh.frame.src, undefined);
  assert.equal(JSON.parse(fresh.stored).allowed, false);
  assert.equal(fresh.status.textContent, "denied");
  fresh.allow.click();
  assert.equal(fresh.frame.src, fresh.frame.dataset.mapSrc);
  assert.equal(fresh.placeholder.hidden, true);
  assert.equal(fresh.revoke.hidden, false);
  fresh.revoke.click();
  assert.equal(fresh.frame.src, undefined);
  assert.equal(JSON.parse(fresh.stored).allowed, false);
  assert.equal(fresh.revoked.focused, true);
  const accepted = setup(JSON.stringify({ allowed: true, timestamp: now }));
  assert.equal(accepted.frame.src, accepted.frame.dataset.mapSrc);
  accepted.expire();
  assert.equal(accepted.frame.src, undefined);
  assert.equal(accepted.stored, null);
  const otherTab = setup(JSON.stringify({ allowed: true, timestamp: now }));
  otherTab.sync(JSON.stringify({ allowed: false, timestamp: now }));
  assert.equal(otherTab.frame.src, undefined);
  assert.equal(otherTab.status.textContent, "denied");
  assert.equal(setup("invalid JSON").stored, null);
  assert.equal(setup(JSON.stringify({ allowed: true, timestamp: now - maxAge })).frame.src, undefined);
  assert.equal(setup(JSON.stringify({ allowed: true, timestamp: now + maxAge })).frame.src, undefined);
  const failedWrite = setup(JSON.stringify({ allowed: true, timestamp: now }), { failWrite: true });
  failedWrite.revoke.click();
  assert.equal(failedWrite.stored, null);
  const blocked = setup(undefined, { blocked: true });
  blocked.allow.click();
  assert.equal(blocked.frame.src, blocked.frame.dataset.mapSrc);
  blocked.revoke.click();
  assert.equal(blocked.frame.src, undefined);
});

test("las políticas explican la elección y no presentan navegación como consentimiento", () => {
  for (const prefix of ["", "ca/", "en/"]) {
    const cookies = readPage(`${prefix}legal/politica-cookies/index.html`);
    const privacy = readPage(`${prefix}legal/privacidad/index.html`);
    assert.match(cookies, /gv-language/);
    assert.match(cookies, /gv-map-consent/);
    assert.match(cookies, /180/);
    assert.match(privacy, /policies\.google\.com\/privacy/);
    assert.doesNotMatch(privacy, /formulario de contacto|formulari de contacte|contact form/i);
  }
});

test("los textos legales reflejan los datos de la empresa y las opciones del mapa", () => {
  const expected = {
    "": { browsing: /La navegación no implica aceptar/, basis: /interés legítimo/, retention: /consulta, solicitud o candidatura/ },
    "ca/": { browsing: /La navegació no implica acceptar/, basis: /interès legítim/, retention: /consulta, sol·licitud o candidatura/ },
    "en/": { browsing: /Browsing does not constitute acceptance/, basis: /legitimate interest/, retention: /enquiry, request or application/ },
  };
  for (const [prefix, copy] of Object.entries(expected)) {
    const notice = readPage(`${prefix}legal/aviso-legal/index.html`).replace(/\s+/g, " ");
    const privacy = readPage(`${prefix}legal/privacidad/index.html`).replace(/\s+/g, " ");
    const cookies = readPage(`${prefix}legal/politica-cookies/index.html`).replace(/\s+/g, " ");
    assert.match(notice, /A08603888/);
    assert.match(notice, /B-64170/);
    assert.doesNotMatch(notice, /42861|4058/);
    assert.match(notice, /tel:\+34938497022/);
    assert.match(notice, copy.browsing);
    assert.match(privacy, copy.basis);
    assert.match(privacy, copy.retention);
    assert.match(cookies, /NID/);
    assert.match(cookies, /SOCS/);
    assert.doesNotMatch(cookies, /<td>CONSENT<\/td>/);
  }
});