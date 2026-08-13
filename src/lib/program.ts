/** Miniatura oficial de YouTube (hq). Si falla en UI, el card deja espacio. */
export function ytThumb(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function ytWatch(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export type ProgramWorkout = {
  id: string;
  youtubeId: string;
  title: string;
  /** Explica qué vas a hacer en el video */
  blurb: string;
  tag: string;
  durationLabel: string;
  optional?: boolean;
  /** Charla / mentalidad (día de descanso) */
  mindset?: boolean;
};

export type ProgramDay = {
  day: number;
  label: string;
  /** Explica el enfoque del día */
  subtitle: string;
  /** Título en script (estilo “Respira y vuelve a ti”) */
  moodTitle: string;
  /** Cuerpo del bloque mood, adaptado a la clase */
  moodBody: string;
  rest?: boolean;
  restMessage?: string;
  workouts: ProgramWorkout[];
};

/**
 * Videos oficiales del Reto Pilates en casa (canal GAL'S).
 * Un video por día: reto 1–5, sábado full body, domingo meditación.
 */
export const HOME_PROGRAM = {
  slug: "programa",
  title: "Reto pilates en casa",
  subtitle: "GAL'S Studio · con Natalia",
  channelUrl: "https://www.youtube.com/@Gals_nataliagalvis/videos",
  coverImage: "/media/programa/reto-pilates-en-casa.png",
  coverYoutubeId: "FEWyei-Rsmo",
  meta: {
    days: "7 días",
    duration: "5–40 min/día",
    focus: "Pilates · Abs · Glúteos · Plancha · Mentalidad",
    gear: "Solo necesitas un mat",
    period: "Empieza cuando quieras",
  },
  description:
    "Un video por día del reto oficial. Sábado full body y domingo meditación para integrar.",
  /** Gancho: el reto gratis lleva a reservar en la home */
  ctaLabel: "Reservar mi Semana GAL'S",
  ctaHref: "/#planes",
  ctaHook:
    "Este reto es tu entrada. El siguiente paso es vivir GAL'S en el studio.",
  days: [
    {
      day: 1,
      label: "Día 1",
      subtitle: "Activa brazos y centro: una entrada corta para despertar el cuerpo.",
      moodTitle: "Despierta tu fuerza",
      moodBody:
        "Hoy activas tren superior y abdomen. Diez minutos para encender el cuerpo con presencia, sin exigirte de más.",
      workouts: [
        {
          id: "d1",
          youtubeId: "FEWyei-Rsmo",
          title: "Tren superior + abs (10 min)",
          blurb:
            "Diez minutos de tren superior y abdomen para calentar fuerza y presencia sin exigirte de más.",
          tag: "Tren superior",
          durationLabel: "10 min",
        },
      ],
    },
    {
      day: 2,
      label: "Día 2",
      subtitle: "Centro profundo: refuerza el abdomen con control y respiración.",
      moodTitle: "Encuentra tu centro",
      moodBody:
        "Hoy el foco es el abdomen. Conecta con tu core, respira con control y siente la fuerza desde adentro.",
      workouts: [
        {
          id: "d2",
          youtubeId: "okeAnLW4bR4",
          title: "Súper abdomen",
          blurb:
            "Secuencia de abdomen para sentir el centro activo, estable y conectado con cada exhalación.",
          tag: "Abdomen",
          durationLabel: "Clase",
        },
      ],
    },
    {
      day: 3,
      label: "Día 3",
      subtitle: "Baja el foco a glúteos y piernas: fuerza desde la base.",
      moodTitle: "Fuerza desde la base",
      moodBody:
        "Hoy trabajas glúteos y piernas. Baja la atención a tu base, tonifica con calma y sostén cada movimiento.",
      workouts: [
        {
          id: "d3",
          youtubeId: "FebyjURUm6s",
          title: "Glúteos y piernas",
          blurb:
            "Trabajo de tren inferior para tonificar glúteos y piernas con control, no con prisa.",
          tag: "Tren inferior",
          durationLabel: "Clase",
        },
      ],
    },
    {
      day: 4,
      label: "Día 4",
      subtitle: "Core express: plancha corta pero intensa para estabilizar.",
      moodTitle: "Estabilidad en 5 minutos",
      moodBody:
        "Hoy es plancha express. Una práctica corta para despertar el core, alinear la postura y ganar estabilidad.",
      workouts: [
        {
          id: "d4",
          youtubeId: "RI7xV5D-SLk",
          title: "Plancha en 5 min",
          blurb:
            "Cinco minutos de plancha para despertar el core, mejorar la postura y ganar estabilidad.",
          tag: "Plancha",
          durationLabel: "5 min",
        },
      ],
    },
    {
      day: 5,
      label: "Día 5",
      subtitle: "Combina abdomen y brazos: fuerza suave en 20 minutos.",
      moodTitle: "Fuerza con suavidad",
      moodBody:
        "Hoy unes abdomen y brazos. Veinte minutos de fuerza funcional sin perder la calma ni la respiración.",
      workouts: [
        {
          id: "d5",
          youtubeId: "HbdDjltZuNo",
          title: "Abdomen y brazos (20 min)",
          blurb:
            "Veinte minutos para unir abdomen y brazos: fuerza funcional sin perder la calma.",
          tag: "Abs y brazos",
          durationLabel: "20 min",
        },
      ],
    },
    {
      day: 6,
      label: "Sábado",
      subtitle: "Full body: integra todo el reto en una clase completa.",
      moodTitle: "Integra todo el cuerpo",
      moodBody:
        "Hoy es full body. Mueve el cuerpo completo e integra lo que construiste durante la semana.",
      workouts: [
        {
          id: "d6",
          youtubeId: "Yru31rZiftY",
          title: "Pilates full body",
          blurb:
            "Clase de cuerpo completo para moverte de punta a punta e integrar lo trabajado en la semana.",
          tag: "Cuerpo completo",
          durationLabel: "Clase",
        },
      ],
    },
    {
      day: 7,
      label: "Domingo",
      subtitle: "Día suave: soltar el cuerpo y volver a ti con calma.",
      moodTitle: "Respira y vuelve a ti",
      moodBody:
        "Día suave para integrar. Respira, relájate y vuelve a ti con esta meditación.",
      rest: true,
      restMessage:
        "Día suave para integrar. Respira, relájate y vuelve a ti con esta meditación.",
      workouts: [
        {
          id: "d7",
          youtubeId: "3PKIarxLVvM",
          title: "Meditación: relajación del cuerpo",
          blurb:
            "Meditación guiada para relajar el cuerpo, soltar tensión y cerrar el reto con presencia.",
          tag: "Calma",
          durationLabel: "Suave",
          mindset: true,
        },
      ],
    },
  ] satisfies ProgramDay[],
} as const;
