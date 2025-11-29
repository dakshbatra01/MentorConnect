import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/notifications', {
                headers: { 'auth-token': token }
            });
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`http://localhost:4000/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'auth-token': token }
            });
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await markAsRead(notification._id);
        }

        // Navigate based on notification type
        if (notification.type === 'session_booked' || notification.type === 'session_confirmed') {
            navigate('/sessions');
        } else if (notification.type === 'review_reminder') {
            // Navigate to home where pending reviews will be shown
            navigate('/dashboard');
        }

        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10 transition-colors relative"
            >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#111e22] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-white font-bold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-white/40 text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notification.read ? 'bg-white/5' : ''
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-1 size-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-primary' : 'bg-transparent'
                                            }`}></div>
                                        <div>
                                            <p className={`text-sm ${!notification.read ? 'text-white font-medium' : 'text-white/60'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-white/40 mt-1">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
