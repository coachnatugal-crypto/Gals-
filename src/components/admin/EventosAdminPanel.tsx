"use client";

import { useEffect, useMemo, useState } from "react";
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
  seedRegistrations,
  slugifyId,
  type AdminEventDraft,
  type AdminRegistration,
} from "@/lib/admin-eventos-store";
import type { EventKind, GalsEvent } from "@/lib/eventos";

type Tab = "resumen" | "eventos" | "inscritos" | "editor";

const inputClass =
  "w-full rounded-xl border border-gals-blue-deep/15 bg-white px-3 py-2.5 text-sm text-gals-ink outline-none focus:border-gals-blue-deep/40";
const labelClass = "mb-1 block text-[11px] font-semibold tracking-[0.12em] text-gals-muted uppercase";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-gals-silver/40 bg-white p-4 shadow-[0_8px_24px_rgba(85,104,148,0.06)]">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-gals-muted uppercase">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl tracking-tight text-gals-blue-deep">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-gals-muted">{hint}</p> : null}
    </div>
  );
}

function StatusPill({ status }: { status: AdminRegistration["status"] }) {
  const styles = {
    nuevo: "bg-gals-blue-soft text-gals-blue-deep",
    confirmado: "bg-gals-green/20 text-gals-ink",
    cancelado: "bg-gals-ink/10 text-gals-muted",
  } as const;
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export function EventosAdminPanel() {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("resumen");
  const [events, setEvents] = useState<GalsEvent[]>([]);
  const [regs, setRegs] = useState<AdminRegistration[]>([]);
  const [draft, setDraft] = useState<AdminEventDraft>(() => emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterKind, setFilterKind] = useState<"all" | EventKind>("all");
  const [filterEventId, setFilterEventId] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | AdminRegistration["status"]>("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const seeded = seedEvents();
    const storedEvents = loadJson<GalsEvent[] | null>(ADMIN_EVENTS_KEY, null);
    const nextEvents = storedEvents?.length ? storedEvents : seeded;
    setEvents(nextEvents);

    const storedRegs = loadJson<AdminRegistration[] | null>(ADMIN_REGS_KEY, null);
    setRegs(storedRegs?.length ? storedRegs : seedRegistrations(nextEvents));
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
    const id = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

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
      .filter((r) => (filterEventId === "all" ? true : r.eventId === filterEventId))
      .filter((r) => (filterStatus === "all" ? true : r.status === filterStatus))
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
      flash("La fecha/hora (startsAt) es obligatoria");
      return;
    }

    const id = editingId ?? (draft.id.trim() || slugifyId(draft.title));
    const next = draftToEvent({ ...draft, id });

    setEvents((prev) => {
      const without = prev.filter((e) => e.id !== id);
      // Solo un featured a la vez
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
    if (!window.confirm("¿Eliminar este evento del panel?")) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setRegs((prev) => prev.filter((r) => r.eventId !== id));
    flash("Evento eliminado");
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
  }

  function toggleFeatured(id: string) {
    setEvents((prev) =>
      prev.map((e) => ({
        ...e,
        featured: e.id === id ? !e.featured : false,
      })),
    );
  }

  function toggleShowPrice(id: string) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, showPrice: !e.showPrice } : e,
      ),
    );
    flash("Visibilidad del precio actualizada");
  }

  function addMockClient() {
    const eventId =
      filterEventId !== "all"
        ? filterEventId
        : events[0]?.id ?? "general";
    const reg: AdminRegistration = {
      id: `reg-${Date.now().toString(36)}`,
      eventId,
      name: "Nueva interesada",
      whatsapp: "+57 300 000 0000",
      source: "admin-manual",
      status: "nuevo",
      createdAt: new Date().toISOString(),
    };
    setRegs((prev) => [reg, ...prev]);
    flash("Inscrita agregada (demo)");
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

  function resetSeed() {
    if (
      !window.confirm(
        "¿Restablecer eventos e inscritos a los datos de ejemplo?",
      )
    )
      return;
    const seeded = seedEvents();
    setEvents(seeded);
    setRegs(seedRegistrations(seeded));
    flash("Datos de ejemplo restaurados");
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "resumen", label: "Resumen" },
    { id: "eventos", label: "Eventos" },
    { id: "inscritos", label: "Inscritos" },
    { id: "editor", label: editingId ? "Editar" : "Crear" },
  ];

  if (!ready) {
    return (
      <div className="flex min-h-[50svh] items-center justify-center text-sm text-gals-muted">
        Cargando panel…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 border-b border-gals-silver/40 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-gals-blue-deep uppercase">
            Admin · demo visual
          </p>
          <h1 className="mt-1 font-display text-3xl tracking-tight text-gals-ink uppercase md:text-4xl">
            Panel de eventos
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gals-muted">
            Gestiona agenda e inscritos aquí. Los cambios viven en este
            navegador (localStorage). Luego lo conectamos a Supabase.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/eventos"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-gals-blue-deep/20 px-4 py-2 text-xs font-semibold tracking-wide text-gals-blue-deep uppercase"
          >
            Ver landing
          </a>
          <button
            type="button"
            onClick={() => openCreate("paid")}
            className="rounded-full bg-gals-blue-deep px-4 py-2 text-xs font-bold tracking-wide text-white uppercase"
          >
            + Crear evento
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition ${
              tab === t.id
                ? "bg-gals-blue-deep text-white"
                : "bg-white text-gals-muted ring-1 ring-gals-silver/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "resumen" ? (
        <div className="mt-8 space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Eventos" value={events.length} hint="En el panel" />
            <StatCard
              label="Próximos"
              value={upcomingCount}
              hint="Fecha aún vigente"
            />
            <StatCard
              label="Inscritos"
              value={regs.filter((r) => r.status !== "cancelado").length}
              hint="Activos + nuevos"
            />
            <StatCard
              label="Nuevos"
              value={regs.filter((r) => r.status === "nuevo").length}
              hint="Por confirmar"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-gals-silver/40 bg-white p-5">
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
              <ul className="mt-4 space-y-3">
                {filteredEvents.slice(0, 5).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-3 border-b border-gals-silver/30 pb-3 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gals-ink">
                        {e.title}
                      </p>
                      <p className="text-xs text-gals-muted">
                        {e.dateLabel}
                        {e.timeLabel ? ` · ${e.timeLabel}` : ""} ·{" "}
                        {e.kind === "free" ? "Gratis" : "Pago"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEdit(e)}
                      className="shrink-0 text-xs font-semibold text-gals-blue-deep"
                    >
                      Editar
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gals-silver/40 bg-white p-5">
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
              <ul className="mt-4 space-y-3">
                {regs.slice(0, 5).map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 border-b border-gals-silver/30 pb-3 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gals-ink">
                        {r.name}
                      </p>
                      <p className="truncate text-xs text-gals-muted">
                        {eventTitle(r.eventId)} · {r.whatsapp}
                      </p>
                    </div>
                    <StatusPill status={r.status} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-gals-blue-deep/25 bg-gals-blue-soft/40 p-5 text-sm text-gals-ink">
            <p className="font-semibold">Modo visual</p>
            <p className="mt-1 text-gals-muted">
              Esta landing pública (`/eventos`) sigue leyendo el catálogo fijo
              en código. El panel es el borrador de CMS: cuando conectemos
              Supabase, ambos usarán la misma fuente.
            </p>
            <button
              type="button"
              onClick={resetSeed}
              className="mt-3 text-xs font-semibold text-gals-blue-deep underline-offset-2 hover:underline"
            >
              Restablecer datos de ejemplo
            </button>
          </div>
        </div>
      ) : null}

      {tab === "eventos" ? (
        <div className="mt-8 space-y-4">
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
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    filterKind === id
                      ? "bg-gals-blue-deep text-white"
                      : "bg-white text-gals-muted ring-1 ring-gals-silver/50"
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

          <div className="overflow-hidden rounded-2xl border border-gals-silver/40 bg-white">
            <div className="hidden grid-cols-[1.2fr_0.7fr_0.5fr_0.9fr] gap-3 border-b border-gals-silver/40 bg-gals-mist/60 px-4 py-3 text-[10px] font-semibold tracking-[0.14em] text-gals-muted uppercase md:grid">
              <span>Evento</span>
              <span>Fecha</span>
              <span>Tipo</span>
              <span>Acciones</span>
            </div>
            <ul>
              {filteredEvents.map((e) => (
                <li
                  key={e.id}
                  className="grid gap-3 border-b border-gals-silver/30 px-4 py-4 last:border-0 md:grid-cols-[1.2fr_0.7fr_0.5fr_0.9fr] md:items-center"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={e.image}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gals-ink">
                        {e.title}
                        {e.featured ? (
                          <span className="ml-2 rounded-full bg-gals-blue-soft px-2 py-0.5 text-[10px] font-bold text-gals-blue-deep uppercase">
                            Featured
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-gals-muted">
                        {e.headline}
                        {e.price ? (
                          <span
                            className={`ml-2 font-semibold ${
                              e.showPrice
                                ? "text-gals-blue-deep"
                                : "text-gals-muted line-through opacity-60"
                            }`}
                          >
                            {e.price}
                            {!e.showPrice ? " · oculto" : ""}
                          </span>
                        ) : (
                          <span className="ml-2 text-gals-muted">
                            · sin precio
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gals-ink">
                    <p>{e.dateLabel}</p>
                    <p className="text-xs text-gals-muted">
                      {e.timeLabel ?? "—"}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                        e.kind === "free"
                          ? "bg-gals-green/20 text-gals-ink"
                          : "bg-gals-blue-soft text-gals-blue-deep"
                      }`}
                    >
                      {e.kind === "free" ? "Gratis" : "Pago"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(e)}
                      className="rounded-full bg-gals-blue-deep px-3 py-1.5 text-[11px] font-semibold text-white uppercase"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFeatured(e.id)}
                      className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-gals-blue-deep ring-1 ring-gals-silver/60 uppercase"
                    >
                      {e.featured ? "Quitar ★" : "★ Featured"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleShowPrice(e.id)}
                      className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-gals-blue-deep ring-1 ring-gals-silver/60 uppercase"
                    >
                      {e.showPrice ? "Ocultar $" : "Mostrar $"}
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateEvent(e)}
                      className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-gals-muted ring-1 ring-gals-silver/60 uppercase"
                    >
                      Copiar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeEvent(e.id)}
                      className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-red-700/80 ring-1 ring-red-200 uppercase"
                    >
                      Borrar
                    </button>
                  </div>
                </li>
              ))}
              {filteredEvents.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-gals-muted">
                  No hay eventos con ese filtro.
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "inscritos" ? (
        <div className="mt-8 space-y-4">
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
                    e.target.value as "all" | AdminRegistration["status"],
                  )
                }
                className={`${inputClass} max-w-[160px]`}
              >
                <option value="all">Todos los estados</option>
                <option value="nuevo">Nuevo</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar nombre o WhatsApp…"
                className={`${inputClass} lg:max-w-xs`}
              />
            </div>
            <button
              type="button"
              onClick={addMockClient}
              className="rounded-full bg-gals-blue-deep px-4 py-2 text-xs font-bold tracking-wide text-white uppercase"
            >
              + Agregar inscrita
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gals-silver/40 bg-white">
            <ul>
              {filteredRegs.map((r) => (
                <li
                  key={r.id}
                  className="grid gap-3 border-b border-gals-silver/30 px-4 py-4 last:border-0 md:grid-cols-[1.1fr_1fr_0.7fr_1fr] md:items-center"
                >
                  <div>
                    <p className="font-semibold text-gals-ink">{r.name}</p>
                    <p className="text-xs text-gals-muted">{r.whatsapp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gals-ink">{eventTitle(r.eventId)}</p>
                    <p className="text-xs text-gals-muted">
                      {formatWhen(r.createdAt)} · {r.source}
                    </p>
                  </div>
                  <div>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                            : "bg-gals-mist text-gals-muted"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => removeReg(r.id)}
                      className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-red-700/80 uppercase"
                    >
                      Borrar
                    </button>
                  </div>
                </li>
              ))}
              {filteredRegs.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-gals-muted">
                  No hay inscritos con ese filtro.
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "editor" ? (
        <div className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl uppercase text-gals-blue-deep">
                {editingId ? "Editar evento" : "Crear evento"}
              </h2>
              <p className="text-sm text-gals-muted">
                Campos esenciales del catálogo visual. Luego se mapean 1:1 a
                Supabase.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab("eventos")}
                className="rounded-full border border-gals-blue-deep/20 px-4 py-2 text-xs font-semibold uppercase"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="rounded-full bg-gals-blue-deep px-5 py-2 text-xs font-bold text-white uppercase"
              >
                Guardar
              </button>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-gals-silver/40 bg-white p-5 md:grid-cols-2">
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
                    beweAfter: e.target.value === "free" ? "form" : "packs",
                    cta:
                      e.target.value === "free"
                        ? "Reservar mi cupo gratis"
                        : "Reservar mi cupo",
                    price:
                      e.target.value === "free"
                        ? "Gratis"
                        : d.price && d.price !== "Gratis"
                          ? d.price
                          : "$80.000",
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
              <label className={labelClass}>
                Fecha ISO Bogotá (startsAt)
              </label>
              <input
                className={inputClass}
                type="datetime-local"
                value={
                  draft.startsAt
                    ? draft.startsAt.slice(0, 16)
                    : ""
                }
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
                className={`${inputClass} min-h-[110px] font-mono text-xs`}
                value={draft.whyText}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, whyText: e.target.value }))
                }
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
              <label className={labelClass}>Precio (en tarjeta)</label>
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
              <label className={labelClass}>Cupos (demo)</label>
              <input
                className={inputClass}
                type="number"
                min={1}
                value={draft.capacity ?? 20}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    capacity: Number(e.target.value) || 20,
                  }))
                }
              />
            </div>
            <div className="flex flex-wrap items-end gap-4 md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-gals-ink">
                <input
                  type="checkbox"
                  checked={!!draft.featured}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, featured: e.target.checked }))
                  }
                />
                Featured (protagonista)
              </label>
              <label className="flex items-center gap-2 text-sm text-gals-ink">
                <input
                  type="checkbox"
                  checked={!!draft.showPrice}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, showPrice: e.target.checked }))
                  }
                />
                Mostrar precio en tarjeta
              </label>
              <label className="flex items-center gap-2 text-sm text-gals-ink">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, published: e.target.checked }))
                  }
                />
                Publicado (demo)
              </label>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed right-4 bottom-4 z-50 rounded-full bg-gals-blue-deep px-4 py-2.5 text-xs font-semibold tracking-wide text-white uppercase shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
