import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfileContent() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: '',
        currentPassword: '',
        newPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement update logic here
        alert('Profile update functionality to be implemented');
        setIsEditing(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between gap-3 mb-8">
                <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">My Profile</p>
                    <p className="text-white/60 text-base font-normal leading-normal">Manage your account settings and preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Basic Info */}
                <div className="md:col-span-1">
                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-center sticky top-28">
                        <div className="relative mx-auto mb-4 w-32 h-32">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-[#111e22]">
                                {user?.name?.[0] || 'A'}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-background-dark hover:bg-primary/90 transition-colors shadow-lg">
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                        </div>
                        <h2 className="text-white text-xl font-bold mb-1">{user?.name}</h2>
                        <p className="text-white/60 mb-4 capitalize">{user?.role}</p>
                        <div className="flex flex-col gap-2">
                            <button className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-sm font-medium">
                                Change Password
                            </button>
                            <button className="w-full px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="md:col-span-2">
                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white text-xl font-bold">Personal Information</h3>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing
                                        ? 'bg-white/10 text-white'
                                        : 'bg-primary text-background-dark hover:bg-primary/90'
                                    }`}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        disabled={!isEditing}
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        disabled={true} // Email usually shouldn't be changed easily
                                        value={formData.email}
                                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/60 text-sm mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    rows="4"
                                    disabled={!isEditing}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself..."
                                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                ></textarea>
                            </div>

                            {user?.role === 'mentor' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">Hourly Rate ($)</label>
                                            <input
                                                type="number"
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">Experience (Years)</label>
                                            <input
                                                type="number"
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Expertise (Comma separated)</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </>
                            )}

                            {isEditing && (
                                <div className="flex justify-end pt-4 border-t border-white/10">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded-lg bg-primary text-background-dark font-bold hover:bg-primary/90 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
