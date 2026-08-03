import { BeweWidgets } from "@/components/BeweWidgets";

/**
 * Layout SOLO para /eventos.
 * Sin Navbar, Footer, WhatsApp flotante ni chat de la home.
 */
export default function EventosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="min-h-full bg-gals-cream text-gals-ink">{children}</main>
      <BeweWidgets />
    </>
  );
}
