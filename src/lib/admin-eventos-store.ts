import {
  FREE_EVENTS,
  PAID_EVENTS,
  type EventKind,
  type GalsEvent,
} from "@/lib/eventos";

export const ADMIN_EVENTS_KEY = "gals-admin-events-v4";
export const ADMIN_REGS_KEY = "gals-admin-regs-v4";

export type AdminRegistration = {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  whatsapp: string;
  source: string;
  status:
    | "nuevo"
    | "pendiente_pago"
    | "pagado"
    | "confirmado"
    | "cancelado";
  createdAt: string;
};

export type AdminEventDraft = Omit<GalsEvent, "why" | "stats" | "afterEvent"> & {
  whyText: string;
  capacity?: number;
  published: boolean;
};

/** Eventos de la landing (código) para importar al admin / Supabase. */
export function landingEventsCatalog(): GalsEvent[] {
  return [...PAID_EVENTS, ...FREE_EVENTS].map((e) => ({
    ...e,
    published: e.published ?? true,
  }));
}

export function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function slugifyId(title: string) {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  return `${base || "evento"}-${Date.now().toString(36)}`;
}

export function whyToText(why: GalsEvent["why"]) {
  return why.map((w) => `${w.emoji} ${w.label}`).join("\n");
}

export function textToWhy(text: string): GalsEvent["why"] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s+/);
      const maybeEmoji = parts[0] ?? "✨";
      const isEmoji = /\p{Extended_Pictographic}/u.test(maybeEmoji);
      if (isEmoji && parts.length > 1) {
        return { emoji: maybeEmoji, label: parts.slice(1).join(" ") };
      }
      return { emoji: "✨", label: line };
    });
}

export function emptyDraft(kind: EventKind = "paid"): AdminEventDraft {
  return {
    id: "",
    kind,
    featured: false,
    title: "",
    eyebrow: kind === "free" ? "Evento gratis" : "Experiencia paga",
    dateLabel: "",
    timeLabel: "",
    place: "GAL'S Studio · Calle 97",
    headline: "",
    subhead: "",
    concept: "",
    image: "/media/capsules/pilates.jpg",
    startsAt: "",
    cta: kind === "free" ? "Reservar mi cupo gratis" : "Pagar y reservar",
    beweAfter: kind === "free" ? "form" : "packs",
    price: kind === "free" ? "Gratis" : "",
    priceAmount: undefined,
    showPrice: true,
    whyText: "",
    capacity: undefined,
    published: true,
  };
}

export function eventToDraft(event: GalsEvent): AdminEventDraft {
  return {
    ...event,
    price: event.price ?? (event.kind === "free" ? "Gratis" : ""),
    showPrice: event.showPrice ?? true,
    whyText: whyToText(event.why),
    capacity: event.capacity,
    published: event.published ?? true,
  };
}

export function draftToEvent(draft: AdminEventDraft): GalsEvent {
  const { whyText, ...rest } = draft;
  const labels = labelsFromStartsAt(draft.startsAt);
  return {
    ...rest,
    dateLabel: draft.dateLabel.trim() || labels.dateLabel,
    timeLabel: draft.timeLabel?.trim() || labels.timeLabel,
    why: textToWhy(whyText),
    published: draft.published,
    capacity: draft.capacity,
  };
}

/** Labels automáticos desde fecha Bogotá. */
export function labelsFromStartsAt(iso: string) {
  if (!iso) return { dateLabel: "", timeLabel: "" };
  try {
    const d = new Date(iso);
    const dateLabel = d.toLocaleDateString("es-CO", {
      timeZone: "America/Bogota",
      day: "numeric",
      month: "long",
    });
    const timeLabel = d
      .toLocaleTimeString("en-US", {
        timeZone: "America/Bogota",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(/\s/g, "")
      .toUpperCase();
    return { dateLabel, timeLabel };
  } catch {
    return { dateLabel: "", timeLabel: "" };
  }
}

/** Valor para input datetime-local (hora Bogotá). */
export function toDatetimeLocalValue(iso: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Bogota",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(d);
    const get = (type: string) =>
      parts.find((p) => p.type === type)?.value ?? "00";
    return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
  } catch {
    return iso.slice(0, 16);
  }
}

export function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}
