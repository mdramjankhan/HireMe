const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { uploadToCloudinary } = require('../utils/fileUploader');


const register = async (req, res) => {
  const { email, password, role, name } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered. Please log in or use a different email.' });
    }

    const user = new User({ email, password, role, name });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name }, message:"User registered Successfully!" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already registered. Please log in or use a different email.' });
    }
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role },message:"User logged in Successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      name:user.name,
      profile: {
        skills: user.profile.skills || [],
        education: user.profile.education || [],
        dob: user.profile.dob || null,
        phoneNumber: user.profile.phoneNumber || '',
        about: user.profile.about || '',
        resume: user.profile.resume || '',
        companyName: user.profile.companyName || '',
        companyDescription: user.profile.companyDescription || '',
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { role } = req.user; 
    const updates = req.body;

    if (role === 'employer') {
      const allowedFields = [
        'name',
        'email',
        'profile.companyName',
        'profile.about',
        'profile.companyDescription'
      ];
      for (const key in updates) {
        if (!allowedFields.includes(key)) {
          return res.status(400).json({ message: `Field '${key}' is not allowed for employers.` });
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      profile: {
        skills: user.profile.skills || [],
        education: user.profile.education || [],
        dob: user.profile.dob || null,
        phoneNumber: user.profile.phoneNumber || '',
        about: user.profile.about || '',
        resume: user.profile.resume || '',
        companyName: user.profile.companyName || '',
        companyDescription: user.profile.companyDescription || '',
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const uploadResume = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'jobseeker') {
      return res.status(403).json({ message: 'Only job seekers can upload resumes.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)) {
      return res.status(400).json({ message: 'Only PDF and DOCX files are allowed.' });
    }

    const result = await uploadToCloudinary(fileBuffer, 'resumes', {
      public_id: `${req.user.id}_${Date.now()}`,
      overwrite: true,
      resource_type: 'raw'
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 'profile.resume': result.secure_url },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Resume uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: 'Failed to upload resume: ' + error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, uploadResume };