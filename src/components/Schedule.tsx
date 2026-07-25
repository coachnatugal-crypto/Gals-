"use client";

import { useMemo, useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  CURRENT_SITE,
  SCHEDULE_DAYS,
  SCHEDULE_RANGE,
  WHATSAPP_URL,
} from "@/lib/constants";
import { ImageSticker, STICKER_ASSETS } from "@/components/capsules/Stickers";

type ViewMode = "day" | "week";

export function Schedule() {
  const [view, setView] = useState<ViewMode>("week");
  const [dayIndex, setDayIndex] = useState(0);

  const days = useMemo(() => {
    if (view === "week") return SCHEDULE_DAYS;
    return [SCHEDULE_DAYS[dayIndex] ?? SCHEDULE_DAYS[0]];
  }, [view, dayIndex]);

  return (
    <section
      id="horario"
      className="relative overflow-visible bg-gals-mist py-20 md:py-28"
    >
      {/* Lado opuesto al tapete de Plans */}
      <ImageSticker
        src={STICKER_ASSETS.matchaTea}
        className="top-12 left-2 hidden sm:block lg:left-12"
        size={68}
        rotate={-12}
        float
      />

      <div className="relative z-20 mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium tracking-[0.25em] text-gals-blue uppercase">
                Agenda
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gals-ink md:text-4xl">
                Horario de clases
              </h2>
              <p className="mt-2 text-gals-muted">
                Vista previa visual. Pronto se conecta en vivo con Bewe.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 self-start rounded-lg border border-gals-silver/60 bg-white px-4 py-2.5 text-sm font-medium text-gals-ink"
            >
              <span className="text-gals-muted" aria-hidden>
                📅
              </span>
              {SCHEDULE_RANGE}
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-gals-silver/40 bg-white shadow-[0_12px_40px_rgba(85,104,148,0.08)]">
            <div className="flex flex-col gap-3 border-b border-gals-silver/30 bg-gals-mist/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDayIndex((i) =>
                      Math.max(0, i - 1),
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gals-silver/50 bg-white text-gals-ink transition-colors hover:bg-gals-blue-soft"
                  aria-label="Día anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-gals-blue px-4 py-2 text-sm font-semibold text-white"
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDayIndex((i) =>
                      Math.min(SCHEDULE_DAYS.length - 1, i + 1),
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gals-silver/50 bg-white text-gals-ink transition-colors hover:bg-gals-blue-soft"
                  aria-label="Día siguiente"
                >
                  ›
                </button>
              </div>
              <div className="flex rounded-lg border border-gals-silver/50 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setView("day")}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    view === "day"
                      ? "bg-gals-blue text-white"
                      : "text-gals-muted hover:text-gals-ink"
                  }`}
                >
                  Día
                </button>
                <button
                  type="button"
                  onClick={() => setView("week")}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    view === "week"
                      ? "bg-gals-blue text-white"
                      : "text-gals-muted hover:text-gals-ink"
                  }`}
                >
                  Semana
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gals-silver/30 text-gals-muted">
                    <th className="px-5 py-3 font-medium">Inicio</th>
                    <th className="px-5 py-3 font-medium">Clase</th>
                    <th className="px-5 py-3 font-medium">Instructor</th>
                    <th className="px-5 py-3 font-medium">Fin</th>
                    <th className="px-5 py-3 font-medium">Cupos</th>
                    <th className="px-5 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <DayRows key={day.dateLabel} day={day} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        <FadeIn
          delay={0.15}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-gals-muted">
            ¿Querés reservar ya? Podés escribirnos o usar la agenda actual en
            Bewe.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-gals-blue px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              WhatsApp
            </a>
            <a
              href={CURRENT_SITE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-gals-blue-deep/25 bg-white px-5 py-2.5 text-sm font-semibold text-gals-ink transition-colors hover:bg-gals-blue-soft"
            >
              Abrir agenda Bewe
            </a>
          </div>
        </FadeIn>
      </div>

      <ImageSticker
        src={STICKER_ASSETS.pesa}
        className="bottom-0 right-[14%] translate-y-1/2"
        size={64}
        rotate={16}
        float
      />
    </section>
  );
}

function DayRows({ day }: { day: (typeof SCHEDULE_DAYS)[number] }) {
  return (
    <>
      <tr>
        <td
          colSpan={6}
          className="bg-gals-blue-soft/60 px-5 py-2.5 text-sm font-semibold text-gals-blue-deep"
        >
          {day.dateLabel}
        </td>
      </tr>
      {day.classes.map((cls) => (
        <tr
          key={`${day.dateLabel}-${cls.start}-${cls.name}`}
          className="border-b border-gals-silver/25 text-gals-ink last:border-b-0"
        >
          <td className="px-5 py-3.5 font-medium">{cls.start}</td>
          <td className="px-5 py-3.5">{cls.name}</td>
          <td className="px-5 py-3.5 text-gals-muted">{cls.instructor}</td>
          <td className="px-5 py-3.5 text-gals-muted">{cls.end}</td>
          <td className="px-5 py-3.5 text-gals-muted">{cls.capacity}</td>
          <td className="px-5 py-3.5 text-right">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md bg-gals-blue px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              Más detalles
            </a>
          </td>
        </tr>
      ))}
    </>
  );
}
