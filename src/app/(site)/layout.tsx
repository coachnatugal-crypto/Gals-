import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BeweWidgets } from "@/components/BeweWidgets";
import { SiteFloaters } from "@/components/SiteFloaters";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BeweWidgets />
      <SiteFloaters />
    </>
  );
}
