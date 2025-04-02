import CampaignSection from "@/components/landing/CampaignSection";
import FooterSection from "@/components/landing/Footer";
import FundCampaign from "@/components/landing/FundCampaign";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/Hero-Section";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* THE HERO SECTION */}
        <HeroSection />
        <CampaignSection />
        <FundCampaign />
      </main>
      <FooterSection />
    </>
  );
}
