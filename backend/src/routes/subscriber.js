const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe } = require('../controllers/subscriberController');

// POST /api/subscribe - Subscribe to newsletter
router.post('/', subscribe);

// GET /api/subscribe/unsubscribe - Unsubscribe from newsletter
router.get('/unsubscribe', unsubscribe);

module.exports = router; 