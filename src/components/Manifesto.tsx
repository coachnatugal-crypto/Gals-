"use client";

import { VALUES } from "@/lib/constants";
import { FadeIn } from "@/components/motion/FadeIn";

export function Marquee() {
  const loop = [...VALUES, ...VALUES, ...VALUES, ...VALUES];

  return (
    <div className="overflow-hidden border-y border-gals-silver/40 bg-white py-4">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {loop.map((value, i) => (
          <span
            key={`${value}-${i}`}
            className="flex items-center gap-10 text-sm font-medium tracking-[0.2em] text-gals-blue-deep uppercase"
          >
            {value}
            <span className="text-gals-blue" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Manifesto() {
  return (
    <section id="comunidad" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <p className="text-sm font-medium tracking-[0.25em] text-gals-blue uppercase">
            Sobre nosotros
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-gals-ink md:text-5xl">
            GAL&apos;S Studio es un espacio creado desde la experiencia, la
            conexión y el deseo de construir algo real.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          <FadeIn delay={0.12}>
            <p className="text-lg leading-relaxed text-gals-muted">
              Un lugar donde el movimiento se convierte en una herramienta, pero
              lo más importante es lo que pasa más allá: la conexión, la
              presencia y el volver a ti.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg leading-relaxed text-gals-muted">
              Somos una comunidad de bienestar donde el movimiento es el punto
              de partida para construir una vida con más energía, salud y
              equilibrio. Un lugar al que quieres pertenecer, crecer y volver.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.15} className="mt-14">
          <div className="grid gap-6 rounded-[2rem] bg-gals-blue-soft p-8 md:grid-cols-3 md:p-12">
            {[
              {
                title: "Paz interior",
                text: "Desconectarte del ruido externo, recargar energía y encontrar claridad.",
              },
              {
                title: "Fuerza",
                text: "Cada clase te reta, te activa y te lleva a sentirte más capaz y conectada.",
              },
              {
                title: "Comunidad",
                text: "Un espacio donde te sientes acompañada, sostenida y parte de algo.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-xl font-semibold text-gals-blue-deep">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-gals-muted">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
