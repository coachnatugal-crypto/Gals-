"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import { WHATSAPP_URL } from "@/lib/constants";
import { ImageSticker, STICKER_ASSETS } from "@/components/capsules/Stickers";
import { BeweSchedule } from "@/components/BeweSchedule";

export function Schedule() {
  return (
    <section
      id="horario"
      className="relative overflow-visible bg-gals-mist py-20 md:py-28"
    >
      {/* Lado opuesto al tapete de Plans */}
      <ImageSticker
        src={STICKER_ASSETS.matchaTea}
        className="top-12 left-2 hidden sm:block lg:left-12"
        size={68}
        rotate={-12}
        float
      />

      <div className="relative z-20 mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium tracking-[0.25em] text-gals-blue uppercase">
                Agenda
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gals-ink md:text-4xl">
                Horario de clases
              </h2>
              <p className="mt-2 text-gals-muted">
                Reserva en vivo desde acá. El calendario está conectado con
                nuestra agenda.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-gals-silver/40 bg-white p-2 shadow-[0_12px_40px_rgba(85,104,148,0.08)] sm:p-4">
            <BeweSchedule />
          </div>
        </FadeIn>

        <FadeIn
          delay={0.15}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-gals-muted">
            ¿Prefieres que te ayudemos? Escríbenos y reservamos tu cupo contigo.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex self-start rounded-full bg-gals-blue px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Reservar por WhatsApp
          </a>
        </FadeIn>
      </div>

      <ImageSticker
        src={STICKER_ASSETS.pesa}
        className="bottom-0 right-[14%] translate-y-1/2"
        size={64}
        rotate={16}
        float
      />
    </section>
  );
}
