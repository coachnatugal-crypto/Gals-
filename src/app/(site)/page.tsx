import { Hero, HeroIntro } from "@/components/Hero";
import { WhoIs } from "@/components/WhoIs";
import { Capsules } from "@/components/Capsules";
import { Community, CommunityMarquee } from "@/components/Community";
import { License } from "@/components/License";
import { Plans } from "@/components/Plans";
import { Schedule } from "@/components/Schedule";
import { Experiences } from "@/components/Experiences";
import { FinalCta } from "@/components/FinalCta";
import { StudioStories } from "@/components/StudioStories";
import { RealStories } from "@/components/RealStories";
import { ClosingBanner } from "@/components/ClosingBanner";
import { ProgramEventsPopup } from "@/components/ProgramEventsPopup";
import { UniverseBanner } from "@/components/UniverseBanner";

export default function HomePage() {
  return (
    <>
      <ProgramEventsPopup
        storageKey="gals-home-experiencia-popup-seen"
        trigger="enter-and-end"
      />
      <Hero />
      <div className="hidden md:block">
        <CommunityMarquee />
      </div>
      <WhoIs />
      <div className="md:hidden">
        <CommunityMarquee />
      </div>
      <HeroIntro />
      <Capsules />
      <RealStories />
      <StudioStories />
      <Community />
      <UniverseBanner />
      <License />
      <Plans />
      <Schedule />
      <Experiences />
      <FinalCta />
      <ClosingBanner />
    </>
  );
}
