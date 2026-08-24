"use client";

import { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { TreeFeatureCard, TreeVideo } from "@/lib/tree";
import {
  TREE_FEATURE_CARDS,
  TREE_HERO_POLAROIDS,
  TREE_LOCATION,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/tree";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/constants";
import { AppQrHint } from "@/components/AppQrHint";

const easeOut = [0.22, 1, 0.36, 1] as const;
const POLAROID_INTERVAL_MS = 3000;

const TREE_FLOWERS = [
  { top: "1%", left: "3%", size: 48, rotate: -18, opacity: 0.8, delay: 0 },
  { top: "3%", right: "5%", size: 40, rotate: 22, opacity: 0.7, delay: 0.3 },
  { top: "9%", left: "72%", size: 32, rotate: -8, opacity: 0.62, delay: 0.6 },
  { top: "14%", left: "6%", size: 44, rotate: 14, opacity: 0.75, delay: 0.2 },
  { top: "22%", right: "2%", size: 52, rotate: -24, opacity: 0.78, delay: 0.8 },
  { top: "27%", left: "1%", size: 34, rotate: 10, opacity: 0.58, delay: 1.1 },
  { top: "33%", left: "85%", size: 38, rotate: -12, opacity: 0.65, delay: 0.4 },
  { top: "38%", left: "10%", size: 36, rotate: 18, opacity: 0.6, delay: 0.55 },
  { top: "44%", right: "8%", size: 46, rotate: -16, opacity: 0.72, delay: 0.15 },
  { top: "49%", left: "4%", size: 42, rotate: 20, opacity: 0.7, delay: 0.9 },
  { top: "54%", left: "78%", size: 30, rotate: -6, opacity: 0.55, delay: 0.65 },
  { top: "58%", right: "12%", size: 36, rotate: 12, opacity: 0.62, delay: 0.15 },
  { top: "63%", left: "8%", size: 48, rotate: 8, opacity: 0.76, delay: 0.7 },
  { top: "68%", right: "3%", size: 40, rotate: -20, opacity: 0.68, delay: 1.2 },
  { top: "73%", left: "2%", size: 32, rotate: 16, opacity: 0.55, delay: 0.5 },
  { top: "78%", left: "80%", size: 44, rotate: -10, opacity: 0.72, delay: 0.25 },
  { top: "84%", left: "15%", size: 38, rotate: 24, opacity: 0.64, delay: 1 },
  { top: "89%", right: "10%", size: 42, rotate: -14, opacity: 0.6, delay: 0.35 },
  { top: "94%", left: "42%", size: 34, rotate: 6, opacity: 0.52, delay: 0.85 },
  { top: "97%", left: "70%", size: 30, rotate: -22, opacity: 0.48, delay: 0.45 },
] as const;

function TreeAtmosphere() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6a7db0] via-[#455882] to-[#2a3558]" />

      {/* Orbes en movimiento lento */}
      <motion.div
        className="absolute -left-[20%] top-[-8%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,rgba(245,246,251,0.28)_0%,transparent_68%)] blur-2xl"
        animate={{ x: [0, 40, -20, 0], y: [0, 30, 10, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[25%] top-[18%] h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(circle,rgba(135,153,196,0.55)_0%,transparent_70%)] blur-3xl"
        animate={{ x: [0, -50, 20, 0], y: [0, 40, -15, 0], scale: [1, 0.92, 1.06, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[10%] h-[45vmax] w-[45vmax] rounded-full bg-[radial-gradient(circle,rgba(111,173,134,0.22)_0%,transparent_68%)] blur-3xl"
        animate={{ x: [0, 30, -40, 0], y: [0, -25, 15, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[5%] top-[55%] h-[28vmax] w-[28vmax] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14)_0%,transparent_70%)] blur-2xl"
        animate={{ opacity: [0.35, 0.7, 0.4], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft light sweep */}
      <motion.div
        className="absolute inset-y-0 w-[40%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
        animate={{ left: ["-40%", "120%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
      />

      <div className="tree-noise absolute inset-0" />

      {/* Flores verdes por todo el fondo */}
      {TREE_FLOWERS.map((f, i) => {
        const hasLeft = "left" in f;
        return (
          <motion.img
            key={`flor-${i}`}
            src="/media/stickers/flor.png"
            alt=""
            className="absolute z-[1] object-contain mix-blend-screen drop-shadow-[0_8px_16px_rgba(20,30,55,0.28)]"
            style={{
              top: f.top,
              left: hasLeft ? f.left : undefined,
              right: !hasLeft && "right" in f ? f.right : undefined,
              width: f.size,
              height: f.size,
              opacity: Math.min(1, f.opacity + 0.15),
            }}
            initial={{ rotate: f.rotate }}
            animate={
              reduced
                ? { rotate: f.rotate }
                : {
                    y: [0, i % 2 === 0 ? -12 : 12, 0],
                    rotate: [
                      f.rotate,
                      f.rotate + (i % 2 === 0 ? 10 : -10),
                      f.rotate,
                    ],
                  }
            }
            transition={{
              duration: 5.5 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: f.delay,
            }}
          />
        );
      })}
    </div>
  );
}

function FloatingDecor() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const items = [
    {
      src: "/media/stickers/flor.png",
      className: "-left-4 top-2 h-12 w-12 sm:-left-6 sm:h-16 sm:w-16",
      rotate: [-12, 8, -12],
      y: [0, -10, 0],
      delay: 0,
    },
    {
      src: "/media/stickers/hongos.png",
      className: "-right-3 top-6 h-14 w-14 sm:-right-5 sm:h-[4.5rem] sm:w-[4.5rem]",
      rotate: [10, -6, 10],
      y: [0, 12, 0],
      delay: 0.4,
    },
    {
      src: "/media/stickers/flor.png",
      className: "-bottom-1 left-0 h-10 w-10 opacity-80 sm:h-12 sm:w-12",
      rotate: [6, -14, 6],
      y: [0, -8, 0],
      delay: 0.8,
    },
  ] as const;

  return (
    <>
      {items.map((item, i) => (
        <motion.img
          key={`${item.src}-${i}`}
          src={item.src}
          alt=""
          className={`pointer-events-none absolute z-[2] object-contain mix-blend-screen drop-shadow-lg ${item.className}`}
          animate={{ y: [...item.y], rotate: [...item.rotate] }}
          transition={{
            duration: 5.5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        />
      ))}
    </>
  );
}

function HeroPolaroidCarousel({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const n = TREE_HERO_POLAROIDS.length;

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % n);
    }, POLAROID_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduced, n]);

  /** Capas del stack: 0 = delante, 1 y 2 = detrás (visibles). */
  const stackPose = [
    { rotate: -2.5, x: 0, y: 0, scale: 1, opacity: 1 },
    { rotate: 10, x: 36, y: 16, scale: 0.94, opacity: 1 },
    { rotate: -13, x: -34, y: 22, scale: 0.9, opacity: 1 },
  ] as const;

  return (
    <motion.div
      className={`relative mx-auto w-full max-w-[360px] sm:max-w-[400px] ${className}`}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easeOut }}
    >
      <FloatingDecor />

      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gals-cream/25 blur-3xl"
        animate={
          reduced
            ? undefined
            : { opacity: [0.3, 0.5, 0.3], scale: [1, 1.06, 1] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Stack: las 3 polaroids siempre visibles */}
      <div className="tree-polaroid-stack relative mx-auto aspect-[4/5] w-[92%] max-w-[320px] sm:max-w-[350px]">
        {TREE_HERO_POLAROIDS.map((photo, i) => {
          const depth = (i - index + n) % n;
          const pose = stackPose[depth]!;
          const isFront = depth === 0;

          return (
            <motion.button
              key={photo.src}
              type="button"
              aria-label={photo.alt}
              aria-current={isFront ? "true" : undefined}
              onClick={() => setIndex(i)}
              className="absolute inset-0 origin-center cursor-pointer border-0 bg-transparent p-0 text-left"
              style={{ zIndex: n - depth }}
              initial={false}
              animate={{
                rotate: pose.rotate,
                x: pose.x,
                y: pose.y,
                scale: pose.scale,
                opacity: pose.opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                mass: 0.9,
              }}
              whileTap={isFront ? { scale: 0.98 } : undefined}
            >
              <div
                className={`h-full w-full bg-white p-3 pb-12 shadow-[0_22px_52px_rgba(20,30,55,0.34)] sm:p-3.5 sm:pb-14 ${
                  isFront ? "ring-1 ring-black/5" : ""
                }`}
              >
                <div className="relative h-full w-full overflow-hidden bg-gals-blue-deep/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <span className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-script text-lg text-gals-blue-deep/80 sm:bottom-3.5 sm:text-xl">
                  gals only
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-1.5" aria-hidden>
        {TREE_HERO_POLAROIDS.map((p, i) => (
          <button
            key={p.src}
            type="button"
            aria-label={`Foto ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index
                ? "w-5 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

/** Pastilla primaria estilo Doctor Bello â†’ GAL'S (cream + azul). */
const pillPrimary =
  "inline-flex items-center justify-center rounded-full bg-[#d8dde9] px-5 py-2.5 text-sm font-semibold tracking-wide text-gals-blue-deep shadow-[0_6px_18px_rgba(0,0,0,0.16)] transition-transform hover:scale-[1.03] active:scale-[0.98]";

const pillOutline =
  "inline-flex items-center justify-center rounded-full border border-white/55 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10";

function TreeLocationPanel({
  className = "",
  mapClassName = "",
  hideDirections = false,
}: {
  className?: string;
  mapClassName?: string;
  /** Oculta el botón “Cómo llegar” del header (p. ej. en desktop se mueve arriba). */
  hideDirections?: boolean;
}) {
  const reduced = useReducedMotion();
  const loc = TREE_LOCATION;

  return (
    <motion.section
      className={`relative z-10 mx-auto mt-12 w-full max-w-lg px-5 ${className}`}
      aria-label="Ubicación"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: easeOut }}
    >
      <div className="overflow-hidden rounded-[1.5rem] border border-white/25 bg-white/[0.1] shadow-[0_18px_48px_rgba(20,30,55,0.32)] backdrop-blur-md">
        <div
          className={`flex items-center gap-3 px-5 py-4 ${
            hideDirections ? "justify-start" : "justify-between"
          }`}
        >
          <h3 className="font-display text-xl tracking-tight text-white uppercase">
            {loc.name}
          </h3>
          {!hideDirections ? (
            <a
              href={loc.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={pillPrimary}
            >
              Cómo llegar
            </a>
          ) : null}
        </div>

        <a
          href={loc.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative block h-[200px] w-full overflow-hidden border-t border-white/15 sm:h-[220px] ${mapClassName}`}
          aria-label="Abrir ubicación en Google Maps"
        >
          {/* Acercamiento suave: tiles nítidos (sin scale extremo) */}
          <motion.div
            className="pointer-events-none absolute inset-0 origin-[50%_48%] will-change-transform"
            animate={
              reduced
                ? { scale: 1.08 }
                : { scale: [1, 1.05, 1.18, 1.18] }
            }
            transition={{
              duration: 8,
              times: [0, 0.15, 0.8, 1],
              repeat: Infinity,
              ease: ["easeOut", [0.2, 0.06, 0.16, 1], "linear"],
              repeatDelay: 1,
            }}
          >
            <iframe
              title="Mapa GAL'S Studio"
              src={loc.mapEmbedUrl}
              className="absolute -inset-[2%] h-[104%] w-[104%] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex={-1}
              allowFullScreen
            />
          </motion.div>

          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a3558]/35 via-transparent to-[#2a3558]/10" />

          {/* Pin fijo: el mapa se clava en este punto */}
          <span className="pointer-events-none absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-full">
            {!reduced ? (
              <motion.span
                aria-hidden
                className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gals-cream/40"
                animate={{ scale: [1, 1.85, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            ) : null}
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gals-blue-deep shadow-[0_10px_28px_rgba(0,0,0,0.4)]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-gals-cream"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
              </svg>
            </span>
          </span>
        </a>
      </div>
    </motion.section>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/** Pastilla Reservar + ícono WA. */
function ReserveWhatsRow({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`relative z-10 mx-auto mt-5 flex items-center justify-center gap-3 px-5 sm:mt-6 ${className}`}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: easeOut }}
    >
      <Link href="/#horario" className={pillPrimary}>
        Reservar
      </Link>

      <a
        href={WHATSAPP_COMMUNITY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Unirme a la comunidad de WhatsApp"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 text-white transition-colors hover:border-white hover:bg-white/10"
      >
        <WhatsAppIcon className="h-[18px] w-[18px]" />
      </a>
    </motion.div>
  );
}

function TreeFeatureCardItem({
  card,
  index,
  cardCls,
}: {
  card: TreeFeatureCard;
  index: number;
  cardCls: string;
}) {
  const reduced = useReducedMotion();
  const imgFit =
    card.fit === "contain"
      ? "object-contain p-2 bg-gradient-to-br from-white/95 to-gals-cream/90"
      : `object-cover ${card.position ?? "object-center"}`;

  const mediaBox = card.portrait
    ? "relative aspect-[3/4] w-[36%] max-w-[130px] shrink-0 self-center overflow-hidden rounded-xl sm:max-w-[148px]"
    : "relative h-[7.5rem] w-[38%] max-w-[140px] shrink-0 overflow-hidden rounded-xl sm:h-[8.5rem] sm:max-w-[160px]";

  const primaryCta = card.beweClass ? (
    <button type="button" className={`${card.beweClass} ${pillPrimary}`}>
      {card.cta}
    </button>
  ) : card.external ? (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      className={pillPrimary}
    >
      {card.cta}
    </a>
  ) : (
    <Link href={card.href || "/"} className={pillPrimary}>
      {card.cta}
    </Link>
  );

  const secondary =
    card.secondaryCta && card.secondaryHref ? (
      <a
        href={card.secondaryHref}
        target={card.secondaryExternal ? "_blank" : undefined}
        rel={card.secondaryExternal ? "noopener noreferrer" : undefined}
        className={pillOutline}
      >
        {card.secondaryCta}
      </a>
    ) : null;

  const motionProps = {
    initial: reduced ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: { duration: 0.55, delay: index * 0.06, ease: easeOut },
  } as const;

  /* ——— Solo imagen como botón ——— */
  if (card.imageTop) {
    const img = (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.35rem] bg-gals-blue-deep/30 shadow-[0_14px_36px_rgba(20,30,55,0.28)] ring-1 ring-white/30 transition duration-300 hover:ring-white/50 lg:aspect-[16/9] lg:max-h-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt={card.title}
          className={`absolute inset-0 h-full w-full object-cover object-center transition duration-500 hover:scale-[1.02] ${card.position ?? "object-center"}`}
        />
      </div>
    );

    return (
      <motion.article className="relative isolate" {...motionProps}>
        {card.external ? (
          <a
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={card.cta}
            className="block"
          >
            {img}
          </a>
        ) : (
          <Link href={card.href || "/"} aria-label={card.cta} className="block">
            {img}
          </Link>
        )}
      </motion.article>
    );
  }

  /* ——— Fusión: fondo atmosférico + foto inset clara ——— */
  if (card.merge) {
    return (
      <motion.article
        className="relative isolate overflow-hidden rounded-[1.35rem] border border-white/30 shadow-[0_14px_36px_rgba(20,30,55,0.28)]"
        {...motionProps}
      >
        {/* Fondo suave (misma foto) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt=""
          className={`pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-[2px] ${card.position ?? "object-center"}`}
        />
        <span className="absolute inset-0 bg-[#3d4f7a]/78" />

        <div className="relative z-[1] flex items-stretch gap-3.5 p-3 sm:gap-4 sm:p-3.5">
          <div className="relative aspect-[3/4] w-[40%] max-w-[148px] shrink-0 overflow-hidden rounded-xl shadow-[0_10px_28px_rgba(0,0,0,0.28)] ring-1 ring-white/25 sm:max-w-[168px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image}
              alt=""
              className={`h-full w-full object-cover ${card.position ?? "object-center"}`}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
            <h3 className="font-display text-[1.05rem] leading-tight tracking-tight text-white uppercase sm:text-xl">
              {card.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-snug text-white/80 sm:text-sm">
              {card.blurb}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {primaryCta}
              {secondary}
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  /* ——— Imagen de fondo a cápsula completa ——— */
  if (card.bgFill) {
    const dual = card.dual;

    return (
      <motion.article
        className="relative isolate overflow-hidden rounded-[1.35rem] border border-white/30 shadow-[0_14px_36px_rgba(20,30,55,0.28)]"
        {...motionProps}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt=""
          className={`absolute inset-0 h-full w-full ${imgFit}`}
        />
        <span className="absolute inset-0 bg-gradient-to-r from-[#2a3558]/90 via-[#2a3558]/50 to-[#2a3558]/25" />
        <span className="absolute inset-0 bg-gradient-to-t from-[#2a3558]/65 via-transparent to-[#2a3558]/20" />

        {dual ? (
          <div className="relative z-[1] flex flex-col gap-4 p-4 sm:gap-5 sm:p-5">
            {dual.map((section, si) => {
              const sectionCta = section.beweClass ? (
                <button
                  type="button"
                  className={`${section.beweClass} ${pillPrimary}`}
                >
                  {section.cta}
                </button>
              ) : (
                <Link href={section.href || "/"} className={pillPrimary}>
                  {section.cta}
                </Link>
              );
              const sectionSecondary =
                section.secondaryCta && section.secondaryHref ? (
                  <a
                    href={section.secondaryHref}
                    target={section.secondaryExternal ? "_blank" : undefined}
                    rel={
                      section.secondaryExternal
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={pillOutline}
                  >
                    {section.secondaryCta}
                  </a>
                ) : null;

              return (
                <div key={section.title}>
                  {si > 0 ? (
                    <div
                      className="mb-4 h-px w-full bg-white/20 sm:mb-5"
                      aria-hidden
                    />
                  ) : null}
                  <h3 className="font-display text-[1.1rem] leading-tight tracking-tight text-white uppercase sm:text-xl">
                    {section.title}
                  </h3>
                  <p className="mt-1.5 max-w-[20rem] text-[13px] leading-snug text-white/85 sm:text-sm">
                    {section.blurb}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {sectionCta}
                    {sectionSecondary}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative z-[1] flex min-h-[168px] flex-col justify-end p-4 sm:min-h-[190px] sm:p-5">
            <h3 className="font-display text-[1.15rem] leading-tight tracking-tight text-white uppercase sm:text-xl">
              {card.title}
            </h3>
            <p className="mt-1.5 max-w-[18rem] text-[13px] leading-snug text-white/85 sm:text-sm">
              {card.blurb}
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              {primaryCta}
              {secondary}
            </div>
          </div>
        )}
      </motion.article>
    );
  }

  return (
    <motion.article
      className={cardCls}
      {...motionProps}
    >
      <div
        className={`${mediaBox} ${
          card.fit === "contain" ? "" : "bg-gals-blue/40"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt=""
          className={`h-full w-full ${imgFit}`}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
        <h3 className="font-display text-[1.05rem] leading-tight tracking-tight text-white uppercase sm:text-xl">
          {card.title}
        </h3>
        <p className="mt-1.5 text-[13px] leading-snug text-white/72 sm:text-sm">
          {card.blurb}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {primaryCta}
          {secondary}
        </div>
      </div>
    </motion.article>
  );
}

function TreeCapsules({
  className = "",
  mode = "all",
}: {
  className?: string;
  /** all = móvil; main = eventos/clase; free = reto/alimentación */
  mode?: "all" | "main" | "free";
}) {
  const reduced = useReducedMotion();
  const cardCls =
    "flex w-full items-stretch gap-3.5 overflow-hidden rounded-[1.35rem] border border-white/30 bg-white/[0.08] p-3 text-left shadow-[0_14px_36px_rgba(20,30,55,0.24)] backdrop-blur-[10px] sm:gap-4 sm:p-3.5";

  const cards = TREE_FEATURE_CARDS.filter((c) => {
    if (mode === "main") return !c.imageTop;
    if (mode === "free") return Boolean(c.imageTop);
    return true;
  });

  return (
    <nav
      className={`relative z-10 mx-auto mt-9 flex w-full max-w-lg flex-col gap-3.5 px-5 ${className}`}
      aria-label={
        mode === "free"
          ? "Contenido gratuito GAL'S"
          : mode === "main"
            ? "Accesos GAL'S"
            : "Accesos GAL'S"
      }
    >
      {mode === "free" ? (
        <motion.div
          className="mb-1 flex items-center gap-3"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.45, ease: easeOut }}
          role="separator"
          aria-label="Contenido gratuito"
        >
          <span className="h-px flex-1 bg-white/25" aria-hidden />
          <p className="shrink-0 text-center text-[11px] font-medium tracking-[0.16em] text-white/70 uppercase sm:text-xs">
            Disfruta el contenido gratuito
          </p>
          <span className="h-px flex-1 bg-white/25" aria-hidden />
        </motion.div>
      ) : null}

      {cards.map((card, i) => {
        const prev = cards[i - 1];
        const showFreeSep =
          mode === "all" && Boolean(card.imageTop && !prev?.imageTop);

        return (
          <Fragment key={card.id}>
            {showFreeSep ? (
              <motion.div
                className="mt-5 mb-1 flex items-center gap-3"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.45, ease: easeOut }}
                role="separator"
                aria-label="Contenido gratuito"
              >
                <span className="h-px flex-1 bg-white/25" aria-hidden />
                <p className="shrink-0 text-center text-[11px] font-medium tracking-[0.16em] text-white/70 uppercase sm:text-xs">
                  Disfruta el contenido gratuito
                </p>
                <span className="h-px flex-1 bg-white/25" aria-hidden />
              </motion.div>
            ) : null}
            <TreeFeatureCardItem
              card={card}
              index={i}
              cardCls={cardCls}
            />
          </Fragment>
        );
      })}
    </nav>
  );
}

function VideosCarousel({
  videos,
  className = "",
  trackClassName = "",
}: {
  videos: TreeVideo[];
  className?: string;
  trackClassName?: string;
}) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const loop = videos.length > 0 ? [...videos, ...videos] : [];

  if (loop.length === 0) return null;

  return (
    <div
      className={`group/videos relative mt-5 overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className={`flex w-max gap-3.5 pl-5 ${trackClassName} ${
          reduced || paused ? "" : "tree-video-marquee"
        }`}
        style={paused || reduced ? undefined : { animationDuration: "28s" }}
      >
        {loop.map((v, i) => (
          <a
            key={`${v.id}-${i}`}
            href={v.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-[200px] shrink-0 sm:w-[220px]"
          >
            {/* Portada 16:9 completa (sin recorte de la thumb de YouTube) */}
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-gals-blue-deep/40 shadow-[0_14px_36px_rgba(0,0,0,0.28)] ring-1 ring-white/15 transition duration-300 group-hover:ring-white/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.thumb}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <p className="mt-2 line-clamp-2 text-left text-[12px] font-medium leading-snug text-white/90 sm:text-[13px]">
              {v.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}


const heroText: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

function TreeVideosSection({
  videos,
  className = "",
  headerClassName = "",
  carouselClassName = "",
  trackClassName = "",
}: {
  videos: TreeVideo[];
  className?: string;
  headerClassName?: string;
  carouselClassName?: string;
  trackClassName?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <section className={`relative z-10 mt-14 w-full ${className}`}>
      <motion.div
        className={`mx-auto flex max-w-lg items-baseline justify-between gap-3 px-5 ${headerClassName}`}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <h2 className="font-display text-2xl tracking-tight text-white uppercase sm:text-[1.75rem]">
          Últimos videos
        </h2>
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm text-white/75 underline-offset-4 transition hover:text-white hover:underline"
        >
          Ver canal
        </a>
      </motion.div>

      <VideosCarousel
        videos={videos}
        className={carouselClassName}
        trackClassName={trackClassName}
      />
    </section>
  );
}

function TreeHeroBrand({
  reduced,
  className = "",
}: {
  reduced: boolean | null;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative z-10 mt-5 flex flex-col items-center text-center ${className}`}
      variants={heroText}
      initial={reduced ? "show" : "hidden"}
      animate="show"
    >
      <motion.p
        variants={heroItem}
        className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-white/80 uppercase backdrop-blur-sm ring-1 ring-white/20"
      >
        Built by GALS for GALS
      </motion.p>
      <motion.h1
        variants={heroItem}
        className="mt-3 font-display text-[2.85rem] leading-[0.92] tracking-tight text-white uppercase sm:text-5xl lg:text-[3.35rem]"
      >
        GAL&apos;S
      </motion.h1>
      <motion.p
        variants={heroItem}
        className="mt-1 font-script text-[2.1rem] leading-none text-gals-cream sm:text-[2.35rem]"
      >
        Studio
      </motion.p>
      <motion.p variants={heroItem} className="mt-3 text-sm text-white/70">
        Pilates · Sculpt · Mat Barre · Yin
      </motion.p>
    </motion.div>
  );
}

function TreeAppAndLogo({
  className = "",
  logoClassName = "",
}: {
  className?: string;
  logoClassName?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <>
      <motion.section
        className={`relative z-10 mx-auto mt-5 w-full max-w-lg px-5 ${className}`}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <AppQrHint
          className="justify-center"
          labelClassName="text-white/70"
        />
      </motion.section>

      <motion.div
        className={`relative z-10 mx-auto mt-2 flex w-full flex-col items-center px-4 pb-1 ${logoClassName}`}
        initial={reduced ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        <div className="relative h-[4.25rem] w-[min(78vw,19rem)] overflow-hidden sm:h-[5rem] sm:w-[22rem]">
          <Image
            src="/brand/logos/logo.png"
            alt="GAL'S Studio"
            fill
            priority
            sizes="(max-width: 640px) 78vw, 22rem"
            className="scale-[1.9] object-contain object-center brightness-0 invert"
          />
        </div>
      </motion.div>
    </>
  );
}

export function GalsTree({ videos }: { videos: TreeVideo[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="relative overflow-x-hidden pb-3 text-white">
      <style>{`
        .tree-noise {
          opacity: 0.06;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        @keyframes treeVideoMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .tree-video-marquee {
          animation-name: treeVideoMarquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .tree-noise { opacity: 0.04; }
          .tree-video-marquee { animation: none !important; }
        }
      `}</style>

      <TreeAtmosphere />

      {/* ——— MÓVIL (sin cambios de estructura) ——— */}
      <div className="lg:hidden">
        <header className="relative mx-auto max-w-lg px-5 pt-6 sm:pt-8">
          <HeroPolaroidCarousel />
          <TreeHeroBrand reduced={reduced} />
        </header>

        <ReserveWhatsRow />
        <TreeCapsules />
        <TreeLocationPanel />
        <TreeVideosSection videos={videos} />
        <TreeAppAndLogo />
      </div>

      {/* ——— DESKTOP: gratuitos más arriba + videos full width ——— */}
      <div className="relative z-10 mx-auto hidden w-full max-w-[68rem] px-5 pb-6 pt-5 lg:block">
        <div className="grid grid-cols-[minmax(260px,34%)_minmax(0,66%)] items-start gap-x-12 gap-y-4 xl:gap-x-16">
          {/* Izquierda: hero → mapa → app */}
          <aside className="flex flex-col gap-3 pr-2 xl:pr-4">
            <header className="relative">
              <HeroPolaroidCarousel className="!max-w-none [&_.tree-polaroid-stack]:!max-w-none [&_.tree-polaroid-stack]:w-full" />
              <TreeHeroBrand reduced={reduced} className="!mt-3" />
            </header>
            <ReserveWhatsRow className="!mt-1 !px-0" />
            <TreeLocationPanel
              className="!mt-0 !max-w-none !px-0"
              mapClassName="!h-[210px] sm:!h-[230px]"
            />
            <motion.div
              className="flex flex-col gap-3 rounded-[1.25rem] border border-white/25 bg-gradient-to-br from-white/[0.14] to-white/[0.06] px-4 py-4 shadow-[0_12px_28px_rgba(20,30,55,0.26)] backdrop-blur-md"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, ease: easeOut }}
            >
              <p className="font-display text-sm tracking-tight text-white uppercase">
                Usa la app
              </p>
              <AppQrHint
                className="!items-stretch !justify-start sm:!flex-col sm:!items-stretch"
                labelClassName="!text-left text-white/70"
              />
              <div className="relative mx-auto h-10 w-40 overflow-hidden">
                <Image
                  src="/brand/logos/logo.png"
                  alt="GAL'S Studio"
                  fill
                  sizes="160px"
                  className="scale-[1.85] object-contain object-center brightness-0 invert"
                />
              </div>
            </motion.div>
          </aside>

          {/* Derecha: principales + gratuitos desde arriba */}
          <div className="flex min-w-0 flex-col gap-3">
            <TreeCapsules
              mode="main"
              className="!mt-0 !max-w-none !gap-2.5 !px-0"
            />
            <TreeCapsules
              mode="free"
              className="!mt-1 !max-w-none !gap-2.5 !px-0"
            />
          </div>

          {/* Videos a ancho completo */}
          <div className="col-span-2 pt-2">
            <TreeVideosSection
              videos={videos}
              className="!mt-0"
              headerClassName="!mx-0 !max-w-none !px-0"
              carouselClassName="!mt-3"
              trackClassName="!pl-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
