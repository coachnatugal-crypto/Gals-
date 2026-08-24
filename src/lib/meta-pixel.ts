/**
 * Meta (Facebook) Pixel — ID de GAL'S Studio.
 * Override opcional: NEXT_PUBLIC_META_PIXEL_ID
 */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "394973730377113";

/** Eventos estándar de Meta que usamos en el sitio. */
export type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "Contact"
  | "Schedule"
  | "Subscribe"
  | "Lead"
  | "CompleteRegistration"
  | "InitiateCheckout"
  | "AddToCart"
  | "Purchase";

export type MetaEventParams = {
  /** Nombre claro para Ads Manager (ej. comunidad_whatsapp_free) */
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  /** Descripción humana / contexto */
  status?: string;
};

declare global {
  interface Window {
    fbq?: (
      action: "track" | "trackCustom" | "init",
      event: string,
      params?: Record<string, unknown>,
    ) => void;
    _fbq?: unknown;
  }
}

export function trackMeta(
  event: MetaStandardEvent | string,
  params?: MetaEventParams,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }
  window.fbq("track", event, params as Record<string, unknown> | undefined);
}
