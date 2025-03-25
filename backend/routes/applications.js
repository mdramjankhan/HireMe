const express = require('express');
const { applyJob, getApplications, shortlistApplication, deleteApplication } = require('../controllers/applicationController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/apply/:jobId', authMiddleware, roleMiddleware('jobseeker'), applyJob);
router.get('/:jobId', authMiddleware, roleMiddleware('employer'), getApplications);
router.put('/:id/shortlist', authMiddleware, roleMiddleware('employer'), shortlistApplication);
router.delete('/applications/:id', authMiddleware, roleMiddleware('employer'), deleteApplication);
module.exports = router;