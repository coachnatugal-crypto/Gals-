"use client";

import { useEffect } from "react";
import Script from "next/script";

const BEWE_PUBLIC_KEY = "5d655f06a66deffb1c391d9f34d84406";

declare global {
  interface Window {
    iaSdk?: {
      init: (options: {
        data: { pk: string };
        config?: Record<string, unknown>;
      }) => void;
    };
  }
}

function initBewe() {
  if (typeof window === "undefined" || !window.iaSdk) return;
  window.iaSdk.init({
    data: { pk: BEWE_PUBLIC_KEY },
    config: { style: { zIndex: 999999 } },
  });
}

/** Asistente Linda (Bewe) embebido — chat + agendamiento + cotización. */
export function BeweChat() {
  useEffect(() => {
    // Si el script ya estaba cargado (navegación cliente), inicializa igual.
    initBewe();
  }, []);

  return (
    <>
      <div id="ia-sdk-root" />
      <Script
        src="https://storage.googleapis.com/ia-lt-sdk/prod/ia-sdk.umd.js"
        strategy="afterInteractive"
        onLoad={initBewe}
      />
    </>
  );
}
