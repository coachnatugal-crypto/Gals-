import { NextResponse } from "next/server";
import { EMAIL } from "@/lib/constants";
import {
  getEventPriceAmount,
  isEventUpcoming,
  type GalsEvent,
} from "@/lib/eventos";
import {
  countActiveRegistrations,
  createPaymentRow,
  createRegistration,
  deleteRegistration,
  fetchEventById,
  fetchRegistrationById,
  markConfirmationEmailSent,
} from "@/lib/eventos-db";
import { createEventCheckoutPreference } from "@/lib/mercadopago";
import { isValidEmail, sendEventRegistrationEmail } from "@/lib/resend";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type Body = {
  name?: string;
  email?: string;
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

async function resolveEvent(eventId: string): Promise<GalsEvent | undefined> {
  return (await fetchEventById(eventId)) ?? undefined;
}

async function notifyStudio(input: {
  name: string;
  email: string;
  whatsapp: string;
  eventId: string;
  eventLabel: string;
  source: string;
  paid: boolean;
  amount: number | null;
  registrationId?: string;
}) {
  const formspree = process.env.FORMSPREE_ENDPOINT?.trim();
  const endpoint =
    formspree || `https://formsubmit.co/ajax/${encodeURIComponent(EMAIL)}`;

  const pagoLine = input.paid
    ? input.amount
      ? `Pago: Mercado Pago · $${input.amount.toLocaleString("es-CO")} COP`
      : "Pago: precio por confirmar (lead)"
    : "Pago: gratis / incluido";

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        whatsapp: input.whatsapp,
        eventId: input.eventId,
        event: input.eventLabel,
        source: input.source,
        registrationId: input.registrationId ?? "",
        _subject: `Evento GAL'S · ${input.eventLabel}`,
        message: `Lead evento: ${input.eventLabel}\nNombre: ${input.name}\nEmail: ${input.email}\nWhatsApp: ${input.whatsapp}\nFuente: ${input.source}\nRegistro: ${input.registrationId ?? "-"}\n${pagoLine}`,
        _template: "table",
        _captcha: "false",
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      console.error("[eventos/register] notify", upstream.status, text);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[eventos/register] notify", err);
    return false;
  }
}

async function sendConfirmationBestEffort(input: {
  registrationId: string;
  email: string;
  name: string;
  event: GalsEvent;
  paid?: boolean;
}) {
  try {
    const existing = await fetchRegistrationById(input.registrationId);
    if (existing?.confirmation_email_sent_at) return;

    const sent = await sendEventRegistrationEmail({
      to: input.email,
      name: input.name,
      event: input.event,
      paid: input.paid,
    });

    if (!sent) {
      console.error(
        "[eventos/register] confirmation email failed",
        input.registrationId,
      );
      return;
    }

    await markConfirmationEmailSent(input.registrationId);
  } catch (err) {
    console.error("[eventos/register] confirmation email", err);
  }
}

/**
 * Registro de eventos:
 * 1) Guarda en Supabase (fuente de verdad)
 * 2) Notifica al studio por correo (best effort)
 * 3) Confirmación Resend a la asistente (gratis ya; pago tras webhook MP)
 * 4) Si es pago con monto → Mercado Pago correlacionado al registration_id
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
  const email = body.email?.trim().toLowerCase() ?? "";
  const whatsapp = cleanPhone(body.whatsapp ?? "");
  const eventId = body.eventId?.trim() ?? "general";
  const source = body.source?.trim() || "eventos";

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Ingresa tu nombre" },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Ingresa un correo válido" },
      { status: 400 },
    );
  }
  if (!isValidWhatsApp(whatsapp)) {
    return NextResponse.json(
      { ok: false, error: "WhatsApp inválido" },
      { status: 400 },
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Base de eventos no configurada" },
      { status: 503 },
    );
  }

  const event = await resolveEvent(eventId);
  if (!event || event.published === false) {
    return NextResponse.json(
      { ok: false, error: "Evento no encontrado" },
      { status: 404 },
    );
  }
  if (!isEventUpcoming(event)) {
    return NextResponse.json(
      { ok: false, error: "Este evento ya pasó" },
      { status: 410 },
    );
  }

  if (typeof event.capacity === "number" && event.capacity > 0) {
    const taken = await countActiveRegistrations(eventId);
    if (taken >= event.capacity) {
      return NextResponse.json(
        { ok: false, error: "Cupos agotados para este evento" },
        { status: 409 },
      );
    }
  }

  const eventLabel = event.title;
  const isPaid = event.kind === "paid";
  const amount = getEventPriceAmount(event);
  const initialStatus =
    isPaid && amount ? "pendiente_pago" : isPaid ? "nuevo" : "nuevo";
  const awaitsCheckout = Boolean(isPaid && amount);

  try {
    const registrationId = await createRegistration({
      eventId,
      name,
      email,
      whatsapp,
      source,
      status: initialStatus,
    });

    void notifyStudio({
      name,
      email,
      whatsapp,
      eventId,
      eventLabel,
      source,
      paid: isPaid,
      amount,
      registrationId,
    });

    if (awaitsCheckout) {
      try {
        const checkout = await createEventCheckoutPreference({
          title: `GAL'S · ${eventLabel}`,
          unitPrice: amount!,
          eventId,
          registrationId,
          payerName: name,
          payerWhatsapp: whatsapp,
        });

        await createPaymentRow({
          registrationId,
          eventId,
          amount: amount!,
          preferenceId: checkout.id ?? null,
          externalReference: registrationId,
          status: "pending",
        });

        return NextResponse.json({
          ok: true,
          eventId,
          registrationId,
          checkoutUrl: checkout.initPoint,
          preferenceId: checkout.id,
        });
      } catch (mpError) {
        console.error("[eventos/register] mercadopago", mpError);
        try {
          await deleteRegistration(registrationId);
        } catch (rollbackErr) {
          console.error(
            "[eventos/register] rollback registration",
            registrationId,
            rollbackErr,
          );
        }
        return NextResponse.json(
          {
            ok: false,
            error:
              "No se pudo abrir el pago. Intenta de nuevo o escríbenos por WhatsApp.",
          },
          { status: 502 },
        );
      }
    }

    /** Gratis o lead sin monto: confirmación GAL'S ya */
    void sendConfirmationBestEffort({
      registrationId,
      email,
      name,
      event,
      paid: false,
    });

    if (isPaid && !amount) {
      return NextResponse.json({
        ok: true,
        eventId,
        registrationId,
        needsPriceConfirm: true,
        beweAfter: event.beweAfter,
      });
    }

    return NextResponse.json({
      ok: true,
      beweAfter: event.beweAfter,
      eventId,
      registrationId,
    });
  } catch (error) {
    console.error("[eventos/register]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo registrar" },
      { status: 500 },
    );
  }
}
