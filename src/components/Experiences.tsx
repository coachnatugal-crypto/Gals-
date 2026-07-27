"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import { WHATSAPP_URL } from "@/lib/constants";

export function Experiences() {
  return (
    <section
      id="experiencias"
      className="relative overflow-hidden bg-gals-blue-mid py-20 text-white md:py-28"
    >
      <div className="relative z-20 mx-auto max-w-3xl px-5 md:px-8">
        <div className="space-y-6">
          <FadeIn>
            <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-7 backdrop-blur-sm">
              <h3 className="text-xl font-semibold">Clases entre semana</h3>
              <p className="mt-3 leading-relaxed text-white/85">
                Una mini experiencia diaria: consciencia, movimiento y fuerza,
                estiramiento, olores que calman y reflexión del día. Props: mat,
                pesas y bloque.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-7 backdrop-blur-sm">
              <h3 className="text-xl font-semibold">Wellness Experiences</h3>
              <p className="mt-3 leading-relaxed text-white/85">
                Espacios de ~2 horas con invitadas especiales para ir a la
                profundidad. Integramos Yin, meditación, respiración,
                aromaterapia, alimentación consciente, espiritualidad y sanación
                con sonido.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.18} className="text-center">
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
    </section>
  );
}
