"use client";

import { useEffect, useRef, useState } from "react";
import {
  HOME_PROGRAM,
  type ProgramDay,
  type ProgramWorkout,
  ytThumb,
  ytWatch,
} from "@/lib/program";

function DaySelector({
  days,
  activeDay,
  onSelect,
}: {
  days: readonly ProgramDay[];
  activeDay: number;
  onSelect: (day: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * 160, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        aria-label="Días anteriores"
        onClick={() => scrollBy(-1)}
        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gals-silver/50 bg-white text-gals-ink md:flex"
      >
        ‹
      </button>
      <div
        ref={scrollerRef}
        className="flex flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {days.map((d) => {
          const selected = d.day === activeDay;
          return (
            <button
              key={d.day}
              type="button"
              onClick={() => onSelect(d.day)}
              className={`min-w-[4.75rem] shrink-0 rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-colors ${
                selected
                  ? "border-gals-blue-deep bg-white text-gals-blue-deep shadow-[0_0_0_1px_var(--gals-blue-deep)]"
                  : "border-transparent bg-[#eef0f4] text-gals-muted hover:bg-white"
              }`}
            >
              {d.rest ? "Descanso" : `Día ${d.day}`}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        aria-label="Días siguientes"
        onClick={() => scrollBy(1)}
        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gals-silver/50 bg-white text-gals-ink md:flex"
      >
        ›
      </button>
    </div>
  );
}

function WorkoutCard({
  workout,
  layout,
}: {
  workout: ProgramWorkout;
  layout: "mobile" | "desktop";
}) {
  return (
    <a
      href={ytWatch(workout.youtubeId)}
      target="_blank"
      rel="noopener noreferrer"
      className={
        layout === "mobile"
          ? "block overflow-hidden rounded-2xl border border-[#e6e8ee] bg-white"
          : "flex gap-4 rounded-2xl border border-[#e6e8ee] bg-white p-3 transition-colors hover:border-gals-blue"
      }
    >
      <div
        className={
          layout === "mobile"
            ? "relative aspect-[16/10] w-full bg-gals-blue-soft"
            : "relative h-28 w-44 shrink-0 overflow-hidden rounded-xl bg-gals-blue-soft"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ytThumb(workout.youtubeId)}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.opacity = "0";
          }}
        />
        {workout.optional ? (
          <span className="absolute bottom-2 left-2 rounded bg-black/45 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
            Opcional
          </span>
        ) : null}
        <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {workout.durationLabel}
        </span>
      </div>

      <div
        className={
          layout === "mobile" ? "space-y-1.5 p-4" : "min-w-0 flex-1 py-1"
        }
      >
        <p className="font-semibold text-gals-ink">{workout.title}</p>
        <p className="flex items-center gap-1.5 text-sm text-gals-muted">
          <span aria-hidden>{workout.mindset ? "💭" : "◎"}</span>
          {workout.tag}
        </p>
        <p className="text-xs text-gals-muted">Abrir en YouTube</p>
      </div>
    </a>
  );
}

function WorkoutTimeline({
  day,
  layout,
}: {
  day: ProgramDay;
  layout: "mobile" | "desktop";
}) {
  return (
    <ul className="relative space-y-5 pl-2">
      <span
        className="pointer-events-none absolute top-4 bottom-4 left-[11px] border-l border-dashed border-[#c9ced8]"
        aria-hidden
      />
      {day.workouts.map((w) => (
        <li key={w.id} className="relative pl-8">
          <span className="absolute top-5 left-[5px] h-3.5 w-3.5 rounded-full border-2 border-gals-blue-deep bg-white" />
          <WorkoutCard workout={w} layout={layout} />
        </li>
      ))}
    </ul>
  );
}

export function ProgramChallenge() {
  const [activeDay, setActiveDay] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const day =
    HOME_PROGRAM.days.find((d) => d.day === activeDay) ?? HOME_PROGRAM.days[0];
  const cover = HOME_PROGRAM.coverImage;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gals-program-completed");
      if (raw) setCompleted(JSON.parse(raw) as Record<number, boolean>);
    } catch {
      /* ignore */
    }
  }, []);

  const markComplete = () => {
    const next = { ...completed, [activeDay]: true };
    setCompleted(next);
    try {
      localStorage.setItem("gals-program-completed", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bg-[#f4f5f7] pb-24 pt-20 md:pb-16 md:pt-24">
      {/* ——— MOBILE hero + details (estilo Chloe móvil) ——— */}
      <div className="md:hidden">
        <section className="mx-4 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(85,104,148,0.12)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={HOME_PROGRAM.title}
            className="h-auto w-full object-cover"
          />
          <div className="flex flex-wrap gap-2 px-4 py-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gals-blue-soft px-3 py-1.5 text-xs font-semibold text-gals-blue-deep">
              📅 {HOME_PROGRAM.meta.days}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gals-blue-soft px-3 py-1.5 text-xs font-semibold text-gals-blue-deep">
              ⏱ {HOME_PROGRAM.meta.duration}
            </span>
          </div>
        </section>

        <div className="mx-4 mt-4 overflow-hidden rounded-2xl bg-white">
          <button
            type="button"
            onClick={() => setDetailsOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="font-semibold text-gals-ink">Detalles del programa</span>
            <span className="text-gals-muted">{detailsOpen ? "⌃" : "⌄"}</span>
          </button>
          {detailsOpen ? (
            <div className="space-y-4 border-t border-[#eceef2] px-5 pb-5">
              <p className="pt-4 text-xs font-semibold tracking-[0.16em] text-gals-muted uppercase">
                {HOME_PROGRAM.meta.period}
              </p>
              <p className="flex items-center gap-2 text-sm text-gals-ink">
                <span aria-hidden>⚡</span>
                {HOME_PROGRAM.meta.focus}
              </p>
              <p className="flex items-center gap-2 text-sm text-gals-ink">
                <span aria-hidden>▦</span>
                {HOME_PROGRAM.meta.gear}
              </p>
              <div className="border-t border-[#eceef2] pt-4">
                <p className="text-xs font-bold tracking-[0.14em] text-gals-muted uppercase">
                  Detalles
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gals-ink/80">
                  {HOME_PROGRAM.description}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mx-4 mt-4 space-y-3">
          <button
            type="button"
            className={`${HOME_PROGRAM.ctaBewe} flex w-full items-center justify-center rounded-full bg-gals-blue-deep px-5 py-3.5 text-sm font-semibold text-white`}
          >
            {HOME_PROGRAM.ctaLabel}
          </button>
          <a
            href={HOME_PROGRAM.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full border border-gals-ink/80 bg-white px-5 py-3.5 text-sm font-semibold text-gals-ink"
          >
            Ver canal YouTube
          </a>
        </div>
      </div>

      {/* ——— Layout principal (móvil abajo / desktop grid) ——— */}
      <div className="mx-auto mt-6 grid max-w-6xl gap-6 px-4 md:mt-0 md:grid-cols-[280px_1fr] md:gap-8 md:px-8 lg:grid-cols-[300px_1fr]">
        {/* Sidebar solo desktop */}
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
              <p className="text-sm text-gals-ink">⚡ {HOME_PROGRAM.meta.focus}</p>
              <p className="text-sm text-gals-ink">▦ {HOME_PROGRAM.meta.gear}</p>
              <div className="border-t border-[#eceef2] pt-3">
                <p className="text-xs font-bold tracking-[0.14em] text-gals-muted uppercase">
                  Detalles
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gals-muted">
                  {HOME_PROGRAM.description}
                </p>
              </div>
            </div>
          </article>

          <button
            type="button"
            className={`${HOME_PROGRAM.ctaBewe} block w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gals-blue to-gals-blue-deep p-5 text-left text-white shadow-[0_8px_30px_rgba(85,104,148,0.25)]`}
          >
            <p className="font-display text-lg uppercase">Únete al studio</p>
            <p className="mt-1 text-sm text-white/85">
              Reserva tu Semana GAL&apos;S y vive las clases en vivo.
            </p>
            <span className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-wide text-gals-blue-deep uppercase">
              Descubrir →
            </span>
          </button>

          <div className="rounded-2xl border border-gals-blue/30 bg-white p-5">
            <p className="font-semibold text-gals-ink">Empieza este reto</p>
            <p className="mt-2 text-sm text-gals-muted">
              Elige el Día 1, abre las clases en YouTube y marca el día cuando
              termines.
            </p>
          </div>
        </aside>

        {/* Columna principal */}
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
            <a
              href={HOME_PROGRAM.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gals-blue-soft text-gals-blue-deep"
              aria-label="Canal YouTube"
            >
              ▶
            </a>
          </header>

          <div className="mb-5 rounded-2xl bg-white p-3 shadow-[0_4px_20px_rgba(26,42,53,0.04)] md:p-4">
            <DaySelector
              days={HOME_PROGRAM.days}
              activeDay={activeDay}
              onSelect={setActiveDay}
            />
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(26,42,53,0.04)] sm:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gals-ink md:text-xl">
                  {day.rest
                    ? `Día ${day.day}: descanso y mentalidad`
                    : `Rutina del día ${day.day}`}
                </h2>
                <p className="mt-0.5 text-sm text-gals-muted">
                  {day.rest
                    ? `${day.workouts.length} charlas · mentalidad`
                    : `${day.workouts.length} ${
                        day.workouts.length === 1 ? "sesión" : "sesiones"
                      }`}
                  {completed[activeDay] ? " · Completado" : ""}
                </p>
              </div>
              {day.rest ? (
                <span className="rounded-full bg-gals-blue-soft px-3 py-1 text-xs font-semibold text-gals-blue-deep">
                  Descanso
                </span>
              ) : null}
            </div>

            {day.rest ? (
              <div className="mb-6 rounded-2xl bg-gradient-to-r from-gals-blue-soft to-[#e8eef8] p-5 sm:p-6">
                <p className="font-display text-xl tracking-tight text-gals-blue-deep uppercase">
                  Día {day.day} es de descanso
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-gals-ink/80 md:text-base">
                  {day.restMessage}
                </p>
                <p className="mt-3 text-xs font-semibold tracking-[0.14em] text-gals-blue-deep uppercase">
                  Charlas de mentalidad
                </p>
              </div>
            ) : null}

            <div className="md:hidden">
              <WorkoutTimeline day={day} layout="mobile" />
            </div>
            <div className="hidden md:block">
              <WorkoutTimeline day={day} layout="desktop" />
            </div>

            <div className="mt-8 space-y-3 border-t border-[#eceef2] pt-5">
              <p className="text-center text-xs text-gals-muted">
                {completed[activeDay]
                  ? day.rest
                    ? `Completaste el descanso del día ${activeDay}`
                    : `Completaste el día ${activeDay}`
                  : day.rest
                    ? "Cuando termines las charlas del día"
                    : "Cuando termines las sesiones del día"}
              </p>
              <button
                type="button"
                onClick={markComplete}
                disabled={Boolean(completed[activeDay])}
                className="w-full rounded-xl bg-[#dfe3ea] px-4 py-3.5 text-sm font-semibold text-gals-ink transition-colors enabled:hover:bg-gals-blue-soft disabled:opacity-70"
              >
                {completed[activeDay]
                  ? day.rest
                    ? `Descanso del día ${activeDay} completado ✓`
                    : `Día ${activeDay} completado ✓`
                  : day.rest
                    ? `Marcar descanso del día ${activeDay} como completo`
                    : `Marcar día ${activeDay} como completo`}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
