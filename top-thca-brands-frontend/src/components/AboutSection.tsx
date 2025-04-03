
import { Shield, Check } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-thca-black relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wood-texture.png')] opacity-5 mix-blend-overlay"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="section-title">The Scene For Elite THCA</h2>
            <p className="text-thca-white/70 mb-8">
              We're not just another page—we're the scene. Our mission is to spotlight only the most exceptional THCA brands in the market through rigorous curation and expert evaluation.
            </p>
            
            <div className="space-y-4 mb-8">
              <FeatureItem>
                Stringent quality standards that exceed industry norms
              </FeatureItem>
              <FeatureItem>
                Focus on potency, consistency, and consumer experience
              </FeatureItem>
              <FeatureItem>
                Independent testing and verification of all products
              </FeatureItem>
              <FeatureItem>
                Recognition based on merit, not marketing budgets
              </FeatureItem>
            </div>
            
            <div className="inline-block">
              <span className="text-sm text-thca-white/50 border-b border-thca-red pb-1">No fluff. Just fire.</span>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-thca-red/20 to-thca-gold/20 rounded-lg blur-xl"></div>
              <div className="relative bg-thca-grey/20 border border-thca-grey/30 p-8 rounded-lg">
                <div className="flex justify-center mb-6">
                  <Shield className="w-16 h-16 text-thca-red" />
                </div>
                
                <blockquote className="text-center">
                  <p className="text-xl font-medium text-thca-white mb-4">
                    "If you know, you know."
                  </p>
                  <p className="text-lg text-thca-white/70 mb-6">
                    THCA heat only.
                  </p>
                  
                  <footer>
                    <p className="text-sm text-thca-gold font-medium uppercase tracking-widest">
                      The THCA Elite Scene
                    </p>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start">
      <Check className="w-5 h-5 text-thca-gold mr-3 mt-0.5" />
      <span className="text-thca-white/80">{children}</span>
    </div>
  );
};

export default AboutSection;
