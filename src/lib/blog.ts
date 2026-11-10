import type { Lang } from "../i18n/utils";

export function compareBlogDates(
  a: { fecha: Date; slug: string },
  b: { fecha: Date; slug: string },
) {
  return b.fecha.getTime() - a.fecha.getTime() || a.slug.localeCompare(b.slug, "es");
}

export function formatBlogDate(fecha: Date, lang: Lang) {
  return new Intl.DateTimeFormat(lang, {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(fecha);
}