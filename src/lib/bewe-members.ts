import "server-only";
import {
  PLAN_WHATSAPP_ACCESS,
  type PaidWhatsAppTier,
} from "@/lib/constants";
import { getPlanWhatsAppUrl } from "@/lib/whatsapp-paid";
import {
  fetchAllBeweClients,
  fetchBeweTickets,
  type BeweClient,
  type BeweTicket,
} from "@/lib/bewe-api";
import {
  createSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export type CommunityPlan = "transformacion" | "ilimitada" | "unknown";

export type PlanSource =
  | "ticket"
  | "group"
  | "subscription"
  | "manual"
  | "none";

export type BeweMember = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  plan: CommunityPlan;
  planSource: PlanSource;
  planLabel: string | null;
  waTier: PaidWhatsAppTier | null;
  emailSentAt: string | null;
  /** Inicio / alta de la membresía (CSV o ticket Bewe). */
  subscribedAt: string | null;
  lastSyncedAt: string;
};

export type CsvMemberInput = {
  email: string;
  name?: string;
  phone?: string | null;
  planText?: string | null;
  active?: boolean;
  /** Fecha de inicio / alta de suscripción (ISO o texto parseable). */
  subscribedAt?: string | null;
};

export type CsvImportResult = {
  imported: number;
  eligible: number;
  withPlanColumn: number;
  plansUpdated: number;
  plus: number;
  vip: number;
  skippedNoEmail: number;
  skippedInactive: number;
};

type MemberRow = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  plan: CommunityPlan;
  plan_source: PlanSource;
  plan_label: string | null;
  wa_tier: PaidWhatsAppTier | null;
  email_sent_at: string | null;
  subscribed_at: string | null;
  last_synced_at: string;
};

const PAGE_SIZE = 1000;
const UPSERT_CHUNK = 50;
const TICKET_WINDOW_DAYS = 120;

function rowToMember(row: MemberRow): BeweMember {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    plan: row.plan,
    planSource: row.plan_source,
    planLabel: row.plan_label,
    waTier: row.wa_tier,
    emailSentAt: row.email_sent_at,
    subscribedAt: row.subscribed_at ?? null,
    lastSyncedAt: row.last_synced_at,
  };
}

/** Parsea fechas típicas de exports Bewe / Excel (ISO, dd/mm/yyyy, etc.). */
export function parseFlexibleDate(raw: string | null | undefined): string | null {
  const s = String(raw ?? "").trim();
  if (!s) return null;

  // ISO / yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }

  // dd/mm/yyyy or dd-mm-yyyy (con hora opcional)
  const m = s.match(
    /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/,
  );
  if (m) {
    const day = Number(m[1]);
    const month = Number(m[2]);
    let year = Number(m[3]);
    if (year < 100) year += 2000;
    const hour = m[4] ? Number(m[4]) : 12;
    const min = m[5] ? Number(m[5]) : 0;
    const sec = m[6] ? Number(m[6]) : 0;
    const d = new Date(Date.UTC(year, month - 1, day, hour, min, sec));
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }

  const fallback = new Date(s);
  if (!Number.isNaN(fallback.getTime())) return fallback.toISOString();
  return null;
}

function formatDbError(error: {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
}) {
  const msg = error.message ?? "";
  const code = error.code ?? "";
  const missing =
    code === "42P01" ||
    code === "PGRST205" ||
    /could not find the table/i.test(msg) ||
    /relation .*bewe_members.* does not exist/i.test(msg);

  if (missing) {
    return [
      "Supabase no ve la tabla bewe_members (a veces es caché del API).",
      "Verificá en Table Editor, luego Settings → API → Reload schema,",
      "esperá ~30s y dale Recargar. Detalle:",
      msg || code || "sin detalle",
    ].join(" ");
  }

  if (/plan_source|check constraint/i.test(msg)) {
    return [
      msg,
      "Corré el SQL actualizado en supabase/bewe-members-schema.sql (incluye subscription).",
    ].join(" · ");
  }

  if (/subscribed_at|column .* does not exist/i.test(msg)) {
    return [
      msg,
      "Falta la columna subscribed_at. Corré en Supabase:",
      "alter table public.bewe_members add column if not exists subscribed_at timestamptz;",
    ].join(" · ");
  }

  return [msg, error.details, error.hint, code ? `código ${code}` : ""]
    .filter(Boolean)
    .join(" · ");
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/**
 * Clasifica texto de plan Bewe (CSV Suscripciones / tickets / grupos).
 * Expande/transform/plus → transformacion | Ilimitado/unlimited/vip → ilimitada
 * Ritual/Starter/1 clase/semana → unknown (sin exclusivo)
 */
export function classifyBewePlan(text: string): {
  plan: CommunityPlan;
  label: string;
  exclusive: boolean;
} | null {
  const label = text.trim();
  const t = normalize(label);
  if (!t) return null;

  if (/ilimitad|unlimited|\bvip\b|sin limite/.test(t)) {
    return { plan: "ilimitada", label, exclusive: true };
  }
  if (/expande|transform|\bplus\b/.test(t)) {
    return { plan: "transformacion", label, exclusive: true };
  }
  if (
    /\britual\b/.test(t) ||
    /\bstarter\b/.test(t) ||
    /\b1\s*clase\b/.test(t) ||
    /\bsemana\b/.test(t)
  ) {
    return { plan: "unknown", label, exclusive: false };
  }
  return { plan: "unknown", label, exclusive: false };
}

/** Solo planes con grupo exclusivo (tickets / sync API). */
export function inferCommunityPlan(
  text: string,
): { plan: CommunityPlan; label: string } | null {
  const classified = classifyBewePlan(text);
  if (!classified?.exclusive) return null;
  return { plan: classified.plan, label: classified.label };
}

function planRank(plan: CommunityPlan) {
  if (plan === "ilimitada") return 2;
  if (plan === "transformacion") return 1;
  return 0;
}

function waTierForPlan(plan: CommunityPlan): PaidWhatsAppTier | null {
  if (plan === "transformacion") return PLAN_WHATSAPP_ACCESS.transformacion;
  if (plan === "ilimitada") return PLAN_WHATSAPP_ACCESS.ilimitada;
  return null;
}

function isEligiblePlan(plan: CommunityPlan) {
  return plan === "transformacion" || plan === "ilimitada";
}

/** Dedupe por email y luego por id; gana el plan de mayor rank. */
function dedupeMemberRows<
  T extends { id: string; email: string; plan: CommunityPlan },
>(rows: T[]): T[] {
  const byEmail = new Map<string, T>();
  for (const row of rows) {
    const email = row.email.trim().toLowerCase();
    if (!email) continue;
    const prev = byEmail.get(email);
    if (!prev || planRank(row.plan) >= planRank(prev.plan)) {
      byEmail.set(email, { ...row, email });
    }
  }

  const byId = new Map<string, T>();
  for (const row of byEmail.values()) {
    const prev = byId.get(row.id);
    if (!prev || planRank(row.plan) >= planRank(prev.plan)) {
      byId.set(row.id, row);
    }
  }
  return [...byId.values()];
}

async function fetchAllMemberRows<T extends Record<string, unknown>>(
  select: string,
): Promise<T[]> {
  const supabase = createSupabaseAdmin();
  const all: T[] = [];
  let from = 0;

  for (;;) {
    const { data, error } = await supabase
      .from("bewe_members")
      .select(select)
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw new Error(formatDbError(error));
    const batch = (data ?? []) as unknown as T[];
    all.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return all;
}

async function upsertMemberChunks(
  rows: Array<MemberRow & { updated_at: string }>,
) {
  const supabase = createSupabaseAdmin();
  for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
    const slice = dedupeMemberRows(rows.slice(i, i + UPSERT_CHUNK));
    const { error } = await supabase.from("bewe_members").upsert(slice, {
      onConflict: "id",
    });
    if (error) throw new Error(formatDbError(error));
  }
}

function clientDisplayName(c: BeweClient) {
  return [c.name, c.lastname].filter(Boolean).join(" ").trim() || "Miembro";
}

function clientIdOf(c: BeweClient) {
  return String(c._id ?? "").trim();
}

function groupsToText(groups: unknown[] | undefined): string[] {
  if (!Array.isArray(groups)) return [];
  return groups.map((g) => {
    if (typeof g === "string") return g;
    if (g && typeof g === "object") {
      const o = g as Record<string, unknown>;
      return String(o.name ?? o.title ?? o.label ?? "");
    }
    return "";
  });
}

function pickBestPlan(
  candidates: Array<{
    plan: CommunityPlan;
    label: string;
    source: PlanSource;
  }>,
) {
  if (candidates.length === 0) {
    return {
      plan: "unknown" as CommunityPlan,
      label: null as string | null,
      source: "none" as PlanSource,
    };
  }
  const best = [...candidates].sort(
    (a, b) => planRank(b.plan) - planRank(a.plan),
  )[0];
  return { plan: best.plan, label: best.label, source: best.source };
}

function isIgnoredTicketStatus(status: string) {
  return Boolean(status && /cancel|void|refund|anul|rechaz/.test(status));
}

function plansFromTickets(tickets: BeweTicket[]) {
  const byClient = new Map<
    string,
    Array<{
      plan: CommunityPlan;
      label: string;
      source: PlanSource;
      at: string | null;
    }>
  >();

  for (const ticket of tickets) {
    const raw = ticket as Record<string, unknown>;
    const id = String(
      ticket.idClient ?? raw.id_client ?? raw.clientId ?? "",
    ).trim();
    if (!id) continue;

    const status = normalize(
      String(raw.status ?? raw.state ?? raw.paymentStatus ?? ""),
    );
    if (isIgnoredTicketStatus(status)) continue;

    const at = parseFlexibleDate(
      String(ticket.date ?? raw.createdAt ?? raw.created_at ?? ""),
    );

    const items = Array.isArray(ticket.items) ? ticket.items : [];
    for (const item of items) {
      const name = String(item?.name ?? "");
      const inferred = inferCommunityPlan(name);
      if (!inferred) continue;
      const list = byClient.get(id) ?? [];
      list.push({ ...inferred, source: "ticket", at });
      byClient.set(id, list);
    }
  }

  const best = new Map<
    string,
    {
      plan: CommunityPlan;
      label: string | null;
      source: PlanSource;
      subscribedAt: string | null;
    }
  >();
  for (const [id, list] of byClient) {
    const picked = pickBestPlan(list);
    const samePlan = list.filter((x) => x.plan === picked.plan);
    const dates = samePlan
      .map((x) => x.at)
      .filter(Boolean)
      .sort() as string[];
    best.set(id, {
      ...picked,
      subscribedAt: dates[0] ?? null,
    });
  }
  return best;
}

function preferTicketOrGroup(
  fromTicket:
    | {
        plan: CommunityPlan;
        label: string | null;
        source: PlanSource;
        subscribedAt?: string | null;
      }
    | undefined,
  fromGroups: {
    plan: CommunityPlan;
    label: string | null;
    source: PlanSource;
  },
): {
  plan: CommunityPlan;
  label: string | null;
  source: PlanSource;
  subscribedAt: string | null;
} {
  if (fromTicket && planRank(fromTicket.plan) > 0) {
    return {
      plan: fromTicket.plan,
      label: fromTicket.label,
      source: fromTicket.source,
      subscribedAt: fromTicket.subscribedAt ?? null,
    };
  }
  if (fromGroups.plan !== "unknown") {
    return { ...fromGroups, subscribedAt: null };
  }
  if (fromTicket) {
    return {
      plan: fromTicket.plan,
      label: fromTicket.label,
      source: fromTicket.source,
      subscribedAt: fromTicket.subscribedAt ?? null,
    };
  }
  return { ...fromGroups, subscribedAt: null };
}

export async function syncBeweMembers(): Promise<{
  synced: number;
  eligible: number;
  clients: number;
  tickets: number;
  ticketsWarning?: string;
}> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no configurado");
  }

  const clients = await fetchAllBeweClients();

  let tickets: BeweTicket[] = [];
  let ticketsWarning: string | undefined;
  try {
    const start = new Date();
    start.setDate(start.getDate() - TICKET_WINDOW_DAYS);
    tickets = await fetchBeweTickets({
      startDate: start.toISOString().slice(0, 10),
    });
  } catch (err) {
    ticketsWarning =
      err instanceof Error
        ? `Tickets Bewe no disponibles (${err.message}). Se usaron solo clientes/grupos.`
        : "Tickets Bewe no disponibles. Se usaron solo clientes/grupos.";
  }

  const ticketPlans = plansFromTickets(tickets);
  const now = new Date().toISOString();
  const rows: MemberRow[] = [];

  for (const client of clients) {
    const id = clientIdOf(client);
    const email = String(client.email ?? "")
      .trim()
      .toLowerCase();
    if (!id || !email || !email.includes("@")) continue;

    const fromTicket = ticketPlans.get(id);
    const groupCandidates = groupsToText(client.groups)
      .map((g) => {
        const inferred = inferCommunityPlan(g);
        return inferred ? { ...inferred, source: "group" as const } : null;
      })
      .filter(Boolean) as Array<{
      plan: CommunityPlan;
      label: string;
      source: PlanSource;
    }>;

    const chosen = preferTicketOrGroup(
      fromTicket,
      pickBestPlan(groupCandidates),
    );
    const plan = chosen.plan;

    rows.push({
      id,
      email,
      name: clientDisplayName(client),
      phone: client.phone ? String(client.phone) : null,
      plan,
      plan_source: chosen.source,
      plan_label: chosen.label,
      wa_tier: waTierForPlan(plan),
      email_sent_at: null,
      subscribed_at: chosen.subscribedAt,
      last_synced_at: now,
    });
  }

  type Existing = {
    id: string;
    email: string;
    email_sent_at: string | null;
    subscribed_at: string | null;
    plan: CommunityPlan;
    plan_source: PlanSource;
  };

  const existing = await fetchAllMemberRows<Existing>(
    "id, email, email_sent_at, subscribed_at, plan, plan_source",
  );
  const existingById = new Map(existing.map((r) => [String(r.id), r]));
  const existingByEmail = new Map(
    existing.map((r) => [String(r.email).toLowerCase(), r]),
  );

  const payload = dedupeMemberRows(
    rows.map((row) => {
      const prev =
        existingById.get(row.id) ?? existingByEmail.get(row.email) ?? null;

      // Solo plan_source === "manual" se preserva; subscription/ticket/group se actualizan
      if (prev?.plan_source === "manual") {
        return {
          ...row,
          id: prev.id,
          plan: prev.plan,
          plan_source: "manual" as const,
          wa_tier: waTierForPlan(prev.plan),
          email_sent_at: prev.email_sent_at,
          subscribed_at: prev.subscribed_at ?? row.subscribed_at,
          updated_at: now,
        };
      }

      return {
        ...row,
        id: prev?.id ?? row.id,
        email_sent_at: prev?.email_sent_at ?? null,
        subscribed_at: row.subscribed_at ?? prev?.subscribed_at ?? null,
        updated_at: now,
      };
    }),
  );

  await upsertMemberChunks(payload);

  return {
    synced: payload.length,
    eligible: payload.filter((r) => isEligiblePlan(r.plan)).length,
    clients: clients.length,
    tickets: tickets.length,
    ticketsWarning,
  };
}

function mergeName(rowName: string, email: string, prevName: string) {
  const fallback = email.split("@")[0] || "Miembro";
  if (rowName && rowName !== fallback) return rowName;
  return prevName || rowName;
}

/** Importa CSV de clientes o Suscripciones Bewe y clasifica por plan. */
export async function importBeweMembersFromCsv(
  rows: CsvMemberInput[],
): Promise<CsvImportResult> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no configurado");
  }

  const now = new Date().toISOString();
  type Prepared = MemberRow & { hasPlanColumn: boolean };
  const prepared: Prepared[] = [];
  let skippedNoEmail = 0;
  let skippedInactive = 0;

  for (const row of rows) {
    const email = String(row.email ?? "")
      .trim()
      .toLowerCase();
    if (!email || !email.includes("@")) {
      skippedNoEmail += 1;
      continue;
    }

    const planRaw = String(row.planText ?? "").trim();
    const hasPlanColumn = Boolean(planRaw);
    const active = row.active !== false;
    const classified = hasPlanColumn ? classifyBewePlan(planRaw) : null;

    let plan: CommunityPlan = "unknown";
    let planLabel: string | null = null;
    let planSource: PlanSource = "none";

    // CSV con plan → plan_source "subscription" (nunca "manual")
    if (hasPlanColumn && classified) {
      if (!active) {
        skippedInactive += 1;
        plan = "unknown";
        planLabel = `${classified.label} (inactiva)`;
        planSource = "subscription";
      } else {
        plan = classified.plan;
        planLabel = classified.label;
        planSource = "subscription";
      }
    }

    prepared.push({
      id: `csv:${email}`,
      email,
      name: String(row.name ?? "").trim() || email.split("@")[0] || "Miembro",
      phone: row.phone ? String(row.phone).trim() : null,
      plan,
      plan_source: planSource,
      plan_label: planLabel,
      wa_tier: waTierForPlan(plan),
      email_sent_at: null,
      subscribed_at: parseFlexibleDate(row.subscribedAt),
      last_synced_at: now,
      hasPlanColumn,
    });
  }

  if (prepared.length === 0) {
    throw new Error(
      skippedNoEmail > 0
        ? `Ninguna fila con email válido (${skippedNoEmail} sin email).`
        : "No hay filas válidas. El CSV necesita al menos una columna email.",
    );
  }

  type Existing = {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    email_sent_at: string | null;
    subscribed_at: string | null;
    plan: CommunityPlan;
    plan_source: PlanSource;
    plan_label: string | null;
    wa_tier: PaidWhatsAppTier | null;
  };

  const existing = await fetchAllMemberRows<Existing>(
    "id, email, name, phone, email_sent_at, subscribed_at, plan, plan_source, plan_label, wa_tier",
  );
  const byEmail = new Map(
    existing.map((r) => [String(r.email).toLowerCase(), r]),
  );

  let plansUpdated = 0;

  const payload = dedupeMemberRows(
    prepared.map((row) => {
      const prev = byEmail.get(row.email);
      const { hasPlanColumn, ...rest } = row;

      if (!prev) {
        if (hasPlanColumn) plansUpdated += 1;
        return { ...rest, updated_at: now };
      }

      // CSV sin plan: no pisa plan existente
      if (!hasPlanColumn) {
        return {
          ...rest,
          id: prev.id,
          name: mergeName(row.name, row.email, prev.name),
          phone: row.phone || prev.phone,
          plan: prev.plan,
          plan_source: prev.plan_source,
          plan_label: prev.plan_label,
          wa_tier: waTierForPlan(prev.plan),
          email_sent_at: prev.email_sent_at,
          subscribed_at: rest.subscribed_at ?? prev.subscribed_at,
          updated_at: now,
        };
      }

      // CSV con plan + prev manual: preserva manual
      if (prev.plan_source === "manual") {
        return {
          ...rest,
          id: prev.id,
          plan: prev.plan,
          plan_source: "manual" as const,
          plan_label: prev.plan_label,
          wa_tier: waTierForPlan(prev.plan),
          name: mergeName(row.name, row.email, prev.name),
          phone: row.phone || prev.phone,
          email_sent_at: prev.email_sent_at,
          subscribed_at: rest.subscribed_at ?? prev.subscribed_at,
          updated_at: now,
        };
      }

      plansUpdated += 1;
      return {
        ...rest,
        id: prev.id,
        name: mergeName(row.name, row.email, prev.name),
        phone: row.phone || prev.phone,
        email_sent_at: prev.email_sent_at,
        subscribed_at: rest.subscribed_at ?? prev.subscribed_at,
        updated_at: now,
      };
    }),
  );

  await upsertMemberChunks(payload);

  return {
    imported: payload.length,
    eligible: payload.filter((r) => isEligiblePlan(r.plan)).length,
    withPlanColumn: prepared.filter((r) => r.hasPlanColumn).length,
    plansUpdated,
    plus: payload.filter((r) => r.plan === "transformacion").length,
    vip: payload.filter((r) => r.plan === "ilimitada").length,
    skippedNoEmail,
    skippedInactive,
  };
}

export async function listBeweMembers(filter?: {
  eligibleOnly?: boolean;
  pendingOnly?: boolean;
}): Promise<BeweMember[]> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no configurado");
  }

  const all = await fetchAllMemberRows<MemberRow>("*");
  let members = all.map(rowToMember);

  if (filter?.eligibleOnly) {
    members = members.filter((m) => isEligiblePlan(m.plan));
  }
  if (filter?.pendingOnly) {
    members = members.filter((m) => !m.emailSentAt);
  }

  members.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return members;
}

export async function setMemberPlan(id: string, plan: CommunityPlan) {
  const supabase = createSupabaseAdmin();
  const now = new Date().toISOString();
  const planLabel =
    plan === "ilimitada"
      ? "Ilimitado"
      : plan === "transformacion"
        ? "Expande"
        : null;

  const { data, error } = await supabase
    .from("bewe_members")
    .update({
      plan,
      plan_source: "manual",
      plan_label: planLabel,
      wa_tier: waTierForPlan(plan),
      updated_at: now,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(formatDbError(error));
  return rowToMember(data as MemberRow);
}

export async function markMembersEmailed(ids: string[]) {
  if (ids.length === 0) return;
  const supabase = createSupabaseAdmin();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("bewe_members")
    .update({ email_sent_at: now, updated_at: now })
    .in("id", ids);
  if (error) throw new Error(formatDbError(error));
}

export function communityLinkForMember(member: BeweMember): string | null {
  if (member.plan === "transformacion") {
    return getPlanWhatsAppUrl("transformacion");
  }
  if (member.plan === "ilimitada") {
    return getPlanWhatsAppUrl("ilimitada");
  }
  return null;
}
