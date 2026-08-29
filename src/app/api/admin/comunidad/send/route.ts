import { NextResponse } from "next/server";
import {
  communityLinkForMember,
  listBeweMembers,
  markMembersEmailed,
} from "@/lib/bewe-members";
import { sendCommunityAccessEmail } from "@/lib/resend";
import { isSupabaseConfigured } from "@/lib/supabase/server";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

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

  let body: { ids?: string[]; onlyPending?: boolean };
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

  try {
    const members = await listBeweMembers({ eligibleOnly: true });
    const selected =
      ids.length > 0
        ? members.filter((m) => ids.includes(m.id))
        : members.filter((m) =>
            body.onlyPending === false ? true : !m.emailSentAt,
          );

    if (selected.length === 0) {
      return NextResponse.json({
        ok: true,
        sent: 0,
        failed: 0,
        skipped: 0,
        message: "No hay destinatarias",
      });
    }

    let sent = 0;
    let failed = 0;
    let skipped = 0;
    const sentIds: string[] = [];

    for (const member of selected) {
      const link = communityLinkForMember(member);
      if (!link || !member.email) {
        skipped += 1;
        continue;
      }

      const ok = await sendCommunityAccessEmail({
        to: member.email,
        name: member.name,
        planLabel: planLabel(member.plan),
        groupUrl: link,
        groupName: groupName(member.plan),
      });

      if (ok) {
        sent += 1;
        sentIds.push(member.id);
      } else {
        failed += 1;
      }
      await sleep(350);
    }

    await markMembersEmailed(sentIds);

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      skipped,
      total: selected.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al enviar";
    console.error("[admin/comunidad/send]", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
