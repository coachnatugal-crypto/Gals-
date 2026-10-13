import type { Metadata } from "next";
import { SoftysProposal } from "@/components/propuesta/SoftysProposal";

const TITLE = "Softys × Entre mujeres que crean";
const DESCRIPTION =
  "Propuesta de experiencia wellness Softys × Entre mujeres que crean × GAL'S Studio. Una tarde para movernos, conectar con nuestro ciclo y sentirnos acompañadas.";
const OG_IMAGE = "/brand/og/og-share.jpg";

/** OG/Twitter solo en esta ruta — preview de WhatsApp con logo GAL'S. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: `${TITLE} | GAL'S Studio`,
    description: DESCRIPTION,
    url: "/propuesta/softys",
    siteName: "GAL'S Studio",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 1200,
        alt: "GAL'S Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | GAL'S Studio`,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function SoftysPropuestaPage() {
  return <SoftysProposal />;
}
