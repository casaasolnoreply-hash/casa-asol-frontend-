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
  { id: 1, icon: "home",    title: "Casa Estudiantil ASOL", desc: "Nuestro principal mecanismo de protección: un hogar seguro y temporal para adolescentes y jóvenes mientras superan las condiciones de riesgo que motivaron su ingreso. Brinda educación, atención psicológica, formación en derechos humanos y fortalecimiento de la identidad cultural, con miras a la reintegración familiar o la autonomía.", images: [] },
  { id: 2, icon: "users",   title: "Reintegración Familiar", desc: "Becas externas para jóvenes que pueden permanecer en sus comunidades pero enfrentan barreras económicas para estudiar. Incluyen formación mensual en ciudadanía, derechos y autocuidado, además de un encuentro anual entre becadas externas e internas.", images: [] },
  { id: 3, icon: "utensils", title: "Vida Independiente",   desc: "Alojamiento seguro a bajo costo y formación técnica y ocupacional —como panadería y pastelería— para que las participantes adquieran experiencia laboral, generen ingresos propios y construyan proyectos de vida libres de violencia.", images: [] },
  { id: 4, icon: "compass", title: "Proyección Comunitaria", desc: "Alianzas con actores locales para prevenir la violencia y la exclusión mediante talleres, refuerzo académico y actividades culturales. Incluye nuestro Centro de Aprendizaje Ecológico y Tecnológico, con paneles solares, biodigestores y eco-senderos.", images: [] },
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
  { id: "la-casa",  label: "LA CASA",                          enabled: true, dropdown: [
    { id: "equipo",       label: "EL EQUIPO",    href: "#equipo",       enabled: true },
    { id: "historia",     label: "HISTORIA",     href: "#historia",     enabled: true },
    { id: "programa",     label: "PROGRAMA",     href: "#programa",     enabled: true },
  ]},
  { id: "ayudar",   label: "AYUDAR Y DONAR",                   enabled: true, dropdown: [
    { id: "financiacion",  label: "FINANCIACIÓN",  href: "#financiacion",  enabled: true },
    { id: "voluntariado",  label: "VOLUNTARIADO",  href: "#voluntariado",  enabled: true },
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
