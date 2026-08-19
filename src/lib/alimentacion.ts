import { BEWE_PACKS_CLASS } from "@/lib/bewe";

export function ytThumb(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function ytWatch(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export const ALIMENTACION = {
  slug: "alimentacion",
  title: "Alimentación consciente",
  subtitle: "Método Body In Flow · con Nati",
  heroImage: "/media/alimentacion/nati-bowl.png",
  heroBg: "/media/alimentacion/hero-bg.png",
  marketImage: "/media/alimentacion/nati-mercado.png",
  joyImage: "/media/alimentacion/nati-waffle.png",
  plateImage: "/media/alimentacion/plato-nutricion.png?v=2",
  /** Mockup laptop+celular de la guía Come como te mueves */
  guideMockup: "/media/alimentacion/guia-mockup.png",
  diaryPdf: "/media/alimentacion/diario-sintomas.pdf",
  ctaLabel: "Quiero mi Semana GAL'S",
  ctaBewe: BEWE_PACKS_CLASS,
  intro:
    "Comer bien no es un plan cerrado. Es aprender a mirar lo que eliges, sentir cómo te sienta y volver a ti con más suavidad. Aquí guardamos lo que Nati usa en el método para acompañarte en la cocina y en la mesa.",
  /**
   * Carpetas de Drive por semana (Recursos Descargables).
   * Semana 3 = solo audios en la web → sin link.
   * Pega los links reales cuando los tengas.
   */
  driveFolders: {
    week0:
      "https://drive.google.com/drive/folders/15bJwAWbkavjLJUeKrDCuxjN1uXe1keZ-",
    week1:
      "https://drive.google.com/drive/folders/1N54_d8xHwrO_AbFOF9yVtTNV4cp9w1OP",
    week2:
      "https://drive.google.com/drive/folders/1N1vmsTmcpSwGRkl2nwqYkl80iAn9oDtx",
    week4:
      "https://drive.google.com/drive/folders/1loZAeG-TDVEp2M5QxPDcZcagp02hB4L8",
  },
  week1Files: {
    /** Guía larga Body In Flow (~40 págs) — en Drive */
    guideHref:
      "https://drive.google.com/drive/folders/1N54_d8xHwrO_AbFOF9yVtTNV4cp9w1OP",
    habitsPdf: "/media/alimentacion/habitos-tracker.pdf",
    mapPdf: "/media/alimentacion/mapa-intenciones.pdf",
  },
  weekNav: [
    { id: "empezar", label: "Inicio", hint: "Empezar" },
    { id: "semana-0", label: "0", hint: "Mercado" },
    { id: "semana-1", label: "1", hint: "Base" },
    { id: "semana-2", label: "2", hint: "Etiquetas" },
    { id: "semana-3", label: "3", hint: "Audios" },
    { id: "semana-4", label: "4", hint: "Cuerpo" },
  ],
  weekGuide: [
    {
      id: "semana-0",
      week: "0",
      title: "Mercado y cocina",
      body: "Llenas la nevera con intención y cocinas con calma. El mejor lugar para aterrizar.",
      hint: "Empezar aquí",
    },
    {
      id: "semana-1",
      week: "1",
      title: "Base y presencia",
      body: "Pequeñas prácticas, tu mapa de intenciones y la guía larga cuando quieras ir más profundo.",
      hint: "Volver a ti",
    },
    {
      id: "semana-2",
      week: "2",
      title: "Etiquetas y despensa",
      body: "Miras lo que compras con otros ojos y decides qué se queda en tu casa.",
      hint: "En el súper",
    },
    {
      id: "semana-3",
      week: "3",
      title: "Emoción y comida",
      body: "Dos escuchas para suavizar la culpa y reconocer el hambre emocional.",
      hint: "Con calma",
    },
    {
      id: "semana-4",
      week: "4",
      title: "Volver a ciertos alimentos",
      body: "Reintroduces gluten, lácteos, maíz o soya de a uno, y notas cómo te sienta cada uno.",
      hint: "Escuchar el cuerpo",
    },
  ],
  introVideo: {
    id: "potencializa",
    youtubeId: "mSfAQvWio9M",
    title: "Potencializa tu alimentación",
    tag: "Desde adentro",
    blurb: "Para sentir cómo la comida puede sostenerte: más energía, más claridad, más calma.",
  },
  week0Video: {
    id: "clase-cocina",
    youtubeId: "LKrjuhYd5E0",
    title: "Clase de cocina",
    tag: "En la olla",
    blurb: "Ideas para cocinar con calma y llevar el método a tu día a día.",
  },
  audios: [
    {
      id: "hambre-emocional",
      title: "Hambre emocional",
      blurb:
        "Para notar cuándo el cuerpo pide comida… y cuándo en realidad pide cuidado.",
      src: "/media/alimentacion/hambre-emocional.m4a",
      durationSeconds: 1301,
      durationLabel: "21:41",
    },
    {
      id: "sin-culpa",
      title: "Permítete comer sin culpa",
      blurb:
        "Comer también puede ser presencia. Sin castigo, sin drama.",
      src: "/media/alimentacion/permitete-comer-sin-culpa.m4a",
      durationSeconds: 588,
      durationLabel: "9:48",
    },
  ],
  recommendations: [
    {
      num: "01",
      title: "No mezcles alimentos",
      body: "Por ejemplo, si estás reintroduciendo lácteos, asegúrate de no consumir soya en otros productos al mismo tiempo.",
    },
    {
      num: "02",
      title: "Los más inflamatorios, al final",
      body: "Gluten, lácteos, maíz, soya. Déjalos para cuando tu cuerpo ya haya tenido espacio de escuchar lo demás.",
    },
    {
      num: "03",
      title: "Tres días entre cada alimento",
      body: "Cuando introduzcas uno, come una buena cantidad (por ejemplo, un pedazo de queso o un vaso de leche por la mañana y otro a mediodía). Luego espera: en total, deja 3 días entre cada alimento para notar cómo responde tu cuerpo.",
    },
  ],
  diary: {
    title: "Tu diario de síntomas",
    subtitle:
      "Para anotar cómo te sientes los tres días de cada reintroducción. Imprímelo o llénalo a mano con calma.",
    noteTitle: "Clara de huevo",
    note: "La reintroducción del huevo debe hacerse por separado: en muchos casos lo que más inflama son las claras, no las yemas.",
    href: "/media/alimentacion/diario-sintomas.pdf",
  },
  avoidGuide: {
    title: "Ingredientes a evitar",
    subtitle: "Léela al hacer tus compras",
    groups: [
      {
        name: "Aceites refinados",
        items: [
          "Aceite vegetal hidrogenado",
          "Grasas trans",
          "Aceite de soya",
          "Aceite de maíz",
          "Aceite de palma",
          "Aceite de canola refinado",
          "Margarina",
          "Aceite de girasol refinado",
        ],
      },
      {
        name: "Azúcares",
        items: [
          "Azúcar (sacarosa)",
          "Jarabe de maíz alto en fructosa",
          "Glucosa / dextrosa",
          "Maltodextrina",
          "Aspartame",
          "Sucralosa (Splenda)",
          "Acesulfame K",
        ],
      },
      {
        name: "Aditivos y conservantes",
        items: [
          "Glutamato monosódico (E621)",
          "Nitritos y nitratos",
          "BHT y BHA",
          "Sulfitos",
          "Benzoato de sodio",
          "Tartrazina / rojo allura",
          "Aromas y colorantes artificiales",
        ],
      },
      {
        name: "Harinas",
        items: [
          "Harina de trigo refinada",
          "Harina de trigo enriquecida",
          "Almidón de maíz modificado",
          "Harina de arroz blanco (busca 100% integral)",
        ],
      },
    ],
  },
  labelGuide: {
    title: "Cómo leer una etiqueta sin volverte loca",
    subtitle: "Nombres que se esconden detrás de lo “saludable”",
    groups: [
      {
        name: "Grasas",
        items: [
          "Aceite vegetal hidrogenado o parcialmente hidrogenado",
          "Grasas trans",
          "Aceites de soya, maíz, palma, canola o girasol refinados",
          "Margarina",
        ],
      },
      {
        name: "Azúcar (otros nombres)",
        items: [
          "Jarabe de maíz / alto en fructosa",
          "Dextrosa, maltosa, sacarosa, fructosa, glucosa",
          "Melaza, jarabe de arce, jarabe de arroz",
          "Jugo de fruta concentrado",
          "Azúcar invertido / de caña / agave",
        ],
      },
      {
        name: "Harinas refinadas",
        items: [
          "Harina de trigo / enriquecida / fortificada / blanca",
          "Harina de maíz refinada",
        ],
      },
      {
        name: "Gluten",
        items: ["Trigo", "Cebada", "Centeno", "Espelta", "Kamut", "Sémola"],
      },
      {
        name: "Aditivos",
        items: [
          "Nitritos y nitratos (E250, E251)",
          "Benzoato de sodio (E211)",
          "Butilhidroxitolueno (E320)",
          "Aspartame (E951)",
          "Glutamato monosódico",
          "Todo lo que empieza por E",
        ],
      },
    ],
  },
  marketList: {
    title: "Tu lista para la primera semana",
    subtitle: "Lo fresco, las proteínas y lo que ya suele estar en la despensa",
    categories: [
      {
        name: "Frescos",
        items: [
          "Apio",
          "Pepino",
          "Limón",
          "Jengibre",
          "Espinaca",
          "Menta",
          "Albahaca",
          "Cebolla roja",
          "Brócoli",
          "Cebolla puerro",
          "Zanahoria",
          "Ajo",
          "Remolacha",
          "Tomate cherry",
          "Cilantro",
          "Rúgula",
          "Kale",
          "Cogollos",
          "Ahuyama",
          "Champiñones",
          "Portobello",
          "Zucchini",
          "Arándanos",
          "Manzana",
          "Naranja",
          "Piña",
          "Banano",
          "Durazno",
          "Aguacate Hass",
          "Quinoa",
        ],
      },
      {
        name: "Proteínas",
        items: [
          "Pechuga de pollo o pavo",
          "Salmón",
          "Pescados blancos",
          "Huevos",
          "Camarones",
          "Proteína vegana",
          "Yuca",
        ],
      },
      {
        name: "Semillas y frutos secos",
        items: [
          "Linaza",
          "Semillas de calabaza",
          "Ajonjolí",
          "Crema de almendras",
          "Crema de ajonjolí",
          "Almendras",
          "Chía",
          "Cacao",
          "Nuez nogal (2 diarias)",
        ],
      },
      {
        name: "Despensa",
        items: [
          "Pan sin gluten",
          "Stevia o monk fruit",
          "Aminos de coco",
          "Sal rosada o marina",
          "Peperoncino",
          "Flor de jamaica",
          "Leche de coco (lata)",
          "Yogurt vegano",
          "Polvo de hornear",
          "Agua de coco",
          "Leche de almendras",
          "Aceite de coco",
          "Queso Violife",
          "Pasta de arveja o quinoa",
          "Vinagre balsámico",
          "Vinagre de manzana o blanco",
          "Garbanzos",
        ],
      },
      {
        name: "Especias (si no las tienes)",
        items: [
          "Mostaza Dijon",
          "Cúrcuma",
          "Pimienta cayena",
          "Canela",
          "Aceite de oliva",
          "Comino",
          "Paprika",
          "Tomillo",
        ],
      },
    ],
    directories: [
      {
        city: "Bogotá",
        places: [
          "Escarola (código 10%: EscarolaBeWell)",
          "La Banquiva: 314 2761691",
          "Hipermar fish",
          "FitHub (15% con código bodyinflow)",
        ],
      },
      {
        city: "Medellín",
        places: [
          "MercaViva",
          "Principe conejo",
          "La huerta del cielo",
          "Vitaorgánicos",
          "El canto de la huerta",
          "Agromandala",
          "La Banquiva: 314 2761691",
          "Pavo natural Vicook",
          "FitHub (15% con código bodyinflow)",
        ],
      },
    ],
  },
  weeklyActions: [
    {
      week: 1,
      title: "Semana 1",
      focus: "Volver a escucharte",
      steps: [
        "Tómate 5 min al empezar tu día para meditar o simplemente estar en silencio, estar contigo, escuchar qué dicen tus pensamientos. Si te dices cosas que llaman tu atención, escríbelas en una libreta. Hazlas conscientes.",
        "Escribe tu nueva tú y grábate en nota de voz para que te escuches las veces que sean necesarias.",
        "Escríbete una carta: pon todo lo que quieres soltar, lo que tienes guardado en el corazón. Léela con compasión, sabiendo que eres humana e imperfecta como todos, y que hoy decidiste encontrar la manera de ser mejor.",
      ],
    },
    {
      week: 2,
      title: "Semana 2",
      focus: "Nutrirte y sentir el cuerpo después de comer",
      steps: [
        "Sé consciente en cada comida e incluye al menos 1 nutriente extra: frutos secos naturales, aguacate, chía, linaza, fruta, verduras (zanahoria, champiñones, brócoli, repollo, apio, albahaca, pepino, cebolla, kale), salmón, pollo orgánico, pavo o huevos. Anota qué incluiste y cómo te sentiste.",
        "Revisa tu despensa. Practica lo aprendido sobre ingredientes inflamatorios y decide, desde la conciencia, qué quieres hacer con esos alimentos. El bienestar lo construye cada persona.",
        "Dos horas después de comer nutritivo, escucha tu cuerpo: si hay hambre, toma agua; si sigue, come con calma (y revisa azúcar si persiste); si estás saciada, esa comida te está funcionando. Nota si comes sin hambre: ¿estrés, recuerdo, costumbre? Observa cómo eliges responder.",
        "Prueba las recetas que más te llamen y detecta sabores (dulce, picante, amargo, cítrico) y texturas (crujiente, suave, caliente, fría). ¿Con qué te sentiste más satisfecha y con más energía?",
      ],
    },
  ],
  intentions: {
    title: "Tu mapa de intenciones",
    subtitle: "Escríbelo a tu ritmo. No hay forma correcta de hacerlo.",
    prompts: [
      { id: "intencion", label: "Intención", hint: "¿Qué quieres crear o sostener?" },
      { id: "para-que", label: "¿Para qué?", hint: "Escribe para qué quieres esto" },
      { id: "por-que", label: "¿Por qué?", hint: "¿Por qué quieres que se haga real?" },
      {
        id: "impedido",
        label: "¿Qué te ha impedido hacerlo?",
        hint: "Sin juicio: solo nómbralo",
      },
      { id: "sentimiento", label: "Sentimiento", hint: "¿Qué sientes al pensarlo?" },
      {
        id: "acciones",
        label: "3 acciones tangibles",
        hint: "¿Qué estás dispuesta a hacer?",
      },
    ],
  },
  habits: {
    title: "Un recordatorio de lo que elegiste para ti",
    subtitle:
      "Marca los días en que sí estuviste contigo. Si uno se te escapa, no pasa nada: ajusta y sigue.",
    tips: [
      "Al cerrar el día, date un minuto para ver cómo te fue contigo misma.",
      "Si no salió, pregunta con cariño: ¿fue demasiado? ¿cómo lo hago más fácil?",
      "Tus hábitos son como un hogar: puedes salir, y siempre puedes volver.",
    ],
    habitLabels: ["Lo que quiero sostener", "Otro gesto", "Uno más, suave"],
    days: ["L", "M", "X", "J", "V", "S", "D"],
  },
  longGuides: [
    {
      id: "semana-1",
      title: "Guía de Alimentación · Semana 1",
      eyebrow: "El documento largo",
      summary:
        "Es el ebook Body In Flow de esta semana (Balance): decenas de páginas para entender el método con calma —suplementos, despensa, foco y cómo volver a elegirte en la mesa. Por eso no lo metemos entero aquí.",
      bullets: [
        "Ábrela cuando quieras profundizar.",
        "El tracker de hábitos y el mapa imprimible los tienes aparte, aquí mismo.",
      ],
    },
  ],
} as const;
