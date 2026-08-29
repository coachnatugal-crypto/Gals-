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
import { AdminHelperClippy } from "@/components/admin/AdminHelperClippy";
import { ComunidadPanel } from "@/components/admin/ComunidadPanel";

type Tab =
  | "resumen"
  | "eventos"
  | "inscritos"
  | "correos"
  | "comunidad"
  | "editor";

const VENUE_STUDIO =
  "GAL'S Studio · Calle 97 #10-28, Chicó Reservado, Bogotá";
const VENUE_OUTDOOR = "Aire libre · Bogotá";

const BULK_EMAIL_TEMPLATES = [
  {
    id: "recordatorio",
    label: "Recordatorio",
    hint: "Un día antes",
    subject: "Recordatorio · {{evento}} te espera en GAL'S",
    ctaTarget: "event" as const,
    ctaLabel: "Ver el evento",
    ctaUrl: "",
    message: `{{nombre}}, te escribimos para recordarte que ya casi es el día de {{evento}}.

Guardá tu lugar, llegá con tiempo y traé ganas de moverte.

Si tenés alguna duda, respondé este correo o escribinos por WhatsApp.

Nos vemos pronto,
GAL'S`,
  },
  {
    id: "manana",
    label: "Mañana es el día",
    hint: "Víspera",
    subject: "Mañana · {{evento}}",
    ctaTarget: "event" as const,
    ctaLabel: "Ver el evento",
    ctaUrl: "",
    message: `{{nombre}}, mañana nos vemos en {{evento}}.

Tip rápido: llegá unos minutos antes, traé agua y ropa cómoda.

Estamos listas para recibirte.

Con cariño,
GAL'S`,
  },
  {
    id: "gracias",
    label: "Gracias por venir",
    hint: "Post evento",
    subject: "Gracias por vivir {{evento}} con nosotras",
    ctaTarget: "custom" as const,
    ctaLabel: "Ver próximos eventos",
    ctaUrl: "/eventos#agenda",
    message: `{{nombre}}, gracias por sumarte a {{evento}}.

Ojalá te hayas sentido cuidada, movida y en comunidad.

Si querés seguir el camino GAL'S, te esperamos en clase y en nuestros próximos encuentros.

Un abrazo,
GAL'S`,
  },
  {
    id: "pago",
    label: "Pago pendiente",
    hint: "Cobro",
    subject: "Tu cupo en {{evento}} · falta completar el pago",
    ctaTarget: "event" as const,
    ctaLabel: "Completar inscripción",
    ctaUrl: "",
    message: `{{nombre}}, quedaste inscrita en {{evento}}, pero todavía no vemos el pago confirmado.

Cuando completes el pago, tu cupo queda asegurado.

Si ya pagaste, escribinos y lo revisamos juntas.

GAL'S`,
  },
  {
    id: "info",
    label: "Info práctica",
    hint: "Lugar y hora",
    subject: "Info práctica · {{evento}}",
    ctaTarget: "event" as const,
    ctaLabel: "Ver el evento",
    ctaUrl: "",
    message: `{{nombre}}, te compartimos lo esencial para {{evento}}:

• Fecha: {{fecha}}
• Hora: {{hora}}
• Lugar: {{lugar}}
• Traé mat si lo tenés (si no, te ayudamos en el studio)

Cualquier duda, estamos.

GAL'S`,
  },
  {
    id: "cupos",
    label: "Quedan cupos",
    hint: "Urgencia suave",
    subject: "Todavía hay lugar en {{evento}}",
    ctaTarget: "event" as const,
    ctaLabel: "Reservar cupo",
    ctaUrl: "",
    message: `{{nombre}}, queríamos avisarte: todavía hay cupos para {{evento}}.

Si querés venir, aseguralo pronto para no quedarte afuera.

Te esperamos,
GAL'S`,
  },
] as const;

function applyBulkTemplate(
  template: (typeof BULK_EMAIL_TEMPLATES)[number],
  eventTitle: string,
) {
  const title = eventTitle.trim() || "tu evento GAL'S";
  return {
    subject: template.subject.replaceAll("{{evento}}", title),
    message: template.message.replaceAll("{{evento}}", title),
  };
}

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
    pendiente_pago: "bg-amber-100 text-amber-900 ring-1 ring-amber-200",
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

function Chip({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "blue" | "green" | "amber" | "ink";
}) {
  const tones = {
    muted: "bg-gals-ink/6 text-gals-muted",
    blue: "bg-gals-blue-soft text-gals-blue-deep",
    green: "bg-gals-green-soft text-gals-ink",
    amber: "bg-amber-100 text-amber-900",
    ink: "bg-gals-blue-deep text-white",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${tones[tone]}`}
    >
      {children}
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

function SectionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_12px_40px_rgba(85,104,148,0.06)] backdrop-blur-sm md:p-6">
      <div className="mb-4 border-b border-gals-blue-deep/8 pb-3">
        <h3 className="font-display text-lg uppercase text-gals-blue-deep">
          {title}
        </h3>
        {hint ? <p className="mt-1 text-xs text-gals-muted">{hint}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

function exportRegsCsv(
  rows: AdminRegistration[],
  eventTitle: (id: string) => string,
) {
  const header = ["nombre", "email", "whatsapp", "evento", "estado", "fecha"];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        r.name,
        r.email ?? "",
        r.whatsapp,
        eventTitle(r.eventId),
        r.status,
        r.createdAt,
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(","),
    ),
  ];
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gals-inscritos-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function EventosAdminPanel() {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("eventos");
  const [events, setEvents] = useState<GalsEvent[]>([]);
  const [regs, setRegs] = useState<AdminRegistration[]>([]);
  const [draft, setDraft] = useState<AdminEventDraft>(() => emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterKind, setFilterKind] = useState<"all" | EventKind>("all");
  const [filterTodayOnly, setFilterTodayOnly] = useState(false);
  const [filterEventId, setFilterEventId] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | AdminRegistration["status"]
  >("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [headerMoreOpen, setHeaderMoreOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "event" | "reg";
    id: string;
    label: string;
  } | null>(null);
  const [testEmailOpen, setTestEmailOpen] = useState(false);
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    eventId: "",
  });

  const [saving, setSaving] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [testName, setTestName] = useState("Naty");
  const [testEventId, setTestEventId] = useState("");
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [emailPreviewHtml, setEmailPreviewHtml] = useState<string | null>(null);
  const [emailPreviewSubject, setEmailPreviewSubject] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [bulkEventId, setBulkEventId] = useState("");
  const [bulkStatus, setBulkStatus] = useState<
    "all" | AdminRegistration["status"]
  >("all");
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [sendingBulk, setSendingBulk] = useState(false);
  const [bulkExtraEmail, setBulkExtraEmail] = useState("");
  const [bulkExtraName, setBulkExtraName] = useState("");
  const [sendingBulkExtra, setSendingBulkExtra] = useState(false);
  const [bulkDesign, setBulkDesign] = useState({
    badge: "Para ti",
    accent: "#8799c4",
    showLogo: true,
    showCover: true,
    coverUrl: "",
    showDetails: true,
    ctaLabel: "Reservar cupo",
    ctaTarget: "event" as "event" | "whatsapp" | "custom",
    ctaUrl: "",
    showWhatsAppLink: true,
    signOff: "Con cariño,\nGAL'S Studio",
  });
  const [loadingBulkPreview, setLoadingBulkPreview] = useState(false);

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
          throw new Error(evData.error || "No se pudieron cargar eventos");
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
    const ms = /error|no se pudo|inválid/i.test(toast) ? 4200 : 2800;
    const id = window.setTimeout(() => setToast(null), ms);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    const close = () => {
      setMenuId(null);
      setHeaderMoreOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const [nowTs] = useState(() => Date.now());

  const regCountByEvent = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of regs) {
      if (r.status === "cancelado") continue;
      map.set(r.eventId, (map.get(r.eventId) ?? 0) + 1);
    }
    return map;
  }, [regs]);

  const publishedCount = useMemo(
    () => events.filter((e) => e.published !== false).length,
    [events],
  );

  const upcomingCount = useMemo(
    () =>
      events.filter((e) => new Date(e.startsAt).getTime() >= nowTs).length,
    [events, nowTs],
  );

  const pendingPayCount = useMemo(
    () => regs.filter((r) => r.status === "pendiente_pago").length,
    [regs],
  );

  const fullCapacityCount = useMemo(() => {
    return events.filter((e) => {
      if (!e.capacity || e.capacity <= 0) return false;
      return (regCountByEvent.get(e.id) ?? 0) >= e.capacity;
    }).length;
  }, [events, regCountByEvent]);

  const attentionItems = useMemo(() => {
    const items: { id: string; text: string; action?: () => void }[] = [];
    for (const e of events) {
      if (
        e.kind === "paid" &&
        !e.priceAmount &&
        new Date(e.startsAt).getTime() >= nowTs
      ) {
        items.push({
          id: `price-${e.id}`,
          text: `${e.title}: pago sin Monto MP (irá a WhatsApp)`,
          action: () => openEdit(e),
        });
      }
      if (
        e.published === false &&
        new Date(e.startsAt).getTime() >= nowTs &&
        new Date(e.startsAt).getTime() - nowTs < 1000 * 60 * 60 * 24 * 14
      ) {
        items.push({
          id: `draft-${e.id}`,
          text: `${e.title}: borrador con fecha cercana`,
          action: () => openEdit(e),
        });
      }
    }
    if (pendingPayCount > 0) {
      items.push({
        id: "pending-pay",
        text: `${pendingPayCount} inscripción(es) pendiente de pago`,
        action: () => {
          setFilterStatus("pendiente_pago");
          setTab("inscritos");
        },
      });
    }
    return items.slice(0, 8);
    // openEdit is stable enough via closure; avoid eslint noise
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, nowTs, pendingPayCount]);

  const filteredEvents = useMemo(() => {
    const todayKey = new Date(nowTs).toDateString();
    return events
      .filter((e) => (filterKind === "all" ? true : e.kind === filterKind))
      .filter((e) => {
        if (!filterTodayOnly) return true;
        return new Date(e.startsAt).toDateString() === todayKey;
      })
      .filter((e) => {
        if (!search.trim() || tab === "inscritos") return true;
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
  }, [events, filterKind, filterTodayOnly, search, tab, nowTs]);

  const filteredRegs = useMemo(() => {
    return regs
      .filter((r) =>
        filterEventId === "all" ? true : r.eventId === filterEventId,
      )
      .filter((r) =>
        filterStatus === "all" ? true : r.status === filterStatus,
      )
      .filter((r) => {
        if (!search.trim() || tab === "eventos") return true;
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
  }, [regs, filterEventId, filterStatus, search, tab]);

  const bulkRecipients = useMemo(() => {
    const eventId = bulkEventId || events[0]?.id || "";
    if (!eventId) return [];
    const list = regs.filter((r) => {
      if (r.eventId !== eventId) return false;
      if (r.status === "cancelado") return false;
      if (bulkStatus !== "all" && r.status !== bulkStatus) return false;
      const email = r.email?.trim().toLowerCase() ?? "";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    });
    const seen = new Set<string>();
    return list.filter((r) => {
      const email = r.email!.trim().toLowerCase();
      if (seen.has(email)) return false;
      seen.add(email);
      return true;
    });
  }, [regs, events, bulkEventId, bulkStatus]);

  const bulkExtraEmails = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const part of bulkExtraEmail.split(/[,;\s]+/)) {
      const email = part.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || seen.has(email)) {
        continue;
      }
      seen.add(email);
      out.push(email);
    }
    return out;
  }, [bulkExtraEmail]);

  const bulkSendTotal = bulkRecipients.length + bulkExtraEmails.filter(
    (email) =>
      !bulkRecipients.some(
        (r) => r.email?.trim().toLowerCase() === email,
      ),
  ).length;

  const inscritosStatusFilters = useMemo(() => {
    const base =
      filterEventId === "all"
        ? regs
        : regs.filter((r) => r.eventId === filterEventId);
    const count = (status: AdminRegistration["status"] | "all") =>
      status === "all"
        ? base.length
        : base.filter((r) => r.status === status).length;
    return [
      { id: "all" as const, label: "Todas", count: count("all"), hint: "Sin filtro" },
      {
        id: "pendiente_pago" as const,
        label: "Pendiente pago",
        count: count("pendiente_pago"),
        hint: "Esperan pagar",
      },
      {
        id: "pagado" as const,
        label: "Pagado",
        count: count("pagado"),
        hint: "Pago OK",
      },
      {
        id: "confirmado" as const,
        label: "Confirmado",
        count: count("confirmado"),
        hint: "Listas",
      },
      {
        id: "nuevo" as const,
        label: "Nuevo",
        count: count("nuevo"),
        hint: "Recién inscritas",
      },
      {
        id: "cancelado" as const,
        label: "Cancelado",
        count: count("cancelado"),
        hint: "Baja",
      },
    ];
  }, [regs, filterEventId]);

  const eventTitle = (id: string) =>
    events.find((e) => e.id === id)?.title ?? id;

  function flash(msg: string) {
    setToast(msg);
  }

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

  async function loadEmailPreview() {
    setLoadingPreview(true);
    try {
      const res = await fetch("/api/admin/eventos/email-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: testName.trim() || "GAL'S",
          eventId: testEventId || undefined,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        html?: string;
        subject?: string;
      };
      if (!res.ok || !data.ok || !data.html) {
        throw new Error(data.error || "No se pudo generar el preview");
      }
      setEmailPreviewHtml(data.html);
      setEmailPreviewSubject(data.subject || "Confirmación GAL'S");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error al cargar preview");
    } finally {
      setLoadingPreview(false);
    }
  }

  async function sendBulkEmail() {
    const eventId = bulkEventId || events[0]?.id || "";
    if (!eventId) {
      flash("Elegí un evento");
      return;
    }
    if (bulkSubject.trim().length < 3) {
      flash("Escribí un asunto");
      return;
    }
    if (bulkMessage.trim().length < 5) {
      flash("Escribí el mensaje");
      return;
    }
    if (bulkSendTotal === 0) {
      flash("No hay destinatarias: agregá inscritas o un correo extra");
      return;
    }
    const okConfirm = window.confirm(
      `¿Enviar correo a ${bulkSendTotal} destinataria(s) de «${eventTitle(eventId)}»?`,
    );
    if (!okConfirm) return;

    setSendingBulk(true);
    try {
      const res = await fetch("/api/admin/eventos/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          subject: bulkSubject.trim(),
          message: bulkMessage.trim(),
          statusFilter: bulkStatus,
          extraEmails: bulkExtraEmails,
          extraName: bulkExtraName.trim() || "GAL'S",
          design: {
            ...bulkDesign,
            coverUrl: bulkDesign.coverUrl.trim() || undefined,
            ctaUrl: bulkDesign.ctaUrl.trim() || undefined,
          },
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        sent?: number;
        total?: number;
        failed?: string[];
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo enviar");
      }
      const failN = data.failed?.length ?? 0;
      flash(
        failN > 0
          ? `Enviados ${data.sent}/${data.total}. Fallaron ${failN}.`
          : `Correo enviado a ${data.sent} persona(s)`,
      );
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error al enviar masivo");
    } finally {
      setSendingBulk(false);
    }
  }

  async function sendBulkExtraOnly() {
    const eventId = bulkEventId || events[0]?.id || "";
    if (!eventId) {
      flash("Elegí un evento");
      return;
    }
    if (bulkExtraEmails.length === 0) {
      flash("Agregá al menos un correo extra");
      return;
    }
    if (bulkSubject.trim().length < 3) {
      flash("Escribí un asunto (o elegí una plantilla)");
      return;
    }
    if (bulkMessage.trim().length < 5) {
      flash("Escribí el mensaje (o elegí una plantilla)");
      return;
    }

    setSendingBulkExtra(true);
    try {
      const res = await fetch("/api/admin/eventos/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          subject: bulkSubject.trim(),
          message: bulkMessage.trim(),
          extraEmails: bulkExtraEmails,
          extraName: bulkExtraName.trim() || "GAL'S",
          onlyExtras: true,
          design: {
            ...bulkDesign,
            coverUrl: bulkDesign.coverUrl.trim() || undefined,
            ctaUrl: bulkDesign.ctaUrl.trim() || undefined,
          },
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        sent?: number;
        failed?: string[];
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo enviar");
      }
      flash(
        data.failed?.length
          ? `Parcial: ${data.sent} ok, falló ${data.failed.join(", ")}`
          : `Enviado a ${bulkExtraEmails.join(", ")}`,
      );
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error al enviar");
    } finally {
      setSendingBulkExtra(false);
    }
  }

  async function previewBulkEmail() {
    const eventId = bulkEventId || events[0]?.id || "";
    if (!eventId) {
      flash("Elegí un evento");
      return;
    }
    if (bulkMessage.trim().length < 3 && bulkSubject.trim().length < 3) {
      flash("Elegí una plantilla o escribí asunto/mensaje");
      return;
    }
    setLoadingBulkPreview(true);
    try {
      const res = await fetch("/api/admin/eventos/bulk-email-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          name: bulkExtraName.trim() || "Naty",
          subject: bulkSubject.trim() || "Preview · {{evento}}",
          message:
            bulkMessage.trim() ||
            "{{nombre}}, este es un preview del correo de {{evento}}.",
          design: {
            ...bulkDesign,
            coverUrl: bulkDesign.coverUrl.trim() || undefined,
            ctaUrl: bulkDesign.ctaUrl.trim() || undefined,
          },
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        html?: string;
        subject?: string;
      };
      if (!res.ok || !data.ok || !data.html) {
        throw new Error(data.error || "No se pudo generar el preview");
      }
      setEmailPreviewHtml(data.html);
      setEmailPreviewSubject(data.subject || "Preview GAL'S");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error al cargar preview");
    } finally {
      setLoadingBulkPreview(false);
    }
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
      flash(
        "Para cobrar online poné el Monto MP (COP), o dejalo y se irá a WhatsApp",
      );
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
        data.event.published === false
          ? "Guardado como borrador"
          : "Publicado en /eventos",
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
    setDeleteTarget(null);
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
      flash("Copia creada (borrador)");
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
      setEvents((prev) => prev.map((e) => (e.id === id ? data.event! : e)));
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
      setEvents((prev) => prev.map((e) => (e.id === id ? data.event! : e)));
      flash(
        data.event.published === false
          ? "Oculto en la landing"
          : "Publicado en /eventos",
      );
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error");
    }
    setMenuId(null);
  }

  async function addRegistration() {
    const name = regForm.name.trim();
    const email = regForm.email.trim();
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
        body: JSON.stringify({
          name,
          whatsapp,
          eventId,
          email: email || undefined,
        }),
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
      setRegForm({ name: "", email: "", whatsapp: "", eventId });
      flash("Inscrita agregada");
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
    setDeleteTarget(null);
  }

  async function importLandingEvents() {
    setSaving(true);
    setHeaderMoreOpen(false);
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
      flash(`Listo: ${data.imported ?? 0} eventos cargados`);
      setTab("eventos");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Error al importar");
    } finally {
      setSaving(false);
    }
  }

  async function reloadFromSupabase() {
    setReady(false);
    setHeaderMoreOpen(false);
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
      flash("Agenda sincronizada");
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
    { id: "correos", label: "Correos" },
    { id: "comunidad", label: "Comunidad" },
    { id: "editor", label: editingId ? "Editar" : "Crear" },
  ];

  if (!ready) {
    return (
      <div className="min-h-[60svh] bg-gals-blue-soft px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-white/50" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-white/50"
              />
            ))}
          </div>
          <div className="h-48 animate-pulse rounded-2xl bg-white/50" />
        </div>
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
    <div className="min-h-full bg-gradient-to-b from-gals-blue-soft via-[#f3f5fb] to-gals-mist pb-24">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <motion.header
          className="flex flex-col gap-5 border-b border-gals-blue-deep/10 pb-6 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-semibold tracking-[0.22em] text-gals-blue-deep uppercase">
                GAL&apos;S Studio
              </p>
              <Chip tone="ink">Admin</Chip>
            </div>
            <h1 className="mt-1 font-display text-3xl tracking-tight text-gals-ink uppercase md:text-4xl">
              Panel de eventos
            </h1>
            <p className="mt-2 max-w-lg text-sm text-gals-muted">
              Publicá, cobrá e inscritos en un solo lugar.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setHeaderMoreOpen((v) => !v);
                }}
                className="rounded-full border border-gals-blue-deep/15 bg-white/60 px-4 py-2.5 text-[11px] font-semibold tracking-wide text-gals-muted uppercase"
              >
                Más
              </button>
              <AnimatePresence>
                {headerMoreOpen ? (
                  <motion.div
                    className="absolute right-0 z-30 mt-1.5 w-52 overflow-hidden rounded-xl border border-gals-blue-deep/10 bg-white py-1 shadow-xl"
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void reloadFromSupabase()}
                      className="block w-full px-3.5 py-2.5 text-left text-xs font-medium text-gals-ink hover:bg-gals-blue-soft"
                    >
                      Sincronizar
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void importLandingEvents()}
                      className="block w-full px-3.5 py-2.5 text-left text-xs font-medium text-gals-ink hover:bg-gals-blue-soft disabled:opacity-60"
                    >
                      {saving ? "Importando…" : "Cargar eventos landing"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void fetch("/api/admin/logout", {
                          method: "POST",
                        }).then(() => {
                          window.location.href = "/admin/login";
                        });
                      }}
                      className="block w-full px-3.5 py-2.5 text-left text-xs font-medium text-gals-muted hover:bg-gals-blue-soft"
                    >
                      Salir
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
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
              <div className="rounded-2xl bg-gals-blue-soft/40 px-4 py-3 text-sm text-gals-ink ring-1 ring-gals-blue-deep/10">
                <p className="font-semibold">Panel del equipo</p>
                <p className="mt-1.5 leading-relaxed text-gals-muted">
                  Resumen rápido del día: cupos, pendientes de pago y próximos
                  eventos. En <span className="font-medium text-gals-ink">Eventos</span>{" "}
                  usá el filtro «Hoy» el día de la clase. En{" "}
                  <span className="font-medium text-gals-ink">Inscritos</span>{" "}
                  filtrá por estado y revisá el precio de cada cupo. En{" "}
                  <span className="font-medium text-gals-ink">Comunidad</span>{" "}
                  enviá los links Plus / VIP.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Próximos" value={upcomingCount} delay={0} />
                <StatCard
                  label="Publicados"
                  value={publishedCount}
                  delay={0.05}
                />
                <StatCard
                  label="Pendientes pago"
                  value={pendingPayCount}
                  delay={0.1}
                />
                <StatCard
                  label="Cupos llenos"
                  value={fullCapacityCount}
                  delay={0.15}
                />
              </div>

              {attentionItems.length > 0 ? (
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5">
                  <h2 className="font-display text-lg uppercase text-amber-900">
                    Atención
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {attentionItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-3 text-sm text-amber-950"
                      >
                        <span>{item.text}</span>
                        {item.action ? (
                          <button
                            type="button"
                            onClick={item.action}
                            className="shrink-0 text-xs font-semibold uppercase underline-offset-2 hover:underline"
                          >
                            Ver
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

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
                  {events.filter((e) => new Date(e.startsAt).getTime() >= nowTs)
                    .length === 0 ? (
                    <p className="mt-6 text-sm text-gals-muted">
                      No hay próximos en la agenda.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {events
                        .filter((e) => new Date(e.startsAt).getTime() >= nowTs)
                        .slice(0, 5)
                        .map((e) => (
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
                      Aún no hay inscritos.
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

              <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
                <button
                  type="button"
                  onClick={() => setTestEmailOpen((v) => !v)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
                      Herramienta
                    </p>
                    <p className="font-display text-base uppercase text-gals-blue-deep">
                      Email de prueba
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gals-muted uppercase">
                    {testEmailOpen ? "Ocultar" : "Abrir"}
                  </span>
                </button>
                {testEmailOpen ? (
                  <div className="mt-4 grid gap-3 border-t border-gals-blue-deep/8 pt-4 sm:grid-cols-2 lg:grid-cols-4">
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
                        onChange={(e) => setTestEventId(e.target.value)}
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
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={loadingPreview}
                          onClick={() => void loadEmailPreview()}
                          className="rounded-full border border-gals-blue-deep/25 bg-white px-4 py-2.5 text-[11px] font-bold tracking-wide text-gals-blue-deep uppercase disabled:opacity-60"
                        >
                          {loadingPreview ? "Cargando…" : "Ver preview"}
                        </button>
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
                ) : null}
              </div>
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
                  <button
                    type="button"
                    onClick={() => setFilterTodayOnly((v) => !v)}
                    className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                      filterTodayOnly
                        ? "bg-gals-blue-mid text-white"
                        : "bg-white/80 text-gals-muted ring-1 ring-gals-blue-deep/10"
                    }`}
                  >
                    Hoy
                  </button>
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
                      ? "Todavía no hay eventos. Creá uno o cargá los de la landing."
                      : "No hay eventos con ese filtro."
                  }
                >
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => openCreate("paid")}
                      className="rounded-full bg-gals-blue-deep px-5 py-2.5 text-xs font-bold text-white uppercase"
                    >
                      + Crear evento
                    </button>
                    {events.length === 0 ? (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void importLandingEvents()}
                        className="rounded-full border border-gals-blue-deep/20 bg-white px-5 py-2.5 text-xs font-semibold text-gals-blue-deep uppercase"
                      >
                        Cargar eventos landing
                      </button>
                    ) : null}
                  </div>
                </EmptyState>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-[0_16px_48px_rgba(85,104,148,0.08)] backdrop-blur-sm">
                  <ul>
                    {filteredEvents.map((e, i) => {
                      const taken = regCountByEvent.get(e.id) ?? 0;
                      const published = e.published !== false;
                      return (
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
                                <Chip
                                  tone={e.kind === "free" ? "green" : "blue"}
                                >
                                  {e.kind === "free" ? "Gratis" : "Pago"}
                                </Chip>
                                <Chip
                                  tone={
                                    /aire libre|parque|exterior/i.test(e.place)
                                      ? "green"
                                      : "blue"
                                  }
                                >
                                  {/aire libre|parque|exterior/i.test(e.place)
                                    ? "Aire libre"
                                    : /studio|calle 97|chicó|chico/i.test(
                                          e.place,
                                        )
                                      ? "Studio"
                                      : "Lugar"}
                                </Chip>
                                <Chip tone={published ? "green" : "amber"}>
                                  {published ? "Publicado" : "Borrador"}
                                </Chip>
                                {e.featured ? (
                                  <Chip tone="ink">Featured</Chip>
                                ) : null}
                              </div>
                              <p className="mt-0.5 text-xs text-gals-muted">
                                {e.dateLabel}
                                {e.timeLabel ? ` · ${e.timeLabel}` : ""}
                                {" · "}
                                {e.capacity
                                  ? `Cupos ${taken}/${e.capacity}${
                                      taken >= e.capacity ? " · LLENO" : ""
                                    }`
                                  : `Inscritos ${taken} · sin límite`}
                                {e.showPrice && e.price
                                  ? ` · ${e.price}`
                                  : e.price
                                    ? " · precio oculto"
                                    : ""}
                              </p>
                              {e.capacity && e.capacity > 0 ? (
                                <div className="mt-2 h-1.5 max-w-[220px] overflow-hidden rounded-full bg-gals-blue-deep/10">
                                  <div
                                    className={`h-full rounded-full ${
                                      taken >= e.capacity
                                        ? "bg-amber-500"
                                        : "bg-gals-blue-deep"
                                    }`}
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.round((taken / e.capacity) * 100),
                                      )}%`,
                                    }}
                                  />
                                </div>
                              ) : null}
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
                            <button
                              type="button"
                              onClick={() => void togglePublished(e.id)}
                              className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase ring-1 ${
                                published
                                  ? "bg-white text-gals-muted ring-gals-blue-deep/15"
                                  : "bg-gals-green-soft text-gals-ink ring-transparent"
                              }`}
                            >
                              {published ? "Ocultar" : "Publicar"}
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
                                    <button
                                      type="button"
                                      onClick={() => void toggleFeatured(e.id)}
                                      className="block w-full px-3.5 py-2 text-left text-xs font-medium text-gals-ink hover:bg-gals-blue-soft"
                                    >
                                      {e.featured
                                        ? "Quitar featured"
                                        : "Marcar featured"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => void toggleShowPrice(e.id)}
                                      className="block w-full px-3.5 py-2 text-left text-xs font-medium text-gals-ink hover:bg-gals-blue-soft"
                                    >
                                      {e.showPrice
                                        ? "Ocultar precio"
                                        : "Mostrar precio"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => void duplicateEvent(e)}
                                      className="block w-full px-3.5 py-2 text-left text-xs font-medium text-gals-ink hover:bg-gals-blue-soft"
                                    >
                                      Duplicar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDeleteTarget({
                                          type: "event",
                                          id: e.id,
                                          label: e.title,
                                        })
                                      }
                                      className="block w-full px-3.5 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                                    >
                                      Eliminar
                                    </button>
                                  </motion.div>
                                ) : null}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
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
                  Ideal con email: así después podés mandarle confirmación o
                  cobro desde Correos.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
                    <label className={labelClass}>Email</label>
                    <input
                      className={inputClass}
                      type="email"
                      value={regForm.email}
                      onChange={(e) =>
                        setRegForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="opcional"
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

              <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_12px_40px_rgba(85,104,148,0.06)] backdrop-blur-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
                      Filtros
                    </p>
                    <h3 className="font-display text-lg uppercase text-gals-blue-deep">
                      Ver inscritas por estado
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-gals-muted tabular-nums">
                    {filteredRegs.length} resultado
                    {filteredRegs.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="mt-4">
                  <label className={labelClass}>Evento</label>
                  <select
                    value={filterEventId}
                    onChange={(e) => setFilterEventId(e.target.value)}
                    className={inputClass}
                  >
                    <option value="all">Todos los eventos</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {inscritosStatusFilters.map((f) => {
                    const active = filterStatus === f.id;
                    const tone =
                      f.id === "pendiente_pago"
                        ? active
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                          : "bg-amber-50 text-amber-950 ring-1 ring-amber-200/80 hover:bg-amber-100"
                        : f.id === "pagado" || f.id === "confirmado"
                          ? active
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                            : "bg-emerald-50 text-emerald-950 ring-1 ring-emerald-200/80 hover:bg-emerald-100"
                          : f.id === "cancelado"
                            ? active
                              ? "bg-gals-ink text-white"
                              : "bg-gals-ink/5 text-gals-muted ring-1 ring-gals-ink/10 hover:bg-gals-ink/10"
                            : active
                              ? "bg-gals-blue-deep text-white shadow-md shadow-gals-blue-deep/20"
                              : "bg-white text-gals-ink ring-1 ring-gals-blue-deep/12 hover:bg-gals-blue-soft/50";
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilterStatus(f.id)}
                        className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition ${tone}`}
                      >
                        <span>
                          <span className="block text-sm font-semibold">
                            {f.label}
                          </span>
                          <span
                            className={`mt-0.5 block text-[11px] ${
                              active ? "text-white/75" : "text-gals-muted"
                            }`}
                          >
                            {f.hint}
                          </span>
                        </span>
                        <span
                          className={`font-display text-2xl tabular-nums ${
                            active ? "text-white" : "text-gals-blue-deep"
                          }`}
                        >
                          {f.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar nombre, email o WhatsApp…"
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    disabled={filteredRegs.length === 0}
                    onClick={() => exportRegsCsv(filteredRegs, eventTitle)}
                    className="rounded-full border border-gals-blue-deep/20 bg-white px-4 py-2.5 text-[11px] font-semibold text-gals-blue-deep uppercase disabled:opacity-50"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              {filteredRegs.length === 0 ? (
                <EmptyState
                  title="Sin inscritos"
                  body="Cuando alguien se registre o agregues una inscrita aquí, aparecerá en esta lista."
                />
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/70 bg-white/85 shadow-[0_12px_40px_rgba(85,104,148,0.06)]">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-gals-blue-deep/10 text-[10px] font-semibold tracking-[0.14em] text-gals-muted uppercase">
                      <tr>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Contacto</th>
                        <th className="px-4 py-3">Evento</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegs.map((r) => {
                        const wa = waLink(r.whatsapp);
                        const eventName = eventTitle(r.eventId);
                        const ev = events.find((e) => e.id === r.eventId);
                        const priceLabel =
                          ev?.kind === "free"
                            ? "Gratis"
                            : ev?.price?.trim()
                              ? ev.price
                              : ev?.priceAmount != null
                                ? `$${ev.priceAmount.toLocaleString("es-CO")}`
                                : null;
                        return (
                          <tr
                            key={r.id}
                            className="border-b border-gals-blue-deep/8 last:border-0"
                          >
                            <td className="px-4 py-3 font-semibold text-gals-ink">
                              {r.name}
                            </td>
                            <td className="px-4 py-3 text-xs text-gals-muted">
                              <div className="flex flex-col gap-1">
                                {r.email ? (
                                  <a
                                    href={`mailto:${r.email}`}
                                    className="text-gals-blue-deep hover:underline"
                                  >
                                    {r.email}
                                  </a>
                                ) : (
                                  <span>—</span>
                                )}
                                {wa ? (
                                  <a
                                    href={wa}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gals-blue-deep hover:underline"
                                  >
                                    {r.whatsapp}
                                  </a>
                                ) : (
                                  <span>{r.whatsapp}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gals-ink">
                              {eventName}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-2">
                                <StatusPill status={r.status} />
                                <select
                                  value={r.status}
                                  onChange={(e) =>
                                    void updateRegStatus(
                                      r.id,
                                      e.target.value as AdminRegistration["status"],
                                    )
                                  }
                                  className="rounded-lg border border-gals-blue-deep/12 bg-white px-2 py-1 text-[10px] uppercase"
                                >
                                  <option value="nuevo">Nuevo</option>
                                  <option value="pendiente_pago">
                                    Pendiente pago
                                  </option>
                                  <option value="pagado">Pagado</option>
                                  <option value="confirmado">Confirmado</option>
                                  <option value="cancelado">Cancelado</option>
                                </select>
                                {priceLabel ? (
                                  <p className="text-[11px] font-semibold tabular-nums text-gals-ink">
                                    {r.status === "pagado" ||
                                    r.status === "confirmado"
                                      ? `Pagó ${priceLabel}`
                                      : r.status === "pendiente_pago"
                                        ? `A pagar ${priceLabel}`
                                        : priceLabel}
                                  </p>
                                ) : (
                                  <p className="text-[11px] text-gals-muted">
                                    Sin precio
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gals-muted whitespace-nowrap">
                              {formatWhen(r.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "reg",
                                    id: r.id,
                                    label: r.name,
                                  })
                                }
                                className="text-[10px] font-semibold text-red-600 uppercase"
                              >
                                Borrar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          ) : null}

          {tab === "correos" ? (
            <motion.div key="correos" className="mt-8 space-y-5" {...fade}>
              <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_18px_50px_rgba(85,104,148,0.1)]">
                <div className="relative overflow-hidden bg-gradient-to-br from-gals-blue-deep via-[#3d4d73] to-gals-blue-mid px-5 py-7 text-white sm:px-8 sm:py-9">
                  <div
                    className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute bottom-0 left-10 h-24 w-24 rounded-full bg-gals-blue-soft/20 blur-xl"
                    aria-hidden
                  />
                  <p className="relative text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">
                    Comunicación
                  </p>
                  <h2 className="relative mt-2 font-display text-3xl tracking-tight uppercase sm:text-4xl">
                    Correos masivos
                  </h2>
                  <p className="relative mt-2 max-w-xl text-sm text-white/80 sm:text-base">
                    Avisos, recordatorios o info del evento a todas las
                    inscritas con email.
                  </p>
                  <div className="relative mt-6 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                      <p className="text-[10px] tracking-wide text-white/65 uppercase">
                        Destinatarias
                      </p>
                      <p className="mt-1 font-display text-3xl tabular-nums">
                        {bulkSendTotal}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                      <p className="text-[10px] tracking-wide text-white/65 uppercase">
                        Eventos
                      </p>
                      <p className="mt-1 font-display text-3xl tabular-nums">
                        {events.length}
                      </p>
                    </div>
                    <div className="col-span-2 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm sm:col-span-1">
                      <p className="text-[10px] tracking-wide text-white/65 uppercase">
                        Canal
                      </p>
                      <p className="mt-1 font-script text-2xl text-gals-cream">
                        Resend
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-5 sm:p-7">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
                      1 · A quién
                    </p>
                    <div className="mt-3 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                      <div>
                        <label className={labelClass} htmlFor="bulk-event">
                          Evento
                        </label>
                        <select
                          id="bulk-event"
                          className={inputClass}
                          value={bulkEventId || events[0]?.id || ""}
                          onChange={(e) => setBulkEventId(e.target.value)}
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
                      <div>
                        <label className={labelClass}>Estado</label>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {(
                            [
                              ["all", "Todas"],
                              ["pendiente_pago", "Pend. pago"],
                              ["pagado", "Pagado"],
                              ["confirmado", "Confirmado"],
                              ["nuevo", "Nuevo"],
                            ] as const
                          ).map(([id, label]) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setBulkStatus(id)}
                              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                                bulkStatus === id
                                  ? "bg-gals-blue-deep text-white"
                                  : "bg-gals-blue-soft/60 text-gals-ink ring-1 ring-gals-blue-deep/10"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-gals-blue-deep/20 bg-gals-blue-soft/25 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gals-blue-deep">
                        Lista de envío
                      </p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gals-blue-deep tabular-nums shadow-sm">
                        {bulkSendTotal} emails
                      </span>
                    </div>
                    {bulkRecipients.length > 0 ? (
                      <ul className="mt-3 grid max-h-40 gap-1.5 overflow-y-auto sm:grid-cols-2">
                        {bulkRecipients.slice(0, 24).map((r) => (
                          <li
                            key={r.id}
                            className="truncate rounded-xl bg-white/90 px-3 py-2 text-xs text-gals-ink ring-1 ring-gals-blue-deep/8"
                          >
                            <span className="font-semibold">{r.name}</span>
                            <span className="mt-0.5 block truncate text-gals-muted">
                              {r.email}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-gals-muted">
                        Nadie con email válido en este filtro. Podés agregar
                        correos extra abajo.
                      </p>
                    )}
                    {bulkRecipients.length > 24 ? (
                      <p className="mt-2 text-xs font-medium text-gals-muted">
                        +{bulkRecipients.length - 24} más en el envío
                      </p>
                    ) : null}

                    <div className="mt-4 border-t border-gals-blue-deep/10 pt-4">
                      <p className="text-[10px] font-semibold tracking-[0.14em] text-gals-muted uppercase">
                        Correos extra
                      </p>
                      <p className="mt-1 text-xs text-gals-muted">
                        Sumá mails que no estén en la lista (vos, otra persona,
                        etc.). Entran en el envío general.
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
                        <div>
                          <label
                            className={labelClass}
                            htmlFor="bulk-extra-email"
                          >
                            Email(s)
                          </label>
                          <input
                            id="bulk-extra-email"
                            className={inputClass}
                            value={bulkExtraEmail}
                            onChange={(e) => setBulkExtraEmail(e.target.value)}
                            placeholder="tu@email.com, otro@email.com"
                            autoComplete="email"
                          />
                        </div>
                        <div>
                          <label
                            className={labelClass}
                            htmlFor="bulk-extra-name"
                          >
                            Nombre (para extras)
                          </label>
                          <input
                            id="bulk-extra-name"
                            className={inputClass}
                            value={bulkExtraName}
                            onChange={(e) => setBulkExtraName(e.target.value)}
                            placeholder="Ej. Naty"
                          />
                        </div>
                      </div>
                      {bulkExtraEmails.length > 0 ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {bulkExtraEmails.map((email) => (
                            <span
                              key={email}
                              className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-gals-blue-deep ring-1 ring-gals-blue-deep/12"
                            >
                              {email}
                            </span>
                          ))}
                          <button
                            type="button"
                            disabled={
                              sendingBulkExtra || events.length === 0
                            }
                            onClick={() => void sendBulkExtraOnly()}
                            className="rounded-full bg-gals-blue-deep/90 px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white uppercase transition hover:bg-gals-blue-deep disabled:opacity-55"
                          >
                            {sendingBulkExtra
                              ? "Enviando…"
                              : "Enviar solo a extras"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
                      2 · Qué enviar
                    </p>
                    <p className="mt-2 text-sm text-gals-muted">
                      Elegí una plantilla o escribí desde cero. Se personaliza
                      con el nombre de cada inscrita. Podés usar{" "}
                      <code className="rounded bg-gals-blue-soft/80 px-1 text-[11px]">
                        {"{{nombre}}"}
                      </code>
                      ,{" "}
                      <code className="rounded bg-gals-blue-soft/80 px-1 text-[11px]">
                        {"{{evento}}"}
                      </code>
                      ,{" "}
                      <code className="rounded bg-gals-blue-soft/80 px-1 text-[11px]">
                        {"{{fecha}}"}
                      </code>
                      ,{" "}
                      <code className="rounded bg-gals-blue-soft/80 px-1 text-[11px]">
                        {"{{hora}}"}
                      </code>
                      ,{" "}
                      <code className="rounded bg-gals-blue-soft/80 px-1 text-[11px]">
                        {"{{lugar}}"}
                      </code>
                      .
                    </p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {BULK_EMAIL_TEMPLATES.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            const next = applyBulkTemplate(
                              tpl,
                              eventTitle(bulkEventId || events[0]?.id || ""),
                            );
                            setBulkSubject(next.subject);
                            setBulkMessage(next.message);
                            if (tpl.id === "pago") {
                              setBulkStatus("pendiente_pago");
                            }
                            setBulkDesign((d) => ({
                              ...d,
                              badge: tpl.label,
                              ctaTarget: tpl.ctaTarget,
                              ctaLabel: tpl.ctaLabel,
                              ctaUrl: tpl.ctaUrl,
                              showWhatsAppLink: true,
                            }));
                          }}
                          className="rounded-2xl border border-gals-blue-deep/10 bg-gradient-to-br from-white to-gals-blue-soft/30 px-4 py-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gals-blue-deep/25 hover:shadow-md"
                        >
                          <span className="block text-sm font-semibold text-gals-blue-deep">
                            {tpl.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-gals-muted">
                            {tpl.hint}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className={labelClass} htmlFor="bulk-subject">
                          Asunto
                        </label>
                        <input
                          id="bulk-subject"
                          className={inputClass}
                          value={bulkSubject}
                          onChange={(e) => setBulkSubject(e.target.value)}
                          placeholder="Ej. Recordatorio · mañana nos vemos en GAL'S"
                        />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="bulk-message">
                          Mensaje
                        </label>
                        <textarea
                          id="bulk-message"
                          className={`${inputClass} min-h-[180px] resize-y leading-relaxed`}
                          value={bulkMessage}
                          onChange={(e) => setBulkMessage(e.target.value)}
                          placeholder={
                            "Hola! Te escribimos para recordarte…\n\nNos vemos en el studio."
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gals-blue-deep/12 bg-white p-4 sm:p-5">
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
                      3 · Diseño del correo
                    </p>
                    <p className="mt-2 text-sm text-gals-muted">
                      Configurá logo, imagen, color y textos del diseño. El
                      mensaje de arriba va adentro de esta plantilla.
                    </p>

                    <div className="mt-4 space-y-4">
                      <div>
                        <p className={labelClass}>Color de acento</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(
                            [
                              ["#8799c4", "Marca"],
                              ["#556894", "Azul profundo"],
                              ["#6b7fb0", "Periwinkle"],
                              ["#6fad86", "Verde"],
                              ["#1a2a35", "Ink"],
                            ] as const
                          ).map(([hex, label]) => (
                            <button
                              key={hex}
                              type="button"
                              onClick={() =>
                                setBulkDesign((d) => ({ ...d, accent: hex }))
                              }
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ring-1 transition ${
                                bulkDesign.accent === hex
                                  ? "bg-gals-blue-deep text-white ring-gals-blue-deep"
                                  : "bg-gals-blue-soft/50 text-gals-ink ring-gals-blue-deep/10"
                              }`}
                            >
                              <span
                                className="h-3 w-3 rounded-full ring-1 ring-black/10"
                                style={{ background: hex }}
                              />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className={labelClass} htmlFor="bulk-badge">
                            Frase bajo el logo
                          </label>
                          <input
                            id="bulk-badge"
                            className={inputClass}
                            value={bulkDesign.badge}
                            onChange={(e) =>
                              setBulkDesign((d) => ({
                                ...d,
                                badge: e.target.value,
                              }))
                            }
                            placeholder="Para ti · Recordatorio…"
                          />
                        </div>
                        <div>
                          <label className={labelClass} htmlFor="bulk-cta">
                            Texto del botón
                          </label>
                          <input
                            id="bulk-cta"
                            className={inputClass}
                            value={bulkDesign.ctaLabel}
                            onChange={(e) =>
                              setBulkDesign((d) => ({
                                ...d,
                                ctaLabel: e.target.value,
                              }))
                            }
                            placeholder="Reservar cupo"
                          />
                        </div>
                      </div>

                      <div>
                        <p className={labelClass}>Botón principal va a</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(
                            [
                              ["event", "Landing del evento"],
                              ["whatsapp", "WhatsApp"],
                              ["custom", "URL custom"],
                            ] as const
                          ).map(([id, label]) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() =>
                                setBulkDesign((d) => ({
                                  ...d,
                                  ctaTarget: id,
                                  ctaLabel:
                                    id === "whatsapp" &&
                                    d.ctaTarget !== "whatsapp"
                                      ? "WhatsApp GAL'S"
                                      : id === "event" &&
                                          d.ctaTarget !== "event"
                                        ? "Reservar cupo"
                                        : d.ctaLabel,
                                }))
                              }
                              className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                                bulkDesign.ctaTarget === id
                                  ? "bg-gals-blue-deep text-white"
                                  : "bg-gals-blue-soft/60 text-gals-ink ring-1 ring-gals-blue-deep/10"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        {bulkDesign.ctaTarget === "event" ? (
                          <p className="mt-2 text-xs text-gals-muted">
                            Abre{" "}
                            <code className="rounded bg-gals-blue-soft/80 px-1">
                              /eventos#…
                            </code>{" "}
                            para que se inscriban en la landing.
                          </p>
                        ) : null}
                        {bulkDesign.ctaTarget === "custom" ? (
                          <div className="mt-3">
                            <label
                              className={labelClass}
                              htmlFor="bulk-cta-url"
                            >
                              URL del botón
                            </label>
                            <input
                              id="bulk-cta-url"
                              className={inputClass}
                              value={bulkDesign.ctaUrl}
                              onChange={(e) =>
                                setBulkDesign((d) => ({
                                  ...d,
                                  ctaUrl: e.target.value,
                                }))
                              }
                              placeholder="https://… o /eventos"
                            />
                          </div>
                        ) : null}
                      </div>

                      <div>
                        <label className={labelClass} htmlFor="bulk-cover-url">
                          Imagen del mail (opcional)
                        </label>
                        <input
                          id="bulk-cover-url"
                          className={inputClass}
                          value={bulkDesign.coverUrl}
                          onChange={(e) =>
                            setBulkDesign((d) => ({
                              ...d,
                              coverUrl: e.target.value,
                            }))
                          }
                          placeholder="Vacío = imagen del evento · o URL /media/…"
                        />
                      </div>

                      <div>
                        <label className={labelClass} htmlFor="bulk-signoff">
                          Firma / cierre
                        </label>
                        <textarea
                          id="bulk-signoff"
                          className={`${inputClass} min-h-[72px] resize-y`}
                          value={bulkDesign.signOff}
                          onChange={(e) =>
                            setBulkDesign((d) => ({
                              ...d,
                              signOff: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            ["showLogo", "Logo GAL'S"],
                            ["showCover", "Imagen"],
                            ["showDetails", "Fecha y lugar"],
                            ["showWhatsAppLink", "Link WhatsApp"],
                          ] as const
                        ).map(([key, label]) => {
                          const on = bulkDesign[key];
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() =>
                                setBulkDesign((d) => ({ ...d, [key]: !on }))
                              }
                              className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                                on
                                  ? "bg-gals-blue-deep text-white"
                                  : "bg-gals-blue-soft/60 text-gals-muted ring-1 ring-gals-blue-deep/10"
                              }`}
                            >
                              {on ? "✓ " : ""}
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        disabled={loadingBulkPreview || events.length === 0}
                        onClick={() => void previewBulkEmail()}
                        className="w-full rounded-full bg-gals-cream px-5 py-3 text-xs font-bold tracking-wide text-gals-blue-deep uppercase ring-1 ring-gals-blue-deep/15 transition hover:bg-white disabled:opacity-55 sm:w-auto"
                      >
                        {loadingBulkPreview
                          ? "Generando…"
                          : "Ver preview del correo"}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-gals-blue-deep/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-gals-muted">
                      Canceladas no se incluyen. Correos extra sí.
                    </p>
                    <button
                      type="button"
                      disabled={
                        sendingBulk ||
                        events.length === 0 ||
                        bulkSendTotal === 0
                      }
                      onClick={() => void sendBulkEmail()}
                      className="inline-flex items-center justify-center rounded-full bg-gals-blue-deep px-8 py-3.5 text-xs font-bold tracking-wide text-white uppercase shadow-[0_12px_28px_rgba(47,61,92,0.28)] transition hover:scale-[1.02] disabled:opacity-55 disabled:hover:scale-100"
                    >
                      {sendingBulk
                        ? "Enviando…"
                        : `Enviar a ${bulkSendTotal}`}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}

          {tab === "comunidad" ? (
            <motion.div key="comunidad" {...fade}>
              <ComunidadPanel flash={flash} />
            </motion.div>
          ) : null}

          {tab === "editor" ? (
            <motion.div key="editor" className="mt-8 space-y-4 pb-8" {...fade}>
              <div>
                <h2 className="font-display text-2xl uppercase text-gals-blue-deep">
                  {editingId ? "Editar evento" : "Crear evento"}
                </h2>
                <p className="text-sm text-gals-muted">
                  Completá por bloques. Si está publicado, se ve en /eventos.
                </p>
              </div>

              <SectionCard title="1. Básico" hint="Identidad y fecha del evento">
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
                  <label className={labelClass}>Tipo</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {(
                      [
                        ["paid", "Pago"],
                        ["free", "Gratis"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          setDraft((d) => ({
                            ...d,
                            kind: id,
                            eyebrow:
                              id === "free"
                                ? "Evento gratis"
                                : "Experiencia paga",
                            beweAfter: id === "free" ? "form" : "packs",
                            cta:
                              id === "free"
                                ? "Reservar mi cupo gratis"
                                : "Pagar y reservar",
                            price:
                              id === "free"
                                ? "Gratis"
                                : d.price === "Gratis"
                                  ? ""
                                  : d.price,
                            showPrice: true,
                          }))
                        }
                        className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase transition ${
                          draft.kind === id
                            ? "bg-gals-blue-deep text-white"
                            : "bg-white text-gals-muted ring-1 ring-gals-blue-deep/15"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
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
                  <label className={labelClass}>CTA</label>
                  <input
                    className={inputClass}
                    value={draft.cta}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, cta: e.target.value }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <EventCoverPicker
                    value={draft.image}
                    onChange={(image) => setDraft((d) => ({ ...d, image }))}
                    labelClass={labelClass}
                    inputClass={inputClass}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="2. Lugar y cupos"
                hint="Studio con límite o aire libre / sin tope"
              >
                <div className="md:col-span-2">
                  <label className={labelClass}>Tipo de lugar</label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {(
                      [
                        {
                          id: "studio" as const,
                          label: "Studio",
                          hint: "Cupos limitados",
                          place: VENUE_STUDIO,
                          capacity: 12,
                        },
                        {
                          id: "outdoor" as const,
                          label: "Aire libre",
                          hint: "Parque / exterior",
                          place: VENUE_OUTDOOR,
                          capacity: undefined as number | undefined,
                        },
                        {
                          id: "other" as const,
                          label: "Otro",
                          hint: "Escribí el lugar",
                          place: draft.place,
                          capacity: draft.capacity,
                        },
                      ] as const
                    ).map((v) => {
                      const active =
                        v.id === "studio"
                          ? /studio|calle 97|chicó|chico/i.test(draft.place) &&
                            !/aire libre|parque|exterior/i.test(draft.place)
                          : v.id === "outdoor"
                            ? /aire libre|parque|exterior/i.test(draft.place)
                            : !/studio|calle 97|chicó|chico|aire libre|parque|exterior/i.test(
                                draft.place,
                              );
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              place:
                                v.id === "other"
                                  ? d.place || "Otro lugar · Bogotá"
                                  : v.place,
                              capacity:
                                v.id === "studio"
                                  ? d.capacity && d.capacity > 0
                                    ? d.capacity
                                    : 12
                                  : v.id === "outdoor"
                                    ? undefined
                                    : d.capacity,
                            }))
                          }
                          className={`rounded-2xl px-4 py-3.5 text-left transition ${
                            active
                              ? "bg-gals-blue-deep text-white shadow-md"
                              : "bg-white text-gals-ink ring-1 ring-gals-blue-deep/12 hover:bg-gals-blue-soft/40"
                          }`}
                        >
                          <span className="block text-sm font-semibold">
                            {v.label}
                          </span>
                          <span
                            className={`mt-0.5 block text-[11px] ${
                              active ? "text-white/75" : "text-gals-muted"
                            }`}
                          >
                            {v.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Dirección / lugar</label>
                  <input
                    className={inputClass}
                    value={draft.place}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, place: e.target.value }))
                    }
                    placeholder="GAL'S Studio · Calle 97… o Parque…"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Cupos</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((d) => ({ ...d, capacity: undefined }))
                      }
                      className={`rounded-full px-3.5 py-2 text-[11px] font-bold uppercase ${
                        !draft.capacity
                          ? "bg-gals-blue-deep text-white"
                          : "bg-white text-gals-muted ring-1 ring-gals-blue-deep/15"
                      }`}
                    >
                      Sin límite
                    </button>
                    {[8, 12, 15, 20, 25, 30].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() =>
                          setDraft((d) => ({ ...d, capacity: n }))
                        }
                        className={`rounded-full px-3.5 py-2 text-[11px] font-bold uppercase ${
                          draft.capacity === n
                            ? "bg-gals-blue-deep text-white"
                            : "bg-white text-gals-muted ring-1 ring-gals-blue-deep/15"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <label className={labelClass}>Número exacto</label>
                      <input
                        className={inputClass}
                        type="number"
                        min={1}
                        value={draft.capacity ?? ""}
                        placeholder="Vacío = sin límite"
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
                    <p className="pb-2.5 text-xs text-gals-muted">
                      {draft.capacity
                        ? `Máximo ${draft.capacity} inscritas`
                        : "Ideal para aire libre o sin tope"}
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="3. Copy"
                hint="Textos que ve la clienta en la landing y el modal"
              >
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
                  <label className={labelClass}>Pitch del modal (signup)</label>
                  <textarea
                    className={`${inputClass} min-h-[72px]`}
                    value={draft.signupPitch ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, signupPitch: e.target.value }))
                    }
                    placeholder="Texto persuasivo al reservar"
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
              </SectionCard>

              <SectionCard
                title="4. Precio / Mercado Pago"
                hint="Sin monto MP, el lead de pago va a WhatsApp"
              >
                <div>
                  <label className={labelClass}>Precio (texto)</label>
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
                    placeholder="Ej. 60000"
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
                {draft.kind === "paid" && !draft.priceAmount ? (
                  <p className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-900">
                    Falta Monto MP: se registrará como lead y no abrirá checkout.
                  </p>
                ) : null}
                {draft.kind === "free" ? (
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
                ) : (
                  <div>
                    <label className={labelClass}>Cobro</label>
                    <p className="rounded-xl border border-gals-blue-deep/10 bg-gals-blue-soft/50 px-3.5 py-2.5 text-sm text-gals-ink">
                      Con Monto MP → Checkout Mercado Pago.
                    </p>
                  </div>
                )}
                <label className="flex items-center gap-2 text-sm text-gals-ink md:col-span-2">
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
              </SectionCard>

              <SectionCard title="5. Publicación" hint="Visibilidad en /eventos">
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
                      checked={!!draft.published}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          published: e.target.checked,
                        }))
                      }
                    />
                    Publicado en landing
                  </label>
                </div>
              </SectionCard>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {tab === "editor" ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gals-blue-deep/10 bg-white/90 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <a
              href="/eventos"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-gals-blue-deep uppercase underline-offset-2 hover:underline"
            >
              Vista previa landing
            </a>
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
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {deleteTarget ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gals-ink/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
            >
              <p className="font-display text-xl uppercase text-gals-blue-deep">
                Confirmar
              </p>
              <p className="mt-2 text-sm text-gals-muted">
                ¿Eliminar {deleteTarget.type === "event" ? "el evento" : "a"}{" "}
                <strong className="text-gals-ink">{deleteTarget.label}</strong>?
                Esta acción no se puede deshacer.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-full px-4 py-2 text-[11px] font-semibold uppercase text-gals-muted"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (deleteTarget.type === "event") {
                      void removeEvent(deleteTarget.id);
                    } else {
                      void removeReg(deleteTarget.id);
                    }
                  }}
                  className="rounded-full bg-red-600 px-4 py-2 text-[11px] font-bold text-white uppercase"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {emailPreviewHtml ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-gals-ink/45 p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
            >
              <div className="flex items-start justify-between gap-3 border-b border-gals-blue-deep/10 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
                    Preview del correo
                  </p>
                  <p className="truncate text-sm font-semibold text-gals-ink">
                    {emailPreviewSubject}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailPreviewHtml(null)}
                  className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-gals-muted uppercase hover:bg-gals-blue-soft"
                >
                  Cerrar
                </button>
              </div>
              <iframe
                title="Preview email GAL'S"
                srcDoc={emailPreviewHtml}
                className="min-h-[70vh] w-full flex-1 border-0 bg-[#eef1f8]"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.div
            className="fixed right-4 top-4 z-50 max-w-sm rounded-full bg-gals-blue-deep px-4 py-2.5 text-[11px] font-semibold tracking-wide text-white uppercase shadow-lg sm:top-6"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AdminHelperClippy
        storageKey="eventos-admin"
        closedLabel="Guía del panel"
        liveHint={
          pendingPayCount > 0
            ? `${pendingPayCount} inscrita${pendingPayCount === 1 ? "" : "s"} con pago pendiente — revisá Inscritos o Correos`
            : upcomingCount > 0
              ? `${upcomingCount} evento${upcomingCount === 1 ? "" : "s"} próximo${upcomingCount === 1 ? "" : "s"} en la agenda`
              : null
        }
        focusIndex={
          tab === "resumen"
            ? 0
            : tab === "eventos"
              ? 1
              : tab === "inscritos"
                ? 2
                : tab === "correos"
                  ? 3
                  : tab === "comunidad"
                    ? 4
                    : tab === "editor"
                      ? 5
                      : 0
        }
        onSelectTip={(i) => {
          const map: Tab[] = [
            "resumen",
            "eventos",
            "inscritos",
            "correos",
            "comunidad",
            "editor",
          ];
          const next = map[i];
          if (next) setTab(next);
        }}
        tips={[
          {
            chip: "Resumen",
            title: "1 · Resumen",
            body: "El tablero del día: qué urge y qué viene. Empezá acá antes de tocar el resto.",
            actions: [
              "Mirá pendientes de pago y abrí Inscritos desde la alerta",
              "Revisá próximos eventos y cupos llenos",
              "Si hay algo raro, la tarjeta Atención te lleva al lugar",
            ],
          },
          {
            chip: "Eventos",
            title: "2 · Eventos",
            body: "Acá vive el catálogo: publicar, ocultar, duplicar o editar. También el filtro «Hoy» para el día de la clase.",
            actions: [
              "Filtrá Pagos / Gratis o tocá «Hoy»",
              "Publicá u ocultá un evento sin borrarlo",
              "«+ Crear evento» o abrí uno para editarlo en Crear",
            ],
          },
          {
            chip: "Inscritos",
            title: "3 · Inscritos",
            body: "Quienes se anotaron a cada evento. Acá cobrás el estado y ves el precio del cupo.",
            actions: [
              "Filtrá por evento y estado (pendiente pago, pagado…)",
              "Cambiá el estado en la fila; el precio sale como «Pagó…» o «A pagar…»",
              "Agregá a mano con nombre, WhatsApp y email (el email sirve para Correos)",
            ],
          },
          {
            chip: "Correos",
            title: "4 · Correos",
            body: "Avisos del evento por Resend: recordatorio, cobro o info. Sirve para muchas o para una sola.",
            actions: [
              "Elegí evento + estado (o «Todas»)",
              "Usá plantilla o escribí con {{nombre}}, {{evento}}, {{fecha}}…",
              "Lista de envío = inscritos con email; también podés sumar correos extra",
            ],
          },
          {
            chip: "Comunidad",
            title: "5 · Comunidad",
            body: "Invitación al WhatsApp exclusivo Plus/VIP. El botón «Enviar link» manda un correo de bienvenida con el invite.",
            actions: [
              "Sincronizá Bewe o importá CSV (email + plan)",
              "Filtrá Solo Plus/VIP y pendientes de mail",
              "«Ver links» antes de enviar para no mezclar Plus con VIP",
            ],
          },
          {
            chip: "Crear",
            title: "6 · Crear / Editar",
            body: "Formulario del evento. Completá lo esencial, guardá y volvé a Eventos para verlo en la lista.",
            actions: [
              "Título, fecha/hora, lugar y cupos",
              "Si es pago: precio visible + Monto MP (COP) para cobro online",
              "Portada, publicación (sí/no) y Guardar",
            ],
          },
        ]}
      />
    </div>
  );
}
