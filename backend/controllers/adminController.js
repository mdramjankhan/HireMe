const User = require('../models/User');
const Job = require('../models/Job');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(400).json({ message: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();
    res.json({ message: `User ${user.status === 'active' ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(400).json({ message: error.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'profile.companyName');
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(400).json({ message: error.message });
  }
};

const approveJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job approved', job });
  } catch (error) {
    console.error('Error approving job:', error);
    res.status(400).json({ message: error.message });
  }
};

const rejectJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job rejected', job });
  } catch (error) {
    console.error('Error rejecting job:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  getAllJobs,
  deleteJob,
  approveJob,
  rejectJob,
};