import "server-only";
import {
  PLAN_WHATSAPP_ACCESS,
  type PaidWhatsAppTier,
} from "@/lib/constants";

/**
 * Invites Plus/VIP solo en servidor (nunca en el bundle cliente).
 * Configurá en .env.local:
 *   WHATSAPP_PLUS_INVITE_URL=https://chat.whatsapp.com/...
 *   WHATSAPP_VIP_INVITE_URL=https://chat.whatsapp.com/...
 *
 * Fallbacks solo server-side por compatibilidad; rotá los invites si se filtraron.
 */
const FALLBACK_PLUS =
  "https://chat.whatsapp.com/IC0wC2qqQJ9Hz9mPvYG3Ij";
const FALLBACK_VIP =
  "https://chat.whatsapp.com/K81XzbpTItH4I34eqtQF9a";

function envInvite(key: string): string | null {
  const v = process.env[key]?.trim();
  return v || null;
}

export function getPaidWhatsAppInvite(
  tier: PaidWhatsAppTier,
): string | null {
  if (tier === "plus") {
    return envInvite("WHATSAPP_PLUS_INVITE_URL") || FALLBACK_PLUS;
  }
  if (tier === "vip") {
    return envInvite("WHATSAPP_VIP_INVITE_URL") || FALLBACK_VIP;
  }
  return null;
}

export function getPlanWhatsAppUrl(
  planId: keyof typeof PLAN_WHATSAPP_ACCESS,
): string | null {
  const tier = PLAN_WHATSAPP_ACCESS[planId];
  return tier ? getPaidWhatsAppInvite(tier) : null;
}
