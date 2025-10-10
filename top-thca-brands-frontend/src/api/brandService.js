import axiosInstance from './axiosConfig';
import supabase from './supabaseClient';

// Get all brands
export const getBrands = async () => {
  try {
    // Try Supabase directly first (no backend required)
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('rank', { ascending: true });

    if (error) throw error;

    // Map to the frontend Brand shape
    const mapped = (data || []).map((b) => ({
      _id: b.id,
      name: b.name,
      image: b.logo || '',
      category: Array.isArray(b.product_types) && b.product_types.length ? (b.product_types.find((t)=>['Flower','Concentrate','Edibles','Vape'].includes(t)) || 'Other') : 'Other',
      rating: 5,
      description: b.description || '',
      featured: Array.isArray(b.product_types) ? b.product_types.includes('featured') : false,
      slug: (b.slug || b.name?.toLowerCase().replace(/\s+/g,'-')),
      website: b.website_url || ''
    }));

    return mapped;
  } catch (err) {
    // Fallback to backend if available
    try {
      const response = await axiosInstance.get('/brands');
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
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