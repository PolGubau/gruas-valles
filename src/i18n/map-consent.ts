import type { Lang } from "./utils";

const copy = {
  es: {
    title: "Mapa de Google Maps",
    description: "Para mostrar el mapa, Google puede recibir datos como tu dirección IP y utilizar cookies para personalización, medición o publicidad. Solo lo cargaremos si lo aceptas.",
    policy: "Política de cookies", google: "Privacidad de Google", allow: "Aceptar y cargar mapa", deny: "Rechazar mapa", external: "Abrir Google Maps en otra página",
    revoke: "Retirar consentimiento de Google Maps", allowed: "Mapa de Google autorizado.", denied: "Mapa de Google rechazado; puedes cambiar tu elección aquí.", revoked: "Consentimiento de Google Maps retirado. Las cookies ya instaladas se eliminan desde el navegador.",
  },
  ca: {
    title: "Mapa de Google Maps",
    description: "Per mostrar el mapa, Google pot rebre dades com la teva adreça IP i utilitzar galetes per a personalització, mesurament o publicitat. Només el carregarem si ho acceptes.",
    policy: "Política de galetes", google: "Privacitat de Google", allow: "Acceptar i carregar el mapa", deny: "Rebutjar el mapa", external: "Obrir Google Maps en una altra pàgina",
    revoke: "Retirar el consentiment de Google Maps", allowed: "Mapa de Google autoritzat.", denied: "Mapa de Google rebutjat; pots canviar la teva elecció aquí.", revoked: "Consentiment de Google Maps retirat. Les galetes ja instal·lades s'eliminen des del navegador.",
  },
  en: {
    title: "Google Maps",
    description: "To display the map, Google may receive data such as your IP address and use cookies for personalisation, measurement or advertising. We will only load it if you agree.",
    policy: "Cookie policy", google: "Google privacy", allow: "Accept and load map", deny: "Reject map", external: "Open Google Maps on another page",
    revoke: "Withdraw Google Maps consent", allowed: "Google map enabled.", denied: "Google map rejected; you can change your choice here.", revoked: "Google Maps consent withdrawn. Previously installed cookies can be removed in your browser.",
  },
};

export function mapConsentCopy(lang: Lang) { return copy[lang]; }