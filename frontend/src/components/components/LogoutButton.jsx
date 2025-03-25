import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext); // Assuming your AuthContext provides a logout function

    const handleLogout = () => {
        logout(); // Call the logout function from AuthContext
        localStorage.removeItem('role');
        localStorage.removeItem('CurrentUserId');
        navigate('/login'); // Redirect to the login page after logout
    };
    return (
        <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium"
        >
            Logout
        </button>
    );
};

export default LogoutButton;