"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ADMIN_EVENTS_KEY,
  ADMIN_REGS_KEY,
  draftToEvent,
  emptyDraft,
  eventToDraft,
  formatWhen,
  loadJson,
  saveJson,
  seedEvents,
  slugifyId,
  type AdminEventDraft,
  type AdminRegistration,
} from "@/lib/admin-eventos-store";
import type { EventKind, GalsEvent } from "@/lib/eventos";

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
  const styles = {
    nuevo: "bg-gals-blue-soft text-gals-blue-deep",
    confirmado: "bg-gals-green-soft text-gals-ink",
    cancelado: "bg-gals-ink/8 text-gals-muted",
  } as const;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gals-blue-deep/20 bg-white/50 px-6 py-14 text-center">
      <p className="font-display text-lg uppercase text-gals-blue-deep">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gals-muted">{body}</p>
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

  useEffect(() => {
    const seeded = seedEvents();
    const storedEvents = loadJson<GalsEvent[] | null>(ADMIN_EVENTS_KEY, null);
    setEvents(storedEvents?.length ? storedEvents : seeded);
    // Solo inscritos reales guardados — sin datos inventados
    setRegs(loadJson<AdminRegistration[]>(ADMIN_REGS_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveJson(ADMIN_EVENTS_KEY, events);
  }, [events, ready]);

  useEffect(() => {
    if (!ready) return;
    saveJson(ADMIN_REGS_KEY, regs);
  }, [regs, ready]);

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

  const upcomingCount = useMemo(() => {
    const now = Date.now();
    return events.filter((e) => new Date(e.startsAt).getTime() >= now).length;
  }, [events]);

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
          r.whatsapp.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [regs, filterEventId, filterStatus, search]);

  const eventTitle = (id: string) =>
    events.find((e) => e.id === id)?.title ?? id;

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

  function saveDraft() {
    if (!draft.title.trim()) {
      flash("El título es obligatorio");
      return;
    }
    if (!draft.startsAt.trim()) {
      flash("La fecha/hora es obligatoria");
      return;
    }

    const id = editingId ?? (draft.id.trim() || slugifyId(draft.title));
    const next = draftToEvent({ ...draft, id });

    setEvents((prev) => {
      const without = prev.filter((e) => e.id !== id);
      const normalized = next.featured
        ? without.map((e) => ({ ...e, featured: false }))
        : without;
      return [...normalized, next];
    });

    flash(editingId ? "Evento actualizado" : "Evento creado");
    setEditingId(id);
    setTab("eventos");
  }

  function removeEvent(id: string) {
    if (!window.confirm("¿Eliminar este evento?")) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setRegs((prev) => prev.filter((r) => r.eventId !== id));
    flash("Evento eliminado");
    setMenuId(null);
  }

  function duplicateEvent(event: GalsEvent) {
    const copy: GalsEvent = {
      ...event,
      id: slugifyId(`${event.title}-copia`),
      title: `${event.title} (copia)`,
      featured: false,
    };
    setEvents((prev) => [...prev, copy]);
    flash("Evento duplicado");
    setMenuId(null);
  }

  function toggleFeatured(id: string) {
    setEvents((prev) =>
      prev.map((e) => ({
        ...e,
        featured: e.id === id ? !e.featured : false,
      })),
    );
    setMenuId(null);
  }

  function toggleShowPrice(id: string) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, showPrice: !e.showPrice } : e,
      ),
    );
    setMenuId(null);
  }

  function addRegistration() {
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
    const reg: AdminRegistration = {
      id: `reg-${Date.now().toString(36)}`,
      eventId,
      name,
      whatsapp,
      source: "admin",
      status: "nuevo",
      createdAt: new Date().toISOString(),
    };
    setRegs((prev) => [reg, ...prev]);
    setRegForm({ name: "", whatsapp: "", eventId });
    flash("Inscrita agregada");
  }

  function updateRegStatus(id: string, status: AdminRegistration["status"]) {
    setRegs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  }

  function removeReg(id: string) {
    setRegs((prev) => prev.filter((r) => r.id !== id));
    flash("Inscripción eliminada");
  }

  function resetCatalog() {
    if (!window.confirm("¿Restablecer la agenda al catálogo del sitio?"))
      return;
    setEvents(seedEvents());
    flash("Agenda restablecida");
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
        Cargando panel…
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
              Gestiona la agenda y las inscritos. Los cambios se guardan en este
              navegador hasta conectar Supabase.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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
                            </p>
                          </div>
                          <StatusPill status={r.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={resetCatalog}
                className="text-xs font-semibold text-gals-muted underline-offset-2 hover:text-gals-blue-deep hover:underline"
              >
                Restablecer agenda al catálogo del sitio
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
                  body="No hay eventos con ese filtro. Crea uno o restablece el catálogo."
                />
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
                                        fn: () => toggleFeatured(e.id),
                                      },
                                      {
                                        label: e.showPrice
                                          ? "Ocultar precio"
                                          : "Mostrar precio",
                                        fn: () => toggleShowPrice(e.id),
                                      },
                                      {
                                        label: "Duplicar",
                                        fn: () => duplicateEvent(e),
                                      },
                                      {
                                        label: "Eliminar",
                                        fn: () => removeEvent(e.id),
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
                      onClick={addRegistration}
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
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar nombre o WhatsApp…"
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
                            ["nuevo", "confirmado", "cancelado"] as const
                          ).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => updateRegStatus(r.id, s)}
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                                r.status === s
                                  ? "bg-gals-blue-deep text-white"
                                  : "bg-gals-blue-soft/60 text-gals-muted"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => removeReg(r.id)}
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
                    Completa los campos de la agenda.
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
                    onClick={saveDraft}
                    className="rounded-full bg-gals-blue-deep px-5 py-2 text-[11px] font-bold text-white uppercase shadow-md"
                  >
                    Guardar
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
                            : "Reservar mi cupo",
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
                    value={draft.startsAt ? draft.startsAt.slice(0, 16) : ""}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        startsAt: e.target.value
                          ? `${e.target.value}:00-05:00`
                          : "",
                      }))
                    }
                  />
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
                <div>
                  <label className={labelClass}>Imagen (path)</label>
                  <input
                    className={inputClass}
                    value={draft.image}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, image: e.target.value }))
                    }
                  />
                </div>
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
                  <label className={labelClass}>Bewe after</label>
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
