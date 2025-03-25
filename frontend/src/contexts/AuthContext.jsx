import { createContext } from "react";
import { useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    async function fetchUser() {
        setLoading(true);
        try {
            const response = await fetch('/api/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUser(data);
            setIsAuthenticated(true);
            setLoading(false);
        }
        catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken'); 
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('authToken', token); 
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('authToken'); 
        setIsAuthenticated(false);
    };



    const value = {
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loading,
        setLoading,
        token,
        setToken,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}