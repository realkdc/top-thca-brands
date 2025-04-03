const express = require('express');
const { 
  submitContactForm, 
  getContactSubmissions, 
  getContactById, 
  updateContactStatus, 
  deleteContact 
} = require('../controllers/contactController.supabase');
const { protect, authorize } = require('../middleware/authMiddleware.supabase');

const router = express.Router();

// Public routes
router.post('/', submitContactForm);

// Protected routes - admin only
router.get('/', protect, authorize('admin'), getContactSubmissions);
router.get('/:id', protect, authorize('admin'), getContactById);
router.put('/:id', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContact);

module.exports = router; 