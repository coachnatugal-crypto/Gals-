import { NextResponse } from "next/server";
import {
  setMemberPlan,
  type CommunityPlan,
} from "@/lib/bewe-members";
import { isSupabaseConfigured } from "@/lib/supabase/server";

const PLANS = new Set<CommunityPlan>([
  "transformacion",
  "ilimitada",
  "unknown",
]);

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase no configurado" },
      { status: 503 },
    );
  }

  let body: { id?: string; plan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const id = body.id?.trim();
  const plan = body.plan as CommunityPlan | undefined;
  if (!id || !plan || !PLANS.has(plan)) {
    return NextResponse.json(
      {
        ok: false,
        error: "id y plan (transformacion|ilimitada|unknown) requeridos",
      },
      { status: 400 },
    );
  }

  try {
    const member = await setMemberPlan(id, plan);
    return NextResponse.json({ ok: true, member });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al actualizar";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
