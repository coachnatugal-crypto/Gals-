/**
 * Bewe Widget (público) — docs:
 * https://bewesoftware.notion.site/Widgets-documentaci-n-265e9357ec2d4f1a9ab1b9e183a78065
 *
 * idCenter real (data-idcenter en app.bewe.co/be-well-club/s/booking).
 * Override: NEXT_PUBLIC_BEWE_CENTER_ID
 *
 * Rutas útiles del widget:
 * - classes (section) → horario / reservar
 * - login | profile (path)
 * - subscriptions | packs (path) → membresías / bonos
 */
export const BEWE_WIDGET_SCRIPT = "https://web.bewe.co/widget/bewidget.js";

export const BEWE_CENTER_ID =
  process.env.NEXT_PUBLIC_BEWE_CENTER_ID?.trim() || "6979253eaee8060861c1c8a1";

/** Contenedor popup (único en el layout). */
export const BEWE_WIDGET_ROOT = "#bewe-widget-root";

/** Clases CSS de botones (delegación: sirven N botones). */
export const BEWE_BOOK_CLASS = "bewe-book-btn";
export const BEWE_LOGIN_CLASS = "bewe-login-btn";
export const BEWE_SUBS_CLASS = "bewe-subs-btn";
export const BEWE_PACKS_CLASS = "bewe-packs-btn";
/** Widget Form de Bewe (leads / registro). */
export const BEWE_FORM_CLASS = "bewe-form-btn";

/** @deprecated alias — preferir *_CLASS */
export const BEWE_BOOK_SELECTOR = `.${BEWE_BOOK_CLASS}`;
export const BEWE_LOGIN_SELECTOR = `.${BEWE_LOGIN_CLASS}`;
export const BEWE_CLASSES_EMBED = "#bewe-classes-embed";

export type BeweWidgetConfig = {
  center: string;
  section?: string;
  path?: string;
  insideHtml?: boolean;
  siteName?: string;
  extraData?: Record<string, unknown>;
};

export type BeweApi = {
  on: (event: "load" | "click", selector?: string) => {
    init: (selector: string, config: BeweWidgetConfig) => void;
  };
  init: (selector: string, config: BeweWidgetConfig) => void;
};

declare global {
  interface Window {
    BW?: BeweApi;
    __beweClickWired?: boolean;
    __beweClassesEmbedded?: boolean;
  }
}

/** Abre popup Bewe (usar en cliente tras submit de formularios). */
export function openBeweWidget(
  config: Omit<BeweWidgetConfig, "center">,
): boolean {
  if (typeof window === "undefined" || !window.BW) return false;
  window.BW.init(BEWE_WIDGET_ROOT, {
    center: BEWE_CENTER_ID,
    ...config,
  });
  return true;
}

export {};
