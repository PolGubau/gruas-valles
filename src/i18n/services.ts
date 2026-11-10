import servicios from "../data/servicios.json";
import { homeCopy } from "./home";
import type { Lang } from "./utils";

const translations = {
  es: {
    title: "Servicios de elevación y transporte", description: "Alquiler de grúas, transportes especiales, montaje de prefabricados, departamento de estudios y tramitación de permisos. Soluciones integrales de elevación en Cataluña.",
    heading: "Soluciones integrales de elevación y transporte", intro: "Desde el estudio técnico hasta la ejecución de la maniobra, cubrimos todo el proceso con maquinaria propia y un equipo especializado.",
    home: "Inicio", services: "Servicios", process: "Cómo trabajamos", engineering: "Ingeniería antes de cada maniobra",
    steps: [{ titulo: "Estudio técnico", texto: "Analizamos la carga, el emplazamiento y los accesos con software CAD/CAM y planos 3D." }, { titulo: "Planificación", texto: "Definimos la grúa, los contrapesos y la configuración óptima para la maniobra." }, { titulo: "Permisos y seguridad", texto: "Tramitamos permisos, seguros y presentamos el Plan de Seguridad." }, { titulo: "Ejecución", texto: "Dirigimos el montaje con técnicos y operarios especializados." }],
    paperwork: "Trámites y gestiones", paperworkTitle: "Nos ocupamos del papeleo", procedures: servicios.tramites,
    support: "Asesoramiento y soporte", supportTitle: "Acompañamiento técnico", supportLabels: ["Asesoramiento técnico", "Atención al cliente", "Servicio de emergencia"], supportText: Object.values(servicios.asesoramiento),
    details: "Detalles del servicio", didYouKnow: "¿Sabía que...?", explanation: "En Grúas del Vallès no solo alquilamos maquinaria. Aportamos el valor añadido de nuestra experiencia técnica. Cada maniobra se planifica para maximizar la seguridad y minimizar los tiempos de ejecución, asegurando el éxito de su proyecto.",
    certification: "Certificación REA · REIC", fleet: "Maquinaria destacada para este servicio", sheet: "Ver ficha", experience: "Especialistas en elevación y transporte con más de 55 años de experiencia.",
    items: Object.fromEntries(servicios.categorias.map((cat) => [cat.slug, cat.detalles])),
  },
  ca: {
    title: "Serveis d'elevació i transport", description: "Lloguer de grues, transports especials, muntatge de prefabricats, departament d'estudis i tramitació de permisos. Solucions integrals d'elevació a Catalunya.",
    heading: "Solucions integrals d'elevació i transport", intro: "Des de l'estudi tècnic fins a l'execució de la maniobra, cobrim tot el procés amb maquinària pròpia i un equip especialitzat.",
    home: "Inici", services: "Serveis", process: "Com treballem", engineering: "Enginyeria abans de cada maniobra",
    steps: [{ titulo: "Estudi tècnic", texto: "Analitzem la càrrega, l'emplaçament i els accessos amb programari CAD/CAM i plànols 3D." }, { titulo: "Planificació", texto: "Definim la grua, els contrapesos i la configuració òptima per a la maniobra." }, { titulo: "Permisos i seguretat", texto: "Tramitem permisos i assegurances i presentem el Pla de Seguretat." }, { titulo: "Execució", texto: "Dirigim el muntatge amb tècnics i operaris especialitzats." }],
    paperwork: "Tràmits i gestions", paperworkTitle: "Ens ocupem dels tràmits", procedures: ["Tramitació de permisos urbans (ocupació de via pública / tall de carrers) i permisos especials de circulació", "Tramitació d'assegurances i reassegurances", "Presentació del Pla de Seguretat i informes personalitzats de riscos", "Direcció i execució del muntatge amb tècnics i operaris especialitzats"],
    support: "Assessorament i suport", supportTitle: "Acompanyament tècnic", supportLabels: ["Assessorament tècnic", "Atenció al client", "Servei d'emergència"], supportText: ["Estudis i plànols de maniobres per determinar la maquinària adequada i analitzar possibles incidències.", "Consultes i pressupostos sense compromís.", "24 hores, 365 dies l'any. Telèfons: 669 29 69 54 i 669 29 69 49"],
    details: "Detalls del servei", didYouKnow: "Sabíeu que...?", explanation: "A Grúas del Vallès no només lloguem maquinària. Aportem el valor afegit de la nostra experiència tècnica. Planifiquem cada maniobra per maximitzar la seguretat i minimitzar els temps d'execució, assegurant l'èxit del vostre projecte.",
    certification: "Certificació REA · REIC", fleet: "Maquinària destacada per a aquest servei", sheet: "Veure fitxa", experience: "Especialistes en elevació i transport amb més de 55 anys d'experiència.",
    items: {
      "gruas-moviles-autopropulsadas": ["Capacitats de 40 a 700 tones", "Maquinària d'última generació (Liebherr, Grove, Demag)", "Operaris altament qualificats i certificats", "Servei d'emergència 24/7 disponible"],
      "transportes-especiales": ["Gòndoles i plataformes de gran capacitat", "Gestió de permisos especials de circulació", "Servei de cotxe pilot propi", "Transport de maquinària, dipòsits i estructures"],
      "montaje-estructuras-prefabricado": ["Muntatge integral de naus industrials", "Col·locació de jàsseres, pilars i panells", "Especialistes en obra civil (viaductes i passos elevats)", "Seguretat garantida amb plans de prevenció específics"],
      "ingenieria-de-maniobra": ["Estudis de maniobra en 2D i 3D", "Simulació de càrregues i radis d'acció", "Visites tècniques preventives a l'emplaçament", "Informes de riscos i plans de seguretat personalitzats"],
    },
  },
  en: {
    title: "Lifting and transport services", description: "Crane hire, special transport, precast assembly, engineering and permit management. Complete lifting solutions in Catalonia.",
    heading: "Complete lifting and transport solutions", intro: "From technical assessment to execution, we cover the entire operation with our own equipment and a specialist team.",
    home: "Home", services: "Services", process: "How we work", engineering: "Engineering before every lift",
    steps: [{ titulo: "Technical assessment", texto: "We assess the load, site and access using CAD/CAM software and 3D plans." }, { titulo: "Planning", texto: "We determine the crane, counterweights and optimal configuration for the lift." }, { titulo: "Permits and safety", texto: "We arrange permits and insurance and submit the safety plan." }, { titulo: "Execution", texto: "Our specialist engineers and operators direct the assembly." }],
    paperwork: "Permits and paperwork", paperworkTitle: "We handle the paperwork", procedures: ["Applications for urban permits (public space occupation / road closures) and special transport permits", "Insurance and reinsurance arrangements", "Submission of the safety plan and tailored risk assessments", "Direction and execution of assembly by specialist engineers and operators"],
    support: "Advice and support", supportTitle: "Technical support", supportLabels: ["Technical advice", "Customer service", "Emergency service"], supportText: ["Lift assessments and plans to determine the right machinery and assess potential incidents.", "Enquiries and no-obligation quotes.", "24 hours a day, 365 days a year. Telephone: 669 29 69 54 and 669 29 69 49"],
    details: "Service details", didYouKnow: "Did you know?", explanation: "At Grúas del Vallès we offer more than equipment hire: we bring the added value of technical experience. Every lift is planned to maximise safety and minimise execution time, helping ensure your project's success.",
    certification: "REA · REIC certification", fleet: "Featured equipment for this service", sheet: "View specifications", experience: "Lifting and transport specialists with over 55 years of experience.",
    items: {
      "gruas-moviles-autopropulsadas": ["Capacities from 40 to 700 tonnes", "Modern equipment (Liebherr, Grove, Demag)", "Highly qualified and certified operators", "24/7 emergency service available"],
      "transportes-especiales": ["High-capacity low loaders and platforms", "Special transport permit management", "Our own escort vehicles", "Transport of machinery, tanks and structures"],
      "montaje-estructuras-prefabricado": ["Complete assembly of industrial buildings", "Installation of beams, columns and panels", "Civil engineering specialists (viaducts and overpasses)", "Safety supported by specific prevention plans"],
      "ingenieria-de-maniobra": ["2D and 3D lift studies", "Load and working radius simulations", "Preventive technical site visits", "Tailored risk assessments and safety plans"],
    },
  },
};

export function servicesCopy(lang: Lang) {
  return translations[lang];
}

export function serviceCategory(lang: Lang, slug: string) {
  const original = servicios.categorias.find((cat) => cat.slug === slug);
  const details = (translations[lang].items as Record<string, string[]>)[slug];
  const category = (homeCopy(lang).categories as Record<string, { titulo: string; descripcion: string }>)[slug];
  if (!original || !details || !category) throw new Error(`Missing ${lang} service translation: ${slug}`);
  return { ...original, ...(lang === "es" ? {} : category), detalles: details };
}