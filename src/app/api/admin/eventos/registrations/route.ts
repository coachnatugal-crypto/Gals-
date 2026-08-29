import { NextResponse } from "next/server";
import {
  createRegistrationAdmin,
  deleteRegistrationAdmin,
  fetchRegistrationsAdmin,
  updateRegistrationStatusAdmin,
} from "@/lib/eventos-db";
import { isSupabaseConfigured } from "@/lib/supabase/server";

function guard() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase no configurado" },
      { status: 503 },
    );
  }
  return null;
}

const STATUSES = new Set([
  "nuevo",
  "pendiente_pago",
  "pagado",
  "confirmado",
  "cancelado",
]);

export async function GET() {
  const blocked = guard();
  if (blocked) return blocked;
  try {
    const rows = await fetchRegistrationsAdmin();
    const registrations = rows.map((r) => ({
      id: r.id,
      eventId: r.event_id,
      name: r.name,
      email: r.email ?? undefined,
      whatsapp: r.whatsapp,
      source: r.source,
      status: r.status,
      createdAt: r.created_at,
    }));
    return NextResponse.json({ ok: true, registrations });
  } catch (error) {
    console.error("[admin/regs GET]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudieron cargar inscritos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const blocked = guard();
  if (blocked) return blocked;

  try {
    const body = (await request.json()) as {
      name?: string;
      whatsapp?: string;
      eventId?: string;
      email?: string;
    };
    const name = body.name?.trim() ?? "";
    const whatsapp = body.whatsapp?.trim() ?? "";
    const eventId = body.eventId?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    if (name.length < 2 || !whatsapp || !eventId) {
      return NextResponse.json(
        { ok: false, error: "Datos incompletos" },
        { status: 400 },
      );
    }
    const row = await createRegistrationAdmin({
      eventId,
      name,
      whatsapp,
      email: email || undefined,
      source: "admin",
      status: "nuevo",
    });
    return NextResponse.json({
      ok: true,
      registration: {
        id: row.id,
        eventId: row.event_id,
        name: row.name,
        email: row.email ?? undefined,
        whatsapp: row.whatsapp,
        source: row.source,
        status: row.status,
        createdAt: row.created_at,
      },
    });
  } catch (error) {
    console.error("[admin/regs POST]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo crear la inscripción" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const blocked = guard();
  if (blocked) return blocked;

  try {
    const body = (await request.json()) as { id?: string; status?: string };
    const id = body.id?.trim() ?? "";
    const status = body.status?.trim() ?? "";
    if (!id || !STATUSES.has(status)) {
      return NextResponse.json(
        { ok: false, error: "Datos inválidos" },
        { status: 400 },
      );
    }
    await updateRegistrationStatusAdmin(id, status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/regs PATCH]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo actualizar" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const blocked = guard();
  if (blocked) return blocked;

  const id = new URL(request.url).searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "Falta id" }, { status: 400 });
  }
  try {
    await deleteRegistrationAdmin(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/regs DELETE]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo eliminar" },
      { status: 500 },
    );
  }
}
