"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { BEWE_BOOK_CLASS } from "@/lib/bewe";
import { ImageSticker, STICKER_ASSETS } from "@/components/capsules/Stickers";

const CARDS = [
  {
    title: "Clases entre semana",
    body: "Una mini experiencia diaria: consciencia, movimiento y fuerza, estiramiento, olores que calman y reflexión del día. Props: mat, pesas y bloque.",
    image: "/media/experiencias/clases-entre-semana.jpg",
    imagePosition: "object-[center_20%]",
  },
  {
    title: "Wellness Experiences",
    body: "Espacios de ~2 horas con invitadas especiales para ir a la profundidad. Integramos Yin, meditación, respiración, aromaterapia, alimentación consciente, espiritualidad y sanación con sonido.",
    image: "/media/experiencias/wellness-experiences.jpg",
    imagePosition: "object-[center_35%]",
  },
] as const;

export function Experiences() {
  return (
    <section
      id="experiencias"
      className="relative overflow-hidden bg-gals-blue-mid py-20 text-white md:py-20"
    >
      <ImageSticker
        src={STICKER_ASSETS.pesa}
        className="top-0 left-[8%] z-10 -translate-y-1/2"
        size={64}
        rotate={-14}
        float
      />

      <div className="relative z-20 mx-auto max-w-3xl px-5 md:max-w-5xl md:px-8">
        <FadeIn>
          <p className="text-center text-sm font-semibold tracking-[0.22em] text-white/75 uppercase">
            En el studio
          </p>
          <h2 className="mt-2 text-center font-display text-3xl tracking-tight uppercase md:text-4xl">
            Experiencias GAL&apos;S
          </h2>
        </FadeIn>

        {/* Móvil: columna. Desktop: 2 columnas */}
        <div className="mt-10 space-y-6 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
          {CARDS.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.1}>
              <motion.article
                className="group relative h-full overflow-hidden rounded-[1.5rem] border border-white/20 shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
              >
                <div className="relative aspect-[5/4] min-h-[260px] sm:aspect-[16/10] sm:min-h-[280px] md:aspect-[4/5] md:min-h-[320px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${card.imagePosition}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3d4d73]/95 via-[#556894]/55 to-[#6b7fb0]/20" />

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 md:p-6">
                    <h3 className="font-display text-2xl tracking-tight uppercase drop-shadow md:text-2xl lg:text-3xl">
                      {card.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 md:text-[0.95rem]">
                      {card.body}
                    </p>
                  </div>
                </div>
              </motion.article>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2} className="mt-8 text-center md:mt-10">
          <button
            type="button"
            className={`${BEWE_BOOK_CLASS} inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gals-blue-deep transition-transform hover:scale-[1.03]`}
          >
            Agendar
          </button>
        </FadeIn>
      </div>
    </section>
  );
}
