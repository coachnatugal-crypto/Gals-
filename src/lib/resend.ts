import { Resend } from "resend";
import type { GalsEvent } from "@/lib/eventos";
import { PHONE_DISPLAY, WHATSAPP_URL, ADDRESS } from "@/lib/constants";

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

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
  const when = [event.dateLabel, event.timeLabel].filter(Boolean).join(" · ");
  const place = event.place || ADDRESS;

  const paidNote = paid
    ? `<p style="margin:16px 0 0;font-size:14px;color:#5a6788;line-height:1.5;">El comprobante de pago te lo envía Mercado Pago por separado.</p>`
    : "";

  const subjectPrefix = test ? "[PRUEBA] " : "";

  try {
    const { error } = await resend.emails.send({
      from: getFrom(),
      to: [to],
      subject: `${subjectPrefix}GAL'S · Confirmación · ${event.title}`,
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#eef1f8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:20px;padding:32px 28px;box-shadow:0 12px 40px rgba(26,42,53,0.08);">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#556894;">GAL'S Studio</p>
              <h1 style="margin:0 0 16px;font-size:26px;line-height:1.15;color:#1a2a35;">¡Hola ${escapeHtml(name)}!</h1>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.5;color:#3d4a6b;">
                Tu lugar para <strong style="color:#1a2a35;">${escapeHtml(event.title)}</strong> quedó registrado.
              </p>
              <table width="100%" style="background:#eef1f8;border-radius:14px;padding:16px 18px;">
                <tr>
                  <td style="font-size:14px;line-height:1.6;color:#2f3d5c;">
                    <strong>Cuándo:</strong> ${escapeHtml(when || "Te confirmamos la fecha")}<br/>
                    <strong>Dónde:</strong> ${escapeHtml(place)}
                  </td>
                </tr>
              </table>
              ${paidNote}
              <p style="margin:24px 0 0;font-size:14px;line-height:1.5;color:#5a6788;">
                ¿Dudas? Escríbenos al WhatsApp ${escapeHtml(PHONE_DISPLAY)}.
              </p>
              <p style="margin:12px 0 0;">
                <a href="${WHATSAPP_URL}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#1a2a35;color:#ffffff;text-decoration:none;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">WhatsApp GAL'S</a>
              </p>
              <p style="margin:28px 0 0;font-size:13px;font-style:italic;color:#556894;">nos vemos en la 97 🩶</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
