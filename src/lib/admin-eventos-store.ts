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
  whatsapp: string;
  source: string;
  status: "nuevo" | "confirmado" | "cancelado";
  createdAt: string;
};

export type AdminEventDraft = Omit<GalsEvent, "why" | "stats" | "afterEvent"> & {
  whyText: string;
  capacity?: number;
  published: boolean;
};

/** Catálogo real del proyecto (no inventa eventos). */
export function seedEvents(): GalsEvent[] {
  return [...PAID_EVENTS, ...FREE_EVENTS].map((e) => ({ ...e }));
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
    cta: kind === "free" ? "Reservar mi cupo gratis" : "Reservar mi cupo",
    beweAfter: kind === "free" ? "form" : "packs",
    price: kind === "free" ? "Gratis" : "",
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
    showPrice: event.showPrice ?? false,
    whyText: whyToText(event.why),
    capacity: undefined,
    published: true,
  };
}

export function draftToEvent(draft: AdminEventDraft): GalsEvent {
  const {
    whyText: _whyText,
    capacity: _capacity,
    published: _published,
    ...rest
  } = draft;
  return {
    ...rest,
    why: textToWhy(draft.whyText),
  };
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
