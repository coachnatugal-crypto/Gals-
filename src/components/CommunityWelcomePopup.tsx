"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/constants";

const STORAGE_KEY = "gals-community-popup-seen";
const BG = "/media/community/welcome-popup.jpg";

export function CommunityWelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setOpen(true), 450);
    return () => window.clearTimeout(t);
  }, []);

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
      sessionStorage.setItem(STORAGE_KEY, "1");
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
            aria-labelledby="community-popup-title"
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
              className="absolute inset-0 bg-gradient-to-b from-[#1a2a35]/72 via-[#1a2a35]/55 to-[#1a2a35]/82"
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

              <p
                id="community-popup-title"
                className="mt-6 pr-10 font-display text-2xl tracking-tight text-white uppercase sm:text-3xl"
              >
                Bienvenida a GAL&apos;S 🩶
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
                Antes de que sigas explorando, únete gratis a nuestra comunidad
                y recibe rutinas y recetas directo a tu WhatsApp
              </p>

              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="mt-6 flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-gals-blue-deep transition-transform hover:scale-[1.02]"
              >
                Quiero unirme gratis
              </a>

              <button
                type="button"
                onClick={dismiss}
                className="mt-3 w-full py-2 text-center text-sm font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline"
              >
                Seguir explorando
              </button>

              <p className="mt-4 text-center font-script text-xl text-white sm:text-2xl">
                ¡Únete a nuestra comunidad! 💗
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
