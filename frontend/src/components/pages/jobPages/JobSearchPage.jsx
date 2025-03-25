import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaSignOutAlt, FaArrowRight, FaFilter, FaTimes } from 'react-icons/fa';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const JobSearchPage = () => {
    const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    experience: '',
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
//   console.log(selectedJob);
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl+'/job/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const mappedJobs = response.data.map(job => ({
        id: job._id,
        title: job.title,
        company: job.company || 'Unnamed Company',
        location: job.location || 'Not specified',
        type: job.type || 'Not specified', // Remote, On-site, Hybrid
        employmentType: job.employmentType || 'Not specified', // Full-time, Part-time, Contract
        salary: job.salaryRange || 'Not specified',
        experience: job.experienceLevel || 'Not specified',
        category: job.category || 'Not specified',
        posted: new Date(job.createdAt).toLocaleDateString(),
        description: job.description || 'No description provided',
        requirements: job.requirements || 'No requirements specified'
      }));
      setJobs(mappedJobs);
      setFilteredJobs(mappedJobs); // Initially show all jobs
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    applyFilters({ [name]: value }); // Apply filters immediately with updated value
  };

  const applyFilters = (updatedFilter = {}) => {
    const currentFilters = { ...filters, ...updatedFilter };
    const filtered = jobs.filter(job => {
      const matchesQuery =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilters =
        (!currentFilters.jobType || job.employmentType.toLowerCase() === currentFilters.jobType.toLowerCase()) &&
        (!currentFilters.location || job.location.toLowerCase().includes(currentFilters.location.toLowerCase())) &&
        (!currentFilters.experience || job.experience.toLowerCase() === currentFilters.experience.toLowerCase());
      return matchesQuery && matchesFilters;
    });
    setFilteredJobs(filtered);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl shadow-md animate-fade-in">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Job title, category, company, location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-md"
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </div>
        </form>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`md:block ${isFilterOpen ? 'block' : 'hidden'} bg-white p-6 rounded-xl shadow-md animate-slide-in md:animate-none transition-all duration-300`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
            <button onClick={() => setIsFilterOpen(false)} className="md:hidden text-gray-600 hover:text-gray-800">
              <FaTimes />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
              >
                <option value="">All</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
              >
                <option value="">All</option>
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">Job Listings</h2>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-all duration-300 flex items-center"
            >
              <FaFilter className="mr-2" /> Filters
            </button>
          </div>
          {loading ? (
            <p className="text-gray-600 text-center">Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p className="text-gray-600 text-center">No jobs found.</p>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleJobClick(job)}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-fade-in"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-1">{job.company} - {job.location}</p>
                  <p className="text-gray-500 mb-1">{job.employmentType} • {job.experience}</p>
                  <p className="text-gray-500 mb-3">{job.category}</p> {/* Add category */}
                  <p className="text-sm text-gray-400">Posted {job.posted}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-30 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in-fast">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full transform transition-all duration-300 scale-95 animate-modal-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedJob.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob.company} - {selectedJob.location}</p>
            <p className="text-gray-500 mb-2">{selectedJob.employmentType} • {selectedJob.experience}</p>
            <p className="text-gray-500 mb-6">{selectedJob.category}</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Job Description</h3>
            <p className="text-gray-700 mb-6">{selectedJob.description}</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Requirements</h3>
            <p className="text-gray-700 mb-6">{selectedJob.requirements}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedJob(null)}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
              >
                Close
              </button>
              <button
                onClick={() => navigate(`/jobapply/${selectedJob.id}`)}
               className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center">
                Apply Now <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default JobSearchPage;