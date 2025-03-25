const { application } = require("express");
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, required: true 
  },
  employmentType: { 
    type: String, required: true 
  }, 
  salaryRange: { 
    type: String }
    , 
  experienceLevel: { 
    type: String 
  },
  description: { 
    type: String, required: true 
  },
  requirements: { 
    type: String, required: true 
  },
  location:{
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  application:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
      }
  ],
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
