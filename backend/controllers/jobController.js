const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

const createJob = async (req, res) => {
    try {
        const jobData = { ...req.body, employer: req.user.id };
        const job = new Job(jobData);
        await job.save();

        await User.findByIdAndUpdate(req.user.id, { $inc: { jobsPosted: 1 } });
        res.status(201).json({ message: 'Job created successfully', job });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(400).json({ message: error.message });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'approved' });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(400).json({ message: error.message });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        console.error('Error fetching job by ID:', error);
        res.status(400).json({ message: error.message });
    }
};

const getJobsByEmployer = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs by employer:', error);
        res.status(400).json({ message: error.message });
    }
};

const updateJob = async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, employer: req.user.id },
            req.body,
            { new: true }
        );
        if (!job) return res.status(404).json({ message: 'Job not found or not authorized' });
        res.json(job);
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(400).json({ message: error.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user.id });
        if (!job) return res.status(404).json({ message: 'Job not found' });

        await Application.deleteMany({ job: req.params.id });

        await User.findByIdAndUpdate(req.user.id, { $inc: { jobsPosted: -1 } });
        res.json({ message: 'Job deleted' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(400).json({ message: error.message });
    }
};

const shortlistApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.applicationId,
            { status: 'shortlisted' },
            { new: true }
        );
        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.json(application);
    } catch (error) {
        console.error('Error shortlisting application:', error);
        res.status(400).json({ message: error.message });
    }
};

const rejectApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.applicationId,
            { status: 'rejected' },
            { new: true }
        );
        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.json(application);
    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createJob,
    getJobs,
    updateJob,
    deleteJob,
    getJobsByEmployer,
    getJobById,
    shortlistApplication,
    rejectApplication,
};