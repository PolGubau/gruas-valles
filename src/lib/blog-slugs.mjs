// Las URLs antiguas siguen disponibles como redirecciones, pero no se enlazan.
export const blogSlugs = {
  "traslado-de-un-elefante-al-zoo-de-barcelona": "traslado-de-una-elefanta",
  "participamos-en-festival-fadfest-2017-de-barcelona": "sujecion-carpa-para-evento",
  "colaboracion-espectaculo-dreams-2018-fura-dels-baus": "elevacion-participantes-espectaculo-aereo",
  "participacion-evento-fin-de-ano-2018": "grua-en-espectaculo",
  "colaboracion-polo-music-festival-2019": "montaje-escenario-con-gruas",
  "colaboracion-en-proyecto-con-adelte": "posicionamiento-estructuras-metalicas",
  "desmontaje-mercat-dels-encants": "desmontaje-grua-torre",
  "colocacion-paneles-novartis": "montaje-equipos-paneles-industriales",
  "colocacion-modulos-en-hospitalet": "colocacion-fachada-vidrio",
  "instalacion-equipos-en-hospital-de-granollers": "instalacion-equipos-climatizacion",
  "corte-ingles-sabadell": "sustitucion-maquinaria-climatizacion",
  "dalmau": "botadura-de-un-barco",
  "nueva-grua-grove-gmk-3060-l-1-60-tm": "nueva-grua-60-toneladas",
  "grua-liebherr-mk-88-4-1-para-construccion": "nueva-grua-para-construccion",
  "nueva-adquisicion-grua-liebherr-ltm-1650": "nueva-grua-700-toneladas",
  "nueva-grua-spierings-sk1265-at6": "nueva-grua-construccion-seis-ejes",
  "nueva-adquisicion-grua-grove-gmk-80-t": "nueva-grua-80-toneladas",
  "nueva-grua-gmk-4080l-80-t": "incorporacion-grua-movil-80-toneladas",
};

export function publicBlogSlug(slug) {
  return blogSlugs[slug] ?? slug;
}