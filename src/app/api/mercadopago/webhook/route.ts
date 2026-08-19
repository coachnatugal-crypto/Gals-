import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import {
  findEvent,
  type GalsEvent,
} from "@/lib/eventos";
import {
  fetchEventById,
  fetchRegistrationById,
  markConfirmationEmailSent,
  updatePaymentByPreference,
} from "@/lib/eventos-db";
import { getMpAccessToken } from "@/lib/mercadopago";
import { sendEventRegistrationEmail } from "@/lib/resend";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

function mapMpStatus(
  status?: string | null,
): "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "in_process" {
  switch (status) {
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "refunded":
    case "charged_back":
      return "refunded";
    case "in_process":
    case "in_mediation":
      return "in_process";
    default:
      return "pending";
  }
}

async function resolveEvent(eventId: string): Promise<GalsEvent | undefined> {
  const fromDb = await fetchEventById(eventId);
  if (fromDb) return fromDb;
  return findEvent(eventId);
}

async function sendPaidConfirmation(registrationId: string) {
  try {
    const registration = await fetchRegistrationById(registrationId);
    if (!registration) return;
    if (registration.confirmation_email_sent_at) return;
    if (!registration.email) {
      console.warn("[mercadopago/webhook] sin email", registrationId);
      return;
    }

    const event = await resolveEvent(registration.event_id);
    if (!event) {
      console.warn("[mercadopago/webhook] evento no encontrado", registration.event_id);
      return;
    }

    const sent = await sendEventRegistrationEmail({
      to: registration.email,
      name: registration.name,
      event,
      paid: true,
    });

    if (!sent) {
      console.error("[mercadopago/webhook] confirmation email failed", registrationId);
      return;
    }

    await markConfirmationEmailSent(registrationId);
  } catch (err) {
    console.error("[mercadopago/webhook] confirmation email", err);
  }
}

/**
 * Webhook Mercado Pago → correlaciona pago con registration en Supabase.
 * Configurar notification_url en la preferencia (ya va en createEventCheckoutPreference).
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const accessToken = getMpAccessToken();
  if (!accessToken) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  try {
    const url = new URL(request.url);
    const topic =
      url.searchParams.get("topic") ||
      url.searchParams.get("type") ||
      "";
    const idFromQuery =
      url.searchParams.get("id") ||
      url.searchParams.get("data.id") ||
      "";

    let body: {
      type?: string;
      action?: string;
      data?: { id?: string };
    } = {};
    try {
      body = (await request.json()) as typeof body;
    } catch {
      body = {};
    }

    const type = body.type || topic;
    const paymentId = String(body.data?.id || idFromQuery || "");

    if (!paymentId || (type && !String(type).includes("payment"))) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const paymentApi = new Payment(client);
    const payment = await paymentApi.get({ id: paymentId });
    const paymentAny = payment as {
      status?: string | null;
      status_detail?: string | null;
      preference_id?: string | null;
      external_reference?: string | null;
      id?: string | number;
    };

    const status = mapMpStatus(paymentAny.status);
    const preferenceId =
      typeof paymentAny.preference_id === "string"
        ? paymentAny.preference_id
        : null;
    const externalReference =
      typeof paymentAny.external_reference === "string"
        ? paymentAny.external_reference
        : null;

    const updated = await updatePaymentByPreference({
      preferenceId,
      paymentId: String(paymentAny.id ?? paymentId),
      externalReference,
      status,
      statusDetail: paymentAny.status_detail ?? null,
      raw: payment,
    });

    if (status === "approved" && updated?.registrationId) {
      void sendPaidConfirmation(updated.registrationId);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[mercadopago/webhook]", error);
    return NextResponse.json({ ok: true, error: "logged" });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "mercadopago-webhook" });
}
