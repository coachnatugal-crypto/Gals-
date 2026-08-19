"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  draftToEvent,
  emptyDraft,
  eventToDraft,
  formatWhen,
  labelsFromStartsAt,
  slugifyId,
  toDatetimeLocalValue,
  type AdminEventDraft,
  type AdminRegistration,
} from "@/lib/admin-eventos-store";
import type { EventKind, GalsEvent } from "@/lib/eventos";
import { EventCoverPicker } from "@/components/admin/EventCoverPicker";

type Tab = "resumen" | "eventos" | "inscritos" | "editor";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

const inputClass =
  "w-full rounded-xl border border-gals-blue-deep/12 bg-white/90 px-3.5 py-2.5 text-sm text-gals-ink outline-none transition focus:border-gals-blue-deep/35 focus:ring-2 focus:ring-gals-blue-soft";
const labelClass =
  "mb-1.5 block text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase";

function StatCard({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string | number;
  delay?: number;
}) {
  return (
    <motion.div
      className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_12px_40px_rgba(85,104,148,0.08)] backdrop-blur-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-[10px] font-semibold tracking-[0.18em] text-gals-muted uppercase">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl tracking-tight text-gals-blue-deep tabular-nums">
        {value}
      </p>
    </motion.div>
  );
}

function StatusPill({ status }: { status: AdminRegistration["status"] }) {
  const styles: Record<AdminRegistration["status"], string> = {
    nuevo: "bg-gals-blue-soft text-gals-blue-deep",
    pendiente_pago: "bg-amber-100 text-amber-900",
    pagado: "bg-gals-green-soft text-gals-ink",
    confirmado: "bg-gals-green-soft text-gals-ink",
    cancelado: "bg-gals-ink/8 text-gals-muted",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function EmptyState({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gals-blue-deep/20 bg-white/50 px-6 py-14 text-center">
      <p className="font-display text-lg uppercase text-gals-blue-deep">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gals-muted">{body}</p>
      {children}
    </div>
  );
}

export function EventosAdminPanel() {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("eventos");
  const [events, setEvents] = useState<GalsEvent[]>([]);
  const [regs, setRegs] = useState<AdminRegistration[]>([]);
  const [draft, setDraft] = useState<AdminEventDraft>(() => emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterKind, setFilterKind] = useState<"all" | EventKind>("all");
  const [filterEventId, setFilterEventId] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | AdminRegistration["status"]
  >("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [regForm, setRegForm] = useState({
    name: "",
    whatsapp: "",
    eventId: "",
  });

  const [saving, setSaving] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [testName, setTestName] = useState("Naty");
  const [testEventId, setTestEventId] = useState("");
  const [testPaid, setTestPaid] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [evRes, regRes] = await Promise.all([
          fetch("/api/admin/eventos"),
          fetch("/api/admin/eventos/registrations"),
        ]);
        const evData = (await evRes.json()) as {
          ok?: boolean;
          events?: GalsEvent[];
          error?: string;
        };
        const regData = (await regRes.json()) as {
          ok?: boolean;
          registrations?: AdminRegistration[];
          error?: string;
        };
        if (cancelled) return;
        if (!evRes.ok || !evData.ok) {
          throw new Error(
            evData.error || "No se pudieron cargar eventos",
          );
        }
        setEvents(evData.events ?? []);
        setRegs(regData.ok ? (regData.registrations ?? []) : []);
        setLoadingError(null);
      } catch (err) {
        if (!cancelled) {
          setLoadingError(
            err instanceof Error ? err.message : "Error al cargar el panel",
          );
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    const close = () => setMenuId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const [nowTs] = useState(() => Date.now());
  const upcomingCount = useMemo(
    () =>
      events.filter((e) => new Date(e.startsAt).getTime() >= nowTs).length,
    [events, nowTs],
  );

  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => (filterKind === "all" ? true : e.kind === filterKind))
      .filter((e) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.headline.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      );
  }, [events, filterKind, search]);

  const filteredRegs = useMemo(() => {
    return regs
      .filter((r) =>
        filterEventId === "all" ? true : r.eventId === filterEventId,
      )
      .filter((r) =>
        filterStatus === "all" ? true : r.status === filterStatus,
      )
      .filter((r) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.whatsapp.toLowerCase().includes(q) ||
          (r.email?.toLowerCase().includes(q) ?? false)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [regs, filterEventId, filterStatus, search]);

  const eventTitle = (id: string) =>
    events.find((e) => e.id === id)?.title ?? id;

  async function sendTestEmail() {
    if (!testEmail.trim()) {
      flash("Escribí un email de destino");
      return;
    }
    setSendingTestEmail(true);
    try {
      const res = await fetch("/api/admin/eventos/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testEmail.trim(),
          name: testName.trim() || "GAL'S",
          eventId: testEventId || undefined,
          paid: testPaid,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        eventTitle?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo enviar");
      }
      flash(
        `Mail de prueba enviado${data.eventTitle ? ` · ${data.eventTitle}` : ""}`,
      );
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error al enviar prueba");
    } finally {
      setSendingTestEmail(false);
    }
  }

  function flash(msg: string) {
    setToast(msg);
  }

  function openCreate(kind: EventKind = "paid") {
    setEditingId(null);
    setDraft(emptyDraft(kind));
    setTab("editor");
  }

  function openEdit(event: GalsEvent) {
    setEditingId(event.id);
    setDraft(eventToDraft(event));
    setTab("editor");
  }

  async function saveDraft() {
    if (!draft.title.trim()) {
      flash("El título es obligatorio");
      return;
    }
    if (!draft.startsAt.trim()) {
      flash("La fecha/hora es obligatoria");
      return;
    }
    if (draft.kind === "paid" && !draft.priceAmount) {
      flash("Para cobrar online poné el Monto MP (COP), o dejalo y se irá a WhatsApp");
    }

    const id = editingId ?? (draft.id.trim() || slugifyId(draft.title));
    const labels = labelsFromStartsAt(draft.startsAt);
    const next = draftToEvent({
      ...draft,
      id,
      dateLabel: draft.dateLabel.trim() || labels.dateLabel,
      timeLabel: draft.timeLabel?.trim() || labels.timeLabel,
      cta:
        draft.kind === "paid" && draft.priceAmount
          ? draft.cta || "Pagar y reservar"
          : draft.cta,
    });

    setSaving(true);
    try {
      const res = await fetch("/api/admin/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: next }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        event?: GalsEvent;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.event) {
        throw new Error(data.error || "No se pudo guardar");
      }
      setEvents((prev) => {
        const without = prev.filter((e) => e.id !== data.event!.id);
        const normalized = data.event!.featured
          ? without.map((e) => ({ ...e, featured: false }))
          : without;
        return [...normalized, data.event!].sort(
          (a, b) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
        );
      });
      flash(
        editingId
          ? "Evento actualizado en Supabase"
          : "Evento creado · ya está en la landing",
      );
      setEditingId(data.event.id);
      setTab("eventos");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(id: string) {
    if (!window.confirm("¿Eliminar este evento de Supabase?")) return;
    try {
      const res = await fetch(`/api/admin/eventos?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo eliminar");
      }
      setEvents((prev) => prev.filter((e) => e.id !== id));
      flash("Evento eliminado");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error al eliminar");
    }
    setMenuId(null);
  }

  async function duplicateEvent(event: GalsEvent) {
    const copy: GalsEvent = {
      ...event,
      id: slugifyId(`${event.title}-copia`),
      title: `${event.title} (copia)`,
      featured: false,
      published: false,
    };
    try {
      const res = await fetch("/api/admin/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: copy }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        event?: GalsEvent;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.event) {
        throw new Error(data.error || "No se pudo duplicar");
      }
      setEvents((prev) => [...prev, data.event!]);
      flash("Copia creada (borrador / no publicado)");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error al duplicar");
    }
    setMenuId(null);
  }

  async function toggleFeatured(id: string) {
    const current = events.find((e) => e.id === id);
    if (!current) return;
    const next = { ...current, featured: !current.featured };
    try {
      const res = await fetch("/api/admin/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: next }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        event?: GalsEvent;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.event) {
        throw new Error(data.error || "No se pudo actualizar");
      }
      setEvents((prev) =>
        prev.map((e) => ({
          ...e,
          featured: e.id === id ? Boolean(data.event!.featured) : false,
        })),
      );
      flash("Featured actualizado");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error");
    }
    setMenuId(null);
  }

  async function toggleShowPrice(id: string) {
    const current = events.find((e) => e.id === id);
    if (!current) return;
    const next = { ...current, showPrice: !current.showPrice };
    try {
      const res = await fetch("/api/admin/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: next }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        event?: GalsEvent;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.event) {
        throw new Error(data.error || "No se pudo actualizar");
      }
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? data.event! : e)),
      );
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error");
    }
    setMenuId(null);
  }

  async function togglePublished(id: string) {
    const current = events.find((e) => e.id === id);
    if (!current) return;
    const next = { ...current, published: !(current.published ?? true) };
    try {
      const res = await fetch("/api/admin/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: next }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        event?: GalsEvent;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.event) {
        throw new Error(data.error || "No se pudo actualizar");
      }
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? data.event! : e)),
      );
      flash(
        data.event.published === false
          ? "Evento oculto en la landing"
          : "Evento publicado en la landing",
      );
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error");
    }
    setMenuId(null);
  }

  async function addRegistration() {
    const name = regForm.name.trim();
    const whatsapp = regForm.whatsapp.trim();
    const eventId = regForm.eventId || events[0]?.id;
    if (!name || name.length < 2) {
      flash("Ingresa el nombre");
      return;
    }
    if (!whatsapp) {
      flash("Ingresa el WhatsApp");
      return;
    }
    if (!eventId) {
      flash("Crea un evento primero");
      return;
    }
    try {
      const res = await fetch("/api/admin/eventos/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, whatsapp, eventId }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        registration?: AdminRegistration;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.registration) {
        throw new Error(data.error || "No se pudo agregar");
      }
      setRegs((prev) => [data.registration!, ...prev]);
      setRegForm({ name: "", whatsapp: "", eventId });
      flash("Inscrita agregada en Supabase");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error");
    }
  }

  async function updateRegStatus(
    id: string,
    status: AdminRegistration["status"],
  ) {
    try {
      const res = await fetch("/api/admin/eventos/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo actualizar");
      }
      setRegs((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error");
    }
  }

  async function removeReg(id: string) {
    try {
      const res = await fetch(
        `/api/admin/eventos/registrations?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo eliminar");
      }
      setRegs((prev) => prev.filter((r) => r.id !== id));
      flash("Inscripción eliminada");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error");
    }
  }

  async function importLandingEvents() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/eventos/seed", { method: "POST" });
      const data = (await res.json()) as {
        ok?: boolean;
        imported?: number;
        events?: GalsEvent[];
        error?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo importar");
      }
      setEvents(data.events ?? []);
      flash(
        `Listo: ${data.imported ?? 0} eventos de la landing en el admin`,
      );
      setTab("eventos");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error al importar");
    } finally {
      setSaving(false);
    }
  }

  async function reloadFromSupabase() {
    setReady(false);
    try {
      const [evRes, regRes] = await Promise.all([
        fetch("/api/admin/eventos"),
        fetch("/api/admin/eventos/registrations"),
      ]);
      const evData = (await evRes.json()) as {
        ok?: boolean;
        events?: GalsEvent[];
        error?: string;
      };
      const regData = (await regRes.json()) as {
        ok?: boolean;
        registrations?: AdminRegistration[];
      };
      if (!evRes.ok || !evData.ok) {
        throw new Error(evData.error || "Error al recargar");
      }
      setEvents(evData.events ?? []);
      setRegs(regData.registrations ?? []);
      flash("Sincronizado con Supabase");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error");
    } finally {
      setReady(true);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "resumen", label: "Resumen" },
    { id: "eventos", label: "Eventos" },
    { id: "inscritos", label: "Inscritos" },
    { id: "editor", label: editingId ? "Editar" : "Crear" },
  ];

  if (!ready) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center bg-gals-blue-soft text-sm text-gals-muted">
        Cargando panel desde Supabase…
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="flex min-h-[60svh] flex-col items-center justify-center gap-3 bg-gals-blue-soft px-5 text-center">
        <p className="font-display text-xl uppercase text-gals-blue-deep">
          No se pudo conectar
        </p>
        <p className="max-w-md text-sm text-gals-muted">{loadingError}</p>
        <button
          type="button"
          onClick={() => {
            setLoadingError(null);
            setReady(false);
            void reloadFromSupabase();
          }}
          className="rounded-full bg-gals-blue-deep px-5 py-2.5 text-xs font-bold text-white uppercase"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-gals-blue-soft via-[#f3f5fb] to-gals-mist">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <motion.header
          className="flex flex-col gap-5 border-b border-gals-blue-deep/10 pb-6 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] text-gals-blue-deep uppercase">
              GAL&apos;S Studio · Admin
            </p>
            <h1 className="mt-1 font-display text-3xl tracking-tight text-gals-ink uppercase md:text-4xl">
              Panel de eventos
            </h1>
            <p className="mt-2 max-w-lg text-sm text-gals-muted">
              Agenda e inscritos conectados a Supabase. Lo que guardes aparece en
              la landing /eventos (si está publicado).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void importLandingEvents()}
              className="rounded-full border border-gals-blue-deep/20 bg-white/70 px-4 py-2.5 text-[11px] font-semibold tracking-wide text-gals-blue-deep uppercase backdrop-blur-sm transition hover:bg-white disabled:opacity-60"
            >
              {saving ? "Importando…" : "Cargar eventos landing"}
            </button>
            <button
              type="button"
              onClick={() => void reloadFromSupabase()}
              className="rounded-full border border-gals-blue-deep/20 bg-white/70 px-4 py-2.5 text-[11px] font-semibold tracking-wide text-gals-blue-deep uppercase backdrop-blur-sm transition hover:bg-white"
            >
              Sincronizar
            </button>
            <a
              href="/eventos"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-gals-blue-deep/20 bg-white/70 px-4 py-2.5 text-[11px] font-semibold tracking-wide text-gals-blue-deep uppercase backdrop-blur-sm transition hover:bg-white"
            >
              Ver landing
            </a>
            <button
              type="button"
              onClick={() => openCreate("paid")}
              className="rounded-full bg-gals-blue-deep px-4 py-2.5 text-[11px] font-bold tracking-wide text-white uppercase shadow-[0_8px_24px_rgba(85,104,148,0.28)] transition hover:scale-[1.02]"
            >
              + Crear evento
            </button>
            <button
              type="button"
              onClick={() => {
                void fetch("/api/admin/logout", { method: "POST" }).then(() => {
                  window.location.href = "/admin/login";
                });
              }}
              className="rounded-full border border-gals-ink/15 bg-white/50 px-4 py-2.5 text-[11px] font-semibold tracking-wide text-gals-muted uppercase transition hover:bg-white hover:text-gals-ink"
            >
              Salir
            </button>
          </div>
        </motion.header>

        <nav className="mt-6 flex flex-wrap gap-2">
          {tabs.map((t, i) => (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-[11px] font-semibold tracking-wide uppercase transition ${
                tab === t.id
                  ? "bg-gals-blue-deep text-white shadow-md"
                  : "bg-white/70 text-gals-muted ring-1 ring-gals-blue-deep/10 hover:bg-white"
              }`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              {t.label}
            </motion.button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          {tab === "resumen" ? (
            <motion.div key="resumen" className="mt-8 space-y-6" {...fade}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Eventos" value={events.length} delay={0} />
                <StatCard label="Próximos" value={upcomingCount} delay={0.05} />
                <StatCard
                  label="Inscritos"
                  value={regs.filter((r) => r.status !== "cancelado").length}
                  delay={0.1}
                />
                <StatCard
                  label="Nuevos"
                  value={regs.filter((r) => r.status === "nuevo").length}
                  delay={0.15}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_12px_40px_rgba(85,104,148,0.06)] backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-lg uppercase text-gals-blue-deep">
                      Próximos eventos
                    </h2>
                    <button
                      type="button"
                      onClick={() => setTab("eventos")}
                      className="text-xs font-semibold text-gals-blue-deep underline-offset-2 hover:underline"
                    >
                      Ver todos
                    </button>
                  </div>
                  {filteredEvents.length === 0 ? (
                    <p className="mt-6 text-sm text-gals-muted">
                      No hay eventos en la agenda.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {filteredEvents.slice(0, 5).map((e) => (
                        <li
                          key={e.id}
                          className="flex items-center gap-3 border-b border-gals-blue-deep/8 pb-3 last:border-0"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={e.image}
                            alt=""
                            className="h-11 w-11 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gals-ink">
                              {e.title}
                            </p>
                            <p className="text-xs text-gals-muted">
                              {e.dateLabel}
                              {e.timeLabel ? ` · ${e.timeLabel}` : ""}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => openEdit(e)}
                            className="text-xs font-semibold text-gals-blue-deep"
                          >
                            Editar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_12px_40px_rgba(85,104,148,0.06)] backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-lg uppercase text-gals-blue-deep">
                      Últimas inscritos
                    </h2>
                    <button
                      type="button"
                      onClick={() => setTab("inscritos")}
                      className="text-xs font-semibold text-gals-blue-deep underline-offset-2 hover:underline"
                    >
                      Ver todas
                    </button>
                  </div>
                  {regs.length === 0 ? (
                    <p className="mt-6 text-sm text-gals-muted">
                      Aún no hay inscritos registrados.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {regs.slice(0, 5).map((r) => (
                        <li
                          key={r.id}
                          className="flex items-center justify-between gap-3 border-b border-gals-blue-deep/8 pb-3 last:border-0"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gals-ink">
                              {r.name}
                            </p>
                            <p className="truncate text-xs text-gals-muted">
                              {eventTitle(r.eventId)}
                              {r.email ? ` · ${r.email}` : ""}
                            </p>
                          </div>
                          <StatusPill status={r.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_12px_40px_rgba(85,104,148,0.06)] backdrop-blur-sm">
                <h2 className="font-display text-lg uppercase text-gals-blue-deep">
                  Email de prueba
                </h2>
                <p className="mt-1 max-w-xl text-sm text-gals-muted">
                  Envía la confirmación real (con asunto [PRUEBA]) para revisar
                  diseño y copy antes de un registro.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className={labelClass} htmlFor="test-email-to">
                      Destino
                    </label>
                    <input
                      id="test-email-to"
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="test-email-name">
                      Nombre en el mail
                    </label>
                    <input
                      id="test-email-name"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      placeholder="Naty"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="test-email-event">
                      Evento
                    </label>
                    <select
                      id="test-email-event"
                      value={testEventId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setTestEventId(id);
                        const ev = events.find((x) => x.id === id);
                        if (ev) setTestPaid(ev.kind === "paid");
                      }}
                      className={inputClass}
                    >
                      <option value="">Preview genérico</option>
                      {events.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col justify-end gap-2">
                    <label className="flex items-center gap-2 text-sm text-gals-ink">
                      <input
                        type="checkbox"
                        checked={testPaid}
                        onChange={(e) => setTestPaid(e.target.checked)}
                        className="rounded border-gals-blue-deep/30"
                      />
                      Variante con pago (nota MP)
                    </label>
                    <button
                      type="button"
                      disabled={sendingTestEmail}
                      onClick={() => void sendTestEmail()}
                      className="rounded-full bg-gals-blue-deep px-4 py-2.5 text-[11px] font-bold tracking-wide text-white uppercase disabled:opacity-60"
                    >
                      {sendingTestEmail ? "Enviando…" : "Enviar prueba"}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void reloadFromSupabase()}
                className="text-xs font-semibold text-gals-muted underline-offset-2 hover:text-gals-blue-deep hover:underline"
              >
                Recargar desde Supabase
              </button>
            </motion.div>
          ) : null}

          {tab === "eventos" ? (
            <motion.div key="eventos" className="mt-8 space-y-4" {...fade}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["all", "Todos"],
                      ["paid", "Pagos"],
                      ["free", "Gratis"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFilterKind(id)}
                      className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                        filterKind === id
                          ? "bg-gals-blue-deep text-white"
                          : "bg-white/80 text-gals-muted ring-1 ring-gals-blue-deep/10"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar evento…"
                  className={`${inputClass} sm:max-w-xs`}
                />
              </div>

              {filteredEvents.length === 0 ? (
                <EmptyState
                  title="Sin eventos"
                  body={
                    events.length === 0
                      ? "Todavía no hay eventos en Supabase. Carga los de la landing."
                      : "No hay eventos con ese filtro. Crea uno o cambia el filtro."
                  }
                >
                  {events.length === 0 ? (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void importLandingEvents()}
                      className="mt-4 rounded-full bg-gals-blue-deep px-5 py-2.5 text-xs font-bold text-white uppercase"
                    >
                      Cargar eventos landing
                    </button>
                  ) : null}
                </EmptyState>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-[0_16px_48px_rgba(85,104,148,0.08)] backdrop-blur-sm">
                  <ul>
                    {filteredEvents.map((e, i) => (
                      <motion.li
                        key={e.id}
                        className="grid gap-4 border-b border-gals-blue-deep/8 px-4 py-4 last:border-0 sm:px-5 md:grid-cols-[1fr_auto] md:items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.3) }}
                      >
                        <div className="flex min-w-0 items-start gap-3.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={e.image}
                            alt=""
                            className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-gals-blue-deep/10"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-gals-ink">
                                {e.title}
                              </p>
                              {e.featured ? (
                                <span className="rounded-full bg-gals-blue-soft px-2 py-0.5 text-[9px] font-bold tracking-wide text-gals-blue-deep uppercase">
                                  Featured
                                </span>
                              ) : null}
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                                  e.kind === "free"
                                    ? "bg-gals-green-soft text-gals-ink"
                                    : "bg-gals-blue-soft text-gals-blue-deep"
                                }`}
                              >
                                {e.kind === "free" ? "Gratis" : "Pago"}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-gals-muted">
                              {e.dateLabel}
                              {e.timeLabel ? ` · ${e.timeLabel}` : ""}
                              {e.showPrice && e.price ? ` · ${e.price}` : ""}
                              {!e.showPrice && e.price
                                ? " · precio oculto"
                                : ""}
                            </p>
                            <p className="mt-1 line-clamp-1 text-sm text-gals-muted">
                              {e.headline}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:justify-end">
                          <button
                            type="button"
                            onClick={() => openEdit(e)}
                            className="rounded-full bg-gals-blue-deep px-4 py-2 text-[11px] font-semibold text-white uppercase transition hover:scale-[1.02]"
                          >
                            Editar
                          </button>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                setMenuId(menuId === e.id ? null : e.id);
                              }}
                              className="rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-gals-muted ring-1 ring-gals-blue-deep/15 uppercase"
                            >
                              Más
                            </button>
                            <AnimatePresence>
                              {menuId === e.id ? (
                                <motion.div
                                  className="absolute right-0 z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-gals-blue-deep/10 bg-white py-1 shadow-xl"
                                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  onClick={(ev) => ev.stopPropagation()}
                                >
                                  {(
                                    [
                                      {
                                        label: e.featured
                                          ? "Quitar featured"
                                          : "Marcar featured",
                                        fn: () => void toggleFeatured(e.id),
                                      },
                                      {
                                        label:
                                          e.published === false
                                            ? "Publicar en landing"
                                            : "Ocultar en landing",
                                        fn: () => void togglePublished(e.id),
                                      },
                                      {
                                        label: e.showPrice
                                          ? "Ocultar precio"
                                          : "Mostrar precio",
                                        fn: () => void toggleShowPrice(e.id),
                                      },
                                      {
                                        label: "Duplicar",
                                        fn: () => void duplicateEvent(e),
                                      },
                                      {
                                        label: "Eliminar",
                                        fn: () => void removeEvent(e.id),
                                        danger: true,
                                      },
                                    ] as const
                                  ).map((item) => (
                                    <button
                                      key={item.label}
                                      type="button"
                                      onClick={item.fn}
                                      className={`block w-full px-3.5 py-2 text-left text-xs font-medium ${
                                        "danger" in item && item.danger
                                          ? "text-red-600 hover:bg-red-50"
                                          : "text-gals-ink hover:bg-gals-blue-soft"
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : null}

          {tab === "inscritos" ? (
            <motion.div key="inscritos" className="mt-8 space-y-5" {...fade}>
              <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-[0_12px_40px_rgba(85,104,148,0.06)] backdrop-blur-sm">
                <h2 className="font-display text-lg uppercase text-gals-blue-deep">
                  Agregar inscrita
                </h2>
                <p className="mt-1 text-xs text-gals-muted">
                  Solo se guarda lo que escribas aquí.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className={labelClass}>Nombre</label>
                    <input
                      className={inputClass}
                      value={regForm.name}
                      onChange={(e) =>
                        setRegForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp</label>
                    <input
                      className={inputClass}
                      value={regForm.whatsapp}
                      onChange={(e) =>
                        setRegForm((f) => ({ ...f, whatsapp: e.target.value }))
                      }
                      placeholder="+57 300…"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Evento</label>
                    <select
                      className={inputClass}
                      value={regForm.eventId || events[0]?.id || ""}
                      onChange={(e) =>
                        setRegForm((f) => ({ ...f, eventId: e.target.value }))
                      }
                    >
                      {events.length === 0 ? (
                        <option value="">Sin eventos</option>
                      ) : (
                        events.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.title}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => void addRegistration()}
                      className="w-full rounded-full bg-gals-blue-deep px-4 py-2.5 text-[11px] font-bold tracking-wide text-white uppercase"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filterEventId}
                    onChange={(e) => setFilterEventId(e.target.value)}
                    className={`${inputClass} max-w-[220px]`}
                  >
                    <option value="all">Todos los eventos</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(
                        e.target.value as
                          | "all"
                          | AdminRegistration["status"],
                      )
                    }
                    className={`${inputClass} max-w-[160px]`}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="nuevo">Nuevo</option>
                    <option value="pendiente_pago">Pendiente pago</option>
                    <option value="pagado">Pagado</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar nombre, email o WhatsApp…"
                  className={`${inputClass} lg:max-w-xs`}
                />
              </div>

              {filteredRegs.length === 0 ? (
                <EmptyState
                  title="Sin inscritos"
                  body="Cuando alguien se registre o agregues una inscrita aquí, aparecerá en esta lista."
                />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-[0_12px_40px_rgba(85,104,148,0.06)]">
                  <ul>
                    {filteredRegs.map((r) => (
                      <li
                        key={r.id}
                        className="grid gap-3 border-b border-gals-blue-deep/8 px-4 py-4 last:border-0 md:grid-cols-[1.1fr_1fr_auto] md:items-center"
                      >
                        <div>
                          <p className="font-semibold text-gals-ink">{r.name}</p>
                          <p className="text-xs text-gals-muted">{r.whatsapp}</p>
                          {r.email ? (
                            <p className="truncate text-xs text-gals-muted">
                              {r.email}
                            </p>
                          ) : null}
                        </div>
                        <div>
                          <p className="text-sm text-gals-ink">
                            {eventTitle(r.eventId)}
                          </p>
                          <p className="text-xs text-gals-muted">
                            {formatWhen(r.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusPill status={r.status} />
                          {(
                            [
                              "nuevo",
                              "pendiente_pago",
                              "pagado",
                              "confirmado",
                              "cancelado",
                            ] as const
                          ).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => void updateRegStatus(r.id, s)}
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                                r.status === s
                                  ? "bg-gals-blue-deep text-white"
                                  : "bg-gals-blue-soft/60 text-gals-muted"
                              }`}
                            >
                              {s.replace("_", " ")}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => void removeReg(r.id)}
                            className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-red-600 uppercase"
                          >
                            Borrar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : null}

          {tab === "editor" ? (
            <motion.div key="editor" className="mt-8" {...fade}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl uppercase text-gals-blue-deep">
                    {editingId ? "Editar evento" : "Crear evento"}
                  </h2>
                  <p className="text-sm text-gals-muted">
                    Se guarda en Supabase y, si está publicado, se ve en /eventos.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTab("eventos")}
                    className="rounded-full border border-gals-blue-deep/15 bg-white px-4 py-2 text-[11px] font-semibold uppercase"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void saveDraft()}
                    className="rounded-full bg-gals-blue-deep px-5 py-2 text-[11px] font-bold text-white uppercase shadow-md disabled:opacity-60"
                  >
                    {saving ? "Guardando…" : "Guardar en Supabase"}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_16px_48px_rgba(85,104,148,0.08)] backdrop-blur-sm md:grid-cols-2 md:p-6">
                <div>
                  <label className={labelClass}>Título</label>
                  <input
                    className={inputClass}
                    value={draft.title}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, title: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Headline</label>
                  <input
                    className={inputClass}
                    value={draft.headline}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, headline: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Tipo</label>
                  <select
                    className={inputClass}
                    value={draft.kind}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        kind: e.target.value as EventKind,
                        eyebrow:
                          e.target.value === "free"
                            ? "Evento gratis"
                            : "Experiencia paga",
                        beweAfter:
                          e.target.value === "free" ? "form" : "packs",
                        cta:
                          e.target.value === "free"
                            ? "Reservar mi cupo gratis"
                            : "Pagar y reservar",
                        price:
                          e.target.value === "free"
                            ? "Gratis"
                            : d.price === "Gratis"
                              ? ""
                              : d.price,
                        showPrice: true,
                      }))
                    }
                  >
                    <option value="paid">Pago</option>
                    <option value="free">Gratis</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Eyebrow</label>
                  <input
                    className={inputClass}
                    value={draft.eyebrow}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, eyebrow: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Fecha (label)</label>
                  <input
                    className={inputClass}
                    placeholder="29 de agosto"
                    value={draft.dateLabel}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, dateLabel: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Hora (label)</label>
                  <input
                    className={inputClass}
                    placeholder="9:30AM"
                    value={draft.timeLabel ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, timeLabel: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Fecha/hora (Bogotá)</label>
                  <input
                    className={inputClass}
                    type="datetime-local"
                    value={toDatetimeLocalValue(draft.startsAt)}
                    onChange={(e) => {
                      const value = e.target.value;
                      const startsAt = value ? `${value}:00-05:00` : "";
                      const labels = labelsFromStartsAt(startsAt);
                      setDraft((d) => ({
                        ...d,
                        startsAt,
                        dateLabel: d.dateLabel.trim()
                          ? d.dateLabel
                          : labels.dateLabel,
                        timeLabel: d.timeLabel?.trim()
                          ? d.timeLabel
                          : labels.timeLabel,
                      }));
                    }}
                  />
                  <p className="mt-1 text-[11px] text-gals-muted">
                    Si dejás vacíos Fecha/Hora label, se completan solos.
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Lugar</label>
                  <input
                    className={inputClass}
                    value={draft.place}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, place: e.target.value }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Subhead</label>
                  <textarea
                    className={`${inputClass} min-h-[72px]`}
                    value={draft.subhead}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, subhead: e.target.value }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Concepto</label>
                  <textarea
                    className={`${inputClass} min-h-[72px]`}
                    value={draft.concept ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, concept: e.target.value }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    Includes (una por línea: emoji + texto)
                  </label>
                  <textarea
                    className={`${inputClass} min-h-[100px] font-mono text-xs`}
                    value={draft.whyText}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, whyText: e.target.value }))
                    }
                    placeholder="🧘 Clase de Pilates"
                  />
                </div>
                <EventCoverPicker
                  value={draft.image}
                  onChange={(image) => setDraft((d) => ({ ...d, image }))}
                  labelClass={labelClass}
                  inputClass={inputClass}
                />
                <div>
                  <label className={labelClass}>CTA</label>
                  <input
                    className={inputClass}
                    value={draft.cta}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, cta: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Precio</label>
                  <input
                    className={inputClass}
                    placeholder="$120.000 o Gratis"
                    value={draft.price ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, price: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Monto MP (COP)</label>
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    step={1000}
                    placeholder="Ej. 60000 — vacío = sin checkout"
                    value={draft.priceAmount ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        priceAmount: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>
                {draft.kind === "free" ? (
                  <div>
                    <label className={labelClass}>Bewe after (solo gratis)</label>
                    <select
                      className={inputClass}
                      value={draft.beweAfter}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          beweAfter: e.target.value as "form" | "packs",
                        }))
                      }
                    >
                      <option value="form">Formulario</option>
                      <option value="packs">Packs</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className={labelClass}>Cobro</label>
                    <p className="rounded-xl border border-gals-blue-deep/10 bg-gals-blue-soft/50 px-3.5 py-2.5 text-sm text-gals-ink">
                      Con Monto MP → Checkout Mercado Pago. Sin monto → WhatsApp.
                    </p>
                  </div>
                )}
                <div>
                  <label className={labelClass}>Cupos</label>
                  <input
                    className={inputClass}
                    type="number"
                    min={1}
                    value={draft.capacity ?? ""}
                    placeholder="Opcional"
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        capacity: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-wrap items-end gap-5 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-gals-ink">
                    <input
                      type="checkbox"
                      checked={!!draft.featured}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          featured: e.target.checked,
                        }))
                      }
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gals-ink">
                    <input
                      type="checkbox"
                      checked={!!draft.showPrice}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          showPrice: e.target.checked,
                        }))
                      }
                    />
                    Mostrar precio en tarjeta
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gals-ink">
                    <input
                      type="checkbox"
                      checked={draft.published}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          published: e.target.checked,
                        }))
                      }
                    />
                    Publicado
                  </label>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            className="fixed right-4 bottom-4 z-50 rounded-full bg-gals-blue-deep px-4 py-2.5 text-[11px] font-semibold tracking-wide text-white uppercase shadow-lg"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
