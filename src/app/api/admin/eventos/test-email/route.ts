import { NextResponse } from "next/server";
import { ADDRESS } from "@/lib/constants";
import type { GalsEvent } from "@/lib/eventos";
import { fetchEventById } from "@/lib/eventos-db";
import {
  isValidEmail,
  sendEventRegistrationEmail,
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

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY?.trim()) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY no configurada" },
      { status: 503 },
    );
  }

  let body: {
    to?: string;
    name?: string;
    eventId?: string;
    paid?: boolean;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const to = body.to?.trim().toLowerCase() ?? "";
  if (!isValidEmail(to)) {
    return NextResponse.json(
      { ok: false, error: "Email inválido" },
      { status: 400 },
    );
  }

  const name = body.name?.trim() || "GAL'S";
  let event: GalsEvent = SAMPLE_EVENT;
  let paid = Boolean(body.paid);

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
    if (body.paid === undefined) {
      paid = fromDb.kind === "paid";
    }
  }

  const sent = await sendEventRegistrationEmail({
    to,
    name,
    event,
    paid,
    test: true,
  });

  if (!sent) {
    return NextResponse.json(
      { ok: false, error: "Resend no pudo enviar el correo" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    to,
    eventId: event.id,
    eventTitle: event.title,
  });
}
