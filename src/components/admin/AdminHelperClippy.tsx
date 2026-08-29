"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type HelperTip = {
  /** Texto corto del chip (Resumen, Eventos…) */
  chip: string;
  title: string;
  /** Resumen de la sección */
  body: string;
  /** Acciones concretas que se pueden hacer acá */
  actions?: string[];
};

type Props = {
  tips: HelperTip[];
  storageKey?: string;
  closedLabel?: string;
  /** Índice ligado a la pestaña activa */
  focusIndex?: number;
  /** Pista del momento (ej. “3 pendientes de pago”) */
  liveHint?: string | null;
  /** Al elegir un tip/chip, el padre puede cambiar de pestaña */
  onSelectTip?: (index: number) => void;
};

/**
 * Ayudante flotante tipo Clippy: guía completa del panel admin.
 */
export function AdminHelperClippy({
  tips,
  storageKey,
  closedLabel = "Ayuda",
  focusIndex,
  liveHint,
  onSelectTip,
}: Props) {
  const key = storageKey ? `gals-helper:${storageKey}` : null;
  const [open, setOpen] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [wiggle, setWiggle] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    if (!key || typeof window === "undefined") return;
    const saved = window.localStorage.getItem(key);
    if (saved === "0") setOpen(false);
  }, [key]);

  useEffect(() => {
    if (focusIndex == null || tips.length === 0) return;
    const next = ((focusIndex % tips.length) + tips.length) % tips.length;
    setTipIndex(next);
  }, [focusIndex, tips.length]);

  useEffect(() => {
    if (open || tips.length === 0) {
      setShowNudge(false);
      return;
    }
    const nudge = window.setTimeout(() => setShowNudge(true), 1800);
    const pulse = window.setInterval(() => {
      setWiggle(true);
      window.setTimeout(() => setWiggle(false), 700);
    }, 9000);
    return () => {
      window.clearTimeout(nudge);
      window.clearInterval(pulse);
    };
  }, [open, tips.length]);

  function goTo(i: number) {
    const next = ((i % tips.length) + tips.length) % tips.length;
    setTipIndex(next);
    onSelectTip?.(next);
  }

  function toggle() {
    setOpen((v) => {
      const next = !v;
      if (key && typeof window !== "undefined") {
        window.localStorage.setItem(key, next ? "1" : "0");
      }
      if (next) setShowNudge(false);
      return next;
    });
  }

  if (tips.length === 0) return null;

  const tip = tips[tipIndex % tips.length];
  const step = tipIndex + 1;

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-40 flex max-w-[min(100vw-2rem,23rem)] flex-col items-end gap-2 sm:right-6 sm:bottom-6">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key={`tip-${tipIndex}`}
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="pointer-events-auto w-full overflow-hidden rounded-2xl border border-gals-blue-deep/15 bg-white shadow-[0_18px_50px_rgba(85,104,148,0.22)] ring-1 ring-white"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-gals-blue-deep to-[#4a5d8a] px-4 py-3 text-white">
              <motion.div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg"
                animate={{ rotate: [0, -8, 8, -4, 0], y: [0, -2, 0] }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                aria-hidden
              >
                ✦
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold tracking-[0.18em] text-white/70 uppercase">
                  Asistente GAL&apos;S · {step}/{tips.length}
                </p>
                <p className="truncate text-sm font-semibold">{tip.title}</p>
              </div>
              <button
                type="button"
                onClick={toggle}
                className="rounded-full px-2 py-1 text-sm text-white/80 hover:bg-white/15"
                aria-label="Minimizar asistente"
              >
                −
              </button>
            </div>

            <div className="px-4 py-3.5">
              {liveHint ? (
                <p className="mb-2.5 rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-medium leading-snug text-amber-950 ring-1 ring-amber-200/80">
                  Ahora: {liveHint}
                </p>
              ) : null}

              <p className="text-sm leading-relaxed text-gals-muted">
                {tip.body}
              </p>

              {tip.actions && tip.actions.length > 0 ? (
                <ul className="mt-2.5 space-y-1.5">
                  {tip.actions.map((action) => (
                    <li
                      key={action}
                      className="flex gap-2 text-[12px] leading-snug text-gals-ink"
                    >
                      <span
                        className="mt-0.5 text-gals-blue-deep"
                        aria-hidden
                      >
                        ▸
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <p className="mt-3 text-[10px] font-semibold tracking-wide text-gals-muted uppercase">
                Ir a la sección
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {tips.map((t, i) => (
                  <button
                    key={t.chip}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase transition ${
                      i === tipIndex
                        ? "bg-gals-blue-deep text-white"
                        : "bg-gals-blue-soft/80 text-gals-blue-deep hover:bg-gals-blue-soft"
                    }`}
                  >
                    {t.chip}
                  </button>
                ))}
              </div>

              {tips.length > 1 ? (
                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => goTo(tipIndex - 1)}
                    className="text-[11px] font-semibold text-gals-blue-deep uppercase"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(tipIndex + 1)}
                    className="rounded-full bg-gals-blue-soft/70 px-3 py-1 text-[11px] font-bold text-gals-blue-deep uppercase"
                  >
                    Siguiente
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-auto relative flex items-center gap-2">
        <AnimatePresence>
          {!open && showNudge ? (
            <motion.button
              type="button"
              onClick={toggle}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="rounded-full border border-gals-blue-deep/15 bg-white px-3 py-1.5 text-[11px] font-semibold text-gals-blue-deep shadow-md"
            >
              {closedLabel} — tocá acá
            </motion.button>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={toggle}
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gals-blue-deep text-lg text-white shadow-[0_12px_30px_rgba(85,104,148,0.4)]"
          aria-label={open ? "Ocultar asistente" : "Mostrar asistente"}
          title="Asistente GAL'S"
          animate={
            wiggle && !open
              ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.08, 1] }
              : { scale: 1 }
          }
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.55 }}
        >
          {!open ? (
            <span className="absolute inset-0 animate-ping rounded-full bg-gals-blue-deep/35" />
          ) : null}
          <span className="relative z-10">{open ? "✦" : "?"}</span>
        </motion.button>
      </div>
    </div>
  );
}

export function PanelGuide({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-gals-blue-soft/40 px-4 py-3 text-sm text-gals-ink ring-1 ring-gals-blue-deep/10">
      <p className="font-semibold">{title}</p>
      <div className="mt-1.5 leading-relaxed text-gals-muted">{children}</div>
    </div>
  );
}
