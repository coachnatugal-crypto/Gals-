/** Hero video (Cloudinary). */
export const HERO_VIDEO_URL =
  "https://res.cloudinary.com/fvermexb/video/upload/v1785107937/hero-cloudinary_mz6ooi.mp4";

/**
 * Historias reales (Cloudinary).
 * Videos: .mov HEVC → forzar f_mp4 (H.264) para Chrome/Android.
 * Posters: archivos locales en /public (siempre visibles aunque falle Cloudinary).
 */
export const REAL_STORIES_VIDEOS = [
  {
    id: "natalia-1",
    src: "https://res.cloudinary.com/fvermexb/video/upload/f_mp4/q_auto:good/w_720/v1785108085/Natalia_testimonio_1_figeww.mov",
    poster: "/media/stories/natalia.jpg",
    label: "Natalia",
  },
  {
    id: "testimonio-1",
    src: "https://res.cloudinary.com/fvermexb/video/upload/f_mp4/q_auto:good/w_720/v1785108041/Testimonio_1_1_vnsmes.mov",
    poster: "/media/stories/testimonio.jpg",
    label: "Testimonio",
  },
  {
    id: "img-0687",
    src: "https://res.cloudinary.com/fvermexb/video/upload/f_mp4/q_auto:good/w_720/v1785108969/IMG_0687_vjknfd.mov",
    poster: "/media/stories/img0687.jpg",
    label: "GAL'S",
  },
  {
    id: "testimonio-2",
    src: "https://res.cloudinary.com/fvermexb/video/upload/f_mp4/q_auto:good/w_720/v1785110367/copy_9EB341DF-FC93-4C1A-AEE9-2D07454EE3AD_j10lex.mov",
    poster: "/media/stories/testimonio-2.jpg",
    label: "Testimonio",
  },
] as const;

export const WHATSAPP_NUMBER = "573187869587";
export const WHATSAPP_MESSAGE =
  "Hola GAL'S ✨ Quiero saber más sobre las clases / membresías. ¿Me ayudan?";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
/** Comunidad de WhatsApp (grupo) */
export const WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/H7EELRoEQvG34ac0NHuhOq";
export const EMAIL = "coach.natugal@gmail.com";
export const PHONE_DISPLAY = "+57 318 786 9587";
export const ADDRESS = "Calle 97 #10-28, Chicó Reservado, Bogotá";
export const INSTAGRAM = "https://www.instagram.com/galstudio___";

/**
 * Portal operativo del studio (perfil, registro, reservas / horario).
 * Misma plataforma que la web antigua; en UI solo decimos “Mi espacio” / “Reservar”.
 */
export const MEMBER_SPACE_URL = "https://web.bewe.co/be-well-club";
export const BOOKING_URL = MEMBER_SPACE_URL;

/** App Bewe (QR → descarga / Play Store). */
export const APP_DOWNLOAD_URL = "https://bewe.page.link/aPfcKa2B9jXv8QNy6";
export const APP_QR_SRC = "/media/app-qr.jpeg";
export const APP_HOWTO_VIDEO = "/media/app-howto.mp4";

/** Solo anclas de la homepage — sin enlaces a reto/alimentación/eventos. */
export const NAV_LINKS = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#capsulas", label: "Programas" },
  { href: "/#planes", label: "Planes" },
  { href: "/#horario", label: "Horario" },
  { href: "/#experiencias", label: "Experiencias" },
] as const;

/** Menú móvil compacto */
export const MENU_LINKS = [
  { href: "/eventos", label: "Eventos" },
  { href: "/#horario", label: "Clases" },
  { href: "/#planes", label: "Planes" },
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
    title: "Pilates",
    description:
      "Fuerza, control y presencia. Acceso a todas las disciplinas dentro de tu membresía: el movimiento consciente como hábito.",
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
      "Incluido en Transformación e Ilimitada: rutinas de mat, secuencia matutina, audio de meditación y guía anti-inflamatoria 3 días.",
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
    tag: "Tu primer paso · solo nuevas alumnas",
    classes: "5 clases en 7 días",
    price: "$80.000",
    description:
      "Cupos limitados este mes. Solo para nuevas alumnas.",
    bullets: [
      "Tus clases son una mezcla de pilates, barre y yin yoga",
      "Una vez por persona",
    ],
    featured: false,
    cta: "Quiero mi Semana GAL'S",
  },
  {
    id: "ritual",
    name: "Membresía Ritual",
    tag: "¿Dónde me muevo?",
    classes: "8 clases / mes",
    price: "$380.000/mes",
    description: "Tu espacio dos veces a la semana.",
    bullets: [
      "Clases que mezclan pilates, barre y yin yoga",
      "Renovación automática",
      "Acceso a la comunidad de WhatsApp GAL'S",
      "10% de descuento en eventos y experiencias",
    ],
    featured: false,
    cta: "Quiero este plan",
  },
  {
    id: "transformacion",
    name: "Membresía Transformación",
    tag: "La más elegida",
    classes: "12 clases / mes",
    price: "$520.000/mes",
    description: "El proceso no para al salir del studio.",
    bullets: [
      "Clases que mezclan pilates, barre y yin yoga",
      "Kit de bienvenida digital de Natalia (rutina de mat pilates, secuencia matutina, audio de meditación, guía antiinflamatoria de 3 días)",
      "Guía nueva de Natalia cada mes (movimiento, alimentación, hábitos o bienestar emocional)",
      "Sesión grupal de preguntas con Natalia: respuestas en audio, una vez al mes",
      "15% de descuento en eventos y experiencias",
    ],
    featured: true,
    cta: "Quiero este plan",
  },
  {
    id: "ilimitada",
    name: "Membresía Ilimitada",
    tag: "Premium · círculo íntimo · 17 cupos",
    classes: "Clases ilimitadas",
    price: "$680.000/mes",
    description: "Círculo íntimo · 17 cupos",
    bullets: [
      "Clases que mezclan pilates, barre y yin yoga",
      "Sesión semanal: podcast de mindset",
      "Plan de movimiento en casa diseñado por Natalia cada mes",
      "Collab mensual rotativo: nutricionista funcional, psicóloga especialista en bienestar, coach de hábitos y propósito",
      "Asesoría de 20 min con la nutricionista del círculo GAL'S, con 20% de descuento en consultas posteriores",
      "20% de descuento en todos los eventos y experiencias",
      "GAL'S VIP en la comunidad: sé la primera en enterarte de todo aquí en GAL'S",
    ],
    featured: false,
    cta: "Quiero mis clases ilimitadas",
  },
] as const;

export const COACHES = [
  {
    name: "Gal Nati Galvis",
    role: "Pilates & Sculpt · Yin Yoga",
    photo: "/media/coaches/nati.jpg",
    video:
      "https://res.cloudinary.com/fvermexb/video/upload/f_mp4/q_auto:good/w_720/v1785112103/copy_EDB62C71-3157-4D92-BB29-D5564522F384_vtxu2u.mov",
    bio: "Guía prácticas que integran fuerza, conciencia y profundidad. Combina Pilates y Sculpt para activar, y Yin Yoga para abrir espacio, liberar y conectar hacia adentro. Su enfoque nace de su propio camino.",
  },
  {
    name: "Gal María Arango",
    role: "Pilates & Sculpt",
    photo: "/media/coaches/mari.jpg",
    video:
      "https://res.cloudinary.com/fvermexb/video/upload/f_mp4/q_auto:good/w_720/v1785110258/copy_F2971244-59F0-4FD7-97DB-305BB55F420E_eucbvx.mov",
    bio: "Crea clases donde el cuerpo se activa, se fortalece y se reta desde el movimiento consciente. Ritmo, energía y respiración para construir fuerza, control y confianza en ti misma.",
  },
  {
    name: "Gal Nati Ramos",
    role: "Vinyasa",
    note: "Clases 2 veces al mes",
    photo: "/media/coaches/natiramos.jpg",
    video:
      "https://res.cloudinary.com/fvermexb/video/upload/f_mp4/q_auto:good/w_720/v1785112024/copy_5ABA9B2C-F893-4C14-884C-888A1744F78C_lcaxxw.mov",
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
    author: "Ana María Duque",
    quote:
      "Vengo derecho de dejar a mi hija en el colegio. Es la única hora del día pero es mi hora favorita.",
  },
  {
    author: "Camila Restrepo",
    quote:
      "Mi esposo me regaló la Semana GAL's de cumpleaños. Ya llevo 3 membresías seguidas, ahora se la compré a mi mamá.",
  },
  {
    author: "Daniela Torres",
    quote:
      "Hice pilates en otros 2 lugares antes. Acá es la primera vez que la instructora se acuerda de mi nombre sin preguntarlo.",
  },
  {
    author: "Isabella Cárdenas",
    quote:
      "Tenía una lesión de espalda de hace años. Le pregunté a Natalia antes de empezar y me armó ejercicios distintos solo para mí.",
  },
  {
    author: "Paula Jaramillo",
    quote:
      "Tengo 52 años y pensé que esto era para gente más joven. Nadie me hizo sentir fuera de lugar ni una sola clase.",
  },
  {
    author: "Jessica Tamara",
    quote:
      "Los cambios en mi cuerpo han sido increíbles, me siento en un lugar súper completo.",
  },
] as const;
