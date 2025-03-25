import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell, FaTrash, FaEnvelopeOpen, FaEnvelope } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('Please log in to view notifications.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            const response = await axios.get(`${apiUrl}/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const mappedNotifications = response.data.map(notif => {
                // Determine related title based on relatedModel
                const relatedTitle =
                    notif.relatedModel === 'Job'
                        ? notif.relatedId?.title
                        : notif.relatedId?.job?.title || 'N/A';
                return {
                    id: notif._id,
                    message: notif.message,
                    type: notif.type,
                    relatedId: notif.relatedId?._id || notif.relatedId,
                    relatedTitle,
                    isRead: notif.isRead,
                    createdAt: new Date(notif.createdAt).toLocaleString(),
                };
            });
            setNotifications(mappedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications. Please try again.');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const toastId = toast.loading('Marking as read...');
            await axios.put(`${apiUrl}/notifications/${id}/read`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setNotifications(prev =>
                prev.map(notif => (notif.id === id ? { ...notif, isRead: true } : notif))
            );
            toast.success('Notification marked as read!', { id: toastId });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Failed to mark as read. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const toastId = toast.loading('Deleting notification...');
            await axios.delete(`${apiUrl}/notifications/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setNotifications(prev => prev.filter(notif => notif.id !== id));
            toast.success('Notification deleted!', { id: toastId });
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification. Please try again.');
        }
    };

    return (
        <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* <Toaster position="top-right" /> */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                        <FaBell className="mr-3 text-blue-500" /> Notifications
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:text-blue-800 transition-all duration-300 flex items-center"
                    >
                        Back
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-600 text-center">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                    <p className="text-gray-600 text-center">No notifications available.</p>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`bg-white p-6 rounded-xl shadow-md flex items-start justify-between transition-all duration-300 ${notif.isRead ? 'opacity-75' : 'hover:shadow-lg'
                                    }`}
                            >
                                <div className="flex items-start space-x-4">
                                    {notif.isRead ? (
                                        <FaEnvelopeOpen className="text-gray-400 text-2xl mt-1" />
                                    ) : (
                                        <FaEnvelope className="text-blue-500 text-2xl mt-1" />
                                    )}
                                    <div>
                                        <p className="text-gray-900 font-semibold">{notif.message}</p>
                                        <p className="text-gray-600 text-sm">
                                            Related to: {notif.relatedTitle}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">Received: {notif.createdAt}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {!notif.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notif.id)}
                                            className="text-blue-500 hover:text-blue-700 transition-all duration-300"
                                            title="Mark as read"
                                        >
                                            <FaEnvelopeOpen />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notif.id)}
                                        className="text-red-500 hover:text-red-700 transition-all duration-300"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;