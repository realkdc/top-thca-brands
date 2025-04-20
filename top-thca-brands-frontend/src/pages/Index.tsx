import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrandSection from "@/components/BrandSection";
import AboutSection from "@/components/AboutSection";
import CriteriaSection from "@/components/CriteriaSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LeaderboardSection from "@/components/leaderboard/LeaderboardSection";
import NewsletterSection from "@/components/NewsletterSection";
import NewsletterPopup from "@/components/NewsletterPopup";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-thca-black">
      <Navbar />
      <Hero />
      <BrandSection />
      <LeaderboardSection />
      <NewsletterSection />
      <AboutSection />
      <CriteriaSection />
      <ContactSection />
      <Footer />
      
      {/* Newsletter popup with 10 second delay */}
      <NewsletterPopup delay={10000} showOnce={true} />
    </div>
  );
};

export default Index;
