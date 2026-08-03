"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import { BEWE_BOOK_CLASS } from "@/lib/bewe";
import { ImageSticker, STICKER_ASSETS } from "@/components/capsules/Stickers";
import { BeweSchedule } from "@/components/BeweSchedule";

export function Schedule() {
  return (
    <section
      id="horario"
      className="relative overflow-x-clip bg-gals-mist py-20 md:py-28"
    >
      {/* Lado opuesto al tapete de Plans */}
      <ImageSticker
        src={STICKER_ASSETS.matchaTea}
        className="top-12 left-2 z-10 hidden sm:block lg:left-12"
        size={68}
        rotate={-12}
        float
      />
      <div
        className="pointer-events-none absolute top-0 left-1/2 z-[1] h-full w-screen max-w-[100vw] -translate-x-1/2"
        aria-hidden
      >
        <ImageSticker
          src={STICKER_ASSETS.hongos}
          className="top-2 right-0 opacity-90"
          size={120}
          height={200}
          rotate={0}
          float
          delay={0.1}
          blend={false}
          objectPosition="right"
        />
      </div>
      <ImageSticker
        src={STICKER_ASSETS.flor}
        className="top-12 left-3 z-10 sm:left-6"
        size={40}
        rotate={-14}
        float
        delay={0.18}
        blend={false}
      />

      <div className="relative z-20 mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <div className="relative max-w-xl pr-16 sm:pr-28 md:pr-40">
            <p className="text-sm font-semibold tracking-[0.25em] text-gals-blue-deep uppercase">
              Agenda
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-gals-ink uppercase md:text-5xl">
              Horario de clases
            </h2>
            <p className="mt-3 text-base font-medium leading-snug text-gals-ink/85 md:text-lg">
              Reserva tu clase en vivo. El horario está conectado con la agenda
              del studio.
            </p>
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
            Elige tu clase en el horario o abre el reservador de Bewe.
          </p>
          <button
            type="button"
            className={`${BEWE_BOOK_CLASS} inline-flex self-start rounded-full bg-gals-blue px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]`}
          >
            Reservar clase
          </button>
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
