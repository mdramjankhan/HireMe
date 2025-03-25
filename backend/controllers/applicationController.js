const Application = require('../models/Application');
const Job = require('../models/Job');
const { createNotification } = require('./notificationController');

const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;
    const applicantId = req.user.id;

    if (!jobId || !resume) {
      return res.status(400).json({ message: 'Job ID and resume are required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({ job: jobId, applicant: applicantId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: applicantId,
      resume,
      coverLetter,
    });
    await application.save();

    await Job.findByIdAndUpdate(jobId, { $push: { application: application._id } });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name profile'); 
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(400).json({ message: error.message });
  }
};


const getMyApplications = async (req, res) => {
  try {
    const applicantId = req.user.id;
    const applications = await Application.find({ applicant: applicantId })
      .populate('job', 'title company location');

    const validApplications = applications.filter(app => app.job !== null);

    res.json(validApplications);
  } catch (error) {
    console.error('Error fetching my applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const shortlistApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = 'shortlisted';
    await application.save();

    await createNotification(
      application.applicant,
      'You have been shortlisted for a job!',
      'shortlist',
      application._id,
      'Application'
    );
    req.io.emit(`shortlist_${application.applicant}`, {
      message: 'You have been shortlisted',
      applicationId: application._id,
    });

    res.json(application);
  } catch (error) {
    console.error('Error shortlisting application:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const job = await Job.findById(application.job);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await Application.findByIdAndDelete(applicationId);
    job.application = job.application.filter(app => app.toString() !== applicationId);
    await job.save();

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { applyJob, getApplications, shortlistApplication, getMyApplications, deleteApplication };