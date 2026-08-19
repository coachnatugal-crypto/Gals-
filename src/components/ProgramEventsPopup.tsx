"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/constants";

const BG = "/media/eventos/popup-eventos.jpg";

type Props = {
  /** Clave sessionStorage para no repetir en la misma sesión. */
  storageKey?: string;
  /**
   * `enter`: al cargar.
   * `end`: al llegar a `#page-end`.
   * `enter-and-end`: ambos (mismo popup).
   */
  trigger?: "enter" | "end" | "enter-and-end";
};

/** Popup: invita a la Semana GAL'S y a la comunidad. */
export function ProgramEventsPopup({
  storageKey = "gals-programa-eventos-popup-seen",
  trigger = "enter",
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const alreadySeen = () => {
      try {
        return sessionStorage.getItem(storageKey) === "1";
      } catch {
        return false;
      }
    };

    if (alreadySeen()) return;

    const show = () => {
      if (alreadySeen()) return;
      setOpen(true);
    };

    const cleanups: Array<() => void> = [];

    if (trigger === "enter" || trigger === "enter-and-end") {
      const t = window.setTimeout(show, 550);
      cleanups.push(() => window.clearTimeout(t));
    }

    if (trigger === "end" || trigger === "enter-and-end") {
      const target = document.getElementById("page-end");
      if (target) {
        let shownByEnd = false;
        const io = new IntersectionObserver(
          (entries) => {
            const hit = entries.some((e) => e.isIntersecting);
            if (!hit || shownByEnd || alreadySeen()) return;
            shownByEnd = true;
            show();
            io.disconnect();
          },
          { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
        );
        io.observe(target);
        cleanups.push(() => io.disconnect());
      }
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [storageKey, trigger]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      width: style.width,
    };
    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    return () => {
      style.overflow = prev.overflow;
      style.position = prev.position;
      style.top = prev.top;
      style.width = prev.width;
      window.scrollTo(0, scrollY);
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
              className="absolute inset-0 bg-gradient-to-b from-[#1a2a35]/55 via-[#1a2a35]/45 to-[#1a2a35]/88"
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
                Experiencia GALS
              </p>
              <p
                id="programa-eventos-popup-title"
                className="mt-2 pr-10 font-display text-3xl tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
              >
                Vive tu Semana GALS
              </p>

              <div className="mt-7 flex flex-col gap-3">
                <Link
                  href="/#planes"
                  onClick={dismiss}
                  className="flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-gals-blue-deep transition-transform hover:scale-[1.02]"
                >
                  Ser parte de la Semana GALS
                </Link>
                <a
                  href={WHATSAPP_COMMUNITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismiss}
                  className="flex w-full items-center justify-center rounded-full border border-white/60 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-[1.02] hover:bg-white/15"
                >
                  Unirme a la comunidad gratis
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
