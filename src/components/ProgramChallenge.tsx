"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  HOME_PROGRAM,
  type ProgramDay,
  type ProgramWorkout,
  ytThumb,
  ytWatch,
} from "@/lib/program";
import {
  ImageSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";

const TOTAL_DAYS = HOME_PROGRAM.days.length;

function ProgressRing({ done, total }: { done: number; total: number }) {
  const pct = Math.min(100, Math.round((done / total) * 100));
  const r = 18;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90" aria-hidden>
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gals-blue/25"
        />
        <motion.circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-gals-blue-deep"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c - (pct / 100) * c }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="absolute text-[11px] font-bold tabular-nums text-gals-blue-deep">
        {done}/{total}
      </span>
    </div>
  );
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = Math.min(100, (done / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <ProgressRing done={done} total={total} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-semibold text-gals-ink">Tu progreso</p>
          <p className="text-xs text-gals-muted">
            {done === total ? "Reto completo ✦" : `${done} de ${total} días`}
          </p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gals-blue/20">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-gals-blue to-gals-blue-deep"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

function DayTimeline({
  days,
  activeDay,
  completed,
  onSelect,
}: {
  days: readonly ProgramDay[];
  activeDay: number;
  completed: Record<number, boolean>;
  onSelect: (day: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const btn = el.querySelector<HTMLElement>(`[data-day="${activeDay}"]`);
    btn?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeDay]);

  return (
    <div
      ref={scrollerRef}
      className="relative overflow-x-auto px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="relative mx-auto flex w-max min-w-full items-start justify-between gap-1 sm:gap-2 md:gap-3">
        <span
          className="pointer-events-none absolute top-5 right-[calc(100%/14)] left-[calc(100%/14)] z-0 h-[2px] bg-gals-blue/20"
          aria-hidden
        />
        {days.map((d) => {
          const selected = d.day === activeDay;
          const done = Boolean(completed[d.day]);
          const soft = Boolean(d.rest);

          return (
            <button
              key={d.day}
              type="button"
              data-day={d.day}
              onClick={() => onSelect(d.day)}
              className="relative z-10 flex w-[4.35rem] shrink-0 flex-col items-center gap-2 px-0.5 py-1 sm:w-[5rem]"
            >
              <motion.span
                layout
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  selected
                    ? soft
                      ? "bg-[#dfe8f7] text-gals-blue-deep shadow-[0_0_0_4px_rgba(133,155,196,0.35)]"
                      : "bg-gals-blue-deep text-white shadow-[0_0_0_4px_rgba(85,104,148,0.28)]"
                    : done
                      ? "bg-gals-blue text-white"
                      : soft
                        ? "bg-[#eef2f8] text-gals-muted"
                        : "bg-white text-gals-muted ring-1 ring-gals-blue/20"
                }`}
                whileTap={{ scale: 0.94 }}
              >
                {done && !selected ? "✓" : d.day}
              </motion.span>
              <span
                className={`max-w-[4.75rem] text-center text-[10px] leading-tight font-semibold tracking-wide uppercase sm:text-[11px] ${
                  selected ? "text-gals-blue-deep" : "text-gals-muted"
                }`}
              >
                {d.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StudioCta({ variant = "button" }: { variant?: "button" | "card" }) {
  if (variant === "card") {
    return (
      <Link
        href={HOME_PROGRAM.ctaHref}
        className="group relative block w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#3d4f78] via-gals-blue-deep to-[#1e2a44] p-5 text-left text-white shadow-[0_12px_40px_rgba(85,104,148,0.4)] ring-2 ring-gals-blue/40 transition-transform hover:scale-[1.015]"
      >
        <motion.span
          className="pointer-events-none absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/10"
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <p className="relative font-display text-lg tracking-wide uppercase">
          Listas para el studio
        </p>
        <p className="relative mt-1.5 text-sm leading-relaxed text-white/90">
          {HOME_PROGRAM.ctaHook}
        </p>
        <span className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold tracking-[0.12em] text-gals-blue-deep uppercase shadow-md transition-transform group-hover:translate-x-0.5">
          {HOME_PROGRAM.ctaLabel}
          <span aria-hidden>→</span>
        </span>
      </Link>
    );
  }

  return (
    <div className="space-y-2">
      <motion.div
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Link
          href={HOME_PROGRAM.ctaHref}
          className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-gals-blue-deep via-[#3d527a] to-gals-blue-deep px-5 py-4 text-sm font-bold tracking-wide text-white uppercase shadow-[0_10px_32px_rgba(85,104,148,0.45)] ring-2 ring-gals-blue/50"
        >
          <motion.span
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-120%", "120%"] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1.2,
            }}
            aria-hidden
          />
          <span className="relative">{HOME_PROGRAM.ctaLabel}</span>
          <span className="relative" aria-hidden>
            →
          </span>
        </Link>
      </motion.div>
      <p className="text-center text-xs leading-relaxed text-gals-muted">
        {HOME_PROGRAM.ctaHook}
      </p>
    </div>
  );
}

function Burst({ show }: { show: boolean }) {
  if (!show) return null;
  const dots = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {dots.map((i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const dist = 48 + (i % 3) * 12;
        return (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-gals-blue"
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: 0.3,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function WorkoutCard({
  workout,
  done,
}: {
  workout: ProgramWorkout;
  done?: boolean;
}) {
  return (
    <motion.a
      href={ytWatch(workout.youtubeId)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block overflow-hidden rounded-2xl border bg-white transition-colors ${
        done
          ? "border-gals-blue/50 shadow-[0_0_0_1px_rgba(85,104,148,0.12)]"
          : "border-[#e6e8ee] hover:border-gals-blue/60"
      }`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
    >
      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
        <div className="relative aspect-[16/10] w-full bg-gals-blue-soft md:aspect-auto md:min-h-[148px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ytThumb(workout.youtubeId)}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.style.opacity = "0";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gals-blue-deep shadow-lg transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          {done ? (
            <span className="absolute top-3 left-3 rounded-full bg-gals-blue-deep px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
              Hecho ✓
            </span>
          ) : null}
          <span className="absolute right-3 bottom-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white">
            {workout.durationLabel}
          </span>
        </div>

        <div className="flex flex-col justify-center space-y-2 p-4 md:p-5">
          <p className="text-base font-semibold text-gals-ink md:text-lg">
            {workout.title}
          </p>
          <p className="text-sm leading-relaxed text-gals-muted">{workout.blurb}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="rounded-full bg-gals-blue-soft px-2.5 py-1 text-[11px] font-semibold text-gals-blue-deep">
              {workout.tag}
            </span>
            <span className="text-xs font-medium text-gals-muted group-hover:text-gals-blue-deep">
              Abrir en YouTube →
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

function DayPanel({
  day,
  done,
  onComplete,
  celebrating,
}: {
  day: ProgramDay;
  done: boolean;
  onComplete: () => void;
  celebrating: boolean;
}) {
  const soft = Boolean(day.rest);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 md:p-6 ${
        soft
          ? "border-gals-blue/25 bg-gradient-to-br from-[#eef3fb] via-white to-[#f7f5fb]"
          : "border-transparent bg-white shadow-[0_4px_24px_rgba(26,42,53,0.05)]"
      }`}
    >
      <Burst show={celebrating} />

      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
            {day.label}
            {day.day === 6 ? " · integración" : null}
            {soft ? " · calma" : null}
          </p>
          <h2 className="mt-1 font-display text-2xl tracking-tight text-gals-ink uppercase md:text-3xl">
            {soft
              ? "Descanso y mentalidad"
              : day.day === 6
                ? "Full body"
                : `Rutina ${day.label.toLowerCase()}`}
          </h2>
        </div>
        {done ? (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="shrink-0 rounded-full bg-gals-blue-deep px-3 py-1.5 text-xs font-semibold text-white"
          >
            Completado
          </motion.span>
        ) : soft ? (
          <span className="shrink-0 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-gals-blue-deep ring-1 ring-gals-blue/30">
            Suave
          </span>
        ) : null}
      </div>

      <div
        className={`mb-5 rounded-2xl px-4 py-4 sm:px-5 ${
          soft
            ? "bg-white/70 ring-1 ring-gals-blue/15"
            : "bg-[#f7f8fb] ring-1 ring-gals-blue/10"
        }`}
      >
        <p className="font-script text-xl text-gals-blue-deep md:text-2xl">
          {day.moodTitle}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-gals-ink/80">
          {day.moodBody}
        </p>
      </div>

      <div className="space-y-4">
        {day.workouts.map((w) => (
          <WorkoutCard key={w.id} workout={w} done={done} />
        ))}
      </div>

      <div className="relative mt-7 space-y-3 border-t border-[#eceef2] pt-5">
        <p className="text-center text-xs text-gals-muted">
          {done
            ? soft
              ? `Completaste el ${day.label.toLowerCase()}`
              : `Completaste el ${day.label.toLowerCase()}`
            : soft
              ? "Cuando termines la meditación"
              : "Cuando termines la sesión del día"}
        </p>
        <motion.button
          type="button"
          onClick={onComplete}
          disabled={done}
          whileTap={done ? undefined : { scale: 0.98 }}
          className={`relative w-full overflow-hidden rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${
            done
              ? "bg-gals-blue-deep text-white"
              : "bg-gals-blue-soft text-gals-blue-deep hover:bg-gals-blue/40"
          }`}
        >
          {done
            ? `${day.label} completado ✓`
            : `Marcar ${day.label.toLowerCase()} como completo`}
        </motion.button>
      </div>
    </div>
  );
}

export function ProgramChallenge() {
  const [activeDay, setActiveDay] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [celebrating, setCelebrating] = useState(false);
  const day =
    HOME_PROGRAM.days.find((d) => d.day === activeDay) ?? HOME_PROGRAM.days[0];
  const cover = HOME_PROGRAM.coverImage;
  const doneCount = Object.values(completed).filter(Boolean).length;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gals-program-completed");
      if (raw) setCompleted(JSON.parse(raw) as Record<number, boolean>);
    } catch {
      /* ignore */
    }
  }, []);

  const markComplete = () => {
    if (completed[activeDay]) return;
    const next = { ...completed, [activeDay]: true };
    setCompleted(next);
    setCelebrating(true);
    window.setTimeout(() => setCelebrating(false), 750);
    try {
      localStorage.setItem("gals-program-completed", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative overflow-x-clip bg-[#f4f5f7] pb-8 pt-20 md:pb-10 md:pt-24">
      {/* Stickers solo desktop: 3+3 flores desalineadas — solo verde y azul GAL'S */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden>
        <ImageSticker
          src={STICKER_ASSETS.flor}
          className="top-[18%] left-2"
          size={112}
          rotate={-22}
          float
          delay={0.12}
        />
        <ImageSticker
          src={STICKER_ASSETS.flor}
          className="top-[42%] left-14"
          size={88}
          rotate={18}
          float
          delay={0.28}
          filter="hue-rotate(72deg) saturate(0.95) brightness(1.05)"
        />
        <ImageSticker
          src={STICKER_ASSETS.flor}
          className="top-[68%] left-5"
          size={104}
          rotate={-6}
          float
          delay={0.4}
        />
        <ImageSticker
          src={STICKER_ASSETS.flor}
          className="top-[16%] right-10"
          size={100}
          rotate={14}
          float
          delay={0.16}
          filter="hue-rotate(78deg) saturate(0.9) brightness(1.08)"
        />
        <ImageSticker
          src={STICKER_ASSETS.flor}
          className="top-[44%] right-2"
          size={118}
          rotate={-16}
          float
          delay={0.3}
        />
        <ImageSticker
          src={STICKER_ASSETS.flor}
          className="top-[71%] right-12"
          size={94}
          rotate={12}
          float
          delay={0.44}
          filter="hue-rotate(68deg) saturate(1) brightness(1.05)"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        {/* ——— MÓVIL: hero unificado ——— */}
        <motion.section
          className="overflow-hidden rounded-[1.6rem] bg-white shadow-[0_10px_40px_rgba(85,104,148,0.1)] md:hidden"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative min-h-[220px] overflow-hidden sm:min-h-[260px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={HOME_PROGRAM.title}
              className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
            />
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="font-script text-2xl text-gals-blue-deep">
                7 días para volver a ti
              </p>
              <h1 className="mt-1 font-display text-3xl tracking-tight text-gals-ink uppercase">
                {HOME_PROGRAM.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-gals-muted">
                {HOME_PROGRAM.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-gals-blue-soft px-3 py-1.5 text-xs font-semibold text-gals-blue-deep">
                  {HOME_PROGRAM.meta.days}
                </span>
                <span className="rounded-full bg-gals-blue-soft px-3 py-1.5 text-xs font-semibold text-gals-blue-deep">
                  {HOME_PROGRAM.meta.duration}
                </span>
              </div>
            </div>
            <ProgressBar done={doneCount} total={TOTAL_DAYS} />
            <StudioCta />
            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              className="text-left text-xs font-semibold tracking-wide text-gals-muted uppercase"
            >
              {detailsOpen ? "Ocultar detalles ⌃" : "Cómo funciona ⌄"}
            </button>
            <AnimatePresence initial={false}>
              {detailsOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl bg-[#f7f8fa] px-4 py-3 text-sm text-gals-ink/80">
                    <p>{HOME_PROGRAM.meta.focus}</p>
                    <p className="mt-1 text-gals-muted">
                      {HOME_PROGRAM.meta.period}. Elige un día, abre el video y
                      marca cuando termines.
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ——— DESKTOP: sidebar + columna (layout clásico) ——— */}
        <div className="mt-6 grid gap-6 md:mt-0 md:grid-cols-[280px_1fr] md:gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="hidden space-y-4 md:sticky md:top-28 md:block md:self-start">
            <article className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(26,42,53,0.06)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={HOME_PROGRAM.title}
                className="h-auto w-full object-cover"
              />
              <div className="space-y-3 p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg bg-[#eef0f4] px-2.5 py-1 text-xs font-semibold text-gals-ink">
                    {HOME_PROGRAM.meta.days}
                  </span>
                  <span className="rounded-lg bg-[#eef0f4] px-2.5 py-1 text-xs font-semibold text-gals-ink">
                    {HOME_PROGRAM.meta.duration}
                  </span>
                </div>
                <p className="text-xs font-semibold tracking-[0.14em] text-gals-muted uppercase">
                  {HOME_PROGRAM.meta.period}
                </p>
                <p className="text-sm text-gals-ink">{HOME_PROGRAM.meta.focus}</p>
                <div className="border-t border-[#eceef2] pt-3">
                  <p className="text-xs font-bold tracking-[0.14em] text-gals-muted uppercase">
                    Detalles
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gals-muted">
                    {HOME_PROGRAM.description}
                  </p>
                </div>
                <div className="pt-1">
                  <ProgressBar done={doneCount} total={TOTAL_DAYS} />
                </div>
              </div>
            </article>

            <StudioCta variant="card" />

            <div className="rounded-2xl border border-gals-blue/30 bg-white p-5">
              <p className="font-semibold text-gals-ink">Empieza este reto</p>
              <p className="mt-2 text-sm text-gals-muted">
                Elige el Día 1, abre la clase en YouTube y marca el día cuando
                termines.
              </p>
            </div>
          </aside>

          <section className="min-w-0">
            <header className="mb-5 hidden items-start justify-between gap-4 md:flex">
              <div>
                <h1 className="font-display text-4xl tracking-tight text-gals-ink uppercase lg:text-5xl">
                  {HOME_PROGRAM.title}
                </h1>
                <p className="mt-1 font-script text-2xl text-gals-blue-deep">
                  7 días para volver a ti
                </p>
              </div>
            </header>

            <div className="mb-5 rounded-2xl bg-white p-3 shadow-[0_4px_20px_rgba(26,42,53,0.04)] md:p-4">
              <div className="mb-3 hidden items-center justify-between gap-3 px-1 md:flex">
                <p className="text-xs font-semibold tracking-[0.14em] text-gals-muted uppercase">
                  Tu semana
                </p>
                <p className="text-xs text-gals-muted">
                  Elige un día para ver su clase
                </p>
              </div>
              <div className="mb-3 flex items-center justify-between gap-3 px-1 md:hidden">
                <p className="text-xs font-semibold tracking-[0.14em] text-gals-muted uppercase">
                  Tu semana
                </p>
                <p className="text-xs text-gals-muted">Toca un día</p>
              </div>
              <DayTimeline
                days={HOME_PROGRAM.days}
                activeDay={activeDay}
                completed={completed}
                onSelect={setActiveDay}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <DayPanel
                  day={day}
                  done={Boolean(completed[activeDay])}
                  onComplete={markComplete}
                  celebrating={celebrating}
                />
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </div>
    </div>
  );
}
