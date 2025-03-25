import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaTimes, FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const JobApplicants = () => {
    const { jobId } = useParams();
    const { state } = useLocation();
    const { jobTitle } = state || {};
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;


    useEffect(() => {
        fetchApplicants();
    }, [jobId]);

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${apiUrl}/job/${jobId}/applications`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const mappedApplicants = response.data.map(app => ({
                id: app._id,
                name: app.applicant.name || 'Unknown Applicant',
                applicantId: app.applicant._id,
                status: app.status,
                resume: app.resume,
                appliedDate: new Date(app.createdAt).toLocaleDateString(),
                skills: app.applicant.profile?.skills || [],
                education: app.applicant.profile?.education || [],
                dob: app.applicant.profile?.dob || null,
                phoneNumber: app.applicant.profile?.phoneNumber || '',
                about: app.applicant.profile?.about || '',
            }));
            setApplicants(mappedApplicants);
        } catch (error) {
            console.error('Error fetching applicants:', error);
            toast.error('Failed to load applicants.');
            setApplicants([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (applicant) => {
        setSelectedApplicant(applicant);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedApplicant(null);
        setModalOpen(false);
    };

    const handleDeleteApplicant = async (applicationId) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;

        try {
            await axios.delete(`${apiUrl}/job/applications/${applicationId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            });
            setApplicants(applicants.filter(app => app.id !== applicationId));
            setModalOpen(false);
            toast.success('Application deleted successfully!');
        } catch (error) {
            console.error('Error deleting application:', error);
            toast.error(error.response?.data?.message || 'Failed to delete application.');
        }
    };

    const handleMessage = (applicantId, applicantName) => {
        navigate('/message', { state: { recipientId: applicantId, recipientName: applicantName } });
    };

    return (
        <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Applicants for {jobTitle || 'Job'}</h1>
                {loading ? (
                    <p className="text-gray-600 text-center">Loading applicants...</p>
                ) : applicants.length === 0 ? (
                    <p className="text-gray-600 text-center">No applicants for this job yet.</p>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {applicants.map((applicant) => (
                                    <tr key={applicant.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td
                                            onClick={() => handleOpenModal(applicant)}
                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-500 hover:text-blue-700 cursor-pointer"
                                        >
                                            {applicant.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${applicant.status === 'shortlisted'
                                                        ? 'bg-green-100 text-green-800'
                                                        : applicant.status === 'rejected'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
                                                {applicant.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{applicant.appliedDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-4">
                                            <a
                                                href={applicant.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                                                onClick={(e) => !applicant.resume && e.preventDefault() && toast.error('Resume not available')}
                                            >
                                                View Resume
                                            </a>
                                            <button
                                                onClick={() => handleMessage(applicant.applicantId, applicant.name)}
                                                className="text-purple-500 hover:text-purple-700 transition-colors duration-300 flex items-center"
                                            >
                                                <FaEnvelope className="mr-1" /> Message
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Applicant Details Modal */}
                {modalOpen && selectedApplicant && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">{selectedApplicant.name}</h3>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                    <FaTimes size={24} />
                                </button>
                            </div>
                            <div className="space-y-4 text-gray-600">
                                <p><span className="font-medium">Status:</span> {selectedApplicant.status}</p>
                                <p><span className="font-medium">Applied Date:</span> {selectedApplicant.appliedDate}</p>
                                <p><span className="font-medium">Phone Number:</span> {selectedApplicant.phoneNumber || 'Not provided'}</p>
                                <p><span className="font-medium">Date of Birth:</span> {selectedApplicant.dob ? new Date(selectedApplicant.dob).toLocaleDateString() : 'Not provided'}</p>
                                <p><span className="font-medium">About:</span> {selectedApplicant.about || 'Not provided'}</p>
                                <div>
                                    <p className="font-medium">Skills:</p>
                                    <ul className="list-disc pl-5">
                                        {selectedApplicant.skills.length > 0 ? selectedApplicant.skills.map((skill, idx) => (
                                            <li key={idx}>{skill}</li>
                                        )) : <li>Not provided</li>}
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-medium">Education:</p>
                                    {selectedApplicant.education && selectedApplicant.education.length > 0 ? (
                                        selectedApplicant.education.map((edu, idx) => (
                                            <div key={idx} className="ml-5">
                                                <p>{edu.degree || 'Degree not specified'} - {edu.institution || 'Institution not specified'}</p>
                                                <p className="text-sm">
                                                    {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : 'Start date not specified'} to {` `}
                                                    {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="ml-5">Not provided</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 flex space-x-4 flex-wrap gap-4">
                                <button
                                    onClick={() => handleMessage(selectedApplicant.applicantId, selectedApplicant.name)}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center"
                                >
                                    <FaEnvelope className="mr-2" /> Message
                                </button>
                                <button
                                    onClick={() => handleDeleteApplicant(selectedApplicant.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300 flex items-center"
                                >
                                    <FaTrash className="mr-2" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplicants;