"use client";

import { motion } from "framer-motion";
import {
  FlowerSticker,
  ImageSticker,
  StarSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";

const PILLARS = [
  {
    n: "01",
    image: "/media/capsules/pilates.jpg",
    title: "Moverte con conciencia",
    accent: "a tu ritmo",
    body: "Reconectar con tu cuerpo a través del pilates, el barre y el yin yoga, sin exigencia ni comparación — sintiendo cada movimiento.",
    rotate: -4,
    sticker: "tapete" as const,
  },
  {
    n: "02",
    image: "/media/capsules/IMG_9492.jpg",
    title: "Alimentarte desde el amor",
    accent: "sin culpa",
    body: "Dejar atrás las restricciones y aprender a nutrir tu cuerpo con guías y recetas pensadas para tu energía, no para tu culpa.",
    rotate: 5,
    sticker: "matcha" as const,
  },
  {
    n: "03",
    image: "/media/capsules/whois-2.jpg",
    title: "Encontrar tu círculo",
    accent: "hermanas gals",
    body: "Rodearte de mujeres que están en el mismo camino: en clase, en eventos y en nuestra comunidad de WhatsApp.",
    rotate: -6,
    sticker: "bola" as const,
  },
  {
    n: "04",
    image: "/media/capsules/whois-1.jpg",
    title: "Trabajar tu mentalidad",
    accent: "más allá del cuerpo",
    body: "Acompañarte con espacios de coaching, espiritualidad y desarrollo personal, para que tu transformación vaya más allá del cuerpo.",
    rotate: 4,
    sticker: "camara" as const,
  },
] as const;

function PillarRow({
  pillar,
  index,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
}) {
  const flip = index % 2 === 1;
  const stickerSrc = STICKER_ASSETS[pillar.sticker];

  return (
    <motion.article
      className={`relative flex flex-col items-center gap-8 md:gap-12 ${
        flip ? "md:flex-row-reverse" : "md:flex-row"
      }`}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
    >
      {/* Polaroid / foto */}
      <div className="relative w-full max-w-[340px] shrink-0 md:w-[42%] md:max-w-none">
        <motion.div
          className="relative z-10 bg-gals-cream p-3 pb-11 shadow-[0_22px_55px_rgba(26,42,53,0.28)]"
          style={{ rotate: pillar.rotate }}
          whileHover={{
            scale: 1.04,
            rotate: pillar.rotate + (flip ? -2 : 2),
            y: -6,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-gals-blue-mid">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={pillar.image}
              alt={pillar.title}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.55 }}
            />
            <span className="absolute top-3 left-3 rounded-sm bg-gals-cream/95 px-2 py-1 font-display text-[11px] tracking-[0.18em] text-gals-blue-deep uppercase">
              {pillar.n}
            </span>
          </div>
          <p className="absolute bottom-3 left-3 right-3 font-script text-xl text-gals-blue-deep md:text-2xl">
            {pillar.accent}
          </p>
        </motion.div>

        <ImageSticker
          src={stickerSrc}
          className={`absolute z-20 ${
            flip
              ? "-left-4 -bottom-2 sm:-left-8 md:-left-10"
              : "-right-4 -bottom-2 sm:-right-8 md:-right-10"
          }`}
          size={index === 1 ? 100 : 88}
          rotate={flip ? -16 : 14}
          float
          delay={0.2}
        />
        <StarSticker
          className={`absolute z-20 ${
            flip ? "-right-2 top-6" : "-left-2 top-8"
          }`}
          size={22}
          color="var(--gals-cream)"
          rotate={flip ? 18 : -12}
          float
        />
      </div>

      {/* Texto */}
      <div
        className={`w-full max-w-md text-center md:max-w-none md:flex-1 ${
          flip ? "md:text-right" : "md:text-left"
        }`}
      >
        <motion.p
          className="font-script text-3xl text-gals-blue-soft/90 md:text-4xl"
          initial={{ opacity: 0, x: flip ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.55 }}
        >
          {pillar.n}
        </motion.p>
        <h3 className="mt-2 font-display text-2xl tracking-tight text-gals-cream uppercase sm:text-3xl md:text-4xl">
          {pillar.title}
        </h3>
        <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-gals-blue-soft/85 md:mx-0 md:max-w-md md:text-lg">
          {pillar.body}
        </p>
        <motion.div
          className={`mt-5 h-px w-16 bg-gals-blue-soft/40 ${
            flip ? "mx-auto md:ml-auto md:mr-0" : "mx-auto md:mx-0"
          }`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{ originX: flip ? 1 : 0 }}
        />
      </div>
    </motion.article>
  );
}

/**
 * Pilares de acompañamiento — layout editorial con polaroids (toque Andrea / Kajabi).
 */
export function StudioStories() {
  return (
    <section
      id="vivir-gals"
      className="relative overflow-x-clip bg-gals-blue-deep py-20 text-white md:py-28"
    >
      {/* Atmósfera: no fondo plano */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 15% 20%, rgba(135,153,196,0.45), transparent 55%), radial-gradient(ellipse 60% 45% at 90% 70%, rgba(238,241,248,0.12), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(-12deg, transparent, transparent 18px, #fff 18px, #fff 19px)",
        }}
      />

      <FlowerSticker
        className="absolute top-24 left-[6%] z-[2] hidden opacity-80 lg:block"
        size={36}
        color="var(--gals-blue-soft)"
        rotate={-10}
        float
      />
      <StarSticker
        className="absolute top-16 right-[10%] z-[2] hidden md:block"
        size={28}
        color="var(--gals-cream)"
        rotate={12}
        float
      />
      <ImageSticker
        src={STICKER_ASSETS.pesas}
        className="bottom-16 right-[5%] z-[2] hidden lg:block"
        size={78}
        rotate={18}
        float
        delay={0.15}
      />

      <div className="relative z-20 mx-auto max-w-5xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            className="text-sm font-medium tracking-[0.28em] text-gals-blue-soft uppercase"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            el camino gals
          </motion.p>
          <motion.h2
            className="mt-3 font-display text-3xl tracking-tight text-gals-cream uppercase sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            Te vamos a acompañar a:
          </motion.h2>
          <motion.p
            className="mt-3 font-script text-3xl text-gals-blue-soft md:text-4xl"
            initial={{ opacity: 0, rotate: -4 }}
            whileInView={{ opacity: 1, rotate: -2 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, type: "spring", stiffness: 180 }}
          >
            cuatro pilares, una comunidad
          </motion.p>
        </div>

        <div className="mt-16 flex flex-col gap-16 md:mt-20 md:gap-24">
          {PILLARS.map((pillar, index) => (
            <PillarRow key={pillar.title} pillar={pillar} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
