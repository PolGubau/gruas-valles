/**
 * import-gallery-images.mjs
 * Imports new gallery photos from desktop "IMATGES GRUES", converts to AVIF,
 * and prepends new entries to src/data/galerias.json per category.
 *
 * Usage: node scripts/import-gallery-images.mjs
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const DESKTOP = path.join(os.homedir(), "Desktop", "IMATGES GRUES");
const OUT_DIR = path.resolve("src/assets/images");
const GALERIAS = path.resolve("src/data/galerias.json");

// ── New photos: { src, dest, categoria } ──────────────────────────────────────
// Photos are sorted best-first within each category.
const NEW_PHOTOS = [
  // ── Industria ─────────────────────────────────────────────────────────────
  // FOTOS Nº 36 – very high quality job photos (~8MB each)
  { src: "FOTOS Nº 36/1.jpg", dest: "galeria-industria-2019-02.avif", categoria: "Industria" },
  { src: "FOTOS Nº 36/1.2.jpg", dest: "galeria-industria-2019-03.avif", categoria: "Industria" },
  { src: "FOTOS Nº 36/20191003_163142.jpg", dest: "galeria-industria-2019-04.avif", categoria: "Industria" },
  // FOTOS Gr1102 – very high quality fleet/job photo
  { src: "FOTOS Gr1102/1000118069.jpg", dest: "galeria-industria-gr1102-01.avif", categoria: "Industria" },
  // May 2026 – Gr1650 recent WhatsApp photos
  { src: "FOTOS Gr1650/IMG-20260506-WA0014.jpg", dest: "galeria-industria-2026-01.avif", categoria: "Industria" },
  { src: "FOTOS Gr1650/IMG-20260506-WA0015.jpg", dest: "galeria-industria-2026-02.avif", categoria: "Industria" },
  // Nov 2024 – fleet LTM 1100 action shots (we reuse one from hero, add two more)
  { src: "FOTOS Gr 1101/20241111_143651.jpg", dest: "galeria-industria-2024-01.avif", categoria: "Industria" },
  { src: "FOTOS Gr 1101/20241111_143557.jpg", dest: "galeria-industria-2024-02.avif", categoria: "Industria" },
  // Jun 2022 – GMK 5250XL-1 at a job site
  { src: "FOTOS Nº 42/Nº 42 GMK 5250XL-1.jpg", dest: "galeria-industria-gmk5250-2022-01.avif", categoria: "Industria" },
  { src: "FOTOS Nº 42/20220609_162223.jpg", dest: "galeria-industria-2022-02.avif", categoria: "Industria" },
  // Jun 2021 – LTM 1350-6.1 job
  { src: "FOTOS Nº 43/20210607_173933.jpg", dest: "galeria-industria-ltm1350-2021-01.avif", categoria: "Industria" },
  { src: "FOTOS Nº 43/20210607_174017.jpg", dest: "galeria-industria-ltm1350-2021-02.avif", categoria: "Industria" },

  // ── Construcción ──────────────────────────────────────────────────────────
  // MK88 city crane – construction jobs
  { src: "FOTOS Nº MK/Nº48.01.jpg", dest: "galeria-construccion-mk88-2024-01.avif", categoria: "Construcción" },
  { src: "FOTOS Nº MK/Nº48.3.jpg", dest: "galeria-construccion-mk88-2024-02.avif", categoria: "Construcción" },
  // SK1265 – Nov 2024
  { src: "FOTOS Nº SK 1265/Imagen de WhatsApp 2024-11-15 a las 16.22.08_cbff66d6.jpg", dest: "galeria-construccion-sk1265-01.avif", categoria: "Construcción" },
  { src: "FOTOS Nº SK 1265/Imagen de WhatsApp 2024-11-15 a las 16.40.57_5127e169.jpg", dest: "galeria-construccion-sk1265-02.avif", categoria: "Construcción" },

  // ── Eventos ────────────────────────────────────────────────────────────────
  // Dec 2025 – 200tm truck crane at a job
  { src: "FOTOS Cg2200/20251202_132518.jpg", dest: "galeria-eventos-camion-grua-2025-01.avif", categoria: "Eventos" },
  { src: "FOTOS Cg2200/20251202_133000.jpg", dest: "galeria-eventos-camion-grua-2025-02.avif", categoria: "Eventos" },
];

function ffmpegAvif(srcFull, destFull) {
  const cmd = [
    "ffmpeg", "-y",
    "-i", `"${srcFull}"`,
    "-c:v", "libaom-av1",
    "-crf", "38",
    "-b:v", "0",
    "-cpu-used", "6",
    "-pix_fmt", "yuv420p",
    `"${destFull}"`,
  ].join(" ");

  process.stdout.write(`  → ${path.basename(destFull)} ... `);
  try {
    execSync(cmd, { stdio: "pipe" });
    console.log("✓");
    return true;
  } catch (err) {
    console.error("✗");
    console.error(err.stderr?.toString().slice(-300));
    return false;
  }
}

// ── Convert images ─────────────────────────────────────────────────────────────
console.log("\n📷 Converting gallery photos...");
const converted = [];

for (const { src, dest, categoria } of NEW_PHOTOS) {
  const srcFull = path.join(DESKTOP, src);
  const destFull = path.join(OUT_DIR, dest);
  if (!existsSync(srcFull)) { console.warn(`  ⚠ Not found: ${src}`); continue; }
  if (ffmpegAvif(srcFull, destFull)) {
    converted.push({ dest: `/assets/images/${dest}`, categoria });
  }
}

// ── Update galerias.json ───────────────────────────────────────────────────────
const galerias = JSON.parse(readFileSync(GALERIAS, "utf8"));

for (const { dest, categoria } of converted) {
  const cat = galerias.find((c) => c.categoria === categoria);
  if (!cat) { console.warn(`  ⚠ Category not found: ${categoria}`); continue; }
  if (!cat.imagenes.includes(dest)) {
    cat.imagenes.unshift(dest); // prepend → new photos appear first
  }
}

writeFileSync(GALERIAS, JSON.stringify(galerias, null, 2) + "\n", "utf8");
console.log(`\n✅ galerias.json updated with ${converted.length} new photos.`);
