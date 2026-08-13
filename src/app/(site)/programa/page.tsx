import type { Metadata } from "next";
import { ProgramChallenge } from "@/components/ProgramChallenge";
import { ProgramEventsPopup } from "@/components/ProgramEventsPopup";

export const metadata: Metadata = {
  title: "Reto Pilates en casa | GAL'S Studio",
  description:
    "Reto de 7 días en casa con clases de pilates, abs y meditación de Natalia Galvis. Videos del canal GAL'S.",
};

export default function ProgramaPage() {
  return (
    <div className="bg-[#f4f5f7]">
      <ProgramEventsPopup />
      <ProgramChallenge />
    </div>
  );
}
