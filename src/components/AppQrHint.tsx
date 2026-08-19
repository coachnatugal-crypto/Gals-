"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { APP_HOWTO_VIDEO, APP_DOWNLOAD_URL, APP_QR_SRC } from "@/lib/constants";

/**
 * QR → Play Store / app Bewe.
 * “Ver cómo” abre el video explicativo con efecto de expansión.
 */
export function AppQrHint({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <LayoutGroup id="app-qr-hint">
      <div
        className={`flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4 ${className}`}
      >
        <p className="text-center text-sm text-gals-muted sm:text-left">
          Si prefieres, usa la app
        </p>

        <div className="flex items-center gap-3 rounded-2xl border border-gals-silver/50 bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(85,104,148,0.1)]">
          {/* QR: escaneo o clic → Play Store / app */}
          <a
            href={APP_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Descargar la app en Play Store"
            className="shrink-0 transition-transform hover:scale-[1.03]"
          >
            {!open ? (
              <motion.span
                layoutId="app-qr-expand"
                className="relative block h-14 w-14 overflow-hidden rounded-lg bg-white ring-1 ring-gals-blue-deep/15 sm:h-16 sm:w-16"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={APP_QR_SRC}
                  alt="Código QR para descargar la app GAL'S"
                  className="h-full w-full object-contain p-0.5"
                />
              </motion.span>
            ) : (
              <span
                className="relative block h-14 w-14 sm:h-16 sm:w-16"
                aria-hidden
              />
            )}
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

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button
              type="button"
              aria-label="Cerrar"
              className="absolute inset-0 bg-[#1a2a35]/65 backdrop-blur-[3px]"
              onClick={() => setOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative z-[1] flex w-full max-w-[22rem] flex-col overflow-hidden rounded-[1.75rem] bg-gals-cream shadow-[0_28px_80px_rgba(26,42,53,0.45)] sm:max-w-sm"
              initial={{ opacity: 0, scale: 0.82, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
            >
              <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
                <div>
                  <p
                    id={titleId}
                    className="font-display text-sm tracking-wide text-gals-blue-deep uppercase"
                  >
                    Usa la app
                  </p>
                  <p className="mt-0.5 text-xs text-gals-muted">
                    Mira el video o escanea el QR (Play Store)
                  </p>
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

              <motion.div
                layoutId="app-qr-expand"
                className="relative mx-4 overflow-hidden rounded-[1.25rem] bg-black shadow-inner"
              >
                <video
                  className="aspect-[9/16] h-auto max-h-[min(58vh,520px)] w-full object-cover"
                  src={APP_HOWTO_VIDEO}
                  controls
                  playsInline
                  autoPlay
                  preload="metadata"
                />
              </motion.div>

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
                    alt="QR para descargar la app en Play Store"
                    className="h-full w-full object-contain p-1"
                  />
                </a>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-semibold text-gals-ink">
                    Escanea y ve a Play Store
                  </p>
                  <a
                    href={APP_DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex text-sm font-medium text-gals-blue-deep underline-offset-2 hover:underline"
                  >
                    Abrir Play Store →
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LayoutGroup>
  );
}
