const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['jobseeker', 'employer', 'admin'], required: true },
  profile: {
    skills: [{ type: String }],
    education: [{
      institution: String,
      degree: String,
      startDate: Date,
      endDate: Date,
    }],
    dob: { type: Date },
    phoneNumber: { type: String },
    about: { type: String },
    resume: { type: String },
    companyName: { type: String }, 
    companyDescription: { type: String },
  },
  jobsPosted: { type: Number, default: 0 },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);