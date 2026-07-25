export const WHATSAPP_NUMBER = "573187869587";
export const WHATSAPP_MESSAGE =
  "Hola GAL'S ✨ Quiero saber más sobre las clases / membresías. ¿Me ayudan?";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
export const EMAIL = "coach.natugal@gmail.com";
export const PHONE_DISPLAY = "+57 318 786 9587";
export const ADDRESS = "Calle 97 #10-28, Chicó Reservado, Bogotá";
export const INSTAGRAM = "https://www.instagram.com/galstudio___";
export const CURRENT_SITE = "https://www.bewellclubnataliagalvis.com";

export const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#comunidad", label: "Comunidad" },
  { href: "#capsulas", label: "Programas" },
  { href: "#planes", label: "Planes" },
  { href: "#horario", label: "Horario" },
  { href: "#experiencias", label: "Experiencias" },
] as const;

/** Mock visual — luego se reemplaza con widget Bewe */
export const SCHEDULE_RANGE = "20 julio 2026 - 26 julio 2026";

export const SCHEDULE_DAYS = [
  {
    dateLabel: "Viernes, 24 de julio de 2026",
    classes: [
      {
        start: "06:10",
        end: "07:05",
        name: "Clases Pilates",
        instructor: "Maria Arango",
        capacity: "1/9",
      },
      {
        start: "07:10",
        end: "08:05",
        name: "Clases Pilates",
        instructor: "Maria Arango",
        capacity: "0/9",
      },
      {
        start: "08:10",
        end: "09:05",
        name: "Clases Pilates",
        instructor: "Maria Arango",
        capacity: "0/9",
      },
      {
        start: "09:15",
        end: "10:10",
        name: "Clases Pilates",
        instructor: "Maria Arango",
        capacity: "0/9",
      },
      {
        start: "17:30",
        end: "18:25",
        name: "80.000 Semana",
        instructor: "Natalia Galvis",
        capacity: "0/9",
      },
      {
        start: "18:30",
        end: "19:25",
        name: "Clases Pilates",
        instructor: "Natalia Galvis",
        capacity: "0/9",
      },
    ],
  },
  {
    dateLabel: "Sábado, 25 de julio de 2026",
    classes: [
      {
        start: "09:15",
        end: "10:10",
        name: "Clases Pilates",
        instructor: "Natalia Galvis",
        capacity: "0/9",
      },
    ],
  },
] as const;

/** Valores de su home actual */
export const VALUES = [
  "Disfrute",
  "Amor propio",
  "Movimiento",
  "Conexión",
  "Paz interior",
  "Fuerza",
  "Comunidad",
] as const;

export const ECOSYSTEM = [
  {
    id: "pilates",
    title: "Pilates & Hot Pilates",
    description:
      "Fuerza, control y presencia. Acceso a todas las disciplinas dentro de tu membresía — el movimiento consciente como hábito.",
  },
  {
    id: "barre",
    title: "Barre",
    description:
      "Activación, ritmo y escucha del cuerpo. Parte del ecosistema de movimiento de GAL'S en Zona 97.",
  },
  {
    id: "meditacion",
    title: "Meditación",
    description:
      "Presencia y calma para volver a ti. Incluida en el acceso a todas las disciplinas de la membresía.",
  },
  {
    id: "experiencias",
    title: "Eventos & experiencias",
    description:
      "Talleres y encuentros con descuento según tu nivel: Ritual 10%, Transformación 15%, Ilimitada 20%.",
  },
  {
    id: "kit",
    title: "Kit digital Natalia",
    description:
      "Bienvenida a toda membresía: rutinas de mat, secuencia matutina, audio de meditación y guía anti-inflamatoria 3 días.",
  },
  {
    id: "comunidad",
    title: "Comunidad WhatsApp",
    description:
      "Contenido exclusivo, lo que pasa en el studio y cupos de la semana. El proceso sigue fuera del mat.",
  },
] as const;

export const PLANS = [
  {
    id: "semana",
    name: "Semana GAL'S",
    tag: "Entrada · una vez por persona",
    classes: "5 clases · 7 días",
    price: "$80.000",
    description:
      "La puerta de entrada al sistema. Probás todas las disciplinas antes de comprometerte. Cupos limitados cada mes — no es una promoción, es el inicio.",
    featured: false,
    cta: "Quiero la Semana GAL'S",
  },
  {
    id: "puente",
    name: "Pack Puente",
    tag: "Después de la Semana",
    classes: "5 clases · 30 días",
    price: "$220.000",
    description:
      "Para quien terminó la Semana y aún no está lista para la membresía. Una sola opción, sin complicaciones.",
    featured: false,
    cta: "Elegir Pack Puente",
  },
  {
    id: "ritual",
    name: "Ritual",
    tag: "Membresía · ¿dónde me muevo?",
    classes: "8 clases / mes · $47.500 c/u",
    price: "$380.000",
    description:
      "Tu espacio dos veces a la semana. Todas las disciplinas, renovación automática, kit digital de Natalia, comunidad WhatsApp y 10% en eventos.",
    featured: false,
    cta: "Quiero Ritual",
  },
  {
    id: "transformacion",
    name: "Transformación",
    tag: "La más elegida",
    classes: "12 clases / mes · $43.333 c/u",
    price: "$520.000",
    description:
      "Todo Ritual + guía mensual de Natalia, sesión de preguntas, collab rotativo (nutrición · psicología · hábitos) y 15% en eventos. El proceso no para al salir del studio.",
    featured: true,
    cta: "Quiero Transformación",
  },
  {
    id: "ilimitada",
    name: "Ilimitada",
    tag: "Premium · círculo íntimo",
    classes: "Clases sin tope · máx. 20 cupos en el plan",
    price: "$680.000",
    description:
      "Clases ilimitadas dentro de un círculo reducido (máximo 20). Todo Transformación + sesión dominical 9am con Natalia, plan de movimiento en casa, nutrición personalizada, 20% en eventos y prioridad total de reserva.",
    featured: false,
    cta: "Quiero Ilimitada",
  },
] as const;

export const COACHES = [
  {
    name: "Gal Nati Galvis",
    role: "Pilates & Sculpt · Yin Yoga",
    photo: "/media/coaches/nati.jpg",
    bio: "Guía prácticas que integran fuerza, conciencia y profundidad. Combina Pilates y Sculpt para activar, y Yin Yoga para abrir espacio, liberar y conectar hacia adentro. Su enfoque nace de su propio camino.",
  },
  {
    name: "Gal María Arango",
    role: "Pilates & Sculpt",
    photo: "/media/coaches/mari.jpg",
    bio: "Crea clases donde el cuerpo se activa, se fortalece y se reta desde el movimiento consciente. Ritmo, energía y respiración para construir fuerza, control y confianza en ti misma.",
  },
  {
    name: "Gal Nati Ramos",
    role: "Vinyasa",
    note: "Clases 2 veces al mes",
    photo: "/media/coaches/natiramos.jpg",
    bio: "Guía prácticas de Vinyasa donde el movimiento fluye con la respiración: una experiencia dinámica que activa, fortalece y conecta. Habitar cada movimiento con intención y ritmo propio.",
  },
] as const;

export const COMMUNITY_BENEFITS = [
  "Regulación del estrés y la ansiedad",
  "Liberación física y emocional",
  "Mayor conexión contigo y con tu propósito",
  "Sensación de calma, claridad y energía renovada",
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Sales con más claridad, más energía y una sensación real de bienestar.",
    author: "Alumna GAL'S",
  },
  {
    quote:
      "Un espacio donde te sientes acompañada, sostenida y parte de algo.",
    author: "Alumna GAL'S",
  },
  {
    quote:
      "Aquí el movimiento se convierte en una herramienta para reconectar, soltar y volver a ti.",
    author: "Alumna GAL'S",
  },
] as const;
