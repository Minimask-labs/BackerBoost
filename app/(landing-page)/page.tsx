'use client';
import CampaignSection from "@/components/landing/campaign-section";
import FooterSection from "@/components/landing/footer";
import FundCampaign from "@/components/landing/fund-campaign";
import Header from "@/components/landing/header";
import HeroSection from "@/components/landing/hero-section";

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
