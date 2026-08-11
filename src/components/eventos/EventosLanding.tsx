"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EventRegisterForm } from "@/components/eventos/EventRegisterForm";
import {
  EVENTOS_HERO_VIDEO,
  FREE_EVENTS,
  PAID_EVENTS,
  PARA_TI_SI,
  type GalsEvent,
} from "@/lib/eventos";
import { BEWE_FORM_CLASS, BEWE_PACKS_CLASS } from "@/lib/bewe";
import { ADDRESS } from "@/lib/constants";
import {
  FlowerSticker,
  StarSticker,
  STICKER_ASSETS,
  ImageSticker,
} from "@/components/capsules/Stickers";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

function useCountdown(iso?: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!iso) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [iso]);

  if (!iso) return null;
  const diff = Math.max(0, new Date(iso).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

function CountdownBlocks({ iso }: { iso: string }) {
  const c = useCountdown(iso);
  if (!c) return null;
  const cells = [
    { v: c.days, l: "Días" },
    { v: c.hours, l: "Horas" },
    { v: c.mins, l: "Min" },
    { v: c.secs, l: "Seg" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {cells.map((cell, i) => (
        <motion.div
          key={cell.l}
          className="rounded-2xl border border-gals-blue-deep/15 bg-white px-2 py-3 text-center shadow-[0_8px_24px_rgba(85,104,148,0.1)] sm:py-4"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 * i, type: "spring", stiffness: 260, damping: 18 }}
        >
          <p className="font-display text-2xl tracking-tight text-gals-blue-deep sm:text-3xl">
            {String(cell.v).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[10px] tracking-[0.14em] text-gals-muted uppercase">
            {cell.l}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function MiniHeader({ featured }: { featured: GalsEvent }) {
  return (
    <motion.header
      className="relative z-30 flex items-center justify-between gap-4 px-5 py-4 md:px-8"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <p className="text-[10px] font-semibold tracking-[0.22em] text-white/80 uppercase drop-shadow">
          GAL&apos;S Studio
        </p>
        <p className="font-display text-sm tracking-tight text-white uppercase drop-shadow sm:text-base">
          Experiencias <span className="text-gals-blue-soft">2026</span>
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm sm:inline-flex">
          {featured.dateLabel} · {featured.timeLabel ?? ""}
        </span>
        <a
          href="#registro"
          className="rounded-full bg-gals-cream px-4 py-2 text-[11px] font-bold tracking-[0.1em] text-gals-blue-deep uppercase shadow-md transition-transform hover:scale-105 sm:px-5"
        >
          Registro
        </a>
      </div>
    </motion.header>
  );
}

function WhyGrid() {
  const items = PARA_TI_SI.slice(0, 6).map((text, i) => {
    const titles = [
      "Retomar tu ritmo",
      "Cuerpo y ciclo",
      "Alimentación con disfrute",
      "Imagen y seguridad",
      "Comunidad real",
      "Primera vez o de vuelta",
    ];
    return { title: titles[i] ?? "GAL'S", body: text };
  });

  return (
    <section id="por-que" className="relative bg-gals-cream px-5 py-16 md:px-8 md:py-24">
      <StarSticker
        className="absolute top-10 right-[8%] hidden opacity-70 md:block"
        size={28}
        color="var(--gals-blue)"
        float
      />
      <div className="mx-auto max-w-5xl">
        <motion.p
          className="text-center text-xs font-semibold tracking-[0.25em] text-gals-blue-deep uppercase"
          {...fadeUp}
        >
          La experiencia
        </motion.p>
        <motion.h2
          className="mt-3 text-center font-display text-3xl tracking-tight text-gals-ink uppercase sm:text-4xl md:text-5xl"
          {...fadeUp}
        >
          <span className="text-gals-blue-deep">Por qué</span> asistir
        </motion.h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              className="rounded-2xl border border-gals-silver/40 bg-white p-5 shadow-[0_10px_30px_rgba(85,104,148,0.08)]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <p className="font-display text-lg tracking-tight text-gals-blue-deep uppercase">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gals-muted">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventBlock({
  event,
  featured = false,
}: {
  event: GalsEvent;
  featured?: boolean;
}) {
  return (
    <motion.article
      id={event.id}
      className={`overflow-hidden rounded-[1.5rem] border shadow-[0_16px_48px_rgba(85,104,148,0.12)] ${
        featured
          ? "border-gals-blue-deep/25 bg-gals-blue-deep text-white"
          : "border-gals-silver/40 bg-white text-gals-ink"
      }`}
      {...fadeUp}
      whileHover={{ y: -3 }}
    >
      <div
        className={`grid ${featured ? "lg:grid-cols-2" : "md:grid-cols-[0.9fr_1.1fr]"}`}
      >
        <div className="relative min-h-[220px] overflow-hidden sm:min-h-[280px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div
            className={`absolute inset-0 ${
              featured
                ? "bg-gradient-to-t from-gals-blue-deep via-gals-blue-deep/40 to-transparent"
                : "bg-gradient-to-t from-gals-ink/70 via-transparent to-transparent"
            }`}
          />
          <div className="absolute bottom-4 left-4 right-4">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase ${
                featured
                  ? "bg-gals-cream text-gals-blue-deep"
                  : "bg-gals-blue-deep text-white"
              }`}
            >
              {event.eyebrow}
            </span>
            <p className="mt-2 font-display text-xl text-white uppercase sm:text-2xl">
              {event.title}
            </p>
          </div>
        </div>
        <div className="p-5 sm:p-7">
          <p
            className={`text-xs font-semibold tracking-[0.16em] uppercase ${
              featured ? "text-white/70" : "text-gals-blue-deep"
            }`}
          >
            {event.dateLabel}
            {event.timeLabel ? ` · ${event.timeLabel}` : ""} · 📍 {event.place}
          </p>
          <h3
            className={`mt-2 font-display text-2xl tracking-tight uppercase ${
              featured ? "text-white" : "text-gals-blue-deep"
            }`}
          >
            {event.headline}
          </h3>
          <p
            className={`mt-2 text-sm leading-relaxed ${
              featured ? "text-white/80" : "text-gals-muted"
            }`}
          >
            {event.subhead}
          </p>
          {event.concept ? (
            <p
              className={`mt-2 text-sm ${
                featured ? "text-white/65" : "text-gals-ink/75"
              }`}
            >
              {event.concept}
            </p>
          ) : null}

          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {event.why.map((w) => (
              <li
                key={w.label}
                className={`flex gap-2 rounded-xl px-3 py-2 text-sm ${
                  featured
                    ? "bg-white/10 text-white/90"
                    : "bg-gals-blue-soft/70 text-gals-ink"
                }`}
              >
                <span aria-hidden>{w.emoji}</span>
                <span>{w.label}</span>
              </li>
            ))}
          </ul>

          {event.afterEvent ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {event.afterEvent.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className={`${BEWE_PACKS_CLASS} rounded-full bg-gals-cream px-3 py-1.5 text-xs font-semibold text-gals-blue-deep`}
                >
                  {p.name} · {p.price}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-5">
            <EventRegisterForm
              eventId={event.id}
              beweAfter={event.beweAfter}
              cta={event.cta}
              source={event.kind}
              variant={featured ? "dark" : "light"}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ExitPopup() {
  const [open, setOpen] = useState(false);
  const [zone, setZone] = useState<"free" | "paid" | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const free = document.getElementById("eventos-gratis");
      const paid = document.getElementById("experiencias-pagas");
      if (!free || !paid) return;
      const mid = window.innerHeight * 0.4;
      if (paid.getBoundingClientRect().top < mid) setZone("paid");
      else if (free.getBoundingClientRect().top < mid) setZone("free");
    };
    const onLeave = (e: MouseEvent) => {
      if (dismissed || open || e.clientY > 10 || !zone) return;
      setOpen(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [dismissed, open, zone]);

  const isFree = zone !== "paid";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-gals-ink/45 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-[1.5rem] border border-gals-blue-deep/15 bg-gals-cream p-6 shadow-2xl sm:p-8"
            initial={{ y: 28, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            role="dialog"
            aria-modal
          >
            <p className="font-script text-2xl text-gals-blue-deep">
              {isFree
                ? "¿Te vas sin tu cupo gratis? 🩶"
                : "Guárdate tu lugar en GAL'S 🩶"}
            </p>
            <p className="mt-2 text-sm text-gals-muted">
              {isFree
                ? "Deja tus datos y te avisamos de la próxima fecha."
                : "Cupos limitados — deja tus datos antes de que se agoten."}
            </p>
            <div className="mt-5">
              <EventRegisterForm
                eventId={isFree ? "popup-gratis" : "popup-pagas"}
                beweAfter={isFree ? "form" : "packs"}
                source={isFree ? "popup-gratis" : "popup-pagas"}
                cta={
                  isFree
                    ? "No quiero perderme la próxima"
                    : "Quiero mi lugar"
                }
                variant="light"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setDismissed(true);
              }}
              className="mt-4 w-full py-2 text-sm text-gals-muted underline-offset-2 hover:underline"
            >
              Seguir viendo
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Landing de eventos — paleta home + video hero. Sin chrome de homepage. */
export function EventosLanding() {
  const featured = PAID_EVENTS.find((e) => e.featured) ?? PAID_EVENTS[0];
  const otherPaid = PAID_EVENTS.filter((e) => e.id !== featured.id);

  return (
    <div className="relative min-h-full overflow-x-clip bg-gals-cream text-gals-ink">
      {/* ——— HERO con video de fondo (pc + móvil) ——— */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src={EVENTOS_HERO_VIDEO} type="video/mp4" />
        </video>
        {/* Solo un velo suave abajo para leer el texto — sin tinte azul */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-gals-cream" />

        <MiniHeader featured={featured} />

        <div className="relative z-10 mx-auto grid max-w-6xl items-end gap-8 px-5 pb-14 pt-6 md:px-8 md:pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-10">
          <div>
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/20 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gals-green" />
                {featured.dateLabel} — Bogotá
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                📍 {ADDRESS}
              </span>
            </motion.div>

            <motion.p
              className="mt-6 font-script text-2xl text-gals-cream md:text-3xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              experiencias GAL&apos;S
            </motion.p>
            <motion.h1
              className="mt-2 max-w-xl font-display text-[1.75rem] leading-[1.08] tracking-tight text-white uppercase drop-shadow sm:text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              ¿Cuándo fue la última vez que hiciste algo{" "}
              <span className="text-gals-blue-soft">solo para ti?</span>
            </motion.h1>
            <motion.p
              className="mt-4 max-w-md text-sm leading-relaxed text-white/90 sm:text-base"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              Tu cuerpo lleva meses esperando este momento. Un espacio donde por
              fin dejas de estar en la lista de espera de tu propia vida.
            </motion.p>

            <motion.div
              className="mt-7"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
            >
              <p className="font-display text-3xl text-white sm:text-4xl">
                2 HORAS
              </p>
              <p className="mt-1 max-w-sm text-xs font-semibold tracking-[0.12em] text-white/75 uppercase sm:text-sm">
                Para retomar tu movimiento y tu alimentación, sin culpa y sin
                extremos
              </p>
            </motion.div>

            <motion.div
              className="mt-8 grid max-w-md grid-cols-3 gap-3 border-t border-white/25 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {(featured.stats ?? []).map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl text-white">{s.value}</p>
                  <p className="text-[10px] tracking-[0.14em] text-white/70 uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            id="registro"
            className="scroll-mt-24"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="rounded-[1.5rem] border border-white/40 bg-gals-cream/95 p-5 shadow-[0_24px_70px_rgba(26,42,53,0.28)] backdrop-blur-md sm:p-6">
              <h2 className="font-display text-xl tracking-tight text-gals-blue-deep uppercase">
                Regístrate
              </h2>
              <p className="mt-1 text-sm text-gals-muted">
                Reserva tu cupo en {featured.title}
              </p>
              <div className="mt-5">
                <EventRegisterForm
                  eventId={featured.id}
                  beweAfter={featured.beweAfter}
                  cta="Reservar mi cupo"
                  source="hero"
                  variant="light"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COUNTDOWN */}
      {featured.startsAt ? (
        <section className="relative z-10 -mt-6 px-5 md:px-8">
          <motion.div
            className="mx-auto max-w-xl rounded-[1.5rem] border border-gals-blue-deep/10 bg-white/90 p-5 shadow-[0_16px_50px_rgba(85,104,148,0.14)] backdrop-blur sm:p-6"
            {...fadeUp}
          >
            <p className="text-center text-xs font-semibold tracking-[0.22em] text-gals-blue-deep uppercase">
              El evento comienza en
            </p>
            <div className="mt-4">
              <CountdownBlocks iso={featured.startsAt} />
            </div>
          </motion.div>
        </section>
      ) : null}

      <WhyGrid />

      {/* EVENTOS GRATIS */}
      <section
        id="eventos-gratis"
        className="relative scroll-mt-20 bg-gals-mist px-5 py-14 md:px-8 md:py-20"
      >
        <FlowerSticker
          className="absolute top-12 left-[6%] hidden opacity-60 md:block"
          size={32}
          color="var(--gals-blue)"
          float
        />
        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.p
            className="text-xs font-semibold tracking-[0.22em] text-gals-blue-deep uppercase"
            {...fadeUp}
          >
            Sin costo
          </motion.p>
          <motion.h2
            className="mt-2 font-display text-3xl tracking-tight text-gals-ink uppercase md:text-4xl"
            {...fadeUp}
          >
            Eventos <span className="text-gals-blue-deep">gratis</span>
          </motion.h2>
          <div className="mt-8 space-y-6">
            {FREE_EVENTS.map((e) => (
              <EventBlock key={e.id} event={e} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCIAS PAGAS */}
      <section
        id="experiencias-pagas"
        className="relative scroll-mt-20 bg-gals-cream px-5 py-14 md:px-8 md:py-20"
      >
        <ImageSticker
          src={STICKER_ASSETS.flor}
          className="top-8 right-[6%] hidden md:block"
          size={48}
          rotate={12}
          float
          blend={false}
        />
        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.p
            className="text-xs font-semibold tracking-[0.22em] text-gals-blue-deep uppercase"
            {...fadeUp}
          >
            Upgrade exclusivo
          </motion.p>
          <motion.h2
            className="mt-2 font-display text-3xl tracking-tight text-gals-ink uppercase md:text-4xl"
            {...fadeUp}
          >
            Experiencias <span className="text-gals-blue-deep">pagas</span>
          </motion.h2>
          <div className="mt-8 space-y-8">
            <EventBlock event={featured} featured />
            {otherPaid.map((e) => (
              <EventBlock key={e.id} event={e} />
            ))}
          </div>
        </div>
      </section>

      {/* CIERRE */}
      <section
        id="cierre"
        className="relative overflow-hidden bg-gals-blue-deep px-5 py-16 text-white md:px-8 md:py-24"
      >
        <StarSticker
          className="absolute top-12 left-[10%] hidden opacity-40 md:block"
          size={30}
          color="rgba(255,255,255,0.6)"
          float
        />
        <div className="relative z-10 mx-auto max-w-lg text-center">
          <motion.h2
            className="font-display text-3xl tracking-tight uppercase sm:text-4xl md:text-5xl"
            {...fadeUp}
          >
            Tu lugar te{" "}
            <span className="text-gals-blue-soft">está esperando</span>
          </motion.h2>
          <motion.p
            className="mx-auto mt-3 max-w-md text-sm text-white/80"
            {...fadeUp}
          >
            No te quedes esperando el próximo momento. Déjanos tus datos.
          </motion.p>
          <motion.div
            className="mx-auto mt-8 rounded-[1.5rem] border border-white/25 bg-gals-cream p-5 text-left shadow-xl sm:p-7"
            {...fadeUp}
          >
            <EventRegisterForm
              eventId="general"
              beweAfter="form"
              source="cierre-general"
              cta="Quiero info de todos los eventos"
              openWhatsApp
              variant="light"
            />
            <button
              type="button"
              className={`${BEWE_FORM_CLASS} mt-3 w-full text-center text-xs text-gals-muted underline-offset-2 hover:underline`}
            >
              Abrir formulario Bewe
            </button>
          </motion.div>
          <p className="mt-8 text-[11px] text-white/50">
            GAL&apos;S Studio Experiences 2026 — Calle 97, Bogotá
          </p>
        </div>
      </section>

      <ExitPopup />
    </div>
  );
}
