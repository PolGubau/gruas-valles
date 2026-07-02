/**
 * import-local-images.mjs
 * Converts new photos from desktop "IMATGES GRUES" folder to AVIF
 * and places them in src/assets/images/ replacing existing fleet images.
 *
 * Usage: node scripts/import-local-images.mjs
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const DESKTOP = path.join(os.homedir(), "Desktop", "IMATGES GRUES");
const OFERTES = path.join(DESKTOP, "IMATGES X OFERTES");
const OUT_DIR = path.resolve("src/assets/images");

// ── Mapping: { src: relative-to-DESKTOP, dest: filename in OUT_DIR } ──────────
const FLEET_CUTOUTS = [
  // Gran tonelaje
  { src: "IMATGES X OFERTES/Gr 1500 Dreta.png",       dest: "flota-liebherr-ltm1500-8-1-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1400.png",              dest: "flota-liebherr-ltm1400-7-1-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1350.png",              dest: "flota-liebherr-ltm1350-6-1-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1250.png",              dest: "flota-grove-gmk5250xl-1-01.avif" },
  // Móviles autopropulsadas
  { src: "IMATGES X OFERTES/Gr 1150.png",              dest: "flota-grove-gmt5150l-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1110.png",              dest: "flota-liebherr-ltm1110-5-2-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1101.png",              dest: "flota-liebherr-ltm1100-5-3-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1092.png",              dest: "flota-liebherr-ltm1090-4-2-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1082.png",              dest: "flota-liebherr-ltm1090-4-1-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1081.png",              dest: "flota-demag-ac80-2-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1060.png",              dest: "flota-grove-gmk3060l-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1051.png",              dest: "flota-liebherr-ltc1050-3-1-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1050.png",              dest: "flota-demag-ac50-1-01.avif" },
  { src: "IMATGES X OFERTES/Gr 1041.png",              dest: "flota-liebherr-ltm1040-2-1-01.avif" },
  // Construcción
  { src: "IMATGES X OFERTES/Gr Mk88 Dreta.png",        dest: "flota-liebherr-mk88-4-1-01.avif" },
  { src: "IMATGES X OFERTES/Gr SK1265.png",             dest: "flota-spierings-sk1265-at6-01.avif" },
  // Camions-grua
  { src: "IMATGES X OFERTES/Cg 1165 Dreta.png",        dest: "flota-camion-grua-165tm-01.avif" },
  { src: "IMATGES X OFERTES/Cg 1101.PNG",              dest: "flota-camion-grua-110tm-01.avif" },
  { src: "IMATGES X OFERTES/Cg 800.png",               dest: "flota-camion-grua-80tm-01.avif" },
  { src: "IMATGES X OFERTES/Cg 551 Dreta.png",         dest: "flota-camion-grua-jib-55tm-29m-01.avif" },
  { src: "IMATGES X OFERTES/Cg 550.png",               dest: "flota-camion-grua-55tm-30m-01.avif" },
  { src: "IMATGES X OFERTES/Cg 360.png",               dest: "flota-camion-grua-36tm-01.avif" },
];

// Action photos (JPEG) – used for hero + secondary catalog images
const ACTION_PHOTOS = [
  { src: "FOTOS Gr 1101/20241111_143546.jpg",          dest: "hero-grua-accion-2024-01.avif" },
  { src: "FOTOS Cg2200/20251202_132518.jpg",           dest: "flota-camion-grua-200tm-01.avif" },
];

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

function ffmpegAvif(srcFull, destFull, hasAlpha) {
  const pixFmt = hasAlpha ? "yuva420p" : "yuv420p";
  // cpu-used 6 = fast preset, still good quality for web
  const cmd = [
    "ffmpeg", "-y",
    "-i", `"${srcFull}"`,
    "-c:v", "libaom-av1",
    "-crf", "38",
    "-b:v", "0",
    "-cpu-used", "6",
    "-pix_fmt", pixFmt,
    `"${destFull}"`,
  ].join(" ");

  process.stdout.write(`  → ${path.basename(destFull)} ... `);
  try {
    execSync(cmd, { stdio: "pipe" });
    console.log("✓");
  } catch (err) {
    console.error("✗");
    console.error(err.stderr?.toString().slice(-400));
  }
}

console.log("\n📦 Fleet cutouts (PNG with alpha → AVIF)");
for (const { src, dest } of FLEET_CUTOUTS) {
  const srcFull = path.join(DESKTOP, src);
  const destFull = path.join(OUT_DIR, dest);
  if (!existsSync(srcFull)) { console.warn(`  ⚠ Not found: ${src}`); continue; }
  ffmpegAvif(srcFull, destFull, true);
}

console.log("\n📷 Action photos (JPEG → AVIF)");
for (const { src, dest } of ACTION_PHOTOS) {
  const srcFull = path.join(DESKTOP, src);
  const destFull = path.join(OUT_DIR, dest);
  if (!existsSync(srcFull)) { console.warn(`  ⚠ Not found: ${src}`); continue; }
  ffmpegAvif(srcFull, destFull, false);
}

console.log("\n✅ Done. Images placed in src/assets/images/");
console.log("   Update Hero.astro to reference: hero-grua-accion-2024-01.avif");
