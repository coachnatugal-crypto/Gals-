import { BEWE_PACKS_CLASS } from "@/lib/bewe";

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
  tag: string;
  durationLabel: string;
  optional?: boolean;
  /** Charla / mentalidad (día de descanso) */
  mindset?: boolean;
};

export type ProgramDay = {
  day: number;
  label: string;
  rest?: boolean;
  restMessage?: string;
  workouts: ProgramWorkout[];
};

/**
 * Videos del canal: https://www.youtube.com/@Gals_nataliagalvis/videos
 * Rutina diaria: activación + clase + cierre (a veces solo 2).
 * Un día de descanso = charla / mentalidad (sin comida por ahora).
 */
export const HOME_PROGRAM = {
  slug: "programa",
  title: "Reto pilates en casa",
  subtitle: "GAL'S Studio · con Natalia",
  channelUrl: "https://www.youtube.com/@Gals_nataliagalvis/videos",
  coverImage: "/media/programa/reto-pilates-en-casa.png",
  coverYoutubeId: "Yru31rZiftY",
  meta: {
    days: "7 días",
    duration: "10–40 min/día",
    focus: "Pilates · Abs · Full body · Mentalidad",
    gear: "Mat",
    period: "Empieza cuando quieras",
  },
  description:
    "Misma rutina cada día: activación, clase principal y cierre. Un día de descanso con charla de mentalidad. La comida viene después en otra sección.",
  ctaLabel: "Quiero mi Semana GAL'S en studio",
  ctaBewe: BEWE_PACKS_CLASS,
  days: [
    {
      day: 1,
      label: "Día 1",
      workouts: [
        {
          id: "d1-a",
          youtubeId: "3PKIarxLVvM",
          title: "Activación: meditación y relajación del cuerpo",
          tag: "Activación",
          durationLabel: "Cierre suave",
          optional: true,
        },
        {
          id: "d1-b",
          youtubeId: "Yru31rZiftY",
          title: "Clase principal: Pilates full body",
          tag: "Full body",
          durationLabel: "Clase",
        },
        {
          id: "d1-c",
          youtubeId: "wOuwFgJzDvw",
          title: "Cierre: abdomen + consciencia en la respiración",
          tag: "Abs",
          durationLabel: "Clase",
        },
      ],
    },
    {
      day: 2,
      label: "Día 2",
      workouts: [
        {
          id: "d2-a",
          youtubeId: "FEWyei-Rsmo",
          title: "Activación: tren superior + abs (10 min)",
          tag: "Activación",
          durationLabel: "10 min",
          optional: true,
        },
        {
          id: "d2-b",
          youtubeId: "Yru31rZiftY",
          title: "Clase principal: Pilates full body",
          tag: "Full body",
          durationLabel: "Clase",
        },
        {
          id: "d2-c",
          youtubeId: "-n7hyhNpHjE",
          title: "Cierre: oblicuos y abdomen express",
          tag: "Abs",
          durationLabel: "Express",
        },
      ],
    },
    {
      day: 3,
      label: "Día 3",
      // Solo 2 sesiones
      workouts: [
        {
          id: "d3-b",
          youtubeId: "FTu_ArZsCb4",
          title: "Clase principal: Body In Flow",
          tag: "Flow",
          durationLabel: "Clase",
        },
        {
          id: "d3-c",
          youtubeId: "wOuwFgJzDvw",
          title: "Cierre: abdomen + respiración",
          tag: "Abs",
          durationLabel: "Clase",
        },
      ],
    },
    {
      day: 4,
      label: "Día 4",
      workouts: [
        {
          id: "d4-a",
          youtubeId: "3PKIarxLVvM",
          title: "Activación: meditación del cuerpo",
          tag: "Activación",
          durationLabel: "Suave",
          optional: true,
        },
        {
          id: "d4-b",
          youtubeId: "-n7hyhNpHjE",
          title: "Clase principal: oblicuos y abdomen",
          tag: "Abs",
          durationLabel: "Express",
        },
        {
          id: "d4-c",
          youtubeId: "FEWyei-Rsmo",
          title: "Cierre: tren superior + abs",
          tag: "Upper + abs",
          durationLabel: "10 min",
        },
      ],
    },
    {
      day: 5,
      label: "Descanso",
      rest: true,
      restMessage:
        "Hoy es día de descanso. El cuerpo integra lo que trabajaste. Dedica este espacio a mentalidad: escucha, respira y vuelve a ti.",
      workouts: [
        {
          id: "d5-charla-1",
          youtubeId: "UnKU-iWGZrI",
          title: "Charla: bienvenida al cambio real",
          tag: "Mentalidad",
          durationLabel: "Charla",
          mindset: true,
        },
        {
          id: "d5-charla-2",
          youtubeId: "8OkLktIA87E",
          title: "Charla: nuevos comienzos",
          tag: "Mentalidad",
          durationLabel: "Charla",
          mindset: true,
        },
        {
          id: "d5-med",
          youtubeId: "3PKIarxLVvM",
          title: "Meditación de cierre (opcional)",
          tag: "Mentalidad",
          durationLabel: "Opcional",
          optional: true,
          mindset: true,
        },
      ],
    },
    {
      day: 6,
      label: "Día 6",
      workouts: [
        {
          id: "d6-a",
          youtubeId: "FEWyei-Rsmo",
          title: "Activación: tren superior + abs",
          tag: "Activación",
          durationLabel: "10 min",
          optional: true,
        },
        {
          id: "d6-b",
          youtubeId: "Yru31rZiftY",
          title: "Clase principal: Pilates full body",
          tag: "Full body",
          durationLabel: "Clase",
        },
        {
          id: "d6-c",
          youtubeId: "FTu_ArZsCb4",
          title: "Cierre: Body In Flow",
          tag: "Flow",
          durationLabel: "Clase",
        },
      ],
    },
    {
      day: 7,
      label: "Día 7",
      // Solo 2 sesiones
      workouts: [
        {
          id: "d7-b",
          youtubeId: "wOuwFgJzDvw",
          title: "Clase principal: abdomen + respiración",
          tag: "Abs",
          durationLabel: "Clase",
        },
        {
          id: "d7-c",
          youtubeId: "-n7hyhNpHjE",
          title: "Cierre: oblicuos express",
          tag: "Abs",
          durationLabel: "Express",
        },
      ],
    },
  ] satisfies ProgramDay[],
} as const;
