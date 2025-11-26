import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
        { name: 'Users', path: '/admin/users', icon: 'people' },
        { name: 'Sessions', path: '/admin/sessions', icon: 'event' },
        { name: 'Mentors', path: '/admin/mentors', icon: 'school' },
        { name: 'Feedback', path: '/admin/feedback', icon: 'rate_review' },
        { name: 'Analytics', path: '/admin/analytics', icon: 'analytics' },
    ];

    return (
        <div className="flex h-screen bg-background-dark text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0d1b21] border-r border-[#325a67] flex flex-col">
                {/* Logo */}
                <div className="flex items-center gap-3 p-6 border-b border-[#325a67]">
                    <div className="size-8 text-primary flex items-center justify-center">
                        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-white text-lg font-bold leading-tight">MentorConnect</h2>
                        <p className="text-xs text-[#92bbc9]">Admin Panel</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary text-white'
                                    : 'text-[#92bbc9] hover:bg-[#192d33] hover:text-white'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-[#325a67]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-[#92bbc9]">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-[#0d1b21] border-b border-[#325a67] flex items-center justify-between px-6">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-[#192d33] rounded-lg transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="p-2 hover:bg-[#192d33] rounded-lg transition-colors">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-background-dark p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
