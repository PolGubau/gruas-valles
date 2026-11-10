// A route belongs here only when its content is available in every locale.
const translatedRoutes = new Set([
  "/", "/contacto", "/servicios", "/flota",
  "/servicios/gruas-moviles-autopropulsadas",
  "/servicios/transportes-especiales",
  "/servicios/montaje-estructuras-prefabricado",
  "/servicios/ingenieria-de-maniobra",
]);

export function hasTranslations(path) {
  const route = path.replace(/\/$/, "") || "/";
  return translatedRoutes.has(route) || /^\/flota\/[^/]+$/.test(route);
}