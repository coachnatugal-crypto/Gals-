import { NextResponse } from "next/server";
import { isBeweConfigured } from "@/lib/bewe-api";
import { syncBeweMembers } from "@/lib/bewe-members";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase no configurado" },
      { status: 503 },
    );
  }
  if (!isBeweConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Falta BEWE_API_TOKEN o BEWE_TOKEN en .env.local (Bewe → Token)",
      },
      { status: 503 },
    );
  }

  try {
    const result = await syncBeweMembers();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al sincronizar";
    console.error("[admin/comunidad/sync]", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
