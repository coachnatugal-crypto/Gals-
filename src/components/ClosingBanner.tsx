"use client";

import { motion } from "framer-motion";
import { StarSticker } from "@/components/capsules/Stickers";
import { WHATSAPP_URL } from "@/lib/constants";

/** Banner de cierre con franjas + despedida cálida. Va antes del footer. */
export function ClosingBanner() {
  return (
    <section className="relative bg-gals-cream pb-14 md:pb-20">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "repeating-linear-gradient(90deg, var(--gals-blue-deep) 0 12.5%, var(--gals-blue-mid) 12.5% 25%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-5 py-16 text-center md:px-8 md:py-20">
          <motion.h2
            className="flex flex-wrap items-center justify-center gap-x-3 font-display text-4xl leading-[0.95] tracking-tight text-gals-blue-soft uppercase sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Moverse es para todas
            <StarSticker size={34} color="var(--gals-blue-soft)" rotate={12} />
          </motion.h2>

          <motion.p
            className="mx-auto mt-5 max-w-2xl font-script text-2xl leading-snug text-white md:text-3xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Si sientes que es momento de volver a ti, GAL&apos;S es el puente
            para conectar con tu versión más elevada.
          </motion.p>

          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex rounded-full bg-gals-blue-soft px-9 py-4 font-display text-sm tracking-[0.14em] text-gals-blue-deep uppercase shadow-[0_12px_32px_rgba(0,0,0,0.22)] transition-transform hover:scale-[1.03] md:text-base"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
          >
            Reserva tu Semana GAL&apos;S
          </motion.a>
        </div>
      </div>

      <motion.p
        className="mt-10 text-center font-script text-3xl text-gals-blue-deep md:mt-12 md:text-4xl"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        nos vemos en la 97, girls 🩶
      </motion.p>
    </section>
  );
}
