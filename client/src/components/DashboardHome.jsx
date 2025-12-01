import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from './FeedbackModal';
import FeaturedMentorsCarousel from './FeaturedMentorsCarousel';
import API_URL from '../config';

export default function DashboardHome() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [pendingReviews, setPendingReviews] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    // Mentor Dashboard State
    const [mentorStats, setMentorStats] = useState(null);
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Student Dashboard State
    const [studentStats, setStudentStats] = useState(null);
    const [studentUpcomingSessions, setStudentUpcomingSessions] = useState([]);

    useEffect(() => {
        if (user?.role === 'student') {
            fetchPendingReviews();
            fetchStudentDashboardData();
        } else if (user?.role === 'mentor') {
            fetchMentorDashboardData();
        }
    }, [user, token]);



    const fetchPendingReviews = async () => {
        try {
            // Fetch completed sessions (needing review) AND confirmed sessions (potentially past due)
            // We'll fetch a bit more to ensure we catch them
            const response = await fetch(`${API_URL}/api/session/my-sessions?status=completed&limit=10`, {
                headers: { 'auth-token': token }
            });
            const completedData = await response.json();

            const confirmedRes = await fetch(`${API_URL}/api/session/my-sessions?status=confirmed&limit=20`, {
                headers: { 'auth-token': token }
            });
            const confirmedData = await confirmedRes.json();

            const unratedCompleted = completedData.sessions.filter(s => !s.rating);

            // Find confirmed sessions that are in the past
            const now = new Date();
            const pastConfirmed = confirmedData.sessions.filter(s => {
                const sessionDate = new Date(s.date);
                // If date is yesterday or earlier, it's definitely past.
                // If it's today, check end time (simplified: just check date for now)
                return sessionDate < now.setHours(0, 0, 0, 0);
            });

            setPendingReviews([...unratedCompleted, ...pastConfirmed]);
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
        }
    };

    const fetchStudentDashboardData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Session Stats
            const statsRes = await fetch(`${API_URL}/api/session/stats/me`, {
                headers: { 'auth-token': token }
            });
            const stats = await statsRes.json();
            setStudentStats(stats);

            // 2. Fetch Upcoming Sessions (Confirmed)
            const upcomingRes = await fetch(`${API_URL}/api/session/my-sessions?role=student&status=confirmed&limit=10&sortBy=date&order=asc`, {
                headers: { 'auth-token': token }
            });
            const upcomingData = await upcomingRes.json();

            // Filter to show only future sessions
            const now = new Date();
            const futureSessions = upcomingData.sessions.filter(s => new Date(s.date) >= now.setHours(0, 0, 0, 0));
            setStudentUpcomingSessions(futureSessions.slice(0, 3)); // Limit to 3 for dashboard

        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMentorDashboardData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Mentor Profile for ID and Rating
            const profileRes = await fetch(`${API_URL}/api/mentor/profile/me`, {
                headers: { 'auth-token': token }
            });

            if (profileRes.status === 404) {
                // Profile not found, redirect to onboarding
                navigate('/mentor-onboarding');
                return;
            }

            const profile = await profileRes.json();

            // 2. Fetch Session Stats
            const statsRes = await fetch(`${API_URL}/api/session/stats/me`, {
                headers: { 'auth-token': token }
            });
            const stats = await statsRes.json();
            setMentorStats({ ...stats, averageRating: profile.rating || 0 });

            // 3. Fetch Upcoming Sessions
            const upcomingRes = await fetch(`${API_URL}/api/session/my-sessions?role=mentor&status=confirmed&limit=3&sortBy=date&order=asc`, {
                headers: { 'auth-token': token }
            });
            const upcomingData = await upcomingRes.json();
            // Filter to show only future sessions
            const futureSessions = upcomingData.sessions.filter(s => new Date(s.date) >= new Date().setHours(0, 0, 0, 0));
            setUpcomingSessions(futureSessions);

            // 4. Fetch Pending Requests
            const pendingRes = await fetch(`${API_URL}/api/session/my-sessions?role=mentor&status=pending&limit=5`, {
                headers: { 'auth-token': token }
            });
            const pendingData = await pendingRes.json();
            setPendingRequests(pendingData.sessions);

            // 5. Fetch Recent Reviews (using mentor stats endpoint which includes recent feedback)
            if (profile._id) {
                const reviewsRes = await fetch(`${API_URL}/api/mentor/stats/${profile._id}`, {
                    headers: { 'auth-token': token } // Endpoint is public but we can send token
                });
                const reviewsData = await reviewsRes.json();
                setRecentReviews(reviewsData.recentFeedback || []);
            }

        } catch (error) {
            console.error('Error fetching mentor data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSessionAction = async (sessionId, status) => {
        try {
            const response = await fetch(`${API_URL}/api/session/${sessionId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                // Refresh data
                fetchMentorDashboardData();
            } else {
                alert('Failed to update session status');
            }
        } catch (error) {
            console.error('Error updating session:', error);
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
                                    onClick={async () => {
                                        if (session.status === 'confirmed') {
                                            // Mark as completed first
                                            await handleSessionAction(session._id, 'completed');
                                            // Then open modal (we need to update the session object locally or refetch)
                                            // For simplicity, we'll just set it as selected, but the modal might need 'completed' status
                                            // Let's assume handleSessionAction updates backend, and we pass a modified session to modal
                                            // Let's assume handleSessionAction updates backend, and we pass a modified session to modal
                                            setSelectedSession({ ...session, status: 'completed' });
                                            setShowFeedbackModal(true);
                                        } else {
                                            setSelectedSession(session);
                                            setShowFeedbackModal(true);
                                        }
                                    }}
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
                            <p className="text-white text-3xl font-bold mb-1">{mentorStats?.total || 0}</p>
                            <p className="text-white/60 text-sm">Sessions Conducted</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">group</span>
                                <span className="text-white/60 text-sm">Completed</span>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">{mentorStats?.completed || 0}</p>
                            <p className="text-white/60 text-sm">Sessions Finished</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">star</span>
                                <span className="text-white/60 text-sm">Average</span>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">{mentorStats?.averageRating?.toFixed(1) || 'N/A'}</p>
                            <p className="text-white/60 text-sm">Rating</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">school</span>
                                <span className="text-white/60 text-sm">Total</span>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">{studentStats?.completed || 0}</p>
                            <p className="text-white/60 text-sm">Sessions Completed</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">group</span>
                                <span className="text-white/60 text-sm">Active</span>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">{studentStats?.asStudent || 0}</p>
                            <p className="text-white/60 text-sm">Total Bookings</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">event_upcoming</span>
                                <span className="text-white/60 text-sm">Upcoming</span>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">{studentStats?.confirmed || 0}</p>
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
                    {user?.role === 'mentor' ? (
                        upcomingSessions.length > 0 ? (
                            upcomingSessions.map(session => (
                                <div key={session._id} className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary">videocam</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{session.topic}</p>
                                                <p className="text-white/60 text-sm">with {session.studentId?.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-medium">
                                                {new Date(session.date).toLocaleDateString()} at {session.startTime}
                                            </p>
                                            <p className="text-white/60 text-sm">
                                                {/* Calculate duration if possible, or just show times */}
                                                {session.startTime} - {session.endTime}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white/60">No upcoming sessions scheduled.</p>
                        )
                    ) : (
                        studentUpcomingSessions.length > 0 ? (
                            studentUpcomingSessions.map(session => (
                                <div key={session._id} className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary">videocam</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{session.topic}</p>
                                                <p className="text-white/60 text-sm">with {session.mentorId?.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-medium">
                                                {new Date(session.date).toLocaleDateString()} at {session.startTime}
                                            </p>
                                            <p className="text-white/60 text-sm">
                                                {session.startTime} - {session.endTime}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white/60">No upcoming sessions scheduled.</p>
                        )
                    )}
                </div>
            </div>

            {/* Mentor-specific: Pending Requests */}
            {user?.role === 'mentor' && (
                <div className="mb-8">
                    <h2 className="text-white text-2xl font-bold mb-4">Pending Session Requests</h2>
                    <div className="flex flex-col gap-4">
                        {pendingRequests.length > 0 ? (
                            pendingRequests.map(request => (
                                <div key={request._id} className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                                                {request.studentId?.name?.charAt(0) || 'S'}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{request.studentId?.name}</p>
                                                <p className="text-white/60 text-sm">Topic: {request.topic}</p>
                                                <p className="text-white/40 text-xs mt-1">
                                                    Requested for: {new Date(request.date).toLocaleDateString()} at {request.startTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSessionAction(request._id, 'confirmed')}
                                                className="px-4 py-2 rounded-lg bg-primary text-background-dark font-medium hover:bg-primary/90 transition-colors"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleSessionAction(request._id, 'cancelled')}
                                                className="px-4 py-2 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                    {request.notes && (
                                        <div className="bg-black/20 p-3 rounded-lg text-sm text-white/80">
                                            <span className="font-bold text-primary">Note:</span> {request.notes}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-white/60">No pending requests.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Recent Reviews Section for Mentors */}
            {user?.role === 'mentor' && recentReviews.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-white text-2xl font-bold mb-4">Recent Reviews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentReviews.map(review => (
                            <div key={review._id} className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`material-symbols-outlined text-sm ${i < review.rating ? 'fill-current' : 'text-gray-600'}`}>
                                                star
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-white/40 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-white/80 italic">"{review.comment}"</p>
                                <p className="text-primary text-sm mt-2 font-medium">- {review.studentId?.name || 'Student'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Student-specific: Recommended Mentors */}
            {/* Student-specific: Recommended Mentors */}
            {user?.role === 'student' && (
                <FeaturedMentorsCarousel />
            )}

            {showFeedbackModal && selectedSession && (
                <FeedbackModal
                    session={selectedSession}
                    onClose={() => {
                        setShowFeedbackModal(false);
                        setSelectedSession(null);
                    }}
                    onSuccess={() => {
                        fetchPendingReviews();
                        // Also refresh mentor stats if needed, but pending reviews is main priority here
                    }}
                />
            )}
        </>
    );
}
