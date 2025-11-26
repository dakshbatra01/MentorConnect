import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsCard from './StatsCard';

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOverviewStats();
    }, []);

    const fetchOverviewStats = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/admin/analytics/overview', {
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
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-[#92bbc9]">Welcome to your admin control center</p>
            </div>

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
                        {stats?.growthData?.map((day) => (
                            <div key={day.date} className="flex items-center justify-between">
                                <span className="text-sm text-[#92bbc9]">{day.date}</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-2 bg-primary rounded-full"
                                        style={{ width: `${Math.max(day.users * 20, 10)}px` }}
                                    ></div>
                                    <span className="text-sm text-white font-medium">{day.users}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-3 bg-[#192d33] hover:bg-[#1f3942] rounded-lg transition-colors text-left">
                            <span className="material-symbols-outlined text-primary">person_add</span>
                            <div>
                                <p className="text-white font-medium">Manage Users</p>
                                <p className="text-xs text-[#92bbc9]">View and manage all users</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 bg-[#192d33] hover:bg-[#1f3942] rounded-lg transition-colors text-left">
                            <span className="material-symbols-outlined text-primary">event</span>
                            <div>
                                <p className="text-white font-medium">View Sessions</p>
                                <p className="text-xs text-[#92bbc9]">Monitor all mentoring sessions</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 bg-[#192d33] hover:bg-[#1f3942] rounded-lg transition-colors text-left">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            <div>
                                <p className="text-white font-medium">View Analytics</p>
                                <p className="text-xs text-[#92bbc9]">Detailed platform insights</p>
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
