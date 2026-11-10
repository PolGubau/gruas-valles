const storageKey = "gv-language";
const supported = ["es", "ca", "en"] as const;
type Language = (typeof supported)[number];

function language(value: string | null | undefined): Language | undefined {
  const code = value?.toLowerCase().split(/[-_]/)[0];
  return supported.find((item) => item === code);
}

// An explicit choice wins over the browser preference on subsequent visits.
document.addEventListener("click", (event) => {
  const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[data-language]");
  const selected = language(link?.dataset.language);
  if (selected) {
    try { localStorage.setItem(storageKey, selected); } catch { /* Storage may be blocked. */ }
  }
});

if (window.location.pathname === "/" || /^\/contacto\/?$/.test(window.location.pathname)) {
  const explicit = language(new URLSearchParams(window.location.search).get("lang"));
  let saved: Language | undefined;
  try { saved = language(localStorage.getItem(storageKey)); } catch { /* Use browser preference. */ }
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const preferred = explicit ?? saved ?? browserLanguages.map(language).find(Boolean) ?? "es";
  if (explicit) {
    try { localStorage.setItem(storageKey, explicit); } catch { /* The query still preserves the choice. */ }
  }
  if (preferred !== "es") {
    window.location.replace(`/${preferred}${window.location.pathname}${window.location.search}${window.location.hash}`);
  }
}