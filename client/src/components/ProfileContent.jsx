import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

export default function ProfileContent() {
    const { user, token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAvatars, setShowAvatars] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        avatar: user?.avatar || '',
        expertise: user?.expertise?.join(', ') || '',
        hourlyRate: user?.hourlyRate || 0,
        experience: user?.experience || ''
    });

    const avatars = [
        // Male Avatars
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Mason',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden',
        // Female Avatars
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Amelia',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData = {
                name: formData.name,
                bio: formData.bio,
                avatar: formData.avatar,
                expertise: formData.expertise.split(',').map(s => s.trim()),
                hourlyRate: parseFloat(formData.hourlyRate)
            };

            const response = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) throw new Error('Failed to update profile');

            const updatedUser = await response.json();
            alert('Profile updated successfully!');
            setIsEditing(false);
            // Ideally update context user here, but for now page refresh will do or context reload
            window.location.reload();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
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
                        <div className="relative mx-auto mb-4 w-32 h-32 group">
                            <div className="w-full h-full rounded-full bg-[#111e22] overflow-hidden border-4 border-[#111e22]">
                                {formData.avatar ? (
                                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                                        {user?.name?.[0] || 'A'}
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => setShowAvatars(!showAvatars)}
                                    className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-background-dark hover:bg-primary/90 transition-colors shadow-lg"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                            )}
                        </div>

                        {/* Avatar Selection Grid */}
                        {showAvatars && isEditing && (
                            <div className="mb-4 p-2 bg-[#0d1b21] rounded-lg border border-white/10">
                                <p className="text-xs text-white/60 mb-2">Choose an avatar</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {avatars.map((avatar, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setFormData({ ...formData, avatar });
                                                setShowAvatars(false);
                                            }}
                                            className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${formData.avatar === avatar ? 'border-primary' : 'border-transparent hover:border-white/30'
                                                }`}
                                        >
                                            <img src={avatar} alt={`Avatar ${index + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <h2 className="text-white text-xl font-bold mb-1">{user?.name}</h2>
                        <p className="text-white/60 mb-4 capitalize">{user?.role}</p>
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
                                        disabled={true}
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
                                                name="hourlyRate"
                                                value={formData.hourlyRate}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Expertise (Comma separated)</label>
                                        <input
                                            type="text"
                                            name="expertise"
                                            value={formData.expertise}
                                            onChange={handleChange}
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
                                        disabled={loading}
                                        className="px-6 py-2 rounded-lg bg-primary text-background-dark font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
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
