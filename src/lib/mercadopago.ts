import { MercadoPagoConfig, Preference } from "mercadopago";

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export function getMpAccessToken() {
  return (
    process.env.MP_ACCESS_TOKEN?.trim() ||
    process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() ||
    ""
  );
}

export function parsePriceCop(price?: string): number | null {
  if (!price) return null;
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) && n > 0 ? n : null;
}

type PreferenceInput = {
  title: string;
  unitPrice: number;
  quantity?: number;
  eventId: string;
  registrationId: string;
  payerName: string;
  payerWhatsapp: string;
};

/** Crea preferencia Checkout Pro y devuelve URL de pago. */
export async function createEventCheckoutPreference(input: PreferenceInput) {
  const accessToken = getMpAccessToken();
  if (!accessToken) {
    throw new Error("Mercado Pago no configurado (MP_ACCESS_TOKEN)");
  }

  const site = getSiteUrl();
  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        {
          id: input.eventId,
          title: input.title.slice(0, 250),
          quantity: input.quantity ?? 1,
          unit_price: input.unitPrice,
          currency_id: "COP",
        },
      ],
      payer: {
        name: input.payerName,
      },
      metadata: {
        eventId: input.eventId,
        registrationId: input.registrationId,
        whatsapp: input.payerWhatsapp,
        name: input.payerName,
      },
      external_reference: input.registrationId,
      notification_url: `${site}/api/mercadopago/webhook`,
      back_urls: {
        success: `${site}/eventos?pago=ok`,
        failure: `${site}/eventos?pago=error`,
        pending: `${site}/eventos?pago=pendiente`,
      },
      auto_return: "approved",
      statement_descriptor: "GALS EVENTOS",
    },
  });

  const initPoint =
    result.init_point ||
    result.sandbox_init_point ||
    null;

  if (!initPoint) {
    throw new Error("Mercado Pago no devolvió URL de pago");
  }

  return {
    id: result.id,
    initPoint,
  };
}
