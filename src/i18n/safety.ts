import type { Lang } from "./utils";

const copy = {
  es: {
    home: "Inicio", label: "Seguridad", title: "La seguridad, en el centro de cada maniobra",
    description: "La seguridad es primordial en cada trabajo. Conoce nuestras certificaciones REIC, REA y LOPD que garantizan las máximas garantías en cada maniobra.",
    lede: "Desde los inicios de nuestra actividad, la seguridad rige la política de empresa. Toda la flota pasa las inspecciones técnicas obligatorias y disponemos de taller mecánico propio.",
    eyebrow: "Nuestra política", heading: "Seguridad como principio, no como trámite", intro: "La seguridad en cada uno de los trabajos que realizamos es primordial y rige nuestra política de empresa desde los inicios de nuestra incursión en el sector de las grúas móviles autopropulsadas. Es por este motivo por el que hemos obtenido y mantenido todas las acreditaciones sectoriales pertinentes, operando con plenas garantías legales y técnicas para nuestros clientes.",
    credentials: "Acreditaciones y certificados", guarantees: "Todas las garantías, verificadas", download: "Descargar PDF",
    items: {
      reic: { title: "REIC · Empresa conservadora", subtitle: "Nº 08/157.364 — desde 1997", description: "Grúas del Vallès se estableció como Empresa Conservadora o Auto-mantenedora de Grúas Autopropulsadas según el RECGA 12/06/1997, garantizando que toda la flota supera todas las inspecciones técnicas obligatorias." },
      rea: { title: "REA · Registro Empresas Acreditadas", subtitle: "Nº 0900006812 — desde 2008 · renovado 08/08/2011", description: "Acreditación que homologa a Grúas del Vallès para intervenir en cualquier proceso de contratación o subcontratación dentro del sector de la construcción." },
      lopd: { title: "LOPD · Protección de datos", subtitle: "L.O. 15/1999, de 13 de diciembre — adaptación en 2010", description: "En cumplimiento de los artículos 5 y 6 de la Ley Orgánica 15/1999, Grúas del Vallès S.A. se adaptó a la Ley Orgánica de Protección de Datos (LOPD)." },
      duns: { title: "DUNS · Solvencia empresarial", subtitle: "Dun & Bradstreet — acreditación internacional", description: "Certificado DUNS (Data Universal Numbering System) que acredita la solvencia e identidad empresarial de Grúas del Vallès ante clientes y organismos internacionales." },
      workshop: { title: "Taller mecánico propio", subtitle: "Mantenimiento preventivo y correctivo", description: "Disponemos de taller mecánico propio para garantizar que toda la flota se mantiene en perfecto estado y condiciones de funcionamiento en todo momento." },
    },
  },
  ca: {
    home: "Inici", label: "Seguretat", title: "La seguretat, al centre de cada maniobra",
    description: "La seguretat és primordial en cada treball. Coneixeu les nostres certificacions REIC, REA i LOPD i les garanties de cada maniobra.",
    lede: "Des dels inicis de la nostra activitat, la seguretat regeix la política d'empresa. Tota la flota passa les inspeccions tècniques obligatòries i disposem de taller mecànic propi.",
    eyebrow: "La nostra política", heading: "Seguretat com a principi, no com a tràmit", intro: "La seguretat en cadascun dels treballs que fem és primordial i regeix la nostra política d'empresa des dels inicis en el sector de les grues mòbils autopropulsades. Per això hem obtingut i mantingut totes les acreditacions sectorials pertinents, operant amb garanties legals i tècniques per als nostres clients.",
    credentials: "Acreditacions i certificats", guarantees: "Totes les garanties, verificades", download: "Descarregar PDF",
    items: {
      reic: { title: "REIC · Empresa conservadora", subtitle: "Núm. 08/157.364 — des de 1997", description: "Grúas del Vallès es va establir com a empresa conservadora o automantenidora de grues autopropulsades segons el RECGA 12/06/1997, garantint que tota la flota supera les inspeccions tècniques obligatòries." },
      rea: { title: "REA · Registre d'Empreses Acreditades", subtitle: "Núm. 0900006812 — des de 2008 · renovat el 08/08/2011", description: "Acreditació que homologa Grúas del Vallès per intervenir en processos de contractació o subcontractació dins del sector de la construcció." },
      lopd: { title: "LOPD · Protecció de dades", subtitle: "L.O. 15/1999, de 13 de desembre — adaptació el 2010", description: "En compliment dels articles 5 i 6 de la Llei orgànica 15/1999, Grúas del Vallès S.A. es va adaptar a la Llei orgànica de protecció de dades (LOPD)." },
      duns: { title: "DUNS · Solvència empresarial", subtitle: "Dun & Bradstreet — acreditació internacional", description: "Certificat DUNS (Data Universal Numbering System) que acredita la solvència i identitat empresarial de Grúas del Vallès davant clients i organismes internacionals." },
      workshop: { title: "Taller mecànic propi", subtitle: "Manteniment preventiu i correctiu", description: "Disposem de taller mecànic propi per garantir que tota la flota es manté en perfecte estat i en condicions de funcionament en tot moment." },
    },
  },
  en: {
    home: "Home", label: "Safety", title: "Safety at the heart of every lift",
    description: "Safety is essential in every job. Learn about our REIC, REA and LOPD certifications and the safeguards for every lift.",
    lede: "Safety has guided our company policy since the beginning. Our entire fleet undergoes mandatory technical inspections and we have our own mechanical workshop.",
    eyebrow: "Our policy", heading: "Safety as a principle, not a formality", intro: "Safety is paramount in every job we undertake and has guided our company policy since we entered the self-propelled mobile crane sector. We have therefore obtained and maintained the relevant industry accreditations, operating with legal and technical safeguards for our clients.",
    credentials: "Accreditations and certificates", guarantees: "Verified safeguards", download: "Download PDF",
    items: {
      reic: { title: "REIC · Maintenance company", subtitle: "No. 08/157.364 — since 1997", description: "Grúas del Vallès became a maintenance or self-maintenance company for self-propelled cranes under RECGA on 12/06/1997, ensuring the entire fleet passes all mandatory technical inspections." },
      rea: { title: "REA · Register of Accredited Companies", subtitle: "No. 0900006812 — since 2008 · renewed 08/08/2011", description: "Accreditation authorising Grúas del Vallès to participate in contracting or subcontracting processes in the construction sector." },
      lopd: { title: "LOPD · Data protection", subtitle: "Organic Law 15/1999 of 13 December — adapted in 2010", description: "In compliance with articles 5 and 6 of Organic Law 15/1999, Grúas del Vallès S.A. adapted to the Organic Law on Data Protection (LOPD)." },
      duns: { title: "DUNS · Business standing", subtitle: "Dun & Bradstreet — international accreditation", description: "DUNS (Data Universal Numbering System) certificate attesting to Grúas del Vallès's business standing and identity for international clients and organisations." },
      workshop: { title: "Our own mechanical workshop", subtitle: "Preventive and corrective maintenance", description: "Our own mechanical workshop ensures the entire fleet is kept in good condition and working order at all times." },
    },
  },
};

export function safetyCopy(lang: Lang) { return copy[lang]; }