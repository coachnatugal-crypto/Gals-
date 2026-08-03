import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BeweWidgets } from "@/components/BeweWidgets";
import { BeweChat } from "@/components/BeweChat";

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
      <WhatsAppButton />
      <BeweWidgets />
      <BeweChat />
    </>
  );
}
