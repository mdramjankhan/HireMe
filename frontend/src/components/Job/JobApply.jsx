import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaUpload, FaPaperPlane } from 'react-icons/fa';
import Footer from '../components/Footer';
import { Toaster, toast } from 'react-hot-toast';

const JobApplyPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasExistingResume, setHasExistingResume] = useState(false);
  const [hasApplied, setHasApplied] = useState(false); // New state to track if already applied
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchJobDetails();
    fetchUserProfile();
    checkIfApplied(); // Check if the user has already applied
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please log in to apply for this job.');
        setLoading(false);
        return;
      }

      const response = await axios.get(apiUrl+`/job/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const jobData = {
        id: response.data._id,
        title: response.data.title,
        company: response.data.company || 'Unnamed Company',
        location: response.data.location || 'Not specified',
        employmentType: response.data.employmentType || 'Not specified',
        experience: response.data.experienceLevel || 'Not specified',
        category: response.data.category || 'Not specified',
        description: response.data.description || 'No description provided',
        requirements: response.data.requirements || 'No requirements specified',
      };
      setJob(jobData);
    } catch (err) {
      console.error('Error fetching job details:', err);
      toast.error('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get(apiUrl+'/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const existingResume = response.data.profile.resume;
      if (existingResume) {
        setResumeUrl(existingResume);
        setHasExistingResume(true);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const checkIfApplied = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get(apiUrl+'/job/my-applications', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const appliedJobs = response.data;
      const isApplied = appliedJobs.some((app) => app.job?._id === jobId);
      setHasApplied(isApplied);
    } catch (err) {
      console.error('Error checking if already applied:', err);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setResume(file);

      const formData = new FormData();
      formData.append('resume', file);

      try {
        const token = localStorage.getItem('authToken');
        const uploadToast = toast.loading('Uploading resume...');
        const response = await axios.post(apiUrl+'/auth/upload-resume', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setResumeUrl(response.data.url);
        setHasExistingResume(true);
        toast.success('Resume uploaded successfully!', { id: uploadToast });
        console.log('Resume uploaded successfully:', response.data.url);
      } catch (err) {
        console.error('Error uploading resume:', err.response?.data || err.message);
        toast.error(err.response?.data?.message || 'Failed to upload resume. Please try again.');
        setResume(null);
        setResumeUrl('');
      }
    } else {
      toast.error('Please upload a valid resume file (PDF or Word format).');
      setResume(null);
      setResumeUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasApplied) {
      toast.error('You have already applied for this job.');
      return;
    }

    if (!resumeUrl) {
      toast.error('Please upload your resume or ensure one is already uploaded.');
      return;
    }

    const applicationData = {
      jobId,
      coverLetter,
      resume: resumeUrl,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please log in to apply.');
        setLoading(false);
        return;
      }

      const submitToast = toast.loading('Submitting application...'); // Only show if not applied
      await axios.post(apiUrl+`/job/apply`, applicationData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Application submitted successfully!', { id: submitToast });
      setHasApplied(true); // Update state to reflect application
      setResume(null);
      setCoverLetter('');
      setTimeout(() => navigate('/jobs'), 2000);
    } catch (err) {
      console.error('Error submitting application:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* <Toaster position="top-right" /> Ensure Toaster is included */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-all duration-300"
        >
          <FaArrowLeft className="mr-2" /> Back to Job Search
        </button>

        {loading && !job ? (
          <p className="text-gray-600 text-center">Loading job details...</p>
        ) : job ? (
          <div className="bg-white p-8 rounded-xl shadow-md mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
            <p className="text-gray-600 mb-2">{job.company} - {job.location}</p>
            <p className="text-gray-500 mb-2">{job.employmentType} • {job.experience}</p>
            <p className="text-gray-500 mb-6">{job.category}</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Description</h2>
            <p className="text-gray-700 mb-6">{job.description}</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Requirements</h2>
            <p className="text-gray-700 mb-6">{job.requirements}</p>
          </div>
        ) : null}

        <div className="bg-white p-8 rounded-xl shadow-md animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for this Job</h2>
          {hasApplied ? (
            <p className="text-green-600 font-semibold mb-4">You have already applied for this job.</p>
          ) : null}
          {hasExistingResume && !resume && (
            <p className="text-gray-600 mb-4">Using previously uploaded resume: {resumeUrl.split('/').pop()}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (In PDF) {hasExistingResume ? '(Optional - Replace Existing)' : ''}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={loading || hasApplied} // Disable if already applied
                />
                <label
                  htmlFor="resume-upload"
                  className={`bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300 flex items-center cursor-pointer ${loading || hasApplied ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FaUpload className="mr-2" /> Choose File
                </label>
                <span className="text-gray-600">{resume ? resume.name : 'No new file chosen'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter (Optional)</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write a brief cover letter..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                rows="5"
                disabled={loading || hasApplied} // Disable if already applied
              />
            </div>
            <button
              type="submit"
              disabled={loading || hasApplied} // Disable button if already applied
              className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center ${loading || hasApplied ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {hasApplied ? 'Already Applied' : loading ? 'Submitting...' : <>Submit Application <FaPaperPlane className="ml-2" /></>}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobApplyPage;