const storageKey = "gv-map-consent";
const maxAge = 180 * 24 * 60 * 60 * 1000;
type Choice = { allowed: boolean; timestamp: number };

function readChoice(): Choice | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    let choice: unknown;
    try { choice = JSON.parse(raw); } catch { localStorage.removeItem(storageKey); return null; }
    if (!choice || typeof choice !== "object") { localStorage.removeItem(storageKey); return null; }
    const candidate = choice as Partial<Choice>;
    if (typeof candidate.allowed === "boolean" && typeof candidate.timestamp === "number" && Number.isFinite(candidate.timestamp) && candidate.timestamp <= Date.now() && Date.now() - candidate.timestamp < maxAge) return candidate as Choice;
    localStorage.removeItem(storageKey);
  } catch { /* Treat blocked or invalid storage as no consent. */ }
  return null;
}

let choice = readChoice();
let expiryTimer: ReturnType<typeof setTimeout> | undefined;
const embeds = Array.from(document.querySelectorAll<HTMLElement>("[data-map-embed]"));
const revokeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-map-revoke]"));

function render() {
  for (const embed of embeds) {
    const frame = embed.querySelector<HTMLIFrameElement>("iframe[data-map-src]");
    const placeholder = embed.querySelector<HTMLElement>("[data-map-placeholder]");
    const controls = embed.querySelector<HTMLElement>("[data-map-controls]");
    const status = embed.querySelector<HTMLElement>("[data-map-status]");
    if (controls) controls.hidden = false;
    if (frame) {
      if (choice?.allowed && frame.dataset.mapSrc) {
        if (frame.getAttribute("src") !== frame.dataset.mapSrc) frame.setAttribute("src", frame.dataset.mapSrc);
      }
      else frame.removeAttribute("src");
      frame.hidden = !choice?.allowed;
    }
    if (placeholder) placeholder.hidden = !!choice?.allowed;
    if (status) {
      status.hidden = choice?.allowed !== false;
      status.textContent = choice?.allowed === false ? status.dataset.denied ?? "" : "";
    }
  }
  for (const button of revokeButtons) button.hidden = !choice?.allowed;
  if (expiryTimer) clearTimeout(expiryTimer);
  if (choice) expiryTimer = setTimeout(() => { choice = readChoice(); render(); }, Math.min(2_147_483_647, Math.max(0, choice.timestamp + maxAge - Date.now())));
}

function setChoice(allowed: boolean) {
  choice = { allowed, timestamp: Date.now() };
  try { localStorage.setItem(storageKey, JSON.stringify(choice)); } catch {
    // Do not leave an older acceptance behind if persisting a rejection fails.
    try { localStorage.removeItem(storageKey); } catch { /* Storage is unavailable. */ }
  }
  render();
}

for (const embed of embeds) {
  embed.querySelector<HTMLButtonElement>("[data-map-allow]")?.addEventListener("click", () => setChoice(true));
  embed.querySelector<HTMLButtonElement>("[data-map-deny]")?.addEventListener("click", () => setChoice(false));
}
for (const button of revokeButtons) button.addEventListener("click", () => {
  setChoice(false);
  const status = document.querySelector<HTMLElement>("[data-map-revoked-status]");
  if (status) { status.textContent = status.dataset.message ?? ""; status.hidden = false; status.focus(); }
});
window.addEventListener("storage", (event) => { if (event.key === storageKey || event.key === null) { choice = readChoice(); render(); } });
render();