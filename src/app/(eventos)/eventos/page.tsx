import type { Metadata } from "next";
import { EventosLanding } from "@/components/eventos/EventosLanding";

export const metadata: Metadata = {
  title: "Eventos GAL'S | Experiencias en Bogotá",
  description:
    "Eventos gratis y experiencias GAL'S: pilates, alimentación, hormonas y comunidad. Reserva tu cupo.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Eventos GAL'S | Experiencias en Bogotá",
    description:
      "Eventos gratis y experiencias GAL'S: pilates, alimentación, hormonas y comunidad. Reserva tu cupo.",
    images: [{ url: "/brand/og/og-share.jpg", width: 1200, height: 630, alt: "GAL'S Studio" }],
  },
};

/** Landing aislada — no usa layout ni chrome de la homepage. */
export default function EventosPage() {
  return <EventosLanding />;
}
