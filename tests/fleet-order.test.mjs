import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const dist = new URL("../dist/", import.meta.url);
const read = (path) => readFileSync(new URL(path, dist), "utf8");
const cardsIn = (html) => [...html.matchAll(/<a\b[^>]*class="flota-card\b[^>]*>[\s\S]*?<\/a>/g)].map((match) => match[0]);
const attribute = (card, name) => card.match(new RegExp(`\\bdata-${name}(?:="([^"]*)")?`))?.[1] ?? "";

test("el catálogo presenta todas las grúas antes que los camiones y distingue sus unidades", () => {
  for (const prefix of ["", "ca/", "en/"]) {
    const cards = cardsIn(read(`${prefix}flota/index.html`));
    const groups = cards.map((card) => attribute(card, "grupo"));
    assert.ok(groups.includes("0") && groups.includes("1"));
    assert.deepEqual(groups, [...groups].sort());
    for (const card of cards) {
      const capacity = attribute(card, "tonelaje");
      if (!capacity) continue;
      const unit = attribute(card, "grupo") === "1" ? "tm" : "Tn";
      assert.ok(card.includes(`${capacity} ${unit}`), `${prefix}: ${capacity} ${unit}`);
    }
    assert.match(read(`${prefix}index.html`), /200 tm/);
    assert.match(read(`${prefix}flota/camion-grua-200-tm-doble-jib/index.html`), /200 tm/);
  }
});

test("ordenación y filtros mantienen los grupos y ordenan solo capacidades comparables", () => {
  const html = read("flota/index.html");
  const cards = cardsIn(html).map((card) => ({
    dataset: {
      categoria: attribute(card, "categoria"),
      grupo: attribute(card, "grupo"),
      tonelaje: attribute(card, "tonelaje"),
      orden: attribute(card, "orden"),
    },
    style: {},
  }));
  const initial = [...cards];
  const classList = { add() {}, remove() {}, toggle() {} };
  const button = (filter) => ({
    dataset: { filter }, classList,
    addEventListener(_event, callback) { this.click = callback; },
    setAttribute() {},
  });
  const all = button("all");
  const trucks = button("Camiones y Vehículos auxiliares");
  const sort = button();
  sort.dataset = { labelNone: "Capacidad", labelDesc: "Mayor", labelAsc: "Menor" };
  const grid = {
    querySelectorAll: () => cards,
    appendChild(card) { cards.splice(cards.indexOf(card), 1); cards.push(card); },
  };
  const elements = {
    "flota-grid": grid, "sort-tonelaje": sort, "sort-label": {},
    "sort-icon": { style: {}, querySelector: () => ({ setAttribute() {} }) },
  };
  const script = [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)]
    .map((match) => match[1]).find((content) => content.includes("flota-grid"));
  assert.ok(script);
  runInNewContext(script, {
    document: { querySelectorAll: () => [all, trucks], getElementById: (id) => elements[id] },
  });

  function checkSorted(direction) {
    const visible = cards.filter((card) => card.style.display !== "none");
    const groups = visible.map((card) => card.dataset.grupo);
    assert.deepEqual(groups, [...groups].sort());
    for (const group of ["0", "1"]) {
      const values = visible.filter((card) => card.dataset.grupo === group).map((card) => card.dataset.tonelaje);
      const known = values.filter(Boolean).map(Number);
      assert.deepEqual(known, [...known].sort((a, b) => direction * (a - b)));
      assert.deepEqual(values, [...values.filter(Boolean), ...values.filter((value) => !value)]);
    }
  }

  sort.click();
  checkSorted(-1);
  sort.click();
  checkSorted(1);
  trucks.click();
  assert.ok(cards.some((card) => card.style.display === "none"));
  checkSorted(1);
  all.click();
  checkSorted(1);
  sort.click();
  assert.deepEqual(cards, initial);
});