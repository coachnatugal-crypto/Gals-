import type { Metadata } from "next";
import { AlimentacionPage } from "@/components/AlimentacionPage";
import { ProgramEventsPopup } from "@/components/ProgramEventsPopup";

export const metadata: Metadata = {
  title: "Alimentación consciente | GAL'S Studio",
  description:
    "Videos, audios, lista de mercado, lectura de etiquetas y acciones semanales del Método Body In Flow con Nati.",
};

export default function AlimentacionRoutePage() {
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <AlimentacionPage />
      <ProgramEventsPopup
        storageKey="gals-alimentacion-eventos-popup-seen"
      />
    </div>
  );
}
