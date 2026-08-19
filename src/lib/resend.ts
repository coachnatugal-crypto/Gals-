import { Resend } from "resend";
import type { GalsEvent } from "@/lib/eventos";
import {
  ADDRESS,
  INSTAGRAM,
  PHONE_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/constants";

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

/** Remitente marketing / masivos (avisos, cupos, recordatorios). */
function getFromMarketing() {
  return (
    process.env.RESEND_FROM_MARKETING?.trim() ||
    process.env.RESEND_FROM?.trim() ||
    "GAL'S Studio <onboarding@resend.dev>"
  );
}

/**
 * Remitente transaccional (inscripción / pago).
 * Ideal: confirmaciones@… distinto del de campañas, para que Gmail separe streams.
 */
function getFromTransactional() {
  return (
    process.env.RESEND_FROM_TRANSACTIONAL?.trim() ||
    process.env.RESEND_FROM?.trim() ||
    "GAL'S Confirmaciones <onboarding@resend.dev>"
  );
}

function getReplyTo() {
  const explicit = process.env.RESEND_REPLY_TO?.trim();
  if (explicit) return explicit;
  // Extrae email del from marketing como fallback
  const from = getFromMarketing();
  const match = from.match(/<([^>]+)>/);
  return match?.[1]?.trim() || undefined;
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "https://www.galswellnes.com"
  );
}

function absoluteUrl(path: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = getSiteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** HTML de confirmación / pago — estilo ticket (menos “promo”). */
export function buildEventRegistrationEmailHtml(input: {
  name: string;
  event: GalsEvent;
  paid?: boolean;
}) {
  const { name, event, paid = false } = input;
  const site = getSiteUrl();
  const when = [event.dateLabel, event.timeLabel].filter(Boolean).join(" · ");
  const place = event.place || ADDRESS;
  const logo = absoluteUrl("/brand/logos/logo.png");
  const firstName = name.trim().split(/\s+/)[0] || name;
  const statusLabel = paid ? "Pago confirmado" : "Inscripción confirmada";
  const intro = paid
    ? `Confirmamos tu pago y tu cupo para <strong style="color:#1a2a35;">${escapeHtml(event.title)}</strong>. Guardá este correo como comprobante.`
    : `Tu lugar para <strong style="color:#1a2a35;">${escapeHtml(event.title)}</strong> quedó registrado. Guardá este correo como comprobante.`;

  const paidBlock = paid
    ? `
      <tr>
        <td style="padding:16px 28px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#eaf5ee;border-radius:14px;">
            <tr>
              <td style="padding:14px 16px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#2f4a3a;">
                Estado: <strong>pago recibido</strong>. El detalle de Mercado Pago te llega por separado desde su plataforma.
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(statusLabel)} · GAL'S</title>
</head>
<body style="margin:0;padding:0;background:#eef1f8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f8;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e2e7f0;">
          <tr>
            <td style="height:5px;background:#556894;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <tr>
            <td style="padding:24px 28px 8px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="${escapeHtml(logo)}" alt="GAL'S Studio" width="48" height="48" style="display:block;border:0;border-radius:50%;" />
                  </td>
                  <td align="right" style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8799c4;font-weight:700;">
                    ${escapeHtml(statusLabel)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 8px;">
              <h1 style="margin:0 0 12px;font-family:Helvetica,Arial,sans-serif;font-size:22px;line-height:1.25;color:#1a2a35;font-weight:700;">
                Hola ${escapeHtml(firstName)},
              </h1>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#5c6b78;">
                ${intro}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8fc;border-radius:14px;">
                <tr>
                  <td style="padding:18px 18px 8px;">
                    <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8799c4;font-weight:700;">
                      Detalle de tu cupo
                    </p>
                    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:17px;line-height:1.3;color:#1a2a35;font-weight:700;">
                      ${escapeHtml(event.title)}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 18px 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0;border-top:1px solid rgba(85,104,148,0.12);font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#556894;width:88px;vertical-align:top;">
                          Cuándo
                        </td>
                        <td style="padding:10px 0;border-top:1px solid rgba(85,104,148,0.12);font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#1a2a35;font-weight:600;">
                          ${escapeHtml(when || "Te confirmamos la fecha")}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-top:1px solid rgba(85,104,148,0.12);font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#556894;width:88px;vertical-align:top;">
                          Dónde
                        </td>
                        <td style="padding:10px 0;border-top:1px solid rgba(85,104,148,0.12);font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#1a2a35;font-weight:600;">
                          ${escapeHtml(place)}
                        </td>
                      </tr>
                      ${
                        event.price
                          ? `<tr>
                        <td style="padding:10px 0 4px;border-top:1px solid rgba(85,104,148,0.12);font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#556894;width:88px;vertical-align:top;">
                          Precio
                        </td>
                        <td style="padding:10px 0 4px;border-top:1px solid rgba(85,104,148,0.12);font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#1a2a35;font-weight:600;">
                          ${escapeHtml(event.price)}
                        </td>
                      </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${paidBlock}

          <tr>
            <td style="padding:22px 28px 8px;">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:#5c6b78;">
                Si necesitás cambiar algo o tenés una duda, respondé este correo o escribinos al ${escapeHtml(PHONE_DISPLAY)}.
              </p>
              <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#5c6b78;">
                <a href="${escapeHtml(WHATSAPP_URL)}" style="color:#556894;text-decoration:underline;">WhatsApp</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(site)}/eventos#${encodeURIComponent(event.id)}" style="color:#556894;text-decoration:underline;">Ver evento</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 28px 24px;border-top:1px solid #eef1f8;">
              <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#8799c4;text-align:center;">
                ${escapeHtml(ADDRESS)}
              </p>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#8799c4;text-align:center;">
                <a href="${INSTAGRAM}" style="color:#556894;text-decoration:none;">Instagram</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(site)}" style="color:#556894;text-decoration:none;">galswellnes.com</a>
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#a0aabe;text-align:center;">
          Correo automático de confirmación · GAL'S Studio
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/** Texto plano (ayuda deliverability / clasificar como transaccional). */
export function buildEventRegistrationEmailText(input: {
  name: string;
  event: GalsEvent;
  paid?: boolean;
}) {
  const { name, event, paid = false } = input;
  const firstName = name.trim().split(/\s+/)[0] || name;
  const when = [event.dateLabel, event.timeLabel].filter(Boolean).join(" · ");
  const place = event.place || ADDRESS;
  const site = getSiteUrl();
  const lines = [
    `Hola ${firstName},`,
    "",
    paid
      ? `Confirmamos tu pago y tu cupo para ${event.title}.`
      : `Tu inscripción a ${event.title} quedó registrada.`,
    "",
    "Detalle de tu cupo",
    `Evento: ${event.title}`,
    `Cuándo: ${when || "Por confirmar"}`,
    `Dónde: ${place}`,
    event.price ? `Precio: ${event.price}` : "",
    paid
      ? "Estado: pago recibido (Mercado Pago envía el comprobante por separado)."
      : "",
    "",
    `Si tenés dudas, respondé este correo o escribinos al ${PHONE_DISPLAY}.`,
    `WhatsApp: ${WHATSAPP_URL}`,
    `Evento: ${site}/eventos#${event.id}`,
    "",
    ADDRESS,
    "GAL'S Studio",
  ];
  return lines.filter((l) => l !== "").join("\n");
}

export async function sendEventRegistrationEmail(input: {
  to: string;
  name: string;
  event: GalsEvent;
  /** Si true, aclara que el comprobante de pago lo envía Mercado Pago. */
  paid?: boolean;
  /** Prefijo [PRUEBA] en el asunto (panel admin). */
  test?: boolean;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY no configurada");
    return false;
  }

  const { to, name, event, paid = false, test = false } = input;
  const subjectPrefix = test ? "[PRUEBA] " : "";
  const subjectCore = paid
    ? `Pago confirmado · ${event.title}`
    : `Inscripción confirmada · ${event.title}`;
  const replyTo = getReplyTo();

  try {
    const { error } = await resend.emails.send({
      from: getFromTransactional(),
      to: [to],
      ...(replyTo ? { replyTo } : {}),
      subject: `${subjectPrefix}${subjectCore}`,
      html: buildEventRegistrationEmailHtml({ name, event, paid }),
      text: buildEventRegistrationEmailText({ name, event, paid }),
    });

    if (error) {
      console.error("[resend] sendEventRegistrationEmail", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[resend] sendEventRegistrationEmail", err);
    return false;
  }
}

export type BulkEmailCtaTarget = "event" | "whatsapp" | "custom";

export type BulkEmailDesign = {
  /** Frase bajo el logo (ej. Recordatorio). */
  badge?: string;
  /** Color de acento hex (#8799c4). */
  accent?: string;
  showLogo?: boolean;
  showCover?: boolean;
  /** URL o path de imagen; si vacío usa la del evento. */
  coverUrl?: string;
  showDetails?: boolean;
  ctaLabel?: string;
  /** Destino del botón principal. */
  ctaTarget?: BulkEmailCtaTarget;
  /** URL si ctaTarget === "custom". */
  ctaUrl?: string;
  /** Mostrar link secundario a WhatsApp. */
  showWhatsAppLink?: boolean;
  signOff?: string;
};

const DEFAULT_ACCENT = "#8799c4";
const DEFAULT_ACCENT_DEEP = "#556894";

function sanitizeHexColor(value: string | undefined, fallback: string) {
  const v = (value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return fallback;
}

function resolveBulkCta(input: {
  event: GalsEvent;
  design: BulkEmailDesign;
  site: string;
}) {
  const { event, design, site } = input;
  const eventUrl = `${site}/eventos#${encodeURIComponent(event.id)}`;
  const target = design.ctaTarget || "event";
  const custom = (design.ctaUrl || "").trim();

  if (target === "whatsapp") {
    return {
      href: WHATSAPP_URL,
      label: (design.ctaLabel || "WhatsApp GAL'S").trim() || "WhatsApp GAL'S",
    };
  }
  if (target === "custom" && custom) {
    const href = /^https?:\/\//i.test(custom)
      ? custom
      : absoluteUrl(custom.startsWith("/") ? custom : `/${custom}`);
    return {
      href,
      label: (design.ctaLabel || "Ver más").trim() || "Ver más",
    };
  }
  return {
    href: eventUrl,
    label: (design.ctaLabel || "Reservar cupo").trim() || "Reservar cupo",
  };
}

/** HTML visual para avisos masivos del admin (estilo GAL'S: logo, cover, periwinkle). */
export function buildBulkEventEmailHtml(input: {
  name: string;
  event: GalsEvent;
  message: string;
  design?: BulkEmailDesign;
}) {
  const { name, event, message } = input;
  const design = input.design ?? {};
  const firstName = name.trim().split(/\s+/)[0] || name.trim() || "GAL'S";
  const when = [event.dateLabel, event.timeLabel].filter(Boolean).join(" · ");
  const place = event.place || ADDRESS;
  const logo = absoluteUrl("/brand/logos/logo.png");
  const showLogo = design.showLogo !== false;
  const showCover = design.showCover !== false;
  const showDetails = design.showDetails !== false;
  const showWhatsAppLink = design.showWhatsAppLink !== false;
  const badge = (design.badge || "Para ti").trim() || "Para ti";
  const accent = sanitizeHexColor(design.accent, DEFAULT_ACCENT);
  const accentDeep = accent === DEFAULT_ACCENT ? DEFAULT_ACCENT_DEEP : accent;
  const signOff =
    (design.signOff || "Con cariño,\nGAL'S Studio").trim() ||
    "Con cariño,\nGAL'S Studio";
  const signOffHtml = escapeHtml(signOff).replace(/\n/g, "<br />");

  const coverRaw =
    (design.coverUrl || "").trim() ||
    event.image ||
    "/brand/og/og-share.jpg";
  const cover = absoluteUrl(coverRaw);
  const site = getSiteUrl();
  const eventosUrl = `${site}/eventos`;
  const cta = resolveBulkCta({ event, design, site });
  const ctaIsWhatsApp = cta.href === WHATSAPP_URL;

  const personalized = message
    .replaceAll("{{nombre}}", firstName)
    .replaceAll("{{evento}}", event.title)
    .replaceAll("{{fecha}}", event.dateLabel || "")
    .replaceAll("{{hora}}", event.timeLabel || "")
    .replaceAll("{{lugar}}", place);

  const paragraphs = escapeHtml(personalized)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 14px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#5c6b78;">${p}</p>`,
    )
    .join("");

  const logoBlock = showLogo
    ? `
          <tr>
            <td align="center" style="padding:28px 28px 12px;background:linear-gradient(180deg,#f5f6fb 0%,#ffffff 100%);">
              <img src="${escapeHtml(logo)}" alt="GAL'S Studio" width="72" height="72" style="display:block;margin:0 auto 12px;border:0;border-radius:50%;" />
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${accentDeep};font-weight:700;">
                GAL'S Studio
              </p>
              <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-style:italic;color:${accent};">
                ${escapeHtml(badge)}
              </p>
            </td>
          </tr>`
    : `
          <tr>
            <td align="center" style="padding:24px 28px 8px;background:#ffffff;">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${accentDeep};font-weight:700;">
                GAL'S Studio
              </p>
              <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-style:italic;color:${accent};">
                ${escapeHtml(badge)}
              </p>
            </td>
          </tr>`;

  const coverBlock = showCover
    ? `
          <tr>
            <td style="padding:0;">
              <img src="${escapeHtml(cover)}" alt="${escapeHtml(event.title)}" width="560" style="display:block;width:100%;max-width:560px;height:auto;max-height:240px;object-fit:cover;border:0;" />
            </td>
          </tr>`
    : "";

  const detailsBlock = showDetails
    ? `
          <tr>
            <td style="padding:12px 28px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f8;border-radius:18px;">
                <tr>
                  <td style="padding:18px 20px 8px;">
                    <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${accent};font-weight:700;">
                      ${escapeHtml(event.eyebrow || "Evento")}
                    </p>
                    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.3;color:#1a2a35;font-weight:700;">
                      Detalle
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 20px 18px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0;border-top:1px solid rgba(85,104,148,0.12);font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${accentDeep};width:88px;vertical-align:top;">
                          Cuándo
                        </td>
                        <td style="padding:10px 0;border-top:1px solid rgba(85,104,148,0.12);font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#1a2a35;font-weight:600;">
                          ${escapeHtml(when || "Por confirmar")}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-top:1px solid rgba(85,104,148,0.12);font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${accentDeep};width:88px;vertical-align:top;">
                          Dónde
                        </td>
                        <td style="padding:10px 0;border-top:1px solid rgba(85,104,148,0.12);font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#1a2a35;font-weight:600;">
                          ${escapeHtml(place)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : "";

  const secondaryLink = ctaIsWhatsApp
    ? `
          <tr>
            <td align="center" style="padding:8px 28px 0;">
              <a href="${escapeHtml(eventosUrl)}" style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${accentDeep};text-decoration:underline;">
                Ver agenda de eventos
              </a>
            </td>
          </tr>`
    : showWhatsAppLink
      ? `
          <tr>
            <td align="center" style="padding:8px 28px 0;">
              <a href="${escapeHtml(WHATSAPP_URL)}" style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${accentDeep};text-decoration:underline;">
                ¿Dudas? Escribinos por WhatsApp
              </a>
            </td>
          </tr>`
      : `
          <tr>
            <td align="center" style="padding:8px 28px 0;">
              <a href="${escapeHtml(eventosUrl)}" style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${accentDeep};text-decoration:underline;">
                Ver agenda de eventos
              </a>
            </td>
          </tr>`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GAL'S</title>
</head>
<body style="margin:0;padding:0;background:#eef1f8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f8;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(85,104,148,0.14);">
          <tr>
            <td style="height:6px;background:${accent};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          ${logoBlock}
          ${coverBlock}
          <tr>
            <td style="padding:28px 28px 8px;">
              <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${accent};font-weight:700;">
                Hola ${escapeHtml(firstName)}
              </p>
              <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;color:#1a2a35;font-weight:700;">
                ${escapeHtml(event.title)}
              </h1>
              ${
                paragraphs ||
                `<p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#5c6b78;">—</p>`
              }
            </td>
          </tr>
          ${detailsBlock}
          <tr>
            <td align="center" style="padding:22px 28px 8px;">
              <a href="${escapeHtml(cta.href)}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:${accentDeep};color:#ffffff;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;">
                ${escapeHtml(cta.label)}
              </a>
            </td>
          </tr>
          ${secondaryLink}
          <tr>
            <td style="padding:28px 28px 8px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-style:italic;color:${accentDeep};">
                ${signOffHtml}
              </p>
              <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#5c6b78;">
                ${escapeHtml(PHONE_DISPLAY)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px;border-top:1px solid #eef1f8;">
              <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${accent};text-align:center;">
                ${escapeHtml(ADDRESS)}
              </p>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${accent};text-align:center;">
                <a href="${INSTAGRAM}" style="color:${accentDeep};text-decoration:none;">Instagram</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(site)}" style="color:${accentDeep};text-decoration:none;">galswellnes.com</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#a0aabe;text-align:center;">
          Recibiste este correo porque estás inscrita a un evento GAL'S.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendBulkEventEmail(input: {
  to: string;
  name: string;
  event: GalsEvent;
  subject: string;
  message: string;
  design?: BulkEmailDesign;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY no configurada");
    return false;
  }

  const firstName =
    input.name.trim().split(/\s+/)[0] || input.name.trim() || "GAL'S";
  const subject = input.subject
    .replaceAll("{{nombre}}", firstName)
    .replaceAll("{{evento}}", input.event.title)
    .replaceAll("{{fecha}}", input.event.dateLabel || "")
    .replaceAll("{{hora}}", input.event.timeLabel || "")
    .replaceAll("{{lugar}}", input.event.place || ADDRESS);

  try {
    const { error } = await resend.emails.send({
      from: getFromMarketing(),
      to: [input.to],
      subject,
      html: buildBulkEventEmailHtml({
        name: input.name,
        event: input.event,
        message: input.message,
        design: input.design,
      }),
    });
    if (error) {
      console.error("[resend] sendBulkEventEmail", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[resend] sendBulkEventEmail", err);
    return false;
  }
}
