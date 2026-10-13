"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import {
  SOFTYS_BEFORE_AFTER,
  SOFTYS_INCLUDES,
  SOFTYS_MEDIA,
  SOFTYS_MOMENTS,
  SOFTYS_TIMELINE,
} from "@/lib/propuesta-softys";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

/** Mismo marco visual que Real Stories en la home (`story-reel`). */
function PureVideo({
  src,
  poster,
  label,
  className = "",
  priority = false,
  /** Más grande, para apilar Eventos / UGC */
  large = false,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
  priority?: boolean;
  large?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  };

  return (
    <article
      className={`story-reel ${large ? "!w-full max-w-[min(92vw,380px)]" : "!w-full"} ${className}`}
    >
      <button
        type="button"
        className="story-reel__frame"
        onClick={toggle}
        aria-label={playing ? `Pausar video ${label}` : `Reproducir video ${label}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="story-reel__poster"
          src={poster}
          alt={label}
          width={720}
          height={1280}
          draggable={false}
        />
        <video
          ref={ref}
          className="story-reel__video"
          src={src}
          poster={poster}
          playsInline
          loop
          muted
          preload={priority ? "metadata" : "none"}
        />
        {!playing ? (
          <span className="story-reel__play" aria-hidden>
            <span className="story-reel__play-btn">
              <svg viewBox="0 0 24 24" className="story-reel__play-icon">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        ) : null}
      </button>
      <p className="story-reel__label">{label}</p>
    </article>
  );
}

export function SoftysProposal() {
  const [r1, r2, r3, r4, r5, r6, rEventos, rUgc] = SOFTYS_MEDIA.reels;
  const waMsg = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola ✨ Vi la propuesta Softys × Entre mujeres que crean × GAL'S. Quiero avanzar con Match en fecha y locación.",
  )}`;

  return (
    <div className="overflow-x-clip bg-gals-cream text-gals-ink">
      {/* HERO — imagen HQ a un lado (no estirar un still chico a full-bleed) */}
      <section className="relative min-h-[100svh] overflow-hidden bg-[#1a2a35] lg:grid lg:min-h-[100svh] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Mobile: imagen de fondo. Desktop: columna derecha nítida */}
        <div className="absolute inset-0 lg:relative lg:inset-auto lg:order-2 lg:min-h-[100svh]">
          <motion.div
            className="absolute inset-0 origin-center will-change-transform"
            initial={{ scale: 1.02 }}
            animate={{ scale: [1.02, 1.06, 1.02] }}
            transition={{
              duration: 26,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
            aria-hidden
          >
            <Image
              src={SOFTYS_MEDIA.hero}
              alt="Entre mujeres que crean"
              fill
              priority
              quality={100}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[center_22%]"
            />
          </motion.div>
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#1a2a35] via-[#1a2a35]/55 to-[#1a2a35]/15 lg:hidden"
            aria-hidden
          />
          <div
            className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#1a2a35] to-transparent lg:block"
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-12 pt-24 lg:order-1 lg:justify-center lg:px-12 lg:pb-20 lg:pt-20 xl:px-16">
          <motion.p
            className="text-[11px] font-semibold tracking-[0.26em] text-white/70 uppercase"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Softys × Entre mujeres que crean
          </motion.p>

          <motion.h1
            className="mt-4 max-w-xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <span className="block font-script text-3xl leading-none text-[#e8d9a8] sm:text-4xl md:text-5xl">
              una tarde para
            </span>
            <span className="mt-1 block font-display text-5xl leading-[0.95] tracking-tight text-white uppercase sm:text-6xl md:text-7xl">
              movernos
            </span>
            <span className="mt-2 block font-sans text-lg font-medium leading-snug text-white/90 sm:text-xl md:text-2xl">
              conectar con nuestro ciclo
            </span>
            <span className="mt-1 block font-script text-3xl leading-none text-white sm:text-4xl md:text-[2.75rem]">
              y sentirnos acompañadas
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-md text-sm leading-relaxed text-white/80 md:text-base"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
          >
            Experiencia wellness para 10 a 15 creadoras de contenido. Creada por
            Entre mujeres que crean + GAL&apos;s Studio, junto a Softys.
          </motion.p>
          <motion.div
            className="mt-7 flex flex-col gap-2 text-xs tracking-wide text-white/75 sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
          >
            <p>
              <span className="font-semibold text-white">Fecha:</span> 19–21 oct
              2026 · por definir con Match
            </p>
            <p>
              <span className="font-semibold text-white">Locación:</span> por
              definir con Match
            </p>
          </motion.div>
        </div>
      </section>

      {/* PUNTO DE PARTIDA */}
      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div {...fade}>
            <p className="text-xs font-semibold tracking-[0.2em] text-gals-blue-deep uppercase">
              Punto de partida
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-gals-blue-deep uppercase md:text-4xl">
              Softys llegó buscando
            </h2>
            <p className="mt-2 font-script text-3xl text-gals-ink md:text-4xl">
              las experiencias que venimos creando
            </p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-gals-muted md:text-lg">
              <p>
                Encuentros donde las mujeres pueden salir un rato de la rutina,
                moverse, conversar, conocerse, hacer amigas y conectar con ellas
                mismas desde el bienestar.
              </p>
              <p>
                Para esta colaboración queremos llevar ese mismo espíritu a una
                tarde pensada junto a Softys: un espacio íntimo con 10 a 15
                creadoras, donde la marca pueda acompañarlas en una conversación
                que hace parte de nuestra vida como mujeres: nuestro ciclo
                menstrual.
              </p>
              <p>
                La idea es integrar a Softys de forma natural durante toda la
                experiencia —desde la bienvenida hasta el cierre alrededor de
                snacks y un batido saludable— y que se sienta cercano.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 gap-3"
            {...fade}
            transition={{ ...fade.transition, delay: 0.1 }}
          >
            <PureVideo
              src={r1.src}
              poster={r1.poster}
              label={r1.label}
              priority
            />
            <PureVideo
              src={r2.src}
              poster={r2.poster}
              label={r2.label}
              className="mt-8"
            />
          </motion.div>
        </div>
      </section>

      {/* ANTES / DESPUÉS */}
      <section className="border-y border-gals-blue-deep/10 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <motion.div className="max-w-2xl" {...fade}>
            <p className="text-xs font-semibold tracking-[0.2em] text-gals-blue-deep uppercase">
              Antes y después
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-gals-blue-deep uppercase md:text-4xl">
              De la colaboración
            </h2>
            <p className="mt-1 font-script text-3xl text-gals-ink md:text-4xl">
              al encuentro vivo
            </p>
          </motion.div>
          <div className="mt-10 space-y-4">
            {SOFTYS_BEFORE_AFTER.map((row, i) => (
              <motion.div
                key={row.from}
                className="grid gap-3 border-l-2 border-gals-blue md:grid-cols-2 md:gap-8 md:border-l-0 md:border-b md:border-gals-blue-deep/10 md:pb-5"
                {...fade}
                transition={{ ...fade.transition, delay: i * 0.04 }}
              >
                <div className="pl-4 md:pl-0">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
                    Punto de partida
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gals-muted md:text-base">
                    {row.from}
                  </p>
                </div>
                <div className="pl-4 md:pl-0">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-gals-blue-deep uppercase">
                    Lo que queremos crear
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gals-ink md:text-base">
                    {row.to}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <p className="text-xs font-semibold tracking-[0.2em] text-gals-blue-deep uppercase">
              Quiénes somos
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-gals-blue-deep uppercase md:text-4xl">
              Dirección
            </h2>
            <p className="mt-1 font-script text-3xl text-gals-ink md:text-4xl">
              de la experiencia
            </p>
          </motion.div>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <motion.article
              className="rounded-[1.5rem] bg-white px-6 py-8 md:px-8"
              {...fade}
            >
              <p className="font-script text-3xl text-gals-blue-deep">
                Jessica Omaña
              </p>
              <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-gals-muted uppercase">
                Entre mujeres que crean
              </p>
              <div className="mt-5 space-y-3 text-sm leading-relaxed text-gals-muted md:text-base">
                <p>
                  Estratega de marketing digital, creadora de contenido UGC y
                  community manager. Creó Entre mujeres que crean, una comunidad
                  que nació de algo que disfruta mucho: reunir mujeres.
                </p>
                <p>
                  Espacios donde vivir experiencias wellness, hacer amigas,
                  conectar con la energía femenina y desarrollar habilidades
                  hacia nuestra mejor versión. Movimiento, conversaciones,
                  bienestar y comunidad hacen parte de cada encuentro.
                </p>
              </div>
            </motion.article>
            <motion.article
              className="rounded-[1.5rem] bg-gals-blue-deep px-6 py-8 text-white md:px-8"
              {...fade}
              transition={{ ...fade.transition, delay: 0.08 }}
            >
              <p className="font-script text-3xl text-[#e8d9a8]">
                Natalia Galvis
              </p>
              <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-white/70 uppercase">
                GAL&apos;s Studio
              </p>
              <div className="mt-5 space-y-3 text-sm leading-relaxed text-white/85 md:text-base">
                <p>
                  GAL&apos;s es un estudio de movimiento enfocado en pilates y
                  yoga, creado para que cada mujer pueda sentirse cómoda en su
                  cuerpo.
                </p>
                <p>
                  Desde GAL&apos;s desarrollamos la parte de movimiento y
                  bienestar de nuestros encuentros, cuidando tanto la experiencia
                  como la forma en la que cada mujer se siente durante ella.
                  Juntas estaremos a cargo de la dirección y ejecución de esta
                  experiencia para Softys.
                </p>
              </div>
            </motion.article>
          </div>
          <motion.div
            className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4"
            {...fade}
          >
            {[r3, r4, r5, r6].map((reel) => (
              <PureVideo
                key={reel.id}
                src={reel.src}
                poster={reel.poster}
                label={reel.label}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* LA EXPERIENCIA */}
      <section className="bg-[linear-gradient(180deg,#eef1f8_0%,#f5f6fb_45%,#ffffff_100%)] px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <motion.div className="max-w-2xl" {...fade}>
            <p className="text-xs font-semibold tracking-[0.2em] text-gals-blue-deep uppercase">
              La experiencia
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-gals-blue-deep uppercase md:text-4xl">
              Cuatro momentos
            </h2>
            <p className="mt-1 font-script text-3xl text-gals-ink md:text-4xl">
              ~3 horas y media
            </p>
            <p className="mt-4 text-base leading-relaxed text-gals-muted md:text-lg">
              Cada uno conecta con el siguiente y mantiene el ciclo femenino
              como hilo conductor.
            </p>
          </motion.div>
          <div className="mt-12 space-y-10">
            {SOFTYS_MOMENTS.map((m, i) => (
              <motion.div
                key={m.num}
                className="grid gap-6 border-t border-gals-blue-deep/15 pt-8 md:grid-cols-[auto_1fr] md:gap-10"
                {...fade}
                transition={{ ...fade.transition, delay: i * 0.05 }}
              >
                <p className="font-display text-5xl leading-none text-gals-blue md:text-6xl">
                  {m.num}
                </p>
                <div>
                  <h3 className="font-display text-2xl tracking-tight text-gals-blue-deep uppercase md:text-3xl">
                    {m.title}
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gals-muted md:text-base">
                    {m.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="mx-auto mt-14 flex w-full max-w-[380px] flex-col items-center gap-8"
            {...fade}
          >
            <PureVideo
              src={rEventos.src}
              poster={rEventos.poster}
              label={rEventos.label}
              large
            />
            <PureVideo
              src={rUgc.src}
              poster={rUgc.poster}
              label={rUgc.label}
              large
            />
          </motion.div>
        </div>
      </section>

      {/* INCLUYE + INVERSIÓN */}
      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div {...fade}>
            <p className="text-xs font-semibold tracking-[0.2em] text-gals-blue-deep uppercase">
              Lo que incluye
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-gals-blue-deep uppercase md:text-4xl">
              Producción
            </h2>
            <p className="mt-1 font-script text-3xl text-gals-ink md:text-4xl">
              completa
            </p>
            <ul className="mt-8 space-y-3">
              {SOFTYS_INCLUDES.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-gals-ink/90 md:text-base"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gals-blue-deep"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-gals-muted">
              Match estará a cargo de convocar y gestionar a las creadoras,
              llevar los productos de Softys y manejar el proceso contractual y de
              pago.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col justify-between rounded-[1.75rem] bg-gals-blue-deep px-7 py-9 text-white md:px-9"
            {...fade}
            transition={{ ...fade.transition, delay: 0.08 }}
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-white/65 uppercase">
                Inversión total
              </p>
              <p className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">
                $9.697.000
              </p>
              <p className="mt-1 font-script text-2xl text-[#e8d9a8]">COP</p>
              <p className="mt-6 text-sm leading-relaxed text-white/80">
                Valor correspondiente a la producción y ejecución completa de la
                experiencia descrita para 10 a 15 creadoras de contenido.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                El contrato y el pago se gestionan directamente con Match Agency.
              </p>
            </div>
            <a
              href={waMsg}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-gals-blue-deep transition hover:scale-[1.02]"
            >
              Confirmar por WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="border-y border-gals-blue-deep/10 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <p className="text-xs font-semibold tracking-[0.2em] text-gals-blue-deep uppercase">
              Cómo se vive la tarde
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-gals-blue-deep uppercase md:text-4xl">
              Minuto
            </h2>
            <p className="mt-1 font-script text-3xl text-gals-ink md:text-4xl">
              a minuto
            </p>
          </motion.div>
          <div className="mt-10 space-y-0">
            {SOFTYS_TIMELINE.map((row, i) => (
              <motion.div
                key={row.time}
                className="grid gap-2 border-t border-gals-blue-deep/10 py-5 md:grid-cols-[5.5rem_14rem_1fr] md:gap-6 md:py-6"
                {...fade}
                transition={{ ...fade.transition, delay: i * 0.03 }}
              >
                <p className="font-display text-xl text-gals-blue">{row.time}</p>
                <p className="font-semibold text-gals-blue-deep">{row.moment}</p>
                <p className="text-sm leading-relaxed text-gals-muted md:text-base">
                  {row.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTINUIDAD */}
      <section className="relative overflow-hidden px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="absolute inset-0 opacity-[0.12]" aria-hidden>
          <Image
            src={SOFTYS_MEDIA.post}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div {...fade}>
            <p className="text-xs font-semibold tracking-[0.2em] text-gals-blue-deep uppercase">
              Continuidad
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-gals-blue-deep uppercase md:text-4xl">
              Softys × Entre mujeres que crean
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gals-muted md:text-lg">
              Esta primera experiencia también puede abrir la puerta a una serie
              de encuentros periódicos junto a Softys: ediciones con el cuidado
              del ciclo como hilo conductor y temas que cambian —movimiento,
              autoestima, descanso, energía femenina, cuidado personal,
              alimentación, creatividad y más.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gals-muted">
              Cada fecha tendría su propio concepto. Esta continuidad se
              cotizaría aparte según cantidad de encuentros y formato.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CIERRE */}
      <section className="bg-gals-blue-deep px-5 py-16 text-white md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fade}>
            <p className="font-script text-3xl text-[#e8d9a8] md:text-4xl">
              Softys × Entre mujeres que crean
            </p>
            <p className="mt-8 text-base leading-relaxed text-white/85 md:text-lg">
              Nos emociona que Softys haya llegado buscando justamente el tipo
              de experiencias que venimos construyendo con nuestra comunidad.
              Queremos conservar esa esencia: una tarde entre mujeres,
              movimiento, conversaciones que sí hacen parte de nuestra vida. Un
              espacio bonito para conocer nuestro ciclo, escucharnos y
              sentirnos acompañadas.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-white/70">
              Si la propuesta está alineada con lo que tienen en mente, podemos
              confirmarla por WhatsApp y avanzar con Match en la definición de
              fecha, locación y detalles finales.
            </p>
            <a
              href={waMsg}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-gals-blue-deep transition hover:scale-[1.02]"
            >
              Avanzar por WhatsApp
            </a>
            <div className="mx-auto mt-12 flex max-w-2xl flex-row items-start justify-center gap-8 text-left sm:gap-16">
              <div className="min-w-0 flex-1">
                <p className="font-script text-2xl leading-none text-[#e8d9a8] sm:text-3xl">
                  Jessica Omaña
                </p>
                <p className="mt-1.5 text-[10px] tracking-[0.14em] text-white/65 uppercase sm:text-xs">
                  Entre mujeres que crean
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-script text-2xl leading-none text-[#e8d9a8] sm:text-3xl">
                  Natalia Galvis
                </p>
                <p className="mt-1.5 text-[10px] tracking-[0.14em] text-white/65 uppercase sm:text-xs">
                  GAL&apos;s Studio
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
