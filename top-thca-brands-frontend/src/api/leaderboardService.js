import axiosInstance from './axiosConfig';
import supabase from './supabaseClient';

// Get leaderboard data
export const getLeaderboard = async () => {
  try {
    // Try to get leaderboard view first (if it exists with real data)
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('brand_leaderboard')
      .select('*');
    
    if (!leaderboardError && Array.isArray(leaderboardData) && leaderboardData.length > 0) {
      console.log('Using real leaderboard data');
      return leaderboardData;
    }

    // Try to get real ratings and compute leaderboard
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('brand_ratings')
      .select('brand_id, potency_rating, flavor_rating, effects_rating, value_rating, overall_rating');

    if (!ratingsError && Array.isArray(ratingsData) && ratingsData.length > 0) {
      console.log('Computing leaderboard from real ratings');
      
      // Get brands and compute averages from real ratings
      const { data: brands } = await supabase
        .from('brands')
        .select('id,name,logo,description,website_url')
        .eq('is_active', true);

      return (brands || []).map((brand) => {
        const brandRatings = ratingsData.filter(r => r.brand_id === brand.id);
        const totalRatings = brandRatings.length;
        
        if (totalRatings === 0) {
          // No ratings yet, use defaults
          return {
            _id: brand.id,
            name: brand.name,
            image: brand.logo,
            description: brand.description,
            website: brand.website_url,
            ratings: {
              potency: 4.2,
              flavor: 4.3,
              effects: 4.4,
              value: 4.1,
              overall: 4.5
            },
            totalRatings: 0,
          };
        }

        // Calculate averages from real ratings
        const avgRatings = brandRatings.reduce((acc, rating) => ({
          potency: acc.potency + (rating.potency_rating || 0),
          flavor: acc.flavor + (rating.flavor_rating || 0),
          effects: acc.effects + (rating.effects_rating || 0),
          value: acc.value + (rating.value_rating || 0),
          overall: acc.overall + (rating.overall_rating || 0),
        }), { potency: 0, flavor: 0, effects: 0, value: 0, overall: 0 });

        return {
          _id: brand.id,
          name: brand.name,
          image: brand.logo,
          description: brand.description,
          website: brand.website_url,
          ratings: {
            potency: Math.round((avgRatings.potency / totalRatings) * 10) / 10,
            flavor: Math.round((avgRatings.flavor / totalRatings) * 10) / 10,
            effects: Math.round((avgRatings.effects / totalRatings) * 10) / 10,
            value: Math.round((avgRatings.value / totalRatings) * 10) / 10,
            overall: Math.round((avgRatings.overall / totalRatings) * 10) / 10,
          },
          totalRatings: totalRatings,
        };
      });
    }

    // Fallback: brands with mock ratings (current state)
    console.log('Using mock ratings - no real rating data yet');
    const { data: brands } = await supabase
      .from('brands')
      .select('id,name,logo,description,website_url')
      .eq('is_active', true);
      
    return (brands || []).map((b, index) => ({
      _id: b.id,
      name: b.name,
      image: b.logo,
      description: b.description,
      website: b.website_url,
      ratings: {
        potency: 4.2,
        flavor: 4.3,
        effects: 4.4,
        value: 4.1,
        overall: 4.5
      },
      totalRatings: 25 + Math.floor(Math.random() * 100),
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    // Final fallback to backend
    try {
      const response = await axiosInstance.get('/leaderboard');
      return response.data;
    } catch (e) {
      console.error('Backend fallback also failed:', e);
      return [];
    }
  }
};

// Rate a brand
export const rateBrand = async (brandId, ratingData) => {
  try {
    // Convert from frontend property names to backend expected names
    // Also ensure all values are numbers
    const backendRatingData = {
      potency_rating: Number(ratingData.potency),
      flavor_rating: Number(ratingData.flavor),
      effects_rating: Number(ratingData.effects),
      value_rating: Number(ratingData.value),
      overall_rating: Number(ratingData.overall),
      comment: ratingData.comment || ''
    };
    
    console.log('Sending rating data:', backendRatingData);
    
    const response = await axiosInstance.post(`/leaderboard/brands/${brandId}/rate`, backendRatingData);
    return response.data;
  } catch (error) {
    console.error('Error rating brand:', error);
    throw error;
  }
};

// Get brand lists
export const getBrandLists = async () => {
  try {
    const response = await axiosInstance.get('/leaderboard/lists');
    return response.data;
  } catch (error) {
    console.error('Error fetching brand lists:', error);
    throw error;
  }
};

// Vote on a brand in a list
export const voteOnListItem = async (listId, itemId, vote) => {
  try {
    const response = await axiosInstance.post(`/leaderboard/lists/${listId}/items/${itemId}/vote`, { vote });
    return response.data;
  } catch (error) {
    console.error('Error voting on list item:', error);
    throw error;
  }
}; 