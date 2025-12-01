import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';

export default function AdvancedAnalytics() {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            // Fetch data from multiple endpoints
            const [overviewRes, userStatsRes, sessionStatsRes, mentorStatsRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/analytics/overview`, { headers: { 'auth-token': token } }),
                fetch(`${API_URL}/api/admin/users/stats`, { headers: { 'auth-token': token } }),
                fetch(`${API_URL}/api/admin/sessions/stats`, { headers: { 'auth-token': token } }),
                fetch(`${API_URL}/api/admin/mentors/stats`, { headers: { 'auth-token': token } })
            ]);

            const overview = await overviewRes.json();
            const users = await userStatsRes.json();
            const sessions = await sessionStatsRes.json();
            const mentors = await mentorStatsRes.json();

            setStats({
                overview,
                users,
                sessions,
                mentors
            });
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 text-red-400">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Platform Analytics</h1>
                <p className="text-[#92bbc9]">Deep dive into platform performance metrics</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6">
                    <h3 className="text-[#92bbc9] text-sm font-medium mb-1">User Growth (MoM)</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-white">{stats.users.newUsersThisMonth}</span>
                        <span className="text-sm text-green-400 mb-1">new this month</span>
                    </div>
                </div>
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6">
                    <h3 className="text-[#92bbc9] text-sm font-medium mb-1">Session Completion</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-white">{stats.sessions.completionRate}%</span>
                        <span className="text-sm text-[#92bbc9] mb-1">rate</span>
                    </div>
                </div>
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6">
                    <h3 className="text-[#92bbc9] text-sm font-medium mb-1">Active Mentors</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-white">{stats.mentors.activeMentors}</span>
                        <span className="text-sm text-[#92bbc9] mb-1">of {stats.mentors.totalMentors} total</span>
                    </div>
                </div>
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6">
                    <h3 className="text-[#92bbc9] text-sm font-medium mb-1">Avg Mentor Rating</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-white">{stats.mentors.avgRating}</span>
                        <span className="text-sm text-yellow-400 mb-1">★</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart (Visualized as Bars) */}
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6">
                    <h3 className="text-lg font-bold text-white mb-6">User Growth Trend (Last 7 Days)</h3>
                    <div className="h-64 flex items-end justify-between gap-2 border-b border-[#325a67] pb-2">
                        {stats.overview.growthData.map((day) => {
                            const maxUsers = Math.max(...stats.overview.growthData.map(d => d.users), 1);
                            const height = (day.users / maxUsers) * 100;
                            return (
                                <div key={day.date} className="flex-1 h-full flex flex-col items-center gap-2 group">
                                    <div className="flex-1 w-full flex items-end justify-center relative">
                                        <div
                                            className="w-full max-w-[40px] bg-primary rounded-t-lg hover:bg-primary/80 transition-all duration-500 relative"
                                            style={{ height: `${Math.max(height, 5)}%` }}
                                        >
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                {day.users} users
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-[#92bbc9] truncate w-full text-center">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Expertise Distribution */}
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Top Mentor Expertise</h3>
                    <div className="space-y-4">
                        {stats.mentors.expertiseDistribution.map((item, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white">{item._id}</span>
                                    <span className="text-[#92bbc9]">{item.count} mentors</span>
                                </div>
                                <div className="h-2 bg-[#192d33] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                        style={{ width: `${(item.count / stats.mentors.totalMentors) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Mentors */}
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Top Rated Mentors</h3>
                    <div className="space-y-4">
                        {stats.mentors.topMentors.map((mentor, index) => (
                            <div key={mentor._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#192d33] transition-colors">
                                <div className="w-8 h-8 flex items-center justify-center font-bold text-[#92bbc9]">
                                    #{index + 1}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {mentor.userId?.name?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">{mentor.userId?.name}</p>
                                    <p className="text-xs text-[#92bbc9]">{mentor.expertise.slice(0, 2).join(', ')}</p>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <span className="font-bold">{mentor.rating}</span>
                                    <span className="material-symbols-outlined text-sm fill-current">star</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Registrations */}
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Recent Users</h3>
                    <div className="space-y-4">
                        {stats.users.recentUsers.map((user) => (
                            <div key={user._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#192d33] transition-colors">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {user.name?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">{user.name}</p>
                                    <p className="text-xs text-[#92bbc9]">{user.email}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs border ${user.role === 'mentor'
                                    ? 'bg-green-900/30 text-green-400 border-green-600'
                                    : user.role === 'admin'
                                        ? 'bg-purple-900/30 text-purple-400 border-purple-600'
                                        : 'bg-blue-900/30 text-blue-400 border-blue-600'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
