
import { Shield, Flame } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-thca-black/90 z-0">
        <div className="absolute inset-0 bg-[url('/tobacco-texture.png')] opacity-15 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-thca-black via-transparent to-thca-black"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <Shield className="h-10 w-10 text-thca-red mr-2" />
          <Flame className="h-8 w-8 text-thca-gold" />
        </div>
        
        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-4 tracking-tighter">
          <span className="text-thca-white">TOP</span>
          <span className="text-thca-red">THCA</span>
          <span className="block text-thca-white mt-2">BRANDS</span>
        </h1>
        
        <p className="text-lg md:text-xl text-thca-white/80 max-w-2xl mx-auto mb-8 font-medium">
          The go-to authority for spotlighting elite THCA brands.
          We don't promote everyone. We <span className="text-thca-gold animate-glow">curate</span>.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <a href="#brands" className="bg-thca-red text-thca-white font-medium py-3 px-8 rounded hover:bg-thca-red/90 transition-colors shadow-lg">
            Explore Elite Brands
          </a>
          <a href="#criteria" className="bg-transparent text-thca-white border border-thca-white/30 font-medium py-3 px-8 rounded hover:bg-thca-white/10 transition-colors">
            Our Criteria
          </a>
        </div>

        <div className="mt-16 flex justify-center">
          <span className="badge">
            Premium Selections Only
          </span>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <a href="#brands" className="text-thca-white/50 hover:text-thca-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
