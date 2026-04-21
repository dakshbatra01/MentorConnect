import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookingModal from './BookingModal';
import API_URL from '../config';

export default function MentorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    fetchMentor();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'reviews' && mentor?.userId?._id) {
      fetchReviews();
    }
  }, [activeTab, mentor]);

  const fetchMentor = async () => {
    try {
      const response = await fetch(`${API_URL}/api/mentor/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch mentor profile');
      }

      setMentor(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`${API_URL}/api/feedback/mentor/${mentor.userId._id}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.feedback || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Error: {error || 'Mentor not found'}</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
              {/* Left (Sticky) Panel */}
              <aside className="md:col-span-4 lg:col-span-3">
                <div className="sticky top-8 space-y-6">
                  {/* Profile Header Component */}
                  <div className="flex flex-col gap-4 items-center text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-sm">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-32 h-32"
                      style={{
                        backgroundImage: mentor.profileImage
                          ? `url('${mentor.profileImage}')`
                          : mentor.gender === 'female'
                            ? `url('https://avatar.iran.liara.run/public/girl?username=${mentor.userId?.name || 'User'}')`
                            : `url('https://avatar.iran.liara.run/public/boy?username=${mentor.userId?.name || 'User'}')`,
                      }}
                    >
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                        {mentor.userId?.name || 'Mentor Name'}
                      </p>
                      <p className="text-white/60 text-base font-normal leading-normal">
                        {mentor.experience || 'Experienced Professional'}
                      </p>
                      <p className="text-white/60 text-base font-normal leading-normal">
                        ${mentor.hourlyRate !== undefined ? mentor.hourlyRate : 0}/hr
                      </p>
                      {/* Debug info if needed, or just ensure gender defaults to something reasonable */}
                    </div>
                    {user?.role === 'student' && (
                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-primary text-background-dark hover:bg-primary/90 text-sm font-bold leading-normal tracking-[0.015em] transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                      >
                        <span className="truncate">Request a Session</span>
                      </button>
                    )}
                  </div>
                  {/* Profile Stats Component */}
                  <div className="space-y-3 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-sm">
                    <div className="flex flex-col gap-2 rounded-lg border border-white/10 p-3 text-center">
                      <p className="text-white tracking-light text-2xl font-bold leading-tight">{mentor.rating.toFixed(1)}</p>
                      <div className="flex items-center justify-center gap-1.5 text-white/60">
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                          star
                        </span>
                        <p className="text-sm font-normal leading-normal">Rating</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-lg border border-white/10 p-3 text-center">
                      <p className="text-white tracking-light text-2xl font-bold leading-tight">{mentor.totalSessions}</p>
                      <div className="flex items-center justify-center gap-1.5 text-white/60">
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                          group
                        </span>
                        <p className="text-sm font-normal leading-normal">Sessions</p>
                      </div>
                    </div>
                  </div>
                  {/* Chips Component */}
                  <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-4">Expertise</h3>
                    <div className="flex gap-2 flex-wrap">
                      {mentor.expertise.map((skill, idx) => (
                        <div key={idx} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary/20 px-3">
                          <p className="text-primary text-sm font-medium leading-normal">{skill}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
              {/* Right (Scrollable) Content Area */}
              <div className="md:col-span-8 lg:col-span-9">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-sm">
                  {/* Tabs Component */}
                  <div>
                    <div className="flex border-b border-white/10">
                      <button
                        onClick={() => setActiveTab('about')}
                        className={`flex-1 py-4 text-center relative transition-colors ${activeTab === 'about'
                          ? 'text-white'
                          : 'text-white/40 hover:text-white/60'
                          }`}
                      >
                        <p className="text-sm font-bold tracking-wide uppercase">About</p>
                        {activeTab === 'about' && (
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-600"></div>
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex-1 py-4 text-center relative transition-colors ${activeTab === 'reviews'
                          ? 'text-white'
                          : 'text-white/40 hover:text-white/60'
                          }`}
                      >
                        <p className="text-sm font-bold tracking-wide uppercase">Reviews</p>
                        {activeTab === 'reviews' && (
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-600"></div>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    {/* About Section */}
                    {activeTab === 'about' && (
                      <section className="space-y-6">
                        <div>
                          <h2 className="text-white text-2xl font-bold leading-tight tracking-tight mb-4">
                            About Me
                          </h2>
                          <p className="text-white/80 leading-7 text-base whitespace-pre-wrap font-light break-words">
                            {mentor.bio && mentor.bio.trim() !== '' ? mentor.bio : 'No bio available for this mentor.'}
                          </p>
                        </div>

                        {mentor.education?.length > 0 && (
                          <div>
                            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                              Education
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {mentor.education.map((edu, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                      <span className="material-symbols-outlined text-xl">school</span>
                                    </div>
                                    <div>
                                      <p className="font-bold text-white text-lg">{edu.degree}</p>
                                      <p className="text-white/60 font-medium">{edu.institution}</p>
                                      <p className="text-sm text-primary mt-1 font-mono">{edu.year}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </section>
                    )}

                    {/* Reviews Section */}
                    {activeTab === 'reviews' && (
                      <div className="space-y-6">
                        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                          Student Reviews
                        </h2>

                        {reviewsLoading ? (
                          <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        ) : reviews.length > 0 ? (
                          <div className="grid gap-4">
                            {reviews.map((review) => (
                              <div key={review._id} className="p-6 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                                      {review.studentId?.name?.[0] || 'S'}
                                    </div>
                                    <div>
                                      <p className="text-white font-semibold">{review.studentId?.name || 'Student'}</p>
                                      <p className="text-white/40 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <div className="flex text-yellow-400 bg-black/20 px-2 py-1 rounded-lg">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} className={`material-symbols-outlined text-sm ${i < review.rating ? 'fill-current' : 'text-gray-700'}`}>
                                        star
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-white/80 leading-relaxed italic break-words">"{review.comment}"</p>

                                {/* Categories Display */}
                                {review.categories && (
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {Object.entries(review.categories).map(([key, value]) => (
                                      <div key={key} className="px-2 py-1 rounded bg-white/5 text-xs text-white/60 capitalize flex items-center gap-1">
                                        <span>{key}:</span>
                                        <span className="text-primary font-bold">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <span className="material-symbols-outlined text-white/40 text-6xl mb-4">rate_review</span>
                            <p className="text-white/60">No reviews yet.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showBookingModal && (
        <BookingModal
          mentor={mentor}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            // Show success message or redirect
            alert('Session booked successfully!');
          }}
        />
      )}
    </div>
  );
}