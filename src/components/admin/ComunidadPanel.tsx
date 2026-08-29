"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { BeweMember, CommunityPlan } from "@/lib/bewe-members";
import { PanelGuide } from "@/components/admin/AdminHelperClippy";

type Props = {
  flash: (msg: string) => void;
};

type LinkPreview = {
  id: string;
  name: string;
  email: string;
  planLabel: string;
  groupName: string;
  link: string | null;
  alreadySent: boolean;
  ok: boolean;
  issue: string | null;
};

function planBadge(m: BeweMember) {
  if (m.plan === "ilimitada") return "Ilimitado · VIP";
  if (m.plan === "transformacion") return "Expande · Plus";
  if (m.planLabel) return m.planLabel;
  return "Sin comunidad exclusiva";
}

export function ComunidadPanel({ flash }: Props) {
  const [members, setMembers] = useState<BeweMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [beweOk, setBeweOk] = useState(true);
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previews, setPreviews] = useState<LinkPreview[]>([]);
  const [previewReady, setPreviewReady] = useState(0);
  const [previewIssues, setPreviewIssues] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (!eligibleOnly) qs.set("eligible", "0");
      if (pendingOnly) qs.set("pending", "1");
      const res = await fetch(`/api/admin/comunidad?${qs.toString()}`);
      const data = (await res.json()) as {
        ok: boolean;
        members?: BeweMember[];
        beweConfigured?: boolean;
        error?: string;
      };
      if (!data.ok) throw new Error(data.error || "No se pudo cargar");
      setMembers(data.members ?? []);
      setBeweOk(Boolean(data.beweConfigured));
      setSelected(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [eligibleOnly, pendingOnly]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.planLabel ?? "").toLowerCase().includes(q),
    );
  }, [members, query]);

  const eligibleVisible = useMemo(
    () => visible.filter((m) => Boolean(m.waTier)),
    [visible],
  );

  const stats = useMemo(() => {
    const plus = members.filter((m) => m.plan === "transformacion").length;
    const vip = members.filter((m) => m.plan === "ilimitada").length;
    const pendingMail = members.filter(
      (m) => Boolean(m.waTier) && !m.emailSentAt,
    ).length;
    return {
      total: members.length,
      plus,
      vip,
      pendingMail,
    };
  }, [members]);

  const selectedEligibleIds = useMemo(
    () =>
      [...selected].filter((id) =>
        members.some((m) => m.id === id && m.waTier),
      ),
    [selected, members],
  );

  async function syncNow() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/comunidad/sync", { method: "POST" });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        synced?: number;
        eligible?: number;
        ticketsWarning?: string;
      };
      if (!data.ok) throw new Error(data.error || "Sync falló");
      flash(
        `Bewe sync: ${data.synced ?? 0} contactos · ${data.eligible ?? 0} elegibles`,
      );
      if (data.ticketsWarning) flash(data.ticketsWarning);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error sync");
    } finally {
      setBusy(false);
    }
  }

  async function importCsv(file: File) {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/comunidad/import", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        imported?: number;
        withPlanColumn?: number;
        plansUpdated?: number;
        plus?: number;
        vip?: number;
        skippedNoEmail?: number;
        skippedInactive?: number;
        detectedPlanColumn?: boolean;
      };
      if (!data.ok) throw new Error(data.error || "Import falló");

      if (data.detectedPlanColumn) {
        const omitted = [
          data.skippedNoEmail ? `${data.skippedNoEmail} sin email` : null,
          data.skippedInactive ? `${data.skippedInactive} inactivas` : null,
        ]
          .filter(Boolean)
          .join(", ");
        flash(
          `Suscripciones: ${data.plansUpdated ?? 0} planes · Plus ${data.plus ?? 0} · VIP ${data.vip ?? 0} · ${data.imported ?? 0} filas${
            omitted ? ` · omitidas: ${omitted}` : ""
          }`,
        );
        setEligibleOnly(false);
        setPendingOnly(false);
      } else {
        flash(
          `Clientes: ${data.imported ?? 0} importados (sin columna plan — subí Suscripciones)${
            data.skippedNoEmail ? ` · ${data.skippedNoEmail} sin email` : ""
          }`,
        );
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error import");
    } finally {
      setBusy(false);
    }
  }

  async function changePlan(id: string, plan: CommunityPlan) {
    try {
      const res = await fetch("/api/admin/comunidad/plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, plan }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error || "No se actualizó");
      await load();
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error plan");
    }
  }

  async function openPreview() {
    const ids = selectedEligibleIds;
    if (ids.length === 0) {
      flash("Seleccioná al menos una persona con Plus o VIP");
      return;
    }
    setPreviewLoading(true);
    setPreviewOpen(true);
    setPreviews([]);
    try {
      const res = await fetch("/api/admin/comunidad/preview-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        previews?: LinkPreview[];
        ready?: number;
        withIssues?: number;
      };
      if (!data.ok) throw new Error(data.error || "No se pudo previsualizar");
      setPreviews(data.previews ?? []);
      setPreviewReady(data.ready ?? 0);
      setPreviewIssues(data.withIssues ?? 0);
    } catch (err) {
      setPreviewOpen(false);
      flash(err instanceof Error ? err.message : "Error preview");
    } finally {
      setPreviewLoading(false);
    }
  }

  async function sendSelected(fromPreview = false) {
    let ids = selectedEligibleIds;
    if (fromPreview) {
      ids = previews.filter((p) => p.ok).map((p) => p.id);
    }
    if (ids.length === 0) {
      flash(
        fromPreview
          ? "Ninguna fila lista para enviar (revisá emails / links)"
          : "Seleccioná al menos una persona con Plus o VIP",
      );
      return;
    }

    const alreadySent = members.filter(
      (m) => ids.includes(m.id) && m.emailSentAt,
    ).length;
    if (alreadySent > 0) {
      const ok = window.confirm(
        `${alreadySent} ya recibieron el mail. ¿Reenviar a las ${ids.length} seleccionadas?`,
      );
      if (!ok) return;
    }

    if (!fromPreview) {
      const ok = window.confirm(
        `¿Enviar el link de WhatsApp a ${ids.length} persona${ids.length === 1 ? "" : "s"}? Revisá antes con «Ver links» si dudás.`,
      );
      if (!ok) return;
    } else if (previewIssues > 0) {
      const ok = window.confirm(
        `Hay ${previewIssues} con problema (no se enviarán). ¿Confirmar envío a las ${ids.length} listas?`,
      );
      if (!ok) return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/comunidad/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, onlyPending: false }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        sent?: number;
        failed?: number;
      };
      if (!data.ok) throw new Error(data.error || "Envío falló");
      flash(`Enviados ${data.sent ?? 0} · fallidos ${data.failed ?? 0}`);
      setPreviewOpen(false);
      await load();
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error envío");
    } finally {
      setSending(false);
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllEligible() {
    const allSelected =
      eligibleVisible.length > 0 &&
      eligibleVisible.every((m) => selected.has(m.id));
    if (allSelected) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(eligibleVisible.map((m) => m.id)));
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_18px_50px_rgba(85,104,148,0.1)]">
        <div className="relative overflow-hidden bg-gradient-to-br from-gals-blue-deep via-[#3d4d73] to-gals-blue-mid px-5 py-7 text-white sm:px-8 sm:py-9">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">
            Bewe · WhatsApp
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight uppercase sm:text-4xl">
            Comunidad
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/80">
            Invitá al grupo exclusivo a clientas Expande (Plus) e Ilimitado
            (VIP). Ritual / Starter / 1 Clase se listan sin comunidad exclusiva.
          </p>
          <div className="mt-6 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Lista", stats.total],
              ["Plus", stats.plus],
              ["VIP", stats.vip],
              ["Mail pendiente", stats.pendingMail],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-[10px] tracking-wide text-white/65 uppercase">
                  {label}
                </p>
                <p className="mt-1 font-display text-3xl tabular-nums">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-7">
          {!beweOk ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
              Falta <code className="font-mono">BEWE_API_TOKEN</code> en{" "}
              <code className="font-mono">.env.local</code> para sync por API.
              El import CSV funciona igual.
            </p>
          ) : null}

          <PanelGuide title="Cómo usar este panel">
            <ol className="mt-1 list-decimal space-y-1.5 pl-4">
              <li>
                <span className="font-medium text-gals-ink">Traer datos:</span>{" "}
                sincronizá Bewe o importá el CSV de Suscripciones / Bonos
                (email + plan).
              </li>
              <li>
                <span className="font-medium text-gals-ink">Filtrar:</span>{" "}
                «Solo Plus / VIP» y, si querés, «Solo pendientes de mail».
              </li>
              <li>
                <span className="font-medium text-gals-ink">Revisar:</span>{" "}
                seleccioná filas → «Ver links» para confirmar el invite correcto.
              </li>
              <li>
                <span className="font-medium text-gals-ink">Enviar:</span> desde
                el preview o con «Enviar link». Reciben un correo con acceso al
                grupo.
              </li>
            </ol>
          </PanelGuide>

          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
              {error}
            </p>
          ) : null}

          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
              1 · Actualizar lista
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void syncNow()}
                disabled={busy || !beweOk}
                className="rounded-full bg-gals-blue-deep px-5 py-2.5 text-xs font-bold text-white uppercase disabled:opacity-50"
              >
                {busy ? "Trabajando…" : "Sincronizar Bewe"}
              </button>
              <label className="cursor-pointer rounded-full bg-gals-ink px-5 py-2.5 text-xs font-bold text-white uppercase">
                Importar CSV
                <input
                  type="file"
                  accept=".csv,text/csv,.tsv,text/tab-separated-values"
                  className="hidden"
                  disabled={busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void importCsv(file);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => void load()}
                className="rounded-full bg-gals-blue-soft px-4 py-2.5 text-xs font-bold text-gals-blue-deep uppercase"
              >
                Recargar
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
              2 · Filtrar y buscar
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar nombre o email…"
                className="min-w-[200px] flex-1 rounded-full border border-gals-blue-deep/15 bg-white px-4 py-2 text-sm outline-none focus:border-gals-blue-mid"
              />
              <button
                type="button"
                onClick={() => setEligibleOnly((v) => !v)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  eligibleOnly
                    ? "bg-gals-blue-deep text-white"
                    : "bg-gals-blue-soft/60 text-gals-ink"
                }`}
              >
                Solo Plus / VIP
              </button>
              <button
                type="button"
                onClick={() => setPendingOnly((v) => !v)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  pendingOnly
                    ? "bg-gals-blue-deep text-white"
                    : "bg-gals-blue-soft/60 text-gals-ink"
                }`}
              >
                Solo pendientes de mail
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
              3 · Revisar y enviar
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void openPreview()}
                disabled={previewLoading || selectedEligibleIds.length === 0}
                className="rounded-full border border-gals-blue-deep/25 bg-white px-5 py-2.5 text-xs font-bold text-gals-blue-deep uppercase disabled:opacity-50"
              >
                {previewLoading
                  ? "Cargando…"
                  : `Ver links (${selectedEligibleIds.length})`}
              </button>
              <button
                type="button"
                onClick={() => void sendSelected(false)}
                disabled={sending || selectedEligibleIds.length === 0}
                className="rounded-full bg-gals-blue-mid px-5 py-2.5 text-xs font-bold text-white uppercase disabled:opacity-50"
              >
                {sending
                  ? "Enviando…"
                  : `Enviar link (${selectedEligibleIds.length})`}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-gals-blue-soft/40" />
          ) : visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-gals-blue-deep/20 px-4 py-8 text-center text-sm text-gals-muted">
              No hay miembros con estos filtros. Importá Suscripciones o soltá
              filtros / búsqueda.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl ring-1 ring-gals-blue-deep/10">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gals-blue-soft/50 text-[10px] tracking-wide text-gals-muted uppercase">
                  <tr>
                    <th className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={
                          eligibleVisible.length > 0 &&
                          eligibleVisible.every((m) => selected.has(m.id))
                        }
                        onChange={toggleAllEligible}
                        aria-label="Seleccionar elegibles visibles"
                      />
                    </th>
                    <th className="px-3 py-3">Nombre</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Membresía Bewe</th>
                    <th className="px-3 py-3">Suscripción</th>
                    <th className="px-3 py-3">Grupo WA</th>
                    <th className="px-3 py-3">Mail</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((m) => (
                    <tr
                      key={m.id}
                      className="border-t border-gals-blue-deep/10"
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(m.id)}
                          onChange={() => toggle(m.id)}
                          aria-label={`Seleccionar ${m.name}`}
                          disabled={!m.waTier}
                        />
                      </td>
                      <td className="px-3 py-3 font-medium text-gals-ink">
                        {m.name}
                      </td>
                      <td className="px-3 py-3 text-gals-muted">{m.email}</td>
                      <td className="px-3 py-3">
                        <p className="text-xs font-semibold text-gals-ink">
                          {planBadge(m)}
                        </p>
                        <select
                          className="mt-1 rounded-lg border border-gals-blue-deep/15 bg-white px-2 py-1 text-xs"
                          value={m.plan}
                          onChange={(e) =>
                            void changePlan(
                              m.id,
                              e.target.value as CommunityPlan,
                            )
                          }
                        >
                          <option value="transformacion">
                            Expande (Plus)
                          </option>
                          <option value="ilimitada">Ilimitado (VIP)</option>
                          <option value="unknown">
                            Sin comunidad exclusiva
                          </option>
                        </select>
                      </td>
                      <td className="px-3 py-3 text-xs text-gals-muted whitespace-nowrap">
                        {m.subscribedAt
                          ? new Date(m.subscribedAt).toLocaleDateString(
                              "es-CO",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                      <td className="px-3 py-3 text-xs font-semibold uppercase">
                        {m.waTier ?? "—"}
                      </td>
                      <td className="px-3 py-3 text-xs">
                        {m.emailSentAt
                          ? new Date(m.emailSentAt).toLocaleDateString("es-CO")
                          : m.waTier
                            ? "Pendiente"
                            : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {previewOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-gals-ink/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-links-title"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-gals-blue-deep/10 px-5 py-4">
              <div>
                <h3
                  id="preview-links-title"
                  className="font-display text-lg uppercase text-gals-blue-deep"
                >
                  Links que se van a enviar
                </h3>
                <p className="mt-1 text-xs text-gals-muted">
                  Listos {previewReady}
                  {previewIssues > 0
                    ? ` · ${previewIssues} con problema`
                    : ""}
                  . Revisá el grupo y el URL antes de confirmar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-full px-2 py-1 text-sm text-gals-muted hover:bg-gals-blue-soft/50"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto px-5 py-3">
              {previewLoading ? (
                <div className="h-32 animate-pulse rounded-xl bg-gals-blue-soft/40" />
              ) : previews.length === 0 ? (
                <p className="py-8 text-center text-sm text-gals-muted">
                  Sin filas para mostrar.
                </p>
              ) : (
                <ul className="space-y-3">
                  {previews.map((p) => (
                    <li
                      key={p.id}
                      className={`rounded-xl px-3 py-3 text-sm ring-1 ${
                        p.ok
                          ? "bg-white ring-gals-blue-deep/10"
                          : "bg-amber-50 ring-amber-200"
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-semibold text-gals-ink">{p.name}</p>
                        <span className="text-[10px] font-bold tracking-wide text-gals-blue-deep uppercase">
                          {p.groupName}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gals-muted">
                        {p.email} · {p.planLabel}
                        {p.alreadySent ? " · ya enviaron mail" : ""}
                      </p>
                      {p.issue ? (
                        <p className="mt-2 text-xs font-medium text-amber-900">
                          {p.issue}
                        </p>
                      ) : p.link ? (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block break-all text-xs text-gals-blue-deep underline-offset-2 hover:underline"
                        >
                          {p.link}
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gals-blue-deep/10 px-5 py-4">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-full px-4 py-2 text-xs font-semibold text-gals-muted uppercase"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void sendSelected(true)}
                disabled={
                  sending || previewLoading || previewReady === 0
                }
                className="rounded-full bg-gals-blue-deep px-5 py-2.5 text-xs font-bold text-white uppercase disabled:opacity-50"
              >
                {sending
                  ? "Enviando…"
                  : `Confirmar envío (${previewReady})`}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
