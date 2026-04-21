import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

export default function FeaturedMentorsCarousel() {
    const [mentors, setMentors] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedMentors();
    }, []);

    useEffect(() => {
        if (mentors.length > 3) {
            const interval = setInterval(() => {
                nextSlide();
            }, 7000);
            return () => clearInterval(interval);
        }
    }, [currentIndex, mentors.length]);

    const fetchFeaturedMentors = async () => {
        try {
            const response = await fetch(`${API_URL}/api/mentor/all?isFeatured=true&limit=10`);
            const data = await response.json();
            setMentors(data.mentors || []);
        } catch (error) {
            console.error('Error fetching featured mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mentors.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + mentors.length) % mentors.length);
    };

    if (loading) return <div className="text-white/60 text-center py-8">Loading featured mentors...</div>;
    if (mentors.length === 0) return null;

    // Helper to get position style
    const getMentorStyle = (index) => {
        if (mentors.length === 0) return {};

        const length = mentors.length;
        // Calculate distance handling wrap-around
        let dist = (index - currentIndex + length) % length;
        // Normalize distance to be shortest path (e.g., -1 instead of length-1)
        if (dist > length / 2) dist -= length;

        // Base styles
        let style = {
            position: 'absolute',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(0.8)',
            opacity: 0,
            zIndex: 0,
            pointerEvents: 'none' // Prevent clicking hidden items
        };

        if (dist === 0) {
            // Center
            style = {
                ...style,
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1.1)',
                opacity: 1,
                zIndex: 20,
                pointerEvents: 'auto'
            };
        } else if (dist === -1) {
            // Left
            style = {
                ...style,
                left: '20%',
                transform: 'translate(-50%, -50%) scale(0.9)',
                opacity: 0.7,
                zIndex: 10,
                pointerEvents: 'auto'
            };
        } else if (dist === 1) {
            // Right
            style = {
                ...style,
                left: '80%',
                transform: 'translate(-50%, -50%) scale(0.9)',
                opacity: 0.7,
                zIndex: 10,
                pointerEvents: 'auto'
            };
        } else if (dist === -2) {
            // Far Left (Hidden but ready to slide in)
            style = {
                ...style,
                left: '-10%',
                opacity: 0
            };
        } else if (dist === 2) {
            // Far Right (Hidden but ready to slide in)
            style = {
                ...style,
                left: '110%',
                opacity: 0
            };
        }

        return style;
    };

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl font-bold">Featured Mentors</h2>
                {mentors.length > 3 && (
                    <div className="flex gap-2">
                        <button
                            onClick={prevSlide}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-30"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-30"
                        >
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="relative h-[450px] w-full overflow-hidden flex items-center justify-center">
                <div className="relative w-full max-w-6xl h-full">
                    {mentors.map((mentor, index) => {
                        const style = getMentorStyle(index);
                        const isCenter = style.zIndex === 20;

                        return (
                            <div
                                key={mentor._id}
                                style={style}
                                className="w-[300px]"
                            >
                                <MentorCard mentor={mentor} isCenter={isCenter} navigate={navigate} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function MentorCard({ mentor, isCenter, navigate }) {
    return (
        <div className={`
            w-full p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 
            flex flex-col items-center text-center transition-all duration-300
            ${isCenter ? 'shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] border-primary/30 bg-white/10' : ''}
        `}>
            <div className="relative mb-4">
                <div className={`
                    rounded-full overflow-hidden border-2 
                    ${isCenter ? 'size-32 border-primary' : 'size-24 border-white/20'}
                    transition-all duration-300
                `}>
                    {mentor.profileImage ? (
                        <img src={mentor.profileImage} alt={mentor.userId.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-2xl">
                            {mentor.userId.name.charAt(0)}
                        </div>
                    )}
                </div>
                {isCenter && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-background-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        FEATURED
                    </div>
                )}
            </div>

            <h3 className={`font-bold text-white mb-1 transition-all ${isCenter ? 'text-2xl' : 'text-lg'}`}>
                {mentor.userId.name}
            </h3>
            <p className="text-white/60 text-sm mb-3 line-clamp-1">{mentor.expertise.join(', ')}</p>

            <div className="flex items-center gap-1 mb-4">
                <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-white font-medium">{mentor.rating.toFixed(1)}</span>
                <span className="text-white/40 text-xs">({mentor.totalSessions} sessions)</span>
            </div>

            <button
                onClick={() => navigate(`/mentor/${mentor._id}`)}
                className={`
                    w-full py-2 rounded-lg font-medium transition-colors
                    ${isCenter
                        ? 'bg-primary text-background-dark hover:bg-primary/90 shadow-lg shadow-primary/20'
                        : 'bg-white/10 text-white hover:bg-white/20'}
                `}
            >
                View Profile
            </button>
        </div>
    );
}
