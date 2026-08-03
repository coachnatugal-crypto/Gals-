"use client";

import { useEffect, useState } from "react";
import { BEWE_BOOK_CLASS, BEWE_CENTER_ID, BEWE_CLASSES_EMBED } from "@/lib/bewe";

/**
 * Reserva / horario embebido (widget Bewe: clases).
 * Sin BW.on('load') — en Next DOMContentLoaded ya pasó.
 */
export function BeweSchedule() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const tryInit = () => {
      if (cancelled) return;

      const el = document.querySelector(BEWE_CLASSES_EMBED);
      if (!window.BW || !el) {
        attempts += 1;
        if (attempts < 40) {
          window.setTimeout(tryInit, 250);
        } else {
          setFailed(true);
        }
        return;
      }

      if (!window.__beweClassesEmbedded) {
        window.BW.init(BEWE_CLASSES_EMBED, {
          center: BEWE_CENTER_ID,
          section: "classes",
          insideHtml: true,
        });
        window.__beweClassesEmbedded = true;
      }

      setReady(true);
    };

    tryInit();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        id="bewe-classes-embed"
        className="min-h-[420px] overflow-hidden rounded-2xl border border-gals-silver/40 bg-white"
      />

      {!ready && !failed ? (
        <p className="text-center text-sm text-gals-muted">
          Cargando horario…
        </p>
      ) : null}

      {failed ? (
        <p className="text-center text-sm text-gals-muted">
          No se pudo cargar el horario. Usa Reservar en el menú.
        </p>
      ) : null}

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          className={`${BEWE_BOOK_CLASS} inline-flex rounded-full border border-gals-blue-deep/30 bg-white px-6 py-3 text-sm font-semibold text-gals-blue-deep transition-transform hover:scale-[1.03]`}
        >
          Reservar clase
        </button>
      </div>
    </div>
  );
}
