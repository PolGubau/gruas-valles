import type { Lang } from "./utils";
import { blogCa } from "./blog.ca";
import { blogEn } from "./blog.en";

const ui = {
  es: { home: "Inicio", news: "Noticias", title: "Noticias y actualidad", heading: "Noticias y trabajos destacados", eyebrow: "Actualidad", description: "Últimas incorporaciones a nuestra flota, colaboraciones y trabajos destacados de Grúas del Vallès.", intro: "Nuevas incorporaciones a la flota, colaboraciones y proyectos singulares en los que hemos participado.", article: "Noticia", documents: "Documentación", quote: "Solicitar presupuesto", all: "Ver todas las noticias" },
  ca: { home: "Inici", news: "Notícies", title: "Notícies i actualitat", heading: "Notícies i treballs destacats", eyebrow: "Actualitat", description: "Últimes incorporacions a la nostra flota, col·laboracions i treballs destacats de Grúas del Vallès.", intro: "Noves incorporacions a la flota, col·laboracions i projectes singulars en què hem participat.", article: "Notícia", documents: "Documentació", quote: "Sol·licitar pressupost", all: "Veure totes les notícies" },
  en: { home: "Home", news: "News", title: "News and updates", heading: "News and featured projects", eyebrow: "Latest news", description: "The latest fleet additions, collaborations and featured projects from Grúas del Vallès.", intro: "New additions to the fleet, collaborations and distinctive projects we have taken part in.", article: "News", documents: "Documents", quote: "Request a quote", all: "View all news" },
};

/** Traducción de una noticia; `cuerpo` sustituye al Markdown fuente si existe. */
export type BlogTranslation = { titulo: string; resumen: string; cuerpo?: string };

const translations: Record<Exclude<Lang, "es">, Record<string, BlogTranslation>> = {
  ca: blogCa,
  en: blogEn,
};

export function blogCopy(lang: Lang) {
  return ui[lang];
}

const missing = new Set<string>();

/**
 * Traducción de una noticia por slug. El castellano es el idioma fuente
 * (`undefined`); en el resto de idiomas, si falta la traducción se devuelve
 * `undefined` para que la página sirva el contenido fuente en lugar de
 * romper el build, avisando una única vez por slug en el log.
 */
export function translatedPost(lang: Lang, slug: string): BlogTranslation | undefined {
  if (lang === "es") return undefined;
  const translation = translations[lang][slug];
  if (!translation) {
    const key = `${lang}:${slug}`;
    if (!missing.has(key)) {
      missing.add(key);
      console.warn(
        `[i18n] Falta traducción de la noticia en "${lang}": ${slug} (se sirve el contenido fuente)`,
      );
    }
    return undefined;
  }
  return translation;
}