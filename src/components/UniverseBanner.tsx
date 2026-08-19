"use client";

import { motion } from "framer-motion";
import { BEWE_BOOK_CLASS, BEWE_SUBS_CLASS } from "@/lib/bewe";

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

        {/* Tapa el copy horneado del PNG */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[46%] bg-gradient-to-t from-[#e8e6ec] from-35% via-[#e8e6ec]/98 to-transparent sm:h-[44%] md:h-[48%] lg:h-[46%]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[22%] bg-[#e8e6ec] sm:h-[20%] md:h-[24%]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-[4%] bottom-[6%] z-[7] h-[32%] rounded-[2rem] bg-[#ebe9f0]/90 blur-lg sm:bottom-[7%] md:inset-x-[10%] md:h-[30%] lg:inset-x-[14%]"
          aria-hidden
        />

        <motion.div
          className="absolute inset-x-0 bottom-[5%] z-10 flex justify-center px-5 sm:bottom-[6%] md:bottom-[7%] lg:bottom-[8%]"
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

            <div className="mt-5 flex flex-col items-stretch justify-center gap-2.5 sm:mt-6 sm:flex-row sm:items-center sm:gap-3">
              <a
                href="#horario"
                className={`${BEWE_BOOK_CLASS} inline-flex items-center justify-center rounded-full bg-[#2f3d5c] px-6 py-3 text-sm font-semibold tracking-wide text-white transition-transform hover:scale-[1.03]`}
              >
                Reservar clase
              </a>
              <a
                href="#planes"
                className={`${BEWE_SUBS_CLASS} inline-flex items-center justify-center rounded-full border border-[#2f3d5c]/35 bg-white/90 px-6 py-3 text-sm font-semibold tracking-wide text-[#2f3d5c] transition-colors hover:bg-white`}
              >
                Ver planes
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
