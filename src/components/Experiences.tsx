"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import { COMMUNITY_BENEFITS, WHATSAPP_URL } from "@/lib/constants";

export function Experiences() {
  return (
    <section
      id="experiencias"
      className="relative overflow-hidden bg-gals-blue-mid py-20 text-white md:py-28"
    >
      <div className="relative z-20 mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto grid max-w-4xl items-start gap-12 text-center lg:max-w-none lg:grid-cols-2 lg:gap-20 lg:text-left">
          <FadeIn>
            <p className="text-sm font-medium tracking-[0.25em] text-white/70 uppercase">
              Experiencias de bienestar
            </p>
            <h2 className="mt-4 font-display text-3xl tracking-tight uppercase sm:text-4xl md:text-5xl">
              Transformación
            </h2>
            <p className="mt-1 font-script text-4xl text-gals-blue-soft md:text-5xl">
              real, bb
            </p>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/85 lg:mx-0">
              GAL&apos;S es una comunidad que se construye entre mujeres. El
              movimiento se combina con herramientas que elevan tu bienestar y
              profundizan tu conexión contigo.
            </p>
            <ul className="mx-auto mt-8 max-w-md space-y-3 text-left lg:mx-0">
              {COMMUNITY_BENEFITS.map((item) => (
                <li key={item} className="flex gap-3 text-white/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>

          <div className="space-y-6 text-left">
            <FadeIn delay={0.1}>
              <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-7 backdrop-blur-sm">
                <h3 className="text-xl font-semibold">Clases entre semana</h3>
                <p className="mt-3 leading-relaxed text-white/85">
                  Una mini experiencia diaria: consciencia, movimiento y fuerza,
                  estiramiento, olores que calman y reflexión del día. Props:
                  mat, pesas y bloque.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.18}>
              <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-7 backdrop-blur-sm">
                <h3 className="text-xl font-semibold">Wellness Experiences</h3>
                <p className="mt-3 leading-relaxed text-white/85">
                  Espacios de ~2 horas con invitadas especiales para ir a la
                  profundidad. Integramos Yin, meditación, respiración,
                  aromaterapia, alimentación consciente, espiritualidad y
                  sanación con sonido.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.24} className="text-center lg:text-left">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gals-blue-deep transition-transform hover:scale-[1.03]"
              >
                Agendar
              </a>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
