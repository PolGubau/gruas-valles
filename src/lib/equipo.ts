import contacto from "../data/contacto.json";

export interface Persona {
  area: string;
  nombre: string;
  telefono: string;
  email: string;
  slug: string;
}

/** Las rutas son explícitas para que cambiar un nombre no invalide la tarjeta. */
export const equipo: Persona[] = contacto.contactos;
if (new Set(equipo.map((p) => p.slug)).size !== equipo.length || equipo.some((p) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug))) {
  throw new Error("Los contactos deben tener un slug válido y único");
}

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
export function buildVCard(p: Persona, area: string): string {
  const tel = `+34${p.telefono.replace(/\s/g, "")}`;
  const [nombre, ...apellidos] = p.nombre.split(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${vesc(apellidos.join(" "))};${vesc(nombre)};;;`,
    `FN:${vesc(p.nombre)}`,
    `ORG:${vesc(contacto.empresa)}`,
    `TITLE:${vesc(area)}`,
    `TEL;TYPE=WORK,VOICE:${tel}`,
    `EMAIL;TYPE=WORK:${vesc(p.email)}`,
    `ADR;TYPE=WORK:;;${vesc(contacto.direccion)};;;;`,
    `URL:${contacto.web}`,
    "END:VCARD",
  ];
  const encoder = new TextEncoder();
  const folded = lines.map((line) => {
    let result = "";
    let bytes = 0;
    for (const char of line) {
      const size = encoder.encode(char).length;
      if (bytes + size > 75) {
        result += "\r\n ";
        bytes = 1;
      }
      result += char;
      bytes += size;
    }
    return result;
  });
  return `${folded.join("\r\n")}\r\n`;
}
