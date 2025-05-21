import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaCalendarAlt } from 'react-icons/fa';
import { FaEdit, FaSave } from 'react-icons/fa';

export const UserInfoSection = ({ profile, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: profile.fullName,
        phone: profile.phone,
        age: profile.age,

        profileImageUrl: profile.profileImageUrl
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
        setIsEditing(false);
    };

    return (
        <div className="py-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        <FaEdit className="mr-2" /> Edit
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center">
                        <FaUser className="text-gray-500 mr-4" />
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 py-2"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <FaEnvelope className="text-gray-500 mr-4" />
                        <span className="py-2">{profile.email}</span>
                    </div>

                    <div className="flex items-center">
                        <FaPhone className="text-gray-500 mr-4" />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 py-2"
                        />
                    </div>

                    <div className="flex items-center">
                        <FaBirthdayCake className="text-gray-500 mr-4" />
                        <input
                            type="number"
                            name="age"
                            value={formData.age || ''}
                            onChange={handleChange}
                            min="13"
                            max="120"
                            className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 py-2 w-20"
                        />
                    </div>

                    <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-500 mr-4" />
                        <span className="py-2">
                            Member since: {new Date(profile.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
                    >
                        <FaSave className="mr-2" /> Save Changes
                    </button>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center">
                        <FaUser className="text-gray-500 mr-4" />
                        <span>{profile.fullName}</span>
                    </div>

                    <div className="flex items-center">
                        <FaEnvelope className="text-gray-500 mr-4" />
                        <span>{profile.email}</span>
                    </div>

                    {profile.phone && (
                        <div className="flex items-center">
                            <FaPhone className="text-gray-500 mr-4" />
                            <span>{profile.phone}</span>
                        </div>
                    )}

                    {profile.age && (
                        <div className="flex items-center">
                            <FaBirthdayCake className="text-gray-500 mr-4" />
                            <span>{profile.age} years old</span>
                        </div>
                    )}

                    <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-500 mr-4" />
                        <span>Member since: {new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};