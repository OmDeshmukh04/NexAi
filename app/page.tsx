import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import KpiBand from "@/components/sections/KpiBand";
import SolutionsSection from "@/components/sections/SolutionsSection";
import OpsPulse from "@/components/sections/OpsPulse";
import ProductShowcase from "@/components/sections/ProductShowcase";
import ServicesSection from "@/components/sections/ServicesSection";
import ImpactSection from "@/components/sections/ImpactSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <KpiBand />
        <SolutionsSection />
        <OpsPulse />
        <ProductShowcase />
        <ServicesSection />
        <ImpactSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
