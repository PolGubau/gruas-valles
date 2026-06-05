/**
 * download-images.mjs
 * 1. Descarga todas las imágenes del sitio con nombres semánticos
 * 2. Convierte a .avif usando ffmpeg
 * 3. Genera manifest.json con el mapeo URL → ruta local
 * 4. Actualiza los JSONs de src/data/ para referenciar las nuevas rutas
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'images');
const DATA_DIR = path.join(ROOT, 'src', 'data');

fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Mapeo semántico URL → nombre (sin extensión) ──────────────────────────
const IMAGE_MAP = [
  // FLOTA
  { url: 'https://www.gruasdelvalles.com/upfiles/LIEBHERR_MK88_P.jpg', name: 'flota-liebherr-mk88-4-1-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/LIEBHERR_MK88_P2.jpg', name: 'flota-liebherr-mk88-4-1-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_MK88II_GruasdelValles_Febrero2023.jpg', name: 'flota-liebherr-mk88-4-1-03' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/NOTICIA_NuevaGRUA_400tn2016_2b.jpg', name: 'flota-liebherr-ltm1400-7-1-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/NOTICIA_NuevaGRUA_400tn2016_1.jpg', name: 'flota-liebherr-ltm1400-7-1-02' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Foto_NovaGRUA_1.jpg', name: 'flota-liebherr-ltm1400-7-1-03' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Foto_NovaGRUA_2.jpg', name: 'flota-liebherr-ltm1400-7-1-04' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/BLOG_80TmGMK_P.jpg', name: 'flota-grove-gmk4080l-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/80TmGMK_P1.jpg', name: 'flota-grove-gmk4080l-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Foto_GRUA_Grove_NOVA_GruasdelValles1_WEB2.jpg', name: 'flota-grove-gmk3060l-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Foto_GRUA_Grove_NOVA_GruasdelValles1_WEB1.jpg', name: 'flota-grove-gmk3060l-02' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Post_HOSpital_GRANOLLERS_GRUASDELvalles2b.jpg', name: 'flota-liebherr-ltm1090-4-2-01' },

  // MANIOBRAS
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra6Tn_Abril1.jpg', name: 'maniobra-modulos-6tn-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra6Tn_Abril2.jpg', name: 'maniobra-modulos-6tn-02' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra25Tn1.jpg', name: 'maniobra-equipo-25tn-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra25Tn2.jpg', name: 'maniobra-equipo-25tn-02' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra25Tn3.jpg', name: 'maniobra-equipo-25tn-03' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra_Maquinaria15TN_Septiembre2016_G.jpg', name: 'maniobra-maquinaria-15tn-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra_Jacenas14Tn_G.jpg', name: 'maniobra-jacenas-14tn-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra_Jacenas14Tn_G1.jpg', name: 'maniobra-jacenas-14tn-02' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra_Tramel14TN_G2.jpg', name: 'maniobra-tramel-15tn-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra_Tramel14TN_G3.jpg', name: 'maniobra-tramel-15tn-02' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra_Tramel14TN_G4.jpg', name: 'maniobra-tramel-15tn-03' },

  // BLOG
  { url: 'https://www.gruasdelvalles.com/upfiles/Post_HOSpital_GRANOLLERS_GRUASDELvalles1.jpg', name: 'blog-hospital-granollers-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Post_HOSpital_GRANOLLERS_GRUASDELvalles2.jpg', name: 'blog-hospital-granollers-02' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Post_HOSpital_GRANOLLERS_GRUASDELvalles3.jpg', name: 'blog-hospital-granollers-03' },
  { url: 'http://www.gruasdelvalles.com/upfiles/Reli_interior.jpg', name: 'blog-inscripcion-reli-01' },
  { url: 'http://www.gruasdelvalles.com/upfiles/Colocacion_modulos_fachada_hospitalet_G.jpg', name: 'blog-modulos-hospitalet-01' },
  { url: 'http://www.gruasdelvalles.com/upfiles/Colocacion_paneles_aislamiento_G.jpg', name: 'blog-paneles-novartis-01' },
  { url: 'http://www.gruasdelvalles.com/upfiles/Desmontaje_Encants_Bcn_G.jpg', name: 'blog-desmontaje-encants-bcn-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra__Juliol2019A.jpg', name: 'blog-adelte-puerto-barcelona-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Maniobra_EVENTOS_Juny2019A.jpg', name: 'blog-polo-music-festival-2019-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Foto_FiANY2018_A.jpg', name: 'blog-espectaculo-fin-anio-2018-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Foto_FiANY2018_B.jpg', name: 'blog-espectaculo-fin-anio-2018-02' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Foto_FiANY2018_C.jpg', name: 'blog-espectaculo-fin-anio-2018-03' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Foto_FiANY2018_D.jpg', name: 'blog-espectaculo-fin-anio-2018-04' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Contingut_FADFest1.jpg', name: 'blog-fadfest-barcelona-2017-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/zoo_02.jpg', name: 'blog-traslado-elefante-zoo-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/zoo1.jpg', name: 'blog-traslado-elefante-zoo-02' },

  // GALERÍA — Industria
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_JULIOL2022A_GruasdelValles.jpg', name: 'galeria-industria-2022-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_NOVEMBRE2020A_GruasdelValles.jpg', name: 'galeria-industria-2020-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_OCTUBRE2020_GruasdelValles.jpg', name: 'galeria-industria-2020-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Foto_PORTA_Juny2020.jpg', name: 'galeria-industria-2020-03' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Foto_400mas220 tm_Juny2020_PuertoBcn.jpg', name: 'galeria-industria-400tn-220tn-puerto-barcelona-2020' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_INDUSTRIA_Novembre2019A1.jpg', name: 'galeria-industria-2019-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_INDUSTRIA_NovaGRUA_60mts_Setembre2018A.jpg', name: 'galeria-industria-nova-grua-60m-2018' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_INDUSTRIA_MOLI_MAIG2018A.jpg', name: 'galeria-industria-molino-2018' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_INDUSTRIA_MAIG2018A.jpg', name: 'galeria-industria-2018-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_INDUSTRIA_MAIG2018B.jpg', name: 'galeria-industria-2018-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_INDUSTRIA_Febrer2018A.jpg', name: 'galeria-industria-2018-03' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_INDUSTRIA_Gener2018C.jpg', name: 'galeria-industria-2018-04' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_INDUSTRIA_Gener2018B.jpg', name: 'galeria-industria-2018-05' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_INDUSTRIA_Gener2018A.jpg', name: 'galeria-industria-2018-06' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_NOVIEMBRE1.jpg', name: 'galeria-industria-noviembre-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_NOVIEMBRE2.jpg', name: 'galeria-industria-noviembre-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Industria_Antiga_2_2017A.jpg', name: 'galeria-industria-archivo-2017-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_Antiga_2.jpg', name: 'galeria-industria-archivo-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_Antiga_1.jpg', name: 'galeria-industria-archivo-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_VARIOS_44b.jpg', name: 'galeria-industria-varios-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobras_oct_G_INDUSTRIA.jpg', name: 'galeria-industria-octubre-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobras_oct_4_G.jpg', name: 'galeria-industria-octubre-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_VARIOS_5.jpg', name: 'galeria-industria-varios-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_VARIOS_6.jpg', name: 'galeria-industria-varios-03' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_VARIOS_7.jpg', name: 'galeria-industria-varios-04' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_VARIOS_4.jpg', name: 'galeria-industria-varios-05' },

  // GALERÍA — Puentes/Pasarelas
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobras_PASARELAS_SantCELONA22_G.jpg', name: 'galeria-puentes-pasarela-sant-celoni-2022' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_PUENTES_9_2015B.jpg', name: 'galeria-puentes-2015-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_VARIOS_8B.jpg', name: 'galeria-puentes-varios-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Mant_Octubre_2014_1.jpg', name: 'galeria-puentes-2014-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobras_oct_2_G.jpg', name: 'galeria-puentes-octubre-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Montaje_puente_Andorra_G.jpg', name: 'galeria-puentes-andorra' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_VARIOS_8.jpg', name: 'galeria-puentes-varios-02' },

  // GALERÍA — Eventos
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Grove250 tm_festival_PortForum_GruasdelValles_Febrer2023.jpg', name: 'galeria-eventos-grove-250tn-port-forum-2023' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_EVENTOS_Juny2019B.jpg', name: 'galeria-eventos-polo-festival-2019-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_EVENTOS_Gener2019A.jpg', name: 'galeria-eventos-2019-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_EVENTOS_Gener2019B.jpg', name: 'galeria-eventos-2019-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_AjuntBCN_EVENTOS2.jpg', name: 'galeria-eventos-ajuntament-barcelona' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_VARIOS_11_EVENTOS.jpg', name: 'galeria-eventos-varios-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_corte_ingles_Sbd_G.jpg', name: 'galeria-eventos-corte-ingles-sabadell' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Circuit_Catalunya_G.jpg', name: 'galeria-eventos-circuit-de-catalunya' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_zoo_04.jpg', name: 'galeria-eventos-zoo-barcelona' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_VARIOS_9.jpg', name: 'galeria-eventos-varios-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_EVENTOS_Fura2.jpg', name: 'galeria-eventos-fura-dels-baus-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_EVENTOS_Fura1.jpg', name: 'galeria-eventos-fura-dels-baus-01' },
  { url: 'https://www.gruasdelvalles.com/upfiles/Cruilla2018_GruasDelVALLES.png', name: 'galeria-eventos-festival-cruilla-2018' },

  // GALERÍA — Rescates
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_VARIOS_10.jpg', name: 'galeria-rescates-varios-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_rescate_camion_G.jpg', name: 'galeria-rescates-camion-01' },

  // GALERÍA — Construcción
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_CONSTRUCCION_MARZO2022A.jpg', name: 'galeria-construccion-2022-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/ReparacionMOLLET_desmontaje_GruasdelValles2.jpg', name: 'galeria-construccion-reparacion-mollet' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_INDUSTRIA_Novembre2019A2.jpg', name: 'galeria-construccion-2019-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_CONSTRUCCIO_Octubre2018A_Glories_Barcelona.jpg', name: 'galeria-construccion-glories-barcelona-2018' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_CONSTRUCCIO_Abril2018AA.jpg', name: 'galeria-construccion-2018-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_CONSTRUCCIO_Abril2018BB.jpg', name: 'galeria-construccion-2018-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_CONSTRUCCIO_Abril2018D.jpg', name: 'galeria-construccion-2018-03' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_CONSTRUCCIO_Abril2018C.jpg', name: 'galeria-construccion-2018-04' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_CONSTRUCCIO_Febrer2018A.jpg', name: 'galeria-construccion-2018-05' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_CONSTRUCCIO_tuberias_G.jpg', name: 'galeria-construccion-tuberias-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobras_Construccion_4_G.jpg', name: 'galeria-construccion-archivo-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Construccion_Antiga2_2017A.jpg', name: 'galeria-construccion-archivo-2017-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_CONSTRUCCION_GRUATorre2.jpg', name: 'galeria-construccion-grua-torre-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_CONSTRUCCION_Mataro1.jpg', name: 'galeria-construccion-mataro-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Mant_Octubre_2014_3_CONSTRUCCION.jpg', name: 'galeria-construccion-2014-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Mant_Octubre_2014_6.jpg', name: 'galeria-construccion-2014-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Mant_Octubre_2014_7.jpg', name: 'galeria-construccion-2014-03' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Mant_Octubre_2014_5.jpg', name: 'galeria-construccion-2014-04' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_VARIOS_3.jpg', name: 'galeria-construccion-varios-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/GAL_Maniobra_CONSTRUCCION_HOSPITAL1.jpg', name: 'galeria-construccion-hospital-01' },

  // GALERÍA — Otros
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Mant_Octubre_2014_7.jpg', name: 'galeria-otros-2014-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Mant_Octubre_2014_6.jpg', name: 'galeria-otros-2014-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Mant_Octubre_2014_5.jpg', name: 'galeria-otros-2014-03' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Mant_Octubre_2014_4.jpg', name: 'galeria-otros-2014-04' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Mant_Octubre_2014_3.jpg', name: 'galeria-otros-2014-05' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Mant_Octubre_2014_2.jpg', name: 'galeria-otros-2014-06' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Mant_Octubre_2014_1.jpg', name: 'galeria-otros-2014-07' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/zoo_04.jpg', name: 'galeria-otros-zoo-barcelona-elefante' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobras_oct_4_G.jpg', name: 'galeria-otros-octubre-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobras_oct_3_G.jpg', name: 'galeria-otros-octubre-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobras_oct_2_G.jpg', name: 'galeria-otros-octubre-03' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/AAManiobras_oct_G.jpg', name: 'galeria-otros-octubre-04' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/tuberias_G.jpg', name: 'galeria-otros-tuberias-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Montaje_puente_Andorra_G.jpg', name: 'galeria-otros-montaje-puente-andorra' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/corte_ingles_Sbd_G.jpg', name: 'galeria-otros-corte-ingles-sabadell' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Circuit_Catalunya_G.jpg', name: 'galeria-otros-circuit-de-catalunya' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/rescate_camion_G.jpg', name: 'galeria-otros-rescate-camion' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_9.jpg', name: 'galeria-otros-varios-01' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_10.jpg', name: 'galeria-otros-varios-02' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_11.jpg', name: 'galeria-otros-varios-03' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_8.jpg', name: 'galeria-otros-varios-04' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_7.jpg', name: 'galeria-otros-varios-05' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_6.jpg', name: 'galeria-otros-varios-06' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_5.jpg', name: 'galeria-otros-varios-07' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_2.jpg', name: 'galeria-otros-varios-08' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_1.jpg', name: 'galeria-otros-varios-09' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_4.jpg', name: 'galeria-otros-varios-10' },
  { url: 'https://www.gruasdelvalles.com/fotoampliable/Maniobra_VARIOS_3.jpg', name: 'galeria-otros-varios-11' },
];

// ─── Utilidades ────────────────────────────────────────────────────────────

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

function toAvif(src, dest) {
  // Try libsvtav1 first (faster), fall back to libaom-av1
  const encoders = [
    `-c:v libsvtav1 -crf 35 -preset 6 -pix_fmt yuv420p`,
    `-c:v libaom-av1 -crf 35 -b:v 0 -pix_fmt yuv420p`,
  ];
  for (const enc of encoders) {
    try {
      execSync(`ffmpeg -y -i "${src}" ${enc} "${dest}" 2>nul`, { stdio: 'pipe' });
      return true;
    } catch { /* try next */ }
  }
  return false;
}

// ─── Main ──────────────────────────────────────────────────────────────────

// Deduplicate: first occurrence wins
const seen = new Map();
const unique = [];
for (const item of IMAGE_MAP) {
  const key = item.url.split('?')[0];
  if (!seen.has(key)) {
    seen.set(key, true);
    unique.push(item);
  }
}

console.log(`\n📥  ${unique.length} imágenes únicas a procesar\n`);

const manifest = {}; // url → local path
const results = { ok: [], failed: [] };

for (let i = 0; i < unique.length; i++) {
  const { url, name } = unique[i];
  const ext = path.extname(new URL(url).pathname).toLowerCase() || '.jpg';
  const tmpFile = path.join(OUT_DIR, `${name}${ext}`);
  const avifFile = path.join(OUT_DIR, `${name}.avif`);
  const localPath = `/assets/images/${name}.avif`;

  process.stdout.write(`[${String(i + 1).padStart(3)}/${unique.length}] ${name} ... `);

  try {
    // Skip if already converted
    if (fs.existsSync(avifFile)) {
      console.log('✓ ya existe');
      manifest[url] = localPath;
      results.ok.push(name);
      continue;
    }

    await downloadFile(url, tmpFile);
    const converted = toAvif(tmpFile, avifFile);

    // Remove temp source after conversion
    if (fs.existsSync(tmpFile) && tmpFile !== avifFile) {
      fs.unlinkSync(tmpFile);
    }

    if (converted) {
      const sizeKb = Math.round(fs.statSync(avifFile).size / 1024);
      console.log(`✓ ${sizeKb} KB`);
      manifest[url] = localPath;
      results.ok.push(name);
    } else {
      console.log('⚠ conversión fallida, guardado original');
      fs.renameSync(tmpFile, avifFile);
      manifest[url] = localPath;
      results.ok.push(name);
    }
  } catch (err) {
    console.log(`✗ ${err.message}`);
    results.failed.push({ name, url, error: err.message });
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
}

// ─── Guardar manifest ─────────────────────────────────────────────────────

const manifestPath = path.join(OUT_DIR, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`\n📋  Manifest guardado en assets/images/manifest.json`);

// ─── Actualizar JSONs en src/data/ ────────────────────────────────────────

const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

for (const file of jsonFiles) {
  const filePath = path.join(DATA_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [origUrl, localPath] of Object.entries(manifest)) {
    // Match both http and https variants
    const variants = [origUrl, origUrl.replace('https://', 'http://'), origUrl.replace('http://', 'https://')];
    for (const v of variants) {
      if (content.includes(v)) {
        content = content.split(v).join(localPath);
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Actualizado: src/data/${file}`);
  }
}

// ─── Resumen ───────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
console.log(`✅  ${results.ok.length} imágenes procesadas correctamente`);
if (results.failed.length) {
  console.log(`❌  ${results.failed.length} fallidas:`);
  results.failed.forEach(f => console.log(`   • ${f.name}: ${f.error}`));
}
console.log(`${'─'.repeat(50)}\n`);
