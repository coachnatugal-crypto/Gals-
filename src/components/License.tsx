"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ImageSticker,
  MoonSticker,
  StarSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";
import { WHATSAPP_URL } from "@/lib/constants";

export function License() {
  return (
    <section className="relative overflow-visible bg-gals-blue-deep py-20 md:py-28">
      {/* Un sticker por lado en la transición — sin amontonar */}
      <ImageSticker
        src={STICKER_ASSETS.tapete}
        className="left-[8%] top-0 hidden -translate-y-1/2 sm:block"
        size={100}
        rotate={-22}
        float
      />

      <div className="relative z-20 mx-auto max-w-4xl px-5 text-center md:px-8">
        <motion.h2
          className="font-display text-4xl tracking-tight text-white uppercase md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Nuestra experiencia
        </motion.h2>
        <p className="mt-2 font-script text-3xl text-gals-blue-soft">
          GAL&apos;S Studio, desde 2021
        </p>

        <motion.div
          className="relative mx-auto mt-12 max-w-xl rotate-[-3deg] rounded-[1.75rem] bg-white p-5 text-left shadow-[0_25px_60px_rgba(0,0,0,0.25)] sm:p-7 md:p-8"
          initial={{ opacity: 0, y: 40, rotate: -10 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ rotate: 0, scale: 1.02 }}
        >
          {/* Solo 2 stickers colgando, lados opuestos — como Andrea */}
          <ImageSticker
            src={STICKER_ASSETS.camara}
            className="-left-10 top-12 sm:-left-14"
            size={82}
            rotate={-16}
            float
            delay={0.2}
          />
          <ImageSticker
            src={STICKER_ASSETS.bola}
            className="-right-8 -bottom-8 sm:-right-12"
            size={100}
            rotate={12}
            float
            delay={0.3}
          />
          <MoonSticker
            className="absolute -top-4 right-10 z-30"
            size={32}
            rotate={10}
            color="var(--gals-blue)"
            float
          />

          <div className="flex items-start justify-between gap-4">
            <p className="font-display text-xs tracking-[0.14em] text-gals-ink uppercase">
              GAL&apos;S Studio
            </p>
            <p className="text-xs font-medium text-gals-muted">2021 — NOW</p>
          </div>

          <div className="mt-5 flex flex-col gap-5 sm:mt-6 sm:flex-row sm:items-stretch sm:gap-6">
            <Image
              src="/media/capsules/_DSC4460.jpg"
              alt="GAL'S Studio"
              width={360}
              height={480}
              className="mx-auto h-52 w-40 rounded-xl border-2 border-gals-ink object-cover object-top sm:mx-0 sm:h-60 sm:w-44 md:h-64 md:w-48"
            />
            <div className="flex flex-1 flex-col justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="font-display text-3xl leading-[0.95] tracking-tight text-gals-ink uppercase md:text-4xl">
                  Creative
                  <br />
                  License
                </p>
                <p className="mt-3 text-[11px] tracking-[0.16em] text-gals-muted uppercase">
                  Wellness · Movement · Community
                </p>
              </div>

              <ul className="space-y-3 text-left">
                <li>
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-gals-ink uppercase">
                    Tenemos
                  </p>
                  <p className="font-script text-2xl leading-tight text-gals-blue-deep md:text-[1.65rem]">
                    +4 años transformando cuerpos y mentes
                  </p>
                </li>
                <li>
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-gals-ink uppercase">
                    Hemos acompañado
                  </p>
                  <p className="font-script text-2xl leading-tight text-gals-blue-deep md:text-[1.65rem]">
                    a +100 mujeres
                  </p>
                </li>
                <li className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.12em] text-gals-ink uppercase">
                    Cupos
                  </span>
                  <span className="rounded bg-gals-blue px-2.5 py-1 text-sm font-bold text-white">
                    LIMITADOS CADA MES
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-7 flex items-end justify-between border-t border-gals-blue-soft pt-5 sm:mt-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gals-blue-deep font-display text-[8px] tracking-wide text-white uppercase">
              gal&apos;s
            </div>
            <p className="font-script text-2xl text-gals-ink">
              Natalia Galvis 🩶
            </p>
            <StarSticker size={20} />
          </div>
        </motion.div>

        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex rounded-full bg-white px-10 py-4 font-display text-sm tracking-[0.14em] text-gals-blue-deep uppercase transition-transform hover:scale-[1.03]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          Quiero unirme
        </motion.a>
      </div>

      <ImageSticker
        src={STICKER_ASSETS.pesas}
        className="bottom-0 right-[10%] translate-y-1/2"
        size={96}
        rotate={14}
        float
      />
    </section>
  );
}
