import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

export default function MentorOnboarding() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        expertise: '',
        bio: '',
        experience: '',
        hourlyRate: '',
        languages: '',
        linkedin: '',
        github: '',
        twitter: '',
        website: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Process expertise and languages into arrays
            const expertiseArray = formData.expertise.split(',').map(item => item.trim()).filter(Boolean);
            const languagesArray = formData.languages.split(',').map(item => item.trim()).filter(Boolean);

            const payload = {
                expertise: expertiseArray,
                bio: formData.bio,
                experience: formData.experience,
                hourlyRate: parseFloat(formData.hourlyRate),
                languages: languagesArray,
                socialLinks: {
                    linkedin: formData.linkedin,
                    github: formData.github,
                    twitter: formData.twitter,
                    website: formData.website
                },
                // Default availability (can be edited later)
                availability: [
                    { day: 'Monday', slots: [{ startTime: '09:00', endTime: '17:00' }] },
                    { day: 'Wednesday', slots: [{ startTime: '09:00', endTime: '17:00' }] },
                    { day: 'Friday', slots: [{ startTime: '09:00', endTime: '17:00' }] }
                ]
            };

            const response = await fetch(`${API_URL}/api/mentor/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to create profile');
            }

            // Redirect to dashboard on success
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating profile:', error);
            alert('Failed to create profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Complete Your Mentor Profile</h1>
                    <p className="text-white/60">Tell us about your expertise to help students find you.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Expertise */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">Expertise (comma separated)</label>
                        <input
                            type="text"
                            name="expertise"
                            value={formData.expertise}
                            onChange={handleChange}
                            placeholder="e.g. React, Node.js, System Design"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about your background and mentoring style..."
                            rows="4"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none"
                            required
                        />
                    </div>

                    {/* Experience & Hourly Rate */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Current Role / Experience</label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="e.g. Senior Engineer at Google"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Hourly Rate ($)</label>
                            <input
                                type="number"
                                name="hourlyRate"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                                placeholder="e.g. 50"
                                min="0"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                    </div>

                    {/* Languages */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">Languages (comma separated)</label>
                        <input
                            type="text"
                            name="languages"
                            value={formData.languages}
                            onChange={handleChange}
                            placeholder="e.g. English, Spanish"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                        />
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h3 className="text-white font-medium border-b border-white/10 pb-2">Social Links (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                placeholder="LinkedIn URL"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                            />
                            <input
                                type="url"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="GitHub URL"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                            />
                            <input
                                type="url"
                                name="twitter"
                                value={formData.twitter}
                                onChange={handleChange}
                                placeholder="Twitter URL"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                            />
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="Personal Website URL"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-background-dark font-bold text-lg py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                    >
                        {loading ? 'Creating Profile...' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
