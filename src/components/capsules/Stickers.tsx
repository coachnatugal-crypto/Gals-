"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type StickerProps = {
  className?: string;
  size?: number;
  color?: string;
  rotate?: number;
  float?: boolean;
  delay?: number;
};

function StickerShell({
  children,
  className = "",
  size = 28,
  color = "var(--gals-blue-deep)",
  rotate = 0,
  float = false,
  delay = 0,
}: StickerProps & { children: ReactNode }) {
  return (
    <motion.svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      style={{ color }}
      initial={{ scale: 0, rotate: rotate - 25, opacity: 0 }}
      whileInView={{ scale: 1, rotate, opacity: 1 }}
      viewport={{ once: true }}
      animate={float ? { y: [0, -8, 0] } : undefined}
      transition={
        float
          ? {
              scale: { type: "spring", stiffness: 240, damping: 14, delay },
              opacity: { duration: 0.3, delay },
              y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
            }
          : { type: "spring", stiffness: 240, damping: 14, delay }
      }
      aria-hidden
    >
      {children}
    </motion.svg>
  );
}

export function StarSticker({ size = 28, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <path
        fill="currentColor"
        d="M24 5l5.2 12.4 13.4 1.2-10.2 8.8 3 13L24 33.6 12.6 40.4l3-13L5.4 18.6l13.4-1.2L24 5z"
      />
    </StickerShell>
  );
}

export function FlowerSticker({ size = 26, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g fill="currentColor">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse
            key={deg}
            cx="24"
            cy="12"
            rx="4.6"
            ry="9"
            transform={`rotate(${deg} 24 24)`}
          />
        ))}
        <circle cx="24" cy="24" r="5" fill="var(--gals-cream)" />
      </g>
    </StickerShell>
  );
}

/** Pesa / mancuerna */
export function DumbbellSticker({ size = 30, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M15 24h18" />
        <path d="M12 17v14M36 17v14" />
        <path d="M7 20v8M41 20v8" />
      </g>
    </StickerShell>
  );
}

/** Tapete de yoga enrollado */
export function MatSticker({ size = 30, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round">
        <rect x="8" y="14" width="32" height="20" rx="10" />
        <circle cx="18" cy="24" r="5" />
        <path d="M18 14v20" />
      </g>
    </StickerShell>
  );
}

/** Pelota de pilates */
export function BallSticker({ size = 30, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g stroke="currentColor" strokeWidth="3" fill="none">
        <circle cx="24" cy="24" r="16" />
        <path d="M24 8c-6 5-6 27 0 32M24 8c6 5 6 27 0 32M8 24h32" />
      </g>
    </StickerShell>
  );
}

/** Bloque de yoga */
export function BlockSticker({ size = 30, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round">
        <path d="M9 20l15-7 15 7v10l-15 7-15-7z" />
        <path d="M9 20l15 7 15-7M24 27v10" />
      </g>
    </StickerShell>
  );
}

/** Banda elástica */
export function BandSticker({ size = 30, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M10 30c4-12 24-12 28 0" />
        <circle cx="10" cy="31" r="4" />
        <circle cx="38" cy="31" r="4" />
      </g>
    </StickerShell>
  );
}

/** Hoja / planta */
export function LeafSticker({ size = 26, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M12 38C12 20 24 10 38 10c0 16-10 26-26 28z" />
        <path d="M12 38c6-8 13-15 21-19" />
      </g>
    </StickerShell>
  );
}

/** Corazón trazado a mano */
export function HeartSticker({ size = 26, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <path
        fill="currentColor"
        d="M24 39s-14-8.6-14-18a8 8 0 0114-5.3A8 8 0 0138 21c0 9.4-14 18-14 18z"
      />
    </StickerShell>
  );
}

/** Ondas / respiración */
export function WaveSticker({ size = 30, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M6 18c5-5 8 5 12 0s7 5 12 0 7 5 12 0" />
        <path d="M6 30c5-5 8 5 12 0s7 5 12 0 7 5 12 0" />
      </g>
    </StickerShell>
  );
}

/** Sol / brillo */
export function SunSticker({ size = 28, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round">
        <circle cx="24" cy="24" r="8" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <path key={deg} d="M24 6v5" transform={`rotate(${deg} 24 24)`} />
        ))}
      </g>
    </StickerShell>
  );
}

/** Botella de agua */
export function BottleSticker({ size = 28, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round">
        <path d="M19 8h10v5l3 5v20a4 4 0 01-4 4H20a4 4 0 01-4-4V18l3-5z" />
        <path d="M16 26h16" />
      </g>
    </StickerShell>
  );
}

/** Vela / aromaterapia */
export function CandleSticker({ size = 28, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round">
        <rect x="16" y="20" width="16" height="20" rx="3" />
        <path d="M24 20v-4" />
        <path d="M24 16c3-3 1-6-1-8 0 4-4 4-2 8z" fill="currentColor" />
      </g>
    </StickerShell>
  );
}

/** Flecha dibujada a mano */
export function ArrowSticker({ size = 34, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M8 30c8-14 22-18 32-16" />
        <path d="M32 8l8 6-7 7" />
      </g>
    </StickerShell>
  );
}

/** Smiley */
export function SmileSticker({ size = 28, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round">
        <circle cx="24" cy="24" r="16" />
        <path d="M17 20h.02M31 20h.02" strokeWidth="4" />
        <path d="M16 28c3 4 13 4 16 0" />
      </g>
    </StickerShell>
  );
}

/** Luna minimalista 2D (línea) */
export function MoonSticker({ size = 32, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <path
        d="M30 8.5A16 16 0 1024 40 12.5 12.5 0 0130 8.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StickerShell>
  );
}

/** Línea ondulada minimalista */
export function ScribbleSticker({ size = 48, ...props }: StickerProps) {
  return (
    <StickerShell size={size} {...props}>
      <path
        d="M6 28c6-10 10 8 16 0s10 10 16 0 6-8 10-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </StickerShell>
  );
}

export const STICKER_ASSETS = {
  pesa: "/media/stickers/pesa.png",
  pesas: "/media/stickers/pesas.png",
  tapete: "/media/stickers/tapete.png",
  bola: "/media/stickers/bola.png",
  matcha: "/media/stickers/matcha.png",
  matchaTea: "/media/stickers/matcha-tea.png",
  camara: "/media/stickers/camara.png",
  flor: "/media/stickers/flor.png",
  hongos: "/media/stickers/hongos.png",
} as const;

/**
 * Sticker fotográfico 3D.
 * blend="screen" limpia el fondo negro sobre crema/blanco (estilo Andrea).
 * blend={false} cuando el fondo ya es transparente.
 */
export function ImageSticker({
  src,
  alt = "",
  className = "",
  size = 88,
  rotate = 0,
  float = false,
  delay = 0,
  blend = true,
  objectPosition = "center",
  height,
}: {
  src: string;
  alt?: string;
  className?: string;
  size?: number;
  rotate?: number;
  float?: boolean;
  delay?: number;
  blend?: boolean;
  objectPosition?: "center" | "left" | "right";
  /** Alto opcional (para stickers verticales como hongos). */
  height?: number;
}) {
  const h = height ?? size;
  return (
    <motion.div
      className={`pointer-events-none absolute z-[2] select-none ${className}`}
      style={{ width: size, height: h }}
      initial={{ scale: 0, rotate: rotate - 18, opacity: 0 }}
      whileInView={{ scale: 1, rotate, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      animate={float ? { y: [0, -12, 0] } : undefined}
      transition={
        float
          ? {
              scale: { type: "spring", stiffness: 220, damping: 14, delay },
              opacity: { duration: 0.35, delay },
              rotate: { type: "spring", stiffness: 220, damping: 14, delay },
              y: {
                duration: 5.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay + 0.4,
              },
            }
          : { type: "spring", stiffness: 220, damping: 14, delay }
      }
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`h-full w-full object-contain drop-shadow-[0_14px_28px_rgba(26,42,53,0.28)] ${
          objectPosition === "right"
            ? "object-right"
            : objectPosition === "left"
              ? "object-left"
              : "object-center"
        } ${blend ? "mix-blend-screen" : ""}`}
      />
    </motion.div>
  );
}
