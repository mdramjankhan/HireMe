import React, { useState, useEffect, useContext } from 'react';
import { FaBars, FaTimes, FaUserCircle, FaUserShield } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { AuthContext } from '../contexts/AuthContext';
import { CgProfile } from "react-icons/cg";
import LogoutButton from './components/LogoutButton';
import { MdNotificationAdd } from "react-icons/md";


const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                
                setIsNavbarVisible(false);
            } else {
                
                setIsNavbarVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    // const role = localStorage.getItem("role");

    return (
        <nav
            className={`bg-white shadow-lg sticky top-0 z-50 transition-transform duration-300 ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            to="/"
                            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
                        >
                            <Logo />
                            
                        </Link>
                        {/* <span className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500'>Admin</span> */}
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-6">
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-md font-medium transition-all duration-300"
                            >
                                Home
                            </Link>
       
                        <Link
                            to="/jobs"
                            className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-md font-medium transition-all duration-300"
                        >
                            Jobs
                        </Link>
                        <Link
                            to="/about"
                            className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-md font-medium transition-all duration-300"
                        >
                            About
                        </Link>
                    </div>

                    {/* Desktop Auth Actions */}
                    {isAuthenticated ? (
                        <div className='flex items-center gap-3'>
                        {   
                            localStorage.getItem("role") === 'jobseeker' ? (<button onClick={()=> navigate('/notifications')}
                            ><MdNotificationAdd  className='size-10 text-blue-600' /></button>):('')
                        }

                        <button onClick={() => navigate('/profile')}>
                            <CgProfile className='size-10 text-purple-700 hidden md:block' />
                        </button>
                        <span className='hidden md:block'><LogoutButton/></span>
                        
                        </div>
                    ) : (
                        <div className="hidden sm:flex sm:items-center sm:space-x-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-white border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-50 transition-all duration-300 text-sm font-medium"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <div className="sm:hidden flex items-center">
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        >
                            {mobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden bg-white shadow-md">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                to="/"
                                className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                            >
                                Home
                            </Link>

                        <Link
                            to="/jobs"
                            className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                        >
                            Jobs
                        </Link>
                        <Link
                            to="/about"
                            className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                        >
                            About
                        </Link>
                    </div>

                    {/* Mobile Auth Actions */}
                    {isAuthenticated ? (
                        <div className="pt-4 pb-3 border-t border-gray-200 flex flex-col items-center gap-2">
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full flex items-center justify-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-300 text-base font-medium"
                            >
                                <CgProfile className="mr-2 text-purple-700" />
                                Profile
                            </button>
                            <span className='lg:hidden'><LogoutButton/></span>
                        </div>
                    ) : (
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="px-2 space-y-2">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-base font-medium"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="w-full bg-white border-2 border-blue-500 text-blue-500 px-3 py-2 rounded-full hover:bg-blue-50 transition-all duration-300 text-base font-medium"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;