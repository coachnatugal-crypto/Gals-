import type { GalsEvent } from "@/lib/eventos";
import {
  createSupabaseAdmin,
  createSupabaseAnon,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export type EventRow = {
  id: string;
  kind: "free" | "paid";
  featured: boolean;
  published: boolean;
  title: string;
  eyebrow: string;
  date_label: string;
  time_label: string | null;
  place: string;
  headline: string;
  subhead: string;
  concept: string | null;
  signup_pitch: string | null;
  image: string;
  starts_at: string;
  price: string | null;
  price_amount: number | null;
  show_price: boolean;
  cta: string;
  bewe_after: "form" | "packs";
  why: GalsEvent["why"] | null;
  stats: GalsEvent["stats"] | null;
  after_event: GalsEvent["afterEvent"] | null;
  capacity: number | null;
};

export function rowToGalsEvent(row: EventRow): GalsEvent {
  return {
    id: row.id,
    kind: row.kind,
    featured: row.featured || undefined,
    title: row.title,
    eyebrow: row.eyebrow,
    dateLabel: row.date_label,
    timeLabel: row.time_label || undefined,
    place: row.place,
    headline: row.headline,
    subhead: row.subhead,
    concept: row.concept || undefined,
    signupPitch: row.signup_pitch || undefined,
    image: row.image,
    startsAt: row.starts_at,
    price: row.price || undefined,
    priceAmount: row.price_amount ?? undefined,
    showPrice: row.show_price,
    cta: row.cta,
    beweAfter: row.bewe_after,
    why: Array.isArray(row.why) ? row.why : [],
    stats: row.stats || undefined,
    afterEvent: row.after_event || undefined,
    published: row.published,
    capacity: row.capacity ?? undefined,
  };
}

export function galsEventToRow(event: GalsEvent): EventRow {
  return {
    id: event.id,
    kind: event.kind,
    featured: Boolean(event.featured),
    published: event.published ?? true,
    title: event.title,
    eyebrow: event.eyebrow,
    date_label: event.dateLabel,
    time_label: event.timeLabel ?? null,
    place: event.place,
    headline: event.headline,
    subhead: event.subhead,
    concept: event.concept ?? null,
    signup_pitch: event.signupPitch ?? null,
    image: event.image,
    starts_at: event.startsAt,
    price: event.price ?? null,
    price_amount: event.priceAmount ?? null,
    show_price: Boolean(event.showPrice),
    cta: event.cta,
    bewe_after: event.beweAfter,
    why: event.why ?? [],
    stats: event.stats ?? null,
    after_event: event.afterEvent ?? null,
    capacity: event.capacity ?? null,
  };
}

/** Todos los eventos (admin). */
export async function fetchAllEventsAdmin(): Promise<GalsEvent[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data as EventRow[]).map(rowToGalsEvent);
}

export async function upsertEventAdmin(event: GalsEvent) {
  const supabase = createSupabaseAdmin();
  const row = galsEventToRow(event);
  const { data, error } = await supabase
    .from("events")
    .upsert(row, { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw error;
  return rowToGalsEvent(data as EventRow);
}

export async function deleteEventAdmin(id: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

export async function clearFeaturedExcept(id: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("events")
    .update({ featured: false })
    .neq("id", id);
  if (error) throw error;
}

export type RegistrationRow = {
  id: string;
  event_id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  source: string;
  status: string;
  notes: string | null;
  confirmation_email_sent_at: string | null;
  created_at: string;
};

export async function fetchRegistrationsAdmin() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as RegistrationRow[]) ?? [];
}

export async function createRegistrationAdmin(input: {
  eventId: string;
  name: string;
  whatsapp: string;
  email?: string;
  source?: string;
  status?: string;
}) {
  const supabase = createSupabaseAdmin();
  const email = input.email?.trim() || null;
  const { data, error } = await supabase
    .from("registrations")
    .insert({
      event_id: input.eventId,
      name: input.name,
      whatsapp: input.whatsapp,
      ...(email ? { email } : {}),
      source: input.source ?? "admin",
      status: input.status ?? "nuevo",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as RegistrationRow;
}

export async function updateRegistrationStatusAdmin(
  id: string,
  status: string,
) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("registrations")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteRegistrationAdmin(id: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("registrations").delete().eq("id", id);
  if (error) throw error;
}

/** Eventos publicados para la landing (anon + RLS). */
export async function fetchPublishedEvents(): Promise<GalsEvent[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createSupabaseAnon();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .order("starts_at", { ascending: true });

    if (error) {
      console.error("[eventos-db] fetchPublishedEvents", error);
      return null;
    }
    return (data as EventRow[]).map(rowToGalsEvent);
  } catch (err) {
    console.error("[eventos-db] fetchPublishedEvents", err);
    return null;
  }
}

/** Un evento por id (admin client, incluye no publicados). */
export async function fetchEventById(id: string): Promise<GalsEvent | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[eventos-db] fetchEventById", error);
      return null;
    }
    if (!data) return null;
    return rowToGalsEvent(data as EventRow);
  } catch (err) {
    console.error("[eventos-db] fetchEventById", err);
    return null;
  }
}

export async function createRegistration(input: {
  eventId: string;
  name: string;
  whatsapp: string;
  email: string;
  source: string;
  status: "nuevo" | "pendiente_pago" | "pagado" | "confirmado" | "cancelado";
}) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("registrations")
    .insert({
      event_id: input.eventId,
      name: input.name,
      whatsapp: input.whatsapp,
      email: input.email,
      source: input.source,
      status: input.status,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

/** Inscritos activos (no cancelados) para cupos. */
export async function countActiveRegistrations(eventId: string) {
  const supabase = createSupabaseAdmin();
  const { count, error } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId)
    .neq("status", "cancelado");

  if (error) throw error;
  return count ?? 0;
}

/** Borra un registro (p. ej. rollback si falla Mercado Pago). */
export async function deleteRegistration(id: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("registrations").delete().eq("id", id);
  if (error) throw error;
}

/** Marca el mail de confirmación como enviado (anti-duplicado webhook). */
export async function markConfirmationEmailSent(registrationId: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("registrations")
    .update({ confirmation_email_sent_at: new Date().toISOString() })
    .eq("id", registrationId)
    .is("confirmation_email_sent_at", null)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  return Boolean(data?.id);
}

export async function fetchRegistrationById(id: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as RegistrationRow | null) ?? null;
}

export async function createPaymentRow(input: {
  registrationId: string;
  eventId: string;
  amount: number;
  preferenceId?: string | null;
  externalReference?: string | null;
  status?: "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "in_process";
}) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("payments")
    .insert({
      registration_id: input.registrationId,
      event_id: input.eventId,
      amount: input.amount,
      preference_id: input.preferenceId ?? null,
      external_reference: input.externalReference ?? null,
      status: input.status ?? "pending",
      currency: "COP",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function updatePaymentByPreference(input: {
  preferenceId?: string | null;
  paymentId?: string | null;
  externalReference?: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "in_process";
  statusDetail?: string | null;
  raw?: unknown;
}) {
  const supabase = createSupabaseAdmin();

  let query = supabase.from("payments").select("id, registration_id").limit(1);
  if (input.preferenceId) {
    query = query.eq("preference_id", input.preferenceId);
  } else if (input.externalReference) {
    query = query.eq("external_reference", input.externalReference);
  } else if (input.paymentId) {
    query = query.eq("payment_id", input.paymentId);
  } else {
    return null;
  }

  const { data: existing, error: findError } = await query.maybeSingle();
  if (findError) throw findError;
  if (!existing) return null;

  const { error: payError } = await supabase
    .from("payments")
    .update({
      payment_id: input.paymentId ?? undefined,
      status: input.status,
      mp_status_detail: input.statusDetail ?? null,
      raw: input.raw ?? null,
    })
    .eq("id", existing.id);

  if (payError) throw payError;

  if (input.status === "approved") {
    await supabase
      .from("registrations")
      .update({ status: "pagado" })
      .eq("id", existing.registration_id);
  } else if (input.status === "rejected" || input.status === "cancelled") {
    await supabase
      .from("registrations")
      .update({ status: "cancelado" })
      .eq("id", existing.registration_id);
  }

  return {
    paymentId: existing.id as string,
    registrationId: existing.registration_id as string,
  };
}
