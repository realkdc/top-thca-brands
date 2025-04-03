import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getBrands } from "@/api/brandService";
import { useToast } from "@/components/ui/use-toast";

interface Brand {
  _id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  description: string;
  featured?: boolean;
  slug: string;
  website?: string;
}

const BrandSection = () => {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast({
          title: "Error",
          description: "Failed to load brands. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [toast]);

  const featuredBrands = brands.filter(brand => brand.featured);
  const regularBrands = brands.filter(brand => !brand.featured);
  
  if (loading) {
    return (
      <section id="brands" className="py-20 bg-thca-black">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Elite Brands</h2>
          <p className="text-thca-white/70 mb-12 max-w-2xl">
            We spotlight only the most exceptional THCA brands in the market. Each brand earns their place through our rigorous vetting process.
          </p>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-thca-grey/30 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-thca-grey/30 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-thca-grey/30 rounded"></div>
                  <div className="h-4 bg-thca-grey/30 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="brands" className="py-20 bg-thca-black">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Elite Brands</h2>
        <p className="text-thca-white/70 mb-12 max-w-2xl">
          We spotlight only the most exceptional THCA brands in the market. Each brand earns their place through our rigorous vetting process.
        </p>
        
        {/* Featured Brands */}
        {featuredBrands.length > 0 && (
          <div className="mb-16">
            <h3 className="font-display text-2xl font-bold mb-6 flex items-center">
              <span className="text-thca-gold mr-2">Featured</span> 
              <span className="badge">Top Tier</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredBrands.map(brand => (
                <FeaturedBrandCard key={brand._id} brand={brand} />
              ))}
            </div>
          </div>
        )}
        
        {/* Regular Brands */}
        {regularBrands.length > 0 && (
          <>
            <h3 className="font-display text-2xl font-bold mb-6">Elite Selection</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularBrands.map(brand => (
                <BrandCard key={brand._id} brand={brand} />
              ))}
            </div>
          </>
        )}
        
        {brands.length === 0 && !loading && (
          <div className="text-center text-thca-white/70 py-8">
            No brands available at the moment. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
};

const FeaturedBrandCard = ({ brand }: { brand: Brand }) => {
  const imageUrl = brand.image.startsWith('http') 
    ? brand.image 
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${brand.image}`;

  return (
    <div className="brand-card group p-0 flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-thca-grey/30 to-thca-grey/10">
      <div className="w-full md:w-2/5 h-60 md:h-auto relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={brand.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="badge bg-thca-gold text-thca-black">
            {brand.category}
          </span>
        </div>
      </div>
      
      <div className="w-full md:w-3/5 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-2xl font-bold text-thca-white">{brand.name}</h3>
            <Rating rating={brand.rating} />
          </div>
          <p className="text-thca-white/70 mb-4">{brand.description}</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-thca-white/50">#1 in {brand.category}</span>
          <a 
            href={brand.website || "#"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-thca-gold hover:underline text-sm flex items-center"
          >
            {brand.website ? "Visit Website" : "Learn More"}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const BrandCard = ({ brand }: { brand: Brand }) => {
  const imageUrl = brand.image.startsWith('http') 
    ? brand.image 
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${brand.image}`;

  return (
    <div className="brand-card group overflow-hidden">
      <div className="h-40 relative overflow-hidden">
        <img 
          src={imageUrl}
          alt={brand.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="badge text-xs">
            {brand.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-xl font-semibold text-thca-white">{brand.name}</h3>
          <Rating rating={brand.rating} small />
        </div>
        <p className="text-sm text-thca-white/70 mb-3 line-clamp-2">{brand.description}</p>
        <a 
          href={brand.website || "#"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-thca-gold text-xs flex items-center hover:underline"
        >
          {brand.website ? "Visit Website" : "View Details"}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const Rating = ({ rating, small = false }: { rating: number; small?: boolean }) => {
  return (
    <div className="flex items-center">
      <Star className={cn("text-thca-gold fill-thca-gold", small ? "w-3 h-3" : "w-4 h-4")} />
      <span className={cn("text-thca-gold font-medium ml-1", small ? "text-xs" : "text-sm")}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default BrandSection;
