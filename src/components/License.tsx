"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ImageSticker,
  StarSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";
import { BEWE_SUBS_CLASS } from "@/lib/bewe";

export function License() {
  return (
    <section className="relative overflow-visible bg-gals-blue-deep py-20 md:py-28">
      {/* Hongo izquierda */}
      <ImageSticker
        src={STICKER_ASSETS.hongos}
        className="bottom-16 left-2 hidden md:block lg:left-6 [&_img]:object-bottom"
        size={160}
        height={240}
        rotate={-6}
        blend={false}
        objectPosition="left"
      />
      <ImageSticker
        src={STICKER_ASSETS.hongos}
        className="bottom-8 left-1 md:hidden [&_img]:object-bottom"
        size={72}
        height={110}
        rotate={-8}
        blend={false}
        objectPosition="left"
      />

      {/* Flor derecha */}
      <ImageSticker
        src={STICKER_ASSETS.flor}
        className="top-[28%] right-3 hidden md:block lg:right-8"
        size={150}
        height={170}
        rotate={12}
        float
        blend={false}
      />
      <ImageSticker
        src={STICKER_ASSETS.flor}
        className="top-24 right-1 md:hidden"
        size={64}
        height={78}
        rotate={10}
        blend={false}
      />

      <div className="relative z-20 mx-auto max-w-5xl px-5 text-center md:px-8">
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
          className="relative mx-auto mt-10 max-w-md rotate-[-3deg] rounded-[1.5rem] bg-white p-4 text-left shadow-[0_25px_60px_rgba(0,0,0,0.25)] sm:mt-12 sm:max-w-lg sm:p-5 md:max-w-xl md:p-5"
          initial={{ opacity: 0, y: 40, rotate: -10 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ rotate: 0, scale: 1.015 }}
        >
          {/* Cámara PC: grande + flash */}
          <motion.div
            className="pointer-events-none absolute -left-10 top-8 z-30 hidden h-[110px] w-[110px] select-none md:block lg:-left-12 lg:h-[128px] lg:w-[128px]"
            initial={{ opacity: 0, scale: 0.4, rotate: -28 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -14 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
            aria-hidden
          >
            <motion.div
              className="relative h-full w-full"
              animate={{
                y: [0, -10, -3, -14, 0],
                rotate: [-14, -10, -16, -11, -14],
              }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="absolute top-[38%] left-1/2 z-10 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                animate={{
                  opacity: [0, 0, 0.95, 0, 0],
                  scale: [0.4, 0.4, 1.8, 2.4, 0.4],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  times: [0, 0.72, 0.78, 0.88, 1],
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={STICKER_ASSETS.camara}
                alt=""
                draggable={false}
                className="relative z-[1] h-full w-full object-contain drop-shadow-[0_18px_36px_rgba(26,42,53,0.35)] mix-blend-screen"
              />
            </motion.div>
          </motion.div>

          <ImageSticker
            src={STICKER_ASSETS.camara}
            className="-left-8 top-10 md:hidden"
            size={72}
            rotate={-16}
            float
            delay={0.2}
          />

          {/* Matcha preparado colgando del carnet */}
          <ImageSticker
            src={STICKER_ASSETS.matchaTea}
            className="-right-4 top-8 sm:-right-10 sm:top-6"
            size={88}
            rotate={18}
            float
            delay={0.15}
          />

          <ImageSticker
            src={STICKER_ASSETS.bola}
            className="-right-6 -bottom-6 sm:-right-10 sm:-bottom-8"
            size={96}
            rotate={12}
            float
            delay={0.3}
          />

          <div className="flex items-start justify-between gap-4">
            <p className="font-display text-xs tracking-[0.14em] text-gals-ink uppercase">
              GAL&apos;S Studio
            </p>
            <p className="text-xs font-medium text-gals-muted">2021 — NOW</p>
          </div>

          {/* Foto protagonista + copy */}
          <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:flex-row sm:items-stretch sm:gap-5">
            <div className="relative mx-auto w-full max-w-[300px] shrink-0 sm:mx-0 sm:max-w-none sm:w-[58%] md:w-[60%]">
              <Image
                src="/media/capsules/_DSC4460.jpg"
                alt="Natalia Galvis — GAL'S Studio"
                width={560}
                height={720}
                className="aspect-[3/4] h-auto w-full rounded-2xl border-2 border-gals-ink object-cover object-top shadow-[0_16px_40px_rgba(26,42,53,0.18)]"
                priority
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-4 text-center sm:py-1 sm:text-left">
              <div>
                <p className="font-display text-2xl leading-[0.95] tracking-tight text-gals-ink uppercase sm:text-3xl md:text-4xl">
                  Creative
                  <br />
                  License
                </p>
                <p className="mt-2 text-[10px] tracking-[0.16em] text-gals-muted uppercase sm:text-[11px]">
                  Wellness · Movement · Community
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="font-display text-3xl leading-none tracking-tight text-gals-blue-deep md:text-4xl">
                    +4
                  </p>
                  <p className="mt-1 text-[10px] font-medium tracking-wide text-gals-muted uppercase">
                    años
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl leading-none tracking-tight text-gals-blue-deep md:text-4xl">
                    +100
                  </p>
                  <p className="mt-1 text-[10px] font-medium tracking-wide text-gals-muted uppercase">
                    mujeres
                  </p>
                </div>
              </div>

              <p className="font-script text-lg leading-snug text-gals-blue-deep md:text-xl">
                Transformando cuerpos y mentes, con cupos limitados cada mes.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3 border-t border-gals-blue-soft pt-4 sm:mt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gals-blue-deep font-display text-[7px] tracking-wide text-white uppercase sm:h-11 sm:w-11 sm:text-[8px]">
              gal&apos;s
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="font-script text-xl leading-none text-gals-ink sm:text-2xl">
                Natalia Galvis
              </p>
              <p className="mt-1 font-display text-[9px] tracking-[0.14em] text-gals-muted uppercase sm:text-[10px]">
                Fundadora · Coach
              </p>
            </div>
            <StarSticker size={18} className="shrink-0" />
          </div>

          <motion.button
            type="button"
            className={`${BEWE_SUBS_CLASS} mt-4 w-full rounded-full bg-gals-blue-deep px-6 py-3 font-display text-xs tracking-[0.14em] text-white uppercase transition-transform hover:scale-[1.02] sm:mt-5 sm:text-sm`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Quiero unirme
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
