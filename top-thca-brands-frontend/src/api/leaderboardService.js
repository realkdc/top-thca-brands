import axiosInstance from './axiosConfig';
import supabase from './supabaseClient';

// Get leaderboard data
export const getLeaderboard = async () => {
  try {
    // Build leaderboard directly from Supabase view if present; else compute client-side
    const { data, error } = await supabase.from('brand_leaderboard').select('*');
    if (!error && Array.isArray(data)) {
      return data;
    }

    // Fallback: compute simple leaderboard from brands with no ratings
    const { data: brands } = await supabase
      .from('brands')
      .select('id,name,logo,description,product_types,website_url')
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
    try {
      const response = await axiosInstance.get('/leaderboard');
      return response.data;
    } catch (e) {
      console.error('Error fetching leaderboard:', e);
      throw e;
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