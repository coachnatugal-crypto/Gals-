import { NextResponse } from "next/server";
import { landingEventsCatalog } from "@/lib/admin-eventos-store";
import {
  clearFeaturedExcept,
  fetchAllEventsAdmin,
  upsertEventAdmin,
} from "@/lib/eventos-db";
import { isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Importa a Supabase los eventos definidos en la landing (eventos.ts).
 * Upsert por id: no borra eventos extra del admin.
 */
export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase no configurado" },
      { status: 503 },
    );
  }

  try {
    const catalog = landingEventsCatalog();
    const saved = [];
    for (const event of catalog) {
      const row = await upsertEventAdmin(event);
      saved.push(row);
    }

    const featured = catalog.find((e) => e.featured);
    if (featured) {
      await clearFeaturedExcept(featured.id);
      await upsertEventAdmin({ ...featured, featured: true });
    }

    const events = await fetchAllEventsAdmin();
    return NextResponse.json({
      ok: true,
      imported: saved.length,
      events,
    });
  } catch (error) {
    console.error("[admin/eventos/seed]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudieron importar los eventos de la landing" },
      { status: 500 },
    );
  }
}
