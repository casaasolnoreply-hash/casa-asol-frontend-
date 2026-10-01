// Diccionario de traducción ES/EN/DE.
// ES es el idioma "fuente de verdad": siempre se lee en vivo desde `content`/`programa`/`team`
// (lo que el admin edita desde el panel). EN/DE son una traducción fija de ese contenido:
// si el admin edita el texto en español más adelante, hay que actualizar también esta traducción,
// no se regenera sola.

export const LANGUAGES = ["es", "en", "de"];

// Nombre de cada idioma en sí mismo (no traducido al idioma activo), como
// en casi cualquier selector de idioma real: siempre reconocible sin
// importar en qué idioma esté viendo el sitio la persona.
export const LANGUAGE_NAMES = { es: "Español", en: "English", de: "Deutsch" };

// Texto de la banda que sugiere cambiar de idioma según el navegador del
// visitante — se muestra EN el idioma sugerido (si alguien tiene el
// navegador en alemán, tiene más sentido preguntarle en alemán).
export const SUGGEST_BANNER = {
  en: {
    text: "It looks like your browser is set to English. View this site in English?",
    accept: "Yes, switch to English",
    dismiss: "No, keep Spanish",
  },
  de: {
    text: "Es sieht so aus, als wäre Ihr Browser auf Deutsch eingestellt. Möchten Sie die Seite auf Deutsch ansehen?",
    accept: "Ja, auf Deutsch anzeigen",
    dismiss: "Nein, bei Spanisch bleiben",
  },
};

// Lee el/los idioma(s) configurados en el navegador del visitante y devuelve
// "en" o "de" si coincide con alguno de los que soportamos (para sugerir el
// cambio), o null si no aplica (ya está en español, o es otro idioma que no
// manejamos — en ese caso simplemente se deja el español por defecto).
export function detectBrowserLanguage() {
  if (typeof navigator === "undefined") return null;
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language].filter(Boolean);
  for (const l of langs) {
    const code = l.toLowerCase().slice(0, 2);
    if (code === "de") return "de";
    if (code === "en") return "en";
    if (code === "es") return null; // ya está en el idioma por defecto
  }
  return null;
}

export const CURRENCY_BY_LANG = { es: "GTQ", en: "USD", de: "EUR" };
const EUR_TO_USD = 1.08;

// Formatea un monto que viene con su valor en euros y en quetzales,
// mostrando la moneda que corresponde según el idioma activo.
export function formatAmount(eur, gtq, lang) {
  const n = Number(eur);
  if (lang === "es") return `Q${gtq}`;
  if (lang === "de") return `€${eur}`;
  return `$${Math.round(n * EUR_TO_USD)}`;
}

export const UI = {
  es: {
    nav: {
      home: "HOME", asol: "ASOL", programa: "PROGRAMA", equipo: "EQUIPO", historia: "HISTORIA",
      ayudar: "AYUDAR Y DONAR", contacto: "CONTACTO",
      "patrocinio-individual": "Patrocinio Individual", "patrocinio-empresarial": "Patrocinio empresarial",
      "donaciones-especie": "Donaciones en especie", "practicas-eps": "Prácticas y EPS", "voluntariados": "Voluntariados",
    },
    topbar: { direccion: "Dirección", telefono: "Teléfono", login: "Iniciar sesión", admin: "Panel admin", guardando: "Guardando..." },
    common: { verMas: "Ver más", chooseLanguage: "Elige tu idioma" },
    hero: { btn1: "CONOCER MÁS", btn2: "AYUDAR Y DONAR" },
    stats: { modalTitle: "Estadísticas" },
    programa: { kicker: "NUESTRO PROGRAMA", heading: "Cómo transformamos vidas", leerMas: "Leer más" },
    equipo: { kicker: "NUESTRO EQUIPO", heading: "Las personas detrás de ASOL", suLabor: (name) => `SU LABOR EN ${name.toUpperCase()}` },
    historia: {},
    financiacion: {
      comoDonar: "¿CÓMO DONAR?",
      bankLabels: { Titular: "Titular", Banco: "Banco", "N.º de cuenta": "N.º de cuenta", "Código bancario": "Código bancario", IBAN: "IBAN", BIC: "BIC", Referencia: "Referencia" },
    },
    voluntariado: {
      cta: "QUIERO VOLUNTARIAR",
      formTitle: "Registrarme como voluntario",
      nombre: "NOMBRE COMPLETO *", nombrePh: "Tu nombre",
      correo: "CORREO ELECTRÓNICO *", correoPh: "tu@correo.com",
      telefono: "TELÉFONO", telefonoPh: "(+502) 0000-0000",
      area: "ÁREA DE INTERÉS", seleccionar: "Seleccionar...",
      areas: ["Apoyo educativo", "Arte y manualidades", "Deporte", "Administración"],
      enviando: "Enviando...", enviar: "ENVIAR SOLICITUD",
      recibido: "¡Solicitud recibida!", contactaremos: "Te contactaremos pronto.",
    },
    contacto: {
      nombrePh: "Nombre *", correoPh: "Correo electrónico *", asuntoPh: "Asunto", mensajePh: "Mensaje *",
      enviando: "Enviando...", enviar: "ENVIAR MENSAJE",
      enviado: "¡Mensaje enviado!", pondremos: "Nos pondremos en contacto contigo pronto.",
      itemTitles: { location: "Dirección", phone: "Teléfono", mail: "Correo", clock: "Horario" },
    },
    footer: {
      col1: "ASOL", links1: ["El Equipo", "Historia", "Programa"],
      col2: "AYUDAR", links2: ["Financiación", "Voluntariado"],
      col3: "CONTACTO", rights: "Todos los derechos reservados.",
    },
  },

  en: {
    nav: {
      home: "HOME", asol: "ASOL", programa: "PROGRAM", equipo: "TEAM", historia: "HISTORY",
      ayudar: "HELP & DONATE", contacto: "CONTACT",
      "patrocinio-individual": "Individual Sponsorship", "patrocinio-empresarial": "Corporate Sponsorship",
      "donaciones-especie": "In-kind Donations", "practicas-eps": "Internships", "voluntariados": "Volunteering",
    },
    topbar: { direccion: "Address", telefono: "Phone", login: "Sign in", admin: "Admin panel", guardando: "Saving..." },
    common: { verMas: "View more", chooseLanguage: "Choose your language" },
    hero: { btn1: "LEARN MORE", btn2: "HELP & DONATE" },
    stats: { modalTitle: "Statistics" },
    programa: { kicker: "OUR PROGRAM", heading: "How we transform lives", leerMas: "Read more" },
    equipo: { kicker: "OUR TEAM", heading: "The people behind ASOL", suLabor: (name) => `THEIR WORK AT ${name.toUpperCase()}` },
    historia: {},
    financiacion: {
      comoDonar: "HOW TO DONATE?",
      bankLabels: { Titular: "Account holder", Banco: "Bank", "N.º de cuenta": "Account number", "Código bancario": "Bank code", IBAN: "IBAN", BIC: "BIC", Referencia: "Reference" },
    },
    voluntariado: {
      cta: "I WANT TO VOLUNTEER",
      formTitle: "Register as a volunteer",
      nombre: "FULL NAME *", nombrePh: "Your name",
      correo: "EMAIL *", correoPh: "you@email.com",
      telefono: "PHONE", telefonoPh: "(+502) 0000-0000",
      area: "AREA OF INTEREST", seleccionar: "Select...",
      areas: ["Educational support", "Arts & crafts", "Sports", "Administration"],
      enviando: "Sending...", enviar: "SUBMIT REQUEST",
      recibido: "Request received!", contactaremos: "We'll contact you soon.",
    },
    contacto: {
      nombrePh: "Name *", correoPh: "Email *", asuntoPh: "Subject", mensajePh: "Message *",
      enviando: "Sending...", enviar: "SEND MESSAGE",
      enviado: "Message sent!", pondremos: "We'll get back to you soon.",
      itemTitles: { location: "Address", phone: "Phone", mail: "Email", clock: "Hours" },
    },
    footer: {
      col1: "ASOL", links1: ["Our Team", "History", "Program"],
      col2: "GET INVOLVED", links2: ["Sponsorship", "Volunteering"],
      col3: "CONTACT", rights: "All rights reserved.",
    },
  },

  de: {
    nav: {
      home: "HOME", asol: "ASOL", programa: "PROGRAMM", equipo: "TEAM", historia: "GESCHICHTE",
      ayudar: "HELFEN & SPENDEN", contacto: "KONTAKT",
      "patrocinio-individual": "Individuelle Patenschaft", "patrocinio-empresarial": "Unternehmenssponsoring",
      "donaciones-especie": "Sachspenden", "practicas-eps": "Praktika", "voluntariados": "Freiwilligenarbeit",
    },
    topbar: { direccion: "Adresse", telefono: "Telefon", login: "Anmelden", admin: "Admin-Bereich", guardando: "Speichern..." },
    common: { verMas: "Mehr ansehen", chooseLanguage: "Wähle deine Sprache" },
    hero: { btn1: "MEHR ERFAHREN", btn2: "HELFEN & SPENDEN" },
    stats: { modalTitle: "Statistiken" },
    programa: { kicker: "UNSER PROGRAMM", heading: "Wie wir Leben verändern", leerMas: "Mehr lesen" },
    equipo: { kicker: "UNSER TEAM", heading: "Die Menschen hinter ASOL", suLabor: (name) => `IHRE ARBEIT BEI ${name.toUpperCase()}` },
    historia: {},
    financiacion: {
      comoDonar: "WIE SPENDEN?",
      bankLabels: { Titular: "Kontoinhaber", Banco: "Bank", "N.º de cuenta": "Kontonummer", "Código bancario": "Bankleitzahl", IBAN: "IBAN", BIC: "BIC", Referencia: "Verwendungszweck" },
    },
    voluntariado: {
      cta: "ICH MÖCHTE MITMACHEN",
      formTitle: "Als Freiwillige*r registrieren",
      nombre: "VOLLSTÄNDIGER NAME *", nombrePh: "Dein Name",
      correo: "E-MAIL *", correoPh: "du@email.com",
      telefono: "TELEFON", telefonoPh: "(+502) 0000-0000",
      area: "INTERESSENGEBIET", seleccionar: "Auswählen...",
      areas: ["Bildungsunterstützung", "Kunst & Handwerk", "Sport", "Verwaltung"],
      enviando: "Wird gesendet...", enviar: "ANFRAGE SENDEN",
      recibido: "Anfrage erhalten!", contactaremos: "Wir melden uns bald bei dir.",
    },
    contacto: {
      nombrePh: "Name *", correoPh: "E-Mail *", asuntoPh: "Betreff", mensajePh: "Nachricht *",
      enviando: "Wird gesendet...", enviar: "NACHRICHT SENDEN",
      enviado: "Nachricht gesendet!", pondremos: "Wir melden uns bald bei dir.",
      itemTitles: { location: "Adresse", phone: "Telefon", mail: "E-Mail", clock: "Öffnungszeiten" },
    },
    footer: {
      col1: "ASOL", links1: ["Unser Team", "Geschichte", "Programm"],
      col2: "MITMACHEN", links2: ["Förderung", "Freiwilligenarbeit"],
      col3: "KONTAKT", rights: "Alle Rechte vorbehalten.",
    },
  },
};

// Traducción fija del contenido editable (hero, historia, programa, equipo, financiación,
// voluntariado, contacto, footer) tal como existe hoy en el sitio real. Si el texto en español
// cambia desde el panel admin, esta traducción NO se actualiza sola.
export const CONTENT_TRANSLATIONS = {
  en: {
    hero: {
      title: "Solidarity Association for Education and Culture (ASOL)",
      subtitle: "We promote the development, education and protection of adolescents in situations of vulnerability in Guatemala, with an emphasis on young indigenous women.",
    },
    historia: {
      supertitle: "OUR HISTORY",
      title: "A dream that became a home",
      paragraphs: [
        "Casa Estudiantil ASOL was founded in 1989 through the initiative of teachers from the Austrian-Guatemalan Institute, Werner Römich and Marco Roca, with the support of Austrian organizations and partners committed to expanding educational opportunities for Guatemalan children and youth. In 1992, the Asociación Solidaridad para la Educación y la Cultura (ASOL) was formally established, a non-profit association legally registered with the Registry of Legal Entities and the Superintendence of Tax Administration.",
        "Throughout its history, ASOL has grown from a small student residence into an educational and protection center with the capacity to serve dozens of adolescents. This growth has been possible thanks to the ongoing support of donors, sponsors and international partners, who have contributed to improving the infrastructure and services offered.\nThe organization has had different leadership teams and has benefited from the valuable support of national and international volunteers, who have strengthened the daily support given to participants.\n",
        "Over more than three decades of work, ASOL has supported more than 500 girls, boys, adolescents and young people in their education, contributing to the training of professionals in various fields and creating opportunities to build dignified life projects. Its history reflects a sustained commitment to the education, protection and holistic development of Guatemalan youth.",
      ],
      quote: "Every child who arrives at ASOL carries with them a story of resilience. Our work is to make sure that story has a bright ending.",
      quoteAuthor: "— Founder, Werner Römich",
    },
    programa: {
      1: {
        title: "Casa Estudiantil ASOL",
        desc: "Our main protection mechanism: a safe, temporary home for adolescents and young people while they overcome the risk conditions that led to their admission. It provides education, psychological care, human rights training and strengthening of cultural identity, with a view to family reintegration or autonomy.",
        full: [
          "Casa ASOL is the association's main specialized protection mechanism. It functions as a safe, open and protective space where adolescents and young people can live temporarily while overcoming the risk conditions that led to their admission. It implements a comprehensive care model based on a human rights approach, the best interests of children and adolescents, gender equality, comprehensive protection, cultural relevance, youth participation and the strengthening of individual, family and community capacities. The model sees young people as rights holders and protagonists of their own development, promoting the construction of autonomous, sustainable life projects free of violence. Its purpose is to prevent the deepening of vulnerable situations, guarantee access to quality protection and education services, and facilitate progressive processes of family reintegration, social inclusion and economic autonomy.",
          "In this environment they receive:",
          "•Access to formal education and academic support.",
          "•Individual and group psychological care.",
          "•Development of life skills and youth leadership.",
          "•Training in human rights, gender equality and violence prevention.",
          "•Strengthening of cultural identity and community belonging.",
          "•Vocational guidance and job readiness.",
          "•Work with families to strengthen protective environments.",
          "The home does not seek to permanently replace the family, but rather to provide a temporary protection measure that strengthens personal capacities and creates favorable conditions for family reintegration or the transition to independence.",
        ],
      },
      2: {
        title: "Family Reintegration",
        desc: "External scholarships for young people who can remain in their communities but face economic barriers to studying. They include monthly training in citizenship, rights and self-care, plus an annual meeting between external and internal scholarship recipients.",
        full: [
          "The second line of care consists of the external scholarship program, a key tool within exit strategies, ensuring continued education for those who return to their family environment. It is aimed at young people whose family conditions allow them to remain in their communities, but who face economic or social barriers to continuing their studies after having experienced violence, vulnerability or social exclusion.",
          "The scholarships cover educational needs and facilitate access to and continuity in the education system, simultaneously strengthening family and community ties. They are accompanied by monthly two-hour virtual training sessions on citizenship, individual and collective rights, self-esteem, self-care and online psychological support as needed. Once a year, an in-person meeting is held between external and internal scholarship recipients to share experiences.",
        ],
      },
      3: {
        title: "Independent Living",
        desc: "Safe, low-cost housing and technical and occupational training — such as baking and pastry-making — so participants gain work experience, generate their own income and build life projects free of violence.",
        full: [
          "This line offers support through safe, low-cost housing and technical and occupational training processes. Through productive initiatives such as baking and pastry-making, participants acquire job skills, practical experience and income-management abilities, strengthening their economic autonomy and their capacity to build life projects free of violence.",
          "Since labor market integration is extremely difficult for many women survivors of violence, especially those with young children, an assisted job-integration program is offered, through which women can work at the ASOL bakery to generate income in a safe, supported environment. The ASOL Bakery currently produces the bread consumed at Casa ASOL and will soon expand production for external sales.",
        ],
      },
      4: {
        title: "Community Outreach",
        desc: "Partnerships with local actors to prevent violence and exclusion through workshops, academic support and cultural activities. Includes our Ecological and Technological Learning Center, with solar panels, biodigesters and eco-trails.",
        full: [
          "The fourth line of action extends the impact of the protection model into the community through alliances with local actors, such as the Catholic Church, the Santa Rosita Cooperative Institute, and other community and educational organizations. These alliances generate educational, training and recreational opportunities to prevent gender violence, social exclusion and the recruitment of adolescents and young people by gangs.",
          "Activities include academic reinforcement, vocational and occupational guidance with a gender focus, workshops on human rights, gender equality and violence prevention, as well as cultural, sports and recreational activities at ASOL's facilities. In coordination with local partners, job-training and technical courses are also developed to strengthen employment, entrepreneurship and economic autonomy opportunities for young people.",
          "Ecological protection of the ravine where Casa ASOL is located is a central component of this line of action. ASOL promotes environmental conservation, the circular economy and sustainable technologies through the installation of solar panels for hot water and electricity generation, biodigesters for responsible waste management, and the creation of eco-trails, all accessible at our Ecological and Technological Learning Center. This space fosters environmental education, knowledge of renewable energy, electronics repair, and sustainable resource management, contributing to more resilient and ecological communities. In this way, a vulnerable urban ravine becomes a living laboratory for learning, climate action and environmental protection.",
        ],
      },
    },
    team: {
      1: { name: "Technical and Program Direction", role: "Leads the institutional vision and the design of ASOL's programs" },
      2: { name: "Institutional Advisor", role: "Supports strategic management and organizational strengthening" },
      3: { name: "Academic Tutor", role: "Academic support and educational follow-up for participants" },
      4: { name: "Social Worker", role: "Support for families in vulnerable situations" },
      5: { name: "Psychologist", role: "Individual and group emotional and therapeutic care" },
    },
    stats: {
      1: "Adolescents and young people supported since 1992",
      2: "Years of uninterrupted work",
      3: "Active volunteers",
      4: "School continuity rate",
    },
    financiacion: {
      title: "Your support changes lives",
      desc: "Casa Estudiantil ASOL gives around 20 adolescents and young people, aged 14 to 20, from contexts of vulnerability, exclusion or risk, the opportunity to access a quality education and build a dignified, sustainable life project.",
      patrocinioIndividual: {
        intro: "Monthly support for one adolescent:",
        monthlyLabels: ["Full care at Casa ASOL", "Education and meals at Casa ASOL", "Education at Casa ASOL", "External scholarship"],
        individualHeading: "One-time support options:",
        individualLabels: ["10 psychological therapy sessions", "1 field trip", "1 roof maintenance", "1 water filter"],
      },
      patrocinioEmpresarial: {
        text: "ASOL invites companies and organizations to join as strategic allies in promoting opportunities for young indigenous women. Corporate contributions help strengthen the operation of Casa Estudiantil, fund educational and job-training programs, provide specialized psychosocial care, and improve infrastructure and maintenance. Interested companies can learn about the different ways to collaborate in our corporate giving portfolio.",
      },
      donacionesEspecie: {
        text: "ASOL accepts in-kind donations that help improve the living, learning and development conditions of participating adolescents. We especially welcome books, computers, furniture, appliances, clothing and other items in good condition that can be used at Casa Estudiantil or in our educational, technological and training support programs.",
      },
      practicasEps: {
        text: "ASOL offers opportunities for professional, university and supervised professional internships (EPS) in various disciplines, especially Psychology, Social Work, Education and related fields. Students apply their knowledge, develop projects and gain professional experience in a supervised learning environment, while contributing to the protection, promotion and restoration of the rights of adolescents in vulnerable situations.",
      },
      bank: {
        heading: "Want to help? It's easy!",
        intro: "Has our sponsorship program caught your interest, or would you like to support the children in another way? Simply get in touch with us.",
        note: "Your donation is tax-deductible.",
      },
    },
    voluntariado: {
      supertitle: "VOLUNTEERING",
      title: "Join as a volunteer",
      desc: "We are looking for people, both Guatemalan and international, over 18 years old with basic Spanish skills, who want to contribute to the holistic development of our adolescents and young people. Independent placements from 2 months, or long-term placements through the Austrian Service Abroad.",
      list: [
        "School accompaniment and tutoring",
        "Recreational and educational activities",
        "Support at the social bakery",
        "Fundraising and institutional communication",
        "Technological and Ecological Learning Center",
      ],
    },
    contacto: {
      title: "Get in touch with us",
      horarioVal: "Monday to Friday, 8:00 AM – 5:00 PM",
    },
    footer: {
      desc: "Education, protection and holistic development for young indigenous women in Guatemala, through Casa Estudiantil ASOL since 1992.",
    },
  },

  de: {
    hero: {
      title: "Verein Solidarität für Bildung und Kultur (ASOL)",
      subtitle: "Wir fördern die Entwicklung, Bildung und den Schutz von Jugendlichen in prekären Lebenslagen in Guatemala, mit besonderem Fokus auf junge indigene Frauen.",
    },
    historia: {
      supertitle: "UNSERE GESCHICHTE",
      title: "Ein Traum wurde zu einem Zuhause",
      paragraphs: [
        "Casa Estudiantil ASOL wurde 1989 auf Initiative von Lehrern des Österreichisch-Guatemaltekischen Instituts, Werner Römich und Marco Roca, gegründet, mit Unterstützung österreichischer Organisationen und Partner, die sich für bessere Bildungschancen für guatemaltekische Kinder und Jugendliche einsetzen. 1992 wurde die Asociación Solidaridad para la Educación y la Cultura (ASOL) formell gegründet, ein gemeinnütziger Verein, der rechtlich im Register juristischer Personen und bei der Steuerbehörde eingetragen ist.",
        "Im Laufe ihrer Geschichte ist ASOL von einer kleinen Wohnheimeinrichtung zu einem Bildungs- und Schutzzentrum gewachsen, das Dutzende von Jugendlichen betreuen kann. Diese Entwicklung war dank der kontinuierlichen Unterstützung von Spender*innen, Pat*innen und internationalen Partnern möglich, die zur Verbesserung der Infrastruktur und der angebotenen Dienstleistungen beigetragen haben.\nDie Organisation hatte verschiedene Leitungsteams und profitierte von der wertvollen Unterstützung nationaler und internationaler Freiwilliger, die die tägliche Begleitung der Teilnehmerinnen gestärkt haben.\n",
        "Seit mehr als drei Jahrzehnten hat ASOL mehr als 500 Mädchen, Jungen, Jugendliche und junge Erwachsene in ihrer Ausbildung begleitet, zur Ausbildung von Fachkräften in verschiedenen Bereichen beigetragen und Möglichkeiten zum Aufbau würdiger Lebensprojekte geschaffen. Ihre Geschichte spiegelt ein nachhaltiges Engagement für Bildung, Schutz und ganzheitliche Entwicklung der guatemaltekischen Jugend wider.",
      ],
      quote: "Jedes Kind, das zu ASOL kommt, bringt eine Geschichte der Resilienz mit. Unsere Aufgabe ist es, dafür zu sorgen, dass diese Geschichte ein gutes Ende nimmt.",
      quoteAuthor: "— Gründer, Werner Römich",
    },
    programa: {
      1: {
        title: "Casa Estudiantil ASOL",
        desc: "Unser wichtigster Schutzmechanismus: ein sicheres, vorübergehendes Zuhause für Jugendliche, während sie die Risikobedingungen überwinden, die zu ihrer Aufnahme geführt haben. Bietet Bildung, psychologische Betreuung, Menschenrechtsbildung und die Stärkung der kulturellen Identität, mit Blick auf Familienreintegration oder Selbstständigkeit.",
        full: [
          "Casa ASOL ist der wichtigste spezialisierte Schutzmechanismus des Vereins. Es ist ein sicherer, offener und schützender Ort, an dem Jugendliche vorübergehend wohnen können, während sie die Risikobedingungen überwinden, die zu ihrer Aufnahme geführt haben. Es wird ein ganzheitliches Betreuungsmodell umgesetzt, das auf einem menschenrechtsbasierten Ansatz, dem Kindeswohl, der Gleichstellung der Geschlechter, umfassendem Schutz, kultureller Relevanz, der Beteiligung Jugendlicher und der Stärkung individueller, familiärer und gemeinschaftlicher Fähigkeiten beruht. Das Modell versteht junge Menschen als Rechtsträger*innen und Gestalter*innen ihrer eigenen Entwicklung und fördert den Aufbau autonomer, nachhaltiger und gewaltfreier Lebensprojekte. Ziel ist es, eine Vertiefung von Vulnerabilität zu verhindern, den Zugang zu hochwertigem Schutz und Bildung zu garantieren und schrittweise Prozesse der Familienreintegration, sozialen Inklusion und wirtschaftlichen Selbstständigkeit zu ermöglichen.",
          "In diesem Umfeld erhalten sie:",
          "•Zugang zu formaler Bildung und schulischer Unterstützung.",
          "•Individuelle und Gruppen-psychologische Betreuung.",
          "•Entwicklung von Lebenskompetenzen und Jugendführung.",
          "•Schulung in Menschenrechten, Gleichstellung und Gewaltprävention.",
          "•Stärkung der kulturellen Identität und Zugehörigkeit zur Gemeinschaft.",
          "•Berufsorientierung und Vorbereitung auf das Arbeitsleben.",
          "•Arbeit mit Familien zur Stärkung schützender Umfelder.",
          "Das Zuhause will die Familie nicht dauerhaft ersetzen, sondern eine vorübergehende Schutzmaßnahme bieten, die persönliche Fähigkeiten stärkt und günstige Bedingungen für die Familienreintegration oder den Übergang zur Selbstständigkeit schafft.",
        ],
      },
      2: {
        title: "Familienreintegration",
        desc: "Externe Stipendien für Jugendliche, die in ihren Gemeinden bleiben können, aber wirtschaftliche Hürden beim Lernen haben. Beinhaltet monatliche Schulungen zu Bürgerschaft, Rechten und Selbstfürsorge sowie ein jährliches Treffen zwischen externen und internen Stipendiatinnen.",
        full: [
          "Die zweite Betreuungslinie besteht aus dem Programm für externe Stipendien, einem zentralen Instrument der Ausstiegsstrategien, das die Fortsetzung der Ausbildung derjenigen sichert, die in ihr familiäres Umfeld zurückkehren. Es richtet sich an Jugendliche, deren familiäre Bedingungen den Verbleib in ihrer Gemeinde ermöglichen, die aber wirtschaftliche oder soziale Hürden beim Fortsetzen ihrer Ausbildung haben, nachdem sie Gewalt, Vulnerabilität oder soziale Ausgrenzung erlebt haben.",
          "Die Stipendien decken Bildungsbedarf und erleichtern den Zugang zum und den Verbleib im Bildungssystem, während sie gleichzeitig familiäre und gemeinschaftliche Bindungen stärken. Begleitet werden sie von monatlichen, zweistündigen virtuellen Schulungen zu Bürgerschaft, individuellen und kollektiven Rechten, Selbstwertgefühl, Selbstfürsorge und bei Bedarf psychologischer Online-Betreuung. Einmal im Jahr findet ein persönliches Treffen zwischen externen und internen Stipendiatinnen zum Erfahrungsaustausch statt.",
        ],
      },
      3: {
        title: "Unabhängiges Leben",
        desc: "Sichere, kostengünstige Unterkunft sowie technische und berufliche Ausbildung — etwa in Bäckerei und Konditorei —, damit die Teilnehmerinnen Arbeitserfahrung sammeln, eigenes Einkommen erzielen und gewaltfreie Lebensprojekte aufbauen.",
        full: [
          "Diese Linie bietet Unterstützung durch sichere, kostengünstige Unterkünfte und technische und berufliche Ausbildungsprozesse. Durch produktive Initiativen wie Bäckerei und Konditorei erwerben die Teilnehmerinnen berufliche Kompetenzen, praktische Erfahrung und Fähigkeiten im Umgang mit Einkommen, was ihre wirtschaftliche Selbstständigkeit und ihre Fähigkeit stärkt, gewaltfreie Lebensprojekte aufzubauen.",
          "Da die Arbeitsmarktintegration für viele gewaltbetroffene Frauen, insbesondere mit minderjährigen Kindern, sehr schwierig ist, wird ein begleitetes Arbeitsintegrationsprogramm angeboten, in dessen Rahmen Frauen in der ASOL-Bäckerei arbeiten können, um in einem sicheren, begleiteten Umfeld ein Einkommen zu erzielen. Die ASOL-Bäckerei produziert derzeit das in Casa ASOL verzehrte Brot und wird ihre Produktion bald für den externen Verkauf erweitern.",
        ],
      },
      4: {
        title: "Gemeindearbeit",
        desc: "Allianzen mit lokalen Akteuren zur Prävention von Gewalt und Ausgrenzung durch Workshops, schulische Unterstützung und kulturelle Aktivitäten. Beinhaltet unser Zentrum für ökologisches und technologisches Lernen mit Solarpanelen, Biodigestern und Ökopfaden.",
        full: [
          "Die vierte Handlungslinie erweitert die Wirkung des Schutzmodells auf die Gemeinde durch Allianzen mit lokalen Akteuren wie der katholischen Kirche, dem Genossenschaftsinstitut Santa Rosita und anderen Gemeinschafts- und Bildungsorganisationen. Diese Allianzen schaffen Bildungs-, Ausbildungs- und Freizeitmöglichkeiten, um geschlechtsspezifische Gewalt, soziale Ausgrenzung und die Rekrutierung von Jugendlichen durch Banden zu verhindern.",
          "Die Aktivitäten umfassen schulische Förderung, Berufs- und Erwerbsorientierung mit Genderfokus, Workshops zu Menschenrechten, Gleichstellung und Gewaltprävention sowie kulturelle, sportliche und Freizeitaktivitäten in den Räumen von ASOL. In Abstimmung mit lokalen Partnern werden zudem Berufsausbildungs- und technische Kurse entwickelt, die Beschäftigungs-, Unternehmertums- und wirtschaftliche Selbstständigkeitschancen für Jugendliche stärken.",
          "Der ökologische Schutz der Schlucht, in der sich Casa ASOL befindet, ist ein zentraler Bestandteil dieser Handlungslinie. ASOL fördert Umweltschutz, Kreislaufwirtschaft und nachhaltige Technologien durch die Installation von Solarpanelen für Warmwasser und Stromerzeugung, Biodigestern für verantwortungsvolles Abfallmanagement und die Schaffung von Ökopfaden — alles zugänglich in unserem Zentrum für ökologisches und technologisches Lernen. Dieser Ort fördert Umweltbildung, Wissen über erneuerbare Energien, die Reparatur elektronischer Geräte und ein nachhaltiges Ressourcenmanagement und trägt so zu widerstandsfähigeren und ökologischeren Gemeinschaften bei. So wird eine verletzliche urbane Schlucht zu einem lebendigen Labor für Lernen, Klimaschutz und Umweltschutz.",
        ],
      },
    },
    team: {
      1: { name: "Technische und Programmleitung", role: "Leitet die institutionelle Vision und die Gestaltung der ASOL-Programme" },
      2: { name: "Institutionelle Beraterin", role: "Begleitet das strategische Management und die organisatorische Stärkung" },
      3: { name: "Akademische Tutorin", role: "Schulische Unterstützung und Bildungsbegleitung der Teilnehmerinnen" },
      4: { name: "Sozialarbeiterin", role: "Begleitung von Familien in vulnerablen Situationen" },
      5: { name: "Psychologin", role: "Individuelle und Gruppen-emotionale sowie therapeutische Betreuung" },
    },
    stats: {
      1: "Betreute Jugendliche seit 1992",
      2: "Jahre ununterbrochener Arbeit",
      3: "Aktive Freiwillige",
      4: "Quote des Schulverbleibs",
    },
    financiacion: {
      title: "Deine Unterstützung verändert Leben",
      desc: "Casa Estudiantil ASOL ermöglicht rund 20 Jugendlichen zwischen 14 und 20 Jahren aus vulnerablen, ausgegrenzten oder gefährdeten Verhältnissen den Zugang zu hochwertiger Bildung und den Aufbau eines würdigen, nachhaltigen Lebensprojekts.",
      patrocinioIndividual: {
        intro: "Monatliche Unterstützung für eine Jugendliche:",
        monthlyLabels: ["Umfassende Betreuung im Casa ASOL", "Bildung und Verpflegung im Casa ASOL", "Bildung im Casa ASOL", "Externes Stipendium"],
        individualHeading: "Einmalige Unterstützung:",
        individualLabels: ["10 psychologische Betreuungen", "1 Ausflug", "1 Dachreparatur", "1 Wasserfilter"],
      },
      patrocinioEmpresarial: {
        text: "ASOL lädt Unternehmen und Organisationen ein, sich als strategische Partner für die Förderung von Chancen für junge indigene Frauen anzuschließen. Unternehmensbeiträge helfen, den Betrieb der Casa Estudiantil zu stärken, Bildungs- und Berufsausbildungsprogramme zu finanzieren, spezialisierte psychosoziale Betreuung zu bieten und Infrastruktur sowie Instandhaltung zu verbessern. Interessierte Unternehmen können sich über die verschiedenen Formen der Zusammenarbeit in unserem Portfolio für Unternehmensspenden informieren.",
      },
      donacionesEspecie: {
        text: "ASOL nimmt Sachspenden entgegen, die dazu beitragen, die Lebens-, Lern- und Entwicklungsbedingungen der teilnehmenden Jugendlichen zu verbessern. Besonders willkommen sind Bücher, Computer, Möbel, Haushaltsgeräte, Kleidung und andere Gegenstände in gutem Zustand, die in der Casa Estudiantil oder in unseren Bildungs-, Technologie- und Ausbildungsprogrammen genutzt werden können.",
      },
      practicasEps: {
        text: "ASOL bietet die Möglichkeit für Berufs-, Universitäts- und betreute Berufspraktika (EPS) in verschiedenen Fachrichtungen, insbesondere Psychologie, Sozialarbeit, Pädagogik und verwandten Bereichen. Die Studierenden wenden ihr Wissen an, entwickeln Projekte und sammeln Berufserfahrung in einem betreuten Lernumfeld, während sie zum Schutz, zur Förderung und zur Wiederherstellung der Rechte von Jugendlichen in vulnerablen Situationen beitragen.",
      },
      bank: {
        heading: "Möchten Sie helfen? Es ist ganz einfach!",
        intro: "Haben wir Ihr Interesse an einer Patenschaft geweckt, oder möchten Sie die Kinder auf andere Weise unterstützen? Nehmen Sie einfach Kontakt mit uns auf.",
        note: "Ihre Spende ist steuerlich absetzbar.",
      },
    },
    voluntariado: {
      supertitle: "FREIWILLIGENARBEIT",
      title: "Werde Freiwillige*r",
      desc: "Wir suchen Personen, national wie international, über 18 Jahre, mit Grundkenntnissen in Spanisch, die zur ganzheitlichen Entwicklung unserer Jugendlichen beitragen möchten. Unabhängiger Einsatz ab 2 Monaten oder Langzeiteinsatz über den Österreichischen Auslandsdienst.",
      list: [
        "Schulische Begleitung und Nachhilfe",
        "Freizeit- und Bildungsaktivitäten",
        "Unterstützung in der sozialen Bäckerei",
        "Fundraising und institutionelle Kommunikation",
        "Technologisches und ökologisches Lernzentrum",
      ],
    },
    contacto: {
      title: "Nimm Kontakt mit uns auf",
      horarioVal: "Montag bis Freitag, 8:00 – 17:00 Uhr",
    },
    footer: {
      desc: "Bildung, Schutz und ganzheitliche Entwicklung für junge indigene Frauen in Guatemala, durch die Casa Estudiantil ASOL seit 1992.",
    },
  },
};

// Construye, a partir de lo que devolvió el backend (content_en/content_de,
// programa_en/de, team_en/de, stats_en/de — generados automáticamente por
// DeepL cada vez que se guarda en español), un objeto con la MISMA forma que
// CONTENT_TRANSLATIONS de arriba. Así el resto del código no necesita saber
// si una traducción vino de DeepL o de este diccionario escrito a mano.
export function buildAutoTranslationShape(c, programaArr, teamArr, statsArr) {
  if (!c) return null;
  const programa = {};
  (programaArr || []).forEach((p) => { programa[p.id] = { title: p.title, desc: p.desc, full: p.full }; });
  const team = {};
  (teamArr || []).forEach((m) => { team[m.id] = { name: m.name, role: m.role }; });
  const stats = {};
  (statsArr || []).forEach((s) => { stats[s.id] = s.label; });
  const pi = c.financiacion?.patrocinioIndividual;

  return {
    hero: { title: c.hero?.title, subtitle: c.hero?.subtitle },
    historia: {
      supertitle: c.historia?.supertitle, title: c.historia?.title,
      paragraphs: c.historia?.paragraphs, quote: c.historia?.quote, quoteAuthor: c.historia?.quoteAuthor,
    },
    programa, team, stats,
    financiacion: {
      title: c.financiacion?.title,
      desc: c.financiacion?.desc,
      patrocinioIndividual: pi ? {
        intro: pi.intro,
        individualHeading: pi.individualHeading,
        monthlyLabels: (pi.monthly || []).map((m) => m.label),
        individualLabels: (pi.individual || []).map((m) => m.label),
      } : undefined,
      patrocinioEmpresarial: c.financiacion?.patrocinioEmpresarial,
      donacionesEspecie: c.financiacion?.donacionesEspecie,
      practicasEps: c.financiacion?.practicasEps,
      bank: c.financiacion?.bank
        ? { heading: c.financiacion.bank.heading, intro: c.financiacion.bank.intro, note: c.financiacion.bank.note }
        : undefined,
    },
    voluntariado: {
      supertitle: c.voluntariado?.supertitle, title: c.voluntariado?.title,
      desc: c.voluntariado?.desc, list: c.voluntariado?.list,
    },
    contacto: {
      title: c.contacto?.title,
      horarioVal: c.contacto?.items?.find((i) => i.icon === "clock")?.val,
    },
    footer: { desc: c.footer?.desc },
  };
}

// Fusiona dos "árboles" de traducción: todo lo que venga en `fresh` (más
// reciente — DeepL) gana sobre `base` (la traducción escrita a mano), campo
// por campo. Si `fresh` no trae un campo (porque DeepL todavía no se ha
// ejecutado para ese contenido), se usa el de `base` como respaldo, así el
// sitio nunca muestra un hueco mientras se van regenerando las traducciones.
export function mergeTranslations(base, fresh) {
  if (!fresh) return base;
  if (!base) return fresh;
  const out = { ...base };
  for (const k of Object.keys(fresh)) {
    const bv = base[k], fv = fresh[k];
    const bothPlainObjects = fv && typeof fv === "object" && !Array.isArray(fv) && bv && typeof bv === "object" && !Array.isArray(bv);
    if (bothPlainObjects) {
      out[k] = mergeTranslations(bv, fv);
    } else if (fv !== undefined && fv !== null && fv !== "" && !(Array.isArray(fv) && fv.length === 0)) {
      out[k] = fv;
    }
  }
  return out;
}
