"use client";

import { WHATSAPP_URL } from "@/lib/constants";

/**
 * Horario embebido Bewe.
 * El widget público (bewidget.js) falla al resolver el centro/theme
 * (`color-base` undefined) y rompe la consola. Hasta tener siteName/center
 * correctos desde Bewe, mostramos reserva por WhatsApp.
 */
export function BeweSchedule() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-2xl border border-gals-silver/40 bg-gals-mist px-6 py-10 text-center">
      <p className="max-w-md text-sm text-gals-muted md:text-base">
        Mira el horario y reserva tu cupo por WhatsApp. Te confirmamos la clase
        en minutos.
      </p>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-full bg-gals-blue px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
      >
        Ver horario / Reservar
      </a>
    </div>
  );
}
