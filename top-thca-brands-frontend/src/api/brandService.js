import axiosInstance from './axiosConfig';

// Get all brands
export const getBrands = async () => {
  try {
    const response = await axiosInstance.get('/brands');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get brand by slug
export const getBrandBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/brands/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Services - require authentication

// Create new brand (requires auth)
export const createBrand = async (brandData) => {
  try {
    // Use FormData to handle file uploads
    const formData = new FormData();
    
    // Append text fields
    Object.keys(brandData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, brandData[key]);
      }
    });
    
    // Append image file
    if (brandData.image) {
      formData.append('image', brandData.image);
    }
    
    const response = await axiosInstance.post('/brands', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update brand (requires auth)
export const updateBrand = async (id, brandData) => {
  try {
    // Use FormData to handle file uploads
    const formData = new FormData();
    
    // Append text fields
    Object.keys(brandData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, brandData[key]);
      }
    });
    
    // Append image file if it exists
    if (brandData.image && brandData.image instanceof File) {
      formData.append('image', brandData.image);
    }
    
    const response = await axiosInstance.put(`/brands/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete brand (requires auth)
export const deleteBrand = async (id) => {
  try {
    const response = await axiosInstance.delete(`/brands/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update brand order (requires auth)
export const updateBrandOrder = async (brandOrders) => {
  try {
    const response = await axiosInstance.put('/brands/reorder', { brandOrders });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 