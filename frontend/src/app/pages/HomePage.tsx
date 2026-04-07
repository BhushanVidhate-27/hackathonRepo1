import { HeroSection } from "../components/home/HeroSection";
import { ServicesSection } from "../components/home/ServicesSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { CaseStudiesSection } from "../components/home/CaseStudiesSection";
import { TeamSection } from "../components/home/TeamSection";
import { Footer } from "../components/home/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
     
      <CaseStudiesSection />
      <TeamSection />
     
      <Footer />
    </div>
  );
}
