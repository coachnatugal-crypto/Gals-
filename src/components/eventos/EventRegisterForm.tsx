"use client";

import { useState, type FormEvent } from "react";
import { openBeweWidget } from "@/lib/bewe";
import {
  EVENTOS_WHATSAPP_GENERAL,
  type GalsEvent,
} from "@/lib/eventos";
import { WHATSAPP_NUMBER } from "@/lib/constants";

type Status = "idle" | "loading" | "ok" | "error";

type Props = {
  eventId: string;
  beweAfter?: GalsEvent["beweAfter"];
  cta: string;
  source?: string;
  openWhatsApp?: boolean;
  whatsappMessage?: string;
  variant?: "dark" | "light";
  className?: string;
};

export function EventRegisterForm({
  eventId,
  beweAfter = "form",
  cta,
  source = "eventos",
  openWhatsApp = false,
  whatsappMessage = EVENTOS_WHATSAPP_GENERAL,
  variant = "dark",
  className = "",
}: Props) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const dark = variant === "dark";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/eventos/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          eventId,
          source,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        beweAfter?: "form" | "packs";
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo registrar");
      }

      setStatus("ok");
      setMessage("¡Listo! Continuamos tu reserva.");
      setName("");
      setWhatsapp("");

      const after = data.beweAfter ?? beweAfter;
      openBeweWidget(after === "packs" ? { path: "packs" } : { path: "form" });

      if (openWhatsApp) {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
        window.setTimeout(() => {
          window.open(url, "_blank", "noopener,noreferrer");
        }, 400);
      }
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Algo falló. Intenta de nuevo.",
      );
    }
  }

  const field = dark
    ? "w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-gals-blue"
    : "w-full rounded-xl border-2 border-gals-blue-deep/25 bg-white px-4 py-3 text-sm text-gals-ink outline-none placeholder:text-gals-muted/70 focus:border-gals-blue-deep";

  const label = dark
    ? "mb-1.5 block text-xs font-medium text-white/70"
    : "mb-1 block text-xs font-semibold tracking-wide text-gals-blue-deep";

  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-3 ${className}`}
      data-event-form={eventId}
    >
      <div>
        <label className={label}>Nombre y apellidos *</label>
        <input
          name="name"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === "loading"}
          placeholder="Tu nombre completo"
          className={field}
        />
      </div>
      <div>
        <label className={label}>WhatsApp *</label>
        <div className="flex gap-2">
          <span
            className={`flex shrink-0 items-center rounded-xl px-3 text-sm ${
              dark
                ? "border border-white/20 bg-white/5 text-white/80"
                : "border-2 border-gals-blue-deep/25 bg-gals-blue-soft text-gals-ink"
            }`}
          >
            🇨🇴 +57
          </span>
          <input
            name="whatsapp"
            required
            inputMode="tel"
            autoComplete="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            disabled={status === "loading"}
            placeholder="300 000 0000"
            className={field}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className={`w-full rounded-full px-6 py-4 font-display text-sm tracking-[0.12em] uppercase transition-transform hover:scale-[1.02] disabled:opacity-70 ${
          dark
            ? "bg-gals-cream text-gals-blue-deep"
            : "bg-gals-blue-deep text-white"
        }`}
      >
        {status === "loading" ? "Enviando…" : cta}
      </button>

      {message ? (
        <p
          className={`text-center text-sm ${
            status === "ok"
              ? dark
                ? "text-gals-blue-soft"
                : "text-gals-blue-deep"
              : "text-red-300"
          }`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
