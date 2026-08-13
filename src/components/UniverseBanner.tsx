"use client";

import { motion } from "framer-motion";

/** Banner de pertenencia (universo GAL'S). Entre comunidad y planes. */
export function UniverseBanner() {
  return (
    <section
      className="relative overflow-hidden bg-[#e8e6ec]"
      aria-label="Universo GAL'S"
    >
      <div className="relative">
        <motion.img
          src="/media/universo-banner.png"
          alt=""
          aria-hidden
          className="relative left-1/2 block h-auto w-[128%] max-w-none -translate-x-1/2 sm:w-[114%] md:w-full lg:w-[100%]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Máscara: tapa el copy horneado del PNG (muy grande en desktop) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[38%] bg-gradient-to-t from-[#e8e6ec] via-[#e8e6ec]/95 to-transparent sm:h-[36%] md:h-[42%] lg:h-[40%]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-[6%] bottom-[4%] z-[6] hidden h-[28%] rounded-[2rem] bg-[#ebe9f0]/80 blur-md md:block lg:inset-x-[12%] lg:h-[26%]"
          aria-hidden
        />

        <motion.div
          className="absolute inset-x-0 bottom-[7%] z-10 flex justify-center px-5 sm:bottom-[8%] md:bottom-[10%] lg:bottom-[11%]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-full max-w-[19rem] rounded-[1.35rem] bg-[#ebe9f0]/95 px-5 py-4 text-center shadow-[0_8px_28px_rgba(70,80,120,0.12)] backdrop-blur-md sm:max-w-sm sm:px-7 sm:py-5 md:max-w-lg md:rounded-[1.6rem] md:px-10 md:py-6 lg:max-w-xl">
            <p className="font-sans text-[0.92rem] leading-[1.4] text-[#3d4a6b] sm:text-lg md:text-[1.35rem] md:leading-snug lg:text-[1.5rem]">
              ¿te han dicho que vives
              <br />
              en otro planeta? es porque
              <br />
              perteneces a este{" "}
              <span className="font-semibold text-[#2f3d5c]">universo</span>
            </p>
            <p className="mt-2.5 font-serif text-[0.78rem] tracking-wide text-[#5a6788] italic sm:text-sm md:mt-3 md:text-base">
              — your healthy GAL*
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
