import type { Metadata } from "next";
import { Archivo_Black, Caveat, Poppins } from "next/font/google";
import "./globals.css";

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

const SITE_URL = "https://gals-smoky.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GAL'S Studio | Built by GALS for GALS",
    template: "%s | GAL'S Studio",
  },
  description:
    "Movimiento con propósito y profundidad para volver a ti. Pilates · Sculpt · Yoga · experiencias de bienestar. Chicó Reservado, Bogotá.",
  applicationName: "GAL'S Studio",
  icons: {
    icon: [
      { url: "/brand/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/brand/icons/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/brand/icons/favicon-32.png",
  },
  openGraph: {
    title: "GAL'S Studio",
    description:
      "Movimiento con propósito y profundidad para volver a ti. Built by GALS for GALS.",
    url: SITE_URL,
    siteName: "GAL'S Studio",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/brand/og/og-share.jpg",
        width: 1200,
        height: 1200,
        alt: "GAL'S Studio",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "GAL'S Studio",
    description:
      "Movimiento con propósito y profundidad para volver a ti. Built by GALS for GALS.",
    images: ["/brand/og/og-share.jpg"],
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
      <body className="min-h-full max-w-[100vw] overflow-x-clip bg-gals-cream font-sans text-gals-ink">
        {children}
      </body>
    </html>
  );
}
