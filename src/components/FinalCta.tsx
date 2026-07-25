"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import {
  ADDRESS,
  EMAIL,
  PHONE_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/constants";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gals-blue-soft py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full border border-gals-blue/30" />
        <div className="absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-gals-blue/20 blur-3xl" />
      </div>

      <div className="relative z-20 mx-auto max-w-3xl px-5 text-center md:px-8">
        <FadeIn>
          <h2 className="font-display text-4xl tracking-tight text-gals-ink uppercase md:text-5xl">
            Contáctanos
          </h2>
          <p className="mt-2 font-script text-4xl text-gals-blue-deep">
            ¿lista para ser parte?
          </p>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gals-muted">
            Empieza con la Experience Week o escríbenos: planes, horarios,
            talleres y lo que necesites saber antes de reservar.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-gals-blue px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              WhatsApp
            </a>
            <a
              href="#planes"
              className="inline-flex rounded-full border border-gals-blue-deep/25 bg-white px-8 py-3.5 text-sm font-semibold text-gals-ink transition-colors hover:bg-gals-mist"
            >
              Ver planes
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-16 space-y-2 text-sm text-gals-muted">
          <p>{ADDRESS}</p>
          <p>
            <a
              href={`mailto:${EMAIL}`}
              className="text-gals-blue-deep hover:underline"
            >
              {EMAIL}
            </a>
            {" · "}
            <a href={WHATSAPP_URL} className="text-gals-blue-deep hover:underline">
              {PHONE_DISPLAY}
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
