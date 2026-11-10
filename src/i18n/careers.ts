import type { Lang } from "./utils";

const copy = {
  es: {
    title: "Trabaja con nosotros", description: "Únete al equipo de Grúas del Vallès. Empresa familiar con más de 55 años de experiencia en elevación industrial. Buscamos operadores, mecánicos y técnicos comprometidos con la seguridad.",
    home: "Inicio", hero: "Forma parte de nuestro equipo", lede: "En Grúas del Vallès llevamos más de 55 años creciendo gracias a las personas. Si te apasiona la maquinaria pesada y la seguridad industrial, queremos conocerte.",
    profiles: "Perfiles que buscamos", profilesTitle: "Puestos habituales en nuestra empresa", profilesIntro: "Tanto si tienes experiencia en el sector como si estás empezando, envíanos tu candidatura. Valoramos la actitud, la responsabilidad y el trabajo en equipo.",
    jobs: [
      { titulo: "Operador de grúa", descripcion: "Operación de grúas móviles autopropulsadas de gran tonelaje. Se requiere permiso OGMA y experiencia mínima de 2 años.", requisitos: ["Permiso OGMA A/B", "Carnet C/E", "Experiencia en obra"] },
      { titulo: "Mecánico de maquinaria pesada", descripcion: "Mantenimiento y reparación de flota propia. Taller dotado de herramienta de última generación y almacén de recambios.", requisitos: ["FP Mecánica Industrial", "Hidráulica y electrónica", "Trabajo en equipo"] },
      { titulo: "Técnico de maniobras", descripcion: "Planificación y coordinación de maniobras especiales con estudio previo CAD/CAM. Perfil técnico con orientación a la seguridad.", requisitos: ["Recurso Preventivo", "Lectura de planos", "AutoCAD valorable"] },
      { titulo: "Administrativo/a", descripcion: "Gestión de presupuestos, coordinación de equipos y trámites de permisos con organismos públicos.", requisitos: ["Ciclo Administrativo o similar", "Ofimática avanzada", "Catalán y castellano"] },
    ],
    why: "¿Por qué elegirnos?", offer: "Lo que ofrecemos", benefits: ["Contrato estable desde el primer día", "Formación continua y homologada", "Equipo joven y ambiente familiar", "Equipos de protección de primer nivel", "Base en Granollers, accesos N-152 y AP-7", "Crecimiento dentro de la empresa"],
    spontaneous: "Candidatura espontánea", spontaneousTitle: "¿No ves tu perfil? Escríbenos igualmente", spontaneousText: "Guardamos todas las candidaturas y las tenemos en cuenta cuando abrimos nuevas vacantes. Adjunta tu CV e indícanos tu área de interés.", subject: "Candidatura espontánea - Trabaja con nosotros", send: "Enviar mi candidatura",
  },
  ca: {
    title: "Treballa amb nosaltres", description: "Uneix-te a l'equip de Grúas del Vallès. Empresa familiar amb més de 55 anys d'experiència en elevació industrial. Busquem operadors, mecànics i tècnics compromesos amb la seguretat.",
    home: "Inici", hero: "Forma part del nostre equip", lede: "A Grúas del Vallès fa més de 55 anys que creixem gràcies a les persones. Si t'apassionen la maquinària pesant i la seguretat industrial, et volem conèixer.",
    profiles: "Perfils que busquem", profilesTitle: "Llocs habituals a la nostra empresa", profilesIntro: "Tant si tens experiència en el sector com si comences, envia'ns la teva candidatura. Valorem l'actitud, la responsabilitat i el treball en equip.",
    jobs: [
      { titulo: "Operador de grua", descripcion: "Operació de grues mòbils autopropulsades de gran tonatge. Cal el permís OGMA i una experiència mínima de 2 anys.", requisitos: ["Permís OGMA A/B", "Carnet C/E", "Experiència en obra"] },
      { titulo: "Mecànic de maquinària pesant", descripcion: "Manteniment i reparació de la flota pròpia. Taller equipat amb eines d'última generació i magatzem de recanvis.", requisitos: ["FP Mecànica Industrial", "Hidràulica i electrònica", "Treball en equip"] },
      { titulo: "Tècnic de maniobres", descripcion: "Planificació i coordinació de maniobres especials amb estudi previ CAD/CAM. Perfil tècnic orientat a la seguretat.", requisitos: ["Recurs preventiu", "Lectura de plànols", "AutoCAD valorable"] },
      { titulo: "Administratiu/va", descripcion: "Gestió de pressupostos, coordinació d'equips i tràmits de permisos amb organismes públics.", requisitos: ["Cicle administratiu o similar", "Ofimàtica avançada", "Català i castellà"] },
    ],
    why: "Per què escollir-nos?", offer: "Què oferim", benefits: ["Contracte estable des del primer dia", "Formació contínua i homologada", "Equip jove i ambient familiar", "Equips de protecció de primer nivell", "Base a Granollers, accessos N-152 i AP-7", "Creixement dins de l'empresa"],
    spontaneous: "Candidatura espontània", spontaneousTitle: "No hi veus el teu perfil? Escriu-nos igualment", spontaneousText: "Guardem totes les candidatures i les tenim en compte quan obrim noves vacants. Adjunta el teu CV i indica'ns la teva àrea d'interès.", subject: "Candidatura espontània - Treballa amb nosaltres", send: "Enviar la meva candidatura",
  },
  en: {
    title: "Careers", description: "Join the Grúas del Vallès team. A family business with over 55 years of industrial lifting experience. We are looking for operators, mechanics and technicians committed to safety.",
    home: "Home", hero: "Join our team", lede: "At Grúas del Vallès we have been growing thanks to our people for over 55 years. If you are passionate about heavy machinery and industrial safety, we would like to hear from you.",
    profiles: "Roles we look for", profilesTitle: "Typical roles in our company", profilesIntro: "Whether you have industry experience or are just starting out, send us your application. We value attitude, responsibility and teamwork.",
    jobs: [
      { titulo: "Crane operator", descripcion: "Operation of heavy-duty self-propelled mobile cranes. An OGMA permit and at least 2 years' experience are required.", requisitos: ["OGMA A/B permit", "C/E driving licence", "On-site experience"] },
      { titulo: "Heavy equipment mechanic", descripcion: "Maintenance and repair of our own fleet. Workshop equipped with modern tools and a spare parts store.", requisitos: ["Industrial mechanics vocational training", "Hydraulics and electronics", "Teamwork"] },
      { titulo: "Lift technician", descripcion: "Planning and coordination of special lifting operations with prior CAD/CAM assessment. A technical role focused on safety.", requisitos: ["Preventive safety officer", "Reading plans", "AutoCAD an advantage"] },
      { titulo: "Administrative assistant", descripcion: "Managing quotes, coordinating teams and processing permits with public authorities.", requisitos: ["Administrative qualification or similar", "Advanced office software", "Catalan and Spanish"] },
    ],
    why: "Why choose us?", offer: "What we offer", benefits: ["Stable contract from day one", "Ongoing certified training", "Young team and family atmosphere", "High-quality protective equipment", "Based in Granollers, with N-152 and AP-7 access", "Opportunities to grow within the company"],
    spontaneous: "Speculative application", spontaneousTitle: "Don't see your role? Get in touch anyway", spontaneousText: "We keep all applications and consider them when new vacancies arise. Attach your CV and tell us your area of interest.", subject: "Speculative application - Careers", send: "Send my application",
  },
};

export function careersCopy(lang: Lang) { return copy[lang]; }