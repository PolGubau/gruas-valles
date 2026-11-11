import type { Lang } from "./utils";

const copy = {
  es: {
    home: "Inicio", fleet: "Flota", title: "Flota completa de grúas", heading: "Nuestra Flota", description: "Catálogo completo de nuestra flota: grúas móviles autopropulsadas, de gran tonelaje, de construcción y camiones grúa.", intro: "Maquinaria propia y actualizada. Filtre por categoría para encontrar la grúa que necesita.", filter: "Filtrar flota por categoría", all: "Todas", sort: "Ordenar por capacidad dentro de cada grupo", sortLabels: ["Capacidad", "Mayor → Menor", "Menor → Mayor"], new: "Nueva", boom: "Pluma", axles: "Ejes", jib: "Plumín abat.", sheet: "Ver ficha", contactTeam: "Contactar con el equipo", back: "Volver a la flota",
    categories: ["Grúas gran tonelaje", "Grúas móviles autopropulsadas", "Grúas para Construcción", "Camiones y Vehículos auxiliares"],
    specs: ["Capacidad máxima", "Capacidad", "Pluma telescópica", "Pluma horizontal", "Pluma", "Pluma con jib", "Pluma + jib", "Plumín", "Plumín fijo", "Plumín fijo (hasta)", "Plumín abatible", "Plumín abatible (hasta)", "Plumín angulado", "Plumín angulable", "Plumín abatible", "Doble jib", "Altura máxima", "Peso en punta", "Ejes", "Ejes motrices", "Tara", "MMA", "Alto", "Ancho", "Largo", "Camión", "Grúa", "Modelo de máquina"],
    notes: ["El mayor vehículo de la flota.", "El modelo de 6 ejes más potente del mercado.", "Cabina telescópica con elevación hasta 8 m", "Cesta homologada", "Dispone de cabrestante", "Equipada con runner", "Vehículo auxiliar para descarga de equipos pesados y material diverso"],
  },
  ca: {
    home: "Inici", fleet: "Flota", title: "Flota completa de grues", heading: "La nostra flota", description: "Catàleg complet de la nostra flota: grues mòbils autopropulsades, de gran tonatge, per a construcció i camions grua.", intro: "Maquinària pròpia i actualitzada. Filtreu per categoria per trobar la grua que necessiteu.", filter: "Filtrar la flota per categoria", all: "Totes", sort: "Ordenar per capacitat dins de cada grup", sortLabels: ["Capacitat", "Major → Menor", "Menor → Major"], new: "Nova", boom: "Ploma", axles: "Eixos", jib: "Plomí abatible", sheet: "Veure fitxa", contactTeam: "Contactar amb l'equip", back: "Tornar a la flota",
    categories: ["Grues de gran tonatge", "Grues mòbils autopropulsades", "Grues per a construcció", "Camions i vehicles auxiliars"],
    specs: ["Capacitat màxima", "Capacitat", "Ploma telescòpica", "Ploma horitzontal", "Ploma", "Ploma amb jib", "Ploma + jib", "Plomí", "Plomí fix", "Plomí fix (fins a)", "Plomí abatible", "Plomí abatible (fins a)", "Plomí angulat", "Plomí angulable", "Plomí abatible", "Doble jib", "Altura màxima", "Pes a la punta", "Eixos", "Eixos motrius", "Tara", "MMA", "Altura", "Amplada", "Llargada", "Camió", "Grua", "Model de màquina"],
    notes: ["El vehicle més gran de la flota.", "El model de 6 eixos més potent del mercat.", "Cabina telescòpica amb elevació fins a 8 m", "Cistella homologada", "Disposa de cabrestant", "Equipada amb runner", "Vehicle auxiliar per a la descàrrega d'equips pesants i material divers"],
  },
  en: {
    home: "Home", fleet: "Fleet", title: "Complete crane fleet", heading: "Our fleet", description: "Our complete fleet catalogue: self-propelled mobile, heavy-duty and construction cranes and truck-mounted cranes.", intro: "Our own up-to-date equipment. Filter by category to find the crane you need.", filter: "Filter fleet by category", all: "All", sort: "Sort by capacity within each group", sortLabels: ["Capacity", "Highest → Lowest", "Lowest → Highest"], new: "New", boom: "Boom", axles: "Axles", jib: "Luffing jib", sheet: "View specifications", contactTeam: "Contact our team", back: "Back to fleet",
    categories: ["Heavy-duty cranes", "Self-propelled mobile cranes", "Construction cranes", "Trucks and support vehicles"],
    specs: ["Maximum capacity", "Capacity", "Telescopic boom", "Horizontal boom", "Boom", "Boom with jib", "Boom + jib", "Jib", "Fixed jib", "Fixed jib (up to)", "Luffing jib", "Luffing jib (up to)", "Angled jib", "Adjustable jib", "Luffing jib", "Double jib", "Maximum height", "Tip load", "Axles", "Driven axles", "Unladen weight", "Maximum authorised mass", "Height", "Width", "Length", "Truck", "Crane", "Machine model"],
    notes: ["The largest vehicle in the fleet.", "The most powerful 6-axle model on the market.", "Telescopic cab with elevation up to 8 m", "Approved personnel basket", "Equipped with a winch", "Equipped with a runner", "Support vehicle for unloading heavy equipment and other materials"],
  },
};

export function fleetCopy(lang: Lang) { return copy[lang]; }

export function isAuxiliaryFleetCategory(category: string) {
  return category === copy.es.categories[3];
}

function translateValue(lang: Lang, value: string, field: "categories" | "notes") {
  const index = copy.es[field].indexOf(value);
  if (index < 0) throw new Error(`Missing fleet ${field} translation: ${value}`);
  return copy[lang][field][index];
}

export function fleetCategory(lang: Lang, category: string) { return translateValue(lang, category, "categories"); }
export function fleetNote(lang: Lang, note: string) { return translateValue(lang, note, "notes"); }