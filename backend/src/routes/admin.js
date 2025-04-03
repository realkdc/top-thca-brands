const express = require('express');
const { 
  getUsers, 
  createUser, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require('../controllers/adminController.supabase');
const { protect, authorize } = require('../middleware/authMiddleware.supabase');

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.route('/users')
  .get(getUsers)
  .post(createUser);

router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router; 