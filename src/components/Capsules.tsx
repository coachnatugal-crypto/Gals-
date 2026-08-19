"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreativeCapsule } from "@/components/capsules/CreativeCapsules";
import { StarSticker } from "@/components/capsules/Stickers";
import { BEWE_BOOK_CLASS } from "@/lib/bewe";

const CLASS_STEPS = [
  {
    n: "01",
    label: "Pilates",
    id: "pilates",
    arc: "fuerza",
    whisper: "Conectas con tu cuerpo.",
  },
  {
    n: "02",
    label: "Barre",
    id: "barre",
    arc: "control",
    whisper: "Despiertas tu fuerza.",
  },
  {
    n: "03",
    label: "Yin",
    id: "yin",
    arc: "calma",
    whisper: "Conectas con tu centro.",
  },
] as const;

export function Capsules() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const step = CLASS_STEPS[active];

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % CLASS_STEPS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      id="capsulas"
      className="relative overflow-visible bg-gals-cream pb-10 pt-8 md:pb-14 md:pt-10"
    >
      <div className="relative z-20 mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center">
          <motion.p
            className="text-sm font-medium tracking-wide text-gals-ink"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            let&apos;s go! ✦
          </motion.p>
          <motion.h2
            className="mt-3 font-display text-3xl leading-tight tracking-tight text-gals-blue-deep uppercase sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Hay un lugar para ti 🩶
          </motion.h2>

          <motion.div
            className="relative mx-auto mt-10 mb-2 flex w-full max-w-xl items-center gap-4 rounded-full border border-gals-silver/40 bg-white px-6 py-5 shadow-[0_12px_36px_rgba(85,104,148,0.14)] sm:px-7 sm:py-6 md:max-w-2xl"
            initial={{ opacity: 0, y: 20, rotate: -3 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            animate={{
              y: [0, -12, -4, -14, 0],
              x: [0, 6, -4, 3, 0],
              rotate: [-3, -1.2, -4, -2, -3],
            }}
            transition={{
              opacity: { duration: 0.5 },
              y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <p className="min-w-0 flex-1 text-left text-base text-gals-ink sm:text-lg md:text-xl">
              <span className="inline-block rounded-md bg-gals-blue/45 px-2.5 py-1 font-semibold tracking-tight text-gals-blue-deep shadow-[inset_0_0_0_1px_rgba(85,104,148,0.18)]">
                Tus clases gals combinarán:
              </span>
            </p>
            <span
              className="flex shrink-0 items-center gap-2.5 text-gals-muted"
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current opacity-50 sm:h-6 sm:w-6"
              >
                <path d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 8a1 1 0 01-1-1v-1.07A7.002 7.002 0 015 11h2a5 5 0 0010 0h2a7.002 7.002 0 01-6 6.93V18a1 1 0 01-1 1z" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current opacity-40 sm:h-6 sm:w-6"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 12.1L14.1 15.5 12 13.4l-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1z" />
              </svg>
            </span>
            <StarSticker
              className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2"
              size={32}
            />
          </motion.div>
        </div>

        <motion.div
          className="relative mt-10 overflow-hidden rounded-[1.75rem] shadow-[0_18px_50px_rgba(26,42,53,0.18)] md:mt-12 md:rounded-[2rem]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Una clase GAL'S: Pilates, Barre y Yin Yoga"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative z-30 bg-gradient-to-b from-gals-cream to-gals-cream/90 px-4 py-3.5 sm:px-6 md:py-4">
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex items-center gap-1 sm:gap-1.5"
                role="tablist"
                aria-label="Momentos de la clase"
              >
                {CLASS_STEPS.map((item, i) => (
                  <div
                    key={item.n}
                    className="flex items-center gap-1 sm:gap-1.5"
                  >
                    {i > 0 ? (
                      <span
                        className={`h-px w-3 transition-colors duration-300 sm:w-5 md:w-7 ${
                          active >= i
                            ? "bg-gals-blue-deep/50"
                            : "bg-gals-blue/25"
                        }`}
                        aria-hidden
                      />
                    ) : null}
                    <button
                      type="button"
                      role="tab"
                      aria-selected={active === i}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-left transition-all duration-300 sm:px-3 ${
                        active === i
                          ? "bg-gals-blue-deep text-white shadow-[0_8px_22px_rgba(26,42,53,0.22)]"
                          : "bg-white/90 text-gals-ink/70 shadow-[0_4px_14px_rgba(85,104,148,0.1)] hover:bg-white"
                      }`}
                    >
                      <span className="font-display text-[10px] tracking-[0.16em] sm:text-[11px]">
                        {item.n}
                      </span>
                      <span className="text-[11px] font-medium sm:text-xs">
                        {item.label}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Duración + arco de la clase */}
            <div className="mt-3 flex flex-col items-center gap-2 sm:mt-3.5">
              <p className="font-display text-[10px] tracking-[0.16em] text-gals-ink/55 uppercase sm:text-[11px]">
                ~45 min · fuerza → control → calma
              </p>
              <div
                className="h-[3px] w-full max-w-xs overflow-hidden rounded-full bg-gals-blue/15 sm:max-w-sm"
                aria-hidden
              >
                <motion.div
                  className="h-full rounded-full bg-gals-blue-deep"
                  animate={{ width: `${((active + 1) / CLASS_STEPS.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                />
              </div>
              <div className="relative h-6 w-full max-w-md">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={step.id}
                    className="absolute inset-x-0 text-center font-script text-lg leading-none text-gals-blue-deep md:text-xl"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28 }}
                  >
                    {step.whisper}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <CreativeCapsule
            title="PILATES"
            script="Fortalece desde adentro."
            accent="deep"
            highlighted={active === 0}
            className="min-h-[280px] md:min-h-[320px]"
            image="/media/capsules/pilates.jpg"
          />

          <div
            className="relative z-20 -my-5 flex items-center justify-center md:-my-6"
            aria-hidden
          >
            <span className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent md:inset-x-16" />
            {/* Detalle compartido: une el corte entre momentos */}
            <span className="absolute left-[18%] top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-gals-cream shadow md:block" />
            <span className="absolute right-[18%] top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-gals-cream shadow md:block" />
            <motion.p
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gals-cream/95 font-display text-xl font-semibold leading-none text-gals-blue-deep shadow-[0_8px_24px_rgba(26,42,53,0.12)] md:h-10 md:w-10 md:text-2xl"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.45 }}
              animate={{
                scale: active === 0 || active === 1 ? 1.04 : 1,
              }}
            >
              +
            </motion.p>
          </div>

          <div className="relative grid md:grid-cols-2">
            <CreativeCapsule
              title="BARRE"
              script="Fuerza con conciencia."
              accent="blue"
              highlighted={active === 1}
              image="/media/capsules/barre.jpg"
              className="border-b border-white/10 md:border-r md:border-b-0"
            />

            <div
              className="relative z-20 -my-5 flex items-center justify-center md:absolute md:inset-y-0 md:left-1/2 md:my-0 md:w-auto md:-translate-x-1/2 md:flex-col"
              aria-hidden
            >
              <span className="absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-white/60 md:hidden" />
              <motion.p
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gals-cream/95 font-display text-xl font-semibold leading-none text-gals-blue-deep shadow-[0_8px_24px_rgba(26,42,53,0.12)] md:h-10 md:w-10 md:text-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.4 }}
                animate={{
                  scale: active === 1 || active === 2 ? 1.06 : 1,
                }}
              >
                +
              </motion.p>
            </div>

            <CreativeCapsule
              title="YIN YOGA"
              script="Tu pausa en medio del ruido."
              accent="green"
              highlighted={active === 2}
              image="/media/capsules/yin-yoga.jpg"
            />
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-7 flex max-w-lg flex-col items-center text-center md:mt-9"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-gals-muted md:text-base">
            Tres momentos. Una sola clase en GAL&apos;S.
          </p>
          <a
            href="#horario"
            className={`${BEWE_BOOK_CLASS} mt-5 inline-flex rounded-full bg-gals-blue-deep px-9 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_32px_rgba(26,42,53,0.2)] transition-transform hover:scale-[1.03]`}
          >
            Quiero esta clase
          </a>
        </motion.div>
      </div>
    </section>
  );
}
