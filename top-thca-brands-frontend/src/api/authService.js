import axiosInstance from './axiosConfig';

// Login user
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    
    if (response.data.token) {
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user - clear localStorage
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Register user (only used by admins when creating new users)
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await axiosInstance.put('/auth/profile', userData);
    
    if (response.data.token) {
      // Update token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get current user from localStorage
export const getCurrentUserFromStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUserFromStorage();
  return user && user.role === 'admin';
}; 