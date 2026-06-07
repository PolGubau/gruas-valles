import type { ImageMetadata } from 'astro';

/**
 * Resolutor de imágenes de `src/assets/images`.
 *
 * Los JSON de `src/data` referencian las fotos con rutas tipo
 * `/assets/images/foo.avif`. Al estar en `src/assets`, Astro las procesa por su
 * pipeline (hash + optimización) y deja de servirlas en esa ruta literal. Este
 * módulo mapea cada referencia a la URL final emitida por el build.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/*.{avif,jpg,jpeg,png,webp}',
  { eager: true },
);

const byRef = new Map<string, string>(
  Object.entries(modules).map(([path, mod]) => {
    const file = path.split('/').pop() ?? path;
    return [`/assets/images/${file}`, mod.default.src];
  }),
);

/** Devuelve la URL final de una referencia; si no existe, la deja intacta. */
export function resolveImage(ref: string): string {
  return byRef.get(ref) ?? ref;
}

/** Resuelve un array de referencias (omite las que no se puedan resolver). */
export function resolveImages(refs: readonly string[] = []): string[] {
  return refs.map(resolveImage);
}
