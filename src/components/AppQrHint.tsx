"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { APP_HOWTO_VIDEO, APP_DOWNLOAD_URL, APP_QR_SRC } from "@/lib/constants";

type StoreKind = "ios" | "android" | "other";

function detectStore(): StoreKind {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  const iOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (iOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

function storeCopy(kind: StoreKind) {
  // Texto neutro: el link Bewe abre App Store o Play Store según el dispositivo.
  void kind;
  return {
    short: "tienda de apps",
    hint: "Mira el video o escanea el QR para descargar la app",
    scan: "Escanea y descarga la app",
    open: "Descargar ahora →",
    aria: "Descargar la app GAL'S",
  };
}

/**
 * QR → tienda de apps (page.link Bewe).
 * “Ver cómo” abre el video explicativo.
 */
export function AppQrHint({
  className = "",
  labelClassName = "text-gals-muted",
}: {
  className?: string;
  /** Color del texto “Si prefieres…” (útil sobre fondos oscuros). */
  labelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [store, setStore] = useState<StoreKind>("other");
  const titleId = useId();
  const copy = storeCopy(store);

  useEffect(() => {
    setMounted(true);
    setStore(detectStore());
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
    };

    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";

    const preventTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-app-qr-modal-scroll]")) return;
      e.preventDefault();
    };
    document.addEventListener("touchmove", preventTouch, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      style.overflow = prev.overflow;
      style.position = prev.position;
      style.top = prev.top;
      style.left = prev.left;
      style.right = prev.right;
      style.width = prev.width;
      window.scrollTo(0, scrollY);
      document.removeEventListener("touchmove", preventTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const modal = mounted
    ? createPortal(
        <AnimatePresence>
          {open ? (
            <motion.div
              key="app-qr-modal"
              className="fixed inset-0 z-[200] flex items-center justify-center overscroll-none p-4 sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <button
                type="button"
                aria-label="Cerrar"
                className="absolute inset-0 touch-none bg-[#1a2a35]/70 backdrop-blur-[3px]"
                onClick={() => setOpen(false)}
              />

              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                data-app-qr-modal-scroll
                className="relative z-[1] flex max-h-[min(92vh,720px)] w-full max-w-[22rem] flex-col overflow-y-auto overscroll-contain rounded-[1.75rem] bg-gals-cream shadow-[0_28px_80px_rgba(26,42,53,0.45)] sm:max-w-sm"
                initial={{ opacity: 0, scale: 0.82, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 12 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
                  <div>
                    <p
                      id={titleId}
                      className="font-display text-sm tracking-wide text-gals-blue-deep uppercase"
                    >
                      Usa la app
                    </p>
                    <p className="mt-0.5 text-xs text-gals-muted">{copy.hint}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gals-blue-deep/10 text-gals-blue-deep transition-colors hover:bg-gals-blue-deep/15"
                    aria-label="Cerrar"
                  >
                    <span className="text-lg leading-none" aria-hidden>
                      ×
                    </span>
                  </button>
                </div>

                <div className="relative mx-4 overflow-hidden rounded-[1.25rem] bg-black shadow-inner">
                  <video
                    className="aspect-[9/16] h-auto max-h-[min(52vh,480px)] w-full object-cover"
                    src={APP_HOWTO_VIDEO}
                    controls
                    playsInline
                    autoPlay
                    preload="metadata"
                  />
                </div>

                <div className="flex items-center gap-3 px-4 py-4">
                  <a
                    href={APP_DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-gals-blue-deep/15"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={APP_QR_SRC}
                      alt={`QR para descargar la app (${copy.short})`}
                      className="h-full w-full object-contain p-1"
                    />
                  </a>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-semibold text-gals-ink">
                      {copy.scan}
                    </p>
                    <a
                      href={APP_DOWNLOAD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex text-sm font-medium text-gals-blue-deep underline-offset-2 hover:underline"
                    >
                      {copy.open}
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <LayoutGroup id="app-qr-hint">
      <div
        className={`flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4 ${className}`}
      >
        <p className={`text-center text-sm sm:text-left ${labelClassName}`}>
          Instala la app y escanea el QR
        </p>

        <div className="flex items-center gap-3 rounded-2xl border border-gals-silver/50 bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(85,104,148,0.1)]">
          <a
            href={APP_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={copy.aria}
            className="shrink-0 transition-transform hover:scale-[1.03]"
          >
            <span className="relative block h-14 w-14 overflow-hidden rounded-lg bg-white ring-1 ring-gals-blue-deep/15 sm:h-16 sm:w-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={APP_QR_SRC}
                alt="Código QR para descargar la app GAL'S"
                className="h-full w-full object-contain p-0.5"
              />
            </span>
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="pr-1 text-left text-xs font-semibold leading-snug text-gals-blue-deep transition-opacity hover:opacity-80 sm:text-sm"
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            Escanea el QR
            <span className="mt-0.5 block font-normal text-gals-muted">
              Ver cómo hacerlo →
            </span>
          </button>
        </div>
      </div>

      {modal}
    </LayoutGroup>
  );
}
