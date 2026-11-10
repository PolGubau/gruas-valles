import type { Lang } from "./utils";

const copy = {
  es: {
    home: "Inicio", breadcrumb: "Organismos", title: "Organismos y asociaciones",
    description: "Grúas del Vallès pertenece a distintas asociaciones empresariales y organismos a nivel nacional y autonómico, además de entidades sin ánimo de lucro como Cruz Roja.",
    lede: "Grúas del Vallès pertenece a distintas asociaciones empresariales y organismos tanto a nivel nacional como autonómico y forma parte de otras asociaciones sin ánimo de lucro.",
    eyebrow: "Nuestro compromiso sectorial", heading: "Miembros activos del sector y de la sociedad", intro: "Puede conocer más sobre estas organizaciones accediendo a los enlaces indicados.", website: "Ver web", download: "Descargar documento acreditativo",
    organizations: {
      anagrual: { name: "ANAGRUAL", full: "Agrupación Empresarial Nacional de Alquiladores de Grúas de Servicio Público", description: "Grúas del Vallès desempeña cargos en la Junta Directiva a nivel autonómico dentro de esta agrupación empresarial nacional." },
      transcalit: { name: "TRANSCALIT", full: "Federación Catalana de Transportes de Barcelona", description: "Miembros de la Federación Catalana de Transportes, entidad de referencia en el sector del transporte en Cataluña." },
      redcross: { name: "CRUZ ROJA", full: "Socio Colaborador desde 1997", description: "Grúas del Vallès es socio colaborador de Cruz Roja desde 1997, comprometidos con la responsabilidad social y el apoyo a esta institución sin ánimo de lucro." },
    },
  },
  ca: {
    home: "Inici", breadcrumb: "Organismes", title: "Organismes i associacions",
    description: "Grúas del Vallès pertany a diverses associacions empresarials i organismes d'àmbit estatal i autonòmic, així com a entitats sense ànim de lucre com la Creu Roja.",
    lede: "Grúas del Vallès pertany a diverses associacions empresarials i organismes d'àmbit estatal i autonòmic i forma part d'altres associacions sense ànim de lucre.",
    eyebrow: "El nostre compromís sectorial", heading: "Membres actius del sector i de la societat", intro: "Podeu conèixer més sobre aquestes organitzacions accedint als enllaços indicats.", website: "Veure web", download: "Descarregar document acreditatiu",
    organizations: {
      anagrual: { name: "ANAGRUAL", full: "Agrupació Empresarial Nacional de Llogaters de Grues de Servei Públic", description: "Grúas del Vallès ocupa càrrecs a la Junta Directiva d'àmbit autonòmic d'aquesta agrupació empresarial estatal." },
      transcalit: { name: "TRANSCALIT", full: "Federació Catalana de Transports de Barcelona", description: "Membres de la Federació Catalana de Transports, entitat de referència en el sector del transport a Catalunya." },
      redcross: { name: "CREU ROJA", full: "Soci col·laborador des de 1997", description: "Grúas del Vallès és soci col·laborador de la Creu Roja des de 1997, compromès amb la responsabilitat social i el suport a aquesta institució sense ànim de lucre." },
    },
  },
  en: {
    home: "Home", breadcrumb: "Organisations", title: "Organisations and associations",
    description: "Grúas del Vallès belongs to national and regional business associations and organisations, as well as non-profit bodies such as the Red Cross.",
    lede: "Grúas del Vallès belongs to national and regional business associations and organisations, as well as other non-profit associations.",
    eyebrow: "Our commitment to the sector", heading: "Active members of the sector and society", intro: "You can learn more about these organisations using the links provided.", website: "Visit website", download: "Download supporting document",
    organizations: {
      anagrual: { name: "ANAGRUAL", full: "National Business Association of Public-Service Crane Hire Companies", description: "Grúas del Vallès holds positions on the regional board of this national business association." },
      transcalit: { name: "TRANSCALIT", full: "Catalan Transport Federation of Barcelona", description: "Members of the Catalan Transport Federation, a leading organisation in Catalonia's transport sector." },
      redcross: { name: "RED CROSS", full: "Supporting member since 1997", description: "Grúas del Vallès has been a supporting member of the Red Cross since 1997, committed to social responsibility and supporting this non-profit institution." },
    },
  },
};

export function organizationsCopy(lang: Lang) { return copy[lang]; }