/**
 * Utilidades de i18n para uso en componentes `.astro`.
 *
 * Uso típico en el frontmatter de un componente:
 *
 *   import { getLangFromUrl, useTranslations, useTranslatedPath } from '@i18n/utils';
 *   const lang = getLangFromUrl(Astro.url);
 *   const t = useTranslations(lang);
 *   const localizePath = useTranslatedPath(lang);
 *   // t('nav.flota') · localizePath('/servicios')
 */
import { defaultLang, showDefaultLang, ui } from '@i18n/ui';

export type Lang = keyof typeof ui;
export type UiKey = keyof (typeof ui)[typeof defaultLang];

/** Idioma inferido a partir del primer segmento de la URL. */
export function getLangFromUrl(url: URL): Lang {
  const [, segment] = url.pathname.split('/');
  if (segment in ui) return segment as Lang;
  return defaultLang;
}

/**
 * Devuelve la ruta actual sin el prefijo de idioma.
 * `/en/servicios` → `/servicios` · `/servicios` → `/servicios` · `/en/` → `/`
 */
export function getRouteFromUrl(url: URL): string {
  const parts = url.pathname.split('/');
  if (parts[1] in ui) parts.splice(1, 1);
  const path = parts.join('/');
  return path === '' ? '/' : path;
}

/**
 * Traductor con fallback al idioma por defecto para claves aún sin traducir.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    const dict = ui[lang] as Partial<Record<UiKey, string>>;
    return dict[key] ?? ui[defaultLang][key];
  };
}

/**
 * Genera una ruta con el prefijo de idioma adecuado.
 * El idioma por defecto no lleva prefijo salvo que `showDefaultLang` sea true.
 */
export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, targetLang: Lang = lang): string {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return !showDefaultLang && targetLang === defaultLang
      ? normalized
      : `/${targetLang}${normalized}`;
  };
}
