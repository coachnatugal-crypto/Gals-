"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { GalsEvent } from "@/lib/eventos";

const ACCENTS = [
  "#6fad86",
  "#c4898f",
  "#c47a52",
  "#8799c4",
  "#556894",
  "#8b7aa8",
  "#c4a35a",
  "#5c8a7a",
] as const;

type MonthGroup = {
  key: string;
  label: string;
  year: string;
  events: { event: GalsEvent; accent: string; day: number; weekday: string }[];
};

function bogotaYmd(iso: string) {
  const s = new Date(iso).toLocaleDateString("en-CA", {
    timeZone: "America/Bogota",
  });
  const [y, m, d] = s.split("-").map(Number);
  return { y, m, d, key: s };
}

function monthLabel(y: number, m: number) {
  const raw = new Date(
    `${y}-${String(m).padStart(2, "0")}-15T12:00:00-05:00`,
  ).toLocaleDateString("es-CO", {
    timeZone: "America/Bogota",
    month: "long",
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function weekdayShort(iso: string) {
  const raw = new Date(iso).toLocaleDateString("es-CO", {
    timeZone: "America/Bogota",
    weekday: "short",
  });
  return raw.replace(".", "").toUpperCase();
}

function buildGroups(events: GalsEvent[]): MonthGroup[] {
  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  const map = new Map<string, MonthGroup>();

  sorted.forEach((event, i) => {
    const { y, m, d } = bogotaYmd(event.startsAt);
    const key = `${y}-${String(m).padStart(2, "0")}`;
    let group = map.get(key);
    if (!group) {
      group = {
        key,
        label: monthLabel(y, m),
        year: String(y),
        events: [],
      };
      map.set(key, group);
    }
    group.events.push({
      event,
      accent: ACCENTS[i % ACCENTS.length],
      day: d,
      weekday: weekdayShort(event.startsAt),
    });
  });

  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}

function scrollToEvent(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.add("ring-2", "ring-gals-blue-deep", "ring-offset-2");
  window.setTimeout(() => {
    el.classList.remove("ring-2", "ring-gals-blue-deep", "ring-offset-2");
  }, 1600);
}

export function EventosCalendar({ events }: { events: GalsEvent[] }) {
  const groups = useMemo(() => buildGroups(events), [events]);

  if (groups.length === 0) return null;

  return (
    <section
      id="calendario"
      className="relative scroll-mt-16 bg-gals-cream"
      aria-label="Calendario de eventos"
    >
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-5 md:px-8 md:py-20">
        <motion.p
          className="text-center font-script text-2xl text-gals-blue-deep md:text-3xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          el mes de un vistazo
        </motion.p>
        <motion.h2
          className="mt-1 text-center font-display text-3xl tracking-tight text-gals-ink uppercase md:text-4xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          Calendario
        </motion.h2>
        <motion.p
          className="mx-auto mt-2 max-w-md text-center text-sm text-gals-muted md:text-base"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Solo los días con evento. Toca uno para ir a su ficha.
        </motion.p>

        <div className="mt-10 space-y-10 md:mt-12 md:space-y-12">
          {groups.map((group, gi) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: gi * 0.06 }}
            >
              <div className="mb-4 flex items-end justify-between gap-3 border-b border-gals-silver/40 pb-3">
                <h3 className="font-script text-3xl text-gals-blue-deep md:text-4xl">
                  {group.label}
                </h3>
                <p className="pb-1 text-xs font-medium tracking-[0.16em] text-gals-muted uppercase">
                  {group.year}
                </p>
              </div>

              <ul className="space-y-3">
                {group.events.map((item, i) => (
                  <motion.li
                    key={item.event.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.04 * i, duration: 0.4 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => scrollToEvent(item.event.id)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex w-full items-stretch gap-3 overflow-hidden rounded-2xl border border-gals-silver/40 bg-white text-left shadow-[0_8px_28px_rgba(85,104,148,0.08)] sm:gap-4"
                    >
                      <div
                        className="flex w-[4.5rem] shrink-0 flex-col items-center justify-center px-2 py-4 text-white sm:w-24 sm:py-5"
                        style={{ backgroundColor: item.accent }}
                      >
                        <span className="text-[10px] font-semibold tracking-[0.14em] uppercase opacity-90">
                          {item.weekday}
                        </span>
                        <span className="font-display text-3xl leading-none sm:text-4xl">
                          {item.day}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 py-4 pr-4 sm:py-5 sm:pr-5">
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-gals-muted uppercase">
                          {item.event.kind === "free" ? "Gratis" : "Experiencia"}
                          {item.event.timeLabel
                            ? ` · ${item.event.timeLabel}`
                            : ""}
                        </p>
                        <p className="mt-1 font-display text-lg tracking-tight text-gals-ink uppercase sm:text-xl">
                          {item.event.title}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm text-gals-muted">
                          {item.event.headline || item.event.subhead}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-gals-blue-deep">
                          Ver evento →
                        </p>
                      </div>
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
