"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";

export function PolaroidFrame({
  children,
  caption,
  rotate = -4,
  className = "",
  float = false,
}: {
  children: ReactNode;
  caption?: string;
  rotate?: number;
  className?: string;
  float?: boolean;
}) {
  return (
    <motion.div
      className={`relative bg-gals-blue-soft p-3 pb-12 shadow-[0_18px_50px_rgba(85,104,148,0.18)] ${
        float ? "animate-float" : ""
      } ${className}`}
      style={
        {
          transform: `rotate(${rotate}deg)`,
          ["--float-rot"]: `${rotate}deg`,
        } as CSSProperties
      }
      initial={{ opacity: 0, y: 40, rotate: rotate - 6 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03, rotate: rotate + 2 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gals-blue-mid">
        {children}
      </div>
      {caption ? (
        <p className="absolute bottom-3 left-3 right-3 font-display text-[10px] tracking-[0.14em] text-gals-ink uppercase sm:text-xs">
          {caption}
        </p>
      ) : null}
    </motion.div>
  );
}

export function PolaroidStack({
  captions = ["COMUNIDAD GAL'S", "BUILT BY GALS", "VOLVER A TI"],
  images = [
    "/media/capsules/whois-1.jpg",
    "/media/capsules/whois-2.jpg",
    "/media/capsules/community-1.jpg",
  ],
  intervalMs = 1600,
}: {
  captions?: string[];
  images?: string[];
  /** Tiempo entre cada foto (ms). Más bajo = más rápido. */
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count < 2) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, intervalMs]);

  // Frente → medio → fondo (offsets más marcados = se siente el shuffle)
  const layers = [
    { rot: -3, x: 0, y: 0, scale: 1, opacity: 1 },
    { rot: 7, x: 14, y: -6, scale: 0.96, opacity: 0.95 },
    { rot: -10, x: -16, y: 12, scale: 0.92, opacity: 0.88 },
  ];

  return (
    <motion.div
      className="relative mx-auto h-[340px] w-[260px] sm:h-[400px] sm:w-[300px]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55 }}
    >
      {images.map((src, imageIndex) => {
        // 0 = frente, 1 = medio, 2 = fondo
        const rel = (imageIndex - active + count) % count;
        if (rel >= layers.length) return null;

        const layer = layers[rel];
        const z = layers.length - rel;
        const isFront = rel === 0;

        return (
          <motion.div
            key={src}
            className="absolute inset-0 bg-gals-blue-soft p-3 pb-12 shadow-[0_16px_40px_rgba(85,104,148,0.22)] will-change-transform"
            style={{ zIndex: z }}
            animate={{
              x: layer.x,
              y: layer.y,
              rotate: layer.rot,
              scale: layer.scale,
              opacity: layer.opacity,
            }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 22,
              mass: 0.7,
            }}
            whileHover={
              isFront
                ? {
                    y: layer.y - 10,
                    rotate: layer.rot + 3,
                    scale: 1.04,
                    transition: { type: "spring", stiffness: 420, damping: 18 },
                  }
                : undefined
            }
          >
            <div className="h-full w-full overflow-hidden bg-gals-blue-mid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={captions[imageIndex % captions.length] ?? "GAL'S"}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="absolute bottom-3 right-3 font-display text-[10px] tracking-[0.12em] text-gals-ink uppercase">
              {captions[imageIndex % captions.length] ?? captions[0]}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

const accentMap = {
  blue: {
    title: "text-[#eef1f8]",
    badge: "bg-gals-blue text-white",
    bg: "from-[#556894] via-[#6b7fb0] to-[#a8b6d9]",
  },
  green: {
    title: "text-[#eaf5ee]",
    badge: "bg-gals-green text-white",
    bg: "from-[#3d7a55] via-[#6fad86] to-[#a8d4b6]",
  },
  deep: {
    title: "text-white",
    badge: "bg-white text-gals-blue-deep",
    bg: "from-[#3d4d73] via-[#556894] to-[#8799c4]",
  },
  silver: {
    title: "text-white",
    badge: "bg-gals-ink text-white",
    bg: "from-[#5a6570] via-[#8a959f] to-[#c5ccd4]",
  },
} as const;

export function CreativeCapsule({
  title,
  script,
  badge,
  accent = "blue",
  className = "",
  image,
  textPosition = "bottom",
}: {
  title: string;
  script: string;
  badge?: string;
  accent?: keyof typeof accentMap;
  className?: string;
  image?: string;
  textPosition?: "top" | "bottom";
}) {
  const a = accentMap[accent];
  const isTop = textPosition === "top";

  return (
    <motion.article
      className={`group relative min-h-[260px] overflow-hidden p-6 md:min-h-[300px] md:p-8 ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className={`absolute inset-0 ${
              isTop
                ? "bg-gradient-to-b from-black/75 via-black/35 to-black/10"
                : "bg-gradient-to-t from-black/75 via-black/40 to-black/20"
            }`}
          />
        </>
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${a.bg}`} aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.25),transparent_45%)]" />
        </>
      )}

      <div
        className={`relative z-10 flex h-full min-h-[220px] flex-col md:min-h-[250px] ${
          isTop ? "justify-between" : "justify-end"
        }`}
      >
        <div>
          <p className="font-script text-xl text-white/95 md:text-2xl">{script}</p>
          <h3
            className={`mt-1 font-display text-3xl leading-[0.9] tracking-tight uppercase md:text-4xl lg:text-5xl ${
              image ? "text-white" : a.title
            }`}
          >
            {title}
          </h3>
        </div>
        {badge ? (
          <div
            className={`max-w-[230px] rounded-2xl px-4 py-3 text-xs font-semibold leading-snug ${
              isTop ? "" : "mt-5"
            } ${a.badge}`}
          >
            {badge}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
