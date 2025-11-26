import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function MentorManagement() {
    const { token } = useAuth();
    const [mentors, setMentors] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: '',
        sortBy: 'rating',
        order: 'desc',
        featured: ''
    });
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchMentors();
        fetchStats();
    }, [filters]);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams(
                Object.entries(filters).filter(([_, v]) => v !== '')
            );

            const response = await fetch(`http://localhost:4000/api/admin/mentors?${queryParams}`, {
                headers: { 'auth-token': token }
            });

            if (!response.ok) throw new Error('Failed to fetch mentors');

            const data = await response.json();
            setMentors(data.mentors);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/admin/mentors/stats', {
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

    const handleFeatureToggle = async (mentorId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/mentors/${mentorId}/feature`, {
                method: 'PUT',
                headers: { 'auth-token': token }
            });

            if (!response.ok) throw new Error('Failed to toggle feature status');

            await fetchMentors();
            await fetchStats();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleSuspendToggle = async (mentorId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/mentors/${mentorId}/suspend`, {
                method: 'PUT',
                headers: { 'auth-token': token }
            });

            if (!response.ok) throw new Error('Failed to toggle suspend status');

            await fetchMentors();
            await fetchStats();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Mentor Management</h1>
                <p className="text-[#92bbc9]">Manage and monitor all platform mentors</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#0d1b21] rounded-lg border border-[#325a67] p-4">
                        <p className="text-[#92bbc9] text-xs mb-1">Total Mentors</p>
                        <p className="text-white text-2xl font-bold">{stats.totalMentors}</p>
                    </div>
                    <div className="bg-[#0d1b21] rounded-lg border border-green-600/30 p-4">
                        <p className="text-[#92bbc9] text-xs mb-1">Active</p>
                        <p className="text-green-400 text-2xl font-bold">{stats.activeMentors}</p>
                    </div>
                    <div className="bg-[#0d1b21] rounded-lg border border-yellow-600/30 p-4">
                        <p className="text-[#92bbc9] text-xs mb-1">Featured</p>
                        <p className="text-yellow-400 text-2xl font-bold">{stats.featuredMentors}</p>
                    </div>
                    <div className="bg-[#0d1b21] rounded-lg border border-blue-600/30 p-4">
                        <p className="text-[#92bbc9] text-xs mb-1">Avg Rating</p>
                        <p className="text-blue-400 text-2xl font-bold">{stats.avgRating}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search mentors..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white placeholder-[#92bbc9] focus:outline-none focus:border-primary"
                    />
                    <select
                        value={filters.featured}
                        onChange={(e) => setFilters({ ...filters, featured: e.target.value, page: 1 })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="">All Mentors</option>
                        <option value="true">Featured Only</option>
                        <option value="false">Not Featured</option>
                    </select>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="rating">Rating</option>
                        <option value="totalSessions">Total Sessions</option>
                        <option value="hourlyRate">Hourly Rate</option>
                    </select>
                    <select
                        value={filters.order}
                        onChange={(e) => setFilters({ ...filters, order: e.target.value })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="desc">Highest First</option>
                        <option value="asc">Lowest First</option>
                    </select>
                </div>
            </div>

            {/* Mentors Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 text-red-400">
                    Error: {error}
                </div>
            ) : mentors.length === 0 ? (
                <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-[#92bbc9] mb-4">school</span>
                    <p className="text-[#92bbc9]">No mentors found</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mentors.map((mentor) => (
                            <div key={mentor._id} className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6 hover:border-primary/50 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                            <span className="text-primary font-bold text-lg">
                                                {mentor.userId?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold">{mentor.userId?.name}</h3>
                                            <p className="text-xs text-[#92bbc9]">{mentor.userId?.email}</p>
                                        </div>
                                    </div>
                                    {mentor.isFeatured && (
                                        <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-600 rounded text-xs">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-sm text-[#92bbc9]">star</span>
                                        <span className="text-white">{mentor.rating || 'N/A'}</span>
                                        <span className="text-[#92bbc9]">({mentor.totalSessions || 0} sessions)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-sm text-[#92bbc9]">attach_money</span>
                                        <span className="text-white">${mentor.hourlyRate || 0}/hr</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-sm text-[#92bbc9]">work</span>
                                        <span className="text-white">{mentor.experience} years exp.</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {mentor.expertise?.slice(0, 3).map((skill, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-[#192d33] text-[#92bbc9] rounded text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                        {mentor.expertise?.length > 3 && (
                                            <span className="px-2 py-1 bg-[#192d33] text-[#92bbc9] rounded text-xs">
                                                +{mentor.expertise.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleFeatureToggle(mentor._id)}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${mentor.isFeatured
                                                ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                                                : 'bg-[#192d33] text-white hover:bg-[#1f3942]'
                                            }`}
                                    >
                                        {mentor.isFeatured ? 'Unfeature' : 'Feature'}
                                    </button>
                                    <button
                                        onClick={() => handleSuspendToggle(mentor._id)}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!mentor.isActive
                                                ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                                : 'bg-[#192d33] text-white hover:bg-[#1f3942]'
                                            }`}
                                    >
                                        {mentor.isActive ? 'Suspend' : 'Activate'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-[#92bbc9] text-sm">
                                Showing {mentors.length} of {pagination.total} mentors
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
