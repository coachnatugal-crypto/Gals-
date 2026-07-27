"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ADDRESS,
  EMAIL,
  PHONE_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/constants";
import {
  FlowerSticker,
  ImageSticker,
  MoonSticker,
  StarSticker,
  STICKER_ASSETS,
} from "@/components/capsules/Stickers";

type Status = "idle" | "loading" | "ok" | "error";

export function FinalCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("error");
      setMessage("Ingresa un correo válido.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo guardar el correo.");
      }

      setStatus("ok");
      setMessage("¡Listo! Te escribimos pronto con el contenido.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Algo falló. Escríbenos por WhatsApp y te ayudamos.");
    }
  }

  return (
    <section
      id="comunidad-mail"
      className="relative overflow-x-clip bg-[#f3efe4] py-20 md:py-28"
    >
      <StarSticker
        className="absolute top-12 left-[8%] z-[2] hidden opacity-80 md:block"
        size={26}
        color="var(--gals-blue-deep)"
        rotate={-12}
        float
      />
      <MoonSticker
        className="absolute top-14 right-[10%] z-[2] hidden md:block"
        size={32}
        color="var(--gals-blue-mid)"
        rotate={8}
        float
      />
      <FlowerSticker
        className="absolute bottom-28 left-[14%] z-[2] hidden lg:block"
        size={34}
        color="var(--gals-blue)"
        rotate={-6}
        float
      />
      <ImageSticker
        src={STICKER_ASSETS.matchaTea}
        className="bottom-10 left-[5%] z-[2] hidden lg:block"
        size={70}
        rotate={-14}
        float
      />
      <ImageSticker
        src={STICKER_ASSETS.pesa}
        className="right-[6%] bottom-12 z-[2] hidden lg:block"
        size={66}
        rotate={16}
        float
        delay={0.12}
      />

      {/* Badge superior tipo referencia */}
      <motion.div
        className="relative z-20 mx-auto mb-8 flex w-fit items-center justify-center rounded-[2rem] border-2 border-gals-blue-deep bg-gals-blue-deep px-5 py-3"
        initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
      >
        <span className="font-script text-xl text-gals-cream">gals only ✦</span>
      </motion.div>

      <div className="relative z-20 mx-auto max-w-xl px-5 text-center md:px-8">
        <motion.h2
          className="font-display text-3xl leading-tight tracking-tight text-gals-blue-deep uppercase sm:text-4xl md:text-[2.75rem]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Te enseño paso a paso mis secretos para volver a ti — movimiento,
          energía y comunidad
        </motion.h2>

        <motion.p
          className="mt-5 font-script text-3xl text-gals-ink md:text-4xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
        >
          ¡Deja tu correo y únete gratis!
        </motion.p>

        <motion.form
          onSubmit={onSubmit}
          className="mx-auto mt-10 max-w-md text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
        >
          <label
            htmlFor="gals-email"
            className="block text-sm font-semibold tracking-wide text-gals-blue-deep"
          >
            Email *
          </label>
          <input
            id="gals-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="hola@ejemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle" && status !== "loading") {
                setStatus("idle");
                setMessage("");
              }
            }}
            disabled={status === "loading"}
            className="mt-2 w-full rounded-xl border-2 border-gals-blue-deep bg-gals-blue-soft/70 px-4 py-3.5 font-script text-xl text-gals-ink outline-none placeholder:text-gals-muted/70 focus:bg-white"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-4 w-full rounded-xl border-2 border-gals-blue-deep bg-gals-blue-deep px-6 py-3.5 font-script text-2xl text-gals-cream transition-transform hover:scale-[1.02] disabled:opacity-70"
          >
            {status === "loading" ? "Enviando…" : "Quiero unirme gratis"}
          </button>

          {message ? (
            <p
              className={`mt-3 text-center text-sm ${
                status === "ok" ? "text-gals-blue-deep" : "text-red-700"
              }`}
              role="status"
            >
              {message}
              {status === "error" ? (
                <>
                  {" "}
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    WhatsApp
                  </a>
                </>
              ) : null}
            </p>
          ) : (
            <p className="mt-3 text-center text-xs text-gals-muted">
              Sin spam. Solo valor para la comunidad GAL&apos;S.
            </p>
          )}
        </motion.form>

        {/* Stickers circulares abajo (toque referencia) */}
        <div className="relative mx-auto mt-12 flex h-24 w-40 items-end justify-end">
          <motion.div
            className="absolute bottom-0 left-0 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gals-blue-deep bg-gals-blue-soft"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            aria-hidden
          >
            <StarSticker size={22} color="var(--gals-blue-deep)" rotate={12} />
          </motion.div>
          <motion.div
            className="absolute right-0 bottom-2 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gals-blue-deep bg-gals-blue"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.28 }}
            aria-hidden
          >
            <span className="font-script text-2xl text-white">♡</span>
          </motion.div>
        </div>

        <div className="mt-10 space-y-2 text-sm text-gals-muted">
          <p>{ADDRESS}</p>
          <p>
            <a
              href={`mailto:${EMAIL}`}
              className="text-gals-blue-deep hover:underline"
            >
              {EMAIL}
            </a>
            {" · "}
            <a
              href={WHATSAPP_URL}
              className="text-gals-blue-deep hover:underline"
            >
              {PHONE_DISPLAY}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
