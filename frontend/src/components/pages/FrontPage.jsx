import React, { useState, useEffect } from 'react';
import { FaSearch, FaArrowRight, FaBriefcase, FaUsers, FaRocket } from 'react-icons/fa';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const FrontPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchFeaturedJobs();
    }, []);

    const fetchFeaturedJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/job`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}` }, // Optional token for authenticated users
            });
            console.log(response.data);
            const approvedJobs = response.data.filter((job) => job.status === 'approved');
            const mappedJobs = approvedJobs.slice(0, 3).map((job) => ({
                id: job._id,
                title: job.title,
                company: job.company || 'Unnamed Company',
                location: job.location || 'Not specified',
                salary: job.salaryRange || 'Not specified',
            }));
            setFeaturedJobs(mappedJobs);
        } catch (error) {
            console.error('Error fetching featured jobs:', error);
            toast.error('Failed to load featured jobs.');
            setFeaturedJobs([
                { id: '1', title: 'Software Engineer', company: 'Tech Corp', location: 'Remote', salary: '$90k-$120k' },
                { id: '2', title: 'Sales Manager', company: 'Salesify', location: 'New York', salary: '$80k-$110k' },
                { id: '3', title: 'Graphic Designer', company: 'Creative Studio', location: 'San Francisco', salary: '$60k-$85k' },
            ]); 
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            toast.error('Please enter a search query.');
            return;
        }
        navigate('/jobs', { state: { searchQuery } });
    };

    const handleApplyJob = (jobId, jobTitle) => {
        navigate(`/jobapply/${jobId}`, { state: { jobTitle } });
    };

    return (
        <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-24 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-pattern opacity-10"
                    style={{
                        backgroundImage:
                            "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"3\"/%3E%3Ccircle cx=\"13\" cy=\"13\" r=\"3\"/%3E%3C/g%3E%3C/svg%3E')",
                    }}
                ></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                        Discover Your Dream Job or Top Talent
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of job seekers and employers on HireMe to unlock endless opportunities.
                    </p>
                    <div className="flex justify-center space-x-4 max-w-3xl mx-auto">
                        <input
                            type="text"
                            placeholder="Job title, category, or location"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full md:w-2/3 px-5 py-4 rounded-full border-2 border-white bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold flex items-center hover:bg-indigo-50 transition-all duration-300"
                        >
                            <FaSearch className="mr-2" /> Search Jobs
                        </button>
                    </div>
                    <div className="mt-10 flex justify-center space-x-6">
                        <Link
                            to="/register/jobseeker"
                            className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-md"
                        >
                            Job Seeker Sign Up
                        </Link>
                        <Link
                            to="/register/employer"
                            className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-8 py-4 rounded-full font-semibold hover:from-indigo-800 hover:to-purple-800 transition-all duration-300 shadow-md"
                        >
                            Employer Sign Up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Job Categories Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-bold text-gray-900 text-center mb-16 animate-fade-in">
                    Explore Job Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { name: 'IT & Software', icon: '💻', color: 'bg-blue-100' },
                        { name: 'Sales & Marketing', icon: '📈', color: 'bg-green-100' },
                        { name: 'Engineering', icon: '⚙️', color: 'bg-yellow-100' },
                        { name: 'Healthcare', icon: '🏥', color: 'bg-red-100' },
                        { name: 'Finance', icon: '💰', color: 'bg-purple-100' },
                        { name: 'Education', icon: '📚', color: 'bg-teal-100' },
                        { name: 'Design', icon: '🎨', color: 'bg-pink-100' },
                        { name: 'Customer Support', icon: '📞', color: 'bg-indigo-100' },
                    ].map((category, index) => (
                        <Link
                            to={`/jobs?category=${encodeURIComponent(category.name)}`}
                            key={index}
                            className={`${category.color} p-6 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
                        >
                            <span className="text-4xl mb-4 block">{category.icon}</span>
                            <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Jobs Section */}
            <div className="bg-gray-200 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-gray-900 text-center mb-16 animate-fade-in">
                        Featured Jobs
                    </h2>
                    {loading ? (
                        <p className="text-gray-600 text-center">Loading featured jobs...</p>
                    ) : featuredJobs.length === 0 ? (
                        <p className="text-gray-600 text-center">No featured jobs available.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                                    <p className="text-gray-600 mb-2">{job.company}</p>
                                    <p className="text-gray-500 mb-3">{job.location}</p>
                                    <p className="text-sm text-green-600 font-medium mb-4">₹{job.salary}</p>
                                    <button
                                        onClick={() => handleApplyJob(job.id, job.title)}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center w-full"
                                    >
                                        Apply Now <FaArrowRight className="ml-2" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Employer Benefits Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-bold text-gray-900 text-center mb-16 animate-fade-in">
                    Why Employers Love HireMe
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Reach Thousands',
                            description: 'Post your job and connect with qualified candidates instantly.',
                            icon: <FaUsers className="text-blue-500" />,
                        },
                        {
                            title: 'Easy Posting',
                            description: 'Create and manage job postings in minutes with ease.',
                            icon: <FaBriefcase className="text-purple-500" />,
                        },
                        {
                            title: 'Advanced Tools',
                            description: 'Find the perfect fit with powerful search and filter options.',
                            icon: <FaRocket className="text-green-500" />,
                        },
                    ].map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="text-4xl mb-4">{benefit.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call-to-Action Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                        Join HireMe today and take the next step in your career or find the best talent for your team.
                    </p>
                    <div className="flex justify-center space-x-6">
                        <Link
                            to="/register/jobseeker"
                            className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-md"
                        >
                            Sign Up as Job Seeker
                        </Link>
                        <Link
                            to="/register/employer"
                            className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-8 py-4 rounded-full font-semibold hover:from-indigo-800 hover:to-purple-800 transition-all duration-300 shadow-md"
                        >
                            Sign Up as Employer
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FrontPage;