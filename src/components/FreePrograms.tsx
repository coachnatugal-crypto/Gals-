"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ImageSticker,
  StarSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";

const PROGRAMS = [
  {
    href: "/programa",
    overlayTop: "RETO",
    overlayBottom: "EN CASA",
    title: "Reto pilates en casa",
    blurb:
      "7 días de activación, clase y cierre. Mat, a tu ritmo, cuando quieras empezar.",
    meta: "10–40 min/día",
    image: "/media/capsules/pilates.jpg",
    imagePosition: "object-[center_25%]",
    rotate: -2.5,
    sticker: STICKER_ASSETS.tapete,
    stickerSide: "right" as const,
  },
  {
    href: "/alimentacion",
    overlayTop: "COME",
    overlayBottom: "CONSCIENTE",
    title: "Alimentación consciente",
    blurb:
      "Guías, audios y prácticas para elegir con más calma qué comes y cómo te sienta.",
    meta: "Método Body In Flow",
    image: "/media/alimentacion/nati-mercado.png",
    imagePosition: "object-center",
    rotate: 2.5,
    sticker: STICKER_ASSETS.flor,
    stickerSide: "left" as const,
  },
] as const;

/** Programas gratis — fotos animadas, encima de la polaroid. */
export function FreePrograms() {
  return (
    <section
      id="gratis"
      className="relative overflow-visible bg-gals-cream py-14 md:py-20"
      aria-label="Programas gratis"
    >
      <StarSticker
        className="absolute top-8 left-[8%] hidden opacity-70 md:block"
        size={26}
        color="var(--gals-blue)"
        float
      />
      <StarSticker
        className="absolute right-[10%] bottom-16 hidden opacity-60 md:block"
        size={22}
        color="var(--gals-blue-mid)"
        rotate={18}
        float
        delay={0.2}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 md:px-8">
        <div className="text-center md:text-left">
          <motion.p
            className="font-script text-2xl text-gals-blue-deep md:text-3xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            para ti, sin costo
          </motion.p>
          <motion.h2
            className="mt-1 font-display text-3xl tracking-tight text-gals-ink uppercase md:text-5xl"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Programas gratis
          </motion.h2>
          <motion.p
            className="mx-auto mt-3 max-w-md text-sm text-gals-muted md:mx-0 md:text-base"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
          >
            Movimiento en casa y alimentación consciente. Empieza cuando quieras.
          </motion.p>
        </div>

        <div className="mt-10 grid gap-12 sm:grid-cols-2 sm:gap-7 md:mt-12 md:gap-10">
          {PROGRAMS.map((item, i) => (
            <motion.div
              key={item.href}
              className="relative"
              initial={{ opacity: 0, y: 36, rotate: item.rotate - 4 }}
              whileInView={{ opacity: 1, y: 0, rotate: item.rotate }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={item.href} className="group block">
                <div className="mb-4 px-0.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-md bg-gals-blue-deep px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
                      Gratis
                    </span>
                    <p className="font-display text-base tracking-tight text-gals-ink uppercase sm:text-lg">
                      {item.title}
                    </p>
                  </div>
                  <p className="mt-2 max-w-sm text-sm leading-snug text-gals-muted md:text-[0.95rem]">
                    {item.blurb}
                  </p>
                </div>

                <motion.div
                  className="relative aspect-[3/4] overflow-visible rounded-[1.75rem] bg-gals-blue-soft shadow-[0_18px_50px_rgba(85,104,148,0.18)]"
                  whileHover={{ y: -8, rotate: 0, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <ImageSticker
                    src={item.sticker}
                    className={
                      item.stickerSide === "right"
                        ? "-right-2 -top-3 z-20 sm:-right-3 sm:-top-4"
                        : "-left-2 -top-3 z-20 sm:-left-3 sm:-top-4"
                    }
                    size={48}
                    rotate={item.stickerSide === "right" ? 14 : -16}
                    float
                    delay={0.15 + i * 0.1}
                  />
                  <div className="absolute inset-0 overflow-hidden rounded-[1.75rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${item.imagePosition}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#556894]/75 via-[#556894]/25 to-transparent" />

                  <div className="absolute inset-x-0 top-[18%] z-10 px-5 text-center">
                    <p className="font-display text-[clamp(2.6rem,12vw,4.2rem)] leading-[0.88] tracking-tight text-white/90 uppercase drop-shadow-[0_4px_18px_rgba(40,50,80,0.35)]">
                      {item.overlayTop}
                    </p>
                    <p className="mt-1 font-display text-sm tracking-[0.28em] text-white/85 uppercase md:text-base">
                      {item.overlayBottom}
                    </p>
                  </div>

                  <span className="absolute bottom-5 left-5 z-10 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-gals-blue-deep shadow-sm backdrop-blur-sm">
                    {item.meta}
                  </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
