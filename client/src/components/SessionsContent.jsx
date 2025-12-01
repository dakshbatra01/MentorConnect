import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from './FeedbackModal';
import API_URL from '../config';

export default function SessionsContent() {
    const { user, token } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('upcoming');
    const [selectedSession, setSelectedSession] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, [activeTab]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            // In a real app, we might want to filter by status on the backend
            // For now, we'll fetch all and filter on client or assume the endpoint returns all relevant
            // Fetch sessions with a high limit to handle client-side filtering for now
            const response = await fetch(`${API_URL}/api/session/my-sessions?limit=100&sortBy=date&order=desc`, {
                headers: {
                    'auth-token': token
                }
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch sessions');
            }

            setSessions(data.sessions || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (sessionId, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/api/session/${sessionId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update session status');
            }

            // Refresh sessions
            fetchSessions();
        } catch (err) {
            console.error(err);
            alert('Error updating session status');
        }
    };

    const filteredSessions = sessions.filter(session => {
        const now = new Date();
        const sessionDate = new Date(session.date);
        const isPast = sessionDate < now.setHours(0, 0, 0, 0);

        if (activeTab === 'upcoming') {
            // Show pending, and confirmed sessions that are NOT past
            return session.status === 'pending' || (session.status === 'confirmed' && !isPast);
        }
        // Show completed, cancelled, and confirmed sessions that ARE past
        return ['completed', 'cancelled'].includes(session.status) || (session.status === 'confirmed' && isPast);
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'completed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-white/60 bg-white/5 border-white/10';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-wrap justify-between gap-3 mb-8">
                <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">My Sessions</p>
                    <p className="text-white/60 text-base font-normal leading-normal">Manage your upcoming and past mentorship sessions.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-8">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'upcoming'
                        ? 'border-primary text-white'
                        : 'border-transparent text-white/60 hover:text-white'
                        }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'past'
                        ? 'border-primary text-white'
                        : 'border-transparent text-white/60 hover:text-white'
                        }`}
                >
                    Past
                </button>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
                {filteredSessions.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                        <span className="material-symbols-outlined text-white/40 text-6xl mb-4">event_busy</span>
                        <p className="text-white/60">No {activeTab} sessions found.</p>
                    </div>
                ) : (
                    filteredSessions.map((session) => (
                        <div key={session._id} className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {user.role === 'student'
                                            ? (session.mentorId?.name?.[0] || 'M')
                                            : (session.studentId?.name?.[0] || 'S')}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{session.topic}</h3>
                                        <p className="text-white/60">
                                            with {user.role === 'student' ? session.mentorId?.name : session.studentId?.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-white/40 text-sm">
                                                {new Date(session.date).toLocaleDateString()} • {session.startTime} - {session.endTime}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(session.status)} capitalize`}>
                                                {session.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto">
                                    {session.status === 'pending' && user.role === 'mentor' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(session._id, 'confirmed')}
                                                className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-primary text-background-dark font-medium hover:bg-primary/90 transition-colors"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(session._id, 'cancelled')}
                                                className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}

                                    {session.status === 'confirmed' && (
                                        <a
                                            href={session.meetingLink || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-primary text-background-dark font-medium hover:bg-primary/90 transition-colors text-center"
                                        >
                                            Join Meeting
                                        </a>
                                    )}

                                    {session.status === 'confirmed' && user.role === 'mentor' && (
                                        <button
                                            onClick={() => handleStatusUpdate(session._id, 'completed')}
                                            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 font-medium hover:bg-green-500/30 transition-colors"
                                        >
                                            Mark Complete
                                        </button>
                                    )}

                                    {/* Show Leave Feedback for Completed OR Past Confirmed sessions */}
                                    {((session.status === 'completed' && !session.feedback) || (session.status === 'confirmed' && new Date(session.date) < new Date().setHours(0, 0, 0, 0))) && user.role === 'student' && (
                                        <button
                                            onClick={async () => {
                                                if (session.status === 'confirmed') {
                                                    // Mark as completed first
                                                    await handleStatusUpdate(session._id, 'completed');
                                                    // Then open modal with updated status
                                                    setSelectedSession({ ...session, status: 'completed' });
                                                    setShowFeedbackModal(true);
                                                } else {
                                                    setSelectedSession(session);
                                                    setShowFeedbackModal(true);
                                                }
                                            }}
                                            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-primary text-background-dark font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            Leave Feedback
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showFeedbackModal && selectedSession && (
                <FeedbackModal
                    session={selectedSession}
                    onClose={() => {
                        setShowFeedbackModal(false);
                        setSelectedSession(null);
                    }}
                    onSuccess={() => {
                        fetchSessions(); // Refresh to show feedback is done
                    }}
                />
            )}
        </div>
    );
}
