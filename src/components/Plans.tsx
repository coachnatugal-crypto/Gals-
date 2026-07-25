"use client";

import { PLANS, WHATSAPP_URL } from "@/lib/constants";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import {
  ImageSticker,
  MoonSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";

export function Plans() {
  return (
    <>
      <section
        id="planes"
        className="relative overflow-visible bg-white py-20 md:py-28"
      >
      {/* Fuera del bloque de título en mobile */}
      <ImageSticker
        src={STICKER_ASSETS.bola}
        className="top-16 left-2 hidden sm:block lg:left-10"
        size={100}
        rotate={-16}
        float
      />
      <ImageSticker
        src={STICKER_ASSETS.camara}
        className="top-20 right-2 hidden sm:block lg:right-12"
        size={76}
        rotate={14}
        float
        delay={0.12}
      />
      <MoonSticker
        className="absolute top-28 left-[42%] z-[2] hidden md:block"
        size={30}
        rotate={8}
        color="var(--gals-blue)"
        float
      />

      <div className="relative z-20 mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <p className="text-sm font-medium tracking-[0.25em] text-gals-blue uppercase">
            Membresías GAL&apos;S
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl tracking-tight text-gals-ink uppercase md:text-5xl">
            Elige cómo quieres
          </h2>
          <p className="mt-1 font-script text-4xl text-gals-blue-deep md:text-5xl">
            vivir GAL&apos;S
          </p>
          <p className="mt-4 max-w-xl text-lg text-gals-muted">
            Empezá con la Semana GAL&apos;S. Después: Ritual (tu espacio),
            Transformación (acompañamiento) o Ilimitada (círculo completo). La
            Transformación es la que más eligen.
          </p>
        </FadeIn>

        <Stagger
          className="relative mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          stagger={0.08}
        >
          {PLANS.map((plan) => (
            <StaggerItem
              key={plan.id}
              className={plan.featured ? "md:col-span-2 xl:col-span-1" : ""}
            >
              <article
                className={`flex h-full flex-col rounded-[1.75rem] p-7 md:p-8 ${
                  plan.featured
                    ? "bg-gals-blue-mid text-white shadow-[0_12px_40px_rgba(107,127,176,0.35)]"
                    : "bg-gals-mist text-gals-ink"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-xs font-semibold tracking-[0.2em] uppercase ${
                        plan.featured ? "text-white/75" : "text-gals-blue-deep"
                      }`}
                    >
                      {plan.tag}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold">{plan.name}</h3>
                  </div>
                  {plan.featured && (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                      ⭐ Popular
                    </span>
                  )}
                </div>

                <p
                  className={`mt-4 text-sm ${
                    plan.featured ? "text-white/80" : "text-gals-muted"
                  }`}
                >
                  {plan.classes}
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {plan.price}
                </p>
                <p
                  className={`mt-4 flex-1 leading-relaxed ${
                    plan.featured ? "text-white/90" : "text-gals-muted"
                  }`}
                >
                  {plan.description}
                </p>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.03] ${
                    plan.featured
                      ? "bg-white text-gals-blue-deep"
                      : "bg-gals-blue text-white"
                  }`}
                >
                  {plan.cta}
                </a>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      </section>

      <div
        className="overflow-hidden bg-gals-blue-deep py-3 md:py-4"
        aria-label="GAL'S es comunidad"
      >
        <div className="animate-marquee flex w-max gap-6 whitespace-nowrap">
          {Array.from({ length: 8 }, (_, index) => (
            <span
              key={index}
              className="flex items-center gap-6 font-display text-2xl font-semibold tracking-tight text-white uppercase sm:text-3xl md:text-4xl"
            >
              COMMUNITY IS QUEEN EN GAL&apos;S
              <span className="text-white/45" aria-hidden>
                /
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
