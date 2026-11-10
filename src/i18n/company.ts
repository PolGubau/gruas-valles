import type { Lang } from "./utils";
import nosotros from "../data/nosotros.json";

const copy = {
  es: {
    home: "Inicio", about: "Nosotros", title: "Sobre nosotros", description: (years: number) => `Empresa familiar fundada en 1968 en Granollers. Más de ${years} años moviendo lo imposible con maquinaria propia y un equipo especializado.`,
    hero: "Empresa familiar de referencia en elevación desde 1968", lede: "Tres generaciones especializadas en alquiler de grúas y maniobras de gran tonelaje en Cataluña, con maquinaria propia y un compromiso firme con la seguridad.",
    stats: ["Años de experiencia", "Capacidad máxima", "Servicio de emergencia", "Instalaciones propias"], who: "Quiénes somos", years: "Más de 55 años", tagline: "moviendo lo imposible",
    origin: (founder: string) => `A finales de los años 60 nace Grúas del Vallés, fundada por ${founder}. Con la voluntad de dar servicio a una necesidad creciente en el sector, la empresa se expandió rápidamente adaptándose a la constante evolución del mercado.`,
    today: "Hoy somos una de las empresas líderes en alquiler de maquinaria de elevación en Catalunya, brindando asistencia personalizada a cada uno de nuestros clientes desde nuestras instalaciones en Granollers.", history: "Nuestra historia", present: "Actualidad", redCross: "Cruz Roja · Colaborador",
    certification: "Certificaciones y seguridad", guarantees: "Trabajamos con todas las garantías", facilities: "Instalaciones", facilityTitle: "5.000 m² de medios propios", associations: "Asociaciones", members: "Miembros activos del sector", location: "Dónde estamos", nearCircuit: "A 2 minutos del Circuit de Montmeló", access: "Accesos directos", mapTitle: "Ubicación de Grúas del Vallès en Granollers",
    facilityItems: nosotros.instalaciones, associationItems: nosotros.organismos, dataProtection: nosotros.seguridad.lopd,
  },
  ca: {
    home: "Inici", about: "Nosaltres", title: "Sobre nosaltres", description: (years: number) => `Empresa familiar fundada el 1968 a Granollers. Més de ${years} anys movent l'impossible amb maquinària pròpia i un equip especialitzat.`,
    hero: "Empresa familiar de referència en elevació des de 1968", lede: "Tres generacions especialitzades en lloguer de grues i maniobres de gran tonatge a Catalunya, amb maquinària pròpia i un compromís ferm amb la seguretat.",
    stats: ["Anys d'experiència", "Capacitat màxima", "Servei d'emergència", "Instal·lacions pròpies"], who: "Qui som", years: "Més de 55 anys", tagline: "movent l'impossible",
    origin: (founder: string) => `A finals dels anys seixanta neix Grúas del Vallés, fundada per ${founder}. Amb la voluntat de donar servei a una necessitat creixent del sector, l'empresa es va expandir ràpidament i es va adaptar a l'evolució constant del mercat.`,
    today: "Avui som una de les empreses líders en lloguer de maquinària d'elevació a Catalunya i oferim assistència personalitzada a cada client des de les nostres instal·lacions de Granollers.", history: "La nostra història", present: "Actualitat", redCross: "Creu Roja · Col·laborador",
    certification: "Certificacions i seguretat", guarantees: "Treballem amb totes les garanties", facilities: "Instal·lacions", facilityTitle: "5.000 m² de mitjans propis", associations: "Associacions", members: "Membres actius del sector", location: "On som", nearCircuit: "A 2 minuts del Circuit de Montmeló", access: "Accessos directes", mapTitle: "Ubicació de Grúas del Vallès a Granollers",
    facilityItems: ["Taller mecànic", "Magatzem de recanvis", "Dipòsit de combustible", "Túnel de rentatge", "Parc d'estacionament", "Oficines centrals", "Menjador i vestidors"], associationItems: ["ANAGRUAL (Junta Directiva autonòmica)", "TRANSCALIT (Federació Catalana de Transports de Barcelona)", "Creu Roja (soci col·laborador des de 1997)"], dataProtection: "Llei orgànica 15/1999",
  },
  en: {
    home: "Home", about: "About us", title: "About us", description: (years: number) => `Family business founded in Granollers in 1968. More than ${years} years moving the impossible with our own equipment and a specialist team.`,
    hero: "A family business specialising in lifting since 1968", lede: "Three generations specialising in crane hire and heavy lifting in Catalonia, with our own equipment and a firm commitment to safety.",
    stats: ["Years of experience", "Maximum capacity", "Emergency service", "Our own facilities"], who: "Who we are", years: "Over 55 years", tagline: "moving the impossible",
    origin: (founder: string) => `Grúas del Vallés was founded by ${founder} in the late 1960s. To meet a growing need in the sector, the company expanded quickly, adapting to a constantly evolving market.`,
    today: "Today we are one of Catalonia's leading lifting equipment hire companies, providing personal assistance to every client from our Granollers facilities.", history: "Our history", present: "Today", redCross: "Red Cross · Supporting member",
    certification: "Certifications and safety", guarantees: "Working with full safeguards", facilities: "Facilities", facilityTitle: "5,000 m² of our own facilities", associations: "Associations", members: "Active members of the sector", location: "Our location", nearCircuit: "2 minutes from Circuit de Montmeló", access: "Direct access", mapTitle: "Grúas del Vallès location in Granollers",
    facilityItems: ["Mechanical workshop", "Spare parts warehouse", "Fuel depot", "Vehicle wash", "Parking area", "Head office", "Dining and changing rooms"], associationItems: ["ANAGRUAL (regional board of directors)", "TRANSCALIT (Catalan Transport Federation of Barcelona)", "Red Cross (supporting member since 1997)"], dataProtection: "Organic Law 15/1999",
  },
};

const history: Record<Exclude<Lang, "es">, Record<string, string>> = {
  ca: {
    "1968": "Fundació. Primera grua hidràulica autopropulsada de 15 tones.",
    "1969-1970": "Adquisició de 3 unitats més; grues de fins a 30 tones; àmbit regional.",
    "1973": "El Sr. Juan Pratginestós Congost entra com a soci; grues de fins a 50 tones.",
    "1975": "Trasllat a les instal·lacions actuals (5.000 m²); parc de fins a 100 tones.",
    "1979": "Constitució com a societat anònima - GRÚAS DEL VALLÉS, S.A.",
    "1992-1999": "Registres REIC, automantenidora i transport públic.",
    "2002": "Millores administratives i de processos interns.",
    "2004": "Adaptació a la LOPD; creació del web corporatiu; cursos OGMA-A/B.",
    "2005": "Centre formador homologat OGMA per la Generalitat; titulació de recurs preventiu per a tot el personal.",
    "2006": "Consolidació dels processos interns de qualitat i seguretat.",
    "2007": "Tràmits administratius per instal·lar plaques fotovoltaiques a la coberta.",
    "2008": "Registre REA núm. 09000036812 (sector de la construcció).",
    "2009": "Posada en marxa de la central fotovoltaica.",
    "Actualidad": "Parc de grues mòbils autopropulsades de 40 a 700 tones, transports, camions grua, tràilers, góndoles, remolcs i plataformes.",
  },
  en: {
    "1968": "Founded. First 15-tonne self-propelled hydraulic crane.",
    "1969-1970": "Three more units acquired; cranes up to 30 tonnes; regional operations.",
    "1973": "Juan Pratginestós Congost becomes a partner; cranes up to 50 tonnes.",
    "1975": "Move to current facilities (5,000 m²); fleet capacity up to 100 tonnes.",
    "1979": "Incorporation as a public limited company - GRÚAS DEL VALLÉS, S.A.",
    "1992-1999": "REIC, self-maintenance and public transport registrations.",
    "2002": "Administrative and internal process improvements.",
    "2004": "LOPD compliance; corporate website created; OGMA-A/B courses.",
    "2005": "OGMA training centre approved by the Generalitat; preventive safety officer qualification for all staff.",
    "2006": "Consolidation of internal quality and safety processes.",
    "2007": "Administrative procedures for installing rooftop solar panels.",
    "2008": "REA registration no. 09000036812 (construction sector).",
    "2009": "Photovoltaic plant commissioned.",
    "Actualidad": "Fleet of 40 to 700 tonne self-propelled mobile cranes, transport vehicles, truck-mounted cranes, trailers, low-loaders and platforms.",
  },
};

export function companyCopy(lang: Lang) { return copy[lang]; }
export function companyMilestone(lang: Lang, year: string, spanish: string) {
  if (lang === "es") return spanish;
  const translated = history[lang][year];
  if (!translated) throw new Error(`Missing ${lang} history translation: ${year}`);
  return translated;
}