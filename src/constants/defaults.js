export const DEFAULT_CONTENT = {
  brand: { logoUrl: "", siteName: "Casa ASOL" },
  topbar: {
    address: "01 A Calle 09-34, Ciudad de Guatemala, 01016, Guatemala",
    locationUrl: "",
    phone: "(+502) 2255 9450",
    facebook: "https://www.facebook.com/CasaASOL/",
    linkedin: "https://www.linkedin.com/company/112347752/",
    instagram: "https://threads.instagram.com/casaestudiantilasol/",
  },
  hero: {
    bgUrl: "",
    images: [],
    title: "CASA ESTUDIANTIL ASOL",
    subtitle: "Promovemos el desarrollo integral, la educación y la protección de mujeres adolescentes indígenas en situación de vulnerabilidad en Guatemala.",
    btn1Text: "CONOCER MÁS",
    btn1Href: "#programa",
    btn2Text: "AYUDAR Y DONAR",
    btn2Href: "#financiacion",
    buttons: [
      { text: "CONOCER MÁS",  href: "#programa",     style: "primary" },
      { text: "AYUDAR Y DONAR", href: "#financiacion", style: "outline" },
    ],
  },
  historia: {
    supertitle: "NUESTRA HISTORIA",
    title: "Un sueño que se convirtió en hogar",
    paragraphs: [
      "Casa ASOL nació en 2009 con la misión de brindar un espacio seguro para niños y jóvenes guatemaltecos en situación de vulnerabilidad. Fundada por un grupo de voluntarios austriacos y guatemaltecos, la casa comenzó con tan solo 8 estudiantes en una pequeña vivienda de la Zona 16.",
      "Con el paso de los años, ASOL ha crecido hasta convertirse en un referente de protección estudiantil en Guatemala, combinando el apoyo académico, emocional y social para garantizar que cada niño tenga la oportunidad de construir un futuro digno.",
    ],
    quote: "Cada niño que llega a ASOL trae consigo una historia de resiliencia. Nuestro trabajo es asegurarnos de que esa historia tenga un final brillante.",
    quoteAuthor: "— Fundadora, Casa ASOL",
    imageUrl: "",
    images: [],
  },
  financiacion: {
    supertitle: "AYUDAR Y DONAR",
    title: "Tu apoyo cambia vidas",
    desc: "La Casa Estudiantil ASOL brinda a alrededor de 20 adolescentes y jóvenes de entre 14 y 20 años, provenientes de contextos de vulnerabilidad, exclusión o riesgo, la oportunidad de acceder a una educación de calidad y construir un proyecto de vida digno y sostenible.",
    amounts: ["€100 / mes", "€150 / mes", "€300 / mes", "Otra cantidad"],
    btnText: "DONAR AHORA",
    docUrl: "",
    docLabel: "Ver cuentas para depósito",
    paymentEnabled: false,
    donacionImages: [],
    bank: {
      heading: "¿Quiere ayudar? ¡Es muy fácil!",
      intro: "¿Hemos despertado su interés por el apadrinamiento, o quiere apoyar a los niños de alguna otra manera? Simplemente póngase en contacto con nosotros.",
      accountHolder: "Solidarität mit Lateinamerika-CHE",
      bankName: "Raiffeisenbank Graz-St. Peter",
      accountNumber: "50.9513",
      bankCode: "38367",
      iban: "AT59 3836 7000 0050 9513",
      bic: "RZSTAT2G367",
      reference: "Casa Hogar Estudiantil",
      note: "Su donación es deducible de impuestos.",
    },
    patrocinioIndividual: {
      heading: "Patrocinio Individual",
      intro: "Apoyo de una adolescente por mes:",
      monthly: [
        { label: "Atención integral en Casa ASOL", eur: "300", gtq: "2400" },
        { label: "Educación y alimentación en Casa ASOL", eur: "200", gtq: "1600" },
        { label: "Educación en Casa ASOL", eur: "100", gtq: "800" },
        { label: "Beca externa", eur: "60", gtq: "480" },
      ],
      individualHeading: "Apoyos individuales:",
      individual: [
        { label: "10 atenciones psicológicas", eur: "50", gtq: "400" },
        { label: "1 Excursión", eur: "200", gtq: "1600" },
        { label: "1 Mantenimiento de techo", eur: "500", gtq: "4000" },
        { label: "1 Filtro de agua", eur: "200", gtq: "1600" },
      ],
    },
    patrocinioEmpresarial: {
      heading: "Patrocinio empresarial",
      text: "ASOL invita a empresas y organizaciones a sumarse como aliadas estratégicas en la promoción de oportunidades para mujeres adolescentes indígenas. Las contribuciones empresariales permiten fortalecer el funcionamiento de la Casa Estudiantil, financiar programas educativos y de formación para el empleo, brindar atención psicosocial especializada, mejorar la infraestructura y cubrir necesidades de mantenimiento y equipamiento. Las empresas interesadas pueden conocer las diferentes modalidades de colaboración en nuestro portafolio de donaciones corporativas.",
    },
    donacionesEspecie: {
      heading: "Donaciones en especie",
      text: "ASOL recibe donaciones en especie que contribuyen a mejorar las condiciones de vida, aprendizaje y desarrollo de las adolescentes participantes. Se agradecen especialmente libros, computadoras, mobiliario, electrodomésticos, ropa y otros artículos en buen estado que puedan ser utilizados en la Casa Estudiantil o en los programas de apoyo educativo, tecnológico y formativo.",
    },
    practicasEps: {
      heading: "Prácticas y EPS",
      text: "ASOL ofrece espacios para la realización de prácticas profesionales, universitarias y de Ejercicio Profesional Supervisado (EPS) en diversas disciplinas, especialmente Psicología, Trabajo Social, Pedagogía y áreas afines. Las y los estudiantes aplican sus conocimientos, desarrollan proyectos y adquieren experiencia profesional en un entorno de aprendizaje supervisado, mientras contribuyen a la protección, promoción y restitución de los derechos de adolescentes en situación de vulnerabilidad.",
    },
  },
  voluntariado: {
    supertitle: "VOLUNTARIADO",
    title: "Únete como voluntario",
    desc: "Buscamos personas nacionales e internacionales, mayores de 18 años y con conocimientos básicos de español, que quieran contribuir al desarrollo integral de nuestras adolescentes y jóvenes. Modalidad independiente desde 2 meses, o de largo plazo a través del Servicio Austriaco en el Extranjero.",
    list: [
      "Acompañamiento escolar y tutorías",
      "Actividades recreativas y formativas",
      "Apoyo en la panadería social",
      "Gestión de fondos y comunicación institucional",
      "Centro de Aprendizaje Tecnológico y Ecológico",
    ],
    btnText: "QUIERO VOLUNTARIAR",
    images: [],
  },
  contacto: {
    supertitle: "CONTACTO",
    title: "Ponte en contacto con nosotros",
    items: [
      { icon: "location", title: "Dirección", val: "01 A Calle 09-34, Ciudad de Guatemala, 01016, Guatemala" },
      { icon: "phone",    title: "Teléfono", val: "(+502) 2255 9450 · 5926 2580 · 5396 7179" },
      { icon: "mail",     title: "Correo", val: "asolguate1990@gmail.com · direccion@asol-onmicrosoft.com" },
      { icon: "clock",    title: "Horario", val: "Lunes a Viernes, 8:00 – 17:00 hrs" },
    ],
  },
  footer: {
    desc: "Educación, protección y desarrollo integral para mujeres adolescentes indígenas en Guatemala, a través de la Casa Estudiantil ASOL desde 1992.",
  },
};

export const DEFAULT_STATS = [
  { id: 1, value: "500+", label: "Adolescentes y jóvenes acompañados desde 1992" },
  { id: 2, value: "34+",  label: "Años de trabajo ininterrumpido" },
  { id: 3, value: "45",   label: "Voluntarios activos" },
  { id: 4, value: "98%",  label: "Tasa de continuidad escolar" },
];

export const DEFAULT_PROGRAMA = [
  {
    id: 1, icon: "home", title: "Casa Estudiantil ASOL",
    desc: "Nuestro principal mecanismo de protección: un hogar seguro y temporal para adolescentes y jóvenes mientras superan las condiciones de riesgo que motivaron su ingreso. Brinda educación, atención psicológica, formación en derechos humanos y fortalecimiento de la identidad cultural, con miras a la reintegración familiar o la autonomía.",
    images: [],
    full: [
      "Casa ASOL constituye el principal mecanismo de protección especializada dentro de las estrategias de trabajo de la asociación. Funciona como un espacio seguro, abierto y protector donde adolescentes y jóvenes pueden residir temporalmente mientras se superan las condiciones de riesgo que motivaron su ingreso. Implementa un modelo de atención integral que se fundamenta en el enfoque de derechos humanos, el interés superior de la niñez y adolescencia, la igualdad de género, la protección integral, la pertinencia cultural, la participación juvenil y el fortalecimiento de las capacidades individuales, familiares y comunitarias. El modelo concibe a las y los jóvenes como sujetos de derechos y protagonistas de su propio desarrollo, promoviendo la construcción de proyectos de vida autónomos, sostenibles y libres de violencia. Su finalidad es prevenir la profundización de situaciones de vulnerabilidad, garantizar el acceso a servicios de protección y educación de calidad, y facilitar procesos progresivos de reintegración familiar, inclusión social y autonomía económica.",
      "En este entorno reciben:",
      "•Acceso a educación formal y apoyo académico.",
      "•Atención psicológica individual y grupal.",
      "•Desarrollo de habilidades para la vida y liderazgo juvenil.",
      "•Formación en derechos humanos, igualdad de género y prevención de violencia.",
      "•Fortalecimiento de la identidad cultural y la pertenencia comunitaria.",
      "•Orientación vocacional y preparación para el empleo.",
      "•Trabajo con familias para fortalecer entornos protectores.",
      "El hogar no busca sustituir permanentemente a la familia, sino brindar una medida temporal de protección que permita fortalecer las capacidades personales y crear condiciones favorables para la reintegración familiar o la transición hacia la autonomía.",
    ],
  },
  {
    id: 2, icon: "users", title: "Reintegración Familiar",
    desc: "Becas externas para jóvenes que pueden permanecer en sus comunidades pero enfrentan barreras económicas para estudiar. Incluyen formación mensual en ciudadanía, derechos y autocuidado, además de un encuentro anual entre becadas externas e internas.",
    images: [],
    full: [
      "La segunda línea de atención está conformada por el programa de becas externas que constituye una herramienta clave dentro de las estrategias de egreso, asegurando la continuidad educativa de quienes retornan al entorno familiar. Está dirigido a jóvenes que cuentan con condiciones familiares adecuadas para permanecer en sus comunidades, pero enfrentan barreras económicas o sociales para continuar sus estudios, después de haber vivido situaciones de violencia, vulnerabilidad o exclusión social.",
      "Las becas cubren necesidades educativas y facilitan el acceso y permanencia en el sistema educativo, contribuyendo simultáneamente al fortalecimiento familiar y comunitario. Se acompañan con procesos de formación virtual una vez al mes por 2 horas en ciudadanía, derechos individuales y colectivos, autoestima, autocuidado y atención psicológica en línea según las necesidades individuales. Una vez al año se realiza un encuentro presencial entre las becadas externas e internas para intercambiar experiencias.",
    ],
  },
  {
    id: 3, icon: "utensils", title: "Vida Independiente",
    desc: "Alojamiento seguro a bajo costo y formación técnica y ocupacional —como panadería y pastelería— para que las participantes adquieran experiencia laboral, generen ingresos propios y construyan proyectos de vida libres de violencia.",
    images: [],
    full: [
      "Esta línea ofrece apoyo mediante espacios seguros de alojamiento a costo bajo y procesos de formación técnica y ocupacional. A través de iniciativas productivas como la panadería y pastelería, las participantes adquieren competencias laborales, experiencia práctica y habilidades para la gestión de ingresos, fortaleciendo su autonomía económica y su capacidad de construir proyectos de vida libres de violencia.",
      "Como para muchas mujeres sobrevivientes de violencia la integración laboral es sumamente difícil, especialmente si tienen a su cargo menores de edad, se ofrece un programa de integración laboral asistida, en cuyo marco las mujeres pueden trabajar en la panadería de ASOL para generar un ingreso en un entorno seguro y acompañado. La Panadería ASOL actualmente produce el pan que se consume en Casa ASOL y próximamente ampliará su producción para realizar ventas externas.",
    ],
  },
  {
    id: 4, icon: "compass", title: "Proyección Comunitaria",
    desc: "Alianzas con actores locales para prevenir la violencia y la exclusión mediante talleres, refuerzo académico y actividades culturales. Incluye nuestro Centro de Aprendizaje Ecológico y Tecnológico, con paneles solares, biodigestores y eco-senderos.",
    images: [],
    full: [
      "La cuarta línea de acción amplía el impacto del modelo de protección hacia la comunidad mediante alianzas con actores locales, como la Iglesia Católica, el Instituto por Cooperativa de Santa Rosita y otras organizaciones comunitarias y educativas. Estas alianzas generan oportunidades educativas, formativas y recreativas para prevenir la violencia de género, la exclusión social y el reclutamiento de adolescentes y jóvenes por pandillas.",
      "Las acciones incluyen reforzamiento académico, orientación vocacional y ocupacional con enfoque de género, talleres sobre derechos humanos, equidad de género y prevención de violencia, así como actividades culturales, deportivas y recreativas en los espacios de ASOL. Asimismo, en coordinación con los socios locales se desarrollan cursos de capacitación laboral y formación técnica que fortalecen las oportunidades de empleo, emprendimiento y autonomía económica de la juventud.",
      "La protección ecológica del barranco donde se ubica Casa ASOL constituye un componente central de esta línea de acción. ASOL promueve la conservación ambiental, la economía circular y el uso de tecnologías sostenibles mediante la instalación de paneles solares para agua caliente y generación de electricidad, biodigestores para el manejo responsable de residuos y la creación de eco-senderos, todo accesible en nuestro Centro de Aprendizaje Ecológico y Tecnológico. Este espacio fomenta la educación ambiental, el conocimiento de energías renovables, la reparación de aparatos electrónicos y la gestión sostenible de los recursos, contribuyendo a comunidades más resilientes y ecológicas. Así, un barranco urbano vulnerable se convierte en un laboratorio vivo de aprendizaje, acción climática y protección ambiental.",
    ],
  },
];

export const DEFAULT_TEAM = [
  { id: 1, initials: "DT", name: "Dirección Técnica y Programática", role: "Conduce la visión institucional y el diseño de los programas de ASOL", photos: [] },
  { id: 2, initials: "AI", name: "Asesora Institucional",            role: "Acompaña la gestión estratégica y el fortalecimiento organizacional", photos: [] },
  { id: 3, initials: "TA", name: "Tutora Académica",                 role: "Apoyo escolar y seguimiento educativo de las participantes", photos: [] },
  { id: 4, initials: "TS", name: "Trabajadora Social",               role: "Acompañamiento a familias en situación vulnerable", photos: [] },
  { id: 5, initials: "PS", name: "Psicóloga",                        role: "Atención emocional y terapéutica individual y grupal", photos: [] },
];

export const DEFAULT_NAV = [
  { id: "home",     label: "HOME",           href: "#home",    enabled: true },
  { id: "asol",     label: "ASOL",                             enabled: true, dropdown: [
    { id: "programa",     label: "PROGRAMA",     href: "#programa",     enabled: true },
    { id: "equipo",       label: "EQUIPO",       href: "#equipo",       enabled: true },
    { id: "historia",     label: "HISTORIA",     href: "#historia",     enabled: true },
  ]},
  { id: "ayudar",   label: "AYUDAR Y DONAR",                   enabled: true, dropdown: [
    { id: "patrocinio-individual",   label: "Patrocinio Individual",   href: "#patrocinio-individual",   enabled: true },
    { id: "patrocinio-empresarial",  label: "Patrocinio empresarial",  href: "#patrocinio-empresarial",  enabled: true },
    { id: "donaciones-especie",      label: "Donaciones en especie",   href: "#donaciones-especie",      enabled: true },
    { id: "practicas-eps",           label: "Prácticas y EPS",         href: "#practicas-eps",           enabled: true },
    { id: "voluntariados",           label: "Voluntariados",           href: "#voluntariado",            enabled: true },
  ]},
  { id: "contacto", label: "CONTACTO", href: "#contacto", enabled: true },
];

export const DEFAULT_SECTIONS = [
  { id: "home",         label: "Hero / Inicio",         visible: true },
  { id: "stats",        label: "Estadísticas",          visible: true },
  { id: "historia",     label: "Historia",              visible: true },
  { id: "programa",     label: "Programa",              visible: true },
  { id: "equipo",       label: "Equipo",                visible: true },
  { id: "financiacion", label: "Financiación",          visible: true },
  { id: "voluntariado", label: "Voluntariado",          visible: true },
  { id: "contacto",     label: "Contacto",              visible: true },
];
