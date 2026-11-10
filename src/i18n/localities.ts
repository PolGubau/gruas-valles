import type { Lang } from "./utils";
import servicios from "../data/servicios.json";
import nosotros from "../data/nosotros.json";

const toPlace = (name: string) => name.startsWith("el ") ? `al ${name.slice(3)}` : `a ${name}`;
const ofPlace = (name: string) => name.startsWith("el ") ? `del ${name.slice(3)}` : `de ${name}`;
const englishPlace = (name: string) => name.replace(/^el /, "");

const copy = {
  es: {
    home: "Inicio", rental: "Alquiler de grúas", title: "Alquiler de grúas por localidad y comarca",
    description: "Alquiler de grúas móviles autopropulsadas y transportes especiales en Barcelona, Sabadell, Terrassa, Mataró, Badalona y comarcas como el Maresme, el Vallès o el Baix Llobregat. Consulta nuestra cobertura.",
    intro: "Desplazamos grúas de 40 a 700 Tn y transportes especiales a toda Cataluña desde nuestra base de Granollers. Cobertura en las principales ciudades y comarcas del área metropolitana.",
    cities: "Ciudades", municipalities: "Principales municipios", regions: "Comarcas", regionalCoverage: "Cobertura por comarca", region: "Comarca",
    craneIn: (name: string) => `Grúas en ${name}`,
    rentalIn: (name: string) => `Alquiler de grúas en ${name}`,
    detailDescription: (name: string, region: string) => `Alquiler de grúas móviles autopropulsadas de 40 a 700 Tn y transportes especiales en ${name} (${region}). +55 años de experiencia, emergencias 24/365 y estudio técnico de cada maniobra.`,
    offering: (name: string) => `Qué ofrecemos en ${name}`, solutions: "Soluciones de elevación y transporte", why: "Por qué elegirnos", reliable: (name: string) => `Tu grúa en ${name}, sin imprevistos`,
    access: "Accesos directos", accessText: (name: string, roads: string) => `Llegamos ${toPlace(name)} por ${roads} desde nuestra base de Granollers.`, emergency: "Emergencias 24/365", emergencyText: "24 horas, 365 días al año. Disponibilidad inmediata para maniobras urgentes.", study: "Estudio técnico previo", studyText: (name: string) => `Planificamos cada izado con software CAD/CAM y visita técnica antes de actuar en ${name}.`, clients: (name: string) => `Empresas que confían en nosotros cerca ${ofPlace(name)}`,
    services: servicios.principales, reasons: nosotros.por_que_elegirnos,
  },
  ca: {
    home: "Inici", rental: "Lloguer de grues", title: "Lloguer de grues per localitat i comarca",
    description: "Lloguer de grues mòbils autopropulsades i transports especials a Barcelona, Sabadell, Terrassa, Mataró, Badalona i comarques com el Maresme, el Vallès o el Baix Llobregat. Consulteu la nostra cobertura.",
    intro: "Desplacem grues de 40 a 700 tones i transports especials a tot Catalunya des de la nostra base de Granollers. Cobertura a les principals ciutats i comarques de l'àrea metropolitana.",
    cities: "Ciutats", municipalities: "Principals municipis", regions: "Comarques", regionalCoverage: "Cobertura per comarca", region: "Comarca",
    craneIn: (name: string) => `Grues ${toPlace(name)}`, rentalIn: (name: string) => `Lloguer de grues ${toPlace(name)}`,
    detailDescription: (name: string, region: string) => `Lloguer de grues mòbils autopropulsades de 40 a 700 tones i transports especials ${toPlace(name)} (${region}). Més de 55 anys d'experiència, emergències 24/365 i estudi tècnic de cada maniobra.`,
    offering: (name: string) => `Què oferim ${toPlace(name)}`, solutions: "Solucions d'elevació i transport", why: "Per què triar-nos", reliable: (name: string) => `La vostra grua ${toPlace(name)}, sense imprevistos`,
    access: "Accessos directes", accessText: (name: string, roads: string) => `Arribem ${toPlace(name)} per ${roads.replace(" y ", " i ")} des de la nostra base de Granollers.`, emergency: "Emergències 24/365", emergencyText: "24 hores, 365 dies l'any. Disponibilitat immediata per a maniobres urgents.", study: "Estudi tècnic previ", studyText: (name: string) => `Planifiquem cada elevació amb programari CAD/CAM i visita tècnica abans d'actuar ${toPlace(name)}.`, clients: (name: string) => `Empreses que confien en nosaltres a prop ${ofPlace(name)}`,
    services: ["Lloguer de grues mòbils autopropulsades (de 40 a 700 tones), camions grua autocarregants fins a 96 tones, tràilers i altres transports", "Lloguer de transports especials (càrregues que superen les mesures legals generals)", "Lloguer de carretons elevadors, toros mecànics, gats, patins i eines per a manipulació en interiors", "Lloguer d'equips de muntatge (murs, naus i infraestructures de prefabricat)", "Lloguer de cistelles homologades per elevar personal a llocs alts o de difícil accés", "Col·locació de maquinària pesant amb gats hidràulics i patins", "Muntatge d'estructures de prefabricat de formigó (naus, ponts, viaductes i edificis)", "Desmuntatge integral i trasllat d'indústries o maquinària", "Servei a tot Catalunya i zones veïnes"],
    reasons: ["Professionals amb més de 55 anys d'experiència en el sector", "Atenció al client i assessorament", "Tecnologia i maquinària pròpia d'última generació", "Equip professional jove i dinàmic en formació contínua", "Cobertura a tot Catalunya i zones veïnes", "Servei d'emergència 24/365", "Flota pròpia actualitzada i en perfecte estat tècnic", "Compromís amb el medi ambient (planta fotovoltaica des de 2008)", "Agilitat i eficàcia administrativa"],
  },
  en: {
    home: "Home", rental: "Crane hire", title: "Crane hire by town and region",
    description: "Self-propelled mobile crane hire and special transport in Barcelona, Sabadell, Terrassa, Mataró, Badalona and regions including Maresme, Vallès and Baix Llobregat. Explore our coverage.",
    intro: "From our Granollers base, we deploy 40 to 700 tonne cranes and special transport throughout Catalonia, covering the main towns and regions of the metropolitan area.",
    cities: "Cities", municipalities: "Main towns", regions: "Regions", regionalCoverage: "Regional coverage", region: "Region",
    craneIn: (name: string) => `Cranes in ${englishPlace(name)}`, rentalIn: (name: string) => `Crane hire in ${englishPlace(name)}`,
    detailDescription: (name: string, region: string) => `Self-propelled mobile crane hire from 40 to 700 tonnes and special transport in ${englishPlace(name)} (${region}). Over 55 years of experience, 24/365 emergency service and technical planning for every lift.`,
    offering: (name: string) => `What we offer in ${englishPlace(name)}`, solutions: "Lifting and transport solutions", why: "Why choose us", reliable: (name: string) => `Your crane in ${englishPlace(name)}, without surprises`,
    access: "Direct access", accessText: (name: string, roads: string) => `We reach ${englishPlace(name)} via ${roads.replace(" y ", " and ")} from our Granollers base.`, emergency: "24/365 emergencies", emergencyText: "24 hours a day, 365 days a year. Immediate availability for urgent operations.", study: "Prior technical assessment", studyText: (name: string) => `We plan each lift using CAD/CAM software and a technical site visit before working in ${englishPlace(name)}.`, clients: (name: string) => `Companies that trust us near ${englishPlace(name)}`,
    services: ["Hire of self-propelled mobile cranes (40 to 700 tonnes), truck-mounted cranes up to 96 tonnes, trailers and other transport", "Special transport hire for loads exceeding standard legal dimensions", "Hire of forklifts, mechanical trucks, jacks, skates and indoor handling equipment", "Hire of assembly equipment for walls, industrial buildings and precast infrastructure", "Hire of certified personnel baskets for work at height or in difficult-to-reach locations", "Positioning heavy machinery with hydraulic jacks and skates", "Assembly of precast concrete structures, including buildings, bridges and viaducts", "Complete dismantling and relocation of industrial facilities or machinery", "Service throughout Catalonia and neighbouring areas"],
    reasons: ["Professionals with over 55 years of sector experience", "Customer service and advice", "Our own state-of-the-art technology and equipment", "A young, dynamic team undergoing continuous training", "Coverage throughout Catalonia and neighbouring areas", "24/365 emergency service", "An up-to-date, well-maintained fleet", "Environmental commitment (photovoltaic plant since 2008)", "Efficient and agile administration"],
  },
};

const intros: Record<Exclude<Lang, "es">, Record<string, string>> = {
  ca: {
    granollers: "La nostra base central és al Polígon Industrial Congost de Granollers, a dos minuts del Circuit de Barcelona-Catalunya. Això ens permet mobilitzar grues mòbils autopropulsades de 40 a 700 tones i transports especials el mateix dia, amb temps de resposta mínims per a obres, muntatges industrials i emergències a tota la ciutat.",
    barcelona: "Operem a Barcelona ciutat amb grues mòbils de 40 a 700 tones per a muntatges en altura, climatització, esdeveniments i maniobres de difícil accés. Gestionem permisos especials de circulació i talls de carrer, amb un pla de seguretat propi per a treballs en entorns urbans densos.",
    badalona: "Servei de grues mòbils autopropulsades i transports especials a Badalona. Cobertura per a indústria, obra civil i maniobres urbanes en un dels principals municipis de l'àrea metropolitana de Barcelona, amb gestió integral de permisos i pla de seguretat per a treballs urbans.",
    sabadell: "Lloguer de grues autopropulsades, camions grua i plataformes a Sabadell. Atenem obra civil, indústria i logística amb estudi tècnic previ de cada maniobra i tramitació de permisos d'ocupació de la via pública.",
    terrassa: "Serveis d'elevació i transport especial a Terrassa per a constructores, empreses de prefabricats i muntatge d'estructures metàl·liques. Disposem de grues de gran tonatge i d'un departament d'estudis que planifica cada elevació amb programari CAD/CAM.",
    mataro: "Lloguer de grues i transports especials a Mataró i el Maresme. Cobrim muntatge de naus, col·locació de maquinària pesant amb gats hidràulics i patins, i rescats o maniobres singulars a la zona costanera.",
    maresme: "Cobrim tota la comarca del Maresme amb grues de 40 a 700 tones i transports especials. Des de Montgat fins a Blanes, atenem muntatges industrials, instal·lació de maquinària pesant i maniobres de precisió a municipis com Mataró, Vilassar de Mar, Arenys de Mar, Pineda de Mar i Calella.",
    "valles-oriental": "La nostra base al Polígon Industrial Congost de Granollers ens situa al cor del Vallès Oriental. Donem cobertura amb grues autopropulsades i transports especials a tota la comarca: Granollers, Mollet del Vallès, Parets del Vallès, la Roca del Vallès, les Franqueses del Vallès, Montmeló i tots els polígons industrials de la zona.",
    "valles-occidental": "Operem a tot el Vallès Occidental amb grues mòbils de gran tonatge per a la indústria de la comarca. Cobrim Sabadell, Terrassa, Barberà del Vallès, Cerdanyola del Vallès, Sant Cugat del Vallès, Rubí i els principals polígons de l'àrea, amb estudi tècnic i gestió de permisos inclosos.",
    "baix-llobregat": "Lloguer de grues i transports especials al Baix Llobregat. Atenem obra civil, indústria i logística a municipis com Cornellà de Llobregat, Sant Joan Despí, Molins de Rei, Martorell, Gavà i el Prat de Llobregat, amb temps de resposta mínims i pla de seguretat propi.",
  },
  en: {
    granollers: "Our headquarters are in the Congost industrial estate in Granollers, two minutes from Circuit de Barcelona-Catalunya. This allows us to deploy 40 to 700 tonne self-propelled mobile cranes and special transport on the same day, with minimal response times for construction, industrial assembly and emergencies across the city.",
    barcelona: "We operate in Barcelona with 40 to 700 tonne mobile cranes for high-level assembly, HVAC, events and difficult-access lifts. We manage special traffic permits and street closures, with our own safety plan for work in dense urban areas.",
    badalona: "Self-propelled mobile crane and special transport services in Badalona, covering industry, civil engineering and urban lifts in a major municipality of metropolitan Barcelona, with complete permit management and a safety plan for urban work.",
    sabadell: "Hire of self-propelled cranes, truck-mounted cranes and platforms in Sabadell. We serve civil engineering, industry and logistics, with prior technical planning for each lift and public-space occupancy permits.",
    terrassa: "Lifting and special transport services in Terrassa for construction, precast and steel structure assembly companies. Our heavy-duty cranes and technical department plan each lift using CAD/CAM software.",
    mataro: "Crane hire and special transport in Mataró and Maresme. We handle industrial building assembly, positioning heavy machinery with hydraulic jacks and skates, and rescues or unusual lifts in coastal areas.",
    maresme: "We cover the whole Maresme region with 40 to 700 tonne cranes and special transport. From Montgat to Blanes, we handle industrial assembly, heavy machinery installation and precision lifts in towns including Mataró, Vilassar de Mar, Arenys de Mar, Pineda de Mar and Calella.",
    "valles-oriental": "Our base in the Congost industrial estate in Granollers places us in the heart of Vallès Oriental. We provide self-propelled cranes and special transport throughout the region, including Granollers, Mollet del Vallès, Parets del Vallès, La Roca del Vallès, Les Franqueses del Vallès, Montmeló and the area's industrial estates.",
    "valles-occidental": "We operate throughout Vallès Occidental with heavy-duty mobile cranes for the region's industry. We cover Sabadell, Terrassa, Barberà del Vallès, Cerdanyola del Vallès, Sant Cugat del Vallès, Rubí and the main industrial estates, including technical assessment and permit management.",
    "baix-llobregat": "Crane hire and special transport in Baix Llobregat. We serve civil engineering, industry and logistics in towns including Cornellà de Llobregat, Sant Joan Despí, Molins de Rei, Martorell, Gavà and El Prat de Llobregat, with minimal response times and our own safety plan.",
  },
};

export function localitiesCopy(lang: Lang) { return copy[lang]; }
export function localityIntro(lang: Lang, slug: string, spanish: string) {
  if (lang === "es") return spanish;
  const translated = intros[lang][slug];
  if (!translated) throw new Error(`Missing ${lang} locality translation: ${slug}`);
  return translated;
}