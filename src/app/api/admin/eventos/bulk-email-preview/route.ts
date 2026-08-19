import { NextResponse } from "next/server";
import { ADDRESS } from "@/lib/constants";
import type { GalsEvent } from "@/lib/eventos";
import { fetchEventById } from "@/lib/eventos-db";
import {
  type BulkEmailCtaTarget,
  type BulkEmailDesign,
  buildBulkEventEmailHtml,
} from "@/lib/resend";
import { isSupabaseConfigured } from "@/lib/supabase/server";

const SAMPLE_EVENT: GalsEvent = {
  id: "email-preview",
  kind: "paid",
  title: "Experience Week (preview)",
  eyebrow: "Prueba",
  dateLabel: "12 de septiembre",
  timeLabel: "7:00 PM",
  place: `GAL'S Studio · ${ADDRESS}`,
  headline: "Preview del mail",
  subhead: "Solo para ver el diseño",
  image: "/media/capsules/pilates.jpg",
  startsAt: "2026-09-12T19:00:00-05:00",
  why: [],
  cta: "Reservar",
  beweAfter: "form",
  price: "$60.000",
  priceAmount: 60000,
};

function parseDesign(raw: unknown): BulkEmailDesign | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const ctaTarget =
    d.ctaTarget === "event" ||
    d.ctaTarget === "whatsapp" ||
    d.ctaTarget === "custom"
      ? (d.ctaTarget as BulkEmailCtaTarget)
      : undefined;
  return {
    badge: typeof d.badge === "string" ? d.badge : undefined,
    accent: typeof d.accent === "string" ? d.accent : undefined,
    showLogo: typeof d.showLogo === "boolean" ? d.showLogo : undefined,
    showCover: typeof d.showCover === "boolean" ? d.showCover : undefined,
    coverUrl: typeof d.coverUrl === "string" ? d.coverUrl : undefined,
    showDetails:
      typeof d.showDetails === "boolean" ? d.showDetails : undefined,
    ctaLabel: typeof d.ctaLabel === "string" ? d.ctaLabel : undefined,
    ctaTarget,
    ctaUrl: typeof d.ctaUrl === "string" ? d.ctaUrl : undefined,
    showWhatsAppLink:
      typeof d.showWhatsAppLink === "boolean"
        ? d.showWhatsAppLink
        : undefined,
    signOff: typeof d.signOff === "string" ? d.signOff : undefined,
  };
}

/** HTML del mail masivo sin enviar (para preview en admin). */
export async function POST(request: Request) {
  let body: {
    name?: string;
    eventId?: string;
    subject?: string;
    message?: string;
    design?: BulkEmailDesign;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const name = body.name?.trim() || "Naty";
  const message = body.message?.trim() || "Este es un preview del correo.";
  const subject = body.subject?.trim() || "Preview · GAL'S";
  const design = parseDesign(body.design);

  let event: GalsEvent = SAMPLE_EVENT;
  if (body.eventId?.trim()) {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Supabase no configurado" },
        { status: 503 },
      );
    }
    const fromDb = await fetchEventById(body.eventId.trim());
    if (!fromDb) {
      return NextResponse.json(
        { ok: false, error: "Evento no encontrado" },
        { status: 404 },
      );
    }
    event = fromDb;
  }

  const html = buildBulkEventEmailHtml({
    name,
    event,
    message,
    design,
  });

  const firstName = name.split(/\s+/)[0] || name;
  const resolvedSubject = subject
    .replaceAll("{{nombre}}", firstName)
    .replaceAll("{{evento}}", event.title);

  return NextResponse.json({
    ok: true,
    html,
    subject: resolvedSubject,
    eventId: event.id,
    eventTitle: event.title,
  });
}
