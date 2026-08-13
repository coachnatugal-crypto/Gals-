"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EventRegisterForm } from "@/components/eventos/EventRegisterForm";
import {
  EVENTOS_HERO_VIDEO,
  getActiveFreeEvents,
  getActivePaidEvents,
  getFeaturedEvent,
  getNextLiveEvent,
  PARA_TI_SI,
  type GalsEvent,
} from "@/lib/eventos";
import { BEWE_FORM_CLASS } from "@/lib/bewe";
import { ADDRESS } from "@/lib/constants";
import { STICKER_ASSETS } from "@/components/capsules/Stickers";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

type RegisterTarget = {
  eventId: string;
  title: string;
  beweAfter: GalsEvent["beweAfter"];
  cta: string;
  source: string;
};

/**
 * Hongo al borde derecho, base apoyada en la línea superior de la imagen de abajo.
 */
function EdgeHongoBleed({ side = "right" }: { side?: "left" | "right" }) {
  const sideClass = side === "right" ? "right-0" : "left-0";

  return (
    <div
      className={`pointer-events-none absolute bottom-0 z-[5] h-[170px] w-[120px] sm:h-[220px] sm:w-[155px] md:h-[270px] md:w-[185px] ${sideClass}`}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={STICKER_ASSETS.hongos}
        alt=""
        draggable={false}
        className={`h-full w-full object-contain object-bottom ${
          side === "right" ? "object-right" : "object-left"
        }`}
      />
    </div>
  );
}

function useCountdown(iso?: string) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    if (!iso) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [iso]);

  if (!iso || now === null) return null;
  const end = new Date(iso).getTime();
  if (Number.isNaN(end)) return null;
  const diff = Math.max(0, end - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

function CountdownBlocks({ iso }: { iso: string }) {
  const c = useCountdown(iso);
  const cells = c
    ? [
        { v: c.days, l: "Días" },
        { v: c.hours, l: "Horas" },
        { v: c.mins, l: "Min" },
        { v: c.secs, l: "Seg" },
      ]
    : [
        { v: null, l: "Días" },
        { v: null, l: "Horas" },
        { v: null, l: "Min" },
        { v: null, l: "Seg" },
      ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {cells.map((cell, i) => (
        <motion.div
          key={cell.l}
          className="rounded-2xl border border-white/25 bg-white/10 px-2 py-3 text-center backdrop-blur-sm sm:py-4"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.08 * i,
            type: "spring",
            stiffness: 260,
            damping: 18,
          }}
        >
          <p className="font-display text-2xl tracking-tight text-white tabular-nums sm:text-3xl">
            {cell.v === null ? "--" : String(cell.v).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[10px] tracking-[0.14em] text-white/70 uppercase">
            {cell.l}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function RegisterModal({
  target,
  onClose,
}: {
  target: RegisterTarget | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!target) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [target]);

  return (
    <AnimatePresence>
      {target ? (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center bg-gals-ink/50 p-4 backdrop-blur-[2px] sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Cerrar"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="registro-modal-title"
            className="relative z-[1] w-full max-w-md overflow-hidden rounded-[1.6rem] border border-gals-blue-deep/10 bg-gals-cream p-5 shadow-2xl sm:p-7"
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-gals-blue-soft text-gals-blue-deep"
              aria-label="Cerrar"
            >
              ✕
            </button>
            <p className="font-script text-2xl text-gals-blue-deep">
              Tu cupo te espera
            </p>
            <h2
              id="registro-modal-title"
              className="mt-1 pr-8 font-display text-xl tracking-tight text-gals-ink uppercase"
            >
              {target.title}
            </h2>
            <p className="mt-2 text-sm text-gals-muted">
              Déjanos tus datos y continuamos tu reserva.
            </p>
            <div className="mt-5">
              <EventRegisterForm
                eventId={target.eventId}
                beweAfter={target.beweAfter}
                cta={target.cta}
                source={target.source}
                variant="light"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MiniHeader({ onRegister }: { onRegister: () => void }) {
  return (
    <motion.header
      className="relative z-30 flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 md:px-8"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold tracking-[0.14em] text-white uppercase drop-shadow sm:text-sm">
          GAL&apos;S Studio · Eventos{" "}
          <span className="text-gals-blue-soft">2026</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <a
          href="#agenda"
          className="hidden rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm sm:inline-flex"
        >
          Agenda
        </a>
        <button
          type="button"
          onClick={onRegister}
          className="rounded-full bg-gals-cream px-3.5 py-2 text-[10px] font-bold tracking-[0.08em] text-gals-blue-deep uppercase shadow-md transition-transform hover:scale-105 sm:px-5 sm:text-[11px]"
        >
          Reservar
        </button>
      </div>
    </motion.header>
  );
}

function WhyCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="w-[min(78vw,320px)] shrink-0 rounded-2xl border border-gals-silver/30 bg-white/90 p-5 shadow-[0_8px_24px_rgba(85,104,148,0.08)] backdrop-blur-sm sm:w-[340px]">
      <p className="font-display text-lg tracking-tight text-gals-blue-deep uppercase">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-gals-muted">{body}</p>
    </div>
  );
}

function WhyMarqueeRow({
  items,
  direction,
}: {
  items: { title: string; body: string }[];
  direction: "left" | "right";
}) {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-4 ${
          direction === "right"
            ? "animate-marquee-slow-reverse"
            : "animate-marquee-slow"
        }`}
      >
        {loop.map((item, i) => (
          <WhyCard
            key={`${item.title}-${i}`}
            title={item.title}
            body={item.body}
          />
        ))}
      </div>
    </div>
  );
}

function WhyPills() {
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
  const topRow = items.slice(0, 3);
  const bottomRow = items.slice(3, 6);

  return (
    <section
      id="por-que"
      className="relative overflow-hidden bg-gals-mist py-14 md:py-20"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-5 md:px-8">
        <motion.p
          className="text-center font-script text-2xl text-gals-blue-deep md:text-3xl"
          {...fadeUp}
        >
          esto es para ti si…
        </motion.p>
        <motion.h2
          className="mt-2 text-center font-display text-3xl tracking-tight text-gals-ink uppercase sm:text-4xl md:text-5xl"
          {...fadeUp}
        >
          Vives más que una clase
        </motion.h2>
      </div>

      <motion.div
        className="relative z-10 mt-10 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
      >
        <WhyMarqueeRow items={topRow} direction="right" />
        <WhyMarqueeRow items={bottomRow} direction="left" />
      </motion.div>
    </section>
  );
}

function FeaturedExperience({
  event,
  onRegister,
}: {
  event: GalsEvent;
  onRegister: () => void;
}) {
  return (
    <section id={event.id} className="relative scroll-mt-16">
      <div className="relative min-h-[78svh] overflow-hidden md:min-h-[85svh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.image}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gals-ink/90 via-gals-ink/55 to-gals-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-gals-cream via-transparent to-black/20" />

        <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:px-5 md:min-h-[85svh] md:px-8 md:pb-20">
          <motion.div
            {...fadeUp}
            className="max-w-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-gals-blue-soft uppercase">
              Destacado · {event.dateLabel}
              {event.timeLabel ? ` · ${event.timeLabel}` : ""}
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-white uppercase sm:text-5xl md:text-6xl lg:text-7xl">
              {event.title}
            </h2>
            <p className="mt-3 font-script text-2xl text-gals-cream md:text-3xl">
              {event.headline}
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85">
              {event.subhead}
            </p>
            {event.showPrice && event.price ? (
              <p className="mt-4 font-display text-3xl text-gals-cream sm:text-4xl">
                {event.price}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onRegister}
                className="rounded-full bg-gals-cream px-7 py-3.5 text-sm font-bold tracking-wide text-gals-blue-deep uppercase shadow-lg transition-transform hover:scale-[1.02]"
              >
                {event.cta}
              </button>
              <a
                href="#agenda"
                className="rounded-full border border-white/40 px-6 py-3.5 text-sm font-semibold tracking-wide text-white uppercase backdrop-blur-sm"
              >
                Ver agenda
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MosaicCard({
  event,
  onRegister,
  variant,
}: {
  event: GalsEvent;
  onRegister: () => void;
  variant: "wide" | "tall" | "type";
}) {
  const tall = variant === "tall";
  const withHongos = variant === "type";

  return (
    <motion.article
      id={event.id}
      className={`group relative overflow-hidden ${
        tall
          ? "min-h-[320px] sm:min-h-full"
          : "min-h-[240px] sm:min-h-[280px]"
      }`}
      {...fadeUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={event.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className={`absolute inset-0 ${
          withHongos
            ? "bg-gradient-to-t from-gals-blue-deep/95 via-gals-blue-deep/55 to-gals-ink/30"
            : "bg-gradient-to-t from-gals-ink/90 via-gals-ink/35 to-transparent"
        }`}
      />

      <div
        className="absolute inset-x-0 bottom-0 p-5 sm:p-6"
      >
        <p className="text-[10px] font-semibold tracking-[0.14em] text-white/70 uppercase">
          {event.kind === "free" ? "Gratis" : "Con inversión"} ·{" "}
          {event.dateLabel}
          {event.timeLabel ? ` · ${event.timeLabel}` : ""}
        </p>
        <h3 className="mt-1 font-display text-xl uppercase text-white sm:text-2xl">
          {event.title}
        </h3>
        {withHongos ? (
          <p className="mt-2 line-clamp-2 text-sm text-white/80">{event.subhead}</p>
        ) : null}
        {event.showPrice && event.price ? (
          <p className="mt-1 font-display text-lg text-gals-blue-soft">
            {event.price}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onRegister}
          className="mt-4 rounded-full bg-gals-cream px-4 py-2 text-[11px] font-bold tracking-wide text-gals-blue-deep uppercase"
        >
          {withHongos ? `${event.cta} →` : "Reservar →"}
        </button>
      </div>
    </motion.article>
  );
}

function AgendaMosaic({
  featured,
  others,
  free,
  onRegister,
}: {
  featured: GalsEvent;
  others: GalsEvent[];
  free: GalsEvent[];
  onRegister: (e: GalsEvent, source: string) => void;
}) {
  const rest = [...others, ...free];
  const a = rest[0];
  const b = rest[1];
  const c = rest[2];
  const more = rest.slice(3);

  return (
    <section id="agenda" className="relative scroll-mt-16 bg-gals-cream">
      <div className="relative z-[6] overflow-visible px-0 pt-14 pb-0 sm:pt-16 md:pt-20">
        <EdgeHongoBleed side="right" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 pr-[7.5rem] pb-2 sm:px-5 sm:pr-36 md:px-8 md:pr-44">
          <motion.p
            className="font-script text-2xl text-gals-blue-deep md:text-3xl"
            {...fadeUp}
          >
            la agenda
          </motion.p>
          <motion.h2
            className="mt-1 font-display text-3xl tracking-tight text-gals-ink uppercase md:text-5xl"
            {...fadeUp}
          >
            Eventos GAL&apos;S
          </motion.h2>
          <motion.p
            className="mt-3 max-w-xl text-sm text-gals-muted md:text-base"
            {...fadeUp}
          >
            Elige el que te hace falta ahora. Cupos limitados.
          </motion.p>
        </div>
      </div>

      <div className="relative z-[1] mt-0">
        <FeaturedExperience
          event={featured}
          onRegister={() => onRegister(featured, "featured")}
        />
      </div>

      <div className="relative px-4 py-8 sm:px-5 md:px-8 md:py-12">
        <div className="relative z-10 mx-auto grid max-w-6xl gap-3 sm:gap-4 md:grid-cols-12">
          {a ? (
            <div className="overflow-hidden rounded-[1.25rem] md:col-span-7">
              <MosaicCard
                event={a}
                variant="wide"
                onRegister={() => onRegister(a, "mosaic")}
              />
            </div>
          ) : null}
          {b ? (
            <div className="overflow-hidden rounded-[1.25rem] md:col-span-5">
              <MosaicCard
                event={b}
                variant="type"
                onRegister={() => onRegister(b, "mosaic")}
              />
            </div>
          ) : null}
          {c ? (
            <div className="overflow-hidden rounded-[1.25rem] md:col-span-5">
              <MosaicCard
                event={c}
                variant="tall"
                onRegister={() => onRegister(c, "mosaic")}
              />
            </div>
          ) : null}
          {more.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 md:col-span-7">
              {more.map((e) => (
                <div key={e.id} className="overflow-hidden rounded-[1.25rem]">
                  <MosaicCard
                    event={e}
                    variant="wide"
                    onRegister={() => onRegister(e, "mosaic")}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ExitPopup({
  onOpenRegister,
}: {
  onOpenRegister: (t: RegisterTarget) => void;
}) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onLeave = (e: MouseEvent) => {
      if (dismissed || open || e.clientY > 10) return;
      setOpen(true);
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [dismissed, open]);

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
            className="relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-gals-blue-deep/15 bg-gals-cream p-6 shadow-2xl sm:p-8"
            initial={{ y: 28, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            role="dialog"
            aria-modal
          >
            <p className="font-script text-2xl text-gals-blue-deep">
              ¿Te vas sin tu lugar?
            </p>
            <p className="mt-2 text-sm text-gals-muted">
              Guárdate un cupo antes de que se agoten.
            </p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setDismissed(true);
                onOpenRegister({
                  eventId: "popup-pagas",
                  title: "Eventos GAL'S",
                  beweAfter: "packs",
                  cta: "Quiero mi lugar",
                  source: "popup-exit",
                });
              }}
              className="mt-5 w-full rounded-full bg-gals-blue-deep px-5 py-3.5 text-sm font-semibold text-white uppercase"
            >
              Reservar cupo →
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setDismissed(true);
              }}
              className="mt-3 w-full py-2 text-sm text-gals-muted underline-offset-2 hover:underline"
            >
              Seguir viendo
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Landing de eventos — editorial GAL'S + stickers móvil. */
export function EventosLanding() {
  const freeEvents = getActiveFreeEvents();
  const paidEvents = getActivePaidEvents();
  const featured = getFeaturedEvent() ?? paidEvents[0] ?? freeEvents[0];
  const liveEvent = getNextLiveEvent() ?? featured;
  const otherPaid = paidEvents.filter((e) => e.id !== featured?.id);
  const [register, setRegister] = useState<RegisterTarget | null>(null);

  const openFor = (event: GalsEvent, source: string) => {
    setRegister({
      eventId: event.id,
      title: event.title,
      beweAfter: event.beweAfter,
      cta: event.cta,
      source,
    });
  };

  if (!featured || !liveEvent) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center bg-gals-cream px-5 text-center">
        <div>
          <p className="font-script text-2xl text-gals-blue-deep">
            eventos GAL&apos;S
          </p>
          <h1 className="mt-2 font-display text-3xl text-gals-ink uppercase">
            Pronto nuevos eventos
          </h1>
          <p className="mt-3 text-gals-muted">
            Estamos preparando la próxima agenda. Vuelve pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full overflow-x-clip bg-gals-cream text-gals-ink">
      {/* ——— HERO anclado al próximo evento ——— */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src={EVENTOS_HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-gals-cream" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent_20%,rgba(26,42,53,0.45)_100%)]" />

        <MiniHeader onRegister={() => openFor(liveEvent, "header")} />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-6xl flex-col justify-end px-4 pb-20 pt-8 sm:px-5 md:px-8 md:pb-24">
          <motion.p
            className="font-script text-xl text-gals-cream sm:text-2xl md:text-3xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            eventos GAL&apos;S
          </motion.p>

          <motion.h1
            className="mt-3 max-w-3xl font-display text-[1.85rem] leading-[1.05] tracking-tight text-white uppercase drop-shadow sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65 }}
          >
            ¿Cuándo fue la última vez que hiciste algo{" "}
            <span className="text-gals-blue-soft">solo para ti?</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base md:text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            Un espacio para reconectar contigo, moverte con intención y
            compartir energía con otras mujeres.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
          >
            <a
              href={`#${liveEvent.id}`}
              className="rounded-full bg-gals-cream px-7 py-3.5 text-sm font-bold tracking-wide text-gals-blue-deep uppercase shadow-lg transition-transform hover:scale-[1.02]"
            >
              Próximo evento
            </a>
            <a
              href="#agenda"
              className="rounded-full border border-white/50 bg-white/10 px-6 py-3.5 text-sm font-semibold tracking-wide text-white uppercase backdrop-blur-sm"
            >
              Ver agenda
            </a>
          </motion.div>

          {liveEvent.startsAt ? (
            <motion.div
              className="mt-8 max-w-md"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                {liveEvent.title} · {liveEvent.dateLabel}
                {liveEvent.timeLabel ? ` · ${liveEvent.timeLabel}` : ""}
              </p>
              <CountdownBlocks iso={liveEvent.startsAt} />
            </motion.div>
          ) : null}
        </div>
      </section>

      <WhyPills />

      <AgendaMosaic
        featured={featured}
        others={otherPaid}
        free={freeEvents}
        onRegister={openFor}
      />

      {/* CIERRE con foto */}
      <section
        id="cierre"
        className="relative min-h-[70svh] overflow-hidden md:min-h-[75svh]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={liveEvent.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gals-blue-deep/75" />
        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center text-white md:min-h-[75svh] md:px-8">
          <motion.p
            className="font-script text-2xl text-gals-blue-soft md:text-3xl"
            {...fadeUp}
          >
            eventos GAL&apos;S
          </motion.p>
          <motion.h2
            className="mt-2 font-display text-3xl tracking-tight uppercase sm:text-4xl md:text-5xl"
            {...fadeUp}
          >
            Tu lugar te{" "}
            <span className="text-gals-blue-soft">está esperando</span>
          </motion.h2>
          <motion.p
            className="mx-auto mt-3 max-w-md text-sm text-white/80 md:text-base"
            {...fadeUp}
          >
            No esperes el momento perfecto. Este puede ser el tuyo.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-3"
            {...fadeUp}
          >
            <button
              type="button"
              onClick={() => openFor(liveEvent, "cierre")}
              className="rounded-full bg-gals-cream px-7 py-3.5 text-sm font-bold tracking-wide text-gals-blue-deep uppercase"
            >
              Reservar mi cupo
            </button>
            <button
              type="button"
              className={`${BEWE_FORM_CLASS} rounded-full border border-white/40 px-6 py-3.5 text-sm font-semibold text-white uppercase`}
            >
              Hablar con el studio
            </button>
          </motion.div>
          <p className="mt-10 text-[11px] text-white/50">
            GAL&apos;S Studio · {ADDRESS}
          </p>
        </div>
      </section>

      <RegisterModal target={register} onClose={() => setRegister(null)} />
      <ExitPopup onOpenRegister={setRegister} />
    </div>
  );
}
