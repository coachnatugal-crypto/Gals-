"use client";

import { useEffect, useState } from "react";
import { BEWE_BOOK_CLASS, BEWE_CENTER_ID, BEWE_CLASSES_EMBED } from "@/lib/bewe";
import { AppQrHint } from "@/components/AppQrHint";

/**
 * Reserva / horario embebido (widget Bewe: clases).
 * Re-init en cada mount: al llegar desde /tree (SPA) el nodo nace vacío
 * pero el flag global podía quedar en true y dejar la caja en blanco.
 */
export function BeweSchedule() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const scrollToHorario = () => {
      if (window.location.hash !== "#horario") return;
      window.requestAnimationFrame(() => {
        document
          .getElementById("horario")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

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

      const empty = el.childElementCount === 0;
      if (empty) {
        window.__beweClassesEmbedded = false;
        window.BW.init(BEWE_CLASSES_EMBED, {
          center: BEWE_CENTER_ID,
          section: "classes",
          insideHtml: true,
        });
        window.__beweClassesEmbedded = true;
      }

      if (!cancelled) {
        setReady(true);
        scrollToHorario();
      }
    };

    tryInit();

    return () => {
      cancelled = true;
      // Permite reinicializar si el usuario vuelve a la home vía SPA
      window.__beweClassesEmbedded = false;
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

      <div className="flex flex-col items-center gap-4 px-2 pt-1 pb-2 sm:gap-5">
        <button
          type="button"
          className={`${BEWE_BOOK_CLASS} inline-flex rounded-full bg-gals-blue px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]`}
        >
          Reservar clase
        </button>
        <AppQrHint />
      </div>
    </div>
  );
}
