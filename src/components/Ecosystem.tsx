"use client";

import { ECOSYSTEM } from "@/lib/constants";
import { BEWE_SUBS_CLASS } from "@/lib/bewe";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";

export function Ecosystem() {
  return (
    <section id="servicios" className="bg-gals-mist py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <p className="text-sm font-medium tracking-[0.25em] text-gals-blue uppercase">
            Servicios destacados
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-gals-ink md:text-5xl">
            Conoce lo que vivís en GAL&apos;S
          </h2>
          <p className="mt-4 max-w-xl text-lg text-gals-muted">
            Pilates · Sculpt · Yoga · Wellness Experiences. El movimiento abre
            la puerta; el ecosistema te acompaña a construir hábitos sostenibles.
          </p>
        </FadeIn>

        <Stagger
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {ECOSYSTEM.map((item) => (
            <StaggerItem key={item.id}>
              <article className="group flex h-full flex-col rounded-[1.75rem] bg-white p-7 shadow-[0_8px_30px_rgba(42,147,187,0.06)] transition-transform duration-300 hover:-translate-y-1">
                <span className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gals-blue-soft text-sm font-semibold text-gals-blue-deep">
                  {item.title.charAt(0)}
                </span>
                <h3 className="text-xl font-semibold text-gals-ink">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-gals-muted">
                  {item.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn className="mt-12 text-center" delay={0.1}>
          <button
            type="button"
            className={`${BEWE_SUBS_CLASS} inline-flex rounded-full bg-gals-blue px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]`}
          >
            Quiero unirme
          </button>
        </FadeIn>
      </div>
    </section>
  );
}
