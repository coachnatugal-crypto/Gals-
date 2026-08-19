import { NextResponse } from "next/server";
import type { GalsEvent } from "@/lib/eventos";
import {
  clearFeaturedExcept,
  deleteEventAdmin,
  fetchAllEventsAdmin,
  upsertEventAdmin,
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

export async function GET() {
  const blocked = guard();
  if (blocked) return blocked;
  try {
    const events = await fetchAllEventsAdmin();
    return NextResponse.json({ ok: true, events });
  } catch (error) {
    console.error("[admin/eventos GET]", error);
    const detail =
      error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : error instanceof Error
          ? error.message
          : "No se pudieron cargar eventos";
    return NextResponse.json(
      { ok: false, error: detail },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const blocked = guard();
  if (blocked) return blocked;

  let event: GalsEvent;
  try {
    const body = (await request.json()) as { event?: GalsEvent };
    if (!body.event?.id || !body.event.title) {
      return NextResponse.json(
        { ok: false, error: "Evento inválido" },
        { status: 400 },
      );
    }
    event = body.event;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  try {
    if (event.featured) {
      await clearFeaturedExcept(event.id);
    }
    const saved = await upsertEventAdmin(event);
    return NextResponse.json({ ok: true, event: saved });
  } catch (error) {
    console.error("[admin/eventos POST]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar el evento" },
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
    await deleteEventAdmin(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/eventos DELETE]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudo eliminar. Si tiene inscritos/pagos, cancélalos antes o despublica el evento.",
      },
      { status: 500 },
    );
  }
}
