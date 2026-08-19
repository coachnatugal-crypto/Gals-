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

function getFrom() {
  return (
    process.env.RESEND_FROM?.trim() ||
    "GAL'S Studio <onboarding@resend.dev>"
  );
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

/** HTML de confirmación de evento — look GAL'S (periwinkle / cream). */
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
  const cover = event.image ? absoluteUrl(event.image) : "";
  const firstName = name.trim().split(/\s+/)[0] || name;

  const paidBlock = paid
    ? `
      <tr>
        <td style="padding:16px 28px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#eaf5ee;border-radius:14px;">
            <tr>
              <td style="padding:14px 16px;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.5;color:#2f4a3a;">
                Tu pago quedó registrado. El comprobante de Mercado Pago te llega por separado.
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  const coverBlock = cover
    ? `
      <tr>
        <td style="padding:0;">
          <img src="${escapeHtml(cover)}" alt="" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;object-fit:cover;" />
        </td>
      </tr>`
    : "";

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Confirmación GAL'S</title>
</head>
<body style="margin:0;padding:0;background:#eef1f8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f8;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(85,104,148,0.14);">
          <!-- Barra marca -->
          <tr>
            <td style="height:6px;background:#8799c4;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:28px 28px 8px;background:linear-gradient(180deg,#f5f6fb 0%,#ffffff 100%);">
              <img src="${escapeHtml(logo)}" alt="GAL'S Studio" width="72" height="72" style="display:block;margin:0 auto 12px;border:0;border-radius:50%;" />
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#556894;font-weight:700;">
                GAL'S Studio
              </p>
              <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-style:italic;color:#6b7fb0;">
                Tu cupo te espera
              </p>
            </td>
          </tr>

          ${coverBlock}

          <!-- Saludo -->
          <tr>
            <td style="padding:28px 28px 8px;">
              <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8799c4;font-weight:700;">
                Confirmación
              </p>
              <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.15;color:#1a2a35;font-weight:700;">
                ¡Hola ${escapeHtml(firstName)}!
              </h1>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:#5c6b78;">
                Tu lugar para
                <strong style="color:#1a2a35;">${escapeHtml(event.title)}</strong>
                quedó registrado. Nos alegra tenerte en la 97.
              </p>
            </td>
          </tr>

          <!-- Detalle evento -->
          <tr>
            <td style="padding:20px 28px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f8;border-radius:18px;">
                <tr>
                  <td style="padding:20px 20px 8px;">
                    <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#8799c4;font-weight:700;">
                      ${escapeHtml(event.eyebrow || "Evento")}
                    </p>
                    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.25;color:#1a2a35;font-weight:700;">
                      ${escapeHtml(event.title)}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 20px 6px;">
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
                <tr>
                  <td style="padding:4px 20px 18px;">
                    <p style="margin:8px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:#5c6b78;">
                      ${escapeHtml(event.headline || event.subhead || "")}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${paidBlock}

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:24px 28px 8px;">
              <a href="${WHATSAPP_URL}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:#556894;color:#ffffff;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;">
                WhatsApp GAL'S
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 28px 0;">
              <a href="${escapeHtml(site)}/eventos" style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#556894;text-decoration:underline;">
                Ver agenda de eventos
              </a>
            </td>
          </tr>

          <!-- Cierre -->
          <tr>
            <td style="padding:28px 28px 8px;">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:#5c6b78;">
                ¿Dudas? Escríbenos al ${escapeHtml(PHONE_DISPLAY)}.
              </p>
              <p style="margin:16px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-style:italic;color:#556894;">
                nos vemos en la 97 🩶
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 28px 28px;border-top:1px solid #eef1f8;">
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

        <p style="margin:18px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#a0aabe;text-align:center;">
          Recibiste este correo porque te registraste a un evento GAL'S.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
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

  try {
    const { error } = await resend.emails.send({
      from: getFrom(),
      to: [to],
      subject: `${subjectPrefix}GAL'S · Confirmación · ${event.title}`,
      html: buildEventRegistrationEmailHtml({ name, event, paid }),
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
