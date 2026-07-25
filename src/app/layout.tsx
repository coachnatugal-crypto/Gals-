import type { Metadata } from "next";
import { Archivo_Black, Caveat, Poppins } from "next/font/google";
import "./globals.css";
import { BeweChat } from "@/components/BeweChat";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GAL'S Studio | Built by GALS for GALS",
  description:
    "Movimiento con propósito y profundidad para volver a ti. Pilates · Sculpt · Yoga · experiencias de bienestar. Chicó Reservado, Bogotá.",
  icons: {
    icon: "/brand/logos/logo.png",
    apple: "/brand/logos/logo.png",
  },
  openGraph: {
    title: "GAL'S Studio",
    description:
      "Movimiento con propósito y profundidad para volver a ti. Built by GALS for GALS.",
    locale: "es_CO",
    type: "website",
    images: ["/brand/logos/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${archivoBlack.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gals-cream font-sans text-gals-ink">
        {children}
        <BeweChat />
      </body>
    </html>
  );
}
