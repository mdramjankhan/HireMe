const express = require('express');
const {
    createJob, getJobs, updateJob, deleteJob, getJobsByEmployer,
    getJobById, shortlistApplication, rejectApplication
} = require('../controllers/jobController');
const { getMyApplications } = require('../controllers/applicationController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('employer'), createJob);
router.get('/', getJobs);
router.put('/:id', authMiddleware, roleMiddleware('employer'), updateJob);
router.delete('/:id', authMiddleware, roleMiddleware('employer'), deleteJob);
router.get('/employer/jobs', authMiddleware, roleMiddleware('employer'), getJobsByEmployer);
router.get('/:id', authMiddleware, roleMiddleware('jobseeker'), getJobById);
router.put('/applications/:applicationId/shortlist', authMiddleware, roleMiddleware('employer'), shortlistApplication);
router.put('/applications/:applicationId/reject', authMiddleware, roleMiddleware('employer'), rejectApplication);
router.get('/my-applications', authMiddleware, roleMiddleware('jobseeker'), getMyApplications);

module.exports = router;