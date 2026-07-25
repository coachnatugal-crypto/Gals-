"use client";

import { TESTIMONIALS } from "@/lib/constants";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";

export function Testimonials() {
  return (
    <section className="bg-gals-mist py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <p className="text-sm font-medium tracking-[0.25em] text-gals-blue uppercase">
            Lo que se siente
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-gals-ink md:text-5xl">
            Historias de quienes ya son parte
          </h2>
        </FadeIn>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3" stagger={0.1}>
          {TESTIMONIALS.map((item) => (
            <StaggerItem key={item.quote}>
              <blockquote className="flex h-full flex-col rounded-[1.75rem] bg-white p-7 md:p-8">
                <p className="flex-1 text-lg leading-relaxed text-gals-ink">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-6 text-sm font-semibold tracking-wide text-gals-blue-deep">
                  — {item.author}
                </footer>
              </blockquote>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
