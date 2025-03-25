import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSignOutAlt, FaBriefcase, FaUsers, FaEnvelope, FaChartLine, FaTrash, FaPlus, FaTimes, FaCheck, FaBan } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const EmployerDashboard = () => {
    const [companyName, setCompanyName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [jobType, setJobType] = useState('On-site');
    const [employmentType, setEmploymentType] = useState('Full-time');
    const [salaryRange, setSalaryRange] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('Entry-level');
    const [requirements, setRequirements] = useState('');
    const [category, setCategory] = useState('');
    const [postedJobs, setPostedJobs] = useState([]);
    const [allApplicants, setAllApplicants] = useState([]);
    const [visibleJobs, setVisibleJobs] = useState(10);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [applicantModalOpen, setApplicantModalOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL;


    useEffect(() => {
        fetchEmployerData();
        fetchPostedJobs();
        fetchAllApplicants();
    }, []);

    const fetchEmployerData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get(`${apiUrl}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setCompanyName(response.data.profile.companyName || '');
        } catch (error) {
            console.error('Error fetching employer profile:', error);
            setCompanyName('');
        }
    };

    const fetchPostedJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/job/employer/jobs`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            });
            const mappedJobs = response.data.map(job => ({
                id: job._id,
                title: job.title,
                location: job.location || 'Not specified',
                applicants: job.application ? job.application.length : 0,
                status: job.status,
                company: job.company,
                type: job.type,
                employmentType: job.employmentType,
                salaryRange: job.salaryRange || 'Not specified',
                experienceLevel: job.experienceLevel || 'Not specified',
                description: job.description,
                requirements: job.requirements,
                category: job.category || 'Not specified',
                createdAt: job.createdAt,
            }));
            setPostedJobs(mappedJobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setPostedJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllApplicants = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const jobsResponse = await axios.get(`${apiUrl}/job/employer/jobs`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const applicantPromises = jobsResponse.data.map(job =>
                axios.get(`${apiUrl}/job/${job._id}/applications`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                })
            );
            const applicantResponses = await Promise.all(applicantPromises);
            const allApplicantsData = applicantResponses.flatMap((response, index) =>
                response.data.map(app => ({
                    id: app._id,
                    name: app.applicant.name || 'Unknown Applicant',
                    applicantId: app.applicant._id,
                    jobTitle: jobsResponse.data[index].title,
                    status: app.status,
                    resume: app.resume,
                    appliedDate: new Date(app.createdAt).toLocaleDateString(),
                    skills: app.applicant.profile?.skills || [],
                    education: app.applicant.profile?.education || [],
                    dob: app.applicant.profile?.dob || null,
                    phoneNumber: app.applicant.profile?.phoneNumber || '',
                    about: app.applicant.profile?.about || '',
                }))
            );
            setAllApplicants(allApplicantsData);
        } catch (error) {
            console.error('Error fetching all applicants:', error);
            setAllApplicants([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        setLoading(true);

        const jobData = {
            title: jobTitle,
            company: companyName || 'Unnamed Company',
            type: jobType,
            employmentType,
            salaryRange,
            experienceLevel,
            description: jobDescription,
            requirements,
            location: jobLocation,
            category,
        };

        try {
            const response = await axios.post(`${apiUrl}/job`, jobData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            });
            resetForm();
            setModalOpen(false);
            await fetchPostedJobs();
            await fetchAllApplicants();
            toast.success(response.data.message || 'Job posted successfully!');
        } catch (error) {
            console.error('Error posting job:', error);
            toast.error(error.response?.data?.message || 'Failed to post job.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        try {
            await axios.delete(`${apiUrl}/job/${jobId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            });
            setPostedJobs(postedJobs.filter(job => job.id !== jobId));
            await fetchAllApplicants(); // Refresh applicants after deletion
            toast.success('Job deleted successfully!');
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error(error.response?.data?.message || 'Failed to delete job.');
        }
    };

    const handleDeleteApplicant = async (applicationId) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;

        try {
            await axios.delete(`${apiUrl}/job/applications/${applicationId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            });
            setAllApplicants(allApplicants.filter(app => app.id !== applicationId));
            setApplicantModalOpen(false);
            await fetchPostedJobs();
            toast.success('Application deleted successfully!');
        } catch (error) {
            console.error('Error deleting application:', error);
            toast.error(error.response?.data?.message || 'Failed to delete application.');
        }
    };

    const handleShortlistApplicant = async (applicationId) => {
        try {
            await axios.put(`${apiUrl}/job/applications/${applicationId}/shortlist`, {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            });
            setAllApplicants(allApplicants.map(app =>
                app.id === applicationId ? { ...app, status: 'shortlisted' } : app
            ));
            if (selectedApplicant && selectedApplicant.id === applicationId) {
                setSelectedApplicant({ ...selectedApplicant, status: 'shortlisted' });
            }
            toast.success('Applicant shortlisted!');
        } catch (error) {
            console.error('Error shortlisting applicant:', error);
            toast.error(error.response?.data?.message || 'Failed to shortlist applicant.');
        }
    };

    const handleRejectApplicant = async (applicationId) => {
        try {
            await axios.put(`${apiUrl}/job/applications/${applicationId}/reject`, {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            });
            setAllApplicants(allApplicants.map(app =>
                app.id === applicationId ? { ...app, status: 'rejected' } : app
            ));
            if (selectedApplicant && selectedApplicant.id === applicationId) {
                setSelectedApplicant({ ...selectedApplicant, status: 'rejected' });
            }
            toast.success('Applicant rejected!');
        } catch (error) {
            console.error('Error rejecting applicant:', error);
            toast.error(error.response?.data?.message || 'Failed to reject applicant.');
        }
    };

    const resetForm = () => {
        setJobTitle('');
        setJobDescription('');
        setJobLocation('');
        setJobType('On-site');
        setEmploymentType('Full-time');
        setSalaryRange('');
        setExperienceLevel('Entry-level');
        setRequirements('');
        setCategory('');
    };

    const handleShowMore = () => {
        setVisibleJobs(prev => prev + 10);
    };

    const handleMessage = (applicantId, applicantName) => {
        navigate('/message', { state: { recipientId: applicantId, recipientName: applicantName } });
    };

    const handleViewApplicants = (jobId, jobTitle) => {
        navigate(`/job-applicants/${jobId}`, { state: { jobTitle } });
    };

    const handleOpenApplicantModal = (applicant) => {
        setSelectedApplicant(applicant);
        setApplicantModalOpen(true);
    };

    const handleCloseApplicantModal = () => {
        setSelectedApplicant(null);
        setApplicantModalOpen(false);
    };

    return (
        <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* <Toaster position="top-right" reverseOrder={false} /> */}

            {/* Welcome Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl shadow-lg p-8 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome back{companyName ? `, ${companyName}` : ''}!
                        </h1>
                        <p className="text-lg text-gray-600">Hire top talent for your team today.</p>
                    </div>
                    <div className="flex items-center space-x-6 mt-6 md:mt-0">
                        <div className="text-center">
                            <FaBriefcase className="text-3xl text-blue-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Active Jobs: {postedJobs.filter(job => job.status === 'approved').length}</p>
                        </div>
                        <div className="text-center">
                            <FaUsers className="text-3xl text-purple-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Total Applicants: {allApplicants.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posted Jobs Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Posted Jobs</h2>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    >
                        <FaPlus size={20} />
                    </button>
                </div>
                {loading ? (
                    <p className="text-gray-600 text-center">Loading jobs...</p>
                ) : postedJobs.length === 0 ? (
                    <div className="text-center py-12">
                        <FaBriefcase className="text-5xl text-gray-400 mx-auto mb-4" />
                        <p className="text-lg text-gray-600 mb-4">No jobs posted yet</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {postedJobs.slice(0, visibleJobs).map((job) => (
                                <div
                                    key={job.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 truncate">{job.title}</h3>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p><span className="font-medium">Company:</span> {job.company}</p>
                                            <p><span className="font-medium">Location:</span> {job.location}</p>
                                            <p><span className="font-medium">Type:</span> {job.type}</p>
                                            <p><span className="font-medium">Employment:</span> {job.employmentType}</p>
                                            <p><span className="font-medium">Salary:</span> {job.salaryRange}</p>
                                            <p><span className="font-medium">Experience:</span> {job.experienceLevel}</p>
                                            <p><span className="font-medium">Category:</span> {job.category}</p>
                                            <p><span className="font-medium">Applicants:</span> {job.applicants}</p>
                                            <p><span className="font-medium">Posted:</span> {new Date(job.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                    job.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {job.status}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteJob(job.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors duration-300"
                                                title="Delete Job"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-6 pb-6">
                                        <button
                                            onClick={() => handleViewApplicants(job.id, job.title)}
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                                        >
                                            View Applicants
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {postedJobs.length > visibleJobs && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={handleShowMore}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                                >
                                    Show More
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal for Posting Job */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Post a New Job</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <form onSubmit={handlePostJob} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                                    <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input type="text" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                                    <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                                    <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                                    <input type="text" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                                    <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="Entry-level">Entry-level</option>
                                        <option value="Mid-level">Mid-level</option>
                                        <option value="Senior-level">Senior-level</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                                <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                                <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="5" required />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-600'}`}
                            >
                                {loading ? 'Posting...' : 'Post Job'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* All Applicants Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">All Applicants</h2>
                {loading ? (
                    <p className="text-gray-600 text-center">Loading applicants...</p>
                ) : allApplicants.length === 0 ? (
                    <p className="text-gray-600 text-center">No applicants yet.</p>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {allApplicants.map((applicant) => (
                                    <tr key={applicant.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td
                                            onClick={() => handleOpenApplicantModal(applicant)}
                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-500 hover:text-blue-700 cursor-pointer"
                                        >
                                            {applicant.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{applicant.jobTitle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                    applicant.status === 'shortlisted'
                                                        ? 'bg-green-100 text-green-800'
                                                        : applicant.status === 'rejected'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}
                                            >
                                                {applicant.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{applicant.appliedDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-4">
                                            <a
                                                href={applicant.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                                                onClick={(e) => !applicant.resume && e.preventDefault() && toast.error('Resume not available')}
                                            >
                                                View Resume
                                            </a>
                                            <button
                                                onClick={() => handleMessage(applicant.applicantId, applicant.name)}
                                                className="text-purple-500 hover:text-purple-700 transition-colors duration-300 flex items-center"
                                            >
                                                <FaEnvelope className="mr-1" /> Message
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Applicant Details Modal */}
            {applicantModalOpen && selectedApplicant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">{selectedApplicant.name}</h3>
                            <button onClick={handleCloseApplicantModal} className="text-gray-500 hover:text-gray-700">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <div className="space-y-4 text-gray-600">
                            <p><span className="font-medium">Job Title:</span> {selectedApplicant.jobTitle}</p>
                            <p><span className="font-medium">Status:</span> {selectedApplicant.status}</p>
                            <p><span className="font-medium">Applied Date:</span> {selectedApplicant.appliedDate}</p>
                            <p><span className="font-medium">Phone Number:</span> {selectedApplicant.phoneNumber || 'Not provided'}</p>
                            <p><span className="font-medium">Date of Birth:</span> {selectedApplicant.dob ? new Date(selectedApplicant.dob).toLocaleDateString() : 'Not provided'}</p>
                            <p><span className="font-medium">About:</span> {selectedApplicant.about || 'Not provided'}</p>
                            <div>
                                <p className="font-medium">Skills:</p>
                                <ul className="list-disc pl-5">
                                    {selectedApplicant.skills.length > 0 ? selectedApplicant.skills.map((skill, idx) => (
                                        <li key={idx}>{skill}</li>
                                    )) : <li>Not provided</li>}
                                </ul>
                            </div>
                            <div>
                                <p className="font-medium">Education:</p>
                                {selectedApplicant.education && selectedApplicant.education.length > 0 ? (
                                    selectedApplicant.education.map((edu, idx) => (
                                        <div key={idx} className="ml-5">
                                            <p>{edu.degree || 'Degree not specified'} - {edu.institution || 'Institution not specified'}</p>
                                            <p className="text-sm">
                                                {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : 'Start date not specified'} to {` `}
                                                {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="ml-5">Not provided</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex space-x-4 flex-wrap gap-4">
                            {selectedApplicant.status === 'applied' && (
                                <>
                                    <button
                                        onClick={() => handleShortlistApplicant(selectedApplicant.id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all duration-300 flex items-center"
                                    >
                                        <FaCheck className="mr-2" /> Shortlist
                                    </button>
                                    <button
                                        onClick={() => handleRejectApplicant(selectedApplicant.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300 flex items-center"
                                    >
                                        <FaBan className="mr-2" /> Reject
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => handleMessage(selectedApplicant.applicantId, selectedApplicant.name)}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center"
                            >
                                <FaEnvelope className="mr-2" /> Message
                            </button>
                            <button
                                onClick={() => handleDeleteApplicant(selectedApplicant.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300 flex items-center"
                            >
                                <FaTrash className="mr-2" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default EmployerDashboard;