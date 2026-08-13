"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const BG = "/media/eventos/popup-eventos.jpg";

type Props = {
  /** Clave sessionStorage para no repetir en la misma sesión. */
  storageKey?: string;
  /** Texto del botón secundario. */
  dismissLabel?: string;
};

/** Popup de entrada: invita a inscribirse en eventos GAL'S. */
export function ProgramEventsPopup({
  storageKey = "gals-programa-eventos-popup-seen",
  dismissLabel = "Ahora no, seguir con el reto",
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "1") return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setOpen(true), 550);
    return () => window.clearTimeout(t);
  }, [storageKey]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function dismiss() {
    setOpen(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 bg-[#1a2a35]/55 backdrop-blur-[2px]"
            onClick={dismiss}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="programa-eventos-popup-title"
            className="relative z-[1] w-full max-w-md overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_rgba(26,42,53,0.35)]"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BG}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-[#1a2a35]/70 via-[#1a2a35]/55 to-[#1a2a35]/85"
              aria-hidden
            />

            <div className="relative px-5 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7">
              <button
                type="button"
                onClick={dismiss}
                className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg text-white backdrop-blur-sm transition hover:bg-white/25"
                aria-label="Cerrar popup"
              >
                ✕
              </button>

              <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-white/75 uppercase">
                Eventos GAL&apos;S
              </p>
              <p
                id="programa-eventos-popup-title"
                className="mt-2 pr-10 font-display text-2xl tracking-tight text-white uppercase sm:text-3xl"
              >
                Inscríbete a los eventos
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
                Vive una gran experiencia con la comunidad: espacios para
                reconectar contigo, moverte con intención y compartir energía
                con otras mujeres.
              </p>

              <Link
                href="/eventos"
                onClick={dismiss}
                className="mt-6 flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-gals-blue-deep transition-transform hover:scale-[1.02]"
              >
                Quiero inscribirme →
              </Link>

              <button
                type="button"
                onClick={dismiss}
                className="mt-3 w-full py-2 text-center text-sm font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline"
              >
                {dismissLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
