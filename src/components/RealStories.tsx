"use client";

import { useRef, useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { REAL_STORIES_VIDEOS, WHATSAPP_URL } from "@/lib/constants";

function StoryReel({
  src,
  poster,
  label,
  instanceKey,
  onPlay,
  onStop,
}: {
  src: string;
  poster: string;
  label: string;
  instanceKey: string;
  onPlay: (el: HTMLVideoElement) => void;
  onStop: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      onPlay(el);
      void el.play().catch(() => {
        setPlaying(false);
        onStop();
      });
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
      onStop();
    }
  };

  return (
    <article className="story-reel">
      <button
        type="button"
        className="story-reel__frame"
        onClick={toggle}
        aria-label={
          playing ? `Pausar video ${label}` : `Reproducir video ${label}`
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="story-reel__poster"
          src={poster}
          alt={`Historia de ${label}`}
          width={720}
          height={1280}
          draggable={false}
        />

        <video
          ref={videoRef}
          className="story-reel__video"
          playsInline
          loop
          preload="metadata"
          poster={poster}
          data-story-key={instanceKey}
          onEnded={() => {
            setPlaying(false);
            onStop();
          }}
          onPause={() => {
            setPlaying(false);
            onStop();
          }}
          onPlay={() => setPlaying(true)}
        >
          <source src={src} type="video/mp4" />
        </video>

        {!playing && (
          <span className="story-reel__play" aria-hidden>
            <span className="story-reel__play-btn">
              <svg viewBox="0 0 24 24" className="story-reel__play-icon">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        )}
      </button>
      <p className="story-reel__label">{label}</p>
    </article>
  );
}

/** Carrusel infinito de testimonios en video. */
export function RealStories() {
  const [paused, setPaused] = useState(false);

  // Duplicamos para loop continuo (marquee).
  const loop = [
    ...REAL_STORIES_VIDEOS,
    ...REAL_STORIES_VIDEOS,
    ...REAL_STORIES_VIDEOS,
  ];

  const pauseOthers = (current: HTMLVideoElement) => {
    setPaused(true);
    document
      .querySelectorAll<HTMLVideoElement>("#historias video")
      .forEach((v) => {
        if (v !== current) v.pause();
      });
  };

  const resumeIfIdle = () => {
    requestAnimationFrame(() => {
      const anyPlaying = Array.from(
        document.querySelectorAll<HTMLVideoElement>("#historias video"),
      ).some((v) => !v.paused);
      if (!anyPlaying) setPaused(false);
    });
  };

  return (
    <section id="historias" className="story-reels-section">
      <div className="story-reels-inner">
        <FadeIn className="text-center">
          <p className="text-sm font-medium tracking-[0.25em] text-gals-blue uppercase">
            Testimonios
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-gals-blue-deep uppercase sm:text-4xl md:text-5xl">
            Historias reales GAL&apos;S
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-gals-muted md:text-lg">
            Ellas ya viven el studio. Toca para ver sus historias.
          </p>
        </FadeIn>

        <div
          className={`story-reels-track-wrap${paused ? " is-paused" : ""}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={resumeIfIdle}
        >
          <div className="story-reels-track" aria-label="Carrusel de historias">
            {loop.map((story, i) => (
              <StoryReel
                key={`${story.id}-${i}`}
                instanceKey={`${story.id}-${i}`}
                src={story.src}
                poster={story.poster}
                label={story.label}
                onPlay={pauseOthers}
                onStop={resumeIfIdle}
              />
            ))}
          </div>
        </div>

        <FadeIn delay={0.1} className="mt-10 text-center md:mt-12">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-gals-blue-deep px-9 py-4 font-display text-sm tracking-[0.14em] text-white uppercase transition-transform hover:scale-[1.03] md:text-base"
          >
            Reserva tu Semana GAL&apos;S
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
