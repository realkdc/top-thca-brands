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
            <div className="lg:hidden grid grid-cols-1 gap-5">
              {sortedBrands.map((brand, index) => (
                <div
                  key={brand._id}
                  className="rounded-2xl border border-thca-grey/25 bg-gradient-to-br from-[#1a1c22] via-[#16181d] to-[#111217] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex flex-1 items-center">
                      <span
                        className={`mr-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                          index < 3
                            ? "bg-thca-gold text-thca-black"
                            : "bg-thca-grey/20 text-thca-white"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="mr-3 h-12 w-12 overflow-hidden rounded-full border border-thca-grey/30">
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/40?text=Brand";
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-thca-white">
                          {brand.name}
                        </div>
                        <div className="text-xs uppercase tracking-[0.3em] text-thca-white/40">
                          {brand.totalRatings} rating
                          {brand.totalRatings !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => openRatingModal(brand)}
                      className="inline-flex items-center gap-1 rounded-full border border-thca-gold/30 bg-thca-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-thca-gold transition hover:bg-thca-gold/20"
                    >
                      Rate
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <MobileMetric
                      label="Potency"
                      value={brand.ratings.potency}
                      highlight={sortCriteria === "potency"}
                    />
                    <MobileMetric
                      label="Flavor"
                      value={brand.ratings.flavor}
                      highlight={sortCriteria === "flavor"}
                    />
                    <MobileMetric
                      label="Effects"
                      value={brand.ratings.effects}
                      highlight={sortCriteria === "effects"}
                    />
                    <MobileMetric
                      label="Value"
                      value={brand.ratings.value}
                      highlight={sortCriteria === "value"}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-thca-gold/30 bg-thca-gold/10 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-thca-white/50">
                        Overall
                      </p>
                      <RatingDisplay
                        rating={brand.ratings.overall}
                        highlight={sortCriteria === "overall"}
                      />
                    </div>
                    <button
                      onClick={() => openRatingModal(brand)}
                      className="inline-flex items-center justify-center rounded-full bg-thca-gold px-4 py-2 text-sm font-semibold text-thca-black transition hover:bg-thca-gold/90"
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

const MobileMetric = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight: boolean;
}) => (
  <div className="rounded-xl border border-thca-grey/25 bg-white/5 px-3 py-3 backdrop-blur">
    <p className="text-xs uppercase tracking-[0.25em] text-thca-white/45">
      {label}
    </p>
    <RatingDisplay rating={value} highlight={highlight} />
  </div>
);

export default LeaderboardSection; 