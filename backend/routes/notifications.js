const express = require('express');
const { getNotifications, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.put('/:id/read', authMiddleware, markAsRead);
router.delete('/:id', authMiddleware, deleteNotification);

module.exports = router;