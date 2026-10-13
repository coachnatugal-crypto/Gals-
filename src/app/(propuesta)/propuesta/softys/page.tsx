import type { Metadata } from "next";
import { SoftysProposal } from "@/components/propuesta/SoftysProposal";

export const metadata: Metadata = {
  title: "Softys × Entre mujeres que crean | Propuesta",
  description:
    "Propuesta de experiencia wellness Softys × Entre mujeres que crean × GAL'S Studio. Una tarde para movernos, conectar con nuestro ciclo y sentirnos acompañadas.",
  robots: { index: false, follow: false },
};

export default function SoftysPropuestaPage() {
  return <SoftysProposal />;
}
