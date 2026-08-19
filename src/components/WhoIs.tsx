"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageSticker, StarSticker, STICKER_ASSETS } from "@/components/capsules/Stickers";
import { HERO_VIDEO_URL } from "@/lib/constants";

const WHOIS_IMAGES = [
  "/media/capsules/whois-atras.jpg",
  "/media/capsules/whois-2.jpg",
] as const;

function useRotatingIndex(length: number, intervalMs: number, enabled = true) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!enabled || length < 2) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, length, intervalMs]);
  return index;
}

function CrossfadeImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <AnimatePresence initial={false}>
      <motion.img
        key={src}
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      />
    </AnimatePresence>
  );
}

export function WhoIs() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [focused, setFocused] = useState(false);
  const backIndex = useRotatingIndex(WHOIS_IMAGES.length, 5200);
  const frontIndex = (backIndex + 1) % WHOIS_IMAGES.length;

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    void el.play();
  };

  const openFocus = () => {
    setFocused(true);
    const el = videoRef.current;
    if (el) {
      el.muted = false;
      setMuted(false);
      void el.play();
    }
  };

  const closeFocus = () => setFocused(false);

  useEffect(() => {
    if (!focused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocused(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [focused]);

  return (
    <section
      className={`relative overflow-x-clip bg-gals-blue-deep pb-0 pt-16 text-white md:overflow-visible md:pb-20 md:pt-24 ${
        focused ? "z-[100]" : "z-0"
      }`}
    >
      {/* Desktop: stickers flotando en el bloque azul */}
      <StarSticker
        className="absolute top-16 right-10 hidden opacity-40 md:block"
        size={40}
        color="rgba(255,255,255,0.5)"
      />

      {/* Oscurece el exterior al enfocar el video (solo mobile) */}
      <AnimatePresence>
        {focused && (
          <motion.button
            type="button"
            aria-label="Cerrar video"
            className="fixed inset-0 z-[1] cursor-default bg-black/75 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={closeFocus}
          />
        )}
      </AnimatePresence>

      <div className="relative mx-auto grid max-w-6xl items-center gap-2 px-5 md:grid-cols-2 md:gap-12 md:px-8">
        {/* ——— MOBILE: video enmarcado ——— */}
        <div className="relative z-[2] mx-auto w-full max-w-[560px] px-0 md:hidden">
          <div className="relative pb-8 pt-2">
            <motion.p
              className={`pointer-events-none relative z-20 mb-1 pl-1 font-script text-[2.65rem] leading-none text-gals-cream [text-shadow:0_1px_0_rgba(40,50,80,0.55),0_3px_14px_rgba(0,0,0,0.35)] ${
                focused ? "opacity-30" : ""
              }`}
              initial={{ opacity: 0, y: -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              what is
            </motion.p>

            <div className="overflow-visible px-2 pb-2 pt-1">
              <motion.div
                className="relative z-0 mx-auto w-full max-w-none origin-center"
                initial={{ opacity: 0, y: 28, rotate: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                animate={{
                  rotate: focused ? 0 : -4,
                  scale: focused ? 1.04 : 1,
                }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className={`relative bg-white p-2.5 pb-10 sm:p-3 sm:pb-12 ${
                    focused
                      ? "shadow-[0_0_40px_rgba(255,255,255,0.18),0_28px_80px_rgba(0,0,0,0.55)]"
                      : "shadow-[0_22px_60px_rgba(0,0,0,0.35)]"
                  }`}
                >
                  <StarSticker
                    className="absolute right-3 top-3 z-20 opacity-90 sm:right-4 sm:top-4"
                    size={30}
                    color="rgba(255,255,255,0.95)"
                  />
                  <button
                    type="button"
                    onClick={focused ? closeFocus : openFocus}
                    className="relative block w-full overflow-hidden bg-black"
                    aria-label={focused ? "Cerrar video" : "Ver video"}
                  >
                    <video
                      ref={videoRef}
                      className="aspect-[4/5] h-auto w-full object-cover sm:aspect-[3/4]"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label="Video GAL'S Studio"
                    >
                      <source src={HERO_VIDEO_URL} type="video/mp4" />
                    </video>
                  </button>

                  {muted && !focused ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                        openFocus();
                      }}
                      className="absolute bottom-14 left-1/2 z-10 flex max-w-[88%] -translate-x-1/2 flex-col items-center gap-0.5 rounded-2xl bg-gals-blue-deep/90 px-3.5 py-2 text-center text-white backdrop-blur-sm transition-transform hover:scale-[1.03] sm:bottom-16"
                    >
                      <span className="text-[10px] font-medium opacity-90 sm:text-xs">
                        Tu video ya ha comenzado
                      </span>
                      <span
                        className="flex h-6 w-6 items-center justify-center"
                        aria-hidden
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                        </svg>
                      </span>
                      <span className="text-[10px] font-semibold sm:text-xs">
                        Hacé clic para escuchar
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      aria-label={muted ? "Activar sonido" : "Silenciar"}
                      className="absolute right-4 bottom-14 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gals-blue-deep/85 text-white shadow-md backdrop-blur-sm transition-transform hover:scale-105 sm:bottom-16"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 fill-current"
                        aria-hidden
                      >
                        {muted ? (
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                        ) : (
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        )}
                      </svg>
                    </button>
                  )}

                  <p className="absolute bottom-2.5 left-0 right-0 text-center font-display text-[10px] tracking-[0.18em] text-gals-ink uppercase sm:bottom-3 sm:text-[11px]">
                    GAL&apos;S Studio
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.p
              className={`pointer-events-none relative z-20 mt-2 pr-1 text-right font-script text-[2.75rem] leading-none text-gals-cream [text-shadow:0_1px_0_rgba(40,50,80,0.55),0_3px_14px_rgba(0,0,0,0.35)] sm:text-5xl ${
                focused ? "opacity-30" : ""
              }`}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              gals?
            </motion.p>
          </div>
        </div>

        {/* ——— DESKTOP: collage de imágenes con crossfade ——— */}
        <div className="relative mx-auto hidden h-[560px] w-full md:block lg:h-[600px]">
          <motion.div
            className="absolute top-0 left-0 h-[64%] w-[78%] overflow-hidden rounded-[2rem] shadow-xl md:rounded-[2.4rem]"
            initial={{ opacity: 0, rotate: -8, y: 30 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            animate={{
              y: [0, -14, -4, -18, 0],
              x: [0, 6, -3, 5, 0],
              rotate: [4, 6, 3, 7, 4],
            }}
            transition={{
              opacity: { duration: 0.7 },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.03 }}
          >
            <CrossfadeImage
              src={WHOIS_IMAGES[backIndex]}
              alt="GAL'S Studio"
            />
          </motion.div>
          <motion.div
            className="absolute right-0 bottom-12 h-[68%] w-[80%] overflow-hidden rounded-[2rem] shadow-2xl md:rounded-[2.4rem]"
            initial={{ opacity: 0, rotate: 10, y: 40 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            animate={{
              y: [0, -10, -18, -6, 0],
              x: [0, -5, 4, -7, 0],
              rotate: [-8, -6, -10, -5, -8],
            }}
            transition={{
              opacity: { duration: 0.75, delay: 0.12 },
              y: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              },
              x: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              },
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              },
            }}
            whileHover={{ scale: 1.03 }}
          >
            <CrossfadeImage
              src={WHOIS_IMAGES[frontIndex]}
              alt="GAL'S Studio"
            />
          </motion.div>

          {/* Script editorial: fuera del solape de las fotos */}
          <motion.p
            className="pointer-events-none absolute top-[6%] -right-1 z-20 rotate-[-8deg] font-script text-[3.35rem] leading-none text-gals-cream [text-shadow:0_1px_0_rgba(40,50,80,0.45),0_4px_18px_rgba(0,0,0,0.35)] lg:top-[4%] lg:right-0 lg:text-6xl"
            initial={{ opacity: 0, y: -10, rotate: -12 }}
            whileInView={{ opacity: 1, y: 0, rotate: -8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.28, duration: 0.55 }}
          >
            what is
          </motion.p>
          <motion.p
            className="pointer-events-none absolute bottom-1 left-[2%] z-20 rotate-[4deg] font-script text-[3.75rem] leading-none text-gals-cream [text-shadow:0_1px_0_rgba(40,50,80,0.45),0_4px_18px_rgba(0,0,0,0.35)] lg:bottom-0 lg:left-[4%] lg:text-7xl"
            initial={{ opacity: 0, x: -16, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: 4 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.55 }}
          >
            gals?
          </motion.p>
        </div>

        {/* ——— Copy (compartido) ——— */}
        <div
          className={`relative z-10 pt-1 md:pt-2 ${
            focused ? "z-0" : ""
          }`}
        >
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

          {/* Espacio para hongos abajo a la derecha */}
          <div className="h-16 sm:h-20 md:h-36 lg:h-44" aria-hidden />
        </div>
      </div>

      {/* Flor arriba a la izquierda (desktop) */}
      <ImageSticker
        src={STICKER_ASSETS.flor}
        className="top-10 left-4 hidden md:block lg:top-12 lg:left-8"
        size={140}
        height={160}
        rotate={-10}
        blend={false}
      />
      <ImageSticker
        src={STICKER_ASSETS.flor}
        className="top-6 left-2 md:hidden"
        size={64}
        height={80}
        rotate={-12}
        blend={false}
      />

      {/* Hongos al borde derecho */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-[140px] w-screen max-w-[100vw] -translate-x-1/2 sm:h-[160px] md:h-[300px] lg:h-[340px]"
        aria-hidden
      >
        <ImageSticker
          src={STICKER_ASSETS.hongos}
          className="right-0 bottom-0 md:hidden [&_img]:object-bottom"
          size={88}
          height={140}
          rotate={0}
          blend={false}
          objectPosition="right"
        />
        <ImageSticker
          src={STICKER_ASSETS.hongos}
          className="right-2 bottom-0 hidden md:block lg:right-4 [&_img]:object-bottom"
          size={220}
          height={320}
          rotate={0}
          blend={false}
          objectPosition="right"
        />
      </div>
    </section>
  );
}
