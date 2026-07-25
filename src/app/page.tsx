import { Navbar } from "@/components/Navbar";
import { Hero, HeroIntro } from "@/components/Hero";
import { WhoIs } from "@/components/WhoIs";
import { Capsules } from "@/components/Capsules";
import { Community, CommunityMarquee } from "@/components/Community";
import { License } from "@/components/License";
import { Plans } from "@/components/Plans";
import { Schedule } from "@/components/Schedule";
import { Experiences } from "@/components/Experiences";
import { Coaches } from "@/components/Coaches";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { StickerDivider } from "@/components/StickerDivider";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="hidden md:block">
          <CommunityMarquee />
        </div>
        <WhoIs />
        <HeroIntro />
        <StickerDivider />
        <Capsules />
        <Community />
        <License />
        <Plans />
        <Schedule />
        <Experiences />
        <Coaches />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
