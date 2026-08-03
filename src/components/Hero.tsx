"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ImageSticker,
  MoonSticker,
  StarSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";
import { HERO_VIDEO_URL, WHATSAPP_URL } from "@/lib/constants";

/** Video full-bleed superior — solo escritorio. En mobile el video vive en WhoIs. */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    void el.play();
  };

  return (
    <section
      id="inicio"
      className="relative hidden overflow-hidden bg-black md:block"
    >
      <div className="relative aspect-[21/9] min-h-[74vh] w-full">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Video GAL'S Studio"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {muted ? (
          <button
            type="button"
            onClick={toggleMute}
            className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 rounded-2xl bg-gals-blue-deep/90 px-5 py-2.5 text-center text-white backdrop-blur-sm transition-transform hover:scale-[1.03]"
          >
            <span className="text-xs font-medium opacity-90">
              Tu video ya ha comenzado
            </span>
            <span
              className="flex h-7 w-7 items-center justify-center"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            </span>
            <span className="text-xs font-semibold">Hacé clic para escuchar</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleMute}
            aria-label="Silenciar"
            className="absolute right-6 bottom-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gals-blue-deep/85 text-white shadow-md backdrop-blur-sm transition-transform hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

/** Polaroid de bienvenida + collage + copy. Va después del bloque azul (WhoIs). */
export function HeroIntro() {
  return (
    <section id="comunidad" className="relative overflow-hidden bg-gals-cream">
      <div className="relative overflow-x-clip pb-6 pt-16 md:overflow-visible md:pb-8 md:pt-24">
        <ImageSticker
          src={STICKER_ASSETS.tapete}
          className="left-[2%] top-10 hidden md:block md:left-[6%] lg:left-[10%]"
          size={130}
          rotate={-28}
          float
        />
        <ImageSticker
          src={STICKER_ASSETS.pesas}
          className="right-[2%] top-14 hidden md:block md:right-[7%] lg:right-[11%]"
          size={112}
          rotate={18}
          float
          delay={0.15}
        />
        <MoonSticker
          className="absolute top-8 left-[42%] hidden md:block"
          size={40}
          rotate={-8}
          float
          color="var(--gals-blue)"
        />
        <StarSticker
          className="absolute bottom-16 right-[18%] hidden opacity-80 md:block"
          size={28}
          color="var(--gals-blue-mid)"
        />

        <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-5 md:px-8">
          <motion.div
            className="relative w-full max-w-xl origin-center"
            initial={{ opacity: 0, y: 50, rotate: -6 }}
            whileInView={{ opacity: 1, y: 0, rotate: -3 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ rotate: -2, scale: 1.02 }}
          >
            <ImageSticker
              src={STICKER_ASSETS.camara}
              className="-right-6 -top-8 sm:-right-12 sm:-top-10"
              size={92}
              rotate={14}
              float
              delay={0.2}
            />
            <ImageSticker
              src={STICKER_ASSETS.bola}
              className="-left-6 -bottom-14 sm:-left-14 sm:-bottom-6"
              size={96}
              rotate={-16}
              float
              delay={0.3}
            />

            <div className="relative bg-white p-3 pb-16 shadow-[0_25px_70px_rgba(85,104,148,0.22)] md:p-4 md:pb-20">
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <motion.img
                  src="/media/capsules/polaroid.jpg"
                  alt="GAL'S Studio"
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                  initial={{ opacity: 0, scale: 1.06 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25" />

                <div className="absolute inset-x-0 top-6 z-10 px-4 text-center">
                  <p className="font-script text-2xl text-gals-blue-soft drop-shadow md:text-3xl">
                    hello girl
                  </p>
                </div>

                <div className="absolute inset-x-0 bottom-8 z-10 px-4 text-center">
                  <p className="font-script text-xl text-gals-blue-soft drop-shadow md:text-2xl">
                    te habla el studio
                  </p>
                </div>

                <motion.div
                  className="absolute right-3 top-[40%] z-20 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gals-blue bg-gals-cream/95 p-2 text-center shadow-md md:h-28 md:w-28"
                  initial={{ scale: 0, rotate: -40 }}
                  whileInView={{ scale: 1, rotate: 12 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.45,
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                  }}
                >
                  <p className="font-display text-[8px] leading-tight tracking-[0.08em] text-gals-blue-deep uppercase md:text-[9px]">
                    built by
                    <br />
                    gals for
                    <br />
                    gals ✦
                  </p>
                </motion.div>
              </div>

              <div className="absolute inset-x-3 bottom-4 flex items-end justify-between gap-3 md:inset-x-4 md:bottom-5">
                <p className="font-display text-[10px] tracking-[0.12em] text-gals-ink uppercase md:text-xs">
                  Bienvenidx a GAL&apos;S
                </p>
                <p className="text-right font-display text-[10px] leading-tight tracking-[0.1em] text-gals-ink uppercase md:text-xs">
                  GAL&apos;S Studio
                  <br />
                  <span className="text-gals-muted">Since 2024</span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-12 max-w-xl text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg leading-relaxed text-gals-ink/80 md:text-xl">
              Movimiento con propósito y profundidad para volver a ti.
            </p>
            <p className="mt-2 font-script text-2xl text-gals-blue-deep">
              espiritualidad por medio del movimiento
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#capsulas"
                className="inline-flex rounded-full bg-gals-blue-deep px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition-transform hover:scale-[1.03]"
              >
                Explorar programas
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-gals-blue-deep/30 bg-white px-8 py-3.5 text-sm font-semibold tracking-wide text-gals-blue-deep transition-colors hover:bg-gals-blue-soft"
              >
                Contáctanos
              </a>
            </div>
          </motion.div>

          {/* Collage solo móvil — llena el espacio antes de Cápsulas */}
          <div className="relative mx-auto mt-10 h-[320px] w-full max-w-[400px] md:hidden">
            <motion.div
              className="absolute top-0 left-0 h-[64%] w-[78%] overflow-hidden rounded-[2rem] shadow-xl"
              initial={{ opacity: 0, rotate: -8, y: 30 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              animate={{
                y: [0, -12, -3, -16, 0],
                x: [0, 5, -2, 4, 0],
                rotate: [4, 6, 3, 7, 4],
              }}
              transition={{
                opacity: { duration: 0.7 },
                y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/capsules/whois-1.jpg"
                alt="GAL'S Studio"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              className="absolute right-0 bottom-6 h-[68%] w-[80%] overflow-hidden rounded-[2rem] shadow-2xl"
              initial={{ opacity: 0, rotate: 10, y: 40 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              animate={{
                y: [0, -8, -16, -5, 0],
                x: [0, -4, 3, -6, 0],
                rotate: [-8, -6, -10, -5, -8],
              }}
              transition={{
                opacity: { duration: 0.75, delay: 0.12 },
                y: {
                  duration: 7.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.35,
                },
                x: {
                  duration: 7.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.35,
                },
                rotate: {
                  duration: 7.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.35,
                },
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/capsules/whois-2.jpg"
                alt="GAL'S Studio"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <motion.p
              className="pointer-events-none absolute top-[38%] right-0 z-20 font-script text-4xl text-gals-blue-deep"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              who is
            </motion.p>
            <motion.p
              className="pointer-events-none absolute -bottom-1 left-[4%] z-20 font-script text-5xl text-gals-blue-deep"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              gals?
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
