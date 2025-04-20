const express = require('express');
const { 
  getLeaderboard, 
  rateBrand, 
  getBrandLists, 
  voteOnListItem 
} = require('../controllers/leaderboardController');

const router = express.Router();

// Public routes
router.get('/', getLeaderboard);
router.get('/lists', getBrandLists);
router.post('/brands/:id/rate', rateBrand);
router.post('/lists/:listId/items/:itemId/vote', voteOnListItem);

module.exports = router; 