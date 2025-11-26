import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function UserManagement() {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        role: '',
        search: '',
        sortBy: 'createdAt',
        order: 'desc'
    });
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams(
                Object.entries(filters).filter(([_, v]) => v !== '')
            );

            const response = await fetch(`http://localhost:4000/api/admin/users?${queryParams}`, {
                headers: { 'auth-token': token }
            });

            if (!response.ok) throw new Error('Failed to fetch users');

            const data = await response.json();
            setUsers(data.users);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({ role: newRole })
            });

            if (!response.ok) throw new Error('Failed to update role');

            await fetchUsers();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'auth-token': token }
            });

            if (!response.ok) throw new Error('Failed to delete user');

            setShowDeleteConfirm(null);
            await fetchUsers();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const getRoleBadge = (role) => {
        const colors = {
            student: 'bg-blue-900/30 text-blue-400 border-blue-600',
            mentor: 'bg-green-900/30 text-green-400 border-green-600',
            admin: 'bg-purple-900/30 text-purple-400 border-purple-600'
        };
        return colors[role] || colors.student;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-[#92bbc9]">Manage all platform users</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white placeholder-[#92bbc9] focus:outline-none focus:border-primary"
                    />
                    <select
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="">All Roles</option>
                        <option value="student">Students</option>
                        <option value="mentor">Mentors</option>
                        <option value="admin">Admins</option>
                    </select>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="createdAt">Registration Date</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                    </select>
                    <select
                        value={filters.order}
                        onChange={(e) => setFilters({ ...filters, order: e.target.value })}
                        className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 text-red-400">
                    Error: {error}
                </div>
            ) : (
                <>
                    <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#192d33] border-b border-[#325a67]">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-[#92bbc9]">Name</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-[#92bbc9]">Email</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-[#92bbc9]">Role</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-[#92bbc9]">Joined</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-[#92bbc9]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#325a67]">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-[#192d33] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <span className="text-primary font-bold">{user.name?.charAt(0)?.toUpperCase()}</span>
                                                    </div>
                                                    <span className="text-white font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#92bbc9]">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full border text-sm font-medium ${getRoleBadge(user.role)}`}
                                                >
                                                    <option value="student">Student</option>
                                                    <option value="mentor">Mentor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-[#92bbc9] text-sm">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setShowDeleteConfirm(user._id)}
                                                    className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                                                    title="Delete user"
                                                >
                                                    <span className="material-symbols-outlined text-red-400 text-sm">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-[#92bbc9] text-sm">
                                Showing {users.length} of {pagination.total} users
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                    disabled={filters.page === 1}
                                    className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1f3942]"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 bg-[#0d1b21] border border-[#325a67] rounded-lg text-white">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                    disabled={filters.page >= pagination.pages}
                                    className="px-4 py-2 bg-[#192d33] border border-[#325a67] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1f3942]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-white mb-2">Delete User</h3>
                        <p className="text-[#92bbc9] mb-6">
                            Are you sure you want to delete this user? This will cancel all their sessions and cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 bg-[#192d33] hover:bg-[#1f3942] text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteUser(showDeleteConfirm)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
