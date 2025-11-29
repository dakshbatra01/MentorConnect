import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';

export default function SessionManagement() {
    const { token } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        status: '',
        sortBy: 'date',
        order: 'desc'
    });
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchSessions();
        fetchStats();
    }, [filters]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams(
                Object.entries(filters).filter(([_, v]) => v !== '')
            );

            const response = await fetch(`${API_URL}/api/admin/sessions?${queryParams}`, {
                headers: { 'auth-token': token }
            });

            if (!response.ok) throw new Error('Failed to fetch sessions');

            const data = await response.json();
            setSessions(data.sessions);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/sessions/stats`, {
                headers: { 'auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-600',
            confirmed: 'bg-blue-900/30 text-blue-400 border-blue-600',
            completed: 'bg-green-900/30 text-green-400 border-green-600',
            cancelled: 'bg-red-900/30 text-red-400 border-red-600'
        };
        return colors[status] || colors.pending;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Session Management</h1>
                <p className="text-[#92bbc9]">Monitor and manage all mentoring sessions</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-[#0d1b21] rounded-lg border border-[#325a67] p-4">
                        <p className="text-[#92bbc9] text-xs mb-1">Total</p>
                        <p className="text-white text-2xl font-bold">{stats.totalSessions}</p>
                    </div>
                    <div className="bg-[#0d1b21] rounded-lg border border-yellow-600/30 p-4">
                        <p className="text-[#92bbc9] text-xs mb-1">Pending</p>
                        <p className="text-yellow-400 text-2xl font-bold">{stats.pendingSessions}</p>
                    </div>
                    <div className="bg-[#0d1b21] rounded-lg border border-blue-600/30 p-4">
                        <p className="text-[#92bbc9] text-xs mb-1">Confirmed</p>
                        <p className="text-blue-400 text-2xl font-bold">{stats.confirmedSessions}</p>
                    </div>
                    <div className="bg-[#0d1b21] rounded-lg border border-green-600/30 p-4">
                        <p className="text-[#92bbc9] text-xs mb-1">Completed</p>
                        <p className="text-green-400 text-2xl font-bold">{stats.completedSessions}</p>
                    </div>
                    <div className="bg-[#0d1b21] rounded-lg border border-red-600/30 p-4">
                        <p className="text-[#92bbc9] text-xs mb-1">Cancelled</p>
                        <p className="text-red-400 text-2xl font-bold">{stats.cancelledSessions}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="date">Date</option>
                        <option value="createdAt">Created Date</option>
                    </select>
                    <select
                        value={filters.order}
                        onChange={(e) => setFilters({ ...filters, order: e.target.value })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Sessions List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 text-red-400">
                    Error: {error}
                </div>
            ) : sessions.length === 0 ? (
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-[#92bbc9] mb-4">event_busy</span>
                    <p className="text-[#92bbc9]">No sessions found</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session._id} className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6 hover:border-primary/50 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-white">{session.topic}</h3>
                                            <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusBadge(session.status)}`}>
                                                {session.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center gap-2 text-[#92bbc9]">
                                                <span className="material-symbols-outlined text-sm">person</span>
                                                <span>Student: {session.studentId?.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[#92bbc9]">
                                                <span className="material-symbols-outlined text-sm">school</span>
                                                <span>Mentor: {session.mentorId?.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[#92bbc9]">
                                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                <span>{new Date(session.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[#92bbc9]">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                <span>{session.startTime} - {session.endTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {session.notes && (
                                    <div className="mt-4 p-3 bg-[#192d33] rounded-lg">
                                        <p className="text-sm text-[#92bbc9]"><span className="font-medium text-white">Notes:</span> {session.notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-[#92bbc9] text-sm">
                                Showing {sessions.length} of {pagination.total} sessions
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                    disabled={filters.page === 1}
                                    className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 bg-[#0d1b21] border border-[#325a67] rounded-lg text-white">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                    disabled={filters.page >= pagination.pages}
                                    className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
