"use client";

import { motion } from "framer-motion";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/constants";

export function FinalCta() {
  return (
    <section
      id="comunidad-mail"
      className="relative overflow-x-clip bg-[#f3efe4] py-20 md:py-28"
    >
      {/* Badge superior tipo referencia */}
      <motion.div
        className="relative z-20 mx-auto mb-8 flex w-fit items-center justify-center rounded-[2rem] border-2 border-gals-blue-deep bg-gals-blue-deep px-5 py-3"
        initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
      >
        <span className="font-script text-xl text-gals-cream">gals only ✦</span>
      </motion.div>

      <div className="relative z-20 mx-auto max-w-xl px-5 text-center md:px-8">
        <motion.h2
          className="font-display text-3xl leading-tight tracking-tight text-gals-blue-deep uppercase sm:text-4xl md:text-[2.75rem]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Te enseño paso a paso mis secretos para volver a ti: movimiento,
          energía y comunidad
        </motion.h2>

        <motion.p
          className="mt-5 font-script text-3xl text-gals-ink md:text-4xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
        >
          ¡Únete gratis a la comunidad!
        </motion.p>

        <motion.div
          className="mx-auto mt-10 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
        >
          <a
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl border-2 border-gals-blue-deep bg-gals-blue-deep px-6 py-3.5 font-script text-2xl text-gals-cream transition-transform hover:scale-[1.02]"
          >
            Quiero unirme gratis
          </a>

          <p className="mt-3 text-center text-xs text-gals-muted">
            Comunidad de WhatsApp GAL&apos;S. Solo valor, sin spam.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
