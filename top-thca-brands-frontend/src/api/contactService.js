import axiosInstance from './axiosConfig';

// Submit contact form
export const submitContact = async (contactData) => {
  try {
    const response = await axiosInstance.post('/contact', contactData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Services - require authentication

// Get all contact submissions (requires auth)
export const getContacts = async () => {
  try {
    const response = await axiosInstance.get('/contact');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get contact by ID (requires auth)
export const getContactById = async (id) => {
  try {
    const response = await axiosInstance.get(`/contact/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update contact status (requires auth)
export const updateContactStatus = async (id, statusData) => {
  try {
    const response = await axiosInstance.put(`/contact/${id}`, statusData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete contact (requires auth)
export const deleteContact = async (id) => {
  try {
    const response = await axiosInstance.delete(`/contact/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 