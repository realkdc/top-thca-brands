const express = require('express');
const { 
  submitContact, 
  getContacts, 
  getContactById, 
  updateContactStatus, 
  deleteContact 
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', submitContact);

// Protected routes - admin only
router.get('/', protect, authorize('admin'), getContacts);
router.get('/:id', protect, authorize('admin'), getContactById);
router.put('/:id', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContact);

module.exports = router; 