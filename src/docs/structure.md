Datos extraídos de la web actual de Grúas del Vallès (www.gruasdelvalles.com) mediante scraping de todas las páginas. La web utiliza una arquitectura obsoleta basada en ASP clásico (`main.asp` con parámetros `Familia` / `Subfamilia` / `pdetall`). A continuación se listan todas las secciones detectadas con sus datos reales en formato JSON.

--------------------------------------------------------------------------------
1. Mapa de Navegación (Sitemap real ASP)

```json
{
  "inicio": "home.asp",
  "nosotros": {
    "familia": 279,
    "subsecciones": {
      "Por qué elegirnos": "main.asp?Familia=279&Subfamilia=843",
      "55 Aniversario": "main.asp?Familia=279&Subfamilia=854",
      "Nuestra historia": "main.asp?Familia=279&Subfamilia=838",
      "Dónde estamos": "main.asp?Familia=279&Subfamilia=836",
      "Instalaciones": "main.asp?Familia=279&Subfamilia=837",
      "Organismos": "main.asp?Familia=279&Subfamilia=844",
      "Seguridad": "main.asp?Familia=279&Subfamilia=845"
    },
    "legales": ["Política de privacidad", "Aviso legal", "Política de Cookies"]
  },
  "flota": {
    "familia": 308,
    "subsecciones": {
      "Grúas gran tonelaje": "main.asp?Familia=308&Subfamilia=857",
      "Grúas móviles autopropulsadas": "main.asp?Familia=308&Subfamilia=858",
      "Grúas para Construcción": "main.asp?Familia=308&Subfamilia=862",
      "Camiones y Vehículos auxiliares": "main.asp?Familia=308&Subfamilia=859"
    }
  },
  "servicios": {
    "familia": 292,
    "subsecciones": {
      "Servicios principales": "main.asp?Familia=292&Subfamilia=846",
      "Departamento de Estudios": "main.asp?Familia=292&Subfamilia=861",
      "Asesoramiento y soporte al cliente": "main.asp?Familia=292&Subfamilia=847",
      "Trámites y gestiones": "main.asp?Familia=292&Subfamilia=848",
      "Sectores de intervención": "main.asp?Familia=292&Subfamilia=849"
    }
  },
  "maniobras_ejemplo": "main.asp?Familia=295",
  "fotos_y_videos": "main.asp?Familia=309",
  "blog": "main.asp?Familia=304"
}
```


--------------------------------------------------------------------------------
2. JSON de Datos: Flota Completa

```json
{
  "flota": [
    {
      "categoria": "Grúas gran tonelaje",
      "modelos": [
        { "modelo": "LIEBHERR LTM 1500-8.1", "capacidad": "500 T", "nuevo": true, "nota": "El mayor vehículo de la flota.", "pluma_telescopica": "84 m", "plumin_abatible": "91 m", "plumin_fijo": "56 m", "ejes": 8, "dimensiones": "Alto 4 m / Ancho 3 m / Largo 21,38 m" },
        { "modelo": "LIEBHERR LTM 1400-7.1", "capacidad": "400 T", "pluma": "60 m", "plumin_abatible": "84 m", "plumin_fijo": "63 m", "ejes": 7 },
        { "modelo": "LIEBHERR LTM 1350-6.1", "capacidad": "350 T", "nota": "El modelo de 6 ejes más potente del mercado.", "pluma": "70 m", "plumin_abatible": "hasta 78 m", "plumin_fijo": "hasta 42 m", "ejes": 6 },
        { "modelo": "GROVE GMK 5250XL-1", "capacidad": "250 T", "pluma": "78 m", "plumin": "25,8 m angulable a 50°", "ejes": 5 }
      ]
    },
    {
      "categoria": "Grúas móviles autopropulsadas",
      "modelos": [
        { "modelo": "GROVE GMT 5150L", "capacidad": "150 T", "pluma": "60 m", "plumin_angulado": "25 m", "ejes": "5 (4 motrices)", "dimensiones": "Alto 3,98 m / Ancho 2,75 m / Largo 14,57 m" },
        { "modelo": "LIEBHERR LTM 1110-5.2", "capacidad": "110 T", "pluma": "60 m", "plumin_angulado": "19 m", "ejes": 5, "dimensiones": "Alto 3,95 m / Ancho 2,75 m / Largo 13,84 m" },
        { "modelo": "LIEBHERR LTM 1100-5.3", "capacidad": "100 T", "nuevo": true, "pluma": "62 m", "plumin_angulado": "16 m", "ejes": 5, "dimensiones": "Alto 3,95 m / Ancho 2,55 m / Largo 14,93 m" },
        { "modelo": "LIEBHERR LTM 1090-4.2", "capacidad": "90 T", "pluma": "60 m", "plumin_angulado": "16 m", "ejes": 4, "dimensiones": "Alto 3,95 m / Ancho 2,53 m / Largo 13,90 m" },
        { "modelo": "LIEBHERR LTM 1090-4.1", "capacidad": "90 T", "pluma": "50 m", "plumin_angulado": "19 m", "ejes": 4, "dimensiones": "Alto 3,95 m / Ancho 2,75 m / Largo 12,65 m" },
        { "modelo": "GROVE GMK 4080L", "capacidad": "80 T", "nuevo": true, "pluma": "60 m", "plumin_angulado": "15 m", "ejes": 4, "dimensiones": "Alto 3,75 m / Ancho 2,55 m / Largo 13,08 m" },
        { "modelo": "DEMAG AC 80-2", "capacidad": "80 T", "pluma": "50 m", "plumin_abatible": "20º-40º", "plumin_fijo": "17,6 m", "ejes": "4 (4 motrices)", "dimensiones": "Alto 3,80 m / Ancho 2,75 m / Largo 12,110 m" },
        { "modelo": "GROVE GMK 3060L", "capacidad": "60 T", "pluma": "48 m", "plumin_angulado": "15 m", "ejes": 3, "dimensiones": "Alto 3,66 m / Ancho 2,55 m / Largo 11,2 m" },
        { "modelo": "DEMAG AC 50-1", "capacidad": "50 T", "pluma": "40 m", "plumin_abatible": "20º-40º", "plumin_fijo": "17,6 m", "ejes": "3 (3 motrices)", "dimensiones": "Alto 3,53 m / Ancho 2,55 m / Largo 11,2 m" },
        { "modelo": "LIEBHERR LTC 1050-3.1", "capacidad": "50 T", "pluma": "36 m", "plumin": "13 m (con runner)", "extra": "Cabina telescópica con elevación hasta 8 m (novedad)", "ejes": "3 (3 motrices)", "dimensiones": "Alto 3,53 m / Ancho 2,55 m / Largo 8,88 m" },
        { "modelo": "LIEBHERR LTM 1040-2.1", "capacidad": "40 T", "pluma": "35 m", "plumin_abatible": "20º-40º-60º", "plumin_fijo": "9,5 m", "extra": "Equipada con runner", "ejes": "2 (2 motrices)", "dimensiones": "Alto 3,419 m / Ancho 2,50 m / Largo 10,710 m" }
      ]
    },
    {
      "categoria": "Grúas para Construcción",
      "modelos": [
        { "modelo": "Spierings SK1265-AT6", "pluma_horizontal": "60 m", "peso_en_punta": "1.700 kg", "ejes": 6, "dimensiones": "Alto 4 m / Ancho 3 m / Largo 16,28 m" },
        { "modelo": "LIEBHERR MK 88-4.1", "pluma_horizontal": "45 m", "peso_en_punta": "2.200 kg", "ejes": 4, "dimensiones": "Alto 4 m / Ancho 2,75 m / Largo 15,94 m" }
      ]
    },
    {
      "categoria": "Camiones y Vehículos auxiliares",
      "modelos": [
        { "modelo": "Camión-grúa 200 tm (doble jib)", "nuevo": true, "grua": "PALFINGER PK200002L SH", "capacidad": "200 tm", "tara": "53.500 kg", "mma": "53.500 kg", "ejes": 5, "altura_maxima": "54 m", "doble_jib": "20 m", "extra": "Cesta homologada", "dimensiones": "Ancho 2,65 m / Largo 10,40 m / Alto 3,90 m" },
        { "modelo": "Camión-grúa 165 tm y 45 m", "camion": "MAN Truck & Bus SE", "grua": "Fassi F1650RAL.2.28 HXE-Dynamic", "capacidad": "165 tm", "pluma": "45 m", "tara": "35.060 kg", "mma": "44.000 kg", "ejes": 4, "extra": "Cesta homologada", "dimensiones": "Ancho 2,550 m / Largo 10,33 m / Alto 4,10 m" },
        { "modelo": "Camión-grúa 110 tm y 36 m", "camion": "Volvo FM13", "grua": "PALFINGER PK 11002SH", "capacidad": "110 tm", "pluma": "36 m", "tara": "31.000 kg", "mma": "44.000 kg", "ejes": 4, "extra": "Cesta homologada", "dimensiones": "Ancho 2,550 m / Largo 9,55 m" },
        { "modelo": "Camión-grúa 80 tm y 23 m", "camion": "Volvo S-405", "grua": "PALFINGER PK 78002", "capacidad": "80 tm", "pluma": "23 m", "tara": "25.280 kg", "mma": "32.000 kg", "ejes": 4, "dimensiones": "Ancho 2,5 m / Largo 10 m (caja abierta 6 m)" },
        { "modelo": "Camión-grúa 60 tm y 30 m", "grua": "Palfinger PK 580 TEC", "capacidad": "60 tm", "pluma_jib": "30 m", "tara": "21.187 kg", "mma": "36.000 kg", "ejes": 3, "dimensiones": "Ancho 2,55 m / Largo 8,5 m" },
        { "modelo": "Camión-grúa jib 55 tm y 29 m", "nuevo": true, "camion": "Volvo FM", "grua": "FASSI F545 RA.2.26 XE DYNAMIC", "capacidad": "55 tm", "pluma_con_jib": "29 m", "extra": "Dispone de cabrestante", "tara": "19.500 kg", "mma": "29.000 kg", "ejes": 3, "dimensiones": "Ancho 2,55 m / Largo 8,50 m (caja 4,75 m)" },
        { "modelo": "Camión-grúa 55 tm y 30 m", "camion": "Volvo FM", "grua": "FASSI F545 RA2.26", "capacidad": "55 tm", "pluma_con_jib": "30 m", "tara": "19.620 kg", "mma": "35.000 kg", "ejes": 3, "dimensiones": "Ancho 2,550 m / Largo 7,80 m" },
        { "modelo": "Camión-grúa 36 tm y 23 m", "camion": "Volvo FE F3C", "grua": "FASSI F365 RA2.28 DYNAMIC", "capacidad": "36 tm", "pluma": "23 m", "tara": "15.695 kg", "mma": "26.700 kg", "ejes": 3, "dimensiones": "Ancho 2,550 m / Largo 9,92 m" },
        { "modelo": "Carretilla diésel 9 toneladas", "nuevo": true, "modelo_maquina": "Linde H80/900 D", "tipo": "Vehículo auxiliar para descarga de equipos pesados y material diverso" }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------
3. JSON de Datos: Servicios

```json
{
  "servicios": {
    "principales": [
      "Alquiler de grúas móviles autopropulsadas (de 40 a 500 Tn) y camiones grúa auto-cargante hasta 96 Tn, trailers y otros transportes",
      "Alquiler de transportes especiales (cargas que superan las medidas genéricas legales)",
      "Alquiler de carretillas elevadoras, toros mecánicos, gatos, tanquetas y utillajes para manipulación en interiores",
      "Alquiler de equipos de montaje (muros, naves e infraestructuras de prefabricado)",
      "Alquiler de cestas homologadas para subir personal a alturas o difícil acceso",
      "Colocación de maquinaria pesada mediante gatos hidráulicos y tanquetas",
      "Montaje de estructuras de prefabricado de hormigón (naves, puentes, viaductos, edificios)",
      "Desmontaje integral y traslado de industrias o maquinaria",
      "Servicio en toda Catalunya y zonas colindantes"
    ],
    "departamento_de_estudios": "Técnicos cualificados que presentan opciones de maniobras y emplazamientos. Trabajan con programas CAD/CAM, software de fabricantes y planos 3D, complementado con visitas técnicas personalizadas.",
    "asesoramiento_y_soporte": {
      "asesoramiento_tecnico": "Estudios y planos de maniobras para determinar la maquinaria adecuada y analizar percances.",
      "atencion_al_cliente": "Consultas y presupuestos sin compromiso.",
      "servicio_emergencia": "24 horas, 365 días al año. Teléfonos de urgencia: 669 29 69 54 y 669 29 69 49"
    },
    "tramites_y_gestiones": [
      "Tramitación de permisos urbanos (ocupación de vía pública / corte de calles) y permisos especiales de circulación",
      "Tramitación de seguros y reaseguros",
      "Presentación del Plan de Seguridad e informes personalizados de riesgos",
      "Dirección y ejecución del montaje con técnicos y operarios especializados"
    ],
    "sectores_de_intervencion": [
      "Industria química", "Industria farmacéutica", "Industria naval", "Industria de automoción",
      "Industria de alimentación", "Jardinería y medio ambiente", "Distribución y logística",
      "Ingenierías industriales", "Estaciones aeroportuarias", "Constructoras", "Empresas de prefabricados",
      "Montaje de estructuras metálicas", "Eléctricas", "Cementeras", "Siderúrgicas", "Talleres mecánicos",
      "Casas modulares", "Empresas de clima, gas y renovables", "Centros deportivos", "Organismos oficiales",
      "Actos y spots publicitarios", "Organización de eventos", "Demolición y derribo", "Particulares"
    ]
  }
}
```

--------------------------------------------------------------------------------
4. JSON de Datos: Nosotros

```json
{
  "nosotros": {
    "por_que_elegirnos": [
      "Profesionales con +40 años de experiencia en el sector",
      "Servicio de atención al cliente y asesoramiento",
      "Tecnología y maquinaria propia de última generación",
      "Equipo profesional joven y dinámico en formación continua",
      "Cobertura en toda Catalunya y zonas colindantes",
      "Servicio de emergencia 24/365",
      "Seguridad: flota actualizada y Plan de Seguridad propio",
      "Compromiso con el medio ambiente (planta fotovoltaica desde 2008)",
      "Agilidad y eficacia administrativa"
    ],
    "aniversario": { "anios": 55, "fundacion": 1968, "fundador": "Jordi Gelabert", "nota": "Empresa familiar; nuevas adquisiciones LTM 1400-7.1, LTM 1090-4.2 y PALFINGER PK 1100." },
    "historia": {
      "resumen": "Fundada a finales de los años 60. Una de las empresas líder en alquiler de maquinaria de elevación en Catalunya.",
      "hitos": {
        "1968": "Fundación por D. Jordi Gelabert Jaurés. Primera grúa hidráulica autopropulsada de 15 Tn (inglesa).",
        "1969-1970": "Adquisición de 3 unidades más; grúas de hasta 30 Tn; ámbito regional.",
        "1973": "D. Juan Pratginestós Congost entra como socio; grúas de hasta 50 Tn.",
        "1975": "Traslado a las instalaciones actuales (5.000 m2); parque hasta 100 Tn, camiones pluma y trailers.",
        "1979": "Constitución como Sociedad Anónima — GRÚAS DEL VALLÉS, S.A. (CIF A08603888).",
        "1992-1999": "Adaptación Ley de Sociedades Anónimas; registros REIC, Automantenedora y Transporte Público.",
        "2002": "Inicio de trámites para Certificado ISO 9001.",
        "2004": "Adaptación LOPD; creación de la web corporativa; cursos OGMA-A/B.",
        "2005": "Homologada como centro formador OGMA por la Generalitat.",
        "2006": "Certificación ISO 9001:2000 (nº EC-5828/10).",
        "2008": "Registro REA nº 09000036812 (sector construcción).",
        "2009": "Puesta en marcha de la central fotovoltaica.",
        "actualidad": "Parque de grúas móviles autopropulsadas de 40 a 450 Tn, transportes, camiones grúa, trailers, góndolas, remolques y plataformas."
      }
    },
    "donde_estamos": { "direccion": "Avda. San Julián 64-66, Polígono Industrial Congost, Granollers (Barcelona)", "referencia": "A 2 minutos del Circuito de Montmeló", "accesos": "Carretera N-152 y AP-7" },
    "instalaciones": ["Taller mecánico", "Almacén de recambios", "Depósito de combustible", "Túnel de lavado", "Parque de estacionamiento", "Oficinas centrales", "Comedor y vestuarios"],
    "organismos": ["ANAGRUAL (Junta Directiva autonómica)", "TRANSCALIT (Federación Catalana de Transportes de Barcelona)", "Cruz Roja (Socio Colaborador desde 1997)"],
    "seguridad": "Empresa conservadora/auto-mantenedora de grúas (REIC 08/157.364, 1997). Registro REA nº 0900006812 (2008, renovado 2011). Adaptación L.O.P.D. en 2010."
  }
}
```

--------------------------------------------------------------------------------
5. JSON de Datos: Maniobras Ejemplo (Casos de Éxito)

Cada maniobra incluye título, descripción completa (extraída de su página de detalle) y las fotos asociadas. Las maniobras más recientes (3369–3354) son entradas de texto sin galería propia en la ficha de detalle.

```json
{
  "maniobras_ejemplo": [
    {
      "id": 3369,
      "titulo": "Rescate embarcación accidentada en Premià",
      "descripcion": "Maniobra muy delicada al tratarse de una embarcación antigua de madera que se hundió por completo a varios metros de la orilla, con lo cual añadía unos riesgos que precisaron de un estudio previo por parte de nuestro equipo técnico. El peso a izar se calculó en 150 toneladas, y se tuvieron que utilizar 2 grúas de grandes dimensiones para realizar la extracción con máximas garantías. Nuestras grúas Liebherr LTM 1500 – 8.1 equipada con 165 ton de contrapesos, y Liebherr LTM 1400 – 7.1 equipada con 140 ton de contrapesos ocuparon parte del protagonismo en dicho rescate. Además, se requirieron horas de trabajos previos con buzos especialistas encargados del balizado y enganche de la embarcación. Para satisfacción de todos los implicados la operación fue un éxito. Orgullosos como siempre de nuestro equipo humano, que dirigido por nuestro técnico curtido en mil batallas pudo añadir una hazaña más a nuestra larga trayectoria en el sector.",
      "imagenes": [],
      "href": "main.asp?pagina=pdetall&pdetall=3369"
    },
    {
      "id": 3364,
      "titulo": "Colaboración para el REGGAETON BEACH FESTIVAL",
      "descripcion": "Colaboramos con una de nuestras grúas en el montaje de escenario para el REGGAETON BEACH FESTIVAL que se ha celebrado recientemente en el recinto del Forum de Barcelona. ¡Que no pare la marcha!",
      "imagenes": [],
      "href": "main.asp?pagina=pdetall&pdetall=3364"
    },
    {
      "id": 3362,
      "titulo": "Subiendo equipos en el Hospital de Granollers",
      "descripcion": "Nuestra empresa participa en la instalación de nuevos equipos de aire en el Hospital de Granollers, con el izado de 3 unidades modernas que ha aportado nuestro cliente para la adecuación del complejo. En esta ocasión hemos utilizado nuestra grúa Liebherr LTM 1090 4.2 para izar los equipos.",
      "imagenes": [],
      "href": "main.asp?pagina=pdetall&pdetall=3362"
    },
    {
      "id": 3359,
      "titulo": "Montaje de grúa torre a 88 metros de altura",
      "descripcion": "Maniobra de ejemplo en trabajo de montaje de grúa torre a 88 metros de altura con nuestra grúa LTM 1350, equipada con 120 toneladas de contrapesos y 30 metros de plumín fijo.",
      "imagenes": [],
      "href": "main.asp?pagina=pdetall&pdetall=3359"
    },
    {
      "id": 3355,
      "titulo": "Colocar máquina de pilotes 65Tn",
      "descripcion": "Colocar máquina de pilotes con un peso 65 toneladas, grúa equipada con 100 toneladas de contrapesos.",
      "imagenes": [],
      "href": "main.asp?pagina=pdetall&pdetall=3355"
    },
    {
      "id": 3356,
      "titulo": "Reparaciones en parque eólico",
      "descripcion": "Movimiento de aspas y equipos auxiliares para molino de viento, se requiere utilizar una grúa configurada con 70 toneladas de contrapesos y 28 metros de plumines.",
      "imagenes": [],
      "href": "main.asp?pagina=pdetall&pdetall=3356"
    },
    {
      "id": 3354,
      "titulo": "Montaje de grúa torre de 112 mts",
      "descripcion": "Montaje de grúa torre de 112 mts de altura, se requiere equipar nuestra grúa móvil con 100 toneladas de contrapesos y 77 metros de plumín arriostrado.",
      "imagenes": [],
      "href": "main.asp?pagina=pdetall&pdetall=3354"
    },
    {
      "id": 3351,
      "titulo": "Colocar módulos de 6 toneladas de peso",
      "descripcion": "Colocación de módulos a un radio de 88 metros, se requiere equipar la grúa con 140 toneladas de contrapesos y 82 metros de plumín abatible (full equip).",
      "imagenes": [
        "https://www.gruasdelvalles.com/upfiles/Maniobra6Tn_Abril1.jpg",
        "https://www.gruasdelvalles.com/upfiles/Maniobra6Tn_Abril2.jpg"
      ],
      "href": "main.asp?pagina=pdetall&pdetall=3351"
    },
    {
      "id": 3349,
      "titulo": "Colocar equipo de 25 toneladas de peso",
      "descripcion": "Colocar un equipo de 25 toneladas de peso a un radio de 61 metros. Se requieren 140 toneladas de contrapesos y 63 metros de plumines para equipar nuestra grúa.",
      "imagenes": [
        "https://www.gruasdelvalles.com/upfiles/Maniobra25Tn1.jpg",
        "https://www.gruasdelvalles.com/upfiles/Maniobra25Tn2.jpg",
        "https://www.gruasdelvalles.com/upfiles/Maniobra25Tn3.jpg"
      ],
      "href": "main.asp?pagina=pdetall&pdetall=3349"
    },
    {
      "id": 3346,
      "titulo": "Colocación maquinaria 15 toneladas",
      "descripcion": "Colocar maquinaria de 15 toneladas de peso a 32 metros de radio. Se utiliza pluma normal.",
      "imagenes": [
        "https://www.gruasdelvalles.com/upfiles/Maniobra_Maquinaria15TN_Septiembre2016_G.jpg"
      ],
      "href": "main.asp?pagina=pdetall&pdetall=3346"
    },
    {
      "id": 3348,
      "titulo": "Colocar jácenas de 14 toneladas de peso",
      "descripcion": "Colocar jácenas de 14 toneladas de peso a 48 metros de radio. Se utiliza 140 toneladas de contrapesos, pluma normal con superlift y 7 metros de plumín fijo.",
      "imagenes": [
        "https://www.gruasdelvalles.com/upfiles/Maniobra_Jacenas14Tn_G.jpg",
        "https://www.gruasdelvalles.com/upfiles/Maniobra_Jacenas14Tn_G1.jpg"
      ],
      "href": "main.asp?pagina=pdetall&pdetall=3348"
    },
    {
      "id": 3347,
      "titulo": "Colocación tramel de 15 Tn",
      "descripcion": "Colocar tramel de 15 toneladas de peso a 48 metros de radio. Se utiliza 140 toneladas de contrapesos, 60 metros de pluma y superlift.",
      "imagenes": [
        "https://www.gruasdelvalles.com/upfiles/Maniobra_Tramel14TN_G2.jpg",
        "https://www.gruasdelvalles.com/upfiles/Maniobra_Tramel14TN_G3.jpg",
        "https://www.gruasdelvalles.com/upfiles/Maniobra_Tramel14TN_G4.jpg"
      ],
      "href": "main.asp?pagina=pdetall&pdetall=3347"
    }
  ]
}
```

--------------------------------------------------------------------------------
6. JSON de Datos: Fotos y Videos (Galerías por categoría)

```json
{
  "fotos_y_videos": [
    { "categoria": "Industria", "href": "main.asp?pagina=pdetall&pdetall=3341" },
    { "categoria": "Puentes/Pasarelas", "href": "main.asp?pagina=pdetall&pdetall=3338" },
    { "categoria": "Eventos", "href": "main.asp?pagina=pdetall&pdetall=3339" },
    { "categoria": "Rescates", "href": "main.asp?pagina=pdetall&pdetall=3340" },
    { "categoria": "Construcción", "href": "main.asp?pagina=pdetall&pdetall=3342" },
    { "categoria": "Otros", "href": "main.asp?pagina=pdetall&pdetall=3330" }
  ]
}
```

--------------------------------------------------------------------------------
7. JSON de Datos: Blog (Noticias)

```json
{
  "blog": [
    { "titulo": "Nueva Grúa GMK 4080L (80 T)", "href": "main.asp?pagina=pdetall&pdetall=3371" },
    { "titulo": "Nueva adquisición: Grúa GROVE GMK 80 T", "descripcion": "Pluma telescópica de 60 m.", "href": "main.asp?pagina=pdetall&pdetall=3370" },
    { "titulo": "Nueva Grúa Spierings SK1265-AT6", "href": "main.asp?pagina=pdetall&pdetall=3366" },
    { "titulo": "Grúa LIEBHERR MK 88-4.1 para Construcción", "href": "main.asp?pagina=pdetall&pdetall=3365" },
    { "titulo": "Nueva Grúa Grove GMK 3060 l-1 (60 TM)", "descripcion": "48 m de pluma telescópica y plumín de 15 m angulable a 40º.", "href": "main.asp?pagina=pdetall&pdetall=3363" },
    { "titulo": "Instalación equipos en Hospital de Granollers", "href": "main.asp?pagina=pdetall&pdetall=3361" },
    { "titulo": "¡Nueva adquisición! Grúa 400tn", "descripcion": "LIEBHERR LTM 1.400-7.1.", "href": "main.asp?pagina=pdetall&pdetall=3343" },
    { "titulo": "Colaboración homenaje Santi Santamaria", "href": "main.asp?pagina=pdetall&pdetall=3344" },
    { "titulo": "Grúas del Vallés inscrita en el RELI", "descripcion": "Desde el 24 de julio de 2013.", "href": "main.asp?pagina=pdetall&pdetall=3337" },
    { "titulo": "Colocación modulos en Hospitalet", "href": "main.asp?pagina=pdetall&pdetall=3336" },
    { "titulo": "Colocación paneles Novartis", "href": "main.asp?pagina=pdetall&pdetall=3335" },
    { "titulo": "Desmontaje Mercat dels Encants", "href": "main.asp?pagina=pdetall&pdetall=3334" }
  ]
}
```

--------------------------------------------------------------------------------
8. JSON de Datos: Contacto y Ubicación

```json
{
  "contacto": {
    "direccion": "Avda. San Julián 64-66, Polígono Industrial Congost, 08403 Granollers (Barcelona)",
    "telefono": "+34 93 849 70 22",
    "emergencias": ["669 29 69 54", "669 29 69 49"],
    "email": "gruasdelvalles@gruasdelvalles.com",
    "referencia": "A dos minutos del Circuito de Montmeló"
  }
}
```