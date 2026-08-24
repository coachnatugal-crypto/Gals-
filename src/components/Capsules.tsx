"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FusionPuzzleBoard } from "@/components/capsules/FusionPuzzleBoard";
import { StarSticker } from "@/components/capsules/Stickers";
import { BEWE_BOOK_CLASS } from "@/lib/bewe";

/** Cómo se vive la fusión en clase (PDF método GAL'S). */
const CLASS_STEPS = [
  { label: "Pilates", id: "pilates", pieceIndex: 0 },
  { label: "Mat Barre", id: "barre", pieceIndex: 2 },
  { label: "Yin", id: "yin", pieceIndex: 3 },
] as const;

const STYLES = [
  { id: "flow", name: "Flow", focus: "cardio", pieces: [0, 2] },
  { id: "sculpt", name: "Sculpt", focus: "fuerza", pieces: [1] },
] as const;

type StyleId = (typeof STYLES)[number]["id"];

export function Capsules() {
  const [flowStep, setFlowStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pieceHover, setPieceHover] = useState<number | null>(null);
  const [styleHover, setStyleHover] = useState<StyleId | null>(null);
  const step = CLASS_STEPS[flowStep];

  const activeIndices =
    pieceHover !== null
      ? [pieceHover]
      : styleHover
        ? [...STYLES.find((s) => s.id === styleHover)!.pieces]
        : [step.pieceIndex];

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setFlowStep((prev) => (prev + 1) % CLASS_STEPS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      id="capsulas"
      className="relative overflow-visible bg-gals-cream pb-10 pt-8 md:pb-14 md:pt-10"
    >
      <div className="relative z-20 mx-auto max-w-5xl px-5 md:px-8">
        <div className="text-center">
          <motion.p
            className="text-[11px] font-semibold tracking-[0.2em] text-gals-blue-deep/70 uppercase"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            El método GAL&apos;S
          </motion.p>
          <motion.h2
            className="mt-3 font-display text-3xl leading-tight tracking-tight text-gals-blue-deep uppercase sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Una fusión. Una clase.
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-sm text-sm text-gals-muted md:text-base"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Pilates, Sculpt, Barre y Yin juntos, no por separado.
          </motion.p>

          {/* Barrita flotante (estilo original) */}
          <motion.div
            className="relative z-30 mx-auto mt-8 mb-0 flex w-full max-w-xl items-center gap-4 rounded-full border border-gals-silver/40 bg-white px-6 py-5 shadow-[0_12px_36px_rgba(85,104,148,0.14)] sm:px-7 sm:py-6 md:max-w-2xl"
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
          className="relative mx-auto -mt-2 max-w-3xl pt-8 md:pt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => {
            setPaused(false);
            setPieceHover(null);
            setStyleHover(null);
          }}
        >
          <div className="relative rounded-[1.75rem] bg-gradient-to-br from-gals-blue-soft via-white to-gals-blue/20 p-3 shadow-[0_18px_48px_rgba(85,104,148,0.16)] sm:p-4 md:rounded-[2rem]">
            {/* Estilos del PDF — una línea, fuera de la barrita */}
            <div
              className="mb-3 flex items-center justify-center gap-2 sm:gap-3"
              role="group"
              aria-label="Estilos de clase"
            >
              {STYLES.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 sm:gap-3">
                  {i > 0 ? (
                    <span className="text-gals-blue/40" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onMouseEnter={() => setStyleHover(s.id)}
                    onFocus={() => setStyleHover(s.id)}
                    onClick={() => setStyleHover(s.id)}
                    className={`rounded-full px-3 py-1 text-[11px] transition-colors sm:text-xs ${
                      styleHover === s.id
                        ? "bg-gals-blue-deep text-white"
                        : "bg-white/80 text-gals-ink/75 hover:bg-white"
                    }`}
                  >
                    <span className="font-semibold">{s.name}</span>
                    <span className="opacity-70"> · {s.focus}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Ruta de la clase — sin whispers que repiten las fichas */}
            <div className="relative z-20 mx-auto mb-3 max-w-lg rounded-[1.25rem] border border-gals-blue/10 bg-white/90 px-3 py-3 shadow-[0_10px_28px_rgba(85,104,148,0.12)] backdrop-blur-md sm:px-5 sm:py-3.5">
              <div
                className="flex items-center justify-center gap-1 sm:gap-1.5"
                role="tablist"
                aria-label="Momentos de la clase"
              >
                {CLASS_STEPS.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-1 sm:gap-1.5"
                  >
                    {i > 0 ? (
                      <span
                        className={`px-0.5 font-display text-sm transition-colors duration-300 sm:text-base ${
                          flowStep >= i
                            ? "text-gals-blue-deep/55"
                            : "text-gals-blue/35"
                        }`}
                        aria-hidden
                      >
                        +
                      </span>
                    ) : null}
                    <button
                      type="button"
                      role="tab"
                      aria-selected={flowStep === i && !styleHover}
                      onClick={() => {
                        setFlowStep(i);
                        setPieceHover(null);
                        setStyleHover(null);
                      }}
                      onMouseEnter={() => {
                        setFlowStep(i);
                        setPieceHover(null);
                        setStyleHover(null);
                      }}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-300 sm:px-3 sm:text-xs ${
                        flowStep === i && !styleHover && pieceHover === null
                          ? "bg-gals-blue-deep text-white shadow-[0_8px_22px_rgba(26,42,53,0.22)]"
                          : "bg-gals-cream text-gals-ink/70 hover:bg-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 flex flex-col items-center gap-1.5">
                <p className="font-display text-[10px] tracking-[0.14em] text-gals-ink/50 uppercase sm:text-[11px]">
                  ~45 min · fuerza → control → calma
                </p>
                <div
                  className="h-[3px] w-full max-w-xs overflow-hidden rounded-full bg-gals-blue/15"
                  aria-hidden
                >
                  <motion.div
                    className="h-full rounded-full bg-gals-blue-deep"
                    animate={{
                      width: `${((flowStep + 1) / CLASS_STEPS.length) * 100}%`,
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  />
                </div>
              </div>
            </div>

            <FusionPuzzleBoard
              activeIndices={activeIndices}
              onActiveChange={(i) => {
                setPieceHover(i);
                setStyleHover(null);
              }}
            />

            <p className="mt-3 px-2 text-center text-[11px] text-gals-muted sm:text-xs">
              En cada clase,{" "}
              <span className="font-semibold text-gals-blue-deep">
                10 min de Yin
              </span>
              .
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-8 flex max-w-md flex-col items-center text-center md:mt-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a
            href="#horario"
            className={`${BEWE_BOOK_CLASS} inline-flex rounded-full bg-gals-blue-deep px-9 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_32px_rgba(26,42,53,0.2)] transition-transform hover:scale-[1.03]`}
          >
            Quiero esta clase
          </a>
        </motion.div>
      </div>
    </section>
  );
}
