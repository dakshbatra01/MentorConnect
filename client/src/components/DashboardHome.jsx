import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ReviewModal from './ReviewModal';

export default function DashboardHome() {
    const { user, token } = useAuth();
    const [pendingReviews, setPendingReviews] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        if (user?.role === 'student') {
            fetchPendingReviews();
        }
    }, [user, token]);

    const fetchPendingReviews = async () => {
        try {
            // Fetch completed sessions where rating is missing
            const response = await fetch('http://localhost:4000/api/session/my-sessions?status=completed&limit=5', {
                headers: { 'auth-token': token }
            });
            const data = await response.json();
            // Client-side filter for unrated sessions (since API might return all completed)
            const unrated = data.sessions.filter(s => !s.rating);
            setPendingReviews(unrated);
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
        }
    };

    return (
        <>
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-3 mb-8">
                <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Welcome back, {user?.name?.split(' ')[0] || 'Alex'}!</p>
                    <p className="text-white/60 text-base font-normal leading-normal">
                        {user?.role === 'mentor'
                            ? "Here's an overview of your mentorship activity."
                            : "Here's what's happening on MentorConnect today."}
                    </p>
                </div>
            </div>

            {/* Pending Reviews Section (Student Only) */}
            {user?.role === 'student' && pendingReviews.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-white text-2xl font-bold mb-4">Pending Reviews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingReviews.map(session => (
                            <div key={session._id} className="p-6 rounded-xl bg-primary/10 border border-primary/20 flex justify-between items-center">
                                <div>
                                    <p className="text-white font-bold">{session.topic}</p>
                                    <p className="text-white/60 text-sm">with {session.mentorId.name}</p>
                                    <p className="text-white/40 text-xs mt-1">{new Date(session.date).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedSession(session)}
                                    className="px-4 py-2 rounded-lg bg-primary text-background-dark font-bold hover:bg-primary/90 transition-colors"
                                >
                                    Leave Review
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats Cards - Different for Mentor vs Student */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {user?.role === 'mentor' ? (
                    <>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">school</span>
                                <span className="text-white/60 text-sm">Total</span>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">48</p>
                            <p className="text-white/60 text-sm">Sessions Conducted</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">group</span>
                                <span className="text-white/60 text-sm">Active</span>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">15</p>
                            <p className="text-white/60 text-sm">Students Mentored</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">star</span>
                                <span className="text-white/60 text-sm">Average</span>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">4.8</p>
                            <p className="text-white/60 text-sm">Rating</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">school</span>
                                <span className="text-white/60 text-sm">This Month</span>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">12</p>
                            <p className="text-white/60 text-sm">Sessions Completed</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">group</span>
                                <span className="text-white/60 text-sm">Active</span>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">5</p>
                            <p className="text-white/60 text-sm">Active Mentors</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">event_upcoming</span>
                                <span className="text-white/60 text-sm">Upcoming</span>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">3</p>
                            <p className="text-white/60 text-sm">Scheduled Sessions</p>
                        </div>
                    </>
                )}
            </div>

            {/* Upcoming Sessions - Different titles for Mentor vs Student */}
            <div className="mb-8">
                <h2 className="text-white text-2xl font-bold mb-4">
                    {user?.role === 'mentor' ? 'Upcoming Mentorship Sessions' : 'Upcoming Sessions'}
                </h2>
                <div className="flex flex-col gap-4">
                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">videocam</span>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Career Growth Strategy</p>
                                    <p className="text-white/60 text-sm">
                                        {user?.role === 'mentor' ? 'with John Smith' : 'with Sarah Johnson'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-medium">Tomorrow, 2:00 PM</p>
                                <p className="text-white/60 text-sm">60 minutes</p>
                            </div>
                        </div>
                    </div>
                    {user?.role === 'mentor' && (
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">videocam</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">Technical Interview Prep</p>
                                        <p className="text-white/60 text-sm">with Emma Davis</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-medium">Friday, 10:00 AM</p>
                                    <p className="text-white/60 text-sm">45 minutes</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mentor-specific: Pending Requests */}
            {user?.role === 'mentor' && (
                <div className="mb-8">
                    <h2 className="text-white text-2xl font-bold mb-4">Pending Session Requests</h2>
                    <div className="flex flex-col gap-4">
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                                        M
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">Michael Chen</p>
                                        <p className="text-white/60 text-sm">Wants to discuss: Frontend Development</p>
                                        <p className="text-white/40 text-xs mt-1">Requested 2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 rounded-lg bg-primary text-background-dark font-medium hover:bg-primary/90 transition-colors">
                                        Accept
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Student-specific: Recommended Mentors */}
            {user?.role === 'student' && (
                <div className="mb-8">
                    <h2 className="text-white text-2xl font-bold mb-4">Recommended Mentors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors text-center">
                            <div className="size-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                D
                            </div>
                            <h4 className="text-white font-semibold mb-1">Dr. Lisa Wang</h4>
                            <p className="text-white/60 text-sm mb-2">AI & Machine Learning</p>
                            <div className="flex items-center justify-center gap-1 mb-3">
                                <span className="material-symbols-outlined !text-sm text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="text-white text-sm">4.9</span>
                            </div>
                            <button className="w-full px-3 py-2 rounded-lg bg-primary text-background-dark text-sm font-medium hover:bg-primary/90 transition-colors">
                                View Profile
                            </button>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors text-center">
                            <div className="size-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                J
                            </div>
                            <h4 className="text-white font-semibold mb-1">James Park</h4>
                            <p className="text-white/60 text-sm mb-2">Product Management</p>
                            <div className="flex items-center justify-center gap-1 mb-3">
                                <span className="material-symbols-outlined !text-sm text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="text-white text-sm">4.8</span>
                            </div>
                            <button className="w-full px-3 py-2 rounded-lg bg-primary text-background-dark text-sm font-medium hover:bg-primary/90 transition-colors">
                                View Profile
                            </button>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors text-center">
                            <div className="size-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                R
                            </div>
                            <h4 className="text-white font-semibold mb-1">Rachel Green</h4>
                            <p className="text-white/60 text-sm mb-2">UX/UI Design</p>
                            <div className="flex items-center justify-center gap-1 mb-3">
                                <span className="material-symbols-outlined !text-sm text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="text-white text-sm">5.0</span>
                            </div>
                            <button className="w-full px-3 py-2 rounded-lg bg-primary text-background-dark text-sm font-medium hover:bg-primary/90 transition-colors">
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedSession && (
                <ReviewModal
                    session={selectedSession}
                    onClose={() => setSelectedSession(null)}
                    onSuccess={() => {
                        fetchPendingReviews();
                        setSelectedSession(null);
                    }}
                />
            )}
        </>
    );
}
