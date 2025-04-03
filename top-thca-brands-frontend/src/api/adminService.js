import axiosInstance from './axiosConfig';

// Get all users (admin only)
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new user (admin only)
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user by ID (admin only)
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user (admin only)
export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete user (admin only)
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 