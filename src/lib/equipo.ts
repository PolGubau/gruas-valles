import contacto from "../data/contacto.json";

export interface Persona {
  area: string;
  nombre: string;
  telefono: string;
  email: string;
  slug: string;
}

/** "Manel Moya" → "manel-moya" (sin tildes ni caracteres no ASCII). */
export function slugify(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Equipo de contacto con slug único derivado del nombre. */
export const equipo: Persona[] = contacto.contactos.map((p) => ({
  ...p,
  slug: slugify(p.nombre),
}));

/** href telefónico con prefijo internacional: "669 296 949" → "tel:+34669296949". */
export function telHref(telefono: string): string {
  return `tel:+34${telefono.replace(/\s/g, "")}`;
}

/** Escapa separadores y saltos de línea según RFC 2426 (vCard 3.0). */
function vesc(value: string): string {
  return value
    .replace(/([,;\\])/g, "\\$1")
    .replace(/\r?\n/g, "\\n");
}

/** vCard 3.0 para el botón "Guardar contacto" de la tarjeta virtual. */
export function buildVCard(p: Persona): string {
  const tel = `+34${p.telefono.replace(/\s/g, "")}`;
  const [nombre, ...apellidos] = p.nombre.split(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N;CHARSET=UTF-8:${vesc(apellidos.join(" "))};${vesc(nombre)};;;`,
    `FN;CHARSET=UTF-8:${vesc(p.nombre)}`,
    `ORG;CHARSET=UTF-8:${vesc(contacto.empresa)}`,
    `TITLE;CHARSET=UTF-8:${vesc(p.area)}`,
    `TEL;TYPE=WORK,VOICE:${tel}`,
    `EMAIL;TYPE=WORK:${p.email}`,
    `ADR;CHARSET=UTF-8;TYPE=WORK:;;${vesc(contacto.direccion)};;;;`,
    `URL:${contacto.web}`,
    "END:VCARD",
  ];
  return `${lines.join("\r\n")}\r\n`;
}
