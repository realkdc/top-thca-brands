import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/api/leaderboardService';
import { useToast } from '@/components/ui/use-toast';
import RatingModal from './RatingModal';
import CriteriaTooltip from './CriteriaTooltip';
import { Star, ThumbsUp, Award, TrendingUp, Info } from 'lucide-react';

interface BrandRatings {
  potency: number;
  flavor: number;
  effects: number;
  value: number;
  overall: number;
}

interface LeaderboardBrand {
  _id: string;
  name: string;
  image: string;
  description: string;
  website?: string;
  productTypes?: string[];
  ratings: BrandRatings;
  totalRatings: number;
}

const LeaderboardSection = () => {
  const { toast } = useToast();
  const [brands, setBrands] = useState<LeaderboardBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState<keyof BrandRatings>('overall');
  const [selectedBrand, setSelectedBrand] = useState<LeaderboardBrand | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        toast({
          title: "Error",
          description: "Failed to load leaderboard. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [toast]);

  const handleSortChange = (criteria: keyof BrandRatings) => {
    setSortCriteria(criteria);
  };

  const openRatingModal = (brand: LeaderboardBrand) => {
    setSelectedBrand(brand);
    setIsRatingModalOpen(true);
  };

  const sortedBrands = [...brands].sort((a, b) => b.ratings[sortCriteria] - a.ratings[sortCriteria]);

  return (
    <section id="leaderboard" className="py-20 bg-thca-black">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="section-title mb-4">THCA Brand Leaderboard</h2>
          <p className="text-thca-white/70 max-w-2xl mx-auto">
            Our community-driven ranking of the top THCA brands. Vote for your favorites and see how they stack up.
          </p>
        </div>

        {/* Sorting controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <SortButton 
            active={sortCriteria === 'overall'} 
            onClick={() => handleSortChange('overall')}
            label="Overall"
            icon={<Award size={14} />}
          />
          <SortButton 
            active={sortCriteria === 'potency'} 
            onClick={() => handleSortChange('potency')}
            label="Potency"
            icon={<TrendingUp size={14} />}
          />
          <SortButton 
            active={sortCriteria === 'flavor'} 
            onClick={() => handleSortChange('flavor')}
            label="Flavor"
            icon={<Star size={14} />}
          />
          <SortButton 
            active={sortCriteria === 'effects'} 
            onClick={() => handleSortChange('effects')}
            label="Effects"
            icon={<Star size={14} />}
          />
          <SortButton 
            active={sortCriteria === 'value'} 
            onClick={() => handleSortChange('value')}
            label="Value"
            icon={<ThumbsUp size={14} />}
          />
        </div>

        {/* Criteria explanation */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center text-sm text-thca-white/70">
            <Info size={14} className="mr-2" />
            <span>
              Click column headers to sort. Ratings are crowdsourced from our community. 
              <CriteriaTooltip type="overall" />
            </span>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
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
        ) : (
          <>
            {/* Desktop leaderboard table */}
            <div className="hidden lg:block overflow-hidden rounded-lg border border-thca-grey/30 mb-8">
              <table className="min-w-full divide-y divide-thca-grey/30">
                <thead className="bg-thca-grey/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-thca-gold uppercase tracking-wider w-10">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-thca-gold uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-thca-gold uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <span>Potency</span>
                        <CriteriaTooltip criteria="potency" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-thca-gold uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <span>Flavor</span>
                        <CriteriaTooltip criteria="flavor" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-thca-gold uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <span>Effects</span>
                        <CriteriaTooltip criteria="effects" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-thca-gold uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <span>Value</span>
                        <CriteriaTooltip criteria="value" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-thca-gold uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <span>Overall</span>
                        <CriteriaTooltip criteria="overall" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-thca-gold uppercase tracking-wider">Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-thca-black divide-y divide-thca-grey/30">
                  {sortedBrands.map((brand, index) => (
                    <tr key={brand._id} className="hover:bg-thca-grey/10">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full ${index < 3 ? 'bg-thca-gold text-thca-black' : 'bg-thca-grey/20 text-thca-white'} font-bold text-sm`}>
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <img 
                              src={brand.image} 
                              alt={brand.name} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/40?text=Brand';
                              }}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-thca-white">{brand.name}</div>
                            <div className="text-xs text-thca-white/50">
                              {brand.totalRatings} rating{brand.totalRatings !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <RatingDisplay rating={brand.ratings.potency} highlight={sortCriteria === 'potency'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <RatingDisplay rating={brand.ratings.flavor} highlight={sortCriteria === 'flavor'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <RatingDisplay rating={brand.ratings.effects} highlight={sortCriteria === 'effects'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <RatingDisplay rating={brand.ratings.value} highlight={sortCriteria === 'value'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <RatingDisplay rating={brand.ratings.overall} highlight={sortCriteria === 'overall'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          onClick={() => openRatingModal(brand)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-thca-black bg-thca-gold hover:bg-thca-gold/90 focus:outline-none"
                        >
                          Rate Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile leaderboard cards */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
              {sortedBrands.map((brand, index) => (
                <div key={brand._id} className="bg-thca-grey/10 rounded-lg p-4 border border-thca-grey/30">
                  <div className="flex items-center mb-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full ${index < 3 ? 'bg-thca-gold text-thca-black' : 'bg-thca-grey/20 text-thca-white'} font-bold text-sm mr-3`}>
                      {index + 1}
                    </span>
                    <div className="flex items-center flex-1">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src={brand.image} 
                          alt={brand.name} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/40?text=Brand';
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-thca-white">{brand.name}</div>
                        <div className="text-xs text-thca-white/50">
                          {brand.totalRatings} rating{brand.totalRatings !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-thca-grey/20 p-2 rounded">
                      <div className="text-xs text-thca-white/70 mb-1">Potency</div>
                      <RatingDisplay rating={brand.ratings.potency} highlight={sortCriteria === 'potency'} />
                    </div>
                    <div className="bg-thca-grey/20 p-2 rounded">
                      <div className="text-xs text-thca-white/70 mb-1">Flavor</div>
                      <RatingDisplay rating={brand.ratings.flavor} highlight={sortCriteria === 'flavor'} />
                    </div>
                    <div className="bg-thca-grey/20 p-2 rounded">
                      <div className="text-xs text-thca-white/70 mb-1">Effects</div>
                      <RatingDisplay rating={brand.ratings.effects} highlight={sortCriteria === 'effects'} />
                    </div>
                    <div className="bg-thca-grey/20 p-2 rounded">
                      <div className="text-xs text-thca-white/70 mb-1">Value</div>
                      <RatingDisplay rating={brand.ratings.value} highlight={sortCriteria === 'value'} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="bg-thca-grey/20 p-2 rounded flex-1 mr-4">
                      <div className="text-xs text-thca-white/70 mb-1">Overall</div>
                      <RatingDisplay rating={brand.ratings.overall} highlight={sortCriteria === 'overall'} />
                    </div>
                    <button 
                      onClick={() => openRatingModal(brand)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-thca-black bg-thca-gold hover:bg-thca-gold/90 focus:outline-none"
                    >
                      Rate Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* No brands message */}
            {brands.length === 0 && !loading && (
              <div className="text-center text-thca-white/70 py-8">
                No brands available in the leaderboard. Check back soon!
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Rating Modal */}
      {selectedBrand && (
        <RatingModal 
          brand={selectedBrand}
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          onSuccess={() => {
            setIsRatingModalOpen(false);
            // Refresh the leaderboard after successful rating
            setTimeout(() => {
              getLeaderboard().then(setBrands).catch(console.error);
            }, 1000);
          }}
        />
      )}
    </section>
  );
};

// Helper components
const SortButton = ({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
      active 
        ? 'bg-thca-gold text-thca-black font-medium' 
        : 'bg-thca-grey/20 text-thca-white/70 hover:bg-thca-grey/30'
    }`}
  >
    <span className="mr-1">{icon}</span>
    {label}
  </button>
);

const RatingDisplay = ({ rating, highlight = false }: { rating: number; highlight?: boolean }) => (
  <div className={`inline-flex items-center ${highlight ? 'text-thca-gold font-medium' : 'text-thca-white'}`}>
    <span className="text-base font-semibold">{rating.toFixed(1)}</span>
    <span className="text-xs ml-1">/10</span>
  </div>
);

export default LeaderboardSection; 