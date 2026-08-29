import { NextResponse } from "next/server";
import { isBeweConfigured } from "@/lib/bewe-api";
import { listBeweMembers } from "@/lib/bewe-members";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase no configurado" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const eligibleOnly = searchParams.get("eligible") !== "0";
  const pendingOnly = searchParams.get("pending") === "1";

  try {
    const members = await listBeweMembers({
      eligibleOnly,
      pendingOnly,
    });
    return NextResponse.json({
      ok: true,
      members,
      beweConfigured: isBeweConfigured(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al listar";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
