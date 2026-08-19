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
  /** Monto COP para Mercado Pago (obligatorio en eventos paid cobrables). */
  priceAmount?: number;
  /** Si true, se muestra el precio en las tarjetas de la landing. */
  showPrice?: boolean;
  /** Solo admin / DB — si false no aparece en la landing. */
  published?: boolean;
  /** Cupo máximo opcional (admin). */
  capacity?: number;
  cta: string;
  /**
   * Tras lead gratis: abre form/packs Bewe.
   * En eventos paid el cobro va por Mercado Pago.
   */
  beweAfter: "form" | "packs";
};

const STUDIO = `GAL'S Studio · ${ADDRESS}`;

export const FREE_EVENTS: GalsEvent[] = [
  {
    id: "clase-clientas-sep",
    kind: "free",
    title: "Clase con clientas",
    eyebrow: "Solo clientas",
    dateLabel: "5 de septiembre",
    timeLabel: "8:30AM",
    place: STUDIO,
    headline: "Empezamos el día juntas",
    subhead: "Un espacio especial para nuestras clientas, con intención",
    concept:
      "Un espacio especial para nuestras clientas: nos movemos juntas para empezar el día con intención.",
    signupPitch:
      "Si ya eres GAL'S, este cupo es para ti. Déjanos tus datos y te confirmamos el lugar.",
    image: "/media/capsules/pilates.jpg",
    startsAt: "2026-09-05T08:30:00-05:00",
    why: [
      { emoji: "🧘", label: "Movimiento en comunidad" },
      { emoji: "☀️", label: "8:30 am" },
      { emoji: "🩶", label: "Solo clientas" },
      { emoji: "👯", label: "Empezar el día juntas" },
    ],
    cta: "Reservar mi cupo",
    beweAfter: "form",
    price: "Incluido en tu plan",
    showPrice: true,
  },
];

export const PAID_EVENTS: GalsEvent[] = [
  {
    id: "pilates-yin-yoga-ago",
    kind: "paid",
    featured: true,
    title: "Pilates & Yin Yoga",
    eyebrow: "Experiencia · 60 min",
    dateLabel: "22 de agosto",
    timeLabel: "Sábado",
    place: STUDIO,
    headline: "Mueve el cuerpo y encuentra tu paz",
    subhead:
      "Una práctica suave para calmarte y conectar con la vibración del amor",
    concept:
      "Mueve el cuerpo y encuentra tu paz interna. Una práctica suave para calmarte y conectar con la vibración del amor: la que te llena para dar más y más al mundo que lo necesita.",
    signupPitch:
      "60 minutos para bajar revoluciones. Público $60.000 · clientas: incluido en tu plan. Si vienes de afuera, paga aquí y asegura tu cupo.",
    image: "/media/capsules/yin-yoga.jpg",
    startsAt: "2026-08-22T10:00:00-05:00",
    why: [
      { emoji: "🧘", label: "Pilates + Yin" },
      { emoji: "🕊️", label: "Calma y conexión" },
      { emoji: "⏱️", label: "60 min" },
      { emoji: "🩶", label: "Clientas: en tu plan" },
    ],
    price: "$60.000",
    priceAmount: 60000,
    showPrice: true,
    cta: "Pagar y reservar",
    beweAfter: "packs",
  },
  {
    id: "pilates-color-lab-ago",
    kind: "paid",
    title: "Pilates & Color Lab",
    eyebrow: "Experiencia sensorial",
    dateLabel: "28 de agosto",
    timeLabel: "Viernes",
    place: STUDIO,
    headline: "Movimiento y color se encuentran",
    subhead:
      "Pilates envuelto en una experiencia sensorial donde cada tono guía tu práctica",
    concept:
      "Movimiento y color se encuentran. Pilates envuelto en una experiencia sensorial donde cada tono guía la energía de tu práctica.",
    signupPitch:
      "Una noche distinta: pilates + color. Déjanos tus datos y te llevamos al pago para asegurar cupo.",
    image: "/media/capsules/_DSC4460.jpg",
    startsAt: "2026-08-28T18:00:00-05:00",
    why: [
      { emoji: "🎨", label: "Color Lab" },
      { emoji: "🔥", label: "Pilates" },
      { emoji: "✨", label: "Experiencia sensorial" },
      { emoji: "👯", label: "Comunidad" },
    ],
    /** Precio pendiente de confirmar en el PDF */
    price: "Por confirmar",
    showPrice: true,
    cta: "Reservar mi cupo",
    beweAfter: "packs",
  },
  {
    id: "cycle-power-ago",
    kind: "paid",
    title: "Cycle & Power",
    eyebrow: "Cardio + fuerza",
    dateLabel: "29 de agosto",
    timeLabel: "Sábado",
    place: STUDIO,
    headline: "Sube el ritmo",
    subhead:
      "Cardio sobre la bici y trabajo de fuerza para encender tu potencia",
    concept:
      "Sube el ritmo. Cardio sobre la bici y trabajo de fuerza para encender tu potencia y salir con el corazón a mil.",
    signupPitch:
      "Si quieres sudar y salir con el corazón a mil, este es tu sábado. Confirmamos precio al reservar.",
    image: "/media/capsules/sculpt.jpg",
    startsAt: "2026-08-29T10:00:00-05:00",
    why: [
      { emoji: "🚴", label: "Cycle" },
      { emoji: "💪", label: "Fuerza" },
      { emoji: "🔥", label: "Cardio" },
      { emoji: "🩶", label: "Potencia" },
    ],
    price: "Por confirmar",
    showPrice: true,
    cta: "Reservar mi cupo",
    beweAfter: "packs",
  },
  {
    id: "luz-interior-velas",
    kind: "paid",
    title: "Luz Interior · Pilates & Velas",
    eyebrow: "Práctica íntima",
    dateLabel: "5 de septiembre",
    timeLabel: "10:30AM",
    place: STUDIO,
    headline: "Pilates a la luz de las velas",
    subhead: "Bajamos el ritmo, encendemos la calma y cerramos en calidez",
    concept:
      "Pilates a la luz de las velas. Bajamos el ritmo, encendemos la calma y cerramos con una práctica cálida e íntima.",
    signupPitch:
      "Una mañana íntima para volver a ti. Déjanos tus datos y te guiamos al pago.",
    image: "/media/experiencias/wellness-experiences.jpg",
    startsAt: "2026-09-05T10:30:00-05:00",
    why: [
      { emoji: "🕯️", label: "Velas" },
      { emoji: "🧘", label: "Pilates" },
      { emoji: "🌙", label: "Calma" },
      { emoji: "🩶", label: "Espacio íntimo" },
    ],
    price: "Por confirmar",
    showPrice: true,
    cta: "Reservar mi cupo",
    beweAfter: "packs",
  },
  {
    id: "taller-anaka",
    kind: "paid",
    title: "Taller con Anaka",
    eyebrow: "Taller especial",
    dateLabel: "12 de septiembre",
    timeLabel: "Sábado",
    place: STUDIO,
    headline: "Cuerpo, respiración y presencia",
    subhead: "Encuentro guiado por Anaka · cupos limitados",
    concept:
      "Un encuentro guiado por Anaka para profundizar en cuerpo, respiración y presencia. Cupos limitados.",
    signupPitch:
      "Cupos limitados. Déjanos tus datos y te confirmamos pago y lugar.",
    image: "/media/capsules/experiencias-gals.jpg",
    startsAt: "2026-09-12T10:00:00-05:00",
    why: [
      { emoji: "🌬️", label: "Respiración" },
      { emoji: "🧘", label: "Presencia" },
      { emoji: "✨", label: "Invitada Anaka" },
      { emoji: "🎟️", label: "Cupos limitados" },
    ],
    price: "Por confirmar",
    showPrice: true,
    cta: "Reservar mi cupo",
    beweAfter: "packs",
  },
  {
    id: "blue-paty-amor-amistad",
    kind: "paid",
    title: "Blue Paty · Amor y Amistad",
    eyebrow: "Celebración",
    dateLabel: "19 de septiembre",
    timeLabel: "Sábado",
    place: STUDIO,
    headline: "Celebramos en clave azul",
    subhead: "Trae a tu persona favorita y reconecten juntas",
    concept:
      "Celebramos el amor y la amistad en clave azul. Trae a tu persona favorita y compartan un día pensado para reconectar y consentirse.",
    signupPitch:
      "Trae a tu persona favorita. Reserva tu cupo y te confirmamos detalles de pago.",
    image: "/media/eventos/blue-pilates-party.jpg",
    startsAt: "2026-09-19T10:00:00-05:00",
    why: [
      { emoji: "💙", label: "Dress code azul" },
      { emoji: "👯", label: "Amor y amistad" },
      { emoji: "🎉", label: "Celebración" },
      { emoji: "🩶", label: "Comunidad GAL'S" },
    ],
    price: "Por confirmar",
    showPrice: true,
    cta: "Reservar mi cupo",
    beweAfter: "packs",
  },
  {
    id: "bowl-balance-sep",
    kind: "paid",
    title: "Bowl & Balance",
    eyebrow: "Miembros Gals + público",
    dateLabel: "26 de septiembre",
    timeLabel: "Sábado",
    place: STUDIO,
    headline: "Movernos y nutrirnos en comunidad",
    subhead:
      "Pilates, arma tu bowl y descubre lo nuevo de la tienda",
    concept:
      "Una mañana para movernos y nutrirnos en comunidad: fluye en tu clase de pilates, arma tu propio bowl con ingredientes frescos y quédate a descubrir lo nuevo de la tienda.",
    signupPitch:
      "Público $99.000 · Gals $40.000. El pago online es tarifa público; si eres miembro, escríbenos por WhatsApp para tu tarifa.",
    image: "/media/alimentacion/nati-bowl.png",
    startsAt: "2026-09-26T10:00:00-05:00",
    why: [
      { emoji: "🧘", label: "Clase de pilates" },
      { emoji: "🥗", label: "Arma tu bowl" },
      { emoji: "🛍️", label: "Tienda GAL'S" },
      { emoji: "👯", label: "Comunidad" },
    ],
    price: "$99.000",
    priceAmount: 99000,
    showPrice: true,
    cta: "Pagar y reservar",
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

export function getActiveFreeEvents(
  now = new Date(),
  list: readonly GalsEvent[] = FREE_EVENTS,
) {
  return list.filter((e) => e.kind === "free" && isEventUpcoming(e, now));
}

export function getActivePaidEvents(
  now = new Date(),
  list: readonly GalsEvent[] = PAID_EVENTS,
) {
  return list
    .filter((e) => e.kind === "paid" && isEventUpcoming(e, now))
    .sort(
      (a, b) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
}

/** Próximo evento pago (prioriza flagged featured si sigue activo). */
export function getFeaturedEvent(
  now = new Date(),
  list: readonly GalsEvent[] = PAID_EVENTS,
) {
  const active = getActivePaidEvents(now, list);
  if (active.length === 0) return undefined;
  return active.find((e) => e.featured) ?? active[0];
}

/** Próximo evento cuyo startsAt aún no llega — prioriza eventos de pago. */
export function getNextLiveEvent(
  now = new Date(),
  list: readonly GalsEvent[] = [...PAID_EVENTS, ...FREE_EVENTS],
) {
  const t = now.getTime();
  const upcoming = list
    .filter((e) => new Date(e.startsAt).getTime() > t)
    .sort(
      (a, b) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
  return (
    upcoming.find((e) => e.kind === "paid") ??
    upcoming.find((e) => e.kind === "free")
  );
}

export function findEvent(
  id: string,
  list: readonly GalsEvent[] = [...FREE_EVENTS, ...PAID_EVENTS],
) {
  return list.find((e) => e.id === id);
}

/** Monto a cobrar en Mercado Pago. */
export function getEventPriceAmount(event: GalsEvent): number | null {
  if (typeof event.priceAmount === "number" && event.priceAmount > 0) {
    return event.priceAmount;
  }
  if (event.kind !== "paid") return null;
  // Si el label trae varios precios ("Público $99.000 · Gals $40.000"),
  // usar solo el primero para no concatenar dígitos.
  const firstChunk = (event.price ?? "").split(/[·|/]| - /)[0] ?? "";
  const fromLabel = firstChunk.replace(/[^\d]/g, "");
  if (!fromLabel) return null;
  const n = Number(fromLabel);
  return Number.isFinite(n) && n > 0 ? n : null;
}
