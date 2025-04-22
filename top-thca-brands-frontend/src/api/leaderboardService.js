import axiosInstance from './axiosConfig';

// Get leaderboard data
export const getLeaderboard = async () => {
  try {
    const response = await axiosInstance.get('/leaderboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
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