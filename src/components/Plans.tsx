"use client";

import { motion } from "framer-motion";
import { PLANS } from "@/lib/constants";
import { BEWE_PACKS_CLASS, BEWE_SUBS_CLASS } from "@/lib/bewe";
import {
  FlowerSticker,
  ImageSticker,
  StarSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";

function splitPrice(price: string) {
  const match = price.match(/^(\$?[\d.\s]+)(.*)$/);
  if (!match) return { amount: price, suffix: "" };
  return { amount: match[1].trim(), suffix: match[2].trim() };
}

const SEMANA = PLANS[0];
const MEMBERSHIPS = PLANS.slice(1);

function PlanCard({
  plan,
  index,
  /** En desktop (md+) usa tipografía/paddings más densos para el grid */
  denseOnDesktop = false,
}: {
  plan: (typeof PLANS)[number];
  index: number;
  denseOnDesktop?: boolean;
}) {
  const { amount, suffix } = splitPrice(plan.price);
  const featured = plan.featured;

  return (
    <motion.article
      className={`relative flex h-full flex-col border-2 border-gals-blue-deep bg-gals-cream px-6 py-8 sm:px-8 sm:py-9 ${
        denseOnDesktop ? "md:px-5 md:py-7" : ""
      } ${featured ? "pt-11 md:pt-10" : ""}`}
      style={{ borderRadius: "1.35rem" }}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      {featured ? (
        <div className="absolute -top-4 -left-3 z-10 rotate-[-8deg] sm:-left-5">
          <div className="rounded-[1.25rem] border-2 border-gals-blue-deep bg-[#e8d9a8] px-3 py-2 shadow-[0_8px_20px_rgba(85,104,148,0.2)]">
            <p className="font-display text-[10px] leading-none tracking-[0.12em] text-gals-blue-deep uppercase">
              gal&apos;s pick
            </p>
            <p className="mt-1 font-script text-lg leading-none text-gals-ink">
              la más elegida
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col text-center">
        <h3
          className={`font-display text-2xl tracking-tight text-gals-blue-deep uppercase sm:text-3xl ${
            denseOnDesktop ? "md:text-2xl" : ""
          }`}
        >
          {plan.name}
        </h3>
        <p
          className={`mt-2 font-script text-xl text-gals-muted sm:text-2xl ${
            denseOnDesktop ? "md:text-xl" : ""
          }`}
        >
          {plan.tag}
        </p>
        <p className="mt-1 text-xs tracking-[0.18em] text-gals-muted uppercase">
          {plan.classes}
        </p>

        <div className="mt-5 flex flex-wrap items-end justify-center gap-x-2 gap-y-0">
          <span
            className={`font-display text-5xl leading-none tracking-tight text-gals-blue sm:text-6xl ${
              denseOnDesktop ? "md:text-[2.75rem]" : ""
            }`}
          >
            {amount}
          </span>
          {suffix ? (
            <span className="mb-1 font-script text-2xl text-gals-blue-deep">
              {suffix}
            </span>
          ) : null}
        </div>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-gals-muted sm:text-base">
          {plan.description}
        </p>

        {"bullets" in plan && plan.bullets ? (
          <ul className="mx-auto mt-5 max-w-md flex-1 space-y-2 text-left">
            {plan.bullets.map((bullet) => (
              <li
                key={bullet}
                className={`flex gap-2.5 text-sm leading-relaxed text-gals-ink/85 ${
                  denseOnDesktop ? "md:text-[13px]" : ""
                }`}
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gals-blue-deep"
                  aria-hidden
                />
                {bullet}
              </li>
            ))}
          </ul>
        ) : null}

        <button
          type="button"
          className={`${
            plan.id === "semana" ? BEWE_PACKS_CLASS : BEWE_SUBS_CLASS
          } mt-7 inline-flex min-w-[220px] items-center justify-center rounded-full px-8 py-3.5 font-script text-2xl transition-transform hover:scale-[1.04] ${
            denseOnDesktop
              ? "md:min-w-0 md:w-full md:px-5 md:text-[1.35rem]"
              : ""
          } ${
            featured
              ? "bg-gals-blue-deep text-gals-cream"
              : "bg-[#e8d9a8] text-gals-blue-deep"
          }`}
        >
          {plan.cta.toLowerCase()}
        </button>
      </div>
    </motion.article>
  );
}

function WelcomeKitBanner() {
  return (
    <motion.div
      className="mx-auto w-full max-w-md overflow-hidden rounded-[1.5rem] bg-[#AEB5D6] shadow-[0_16px_40px_rgba(85,104,148,0.14)] md:max-w-none md:grid md:grid-cols-[minmax(0,280px)_1fr] md:items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/alimentacion/guia-mockup.png"
        alt="Kit de bienvenida digital: guía antiinflamatoria y rutinas GAL'S"
        className="mx-auto block h-auto w-full md:h-full md:max-h-[220px] md:object-cover md:object-top"
      />
      <p className="bg-gals-cream px-5 py-4 text-center text-sm leading-snug text-gals-ink md:px-8 md:text-left md:text-base">
        <span className="font-semibold text-gals-blue-deep">
          Kit de bienvenida digital
        </span>
        {" — "}
        solo en Transformación y Unlimited: rutinas, meditación y guía
        antiinflamatoria.
      </p>
    </motion.div>
  );
}

export function Plans() {
  return (
    <>
      <section
        id="planes"
        className="relative overflow-x-clip bg-gals-cream py-20 md:py-20"
      >
        <ImageSticker
          src={STICKER_ASSETS.bola}
          className="top-14 left-2 hidden sm:block lg:left-10"
          size={92}
          rotate={-16}
          float
        />
        <ImageSticker
          src={STICKER_ASSETS.camara}
          className="top-16 right-2 hidden sm:block lg:right-12"
          size={72}
          rotate={14}
          float
          delay={0.12}
        />
        <FlowerSticker
          className="absolute bottom-24 left-[12%] z-[2] hidden md:block"
          size={32}
          color="var(--gals-blue)"
          rotate={-8}
          float
        />
        <StarSticker
          className="absolute top-32 right-[18%] z-[2] hidden lg:block"
          size={26}
          color="var(--gals-blue-deep)"
          rotate={12}
          float
        />

        <div className="relative z-20 mx-auto max-w-xl px-5 md:max-w-6xl md:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl tracking-tight text-gals-blue-deep uppercase sm:text-5xl md:text-6xl">
              Planes GAL&apos;S
            </h2>
            <p className="mt-3 font-script text-3xl text-gals-ink md:text-4xl">
              sin prisa, a tu ritmo
            </p>
            <p className="mx-auto mt-4 max-w-md text-base text-gals-muted md:max-w-xl md:text-lg">
              La Semana GAL&apos;S es una forma suave de llegar. Cuando te
              sientas lista, Ritual, Transformación o Unlimited te esperan.
            </p>
          </motion.div>

          {/* Móvil: columna (igual). Desktop: Semana + grid 3 membresías */}
          <div className="mt-10 flex flex-col gap-6 md:mt-12 md:gap-6">
            <div className="md:mx-auto md:max-w-md lg:max-w-lg">
              <PlanCard plan={SEMANA} index={0} />
            </div>

            <WelcomeKitBanner />

            {/* Móvil: sigue en fila vertical. md+: 3 columnas */}
            <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:items-stretch md:gap-5">
              {MEMBERSHIPS.map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  index={index + 1}
                  denseOnDesktop
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div
        className="overflow-hidden bg-gals-blue-deep py-3 md:py-4"
        aria-label="GAL'S es comunidad"
      >
        <div className="animate-marquee flex w-max gap-6 whitespace-nowrap">
          {Array.from({ length: 8 }, (_, index) => (
            <span
              key={index}
              className="flex items-center gap-6 font-display text-2xl font-semibold tracking-tight text-white uppercase sm:text-3xl md:text-4xl"
            >
              COMMUNITY IS QUEEN EN GAL&apos;S
              <span className="text-white/45" aria-hidden>
                /
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
