"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ImageSticker,
  MoonSticker,
  StarSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";

const WHOIS_IMAGES = [
  "/media/capsules/whois-2.jpg",
  "/media/capsules/whois-back.jpg",
] as const;

function WhoIsCollage({ className = "" }: { className?: string }) {
  const [front, setFront] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setFront((f) => (f === 0 ? 1 : 0));
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={`relative mx-auto w-full ${className}`}>
      {WHOIS_IMAGES.map((src, i) => {
        const isFront = front === i;
        return (
          <motion.div
            key={src}
            className="absolute overflow-hidden rounded-[1.75rem] shadow-2xl md:rounded-[2.4rem]"
            initial={false}
            animate={
              isFront
                ? {
                    top: "28%",
                    left: "20%",
                    width: "80%",
                    height: "68%",
                    zIndex: 20,
                    rotate: -8,
                  }
                : {
                    top: "0%",
                    left: "0%",
                    width: "78%",
                    height: "64%",
                    zIndex: 10,
                    rotate: 4,
                  }
            }
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="GAL'S Studio"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.div>
        );
      })}

      <motion.p
        className="pointer-events-none absolute top-[36%] right-0 z-30 font-script text-[2.4rem] leading-none text-gals-cream [text-shadow:0_2px_14px_rgba(0,0,0,0.35)] sm:text-5xl md:text-5xl lg:text-6xl"
        initial={{ opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25 }}
      >
        who is
      </motion.p>
      <motion.p
        className="pointer-events-none absolute bottom-0 left-[4%] z-30 font-script text-[2.6rem] leading-none text-gals-cream [text-shadow:0_2px_14px_rgba(0,0,0,0.35)] sm:text-5xl md:text-6xl lg:text-7xl"
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
      >
        gals?
      </motion.p>
    </div>
  );
}

export function WhoIs() {
  return (
    <section className="relative z-0 overflow-x-clip bg-gals-blue-deep pb-0 pt-16 text-white md:overflow-visible md:pb-20 md:pt-24">
      <StarSticker
        className="absolute top-16 right-10 hidden opacity-40 md:block"
        size={40}
        color="rgba(255,255,255,0.5)"
      />
      <MoonSticker
        className="absolute top-24 left-6 hidden opacity-50 md:block md:left-12"
        size={48}
        rotate={-15}
        float
        color="rgba(238,241,248,0.75)"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-5 md:grid-cols-2 md:gap-12 md:px-8">
        <WhoIsCollage className="h-[420px] sm:h-[480px] md:h-[560px] lg:h-[600px]" />

        <div className="relative z-10 pt-1 md:pt-2">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center md:mx-0 md:max-w-2xl md:items-start md:text-left">
            <motion.h2
              className="font-display text-[2.4rem] leading-[1.02] tracking-tight sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              Un lugar para
              <br /> volver a ti
            </motion.h2>
            <motion.p
              className="mt-3 max-w-[22rem] text-lg leading-snug text-white/90 sm:max-w-lg sm:text-xl md:mt-4 md:text-2xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              Pilates, barre y yin yoga. Comunidad de mujeres que se mueven y
              vuelven a sí mismas con GAL&apos;S.
            </motion.p>
            <motion.a
              href="#capsulas"
              className="relative z-20 mt-5 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-gals-blue-deep shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-transform hover:scale-[1.03] sm:mt-6 sm:px-8 md:mt-7"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.22 }}
            >
              Explorar GAL&apos;S
            </motion.a>
          </div>

          <div className="h-16 sm:h-20 md:h-16" aria-hidden />
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-[140px] w-screen max-w-[100vw] -translate-x-1/2 sm:h-[160px]"
        aria-hidden
      >
        <ImageSticker
          src={STICKER_ASSETS.hongos}
          className="right-0 bottom-0 [&_img]:object-bottom"
          size={88}
          height={140}
          rotate={0}
          blend={false}
          objectPosition="right"
        />
      </div>
    </section>
  );
}
