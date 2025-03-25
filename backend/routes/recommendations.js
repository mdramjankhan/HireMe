const express = require('express');
const { getRecommendations } = require('../controllers/recommendationController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('jobseeker'), getRecommendations);

module.exports = router;