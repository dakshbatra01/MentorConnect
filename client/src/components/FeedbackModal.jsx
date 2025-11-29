import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

export default function FeedbackModal({ session, onClose, onSuccess }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [categories, setCategories] = useState({
        communication: 5,
        knowledge: 5,
        helpfulness: 5,
        professionalism: 5
    });

    const handleCategoryChange = (category, value) => {
        setCategories(prev => ({ ...prev, [category]: parseInt(value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/feedback/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({
                    sessionId: session._id,
                    mentorId: session.mentorId._id,
                    rating,
                    comment,
                    categories
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit feedback');
            }

            onSuccess(data);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#111e22] border border-white/10 rounded-xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-xl font-bold">Leave Feedback</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Overall Rating */}
                    <div className="text-center">
                        <label className="block text-white/60 text-sm mb-2">Overall Rating</label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-3xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-white/20'}`}
                                >
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-3">
                        <p className="text-white font-medium text-sm border-b border-white/10 pb-2">Detailed Ratings</p>
                        {Object.keys(categories).map((cat) => (
                            <div key={cat} className="flex items-center justify-between">
                                <span className="text-white/60 text-sm capitalize">{cat}</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => handleCategoryChange(cat, val)}
                                            className={`size-6 rounded flex items-center justify-center text-xs transition-colors ${categories[cat] >= val
                                                ? 'bg-primary text-background-dark font-bold'
                                                : 'bg-white/5 text-white/40'
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-white/60 text-sm mb-1">Comment</label>
                        <textarea
                            rows="3"
                            required
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg bg-primary text-background-dark font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
}
