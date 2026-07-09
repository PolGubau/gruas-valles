/**
 * Configuración de idiomas y diccionarios de traducción.
 *
 * - `languages`: idiomas soportados (código → nombre nativo para la UI).
 * - `defaultLang`: idioma por defecto; se sirve sin prefijo en la URL.
 * - `showDefaultLang`: si el idioma por defecto lleva prefijo (/es/). false = URLs limpias.
 * - `ui`: diccionario de strings por idioma. El idioma por defecto (`es`) define
 *   el conjunto completo de claves; `ca` y `en` pueden ser parciales y harán
 *   fallback automático al español (ver `useTranslations` en ./utils).
 *
 * Para traducir: rellena las mismas claves de `ui.es` dentro de `ui.ca` / `ui.en`.
 */

export const languages = {
	es: "Español",
	ca: "Català",
	en: "English",
} as const;

export const defaultLang = "es";

export const showDefaultLang = false;

export const ui = {
	es: {
		// Navegación principal
		"nav.flota": "Flota",
		"nav.servicios": "Servicios",
		"nav.nosotros": "Nosotros",
		"nav.blog": "Noticias",
		// Acciones
		"cta.presupuesto": "Solicitar presupuesto",
		"cta.presupuestoCorto": "Presupuesto",
		"nav.langLabel": "Seleccionar idioma",
		// Accesibilidad / genéricos
		"a11y.openMenu": "Abrir menú",
		"a11y.closeMenu": "Cerrar menú",
		"a11y.home": "Grúas del Vallès - inicio",
		"a11y.skipToContent": "Saltar al contenido",
	},
	ca: {
		// TODO: traducir al catalán. Las claves ausentes usan el español.
	},
	en: {
		// TODO: translate to English. Missing keys fall back to Spanish.
	},
} as const;
