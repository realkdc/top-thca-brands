
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrandSection from "@/components/BrandSection";
import AboutSection from "@/components/AboutSection";
import CriteriaSection from "@/components/CriteriaSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-thca-black">
      <Navbar />
      <Hero />
      <BrandSection />
      <AboutSection />
      <CriteriaSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
