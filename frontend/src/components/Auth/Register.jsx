import React, { useState } from 'react';
import { FaArrowRight, FaUser, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link for routing
import Loader from '../Loader';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '', // 'jobseeker' or 'employer'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleSelection = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!formData.role) {
            toast.error('Please select a role (Job Seeker or Employer).');
            setIsLoading(false);
            return;
        }
        // console.log('Form Data:', formData); // Log form data including role
        const apiUrl = import.meta.env.VITE_API_URL
        try {
            const response = await axios.post(apiUrl + '/auth/register', formData);
            console.log(response);
            toast.success('Registration successful.',{duration:3000});
            // Redirect to login page
            // window.location.href = '/login';
            setFormData({ 
                name: '',
                email: '',
                password: '',
                role: '',  
            }
            ); // Clear the Form
            setIsLoading(false); // Stop loading

        } catch (e) {
            // console.error(e.response.data.message);
            toast.error(e.response.data.message);
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="font-sans bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl transform transition-all duration-500 hover:shadow-3xl">
                {/* Form Container */}
                <div className="p-10">
                    <h2 className="text-4xl font-bold text-gray-900 mb-8 animate-fade-in">
                        Join Us!
                    </h2>

                    {/* Role Selection */}
                    <div className="space-y-8">
                        <p className="text-gray-600 text-center mb-6 animate-fade-in">
                            Are you looking for a job or talent? Pick your role to get started.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <button
                                onClick={() => handleRoleSelection('jobseeker')}
                                className={`bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center ${formData.role === 'jobseeker' ? 'ring-2 ring-indigo-500' : ''
                                    }`}
                            >
                                <FaUser className="text-5xl text-indigo-600 mx-auto mb-4" />
                                <h4 className="text-2xl font-semibold text-gray-800">Job Seeker</h4>
                                <p className="text-gray-600 mt-2">Find your dream career today.</p>
                            </button>
                            <button
                                onClick={() => handleRoleSelection('employer')}
                                className={`bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center ${formData.role === 'employer' ? 'ring-2 ring-purple-500' : ''
                                    }`}
                            >
                                <FaBuilding className="text-5xl text-purple-600 mx-auto mb-4" />
                                <h4 className="text-2xl font-semibold text-gray-800">Employer</h4>
                                <p className="text-gray-600 mt-2">Hire the best talent for your team.</p>
                            </button>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 mt-8 animate-slide-in">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center shadow-md hover:from-indigo-700 hover:to-purple-700"
                        >
                            {
                                isLoading ? <Loader /> : (<span className='flex justify-between items-center'>Signup<FaArrowRight className="ml-2" /></span>)
                            }
                        </button>
                    </form>

                    {/* Already have an account? */}
                    <p className="text-center mt-4 text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;