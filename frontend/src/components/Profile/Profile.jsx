import React, { useState, useEffect } from 'react';
import { FaUser, FaBuilding, FaCrown, FaEdit, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProfilePage = ({ userRole }) => {
    const [userData, setUserData] = useState({
        id: '',
        email: '',
        role: userRole,
        name: '',
        profile: {
            skills: [],
            education: [],
            dob: null,
            phoneNumber: '',
            about: '',
            resume: '',
            companyName: '',
            companyDescription: '',
        },
    });
    const [isEditing, setIsEditing] = useState(false);
    const [newEducation, setNewEducation] = useState({
        institution: '',
        degree: '',
        startDate: '',
        endDate: '',
    });
    const token = localStorage.getItem('authToken');
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(apiUrl+'/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(response.data);
            } catch (error) {
                toast.error('Failed to fetch profile data');
                console.error(error);
            }
        };
        fetchProfile();
    }, [token]);

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        if (field.includes('profile.')) {
            const [, child] = field.split('profile.');
            setUserData(prev => ({
                ...prev,
                profile: { ...prev.profile, [child]: value },
            }));
        } else {
            setUserData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSkillsChange = (e) => {
        const skillsArray = e.target.value.split(',').map(skill => skill.trim());
        setUserData(prev => ({
            ...prev,
            profile: { ...prev.profile, skills: skillsArray },
        }));
    };

    const handleNewEducationChange = (e, field) => {
        setNewEducation(prev => ({ ...prev, [field]: e.target.value }));
    };

    const addEducation = () => {
        if (!newEducation.institution || !newEducation.degree) {
            toast.error('Institution and Degree are required');
            return;
        }
        setUserData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                education: [...prev.profile.education, { ...newEducation }],
            },
        }));
        setNewEducation({ institution: '', degree: '', startDate: '', endDate: '' });
    };

    const removeEducation = (index) => {
        setUserData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                education: prev.profile.education.filter((_, i) => i !== index),
            },
        }));
    };

    const handleSave = async () => {
        try {
            let updateData;
            if (userData.role === 'employer') {
                // Only include allowed fields for employers, excluding phoneNumber
                updateData = {
                    name: userData.name,
                    email: userData.email,
                    'profile.companyName': userData.profile.companyName,
                    'profile.about': userData.profile.about,
                    'profile.companyDescription': userData.profile.companyDescription,
                };
            } else {
                // For jobseekers and admins, include all relevant fields
                updateData = {
                    name: userData.name,
                    email: userData.email,
                    profile: {
                        skills: userData.profile.skills,
                        education: userData.profile.education,
                        dob: userData.profile.dob,
                        phoneNumber: userData.profile.phoneNumber,
                        about: userData.profile.about,
                        companyName: userData.profile.companyName,
                        companyDescription: userData.profile.companyDescription,
                    },
                };
            }

            const response = await axios.put(
                apiUrl+'/auth/profile',
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserData(response.data);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        }
    };

    const isJobSeeker = userData.role === 'jobseeker';
    const isEmployer = userData.role === 'employer';

    return (
        <div className="font-sans bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl transform transition-all duration-500 hover:shadow-3xl">
                <div className="p-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 animate-fade-in">Profile</h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
                        >
                            {isEditing ? <FaSave className="text-2xl" /> : <FaEdit className="text-2xl" />}
                        </button>
                    </div>

                    <div className="flex items-center justify-center mb-8">
                        <div className="p-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                            {isJobSeeker && <FaUser className="text-5xl text-indigo-600" />}
                            {isEmployer && <FaBuilding className="text-5xl text-purple-600" />}
                            {userData.role === 'admin' && <FaCrown className="text-5xl text-yellow-600" />}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) => handleInputChange(e, 'name')}
                                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                                />
                            ) : (
                                <div className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50">
                                    {userData.name || 'Not set'}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => handleInputChange(e, 'email')}
                                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                                />
                            ) : (
                                <div className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50">
                                    {userData.email || 'Not set'}
                                </div>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <div className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50">
                                {userData.role}
                            </div>
                        </div>

                        {/* Phone Number (Only for Job Seekers) */}
                        {isJobSeeker && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userData.profile.phoneNumber}
                                        onChange={(e) => handleInputChange(e, 'profile.phoneNumber')}
                                        className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                                    />
                                ) : (
                                    <div className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50">
                                        {userData.profile.phoneNumber || 'Not set'}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Company Name (Only for Employers) */}
                        {isEmployer && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userData.profile.companyName}
                                        onChange={(e) => handleInputChange(e, 'profile.companyName')}
                                        className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                                    />
                                ) : (
                                    <div className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50">
                                        {userData.profile.companyName || 'Not set'}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Company Description (Only for Employers) */}
                        {isEmployer && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                                {isEditing ? (
                                    <textarea
                                        value={userData.profile.companyDescription}
                                        onChange={(e) => handleInputChange(e, 'profile.companyDescription')}
                                        className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                                    />
                                ) : (
                                    <div className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50">
                                        {userData.profile.companyDescription || 'Not set'}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* About */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                            {isEditing ? (
                                <textarea
                                    value={userData.profile.about}
                                    onChange={(e) => handleInputChange(e, 'profile.about')}
                                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                                />
                            ) : (
                                <div className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50">
                                    {userData.profile.about || 'Not set'}
                                </div>
                            )}
                        </div>

                        {/* Skills (Only for Job Seekers) */}
                        {isJobSeeker && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userData.profile.skills.join(', ')}
                                        onChange={handleSkillsChange}
                                        className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                                    />
                                ) : (
                                    <div className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50">
                                        {userData.profile.skills.length > 0 ? userData.profile.skills.join(', ') : 'Not set'}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Education (Only for Job Seekers) */}
                        {isJobSeeker && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                                <div className="space-y-4 mb-4">
                                    {userData.profile.education.map((edu, index) => (
                                        <div key={index} className="border p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                                            <div>
                                                <p><strong>Institution:</strong> {edu.institution}</p>
                                                <p><strong>Degree:</strong> {edu.degree}</p>
                                                <p><strong>Start Date:</strong> {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : 'Not set'}</p>
                                                <p><strong>End Date:</strong> {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Not set'}</p>
                                            </div>
                                            {isEditing && (
                                                <button
                                                    onClick={() => removeEducation(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {userData.profile.education.length === 0 && !isEditing && (
                                        <div className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50">
                                            Not set
                                        </div>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="space-y-4 border p-4 rounded-lg bg-gray-100">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                                            <input
                                                type="text"
                                                value={newEducation.institution}
                                                onChange={(e) => handleNewEducationChange(e, 'institution')}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                            <input
                                                type="text"
                                                value={newEducation.degree}
                                                onChange={(e) => handleNewEducationChange(e, 'degree')}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                value={newEducation.startDate}
                                                onChange={(e) => handleNewEducationChange(e, 'startDate')}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                value={newEducation.endDate}
                                                onChange={(e) => handleNewEducationChange(e, 'endDate')}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                            />
                                        </div>
                                        <button
                                            onClick={addEducation}
                                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                                        >
                                            <FaPlus /> Add Education
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Resume (Only for Job Seekers) */}
                        {isJobSeeker && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                                {isEditing ? (
                                    <input
                                        type="file"
                                        onChange={async (e) => {
                                            const formData = new FormData();
                                            formData.append('resume', e.target.files[0]);
                                            try {
                                                const response = await axios.post(
                                                    'http://localhost:5000/api/auth/upload-resume',
                                                    formData,
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                            'Content-Type': 'multipart/form-data',
                                                        },
                                                    }
                                                );
                                                setUserData(prev => ({
                                                    ...prev,
                                                    profile: { ...prev.profile, resume: response.data.url },
                                                }));
                                                toast.success('Resume uploaded successfully!');
                                            } catch (error) {
                                                toast.error('Failed to upload resume');
                                            }
                                        }}
                                        className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-gray-50"
                                    />
                                ) : (
                                    <div className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50">
                                        {userData.profile.resume ? (
                                            <a href={userData.profile.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                                                View Resume
                                            </a>
                                        ) : (
                                            'Not set'
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Save Button */}
                        {isEditing && (
                            <button
                                onClick={handleSave}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center shadow-md hover:from-indigo-700 hover:to-purple-700"
                            >
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;