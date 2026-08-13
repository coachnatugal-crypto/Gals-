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
  /** Copy persuasivo para el modal de reserva. */
  signupPitch?: string;
  image: string;
  why: { emoji: string; label: string }[];
  /** Fecha/hora ISO (Bogotá) — se oculta al pasar el día del evento. */
  startsAt: string;
  stats?: { label: string; value: string }[];
  afterEvent?: { name: string; price: string }[];
  /** Precio del evento (texto, ej. "$120.000"). */
  price?: string;
  /** Si true, se muestra el precio en las tarjetas de la landing. */
  showPrice?: boolean;
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
    signupPitch:
      "Una mañana afuera para volver a sentirte en tu cuerpo: pilates, meditación y café con mujeres que están en la misma. Cupo gratis, guárdalo antes de que se llene.",
    image: "/media/capsules/pilates.jpg",
    startsAt: "2026-08-07T10:00:00-05:00",
    why: [
      { emoji: "🧘", label: "Clase de Pilates" },
      { emoji: "🕊️", label: "Meditación guiada" },
      { emoji: "☕", label: "Café / té" },
      { emoji: "🩶", label: "Filosofía GAL'S" },
    ],
    cta: "Reservar mi cupo gratis",
    beweAfter: "form",
    price: "Gratis",
    showPrice: true,
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
    signupPitch:
      "La party más GAL'S del mes: viste de azul/blanco, muévete con playlist buena y sal con fotos que sí quieres publicar. Es gratis, solo falta tu nombre en la lista.",
    image: "/media/eventos/girls-talk-hormonas.jpg",
    startsAt: "2026-08-17T10:00:00-05:00",
    why: [
      { emoji: "💙", label: "Dress code azul/blanco" },
      { emoji: "🎵", label: "Playlist especial" },
      { emoji: "📸", label: "Contenido para redes" },
      { emoji: "👯", label: "Comunidad real" },
    ],
    cta: "Reservar mi cupo gratis",
    beweAfter: "form",
    price: "Gratis",
    showPrice: true,
  },
];

export const PAID_EVENTS: GalsEvent[] = [
  {
    id: "back-to-routine",
    kind: "paid",
    title: "Back to Routine",
    eyebrow: "Experiencia paga",
    dateLabel: "5 de agosto",
    timeLabel: "6PM",
    place: `GAL'S Studio · ${ADDRESS}`,
    headline: "Vuelve a tu rutina",
    subhead:
      "2 horas para retomar tu movimiento y tu alimentación, sin culpa y sin extremos",
    signupPitch:
      "Si llevas semanas (o meses) posponiendo tu rutina: estas 2 horas son el empujón. Pilates, alimentación sin culpa y un plan claro para no volver a empezar desde cero.",
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
    price: "$80.000",
    showPrice: true,
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
    signupPitch:
      "Entrenas y además sales sabiendo qué colores te favorecen de verdad. Pilates Sculpt + colorimetría en una sola experiencia: cuerpo activado e imagen con criterio.",
    image: "/media/capsules/_DSC4460.jpg",
    startsAt: "2026-08-13T10:00:00-05:00",
    why: [
      { emoji: "🔥", label: "Pilates Sculpt (50-60 min)" },
      { emoji: "🎨", label: "Colorimetría e Imagen" },
      { emoji: "👗", label: "Aplícalo a tu Estilo" },
      { emoji: "🧥", label: "Closet Funcional" },
      { emoji: "✨", label: "Alianza Exclusiva" },
      { emoji: "👯", label: "Comunidad Real" },
    ],
    price: "$120.000",
    showPrice: true,
    cta: "Reservar mi cupo",
    beweAfter: "packs",
  },
  {
    id: "girls-talk-hormonas",
    kind: "paid",
    featured: true,
    title: "Girls Talk: Hormonas & Movimiento",
    eyebrow: "Experiencia paga · protagonista",
    dateLabel: "29 de agosto",
    timeLabel: "9:30AM",
    place: `GAL'S Studio · ${ADDRESS}`,
    headline: "Entiende por fin tu cuerpo y tu ciclo",
    subhead:
      "Disfruta de nuestra charla con una invitada especial: nutrición y salud ginecológica para volver a escucharte con calma",
    signupPitch:
      "Si entrenas igual todo el mes y no entiendes por qué un día te sientes imparable y otro no: aquí lo vas a clarificar. Habla con una experta, haz tus preguntas y sal con una forma real de moverte según tu ciclo.",
    image: "/media/eventos/blue-pilates-party.jpg",
    startsAt: "2026-08-29T09:30:00-05:00",
    why: [
      { emoji: "🩸", label: "Tu Ciclo Hormonal" },
      { emoji: "🏃‍♀️", label: "Entrena Según tu Fase" },
      { emoji: "🥗", label: "Alimentación Amigable" },
      { emoji: "🧘", label: "Pilates y Salud Hormonal" },
      { emoji: "💬", label: "Espacio de Preguntas" },
      { emoji: "👯", label: "Comunidad Real" },
    ],
    price: "$90.000",
    showPrice: true,
    cta: "Reservar mi cupo",
    beweAfter: "packs",
  },
];

/** YYYY-MM-DD en zona Bogotá. */
function bogotaDay(d: Date) {
  return d.toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

/** Visible si el día del evento (Bogotá) aún no pasó. */
export function isEventUpcoming(event: GalsEvent, now = new Date()) {
  return bogotaDay(new Date(event.startsAt)) >= bogotaDay(now);
}

export function getActiveFreeEvents(now = new Date()) {
  return FREE_EVENTS.filter((e) => isEventUpcoming(e, now));
}

export function getActivePaidEvents(now = new Date()) {
  return PAID_EVENTS.filter((e) => isEventUpcoming(e, now)).sort(
    (a, b) =>
      new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

/** Próximo evento pago (prioriza flagged featured si sigue activo). */
export function getFeaturedEvent(now = new Date()) {
  const active = getActivePaidEvents(now);
  if (active.length === 0) return undefined;
  return active.find((e) => e.featured) ?? active[0];
}

/** Próximo evento cuyo startsAt aún no llega — prioriza eventos de pago. */
export function getNextLiveEvent(now = new Date()) {
  const t = now.getTime();
  const upcoming = (list: readonly GalsEvent[]) =>
    list
      .filter((e) => new Date(e.startsAt).getTime() > t)
      .sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      );
  return upcoming(PAID_EVENTS)[0] ?? upcoming(FREE_EVENTS)[0];
}

export function findEvent(id: string) {
  return [...FREE_EVENTS, ...PAID_EVENTS].find((e) => e.id === id);
}
