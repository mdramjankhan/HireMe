import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const Message = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { recipientId, recipientName } = location.state || {};
  const apiUrl = 'http://localhost:5000';

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);

    const messageData = {
      recipient: recipientId,
      subject,
      body,
    };

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${apiUrl}/api/messages`, messageData, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setSubject('');
      setBody('');
      toast.success(`Message sent to ${recipientName}!`);
      setTimeout(() => navigate(-1), 2000); // Go back after 2 seconds
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center py-12">
      {/* <Toaster position="top-right" /> */}
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaEnvelope className="mr-3 text-purple-500" /> Send Message
          </h1>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Sending message to: <span className="font-semibold">{recipientName || 'Unknown'}</span>
        </p>
        <form onSubmit={handleSendMessage} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="6"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !recipientId}
            className={`w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center ${
              loading || !recipientId ? 'opacity-75 cursor-not-allowed' : 'hover:from-purple-600 hover:to-blue-600'
            }`}
          >
            {loading ? (
              'Sending...'
            ) : (
              <>
                <FaPaperPlane className="mr-2" /> Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;