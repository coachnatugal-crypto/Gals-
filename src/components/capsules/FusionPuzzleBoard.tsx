"use client";

import { ImageSticker, STICKER_ASSETS } from "@/components/capsules/Stickers";

type FusionPiece = {
  id: string;
  title: string;
  word: string;
  image: string;
  /** Ancla de texto en el viewBox (zona segura lejos de knobs). */
  label: { x: number; y: number; anchor: "start" | "end" };
};

const PIECES: FusionPiece[] = [
  {
    id: "pilates",
    title: "PILATES",
    word: "Alineación",
    image: "/media/capsules/pilates.jpg",
    label: { x: 56, y: 88, anchor: "start" },
  },
  {
    id: "sculpt",
    title: "SCULPT",
    word: "Fuerza",
    image: "/media/capsules/sculpt.jpg",
    label: { x: 944, y: 88, anchor: "end" },
  },
  {
    id: "barre",
    title: "MAT BARRE",
    word: "Control",
    image: "/media/capsules/barre.jpg",
    label: { x: 56, y: 860, anchor: "start" },
  },
  {
    id: "yin",
    title: "YIN YOGA",
    word: "Calma",
    image: "/media/capsules/yin-yoga.jpg",
    label: { x: 944, y: 860, anchor: "end" },
  },
];

/**
 * Paths 1000×1000 — knobs espejo + esquinas exteriores redondeadas (R=40):
 * TL tab→der + tab↓ · TR socket← + tab↓ · BL socket↑ + tab→ · BR socket↑ + socket←
 */
const R = 40;
const PATHS = {
  pilates: `M20,${20 + R} Q20,20 ${20 + R},20 H500 V210 C500,210 540,210 540,250 C540,290 500,290 500,290 V500 H290 C290,500 290,540 250,540 C210,540 210,500 210,500 H20 Z`,
  sculpt: `M500,20 H${980 - R} Q980,20 980,${20 + R} V500 H790 C790,500 790,540 750,540 C710,540 710,500 710,500 H500 V290 C500,290 540,290 540,250 C540,210 500,210 500,210 Z`,
  barre: `M20,500 H210 C210,500 210,540 250,540 C290,540 290,500 290,500 H500 V710 C500,710 540,710 540,750 C540,790 500,790 500,790 V980 H${20 + R} Q20,980 20,${980 - R} Z`,
  yin: `M500,500 H710 C710,500 710,540 750,540 C790,540 790,500 790,500 H980 V${980 - R} Q980,980 ${980 - R},980 H500 V790 C500,790 540,790 540,750 C540,710 500,710 500,710 Z`,
} as const;

const IMAGE_BOX = {
  pilates: { x: 20, y: 20, w: 520, h: 520 },
  sculpt: { x: 500, y: 20, w: 480, h: 520 },
  barre: { x: 20, y: 500, w: 520, h: 480 },
  yin: { x: 500, y: 500, w: 480, h: 480 },
} as const;

type FusionPuzzleBoardProps = {
  activeIndices: number[];
  onActiveChange: (index: number) => void;
};

export function FusionPuzzleBoard({
  activeIndices,
  onActiveChange,
}: FusionPuzzleBoardProps) {
  const activeSet = new Set(activeIndices);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 1000 1000"
        className="block h-auto w-full"
        role="img"
        aria-label="Fusión GAL'S: Pilates, Sculpt, Barre y Yin Yoga"
      >
        <defs>
          {(Object.keys(PATHS) as (keyof typeof PATHS)[]).map((id) => (
            <clipPath key={`clip-${id}`} id={`gals-fusion-clip-${id}`}>
              <path d={PATHS[id]} />
            </clipPath>
          ))}
          <linearGradient id="gals-fusion-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#000" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.58" />
          </linearGradient>
          <filter id="gals-fusion-label-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodOpacity="0.55" />
          </filter>
        </defs>

        <rect x="8" y="8" width="984" height="984" rx="28" fill="#eef1f8" />

        {PIECES.map((piece, index) => {
          const id = piece.id as keyof typeof PATHS;
          const box = IMAGE_BOX[id];
          const active = activeSet.has(index);
          return (
            <g
              key={piece.id}
              className="cursor-pointer"
              onMouseEnter={() => onActiveChange(index)}
              onFocus={() => onActiveChange(index)}
              onClick={() => onActiveChange(index)}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={`${piece.title}: ${piece.word}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onActiveChange(index);
                }
              }}
            >
              <image
                href={piece.image}
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#gals-fusion-clip-${id})`}
                opacity={active ? 1 : 0.88}
                style={{ transition: "opacity 0.3s ease" }}
              />
              <path
                d={PATHS[id]}
                fill="url(#gals-fusion-shade)"
                pointerEvents="none"
                opacity={active ? 0.85 : 1}
              />
              <path
                d={PATHS[id]}
                fill="none"
                stroke="#ffffff"
                strokeWidth={active ? 6 : 3.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                pointerEvents="none"
                opacity={active ? 1 : 0.92}
              />
              <g
                filter="url(#gals-fusion-label-shadow)"
                pointerEvents="none"
                opacity={active ? 1 : 0.9}
              >
                <text
                  x={piece.label.x}
                  y={piece.label.y}
                  textAnchor={piece.label.anchor}
                  fill="#ffffff"
                  style={{
                    fontFamily: "var(--font-script), cursive",
                    fontSize: "34px",
                  }}
                >
                  {piece.word}
                </text>
                <text
                  x={piece.label.x}
                  y={piece.label.y + 48}
                  textAnchor={piece.label.anchor}
                  fill="#ffffff"
                  style={{
                    fontFamily:
                      "var(--font-display), Helvetica, Arial, sans-serif",
                    fontSize: "42px",
                    letterSpacing: "0.02em",
                    fontWeight: 700,
                  }}
                >
                  {piece.title}
                </text>
              </g>
            </g>
          );
        })}

      </svg>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <ImageSticker
          src={STICKER_ASSETS.flor}
          alt=""
          size={92}
          className="!relative !left-auto !top-auto"
          rotate={-8}
          float
        />
      </div>
    </div>
  );
}

export { PIECES as FUSION_PUZZLE_PIECES };
