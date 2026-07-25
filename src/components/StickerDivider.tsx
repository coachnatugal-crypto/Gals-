"use client";

import { motion } from "framer-motion";
import { ImageSticker, STICKER_ASSETS } from "@/components/capsules/Stickers";

const ROW = [
  { src: STICKER_ASSETS.tapete, size: 120, rotate: -18 },
  { src: STICKER_ASSETS.bola, size: 100, rotate: 10 },
  { src: STICKER_ASSETS.matchaTea, size: 96, rotate: -12 },
  { src: STICKER_ASSETS.pesas, size: 112, rotate: 14 },
  { src: STICKER_ASSETS.camara, size: 92, rotate: -10 },
  { src: STICKER_ASSETS.matcha, size: 96, rotate: 12 },
  { src: STICKER_ASSETS.pesa, size: 100, rotate: -14 },
];

/** Línea de stickers como separador entre secciones — solo desktop. */
export function StickerDivider() {
  return (
    <div
      className="relative hidden items-center justify-center gap-6 py-2 md:flex lg:gap-8"
      aria-hidden
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gals-blue/25" />

      {ROW.map((item, index) => (
        <motion.div
          key={item.src}
          className="relative shrink-0"
          style={{ width: item.size, height: item.size }}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, delay: index * 0.07 }}
        >
          <ImageSticker
            src={item.src}
            className="inset-0"
            size={item.size}
            rotate={item.rotate}
            float
            delay={index * 0.12}
          />
        </motion.div>
      ))}

      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gals-blue/25" />
    </div>
  );
}
