import { faqs } from "../data/faqs";
import { homeCopy } from "./home";
import type { Lang } from "./utils";

const copy = {
  es: {
    title: "Contacto y presupuesto", description: "Solicite presupuesto sin compromiso para su maniobra. Respuesta en menos de 24 horas. Servicio de emergencia 24/365 en toda Cataluña.",
    heading: "Solicite su presupuesto sin compromiso", intro: "Cuéntenos su proyecto y nuestro equipo técnico le propondrá la solución de elevación más adecuada.",
    home: "Inicio", contact: "Contacto", guarantees: ["Respuesta en menos de 24 h", "Presupuesto sin compromiso", "Asesoramiento técnico incluido", "Emergencias 24 h / 365 días"],
    call: "Llámenos", write: "Escríbanos", commercial: "Lun-Vie · Atención comercial", response: "Respuesta en menos de 24 h", emergency: "Emergencias 24/365", urgent: "Servicio de urgencia permanente",
    hours: "Horario de atención", weekdays: "Lunes a viernes · 8:00 - 18:00 h", emergencyHours: "Emergencias: 24 horas / 365 días", coverage: "Cobertura", coverageArea: "Toda Catalunya y zonas colindantes", access: "A dos minutos del Circuito de Montmeló · Accesos Carretera N-152 y AP-7",
    cardEyebrow: "Tarjeta de contacto", viewCard: "Ver tarjeta", callPerson: "Llamar", emailPerson: "Enviar email", saveContact: "Guardar contacto",
    personMeta: (name: string, area: string) => `${name}, ${area} en Grúas del Vallès. Contacto directo por teléfono o email.`,
  },
  ca: {
    title: "Contacte i pressupost", description: "Demaneu pressupost sense compromís per a la vostra maniobra. Resposta en menys de 24 hores. Servei d'emergència 24/365 a tot Catalunya.",
    heading: "Demaneu el vostre pressupost sense compromís", intro: "Expliqueu-nos el vostre projecte i el nostre equip tècnic us proposarà la solució d'elevació més adequada.",
    home: "Inici", contact: "Contacte", guarantees: ["Resposta en menys de 24 h", "Pressupost sense compromís", "Assessorament tècnic inclòs", "Emergències 24 h / 365 dies"],
    call: "Truqueu-nos", write: "Escriviu-nos", commercial: "Dl-Dv · Atenció comercial", response: "Resposta en menys de 24 h", emergency: "Emergències 24/365", urgent: "Servei d'urgència permanent",
    hours: "Horari d'atenció", weekdays: "De dilluns a divendres · 8:00 - 18:00 h", emergencyHours: "Emergències: 24 hores / 365 dies", coverage: "Cobertura", coverageArea: "Tot Catalunya i zones limítrofes", access: "A dos minuts del Circuit de Montmeló · Accessos carretera N-152 i AP-7",
    cardEyebrow: "Targeta de contacte", viewCard: "Veure targeta", callPerson: "Trucar", emailPerson: "Enviar correu", saveContact: "Desar contacte",
    personMeta: (name: string, area: string) => `${name}, ${area} a Grúas del Vallès. Contacte directe per telèfon o correu electrònic.`,
  },
  en: {
    title: "Contact and quotes", description: "Request a no-obligation quote for your lift. Response within 24 hours. Emergency service 24/365 throughout Catalonia.",
    heading: "Request your no-obligation quote", intro: "Tell us about your project and our technical team will recommend the most suitable lifting solution.",
    home: "Home", contact: "Contact", guarantees: ["Response within 24 hours", "No-obligation quote", "Technical advice included", "Emergency service 24/365"],
    call: "Call us", write: "Email us", commercial: "Mon–Fri · Sales enquiries", response: "Response within 24 hours", emergency: "Emergencies 24/365", urgent: "Round-the-clock emergency service",
    hours: "Opening hours", weekdays: "Monday to Friday · 8:00 - 18:00", emergencyHours: "Emergencies: 24 hours / 365 days", coverage: "Coverage", coverageArea: "Throughout Catalonia and neighbouring areas", access: "Two minutes from the Circuit de Montmeló · Access via N-152 and AP-7",
    cardEyebrow: "Contact card", viewCard: "View card", callPerson: "Call", emailPerson: "Send email", saveContact: "Save contact",
    personMeta: (name: string, area: string) => `${name}, ${area} at Grúas del Vallès. Contact directly by phone or email.`,
  },
};

const additionalFaqs = {
  ca: [
    { id: "emergencia", q: "Oferiu servei d'emergència fora de l'horari laboral?", a: "Sí. Disposem de servei d'emergència 24 hores, 365 dies l'any. Podeu contactar amb els telèfons d'urgència 669 29 69 54 i 669 29 69 49." },
    { id: "capacidad", q: "Quina capacitat d'elevació tenen les vostres grues?", a: "Disposem de flota pròpia de grues mòbils autopropulsades de 40 a 700 Tn, a més de camions grua, grues per a construcció i vehicles auxiliars." },
    { id: "presupuesto", q: "El pressupost té algun cost o compromís?", a: "No. Elaborem pressupostos sense compromís i responem en menys de 24 hores amb una proposta tècnica detallada." },
    { id: "asesoramiento", q: "Disposeu d'assessorament tècnic previ?", a: "Sí. El nostre Departament d'Estudis elabora plànols i estudis de maniobra amb programari CAD/CAM i plànols 3D, complementats amb visites tècniques a la ubicació." },
  ],
  en: [
    { id: "emergencia", q: "Do you provide an emergency service outside working hours?", a: "Yes. Our emergency service is available 24 hours a day, 365 days a year. Call our emergency numbers: 669 29 69 54 and 669 29 69 49." },
    { id: "capacidad", q: "What lifting capacity do your cranes have?", a: "Our own fleet includes mobile cranes from 40 to 700 tonnes, as well as truck-mounted cranes, construction cranes and support vehicles." },
    { id: "presupuesto", q: "Is there any charge or obligation for a quote?", a: "No. We provide no-obligation quotes and respond within 24 hours with a detailed technical proposal." },
    { id: "asesoramiento", q: "Do you provide technical advice beforehand?", a: "Yes. Our engineering department prepares lift plans using CAD/CAM software and 3D drawings, supplemented by technical site visits." },
  ],
};

export function contactCopy(lang: Lang) {
  const translated = lang === "es" ? faqs : [...homeCopy(lang).faqs, ...additionalFaqs[lang]];
  return { ...copy[lang], faqs: faqs.map(({ id }) => {
    const item = translated.find((faq) => faq.id === id);
    if (!item) throw new Error(`Missing ${lang} FAQ: ${id}`);
    return item;
  }) };
}