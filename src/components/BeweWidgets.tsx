"use client";

import { useEffect } from "react";
import Script from "next/script";
import {
  BEWE_BOOK_CLASS,
  BEWE_CENTER_ID,
  BEWE_FORM_CLASS,
  BEWE_LOGIN_CLASS,
  BEWE_PACKS_CLASS,
  BEWE_SUBS_CLASS,
  BEWE_WIDGET_ROOT,
  BEWE_WIDGET_SCRIPT,
  openBeweWidget,
} from "@/lib/bewe";

/**
 * Delegación de clic: BW.on('click', selector) solo engancha el primer match.
 */
function wireClickWidgets() {
  if (typeof window === "undefined" || !window.BW || window.__beweClickWired) {
    return;
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest(`.${BEWE_BOOK_CLASS}`)) {
      event.preventDefault();
      openBeweWidget({ section: "classes" });
      return;
    }

    if (target.closest(`.${BEWE_LOGIN_CLASS}`)) {
      event.preventDefault();
      openBeweWidget({ path: "login" });
      return;
    }

    if (target.closest(`.${BEWE_SUBS_CLASS}`)) {
      event.preventDefault();
      openBeweWidget({ path: "subscriptions" });
      return;
    }

    if (target.closest(`.${BEWE_PACKS_CLASS}`)) {
      event.preventDefault();
      openBeweWidget({ path: "packs" });
      return;
    }

    if (target.closest(`.${BEWE_FORM_CLASS}`)) {
      event.preventDefault();
      openBeweWidget({ path: "form" });
    }
  });

  window.__beweClickWired = true;
}

/** Carga bewidget.js y conecta botones Bewe (incluye form de leads). */
export function BeweWidgets() {
  useEffect(() => {
    wireClickWidgets();
  }, []);

  return (
    <>
      <div id="bewe-widget-root" />
      <Script
        src={BEWE_WIDGET_SCRIPT}
        strategy="afterInteractive"
        onLoad={wireClickWidgets}
      />
    </>
  );
}

// Re-export por si algún import antiguo espera open aquí
export { openBeweWidget, BEWE_CENTER_ID, BEWE_WIDGET_ROOT };
