import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaUserCircle, FaSignOutAlt, FaBriefcase, FaEnvelope, FaEnvelopeOpen, FaTimes, FaTrash } from 'react-icons/fa';
import Footer from '../../components/Footer';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const JobSeekerDashboard = () => {
    const [jobSeekerName, setJobSeekerName] = useState('');
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchJobSeekerData();
        fetchRecommendedJobs();
        fetchAppliedJobs();
        fetchMessages();
        fetchAllJobs();
    }, []);

    const fetchJobSeekerData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get(`${apiUrl}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setJobSeekerName(response.data.name || '');
        } catch (error) {
            console.error('Error fetching job seeker profile:', error);
            setJobSeekerName('');
        }
    };

    const fetchRecommendedJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/recommendations`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            });
            const mappedJobs = response.data
                .filter(job => job.status === 'approved')
                .map(job => ({
                    id: job._id,
                    title: job.title,
                    company: job.company || 'Unnamed Company',
                    location: job.location || 'Not specified',
                    type: job.type || 'Not specified',
                    category: job.category || 'Not specified',
                    posted: new Date(job.createdAt).toLocaleDateString(),
                    salary: job.salaryRange || 'Not specified',
                }));
            setRecommendedJobs(mappedJobs);
        } catch (error) {
            console.error('Error fetching recommended jobs:', error);
            setRecommendedJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppliedJobs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get(`${apiUrl}/job/my-applications`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            // console.log('Applied jobs response:', response.data); // Debug log

            const mappedJobs = response.data
                .filter(app => app.job) // Filter out applications with no job
                .map(app => ({
                    id: app._id,
                    title: app.job.title || 'Job Title Not Available',
                    company: app.job.company || 'Unnamed Company',
                    location: app.job.location || 'Not specified',
                    status: app.status || 'Applied',
                    appliedDate: new Date(app.createdAt).toLocaleDateString(),
                }));
            setAppliedJobs(mappedJobs);
        } catch (error) {
            console.error('Error fetching applied jobs:', error);
            setAppliedJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get(`${apiUrl}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const mappedMessages = response.data.map(msg => ({
                id: msg._id,
                sender: msg.sender && msg.sender.profile && msg.sender.profile.companyName
                    ? msg.sender.profile.companyName
                    : 'Unknown Company',
                subject: msg.subject,
                body: msg.body,
                isRead: msg.isRead,
                receivedDate: new Date(msg.createdAt).toLocaleDateString(),
            }));
            setMessages(mappedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/job/`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            });
            const mappedJobs = response.data
                .filter(job => job.status === 'approved')
                .map(job => ({
                    id: job._id,
                    title: job.title,
                    company: job.company || 'Unnamed Company',
                    location: job.location || 'Not specified',
                    type: job.type || 'Not specified',
                    employmentType: job.employmentType || 'Not specified',
                    category: job.category || 'Not specified',
                    posted: new Date(job.createdAt).toLocaleDateString(),
                    salary: job.salaryRange || 'Not specified',
                    description: job.description || '',
                    experienceLevel: job.experienceLevel || 'Not specified',
                }));
            setAllJobs(mappedJobs);
            setFilteredJobs(mappedJobs);
        } catch (error) {
            console.error('Error fetching all jobs:', error);
            setAllJobs([]);
            setFilteredJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const filtered = allJobs.filter(job => {
            const matchesQuery =
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = searchType
                ? job.type.toLowerCase() === searchType.toLowerCase() ||
                job.employmentType.toLowerCase() === searchType.toLowerCase()
                : true;
            return matchesQuery && matchesType;
        });
        setFilteredJobs(filtered);
    };

    const handleMarkAsRead = async (messageId) => {
        try {
            const token = localStorage.getItem('authToken');
            const toastId = toast.loading('Marking as read...');
            await axios.put(
                `${apiUrl}/messages/${messageId}/read`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessages(prev =>
                prev.map(msg => (msg.id === messageId ? { ...msg, isRead: true } : msg))
            );
            if (selectedMessage && selectedMessage.id === messageId) {
                setSelectedMessage({ ...selectedMessage, isRead: true });
            }
            toast.success('Message marked as read!', { id: toastId });
        } catch (error) {
            console.error('Error marking message as read:', error);
            toast.error('Failed to mark as read.');
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const token = localStorage.getItem('authToken');
            const toastId = toast.loading('Deleting message...');
            await axios.delete(`${apiUrl}/messages/${messageId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
            setSelectedMessage(null);
            toast.success('Message deleted!', { id: toastId });
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message.');
        }
    };

    const handleOpenMessage = (message) => {
        setSelectedMessage(message);
    };

    const handleCloseMessage = () => {
        setSelectedMessage(null);
    };

    const handleApplyJob = (jobId, jobTitle) => {
        navigate(`/jobapply/${jobId}`, { state: { jobTitle } });
    };

    const truncateMessage = (text, maxLength = 11) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* <Toaster position="top-right" /> */}
            {/* Welcome Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl shadow-lg p-8 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome back{jobSeekerName ? `, ${jobSeekerName}` : ''}!
                        </h1>
                        <p className="text-lg text-gray-600">Let’s find your dream job today.</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-6 md:mt-0">
                        <FaUserCircle className="text-5xl text-blue-500" />
                        <div>
                            <p className="text-sm text-gray-500">Applications: {appliedJobs.length}</p>
                            <p className="text-sm text-gray-500">
                                Messages: {messages.filter(msg => !msg.isRead).length} unread ({messages.length} total)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Messages Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Messages ({messages.length})</h2>
                {loading ? (
                    <p className="text-gray-600 text-center">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-gray-600 text-center">No messages yet.</p>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message Preview</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Received</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {messages.map((msg) => (
                                    <tr
                                        key={msg.id}
                                        onClick={() => handleOpenMessage(msg)}
                                        className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{msg.sender}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{truncateMessage(msg.subject)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md">{truncateMessage(msg.body)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{msg.receivedDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {!msg.isRead ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(msg.id);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors duration-300 flex items-center"
                                                >
                                                    <FaEnvelopeOpen className="mr-1" /> Mark as Read
                                                </button>
                                            ) : (
                                                <span className="text-gray-500 flex items-center">
                                                    <FaEnvelope className="mr-1" /> Read
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Message Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Message from {selectedMessage.sender}</h3>
                            <button onClick={handleCloseMessage} className="text-gray-500 hover:text-gray-700">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Subject:</p>
                                <p className="text-lg text-gray-900 break-words">{selectedMessage.subject}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Message:</p>
                                <p className="text-gray-600 whitespace-pre-wrap break-words">{selectedMessage.body}</p>
                            </div>
                            <p className="text-sm text-gray-500">Received: {selectedMessage.receivedDate}</p>
                        </div>
                        <div className="mt-6 flex space-x-4">
                            {!selectedMessage.isRead && (
                                <button
                                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center"
                                >
                                    <FaEnvelopeOpen className="mr-2" /> Mark as Read
                                </button>
                            )}
                            <button
                                onClick={() => handleDeleteMessage(selectedMessage.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300 flex items-center"
                            >
                                <FaTrash className="mr-2" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Recommended Jobs Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Recommended Jobs</h2>
                {loading ? (
                    <p className="text-gray-600 text-center">Loading recommended jobs...</p>
                ) : recommendedJobs.length === 0 ? (
                    <p className="text-gray-600 text-center">No recommended jobs available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recommendedJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                                <p className="text-gray-600 mb-1">{job.company}</p>
                                <p className="text-gray-500 mb-1">{job.location}</p>
                                <p className="text-gray-500 mb-1">{job.type}</p>
                                <p className="text-gray-500 mb-2">{job.category}</p>
                                <p className="text-sm text-green-600 font-medium mb-3">₹{job.salary}</p>
                                <p className="text-xs text-gray-400 mb-4">Posted {job.posted}</p>
                                <button
                                    onClick={() => handleApplyJob(job.id, job.title)}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Applied Jobs Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Applied Jobs ({appliedJobs.length})</h2>
                {loading ? (
                    <p className="text-gray-600 text-center">Loading applied jobs...</p>
                ) : appliedJobs.length === 0 ? (
                    <p className="text-gray-600 text-center">No applied jobs yet.</p>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {appliedJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.company}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${job.status === 'shortlisted'
                                                        ? 'bg-green-100 text-green-800'
                                                        : job.status === 'rejected'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.appliedDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Job Search Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Search Jobs</h2>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 bg-white p-6 rounded-xl shadow-md">
                    <input
                        type="text"
                        placeholder="Job title, category, company, location"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    />
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="w-full sm:w-1/3 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center"
                    >
                        <FaSearch className="mr-2" /> Search
                    </button>
                </div>
                {/* Search Results */}
                <div className="mt-8">
                    {loading ? (
                        <p className="text-gray-600 text-center">Loading jobs...</p>
                    ) : filteredJobs.length === 0 ? (
                        <p className="text-gray-600 text-center">No jobs found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {filteredJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                                    <p className="text-gray-600 mb-1">{job.company}</p>
                                    <p className="text-gray-500 mb-1">{job.location}</p>
                                    <p className="text-gray-500 mb-1">{job.type}</p>
                                    <p className="text-gray-500 mb-2">{job.category}</p>
                                    <p className="text-sm text-green-600 font-medium mb-3">₹{job.salary}</p>
                                    <p className="text-xs text-gray-400 mb-4">Posted {job.posted}</p>
                                    <button
                                        onClick={() => handleApplyJob(job.id, job.title)}
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobSeekerDashboard;