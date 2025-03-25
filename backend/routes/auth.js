const express = require('express');
const { register, login, getProfile, updateProfile, uploadResume } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
// Upload resume (for job seekers)
router.post('/upload-resume', authMiddleware, upload.single('resume'), uploadResume);

module.exports = router;