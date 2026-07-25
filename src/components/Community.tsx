"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PolaroidStack } from "@/components/capsules/CreativeCapsules";
import {
  ImageSticker,
  StarSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";
import { TESTIMONIALS, VALUES, WHATSAPP_URL } from "@/lib/constants";

const COMMUNITY_IMAGES = [
  "/media/community/WhatsApp Image 2026-07-23 at 11.09.58 AM.jpeg",
  "/media/community/WhatsApp Image 2026-07-23 at 11.09.59 AM.jpeg",
  "/media/community/WhatsApp Image 2026-07-23 at 11.09.59 AM (1).jpeg",
  "/media/community/WhatsApp Image 2026-07-23 at 11.09.59 AM (2).jpeg",
  "/media/community/WhatsApp Image 2026-07-23 at 11.09.59 AM (3).jpeg",
  "/media/community/WhatsApp Image 2026-07-23 at 11.09.59 AM (4).jpeg",
];

const COMMUNITY_CAPTIONS = [
  "JUNTAS SOMOS MÁS",
  "MOVERNOS JUNTAS",
  "COMUNIDAD GAL'S",
  "BUILT BY GALS",
  "NUESTRO LUGAR",
  "VOLVER A TI",
];

export function CommunityMarquee() {
  const loop = [
    ...VALUES.map((v) => `COMMUNITY IS QUEEN EN GAL'S / ${v.toUpperCase()}`),
    ...VALUES.map((v) => `COMMUNITY IS QUEEN EN GAL'S / ${v.toUpperCase()}`),
  ];

  return (
    <div className="overflow-hidden border-y border-gals-blue-deep/15 bg-gals-cream py-4">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {loop.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="flex items-center gap-8 font-display text-2xl tracking-tight text-gals-blue-deep uppercase md:text-3xl"
          >
            {text}
            <StarSticker size={22} />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Community() {
  const [index, setIndex] = useState(0);
  const item = TESTIMONIALS[index];

  const prev = () =>
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);

  return (
    <section className="relative overflow-visible bg-white pb-16 pt-0 md:pb-20">
      <CommunityMarquee />

      <div className="relative z-20 mx-auto mt-10 grid max-w-6xl items-center gap-14 px-5 md:mt-12 md:grid-cols-2 md:px-8">
        <div className="relative text-center md:text-left">
          <ImageSticker
            src={STICKER_ASSETS.camara}
            className="-right-2 -top-6 hidden sm:block sm:-right-8"
            size={72}
            rotate={14}
            float
          />
          <PolaroidStack
            images={COMMUNITY_IMAGES}
            captions={COMMUNITY_CAPTIONS}
          />
          <p className="mt-6 font-script text-4xl text-gals-blue-deep md:text-5xl">
            únete a la
          </p>
          <p className="font-display text-3xl tracking-tight text-gals-ink uppercase md:text-4xl">
            comunidad GAL&apos;S
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-gals-blue px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Quiero ser parte
          </a>
        </div>

        <div className="relative space-y-8">
          <ImageSticker
            src={STICKER_ASSETS.matchaTea}
            className="-right-3 top-0 hidden sm:block sm:-right-6"
            size={64}
            rotate={12}
            float
            delay={0.15}
          />

          <motion.div
            className="relative rounded-2xl border border-gals-silver/40 bg-white p-6 shadow-[0_16px_40px_rgba(85,104,148,0.1)]"
            initial={{ opacity: 0, y: 24, rotate: 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs text-gals-muted">
              Recordatorio · GAL&apos;S Studio
            </p>
            <p className="mt-2 font-display text-xl tracking-tight text-gals-ink uppercase">
              Reminder
            </p>
            <p className="mt-3 text-gals-muted leading-relaxed">
              Para nosotros tú siempre eres lo más{" "}
              <span className="bg-gals-blue/30 px-1 font-semibold text-gals-ink">
                importante.
              </span>
            </p>
          </motion.div>

          <motion.div
            className="relative rounded-2xl border-2 border-gals-blue-deep bg-gals-blue-soft p-6 md:p-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button
              type="button"
              aria-label="Anterior"
              onClick={prev}
              className="absolute top-1/2 -left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gals-blue-deep text-white shadow-md"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={next}
              className="absolute top-1/2 -right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gals-blue-deep text-white shadow-md"
            >
              ›
            </button>

            <AnimatePresence mode="wait">
              <motion.blockquote
                key={item.quote}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-display text-lg tracking-tight text-gals-ink uppercase">
                  {item.author}
                </p>
                <p className="mt-3 leading-relaxed text-gals-ink/80 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-6 flex justify-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Testimonio ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    i === index ? "bg-gals-blue-deep" : "bg-gals-blue/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
