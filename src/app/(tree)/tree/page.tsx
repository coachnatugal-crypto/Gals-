import type { Metadata } from "next";
import { GalsTree } from "@/components/tree/GalsTree";
import { getLatestYoutubeVideos } from "@/lib/tree";

export const metadata: Metadata = {
  title: "GAL'S Studio | Links",
  description:
    "WhatsApp, Instagram, reto 7 días, reservar, app y ubicación de GAL'S Studio en Bogotá.",
  openGraph: {
    title: "GAL'S Studio | Links",
    description: "Todo lo que necesitás de GAL'S en un solo lugar.",
  },
};

export default async function TreePage() {
  const videos = await getLatestYoutubeVideos(8);
  return <GalsTree videos={videos} />;
}
