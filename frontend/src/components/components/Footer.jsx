import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Logo from '../Logo';

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('Please enter your email');
            return;
        }
        toast.success('Subscribed successfully!');
        setEmail('');
    };

    return (
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Company Section */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            <Logo/>
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Connecting talent with opportunities. Your career journey starts here.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* For Job Seekers */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-gray-100">Job Seekers</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                                    Browse Jobs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                                    Upload Resume
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                                    Profile Setup
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* For Employers */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-gray-100">Employers</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                                    Post a Job
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                                    Manage Applicants
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                                    Messaging
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter & Legal */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-gray-100">Stay Updated</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe for job alerts and updates
                        </p>
                        <form onSubmit={handleSubscribe} className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-3 py-2 bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button 
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-md transition-colors duration-300"
                            >
                                <FaEnvelope />
                            </button>
                        </form>
                        <ul className="mt-6 space-y-3">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-700 text-center">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} HireMe. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}