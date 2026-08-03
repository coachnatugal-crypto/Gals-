import { ADDRESS } from "@/lib/constants";

/** Contenido de la landing /eventos (no afecta la home). */

export const EVENTOS_HERO_VIDEO = "/media/eventos/hero-eventos.mp4";

export const EVENTOS_WHATSAPP_GENERAL =
  "Hola! Quiero saber más de los eventos de GAL's 🩶";

export const PARA_TI_SI = [
  "Sientes que perdiste tu ritmo y quieres retomarlo sin culpa",
  "Quieres entender mejor tu cuerpo, tus hormonas y cómo moverte según tu ciclo",
  "Buscas replantear tu alimentación desde el disfrute, no desde la restricción",
  "Buscas sentirte bien por dentro y también proyectar seguridad en tu imagen",
  "Quieres conocer mujeres reales que están en el mismo momento que tú",
  "Ya conoces GAL's o nunca has venido, pero sientes curiosidad por vivirlo",
] as const;

export type EventKind = "free" | "paid";

export type GalsEvent = {
  id: string;
  kind: EventKind;
  featured?: boolean;
  title: string;
  eyebrow: string;
  dateLabel: string;
  timeLabel?: string;
  place: string;
  headline: string;
  subhead: string;
  concept?: string;
  image: string;
  why: { emoji: string; label: string }[];
  /** Fecha ISO local Bogotá para countdown (solo featured). */
  startsAt?: string;
  stats?: { label: string; value: string }[];
  afterEvent?: { name: string; price: string }[];
  cta: string;
  /** Tras enviar form: abre form Bewe o packs Bewe. */
  beweAfter: "form" | "packs";
};

export const FREE_EVENTS: GalsEvent[] = [
  {
    id: "community-pilates-morning",
    kind: "free",
    title: "Community Pilates Morning",
    eyebrow: "Evento gratis",
    dateLabel: "7 de agosto",
    timeLabel: "10AM",
    place: "Parque cercano al studio · Bogotá",
    headline: "Llevamos GAL'S fuera del studio",
    subhead: "Pilates · meditación · café/té · filosofía GAL'S",
    concept:
      "Llevar la experiencia GAL'S fuera del estudio (parque cercano). Incluye clase de pilates, meditación guiada, café/té y presentación de la filosofía GAL'S.",
    image: "/media/capsules/pilates.jpg",
    why: [
      { emoji: "🧘", label: "Clase de Pilates" },
      { emoji: "🕊️", label: "Meditación guiada" },
      { emoji: "☕", label: "Café / té" },
      { emoji: "🩶", label: "Filosofía GAL'S" },
    ],
    cta: "Reservar mi cupo gratis",
    beweAfter: "form",
  },
  {
    id: "blue-pilates-party",
    kind: "free",
    title: "Blue Pilates Party",
    eyebrow: "Evento gratis",
    dateLabel: "17 de agosto",
    timeLabel: "10AM",
    place: "GAL'S Studio · Calle 97",
    headline: "Edición especial en azul",
    subhead: "Dress code azul/blanco · playlist · contenido para redes",
    concept:
      "Edición especial con dress code azul/blanco, playlist especial y contenido para redes.",
    image: "/media/capsules/IMG_4387.jpg",
    why: [
      { emoji: "💙", label: "Dress code azul/blanco" },
      { emoji: "🎵", label: "Playlist especial" },
      { emoji: "📸", label: "Contenido para redes" },
      { emoji: "👯", label: "Comunidad real" },
    ],
    cta: "Reservar mi cupo gratis",
    beweAfter: "form",
  },
];

export const PAID_EVENTS: GalsEvent[] = [
  {
    id: "back-to-routine",
    kind: "paid",
    featured: true,
    title: "Back to Routine",
    eyebrow: "Experiencia paga · protagonista",
    dateLabel: "5 de agosto",
    timeLabel: "6PM",
    place: `GAL'S Studio · ${ADDRESS}`,
    headline: "Vuelve a tu rutina",
    subhead:
      "2 horas para retomar tu movimiento y tu alimentación, sin culpa y sin extremos",
    image: "/media/capsules/whois-1.jpg",
    startsAt: "2026-08-05T18:00:00-05:00",
    stats: [
      { value: "+100", label: "Alumnas" },
      { value: "6PM", label: "Inicio" },
      { value: "2h", label: "Duración" },
    ],
    why: [
      { emoji: "🧘", label: "Clase de Pilates" },
      { emoji: "🥗", label: "Workshop de Alimentación" },
      { emoji: "📋", label: "Tu Plan a la Medida" },
      { emoji: "✨", label: "Nuevos Planes GAL'S" },
      { emoji: "🧠", label: "Journaling Guiado" },
      { emoji: "👯", label: "Comunidad Real" },
    ],
    afterEvent: [
      { name: "Semana GAL'S", price: "$80.000" },
      { name: "Membresía Ritual", price: "$380.000" },
    ],
    cta: "Reservar mi cupo",
    beweAfter: "packs",
  },
  {
    id: "pilates-sculpt-color-lab",
    kind: "paid",
    title: "Pilates Sculpt & Color Lab",
    eyebrow: "Experiencia paga",
    dateLabel: "13 de agosto",
    place: `GAL'S Studio · ${ADDRESS}`,
    headline: "Siéntete bien por dentro y por fuera",
    subhead:
      "Clase de Pilates Sculpt + workshop de colorimetría e imagen personal",
    image: "/media/capsules/_DSC4460.jpg",
    why: [
      { emoji: "🔥", label: "Pilates Sculpt (50-60 min)" },
      { emoji: "🎨", label: "Colorimetría e Imagen" },
      { emoji: "👗", label: "Aplícalo a tu Estilo" },
      { emoji: "🧥", label: "Closet Funcional" },
      { emoji: "✨", label: "Alianza Exclusiva" },
      { emoji: "👯", label: "Comunidad Real" },
    ],
    cta: "Reservar mi cupo",
    beweAfter: "packs",
  },
  {
    id: "girls-talk-hormonas",
    kind: "paid",
    title: "Girls Talk: Hormonas & Movimiento",
    eyebrow: "Experiencia paga",
    dateLabel: "29 de agosto",
    timeLabel: "9:30AM",
    place: `GAL'S Studio · ${ADDRESS}`,
    headline: "Entiende por fin tu cuerpo y tu ciclo",
    subhead: "Conversación con invitada especial (nutricionista/ginecóloga)",
    image: "/media/capsules/IMG_6986.jpg",
    why: [
      { emoji: "🩸", label: "Tu Ciclo Hormonal" },
      { emoji: "🏃‍♀️", label: "Entrena Según tu Fase" },
      { emoji: "🥗", label: "Alimentación Amigable" },
      { emoji: "🧘", label: "Pilates y Salud Hormonal" },
      { emoji: "💬", label: "Espacio de Preguntas" },
      { emoji: "👯", label: "Comunidad Real" },
    ],
    cta: "Reservar mi cupo",
    beweAfter: "packs",
  },
];

export function findEvent(id: string) {
  return [...FREE_EVENTS, ...PAID_EVENTS].find((e) => e.id === id);
}
