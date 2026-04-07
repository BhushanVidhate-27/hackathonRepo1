import { HeroSection } from "../components/home/HeroSection";
import { ServicesSection } from "../components/home/ServicesSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { TeamSection } from "../components/home/TeamSection";
import { Footer } from "../components/home/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <TeamSection />
     
      <Footer />
    </div>
  );
}
