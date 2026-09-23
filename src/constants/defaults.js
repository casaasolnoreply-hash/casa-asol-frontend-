export const DEFAULT_CONTENT = {
  brand: { logoUrl: "" },
  topbar: {
    address: "10a Calle 2-25, Zona 16, Santa Rosita, 01016 Guatemala",
    locationUrl: "",
    phone: "(+502) 2255 9450",
    facebook: "",
    linkedin: "",
    instagram: "",
  },
  hero: {
    bgUrl: "",
    images: [],
    title: "CASA ESTUDIANTIL ASOL",
    subtitle: "Oportunidades y protección para los niños frente a desventaja y violencia.",
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
    desc: "Con tu donación mensual ayudas a garantizar educación, alimentación y un hogar seguro para niños guatemaltecos en situación de vulnerabilidad.",
    amounts: ["Q50 / mes", "Q100 / mes", "Q250 / mes", "Otra cantidad"],
    btnText: "DONAR AHORA",
    docUrl: "",
    docLabel: "Ver cuentas para depósito",
    paymentEnabled: false,
    donacionImages: [],
  },
  voluntariado: {
    supertitle: "VOLUNTARIADO",
    title: "Únete como voluntario",
    desc: "Buscamos personas comprometidas que quieran dedicar su tiempo y talento a transformar la vida de niños y jóvenes guatemaltecos.",
    list: [
      "Apoyo educativo (tutorías y refuerzo)",
      "Talleres de arte y manualidades",
      "Actividades deportivas y recreativas",
      "Asistencia administrativa y comunicación",
    ],
    btnText: "QUIERO VOLUNTARIAR",
    images: [],
  },
  contacto: {
    supertitle: "CONTACTO",
    title: "Ponte en contacto con nosotros",
    items: [
      { icon: "location", title: "Dirección", val: "10a Calle 2-25, Zona 16, Santa Rosita, 01016 Guatemala" },
      { icon: "phone",    title: "Teléfono", val: "(+502) 2255 9450" },
      { icon: "mail",     title: "Correo", val: "info@casaasol.org" },
      { icon: "clock",    title: "Horario", val: "Lunes a Viernes, 8:00 – 17:00 hrs" },
    ],
  },
  footer: {
    desc: "Oportunidades y protección para los niños frente a desventaja y violencia desde 2009.",
  },
};

export const DEFAULT_STATS = [
  { id: 1, value: "120+", label: "Estudiantes beneficiados" },
  { id: 2, value: "15",   label: "Años de operación" },
  { id: 3, value: "45",   label: "Voluntarios activos" },
  { id: 4, value: "98%",  label: "Tasa de continuidad escolar" },
];

export const DEFAULT_PROGRAMA = [
  { id: 1, icon: "book",     title: "Apoyo Escolar",       desc: "Refuerzo académico diario para niños de primaria y básicos.", images: [] },
  { id: 2, icon: "home",     title: "Alojamiento Seguro",  desc: "Espacio de protección para estudiantes en riesgo de violencia.", images: [] },
  { id: 3, icon: "utensils", title: "Alimentación",        desc: "Tres comidas balanceadas al día para todos los residentes.", images: [] },
  { id: 4, icon: "palette",  title: "Arte y Deporte",      desc: "Actividades extracurriculares para el desarrollo integral.", images: [] },
];

export const DEFAULT_TEAM = [
  { id: 1, initials: "DG", name: "Directora General",         role: "Responsable de la visión y gestión de la casa", photos: [] },
  { id: 2, initials: "CP", name: "Coordinadora Pedagógica",   role: "Diseño y seguimiento de programas educativos", photos: [] },
  { id: 3, initials: "TS", name: "Trabajadora Social",        role: "Acompañamiento a familias en situación vulnerable", photos: [] },
  { id: 4, initials: "PC", name: "Psicóloga Clínica",         role: "Apoyo emocional y terapéutico a los estudiantes", photos: [] },
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
