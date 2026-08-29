import { NextResponse } from "next/server";
import {
  communityLinkForMember,
  listBeweMembers,
} from "@/lib/bewe-members";
import { isSupabaseConfigured } from "@/lib/supabase/server";

function planLabel(plan: string) {
  if (plan === "ilimitada") return "Ilimitado";
  if (plan === "transformacion") return "Expande";
  return plan;
}

function groupName(plan: string) {
  if (plan === "ilimitada") return "GAL's VIP";
  if (plan === "transformacion") return "GAL's Plus";
  return "GAL's";
}

/** Preview de links que se enviarían (sin mandar mails). */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase no configurado" },
      { status: 503 },
    );
  }

  let body: { ids?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const ids = Array.isArray(body.ids)
    ? body.ids.map((id) => String(id).trim()).filter(Boolean)
    : [];

  if (ids.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Seleccioná al menos una persona" },
      { status: 400 },
    );
  }

  try {
    const members = await listBeweMembers({ eligibleOnly: true });
    const selected = members.filter((m) => ids.includes(m.id));

    const previews = selected.map((m) => {
      const link = communityLinkForMember(m);
      return {
        id: m.id,
        name: m.name,
        email: m.email,
        plan: m.plan,
        planLabel: planLabel(m.plan),
        groupName: groupName(m.plan),
        waTier: m.waTier,
        link,
        alreadySent: Boolean(m.emailSentAt),
        ok: Boolean(link && m.email),
        issue: !m.email
          ? "Sin email"
          : !link
            ? "Sin link de grupo (revisá env WHATSAPP_PLUS/VIP)"
            : null,
      };
    });

    return NextResponse.json({
      ok: true,
      previews,
      ready: previews.filter((p) => p.ok).length,
      withIssues: previews.filter((p) => !p.ok).length,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al previsualizar";
    console.error("[admin/comunidad/preview-links]", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
