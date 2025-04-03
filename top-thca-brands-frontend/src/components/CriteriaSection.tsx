
import { Shield, Flame, Star } from "lucide-react";

const criteriaData = [
  {
    id: 1,
    title: "Product Quality",
    description: "Premium appearance, aroma, flavor profile, and overall experience that exceeds category standards.",
    icon: Star
  },
  {
    id: 2,
    title: "Potency & Consistency",
    description: "Products deliver consistent effects with verified potency backed by third-party lab results.",
    icon: Flame
  },
  {
    id: 3,
    title: "Brand Integrity",
    description: "Transparent business practices, authentic marketing, and consistent brand presence.",
    icon: Shield
  },
  {
    id: 4,
    title: "Innovation",
    description: "Forward-thinking approaches that advance product quality, experience, or delivery methods.",
    icon: Star
  }
];

const CriteriaSection = () => {
  return (
    <section id="criteria" className="py-20 bg-gradient-to-b from-thca-black to-thca-grey/20">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Our Criteria</h2>
        <p className="text-thca-white/70 mb-12 max-w-2xl">
          We hold brands to the highest standards. Our curation process is rigorous and uncompromising.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {criteriaData.map((item) => (
            <CriteriaCard key={item.id} {...item} />
          ))}
        </div>
        
        <div className="mt-16 bg-thca-grey/10 border border-thca-grey/20 rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="font-display text-2xl font-bold mb-2 text-thca-white">
                Think your brand meets our standards?
              </h3>
              <p className="text-thca-white/70">
                We're always looking for exceptional brands that stand out from the crowd.
              </p>
            </div>
            
            <a href="#contact" className="bg-thca-gold text-thca-black font-medium py-3 px-8 rounded hover:bg-thca-gold/90 transition-colors shadow-lg">
              Submit Your Brand
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const CriteriaCard = ({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  icon: React.FC<React.SVGProps<SVGSVGElement>> 
}) => {
  return (
    <div className="bg-thca-grey/10 border border-thca-grey/30 p-6 rounded-lg hover:border-thca-gold/30 transition-colors">
      <div className="flex items-start">
        <div className="bg-thca-red/20 p-3 rounded-md">
          <Icon className="w-6 h-6 text-thca-red" />
        </div>
        
        <div className="ml-5">
          <h3 className="font-display text-xl font-bold mb-2 text-thca-white">
            {title}
          </h3>
          <p className="text-thca-white/70">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CriteriaSection;
