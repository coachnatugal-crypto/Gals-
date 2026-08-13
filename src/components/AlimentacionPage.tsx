"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ALIMENTACION, ytThumb, ytWatch } from "@/lib/alimentacion";
import { ImageSticker, STICKER_ASSETS } from "@/components/capsules/Stickers";

const data = ALIMENTACION;

function DriveButton({
  href,
  label = "Abrir material descargable",
}: {
  href?: string;
  label?: string;
}) {
  if (!href) {
    return (
      <p className="rounded-2xl border border-dashed border-gals-blue/40 bg-gals-blue-soft/50 px-4 py-3 text-sm text-gals-muted">
        El material descargable de esta semana aparece aquí cuando esté listo.
      </p>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-gals-blue-deep px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
    >
      {label}
    </a>
  );
}

function WeekNav() {
  return (
    <nav
      aria-label="Semanas del método"
      className="sticky top-[4.25rem] z-30 -mx-4 mb-2 overflow-x-auto bg-[#f4f5f7]/90 px-4 py-3 backdrop-blur-md md:top-[5rem] md:-mx-0 md:mb-4 md:rounded-2xl md:border md:border-[#e6e8ee] md:bg-white/90 md:px-4 md:py-3.5"
    >
      <div className="flex min-w-max gap-2 md:flex-wrap md:justify-center">
        {data.weekNav.map((w) => (
          <a
            key={w.id}
            href={`#${w.id}`}
            className="rounded-full bg-gals-blue-deep/90 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gals-blue-deep"
          >
            {w.id === "empezar" ? (
              w.hint
            ) : (
              <>
                Semana {w.label}
                <span className="ml-1 font-normal text-white/75">
                  · {w.hint}
                </span>
              </>
            )}
          </a>
        ))}
      </div>
    </nav>
  );
}

function HongosEdge({
  className = "top-2",
  size = 78,
  height = 132,
  delay = 0,
}: {
  className?: string;
  size?: number;
  height?: number;
  delay?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-1/2 z-[1] h-full w-screen max-w-[100vw] -translate-x-1/2"
      aria-hidden
    >
      <ImageSticker
        src={STICKER_ASSETS.hongos}
        className={`right-0 ${className}`}
        size={size}
        height={height}
        rotate={0}
        float
        delay={delay}
        blend={false}
        objectPosition="right"
      />
    </div>
  );
}

function WeekShell({
  id,
  eyebrow,
  title,
  subtitle,
  driveHref,
  driveLabel,
  largeTitle = false,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  driveHref?: string;
  driveLabel?: string;
  largeTitle?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-28 overflow-visible">
      <div
        className={`relative z-10 mb-3 flex flex-col gap-2 sm:items-end sm:justify-between ${
          driveHref ? "mb-5 sm:flex-row sm:gap-4" : ""
        }`}
      >
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          large={largeTitle}
          className="mb-0 max-w-[calc(100%-5.5rem)] sm:max-w-xl md:max-w-3xl"
        />
        {driveHref ? (
          <div className="relative z-10 shrink-0 sm:pb-5">
            <DriveButton href={driveHref} label={driveLabel} />
          </div>
        ) : null}
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
  className = "mb-5",
  large = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  large?: boolean;
}) {
  return (
    <header className={className}>
      {eyebrow ? (
        <p
          className={`font-semibold tracking-[0.16em] text-gals-blue-deep uppercase ${
            large ? "text-sm md:text-base" : "text-xs"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-1 font-display tracking-tight text-gals-ink uppercase ${
          large
            ? "text-3xl sm:text-4xl md:text-5xl"
            : "text-2xl md:text-3xl"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-2 max-w-2xl leading-relaxed text-gals-muted ${
            large ? "text-base md:text-lg" : "text-sm md:text-base"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

function VideoCard({
  video,
  rotate = -3,
}: {
  video: {
    id: string;
    youtubeId: string;
    title: string;
    tag: string;
    blurb: string;
  };
  rotate?: number;
}) {
  return (
    <motion.a
      href={ytWatch(video.youtubeId)}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative mx-auto block max-w-xl rounded-[1.35rem] bg-white p-2.5 pb-4 shadow-[0_16px_40px_rgba(85,104,148,0.14)] md:max-w-3xl md:p-3 md:pb-5"
      style={{ rotate: `${rotate}deg` }}
      initial={{ opacity: 0, y: 28, rotate: rotate - 5 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, rotate: rotate + 1.5 }}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gals-blue-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ytThumb(video.youtubeId)}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
          {video.tag}
        </span>
        <span className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-sm text-gals-blue-deep shadow">
          ▶
        </span>
      </div>
      <div className="space-y-1 px-2 pt-3">
        <p className="font-semibold text-gals-ink">{video.title}</p>
        <p className="text-sm text-gals-muted">{video.blurb}</p>
      </div>
    </motion.a>
  );
}

function WeekMap() {
  const accents = [
    "from-gals-blue-soft to-white",
    "from-[#eaf5ee] to-white",
    "from-[#f5f0ea] to-white",
    "from-[#f0eef8] to-white",
    "from-[#eef6f8] to-white",
  ];
  const rotates = [-2.2, 1.8, -1.4, 2.4, -1.8];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {data.weekGuide.map((w, i) => (
        <motion.a
          key={w.id}
          href={`#${w.id}`}
          className={`group relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br p-5 shadow-[0_10px_32px_rgba(85,104,148,0.1)] sm:p-6 xl:p-5 ${accents[i % accents.length]}`}
          style={{ rotate: `${rotates[i % rotates.length]}deg` }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          whileHover={{ scale: 1.02, rotate: 0 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-gals-blue-deep/80 uppercase">
                Semana {w.week}
              </p>
              <p className="mt-2 font-display text-xl tracking-tight text-gals-ink uppercase md:text-2xl">
                {w.title}
              </p>
            </div>
            <span className="font-script text-2xl text-gals-blue-deep">
              {w.hint}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gals-muted md:text-[15px]">
            {w.body}
          </p>
          <p className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gals-blue-deep transition-transform group-hover:translate-x-1">
            Entrar a esta semana
            <span aria-hidden>→</span>
          </p>
        </motion.a>
      ))}
    </div>
  );
}

function AudioPlayerCard({
  audio,
  index,
  activeId,
  onPlay,
}: {
  audio: (typeof data.audios)[number];
  index: number;
  activeId: string | null;
  onPlay: (id: string) => void;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number>(audio.durationSeconds);
  const [current, setCurrent] = useState(0);
  const rotate = index % 2 === 0 ? -2.8 : 3.2;
  const wave = [10, 18, 12, 22, 14, 26, 11, 20, 13, 24, 9, 19];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (activeId !== audio.id && !el.paused) {
      el.pause();
      setPlaying(false);
    }
  }, [activeId, audio.id]);

  const toggle = async () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      onPlay(audio.id);
      await el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const total = duration > 0 ? duration : audio.durationSeconds;

  return (
    <motion.article
      className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-gals-blue-soft via-white to-[#e8eef8] p-5 shadow-[0_18px_44px_rgba(85,104,148,0.14)] sm:p-6"
      style={{ rotate: `${rotate}deg` }}
      initial={{ opacity: 0, y: 28, rotate: rotate - 4 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.015, rotate: rotate + (index % 2 === 0 ? 1.2 : -1.2) }}
    >
      <div
        className="pointer-events-none absolute -top-10 -right-8 h-36 w-36 rounded-full bg-gals-blue/15 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-gals-blue-deep/10 blur-2xl"
        aria-hidden
      />

      <p className="font-script text-2xl text-gals-blue-deep">Escucha</p>
      <h3 className="mt-1 font-display text-xl tracking-tight text-gals-ink uppercase md:text-2xl">
        {audio.title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gals-muted">
        {audio.blurb}
      </p>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar" : "Reproducir"}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-[0_10px_24px_rgba(85,104,148,0.35)] transition-transform hover:scale-105 ${
            playing ? "bg-gals-blue" : "bg-gals-blue-deep"
          }`}
        >
          {playing ? (
            <span className="flex gap-1">
              <span className="h-4 w-1 rounded-full bg-white" />
              <span className="h-4 w-1 rounded-full bg-white" />
            </span>
          ) : (
            <span className="ml-0.5 text-lg">▶</span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div
            className="mb-2 flex h-8 items-end gap-[3px]"
            aria-hidden
          >
            {wave.map((h, i) => (
              <span
                key={i}
                className={`w-1.5 rounded-full transition-colors ${
                  playing ? "bg-gals-blue-deep" : "bg-gals-blue/45"
                } ${playing ? "animate-pulse" : ""}`}
                style={{
                  height: h,
                  animationDelay: playing ? `${i * 70}ms` : undefined,
                }}
              />
            ))}
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            aria-label="Progreso"
            onChange={(e) => {
              const el = ref.current;
              if (!el || !total) return;
              const next = Number(e.target.value);
              el.currentTime = (next / 100) * total;
              setProgress(next);
            }}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gals-blue/25 accent-gals-blue-deep [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gals-blue-deep"
          />
          <div className="mt-1.5 flex justify-between text-[11px] font-medium tracking-wide text-gals-muted">
            <span>{formatTime(current)}</span>
            <span>{audio.durationLabel || formatTime(total)}</span>
          </div>
        </div>
      </div>

      <audio
        ref={ref}
        preload="metadata"
        src={audio.src}
        onLoadedMetadata={() => {
          const d = ref.current?.duration;
          if (d && Number.isFinite(d) && d > 0) setDuration(d);
        }}
        onTimeUpdate={() => {
          const el = ref.current;
          if (!el) return;
          const d = el.duration > 0 ? el.duration : total;
          setCurrent(el.currentTime);
          if (d > 0) setProgress((el.currentTime / d) * 100);
        }}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
          setCurrent(0);
        }}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </motion.article>
  );
}

function AudioCards() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
      {data.audios.map((a, i) => (
        <AudioPlayerCard
          key={a.id}
          audio={a}
          index={i}
          activeId={activeId}
          onPlay={setActiveId}
        />
      ))}
    </div>
  );
}

function RecommendationsBlock() {
  return (
    <div className="relative">
      <div className="grid items-start gap-8 md:grid-cols-[minmax(180px,260px)_1fr] md:gap-10 lg:gap-12">
        <motion.div
          className="relative mx-auto w-full max-w-[240px] md:sticky md:top-28 md:mx-0 md:max-w-none"
          initial={{ opacity: 0, y: 24, rotate: -6 }}
          whileInView={{ opacity: 1, y: 0, rotate: -2 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.heroImage}
            alt=""
            className="h-auto w-full object-contain drop-shadow-[0_20px_36px_rgba(85,104,148,0.25)]"
          />
          <p className="mt-3 text-center font-script text-xl text-gals-blue-deep md:hidden">
            Comer también puede sentirse suave
          </p>
        </motion.div>

        <div className="min-w-0">
          <p className="mb-5 hidden font-script text-2xl text-gals-blue-deep md:block md:text-3xl">
            Comer también puede sentirse suave
          </p>

          <div className="space-y-3">
            {data.recommendations.map((r, i) => {
              const flip = i % 2 === 1;
              return (
                <motion.article
                  key={r.num}
                  className={`rounded-2xl border border-gals-ink/12 bg-white/90 p-5 shadow-[0_8px_28px_rgba(26,42,53,0.04)] sm:p-6 ${
                    flip ? "md:text-right" : ""
                  }`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                >
                  <p
                    className={`font-display text-3xl tracking-tight text-gals-blue-deep/30 ${
                      flip ? "md:text-right" : ""
                    }`}
                  >
                    {r.num}
                  </p>
                  <h3 className="mt-1 font-display text-lg tracking-tight text-gals-ink uppercase md:text-xl">
                    {r.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed text-gals-muted ${
                      flip ? "md:ml-auto md:max-w-xl" : "max-w-xl"
                    }`}
                  >
                    {r.body}
                  </p>
                </motion.article>
              );
            })}

            <motion.div
              className="flex flex-col gap-5 rounded-2xl border border-gals-blue/25 bg-gradient-to-br from-white to-gals-blue-soft/80 p-5 shadow-[0_8px_28px_rgba(85,104,148,0.08)] sm:flex-row sm:items-center sm:p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <div className="flex-1">
                <p className="font-display text-xl tracking-tight text-gals-ink uppercase md:text-2xl">
                  {data.diary.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gals-muted">
                  {data.diary.subtitle}
                </p>
                <p className="mt-3 text-sm text-gals-ink">
                  <span className="font-semibold text-gals-blue-deep">
                    {data.diary.noteTitle}:{" "}
                  </span>
                  {data.diary.note}
                </p>
              </div>
              <a
                href={data.diary.href}
                download="diario-sintomas-gals.pdf"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-gals-blue-deep px-6 py-3.5 text-sm font-semibold text-white"
              >
                Descargar diario
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideGroups({
  groups,
}: {
  groups: readonly { name: string; items: readonly string[] }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {groups.map((g) => (
        <div
          key={g.name}
          className="rounded-2xl border border-[#e6e8ee] bg-white p-5 md:p-6"
        >
          <p className="font-display text-sm tracking-wide text-gals-blue-deep uppercase">
            {g.name}
          </p>
          <ul className="mt-3 space-y-1.5">
            {g.items.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-snug text-gals-ink"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gals-blue" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MarketList() {
  const accents = [
    "from-[#eef1f8] to-[#e4eaf6]",
    "from-[#eaf5ee] to-[#e0efe6]",
    "from-[#f5f0ea] to-[#efe6dc]",
    "from-[#f0eef8] to-[#e8e4f4]",
    "from-[#eef6f8] to-[#e2eef2]",
  ];
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      <p className="max-w-xl text-sm leading-relaxed text-gals-muted">
        Marca lo que ya tienes en casa. Empieza por Frescos y sigue a tu ritmo:
        no es una obligación, es una canasta para inspirarte.
      </p>

      <div className="space-y-5 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
        {data.marketList.categories.map((c, ci) => (
          <div
            key={c.name}
            className={`space-y-5 ${
              c.name === "Semillas y frutos secos" ? "md:col-span-2" : ""
            }`}
          >
            <article
              className={`overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-5 shadow-[0_10px_32px_rgba(85,104,148,0.08)] sm:p-6 ${accents[ci % accents.length]}`}
            >
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg tracking-tight text-gals-ink uppercase md:text-xl">
                  {c.name}
                </h3>
                <span className="font-script text-xl text-gals-blue-deep">
                  {c.items.length}
                </span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {c.items.map((item) => {
                  const key = `${c.name}-${item}`;
                  const on = Boolean(checked[key]);
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        className={`rounded-full border px-3.5 py-1.5 text-left text-sm transition-colors ${
                          on
                            ? "border-gals-blue-deep bg-gals-blue-deep text-white line-through decoration-white/50"
                            : "border-white/80 bg-white/80 text-gals-ink hover:border-gals-blue"
                        }`}
                      >
                        {item}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </article>

            {c.name === "Semillas y frutos secos" ? (
              <div className="flex flex-col items-center gap-4 py-2 md:flex-row md:items-center md:justify-center md:gap-10 md:py-6">
                <p className="max-w-md text-center font-script text-3xl leading-snug text-gals-blue-deep sm:text-4xl md:max-w-xs md:text-left md:text-5xl">
                  Elige con calma:
                </p>
                <motion.div
                  className="relative z-10 mx-auto w-full max-w-[240px] md:max-w-[300px] md:shrink-0"
                  initial={{ opacity: 0, x: -80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="overflow-hidden rounded-[1.5rem] bg-white p-2.5 shadow-[0_18px_44px_rgba(85,104,148,0.18)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.marketImage}
                      alt=""
                      className="aspect-[3/4] w-full rounded-[1.15rem] object-cover"
                    />
                  </div>
                </motion.div>
                <p className="max-w-md text-center font-script text-3xl leading-snug text-gals-blue-deep sm:text-4xl md:text-5xl">
                  lo que entra al carrito también te cuida
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyActions({ week }: { week: number }) {
  const items = data.weeklyActions.filter((w) => w.week === week);

  return (
    <div className="space-y-5">
      {items.map((w) => (
        <article
          key={w.week}
          className="overflow-hidden rounded-2xl border border-[#e6e8ee] bg-white shadow-[0_4px_20px_rgba(26,42,53,0.04)]"
        >
          <div className="border-b border-[#eceef2] bg-gals-blue-soft/50 px-5 py-4 md:px-7 md:py-5">
            <p className="font-display text-xl tracking-tight text-gals-blue-deep uppercase md:text-2xl">
              {w.title}
            </p>
            <p className="mt-1 text-sm text-gals-muted md:text-base">{w.focus}</p>
          </div>
          <ol className="space-y-4 p-5 md:space-y-5 md:p-7">
            {w.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-display text-2xl leading-none text-gals-blue-deep md:text-3xl">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gals-ink md:text-base">
                  {step}
                </p>
              </li>
            ))}
          </ol>
          <p className="border-t border-[#eceef2] px-5 py-3 text-sm text-gals-muted md:px-7">
            Tu coach, Nati · Método Body In Flow
          </p>
        </article>
      ))}
    </div>
  );
}

function IntentionsMap() {
  return (
    <div className="rounded-2xl border border-[#e6e8ee] bg-white p-5 sm:p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {data.intentions.prompts.map((p) => (
          <label key={p.id} className="block space-y-1.5">
            <span className="text-xs font-semibold tracking-[0.12em] text-gals-blue-deep uppercase">
              {p.label}
            </span>
            <textarea
              rows={3}
              placeholder={p.hint}
              className="w-full resize-y rounded-xl border border-[#e6e8ee] bg-gals-cream/60 px-3 py-2.5 text-sm text-gals-ink outline-none placeholder:text-gals-muted/70 focus:border-gals-blue md:min-h-[6.5rem] md:px-4 md:py-3"
            />
          </label>
        ))}
      </div>
      <p className="mt-4 text-xs text-gals-muted">
        Esto es solo para ti en este momento. Si te gusta, cópialo a tus notas.
      </p>
    </div>
  );
}

export function AlimentacionPage() {
  return (
    <div className="relative overflow-x-clip pb-16 md:pb-24">
      <section className="relative overflow-hidden pt-20 pb-16 md:flex md:min-h-[72vh] md:items-center md:pt-28 md:pb-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.heroBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center md:object-[center_30%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#f4f5f7]/92 via-[#f4f5f7]/72 to-[#f4f5f7]/35 md:from-[#f4f5f7]/95 md:via-[#f4f5f7]/60 md:to-transparent"
          aria-hidden
        />

        <ImageSticker
          src={STICKER_ASSETS.flor}
          className="top-24 right-3 z-[3] sm:right-8 md:top-32 md:right-20"
          size={48}
          rotate={14}
          float
          blend={false}
        />
        <ImageSticker
          src={STICKER_ASSETS.flor}
          className="bottom-20 left-3 z-[3] sm:left-8 md:bottom-32 md:left-12"
          size={40}
          rotate={-18}
          float
          delay={0.15}
          blend={false}
        />

        {/* Varias gotas en el borde inferior */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-[64px] w-full text-[#f4f5f7] md:h-[88px]"
          viewBox="0 0 1200 88"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0 0
               C50 0 50 58 100 58
               C150 58 150 0 200 0
               C250 0 250 72 300 72
               C350 72 350 0 400 0
               C450 0 450 48 500 48
               C550 48 550 0 600 0
               C650 0 650 80 700 80
               C750 80 750 0 800 0
               C850 0 850 54 900 54
               C950 54 950 0 1000 0
               C1050 0 1050 68 1100 68
               C1150 68 1150 0 1200 0
               L1200 88 L0 88 Z"
          />
        </svg>

        <div className="relative mx-auto w-full max-w-6xl px-4 py-12 pb-16 md:max-w-7xl md:px-10 md:py-16 md:pb-20">
          <div className="max-w-2xl md:max-w-xl lg:max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-gals-blue-deep uppercase">
              {data.subtitle}
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-tight text-gals-ink uppercase md:text-5xl lg:text-6xl">
              {data.title}
            </h1>
            <p className="mt-2 font-script text-2xl text-gals-blue-deep md:text-3xl lg:text-4xl">
              Comer con presencia
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gals-muted md:text-base lg:text-lg">
              {data.intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#empezar"
                className="rounded-full bg-gals-blue-deep px-5 py-3 text-sm font-semibold text-white md:px-6 md:py-3.5"
              >
                Empezar
              </a>
              <a
                href="#semana-0"
                className="rounded-full border border-gals-ink/80 bg-white/80 px-5 py-3 text-sm font-semibold text-gals-ink backdrop-blur-sm md:px-6 md:py-3.5"
              >
                Ir al mercado
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-8 md:max-w-7xl md:space-y-20 md:px-10 md:pt-14">
        <WeekNav />

        <section id="empezar" className="scroll-mt-28">
          <SectionTitle
            title="Por qué esto importa"
            subtitle="No es una dieta más. Es aprender a elegir con más conciencia, escuchar tu cuerpo y sostener el movimiento desde adentro. Cuando la comida acompaña, todo el método se siente más liviano."
            className="mb-5 md:max-w-3xl"
          />
          <VideoCard video={data.introVideo} rotate={-2.5} />

          <div className="mt-14 md:mt-20">
            <SectionTitle
              title="Tu camino por semanas"
              subtitle="Cinco momentos para ir a tu ritmo. Entra por el que necesites hoy."
              className="mb-5 md:max-w-3xl"
            />
            <WeekMap />
          </div>
        </section>

        <WeekShell
          id="semana-0"
          eyebrow="Semana 0"
          title="Tu canasta"
          subtitle="Esta semana no es sobre comer perfecto: es armar tu base. Llenas la nevera con intención, revisas lo que ya tienes y cocinas con calma."
          largeTitle
        >
          <div className="mb-8 max-w-2xl space-y-3 rounded-2xl bg-gals-blue-soft/70 p-5 sm:p-6 md:mb-10 md:max-w-3xl md:p-8">
            <p className="font-script text-2xl text-gals-blue-deep md:text-3xl">
              De qué trata esta semana
            </p>
            <p className="text-sm leading-relaxed text-gals-ink md:text-base">
              Semana 0 es el aterrizaje: armas tu canasta, marcas lo que ya está
              en casa y bajas la lista completa si la quieres imprimir. Después
              miras la clase de cocina para llevar el método a la olla.
            </p>
          </div>

          <div className="relative mb-10 overflow-x-clip md:mb-14">
            <div className="md:grid md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-12 lg:gap-16">
              <p className="relative z-10 max-w-lg font-script text-3xl leading-snug text-gals-blue-deep sm:text-4xl md:max-w-none md:text-5xl lg:text-6xl">
                Empezar por la despensa también es cuidarte
              </p>
              <motion.div
                className="relative z-10 mx-auto mt-4 w-[min(52vw,200px)] sm:w-[210px] md:mt-0 md:w-[280px] md:justify-self-end lg:w-[320px]"
                initial={{ opacity: 0, x: "-55vw" }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.cartImage}
                  alt="Al mercado con presencia"
                  className="h-auto w-full object-contain drop-shadow-[0_18px_36px_rgba(85,104,148,0.22)]"
                />
              </motion.div>
            </div>
          </div>

          <div className="mb-5">
            <p className="mb-3 max-w-xl text-sm leading-relaxed text-gals-muted md:text-base">
              Abajo tienes la canasta por categorías, empezando por lo fresco.
              Si quieres la lista completa para llevarla al mercado, descárgala
              aquí.
            </p>
            <DriveButton
              href={data.driveFolders.week0 || undefined}
              label="Descargar lista"
            />
          </div>

          <MarketList />
          <div className="mt-10">
            <p className="mb-4 font-script text-2xl text-gals-blue-deep md:text-3xl">
              Y luego, a la olla
            </p>
            <VideoCard video={data.week0Video} rotate={3} />
          </div>
        </WeekShell>

        <WeekShell
          id="semana-1"
          eyebrow="Semana 1"
          title="Volver a ti"
          subtitle="Aquí va lo corto: la acción semanal y el mapa. Lo largo —la Guía de Alimentación Semana 1— vive en el material descargable."
        >
          <ImageSticker
            src={STICKER_ASSETS.flor}
            className="top-[18.5rem] left-3 z-[3] sm:left-6 md:hidden"
            size={38}
            rotate={10}
            float
            blend={false}
          />
          <div className="flex flex-col gap-4 md:gap-10">
            <div className="md:grid md:grid-cols-[minmax(240px,340px)_1fr] md:items-start md:gap-12 lg:gap-16">
              <div className="relative flex justify-center overflow-visible md:sticky md:top-28">
                <ImageSticker
                  src={STICKER_ASSETS.flor}
                  className="-right-1 top-2 z-[3] sm:right-8 md:right-0"
                  size={34}
                  rotate={-20}
                  float
                  delay={0.12}
                  blend={false}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.plateImage}
                  alt="Plato nutricional: vegetales, proteínas, carbohidratos y grasas"
                  className="plate-spin -my-1 h-auto w-[min(68vw,280px)] object-contain drop-shadow-[0_10px_22px_rgba(85,104,148,0.18)] md:w-full md:max-w-[340px]"
                  draggable={false}
                />
              </div>

              <div className="space-y-4 md:space-y-6">
                {data.longGuides.map((g) => (
                  <article
                    key={g.id}
                    className="rounded-2xl bg-gradient-to-br from-gals-blue to-gals-blue-deep p-6 text-white shadow-[0_8px_30px_rgba(85,104,148,0.25)] md:p-8"
                  >
                    <p className="text-xs font-semibold tracking-[0.16em] text-white/75 uppercase">
                      {g.eyebrow}
                    </p>
                    <h3 className="mt-2 font-display text-2xl uppercase md:text-3xl">
                      {g.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base">
                      {g.summary}
                    </p>
                    <ul className="mt-5 space-y-2">
                      {g.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-white/95">
                          <span aria-hidden>→</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <a
                        href={data.week1Files.guideHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-gals-blue-deep"
                      >
                        Abrir guía completa →
                      </a>
                      <a
                        href={data.week1Files.habitsPdf}
                        download="habitos-tracker-gals.pdf"
                        className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm"
                      >
                        Descargar tracker de hábitos
                      </a>
                    </div>
                  </article>
                ))}

                <WeeklyActions week={1} />
              </div>
            </div>

            <div>
              <SectionTitle
                title={data.intentions.title}
                subtitle="Puedes escribirlo aquí o bajar el PDF para imprimir y llenarlo a mano."
              />
              <div className="mb-4">
                <a
                  href={data.week1Files.mapPdf}
                  download="mapa-intenciones-gals.pdf"
                  className="inline-flex items-center justify-center rounded-full border border-gals-blue/30 bg-white px-5 py-3 text-sm font-semibold text-gals-blue-deep shadow-[0_4px_16px_rgba(85,104,148,0.08)] transition-transform hover:scale-[1.02]"
                >
                  Descargar e imprimir el mapa
                </a>
              </div>
              <IntentionsMap />
            </div>
          </div>
        </WeekShell>

        <WeekShell
          id="semana-2"
          eyebrow="Semana 2"
          title="Etiquetas y despensa"
          subtitle="Aquí practicas en corto: la acción semanal y las guías de compra. Lo largo —la Guía de Alimentación Semana 2— vive en el material descargable."
        >
          <HongosEdge className="top-2 md:top-0" size={72} height={120} delay={0.05} />
          <div className="space-y-10 md:space-y-14">
            <article className="rounded-2xl bg-gradient-to-br from-gals-blue to-gals-blue-deep p-6 text-white shadow-[0_8px_30px_rgba(85,104,148,0.25)] md:p-8 lg:p-10">
              <p className="text-xs font-semibold tracking-[0.16em] text-white/75 uppercase">
                El documento largo
              </p>
              <h3 className="mt-2 font-display text-2xl uppercase md:text-3xl">
                Guía de Alimentación · Semana 2
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base">
                Es el ebook Body In Flow de esta semana: conocimiento para dejar
                de pesar comida a ciegas y volver a elegir desde ti —hambre,
                saciedad y lo que te hace sentir bien. Son muchas páginas; por
                eso no las metemos aquí. Los tarjeteros imprimibles también
                están en el material descargable.
              </p>
              <div className="mt-5">
                {data.driveFolders.week2 ? (
                  <a
                    href={data.driveFolders.week2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-gals-blue-deep"
                  >
                    Ir a la guía →
                  </a>
                ) : (
                  <DriveButton />
                )}
              </div>
            </article>

            <WeeklyActions week={2} />

            <div>
              <SectionTitle
                title={data.avoidGuide.title}
                subtitle="Léela al hacer tus compras. Son los ingredientes inflamatorios del tarjetero."
              />
              <GuideGroups groups={data.avoidGuide.groups} />
            </div>
            <div>
              <SectionTitle
                title={data.labelGuide.title}
                subtitle="Otros nombres que se esconden en la lista de ingredientes."
              />
              <GuideGroups groups={data.labelGuide.groups} />
            </div>
          </div>
        </WeekShell>

        <section id="semana-3" className="relative scroll-mt-28 overflow-visible">
          <div className="relative z-10 mb-10 md:mb-14">
            <div className="flex items-end gap-2 sm:items-center sm:gap-5 md:grid md:grid-cols-[minmax(220px,340px)_1fr] md:items-center md:gap-12 lg:gap-16">
              <motion.div
                className="relative ml-[calc(50%-50vw)] w-[42vw] max-w-[150px] shrink-0 sm:max-w-[170px] md:ml-0 md:w-full md:max-w-none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.joyImage}
                  alt="Disfrutar la comida sin culpa"
                  className="h-auto w-full object-contain object-left drop-shadow-[0_16px_28px_rgba(85,104,148,0.22)]"
                />
                <ImageSticker
                  src={STICKER_ASSETS.flor}
                  className="-right-2 top-4 z-[3] md:right-2 md:top-6"
                  size={34}
                  rotate={-14}
                  float
                  delay={0.1}
                  blend={false}
                />
              </motion.div>

              <div className="min-w-0 flex-1 pb-2 sm:pb-4 md:pb-0">
                <p className="text-xs font-semibold tracking-[0.16em] text-gals-blue-deep uppercase">
                  Semana 3
                </p>
                <h2 className="mt-1 font-display text-xl tracking-tight text-gals-ink uppercase sm:text-2xl md:text-3xl lg:text-4xl">
                  Cuando la comida también es emoción
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-gals-muted md:max-w-xl md:text-base lg:text-lg">
                  Esta semana vive aquí: no hay material descargable. Solo
                  escucha, a tu ritmo.
                </p>
                <p className="mt-4 max-w-sm font-script text-xl text-gals-blue-deep sm:text-2xl md:mt-6 md:max-w-md md:text-3xl lg:text-4xl">
                  Permitirte disfrutar también es parte del método
                </p>
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <AudioCards />
          </div>
        </section>

        <WeekShell
          id="semana-4"
          eyebrow="Semana 4"
          title="Volver a ciertos alimentos"
          subtitle="Después de limpiar un poco la despensa, reintroduces gluten, lácteos, maíz o soya de a uno, con calma, para notar cómo te sienta cada uno."
          driveHref={data.driveFolders.week4 || undefined}
          driveLabel="Bajar la guía completa"
        >
          <ImageSticker
            src={STICKER_ASSETS.flor}
            className="top-40 right-3 z-[3] sm:right-6"
            size={40}
            rotate={12}
            float
            blend={false}
          />
          <div className="mb-8 max-w-2xl space-y-3 rounded-2xl bg-gals-blue-soft/70 p-5 sm:p-6 md:mb-10 md:max-w-3xl md:p-8">
            <p className="font-script text-2xl text-gals-blue-deep md:text-3xl">
              Qué vas a hacer aquí
            </p>
            <p className="text-sm leading-relaxed text-gals-ink md:text-base">
              No es volver a comer de todo de un día para otro. Es probar un
              alimento, observar tu cuerpo unos días y recién después pasar al
              siguiente. Abajo tienes las tres reglas suaves y un diario para
              anotar síntomas. Si quieres el PDF largo del método, está en el
              material descargable.
            </p>
          </div>
          <RecommendationsBlock />
        </WeekShell>

        <section className="rounded-2xl border border-[#e6e8ee] bg-white p-6 text-center md:mx-auto md:max-w-3xl md:p-10">
          <p className="font-display text-2xl tracking-tight text-gals-ink uppercase md:text-3xl">
            Si quieres vivirlo en persona
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gals-muted md:text-base">
            En el studio el movimiento y esta forma de comer se encuentran.
            Cuando te sientas lista, estamos.
          </p>
          <button
            type="button"
            className={`${data.ctaBewe} mt-5 inline-flex rounded-full bg-gals-blue-deep px-6 py-3 text-sm font-semibold text-white md:mt-6 md:px-8 md:py-3.5`}
          >
            {data.ctaLabel}
          </button>
        </section>
      </div>
    </div>
  );
}
