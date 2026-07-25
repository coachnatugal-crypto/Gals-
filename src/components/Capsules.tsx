"use client";

import { motion } from "framer-motion";
import { CreativeCapsule } from "@/components/capsules/CreativeCapsules";
import {
  ImageSticker,
  StarSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";

export function Capsules() {
  return (
    <section
      id="capsulas"
      className="relative overflow-visible bg-gals-cream pb-10 pt-8 md:pb-12 md:pt-10"
    >
      <ImageSticker
        src={STICKER_ASSETS.tapete}
        className="top-[34%] right-2 hidden md:block lg:right-10"
        size={100}
        rotate={18}
        float
        delay={0.18}
      />
      <ImageSticker
        src={STICKER_ASSETS.pesas}
        className="top-[55%] left-2 hidden md:block lg:left-8"
        size={86}
        rotate={-22}
        float
        delay={0.22}
      />

      <div className="relative z-20 mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center">
          <motion.p
            className="text-sm font-medium tracking-wide text-gals-ink"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            let&apos;s go! ✦
          </motion.p>
          <motion.h2
            className="mt-3 font-display text-4xl leading-none tracking-tight text-gals-blue-deep uppercase md:text-6xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            De lo que estamos
          </motion.h2>
          <motion.p
            className="mt-1 font-script text-5xl text-gals-blue md:text-6xl"
            initial={{ opacity: 0, rotate: -4 }}
            whileInView={{ opacity: 1, rotate: -2 }}
            viewport={{ once: true }}
          >
            hechos ;)
          </motion.p>

          <motion.div
            className="relative mx-auto mt-10 mb-2 flex w-full max-w-md items-center gap-3 rounded-full border border-gals-silver/40 bg-white px-5 py-3.5 shadow-[0_10px_30px_rgba(85,104,148,0.12)]"
            initial={{ opacity: 0, y: 20, rotate: -3 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            animate={{
              y: [0, -12, -4, -14, 0],
              x: [0, 6, -4, 3, 0],
              rotate: [-3, -1.2, -4, -2, -3],
            }}
            transition={{
              opacity: { duration: 0.5 },
              y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <p className="min-w-0 flex-1 text-left text-sm text-gals-ink md:text-base">
              <span className="rounded-sm bg-gals-blue/25 px-1 py-0.5">
                clases &amp; membresía gal&apos;s
              </span>
            </p>
            <span
              className="flex shrink-0 items-center gap-2 text-gals-muted"
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current opacity-50"
              >
                <path d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 8a1 1 0 01-1-1v-1.07A7.002 7.002 0 015 11h2a5 5 0 0010 0h2a7.002 7.002 0 01-6 6.93V18a1 1 0 01-1 1z" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current opacity-40"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 12.1L14.1 15.5 12 13.4l-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1z" />
              </svg>
            </span>
            <StarSticker
              className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2"
              size={26}
            />
          </motion.div>

          <p className="mx-auto mt-5 max-w-md text-gals-blue-deep">
            Tenemos algo para ti, bb. Da click y elige tu experiencia.
          </p>
        </div>

        <div className="relative mt-12 grid gap-5">
          <CreativeCapsule
            title="TRANSFORMACIÓN"
            script="la más elegida"
            badge="12 clases · $520.000/mes · Natalia + expertas te acompañan"
            accent="deep"
            href="#planes"
            className="min-h-[300px] md:min-h-[340px]"
            image="/media/capsules/_DSC4367.png"
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CreativeCapsule
              title="RITUAL"
              script="¿dónde me muevo?"
              badge="8 clases · $380.000/mes · kit + comunidad + 10% eventos"
              accent="blue"
              href="#planes"
              image="/media/capsules/IMG_4387.jpg"
            />
            <CreativeCapsule
              title="ILIMITADA"
              script="clases sin tope"
              badge="Sin límite de clases · $680.000/mes · círculo íntimo (máx. 20)"
              accent="green"
              href="#planes"
              image="/media/community/WhatsApp Image 2026-07-23 at 11.09.59 AM (2).jpeg"
            />
          </div>
          <div className="relative grid gap-5 md:grid-cols-2">
            <CreativeCapsule
              title="PILATES + SCULPT"
              script="fuerza con conciencia"
              badge="Dinámica, potente y presente. ¡La más pedida!"
              accent="blue"
              href="#planes"
              image="/media/capsules/pilates.jpg"
              textPosition="top"
            />
            <CreativeCapsule
              title="SEMANA GAL'S"
              script="tu puerta de entrada"
              badge="5 clases en 7 días · $80.000 · cupos limitados"
              accent="blue"
              href="#planes"
              image="/media/capsules/IMG_6986.jpg"
            />
          </div>
          <CreativeCapsule
            title="PACK PUENTE"
            script="después de la semana"
            badge="5 clases · 30 días · $220.000"
            accent="silver"
            href="#planes"
            image="/media/capsules/IMG_7077.jpg"
            textPosition="top"
          />
        </div>
      </div>
    </section>
  );
}
