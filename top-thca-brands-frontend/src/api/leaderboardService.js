import axiosInstance from './axiosConfig';
import supabase from './supabaseClient';

const toNumber = (value, fallback = 0) => {
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const clampRating = (value) => {
  const num = toNumber(value, 0);
  if (!Number.isFinite(num)) return 0;
  return Math.min(10, Math.max(0, num));
};

const normaliseProductTypes = (productTypes) => {
  if (Array.isArray(productTypes)) return productTypes;
  if (typeof productTypes === 'string') {
    return productTypes
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const mapLeaderboardBrand = (brand) => {
  const ratingsSource =
    brand.ratings ||
    {
      potency: brand.potency,
      flavor: brand.flavor,
      effects: brand.effects,
      value: brand.value,
      overall: brand.overall,
      avg_potency: brand.avg_potency,
      avg_flavor: brand.avg_flavor,
      avg_effects: brand.avg_effects,
      avg_value: brand.avg_value,
      avg_overall: brand.avg_overall,
      potency_rating: brand.potency_rating,
      flavor_rating: brand.flavor_rating,
      effects_rating: brand.effects_rating,
      value_rating: brand.value_rating,
      overall_rating: brand.overall_rating,
    };

  const resolveRating = (keys) => {
    for (const key of keys) {
      if (ratingsSource && ratingsSource[key] !== undefined && ratingsSource[key] !== null) {
        return clampRating(ratingsSource[key]);
      }
    }
    return 0;
  };

  return {
    _id: brand._id || brand.id || brand.brand_id || '',
    name: brand.name || '',
    image: brand.image || brand.logo || brand.logo_url || '',
    description: brand.description || '',
    website: brand.website || brand.website_url || '',
    productTypes: normaliseProductTypes(brand.productTypes || brand.product_types),
    ratings: {
      potency: resolveRating(['potency', 'avg_potency', 'potency_rating']),
      flavor: resolveRating(['flavor', 'avg_flavor', 'flavor_rating']),
      effects: resolveRating(['effects', 'avg_effects', 'effects_rating']),
      value: resolveRating(['value', 'avg_value', 'value_rating']),
      overall: resolveRating(['overall', 'avg_overall', 'overall_rating', 'rating']),
    },
    totalRatings: Math.max(
      0,
      Math.round(
        toNumber(
          brand.totalRatings ??
            brand.total_ratings ??
            brand.total_votes ??
            brand.rating_count ??
            brand.totalVotes,
          0,
        ),
      ),
    ),
  };
};

const extractPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.leaderboard)) return payload.leaderboard;
  return [];
};

// Get leaderboard data
export const getLeaderboard = async () => {
  try {
    const { data, error } = await supabase
      .from('brand_leaderboard')
      .select('*')
      .order('avg_overall', { ascending: false });

    if (error) throw error;

    return (data || []).map(mapLeaderboardBrand);
  } catch (supabaseError) {
    console.warn('Supabase leaderboard fetch failed, falling back to API:', supabaseError);

    try {
      const response = await axiosInstance.get('/leaderboard');
      const payload = extractPayload(response.data);
      return payload.map(mapLeaderboardBrand);
    } catch (apiError) {
      console.error('Error fetching leaderboard from API:', apiError);
      throw apiError;
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