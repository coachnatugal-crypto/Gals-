import type { Metadata } from "next";
import { Suspense } from "react";
import { EventosLanding } from "@/components/eventos/EventosLanding";
import { FREE_EVENTS, PAID_EVENTS } from "@/lib/eventos";
import { fetchPublishedEvents } from "@/lib/eventos-db";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Eventos GAL'S | Experiencias en Bogotá",
  description:
    "Eventos gratis y experiencias GAL'S: pilates, alimentación, hormonas y comunidad. Reserva tu cupo.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Eventos GAL'S | Experiencias en Bogotá",
    description:
      "Eventos gratis y experiencias GAL'S: pilates, alimentación, hormonas y comunidad. Reserva tu cupo.",
    images: [
      {
        url: "/brand/og/og-share.jpg",
        width: 1200,
        height: 630,
        alt: "GAL'S Studio",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

/**
 * Landing aislada — con Supabase solo usa eventos publicados de la DB
 * (aunque la lista esté vacía). El catálogo del código es fallback solo
 * si Supabase no está configurado.
 */
export default async function EventosPage() {
  const events = isSupabaseConfigured()
    ? ((await fetchPublishedEvents()) ?? [])
    : [...PAID_EVENTS, ...FREE_EVENTS];

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50svh] items-center justify-center bg-gals-cream text-gals-muted">
          Cargando eventos…
        </div>
      }
    >
      <EventosLanding events={events} />
    </Suspense>
  );
}
