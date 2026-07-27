"use client";

import { useRef, useState } from "react";
import { COACHES } from "@/lib/constants";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import {
  ImageSticker,
  MoonSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";

function CoachMedia({
  name,
  photo,
  video,
}: {
  name: string;
  photo?: string;
  video?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = videoRef.current;
    if (!el || !video) return;
    if (el.paused) {
      void el.play().catch(() => setPlaying(false));
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  if (!photo && !video) {
    return (
      <div className="mb-6 flex aspect-[4/5] items-end overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-gals-blue-soft via-white to-gals-green-soft p-6">
        <span className="text-sm font-medium tracking-[0.2em] text-gals-blue-deep/40 uppercase">
          Foto próximamente
        </span>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="mb-6 aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-gals-blue-soft via-white to-gals-green-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div className="mb-6 aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-gals-blue-deep">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pausar video de ${name}` : `Ver video de ${name}`}
        className="relative block h-full w-full cursor-pointer overflow-hidden"
      >
        {photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo}
            alt={name}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              playing ? "opacity-0" : "opacity-100"
            }`}
          />
        ) : null}

        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          playsInline
          loop
          preload="metadata"
          poster={photo}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        >
          <source src={video} type="video/mp4" />
        </video>

        {!playing && (
          <span
            className="absolute inset-0 flex items-center justify-center bg-black/25"
            aria-hidden
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-gals-blue-deep shadow-md">
              <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-current">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        )}
      </button>
    </div>
  );
}

export function Coaches() {
  return (
    <section className="relative overflow-visible bg-white py-20 md:py-28">
      <MoonSticker
        className="absolute top-20 right-[12%] z-[2] hidden md:block"
        size={34}
        rotate={-8}
        color="var(--gals-blue-mid)"
        float
      />

      <div className="relative z-20 mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <p className="text-sm font-medium tracking-[0.25em] text-gals-blue uppercase">
            Las hermanas
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl tracking-tight text-gals-ink uppercase md:text-5xl">
            Las mejores hermanas
          </h2>
          <p className="mt-1 font-script text-4xl text-gals-blue-deep md:text-5xl">
            no siempre nacen en tu casa
          </p>
        </FadeIn>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.1}>
          {COACHES.map((coach) => {
            const photo = "photo" in coach ? coach.photo : undefined;
            const video = "video" in coach ? coach.video : undefined;
            const stickers =
              photo?.includes("nati.jpg") && !photo.includes("natiramos")
                ? "matcha"
                : photo?.includes("mari")
                  ? "bola-tapete"
                  : photo?.includes("natiramos")
                    ? "pesa"
                    : null;

            return (
              <StaggerItem key={coach.name}>
                <article className="relative h-full">
                  {stickers === "matcha" ? (
                    <>
                      <ImageSticker
                        src={STICKER_ASSETS.matchaTea}
                        className="-right-5 -top-8 z-30 sm:-right-9 md:hidden"
                        size={110}
                        rotate={14}
                        float
                      />
                      <ImageSticker
                        src={STICKER_ASSETS.matcha}
                        className="-left-5 top-[36%] z-30 hidden sm:block sm:-left-10 md:hidden"
                        size={96}
                        rotate={-14}
                        float
                        delay={0.18}
                      />
                    </>
                  ) : null}

                  {stickers === "bola-tapete" ? (
                    <>
                      <ImageSticker
                        src={STICKER_ASSETS.bola}
                        className="-right-5 -top-6 z-30 sm:-right-8"
                        size={92}
                        rotate={12}
                        float
                      />
                      <ImageSticker
                        src={STICKER_ASSETS.tapete}
                        className="-left-5 bottom-28 z-30 hidden sm:block sm:-left-9 md:hidden"
                        size={88}
                        rotate={-18}
                        float
                        delay={0.15}
                      />
                    </>
                  ) : null}

                  {stickers === "pesa" ? (
                    <ImageSticker
                      src={STICKER_ASSETS.pesa}
                      className="-right-4 -top-5 z-30 sm:-right-8"
                      size={78}
                      rotate={16}
                      float
                    />
                  ) : null}

                  <CoachMedia name={coach.name} photo={photo} video={video} />
                  <h3 className="text-xl font-semibold text-gals-ink">
                    {coach.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gals-blue-deep">
                    {coach.role}
                  </p>
                  {"note" in coach && coach.note ? (
                    <p className="mt-1 text-xs font-medium tracking-wide text-gals-muted uppercase">
                      {coach.note}
                    </p>
                  ) : null}
                  <p className="mt-3 leading-relaxed text-gals-muted">
                    {coach.bio}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
