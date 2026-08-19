/** Portadas sugeridas para eventos (archivos ya en /public). */

export type EventCoverPreset = {
  src: string;
  label: string;
  group: "Eventos" | "Movimiento" | "Experiencias" | "Alimentación" | "Comunidad";
};

export const EVENT_COVER_PRESETS: EventCoverPreset[] = [
  {
    src: "/media/eventos/blue-pilates-party.jpg",
    label: "Blue Pilates Party",
    group: "Eventos",
  },
  {
    src: "/media/eventos/girls-talk-hormonas.jpg",
    label: "Girls talk",
    group: "Eventos",
  },
  {
    src: "/media/eventos/popup-eventos.jpg",
    label: "Popup eventos",
    group: "Eventos",
  },
  {
    src: "/media/capsules/pilates.jpg",
    label: "Pilates",
    group: "Movimiento",
  },
  {
    src: "/media/capsules/barre.jpg",
    label: "Barre",
    group: "Movimiento",
  },
  {
    src: "/media/capsules/yin-yoga.jpg",
    label: "Yin Yoga",
    group: "Movimiento",
  },
  {
    src: "/media/capsules/sculpt.jpg",
    label: "Sculpt",
    group: "Movimiento",
  },
  {
    src: "/media/capsules/mentalidad.jpg",
    label: "Mentalidad",
    group: "Movimiento",
  },
  {
    src: "/media/capsules/experiencias-gals.jpg",
    label: "Experiencias GAL'S",
    group: "Experiencias",
  },
  {
    src: "/media/experiencias/wellness-experiences.jpg",
    label: "Wellness",
    group: "Experiencias",
  },
  {
    src: "/media/experiencias/clases-entre-semana.jpg",
    label: "Clases entre semana",
    group: "Experiencias",
  },
  {
    src: "/media/alimentacion/nati-bowl.png",
    label: "Bowl",
    group: "Alimentación",
  },
  {
    src: "/media/alimentacion/nati-mercado.png",
    label: "Mercado",
    group: "Alimentación",
  },
  {
    src: "/media/alimentacion/nati-waffle.png",
    label: "Disfrutar",
    group: "Alimentación",
  },
  {
    src: "/media/community/welcome-popup.jpg",
    label: "Comunidad",
    group: "Comunidad",
  },
  {
    src: "/media/coaches/nati.jpg",
    label: "Nati",
    group: "Comunidad",
  },
  {
    src: "/media/programa/reto-pilates-en-casa.png",
    label: "Reto en casa",
    group: "Movimiento",
  },
];

export const EVENT_COVER_GROUPS = [
  "Eventos",
  "Movimiento",
  "Experiencias",
  "Alimentación",
  "Comunidad",
] as const;
