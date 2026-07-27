"use client";

import { motion } from "framer-motion";
import { PLANS, WHATSAPP_URL } from "@/lib/constants";
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

export function Plans() {
  return (
    <>
      <section
        id="planes"
        className="relative overflow-x-clip bg-gals-cream py-20 md:py-28"
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

        <div className="relative z-20 mx-auto max-w-xl px-5 md:max-w-2xl md:px-8">
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
              tu primer paso empieza aquí
            </p>
            <p className="mx-auto mt-4 max-w-md text-base text-gals-muted md:text-lg">
              Empezá con la Semana GAL&apos;S. Después elegí Ritual,
              Transformación o Ilimitada.
            </p>
          </motion.div>

          <div className="mt-12 flex flex-col gap-6 md:mt-14 md:gap-7">
            {PLANS.map((plan, index) => {
              const { amount, suffix } = splitPrice(plan.price);
              const featured = plan.featured;

              return (
                <motion.article
                  key={plan.id}
                  className={`relative border-2 border-gals-blue-deep bg-gals-cream px-6 py-8 sm:px-8 sm:py-9 ${
                    featured ? "pt-11" : ""
                  }`}
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

                  <div className="text-center">
                    <h3 className="font-display text-2xl tracking-tight text-gals-blue-deep uppercase sm:text-3xl">
                      {plan.name}
                    </h3>
                    <p className="mt-2 font-script text-xl text-gals-muted sm:text-2xl">
                      {plan.tag}
                    </p>
                    <p className="mt-1 text-xs tracking-[0.18em] text-gals-muted uppercase">
                      {plan.classes}
                    </p>

                    <div className="mt-5 flex flex-wrap items-end justify-center gap-x-2 gap-y-0">
                      <span className="font-display text-5xl leading-none tracking-tight text-gals-blue sm:text-6xl">
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
                      <ul className="mx-auto mt-5 max-w-md space-y-2 text-left">
                        {plan.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-2.5 text-sm leading-relaxed text-gals-ink/85"
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

                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-7 inline-flex min-w-[220px] items-center justify-center rounded-full px-8 py-3.5 font-script text-2xl transition-transform hover:scale-[1.04] ${
                        featured
                          ? "bg-gals-blue-deep text-gals-cream"
                          : "bg-[#e8d9a8] text-gals-blue-deep"
                      }`}
                    >
                      {plan.cta.toLowerCase()}
                    </a>
                  </div>
                </motion.article>
              );
            })}
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
