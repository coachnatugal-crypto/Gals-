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
import { StickerDivider } from "@/components/StickerDivider";
import { StudioStories } from "@/components/StudioStories";
import { RealStories } from "@/components/RealStories";
import { ClosingBanner } from "@/components/ClosingBanner";
import { CommunityWelcomePopup } from "@/components/CommunityWelcomePopup";
import { UniverseBanner } from "@/components/UniverseBanner";

export default function HomePage() {
  return (
    <>
      <CommunityWelcomePopup />
      <Hero />
      <div className="hidden md:block">
        <CommunityMarquee />
      </div>
      <WhoIs />
      <div className="md:hidden">
        <CommunityMarquee />
      </div>
      <HeroIntro />
      <StickerDivider />
      <Capsules />
      <RealStories />
      <StudioStories />
      <Community />
      <UniverseBanner />
      <License />
      <Plans />
      <Schedule />
      <Experiences />
      <Coaches />
      <FinalCta />
      <ClosingBanner />
    </>
  );
}
