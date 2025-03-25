import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for routing
import toast from "react-hot-toast";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../Loader";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    function capitalizeFirstLetter(word) {
        if (!word) {
          return ""; // Handle empty strings
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!formData.email) {
            toast.error("Please provide an Email!");
            return;
        }
        if (!formData.password) {
            toast.error("Please provide a Password!");
            return;
        }
        // console.log('Form Data:', formData); // Log form data including role
        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            const response = await axios.post(apiUrl + "/auth/login", formData);
            // console.log(response.data);
            // console.log(response.data.token);
            // console.log(response.data.user.role);
            login(response.data.token);
            toast.success(response.data.message + `\nRedirecting to ${capitalizeFirstLetter(response.data.user.role)}'s Dashboard`, { duration: 2000 });
            // Redirect to login page
            localStorage.setItem("role",response.data.user.role);
            // console.log(response.data.data.userId);
            localStorage.setItem("CurrentUserId",response.data.user.Id);
            // window.location.href = '/login';
            setTimeout(() => {
                if (response.data.user.role == "admin") {
                    window.location.href = "/admin";
                } else if (response.data.user.role == "employer") {
                    window.location.href = "/employer";
                } else if (response.data.user.role == "jobseeker") {
                    window.location.href = "/jobseeker";
                }
                
            }, 2000);
            setFormData({
                email: '',
                password: '',
            }
            ); // Clear the Form
            setIsLoading(false); // Stop loading
        } catch (e) {
            console.error(e.response.data.message);
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
                        Welcome Back!
                    </h2>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
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
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <span className="flex justify-between items-center">
                                    Login
                                    <FaArrowRight className="ml-2" />
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Don't have an account? */}
                    <p className="text-center mt-4 text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
