/**
 * resize-images.mjs
 * Re-encodes oversized AVIF files to web-appropriate dimensions in-place.
 * Uses ffmpeg with force_original_aspect_ratio=decrease to handle both
 * landscape and portrait photos correctly.
 *
 * Usage: node scripts/resize-images.mjs
 */

import { execSync } from "node:child_process";
import { existsSync, renameSync, unlinkSync } from "node:fs";
import path from "node:path";

const IMG_DIR = path.resolve("src/assets/images");

// ── Files to resize: { file, w, h } ─────────────────────────────────────────
// w/h define the bounding box; aspect ratio is always preserved (decrease only)
const RESIZE_JOBS = [
  // Hero – full-width background, support 2× retina up to 1440px screens
  { file: "hero-grua-accion-2024-01.avif",          w: 1920, h: 1280 },

  // Fleet action photo – used as secondary fleet card image
  { file: "flota-camion-grua-200tm-01.avif",        w: 900,  h: 675  },

  // Gallery – Industria
  { file: "galeria-industria-2019-02.avif",         w: 1200, h: 900  },
  { file: "galeria-industria-2019-03.avif",         w: 1200, h: 900  },
  { file: "galeria-industria-2019-04.avif",         w: 1200, h: 900  },
  { file: "galeria-industria-2022-02.avif",         w: 1200, h: 900  },
  { file: "galeria-industria-2024-01.avif",         w: 1200, h: 900  },
  { file: "galeria-industria-2024-02.avif",         w: 1200, h: 900  },
  { file: "galeria-industria-gmk5250-2022-01.avif", w: 1200, h: 900  },
  { file: "galeria-industria-gr1102-01.avif",       w: 900,  h: 1200 }, // portrait
  { file: "galeria-industria-ltm1350-2021-01.avif", w: 1200, h: 900  },
  { file: "galeria-industria-ltm1350-2021-02.avif", w: 1200, h: 900  },

  // Gallery – Construcción
  { file: "galeria-construccion-mk88-2024-01.avif", w: 1200, h: 675  },
  { file: "galeria-construccion-mk88-2024-02.avif", w: 1200, h: 675  },

  // Gallery – Eventos
  { file: "galeria-eventos-camion-grua-2025-01.avif", w: 1200, h: 900 },
  { file: "galeria-eventos-camion-grua-2025-02.avif", w: 1200, h: 900 },

  // Gallery – Industria (2026 WhatsApp, 1600px → cap at 1200)
  { file: "galeria-industria-2026-01.avif",         w: 1200, h: 900  },
  { file: "galeria-industria-2026-02.avif",         w: 1200, h: 900  },
];

let ok = 0, skipped = 0;

for (const { file, w, h } of RESIZE_JOBS) {
  const src = path.join(IMG_DIR, file);
  if (!existsSync(src)) { console.warn(`  ⚠ Not found: ${file}`); skipped++; continue; }

  const tmp = src + ".tmp.avif";
  const scaleFilter = `scale=${w}:${h}:force_original_aspect_ratio=decrease`;

  const cmd = [
    "ffmpeg", "-y",
    "-i", `"${src}"`,
    "-c:v", "libaom-av1",
    "-crf", "38",
    "-b:v", "0",
    "-cpu-used", "6",
    "-vf", `"${scaleFilter}"`,
    "-pix_fmt", "yuv420p",
    `"${tmp}"`,
  ].join(" ");

  process.stdout.write(`  ${file} (${w}×${h}) ... `);
  try {
    execSync(cmd, { stdio: "pipe" });
    renameSync(tmp, src); // replace in-place
    console.log("✓");
    ok++;
  } catch (err) {
    if (existsSync(tmp)) unlinkSync(tmp);
    console.error("✗");
    console.error(err.stderr?.toString().slice(-200));
    skipped++;
  }
}

console.log(`\n✅ Resized ${ok} files. Skipped: ${skipped}.`);
