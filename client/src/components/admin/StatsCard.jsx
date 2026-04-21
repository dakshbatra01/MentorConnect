import React from 'react';

export default function StatsCard({ title, value, icon, trend, trendLabel, color = 'primary' }) {
    const colorClasses = {
        primary: 'from-blue-500 to-blue-600',
        success: 'from-green-500 to-green-600',
        warning: 'from-yellow-500 to-yellow-600',
        danger: 'from-red-500 to-red-600',
        purple: 'from-purple-500 to-purple-600',
    };

    return (
        <div className="bg-[#0d1b21] rounded-xl border border-[#325a67] p-6 hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-[#92bbc9] text-sm font-medium mb-1">{title}</p>
                    <p className="text-white text-3xl font-bold">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-white">{icon}</span>
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                    {trendLabel && <span className="text-xs text-[#92bbc9]">{trendLabel}</span>}
                </div>
            )}
        </div>
    );
}
