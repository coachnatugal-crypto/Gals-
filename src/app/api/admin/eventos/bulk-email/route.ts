import { NextResponse } from "next/server";
import { fetchEventById, fetchRegistrationsAdmin } from "@/lib/eventos-db";
import {
  type BulkEmailDesign,
  isValidEmail,
  sendBulkEventEmail,
} from "@/lib/resend";
import { isSupabaseConfigured } from "@/lib/supabase/server";

const SKIP_STATUSES = new Set(["cancelado"]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseExtraEmails(raw: unknown): string[] {
  if (!raw) return [];
  const list = Array.isArray(raw)
    ? raw.map((v) => String(v))
    : String(raw).split(/[,;\s]+/);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    const email = item.trim().toLowerCase();
    if (!isValidEmail(email) || seen.has(email)) continue;
    seen.add(email);
    out.push(email);
  }
  return out;
}

function parseDesign(raw: unknown): BulkEmailDesign | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const ctaTarget =
    d.ctaTarget === "event" ||
    d.ctaTarget === "whatsapp" ||
    d.ctaTarget === "custom"
      ? (d.ctaTarget as BulkEmailDesign["ctaTarget"])
      : undefined;
  return {
    badge: typeof d.badge === "string" ? d.badge : undefined,
    accent: typeof d.accent === "string" ? d.accent : undefined,
    showLogo: typeof d.showLogo === "boolean" ? d.showLogo : undefined,
    showCover: typeof d.showCover === "boolean" ? d.showCover : undefined,
    coverUrl: typeof d.coverUrl === "string" ? d.coverUrl : undefined,
    showDetails:
      typeof d.showDetails === "boolean" ? d.showDetails : undefined,
    ctaLabel: typeof d.ctaLabel === "string" ? d.ctaLabel : undefined,
    ctaTarget,
    ctaUrl: typeof d.ctaUrl === "string" ? d.ctaUrl : undefined,
    showWhatsAppLink:
      typeof d.showWhatsAppLink === "boolean"
        ? d.showWhatsAppLink
        : undefined,
    signOff: typeof d.signOff === "string" ? d.signOff : undefined,
  };
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY?.trim()) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY no configurada" },
      { status: 503 },
    );
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase no configurado" },
      { status: 503 },
    );
  }

  let body: {
    eventId?: string;
    subject?: string;
    message?: string;
    statusFilter?: string;
    extraEmails?: string | string[];
    extraName?: string;
    /** Si true, solo envía a los correos extra. */
    onlyExtras?: boolean;
    design?: BulkEmailDesign;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const eventId = body.eventId?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const statusFilter = body.statusFilter?.trim() || "all";
  const onlyExtras = Boolean(body.onlyExtras);
  const extraEmails = parseExtraEmails(body.extraEmails);
  const extraName = body.extraName?.trim() || "GAL'S";
  const design = parseDesign(body.design);

  if (!eventId) {
    return NextResponse.json(
      { ok: false, error: "Elegí un evento" },
      { status: 400 },
    );
  }
  if (subject.length < 3) {
    return NextResponse.json(
      { ok: false, error: "Asunto muy corto" },
      { status: 400 },
    );
  }
  if (message.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Mensaje muy corto" },
      { status: 400 },
    );
  }

  const event = await fetchEventById(eventId);
  if (!event) {
    return NextResponse.json(
      { ok: false, error: "Evento no encontrado" },
      { status: 404 },
    );
  }

  const byEmail = new Map<string, { name: string; email: string }>();

  if (!onlyExtras) {
    const rows = await fetchRegistrationsAdmin();
    const recipients = rows.filter((r) => {
      if (r.event_id !== eventId) return false;
      if (SKIP_STATUSES.has(r.status)) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      const email = r.email?.trim().toLowerCase() ?? "";
      return isValidEmail(email);
    });

    for (const r of recipients) {
      const email = r.email!.trim().toLowerCase();
      if (!byEmail.has(email)) {
        byEmail.set(email, { name: r.name, email });
      }
    }
  }

  for (const email of extraEmails) {
    if (!byEmail.has(email)) {
      byEmail.set(email, { name: extraName, email });
    }
  }

  const unique = [...byEmail.values()];

  if (unique.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: onlyExtras
          ? "Agregá al menos un correo extra"
          : "No hay destinatarias con email (inscritas o extras)",
      },
      { status: 400 },
    );
  }

  let sent = 0;
  const failed: string[] = [];

  for (const person of unique) {
    const ok = await sendBulkEventEmail({
      to: person.email,
      name: person.name,
      event,
      subject,
      message,
      design,
    });
    if (ok) sent += 1;
    else failed.push(person.email);
    await sleep(350);
  }

  return NextResponse.json({
    ok: true,
    eventId: event.id,
    eventTitle: event.title,
    total: unique.length,
    sent,
    failed,
    onlyExtras,
  });
}
