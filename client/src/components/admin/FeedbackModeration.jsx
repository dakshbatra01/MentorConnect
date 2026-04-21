import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';

export default function FeedbackModeration() {
    const { token } = useAuth();
    const [feedbackList, setFeedbackList] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        rating: '',
        sortBy: 'createdAt',
        order: 'desc'
    });
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchFeedback();
        fetchStats();
    }, [filters]);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams(
                Object.entries(filters).filter(([_, v]) => v !== '')
            );

            const response = await fetch(`${API_URL}/api/admin/feedback?${queryParams}`, {
                headers: { 'auth-token': token }
            });

            if (!response.ok) throw new Error('Failed to fetch feedback');

            const data = await response.json();
            setFeedbackList(data.feedback);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/feedback/stats`, {
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

    const handleDelete = async (feedbackId) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/feedback/${feedbackId}`, {
                method: 'DELETE',
                headers: { 'auth-token': token }
            });

            if (!response.ok) throw new Error('Failed to delete feedback');

            await fetchFeedback();
            await fetchStats();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={`material-symbols-outlined text-sm ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}>
                star
            </span>
        ));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Feedback Moderation</h1>
                <p className="text-[#92bbc9]">Review and moderate user feedback</p>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0d1b21] rounded-lg border border-[#325a67] p-4">
                        <p className="text-[#92bbc9] text-xs mb-1">Total Reviews</p>
                        <p className="text-white text-2xl font-bold">{stats.totalFeedback}</p>
                    </div>
                    <div className="bg-[#0d1b21] rounded-lg border border-yellow-600/30 p-4">
                        <p className="text-[#92bbc9] text-xs mb-1">Average Rating</p>
                        <div className="flex items-center gap-2">
                            <p className="text-yellow-400 text-2xl font-bold">{stats.avgRating}</p>
                            <div className="flex text-yellow-400">
                                <span className="material-symbols-outlined text-sm fill-current">star</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0d1b21] rounded-lg border border-[#325a67] p-4">
                        <p className="text-[#92bbc9] text-xs mb-2">Rating Distribution</p>
                        <div className="flex items-end gap-1 h-8">
                            {[1, 2, 3, 4, 5].map(rating => {
                                const count = stats.ratingDistribution?.find(r => r._id === rating)?.count || 0;
                                const max = Math.max(...(stats.ratingDistribution?.map(r => r.count) || [1]));
                                const height = Math.max((count / max) * 100, 10);
                                return (
                                    <div key={rating} className="flex-1 flex flex-col items-center gap-1 group relative">
                                        <div
                                            className={`w-full rounded-t-sm ${rating >= 4 ? 'bg-green-500' : rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ height: `${height}%` }}
                                        ></div>
                                        <span className="text-[10px] text-[#92bbc9]">{rating}</span>
                                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-1 rounded">
                                            {count}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={filters.rating}
                        onChange={(e) => setFilters({ ...filters, rating: e.target.value, page: 1 })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="createdAt">Date</option>
                        <option value="rating">Rating</option>
                    </select>
                    <select
                        value={filters.order}
                        onChange={(e) => setFilters({ ...filters, order: e.target.value })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="desc">Newest/Highest First</option>
                        <option value="asc">Oldest/Lowest First</option>
                    </select>
                </div>
            </div>

            {/* Feedback List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 text-red-400">
                    Error: {error}
                </div>
            ) : feedbackList.length === 0 ? (
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-[#92bbc9] mb-4">rate_review</span>
                    <p className="text-[#92bbc9]">No feedback found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {feedbackList.map((item) => (
                        <div key={item._id} className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6 hover:border-primary/50 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {item.studentId?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{item.studentId?.name || 'Unknown Student'}</p>
                                        <p className="text-xs text-[#92bbc9]">
                                            To: <span className="text-primary">{item.mentorId?.name || 'Unknown Mentor'}</span> • {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteFeedback(item._id)}
                                    className="p-2 hover:bg-red-600/20 rounded-lg text-[#92bbc9] hover:text-red-400 transition-colors"
                                    title="Delete Review"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-1 mb-3">
                                {renderStars(item.rating)}
                            </div>

                            <p className="text-gray-300 text-sm leading-relaxed">
                                {item.comment}
                            </p>

                            {item.sessionId && (
                                <div className="mt-4 pt-4 border-t border-[#325a67] flex items-center gap-2 text-xs text-[#92bbc9]">
                                    <span className="material-symbols-outlined text-sm">event</span>
                                    <span>Session: {item.sessionId.topic} ({new Date(item.sessionId.date).toLocaleDateString()})</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-[#92bbc9] text-sm">
                        Showing {feedbackList.length} of {pagination.total} reviews
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
        </div>
    );
}
