"use client";

import { useEffect, useRef, useState } from "react";

const BEWE_WIDGET_SRC = "https://web.bewe.co/widget/bewidget.js";
/** Identificador del centro en Bewe (mismo que Linda: ai.bewe.co/be-well-club). */
const BEWE_SITE_NAME = "be-well-club";

type BeweInitConfig = {
  siteName?: string;
  center?: string;
  section?: string;
  insideHtml?: boolean;
  path?: string;
  stylesConfig?: Record<string, string>;
};

declare global {
  interface Window {
    BW?: {
      init: (el: HTMLElement | string, config: BeweInitConfig) => void;
    };
  }
}

function loadBeweWidget(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    if (window.BW) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${BEWE_WIDGET_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("bewe-widget-load-error")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = BEWE_WIDGET_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("bewe-widget-load-error"));
    document.body.appendChild(script);
  });
}

/**
 * Calendario real de clases embebido desde Bewe (sección "classes").
 * El script es pesado (~6MB), así que se carga sólo cuando la sección
 * se acerca al viewport para no penalizar la carga inicial.
 */
export function BeweSchedule() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let cancelled = false;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      setStatus("loading");
      loadBeweWidget()
        .then(() => {
          if (cancelled || !containerRef.current || !window.BW) return;
          window.BW.init(containerRef.current, {
            siteName: BEWE_SITE_NAME,
            section: "classes",
            insideHtml: true,
          });
          setStatus("ready");
        })
        .catch(() => {
          if (!cancelled) setStatus("error");
        });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full">
      {status === "loading" && (
        <div className="flex min-h-[320px] items-center justify-center text-sm text-gals-muted">
          Cargando horario…
        </div>
      )}
      {status === "error" && (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm text-gals-muted">
            No pudimos cargar el calendario en vivo. Escríbenos y te ayudamos a
            reservar.
          </p>
        </div>
      )}
      <div
        ref={containerRef}
        className="bewe-schedule-widget w-full"
        style={{ minHeight: status === "ready" ? undefined : 0 }}
      />
    </div>
  );
}
