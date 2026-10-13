/**
 * Layout SOLO para /propuesta/*.
 * Aislado de Navbar, Footer, WhatsApp flotante y chat de la home.
 */
export default function PropuestaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-full bg-gals-cream text-gals-ink">{children}</main>
  );
}
