const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-404-lang]"));
const choices = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-404-choice]"));
const selector = document.querySelector<HTMLElement>("[data-404-languages]");
const supported = ["es", "ca", "en"] as const;
type Language = (typeof supported)[number];

function language(value: string | null | undefined): Language | undefined {
  const code = value?.toLowerCase().split(/[-_]/)[0];
  return supported.find((item) => item === code);
}

function show(selected: Language) {
  for (const section of sections) {
    section.hidden = section.dataset["404Lang"] !== selected;
    if (!section.hidden && section.dataset["404Title"]) document.title = section.dataset["404Title"];
  }
  for (const choice of choices) choice.setAttribute("aria-pressed", String(choice.dataset["404Choice"] === selected));
  document.documentElement.lang = selected;
}

let saved: Language | undefined;
try { saved = language(localStorage.getItem("gv-language")); } catch { /* Storage may be blocked. */ }
const prefix = language(window.location.pathname.split("/")[1]);
const explicit = language(new URLSearchParams(window.location.search).get("lang"));
const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
show(prefix ?? explicit ?? saved ?? browserLanguages.map(language).find(Boolean) ?? "es");
if (selector) selector.hidden = false;

for (const choice of choices) {
  choice.addEventListener("click", () => {
    const selected = language(choice.dataset["404Choice"]);
    if (!selected) return;
    try { localStorage.setItem("gv-language", selected); } catch { /* Selection still applies on this page. */ }
    show(selected);
  });
}