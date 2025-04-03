const express = require('express');
const { 
  getBrands, 
  getBrandBySlug, 
  createBrand, 
  updateBrand, 
  deleteBrand,
  updateBrandOrder
} = require('../controllers/brandController.supabase');
const { protect, authorize } = require('../middleware/authMiddleware.supabase');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getBrands);
router.get('/:slug', getBrandBySlug);

// Protected routes - admin only
router.post('/', protect, authorize('admin', 'editor'), upload.single('image'), createBrand);
router.put('/:id', protect, authorize('admin', 'editor'), upload.single('image'), updateBrand);
router.delete('/:id', protect, authorize('admin'), deleteBrand);
router.put('/reorder', protect, authorize('admin', 'editor'), updateBrandOrder);

module.exports = router; 