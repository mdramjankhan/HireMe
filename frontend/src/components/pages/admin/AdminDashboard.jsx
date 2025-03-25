import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSignOutAlt, FaBriefcase, FaUsers, FaClock, FaEye, FaBan, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState('Admin');
  const [statistics, setStatistics] = useState({
    totalJobs: 0,
    totalUsers: 0,
    pendingJobs: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAdminData();
    fetchJobs();
    fetchUsers();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${apiUrl}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setAdminName(response.data.name || 'Admin');
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      toast.error('Failed to load admin profile.');
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${apiUrl}/admin/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const mappedJobs = response.data.map(job => ({
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        posted: new Date(job.createdAt).toLocaleDateString(),
        employer: job.employer?.profile?.companyName || 'Unknown',
        status: job.status, // Include status for filtering and display
      }));
      setJobs(mappedJobs);
      setStatistics(prev => ({
        ...prev,
        totalJobs: response.data.length,
        pendingJobs: response.data.filter(job => job.status === 'pending').length,
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${apiUrl}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const mappedUsers = response.data.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status, // Use actual status from backend
        profile: user.profile,
        jobsPosted: user.jobsPosted || 0, // Ensure jobsPosted is mapped
      }));
      setUsers(mappedUsers);
      setStatistics(prev => ({ ...prev, totalUsers: response.data.length }));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${apiUrl}/admin/jobs/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setJobs(jobs.filter(job => job.id !== jobId));
      setStatistics(prev => ({ ...prev, totalJobs: prev.totalJobs - 1 }));
      toast.success('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${apiUrl}/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== userId));
      setStatistics(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      setUserModalOpen(false);
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${apiUrl}/admin/users/${userId}/status`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchUsers(); // Refresh user list
      setUserModalOpen(false);
      toast.success('User status updated!');
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error(error.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  const handleApproveJob = async (jobId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${apiUrl}/admin/jobs/${jobId}/approve`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchJobs(); // Refresh job list
      toast.success('Job approved successfully!');
    } catch (error) {
      console.error('Error approving job:', error);
      toast.error(error.response?.data?.message || 'Failed to approve job.');
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${apiUrl}/admin/jobs/${jobId}/reject`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchJobs(); // Refresh job list
      toast.success('Job rejected successfully!');
    } catch (error) {
      console.error('Error rejecting job:', error);
      toast.error(error.response?.data?.message || 'Failed to reject job.');
    }
  };

  return (
    <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-800 flex items-center transition-colors duration-300"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </nav>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl shadow-lg p-8 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {adminName}!
            </h1>
            <p className="text-lg text-gray-600">
              Oversee and optimize the HireMe platform.
            </p>
          </div>
          <div className="flex space-x-4 mt-6 md:mt-0">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              <a href="#manage-job">Manage Jobs</a>
            </button>
            <button className="bg-white border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300">
              <a href="#user-manage">Manage Users</a>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Overview Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Total Jobs Posted', value: statistics.totalJobs, icon: <FaBriefcase />, color: 'from-blue-500 to-purple-500' },
            { title: 'Total Users', value: statistics.totalUsers, icon: <FaUsers />, color: 'from-green-500 to-teal-500' },
            { title: 'Pending Job Approvals', value: statistics.pendingJobs, icon: <FaClock />, color: 'from-yellow-500 to-orange-500' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`flex items-center justify-between mb-4 bg-gradient-to-r ${stat.color} p-3 rounded-lg text-white`}>
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Job Moderation Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id='manage-job'>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Job Management</h2>
        {loading ? (
          <p className="text-gray-600 text-center">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600 text-center">No jobs found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Posted</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.posted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.employer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${job.status === 'approved' ? 'bg-green-100 text-green-800' :
                            job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-4">
                      {job.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveJob(job.id)}
                            className="text-green-500 hover:text-green-700 transition-colors duration-300 flex items-center"
                          >
                            <FaCheck className="mr-1" /> Approve
                          </button>
                          <button
                            onClick={() => handleRejectJob(job.id)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-300 flex items-center"
                          >
                            <FaTimes className="mr-1" /> Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-300 flex items-center"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Management Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id='user-manage'>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">User Management</h2>
        {loading ? (
          <p className="text-gray-600 text-center">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600 text-center">No users found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-4">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-300 flex items-center"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-300 flex items-center"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {userModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
              <button onClick={() => setUserModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            <div className="space-y-4 text-gray-600">
              <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
              <p><span className="font-medium">Role:</span> {selectedUser.role}</p>
              <p><span className="font-medium">Status:</span> {selectedUser.status}</p>
              {selectedUser.role === 'jobseeker' && (
                <>
                  <p><span className="font-medium">Phone Number:</span> {selectedUser.profile?.phoneNumber || 'Not provided'}</p>
                  <p><span className="font-medium">Date of Birth:</span> {selectedUser.profile?.dob ? new Date(selectedUser.profile.dob).toLocaleDateString() : 'Not provided'}</p>
                  <p><span className="font-medium">About:</span> {selectedUser.profile?.about || 'Not provided'}</p>
                  <div>
                    <p className="font-medium">Skills:</p>
                    <ul className="list-disc pl-5">
                      {selectedUser.profile?.skills?.length > 0 ? selectedUser.profile.skills.map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                      )) : <li>Not provided</li>}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Education:</p>
                    {selectedUser.profile?.education?.length > 0 ? selectedUser.profile.education.map((edu, idx) => (
                      <div key={idx} className="ml-5">
                        <p>{edu.degree || 'Degree not specified'} - {edu.institution || 'Institution not specified'}</p>
                        <p className="text-sm">
                          {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : 'Start date not specified'} to
                          {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                        </p>
                      </div>
                    )) : <p className="ml-5">Not provided</p>}
                  </div>
                </>
              )}
              {selectedUser.role === 'employer' && (
                <>
                  <p><span className="font-medium">Company Name:</span> {selectedUser.profile?.companyName || 'Not provided'}</p>
                  <p><span className="font-medium">Company Description:</span> {selectedUser.profile?.companyDescription || 'Not provided'}</p>
                  <p><span className="font-medium">Jobs Posted:</span> {selectedUser.jobsPosted}</p> {/* Fixed to use mapped jobsPosted */}
                </>
              )}
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => handleToggleUserStatus(selectedUser.id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-all duration-300 flex items-center"
              >
                <FaBan className="mr-2" /> {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300 flex items-center"
              >
                <FaTrash className="mr-2" /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;