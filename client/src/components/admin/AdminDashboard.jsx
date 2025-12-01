import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';
import StatsCard from './StatsCard';

export default function AdminDashboard() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOverviewStats();
    }, []);

    const fetchOverviewStats = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/admin/analytics/overview`, {
                headers: {
                    'auth-token': token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            console.error('Error fetching overview stats:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-[#92bbc9]">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                <p className="text-red-400">Error: {error}</p>
                <button
                    onClick={fetchOverviewStats}
                    className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || 'Admin'}</h1>
                <p className="text-[#92bbc9]">Here's what's happening on MentorConnect today.</p>
            </div>

            {/* Needs Attention Section */}
            {(stats?.sessions?.pending > 0 || stats?.feedback?.flagged > 0) && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-500">warning</span>
                        Needs Attention
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stats?.sessions?.pending > 0 && (
                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
                                <div>
                                    <p className="text-white font-medium">{stats.sessions.pending} Pending Sessions</p>
                                    <p className="text-sm text-[#92bbc9]">Waiting for approval</p>
                                </div>
                                <button
                                    onClick={() => navigate('/admin/sessions?status=pending')}
                                    className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors"
                                >
                                    Review
                                </button>
                            </div>
                        )}
                        {stats?.feedback?.flagged > 0 && (
                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
                                <div>
                                    <p className="text-white font-medium">{stats.feedback.flagged} Flagged Reviews</p>
                                    <p className="text-sm text-[#92bbc9]">Requires moderation</p>
                                </div>
                                <button
                                    onClick={() => navigate('/admin/feedback')}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Moderate
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value={stats?.users?.total || 0}
                    icon="people"
                    color="primary"
                />
                <StatsCard
                    title="Students"
                    value={stats?.users?.students || 0}
                    icon="school"
                    color="success"
                />
                <StatsCard
                    title="Mentors"
                    value={stats?.users?.mentors || 0}
                    icon="work"
                    color="warning"
                />
                <StatsCard
                    title="Total Sessions"
                    value={stats?.sessions?.total || 0}
                    icon="event"
                    color="purple"
                />
            </div>

            {/* Sessions & Feedback Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <StatsCard
                    title="Active Sessions"
                    value={stats?.sessions?.active || 0}
                    icon="pending_actions"
                    color="primary"
                />
                <StatsCard
                    title="Completed Sessions"
                    value={stats?.sessions?.completed || 0}
                    icon="check_circle"
                    color="success"
                />
                <StatsCard
                    title="Platform Rating"
                    value={stats?.feedback?.platformRating || 'N/A'}
                    icon="star"
                    color="warning"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6">
                    <h3 className="text-lg font-bold text-white mb-4">User Growth (Last 7 Days)</h3>
                    <div className="space-y-2">
                        {(() => {
                            const maxUsers = stats?.growthData?.reduce((max, day) => Math.max(max, day.users), 0) || 1;
                            return stats?.growthData?.map((day) => (
                                <div key={day.date} className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-[#92bbc9] w-24">{day.date}</span>
                                    <div className="flex-1 h-2 bg-[#192d33] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${(day.users / maxUsers) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-white font-medium w-8 text-right">{day.users}</span>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="w-full flex items-center gap-3 p-3 bg-[#192d33] hover:bg-[#1f3942] rounded-lg transition-colors text-left"
                        >
                            <span className="material-symbols-outlined text-primary">person_add</span>
                            <div>
                                <p className="text-white font-medium">Manage Users</p>
                                <p className="text-xs text-[#92bbc9]">View and manage all users</p>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/admin/sessions')}
                            className="w-full flex items-center gap-3 p-3 bg-[#192d33] hover:bg-[#1f3942] rounded-lg transition-colors text-left"
                        >
                            <span className="material-symbols-outlined text-primary">event</span>
                            <div>
                                <p className="text-white font-medium">View Sessions</p>
                                <p className="text-xs text-[#92bbc9]">Monitor all mentoring sessions</p>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/admin/mentors')}
                            className="w-full flex items-center gap-3 p-3 bg-[#192d33] hover:bg-[#1f3942] rounded-lg transition-colors text-left"
                        >
                            <span className="material-symbols-outlined text-primary">school</span>
                            <div>
                                <p className="text-white font-medium">Manage Mentors</p>
                                <p className="text-xs text-[#92bbc9]">Approve and verify mentors</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Total Feedback */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Total Feedback Received</h3>
                        <p className="text-[#92bbc9] text-sm">Platform-wide user feedback and reviews</p>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-bold text-white">{stats?.feedback?.total || 0}</p>
                        <p className="text-sm text-[#92bbc9]">reviews</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
