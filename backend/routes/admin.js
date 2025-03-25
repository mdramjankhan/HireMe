const express = require('express');
const {
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  getAllJobs,
  deleteJob,
  approveJob,
  rejectJob,
} = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/users', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser);
router.put('/users/:id/status', authMiddleware, roleMiddleware('admin'), toggleUserStatus);
router.get('/jobs', authMiddleware, roleMiddleware('admin'), getAllJobs);
router.delete('/jobs/:id', authMiddleware, roleMiddleware('admin'), deleteJob);
router.put('/jobs/:id/approve', authMiddleware, roleMiddleware('admin'), approveJob);
router.put('/jobs/:id/reject', authMiddleware, roleMiddleware('admin'), rejectJob);

module.exports = router;