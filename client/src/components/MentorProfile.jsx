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

  useEffect(() => {
    fetchMentor();
  }, [id]);

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
                          : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBnOAdsLSH4enB0YvQmOtsNC4w88omV8HRnBoWT0C_16Oj5GJakkNUbGQKhRJvM5WRp1aiaD5efzG8GQhbgURsvedEjxc92f4OoMnuoVVK908SG8WajN-Dod7aVxifvJebeGW3ONuaODHR1zWlGGI4evGN-uPyiIahEaXtFliDscgtGEqAnul7Lg4IrZl_FF7CZG4p1K7gGxZrYZAzTO77S9UciqXuaGDLQlbx8rNARPFjZ427MmmqZyP82cif6WkBHMfzaB2u2SwjD')",
                      }}
                    >
                      {!mentor.profileImage && !mentor.userId?.name && (
                        <div className="w-full h-full flex items-center justify-center bg-primary/20 text-4xl font-bold text-white">
                          M
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                        {mentor.userId?.name || 'Mentor Name'}
                      </p>
                      <p className="text-white/60 text-base font-normal leading-normal">
                        {mentor.experience || 'Experienced Professional'}
                      </p>
                      <p className="text-white/60 text-base font-normal leading-normal">
                        ${mentor.hourlyRate}/hr
                      </p>
                    </div>
                    {user?.role === 'student' && (
                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary hover:bg-primary/90 text-background-dark text-sm font-bold leading-normal tracking-[0.015em] w-full transition-colors"
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
                    <div className="flex border-b border-white/10 px-4">
                      <button
                        onClick={() => setActiveTab('about')}
                        className={`flex flex - col items - center justify - center border - b - [3px] pb - [13px] pt - 4 flex - 1 transition - colors ${activeTab === 'about'
                            ? 'border-b-primary text-white'
                            : 'border-b-transparent text-white/60 hover:text-white'
                          } `}
                      >
                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">About</p>
                      </button>
                      <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex flex - col items - center justify - center border - b - [3px] pb - [13px] pt - 4 flex - 1 transition - colors ${activeTab === 'reviews'
                            ? 'border-b-primary text-white'
                            : 'border-b-transparent text-white/60 hover:text-white'
                          } `}
                      >
                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">Reviews</p>
                      </button>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    {/* About Section */}
                    {activeTab === 'about' && (
                      <section className="space-y-6">
                        <div>
                          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-3">
                            About Me
                          </h2>
                          <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                            {mentor.bio || 'No bio available.'}
                          </p>
                        </div>

                        {mentor.education?.length > 0 && (
                          <div>
                            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                              Education
                            </h2>
                            <div className="relative border-l-2 border-white/10 space-y-8 pl-6">
                              {mentor.education.map((edu, idx) => (
                                <div key={idx} className="relative">
                                  <div className="absolute -left-[35px] top-1.5 h-4 w-4 rounded-full bg-primary ring-8 ring-[#111e22]"></div>
                                  <p className="font-bold text-white">{edu.degree}</p>
                                  <p className="text-sm text-primary font-medium">{edu.institution}</p>
                                  <p className="text-sm text-white/60 mt-1">{edu.year}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </section>
                    )}

                    {/* Reviews Section Placeholder */}
                    {activeTab === 'reviews' && (
                      <div className="text-center py-8">
                        <p className="text-white/60">Reviews coming soon...</p>
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