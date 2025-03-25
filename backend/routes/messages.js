const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markMessageAsRead, deleteMessage } = require('../controllers/messageController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, roleMiddleware('employer'), sendMessage);
router.get('/', authMiddleware, roleMiddleware('jobseeker'), getMessages);
router.put('/:id/read', authMiddleware, roleMiddleware('jobseeker'), markMessageAsRead);
router.delete('/:id', authMiddleware, deleteMessage);

module.exports = router;