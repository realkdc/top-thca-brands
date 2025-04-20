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
    const response = await axiosInstance.post(`/leaderboard/brands/${brandId}/rate`, ratingData);
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