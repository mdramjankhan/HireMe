import axios from 'axios';

// Log the environment variable to debug
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // Fallback to localhost if env variable is not set
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            // Handle unauthorized access, e.g., redirect to login page
            console.error('Unauthorized access - redirecting to login...');
            // Example: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;