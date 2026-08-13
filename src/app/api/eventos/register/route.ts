import { NextResponse } from "next/server";
import { EMAIL } from "@/lib/constants";
import { findEvent, isEventUpcoming } from "@/lib/eventos";

type Body = {
  name?: string;
  whatsapp?: string;
  eventId?: string;
  source?: string;
};

function cleanPhone(value: string) {
  return value.replace(/[^\d+]/g, "").trim();
}

function isValidWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

/**
 * Registro de eventos (nombre + WhatsApp).
 * Notifica al studio y el front abre Bewe (form/packs) al responder ok.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const name = body.name?.trim() ?? "";
  const whatsapp = cleanPhone(body.whatsapp ?? "");
  const eventId = body.eventId?.trim() ?? "general";
  const source = body.source?.trim() || "eventos";

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Ingresa tu nombre" },
      { status: 400 },
    );
  }
  if (!isValidWhatsApp(whatsapp)) {
    return NextResponse.json(
      { ok: false, error: "WhatsApp inválido" },
      { status: 400 },
    );
  }

  const event = findEvent(eventId);
  if (event && !isEventUpcoming(event)) {
    return NextResponse.json(
      { ok: false, error: "Este evento ya pasó" },
      { status: 410 },
    );
  }
  const eventLabel = event?.title ?? eventId;

  const formspree = process.env.FORMSPREE_ENDPOINT?.trim();
  const endpoint =
    formspree || `https://formsubmit.co/ajax/${encodeURIComponent(EMAIL)}`;

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        whatsapp,
        eventId,
        event: eventLabel,
        source,
        _subject: `Evento GAL'S · ${eventLabel}`,
        message: `Lead evento: ${eventLabel}\nNombre: ${name}\nWhatsApp: ${whatsapp}\nFuente: ${source}`,
        _template: "table",
        _captcha: "false",
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      console.error("[eventos/register] upstream", upstream.status, text);
      return NextResponse.json(
        { ok: false, error: "No se pudo registrar" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      beweAfter: event?.beweAfter ?? "form",
      eventId,
    });
  } catch (error) {
    console.error("[eventos/register]", error);
    return NextResponse.json(
      { ok: false, error: "Error de red" },
      { status: 500 },
    );
  }
}
