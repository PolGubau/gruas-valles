/**
 * Convierte un texto en un slug determinista y seguro para URLs.
 * - Normaliza acentos (NFD) y elimina diacríticos.
 * - Pasa a minúsculas y reemplaza cualquier carácter no alfanumérico por «-».
 * - Colapsa guiones repetidos y recorta los de los extremos.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
