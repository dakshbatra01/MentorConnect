import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BrowseMentors() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  const API_BASE_URL = 'http://localhost:4000/api';

  useEffect(() => {
    fetchMentors();
  }, [selectedExpertise, minRating, sortBy, page]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = mentors.filter(mentor =>
        mentor.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredMentors(filtered);
    } else {
      setFilteredMentors(mentors);
    }
  }, [searchQuery, mentors]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
        order: 'desc'
      });

      if (selectedExpertise) {
        params.append('expertise', selectedExpertise);
      }
      if (minRating > 0) {
        params.append('minRating', minRating.toString());
      }

      const response = await fetch(`${API_BASE_URL}/mentor/all?${params}`);
      const data = await response.json();

      setMentors(data.mentors || data);
      setFilteredMentors(data.mentors || data);

      if (data.pagination) {
        setTotalPages(data.pagination.pages);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setLoading(false);
    }
  };

  const allExpertise = ['Software Engineering', 'Data Science', 'Product Design', 'Marketing', 'DevOps', 'Business Strategy', 'Career Development'];

  return (
    <div className="relative flex flex-col w-full">
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Find Your Mentor</h1>
        <p className="text-white/60 text-base">Connect with experienced mentors to accelerate your growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Search & Filter Panel */}
        <aside className="lg:col-span-3">
          <div className="sticky top-28 space-y-6">
            {/* SearchBar */}
            <div>
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-white/60 flex border-r-0 border border-white/10 bg-white/5 items-center justify-center pl-4 rounded-l-lg">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border-l-0 rounded-l-none border border-white/10 bg-white/5 h-full placeholder:text-white/40 px-4 pl-2 text-sm font-normal leading-normal"
                    placeholder="Search by name or skill"
                  />
                </div>
              </label>
            </div>
            <div className="border-t border-white/10"></div>
            {/* Filter Sections */}
            <div className="space-y-6">
              {/* Domain Filter */}
              <div>
                <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-3">Filter by Domain</h3>
                <div className="space-y-2">
                  {allExpertise.map((exp, idx) => (
                    <label key={idx} className="flex items-center gap-x-3 py-1 cursor-pointer">
                      <input
                        checked={selectedExpertise === exp}
                        onChange={() => setSelectedExpertise(selectedExpertise === exp ? '' : exp)}
                        className="form-checkbox h-5 w-5 rounded border-white/10 bg-transparent text-primary checked:bg-primary focus:ring-primary focus:ring-offset-0"
                        type="checkbox"
                      />
                      <p className="text-sm font-normal leading-normal text-white/80">{exp}</p>
                    </label>
                  ))}
                </div>
              </div>
              {/* Rating Filter */}
              <div>
                <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 4.5, 5].map((rating) => (
                    <label key={rating} className="flex items-center gap-x-3 py-1 cursor-pointer">
                      <input
                        checked={minRating === rating}
                        onChange={() => setMinRating(minRating === rating ? 0 : rating)}
                        className="form-radio h-5 w-5 border-white/10 bg-transparent text-primary focus:ring-primary"
                        name="rating"
                        type="radio"
                      />
                      <p className="text-sm font-normal leading-normal text-white/80 flex items-center gap-1">
                        {rating}+ <span className="material-symbols-outlined text-yellow-400 !text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </p>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedExpertise('');
                  setMinRating(0);
                }}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white/5 border border-white/10 text-white text-sm font-medium leading-normal hover:bg-white/10 transition-colors"
              >
                <span className="truncate">Reset Filters</span>
              </button>
            </div>
          </div>
        </aside>
        {/* Right Content: Mentor Grid */}
        <section className="lg:col-span-9">
          {/* Results Header with Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-sm text-white/60">
              Showing {filteredMentors.length} {filteredMentors.length === 1 ? 'mentor' : 'mentors'}
            </p>
            <div className="flex items-center gap-3">
              <label className="text-sm text-white/60">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="rating">Rating</option>
                <option value="experience">Experience</option>
                <option value="rate">Hourly Rate</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-white/60">Loading mentors...</p>
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-white/40 text-6xl mb-4">search_off</span>
              <p className="text-white/60">No mentors found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedExpertise('');
                  setMinRating(0);
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-primary text-background-dark font-medium hover:bg-primary/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div key={mentor._id} className="group relative flex flex-col rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
                  <div
                    className="mx-auto size-24 rounded-full bg-cover bg-center mb-4 bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold"
                    style={mentor.profileImage ? {
                      backgroundImage: `url('${mentor.profileImage}')`,
                    } : {}}
                  >
                    {!mentor.profileImage && (mentor.userId?.name?.[0] || 'M')}
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {mentor.userId?.name || 'Mentor'}
                  </h4>
                  <p className="text-sm text-white/60 mb-2 line-clamp-1">
                    {mentor.experience || 'Experienced Professional'}
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <span
                      className="material-symbols-outlined !text-base text-yellow-400"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-sm font-medium text-white">
                      {mentor.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-white/60">({mentor.totalSessions} sessions)</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {mentor.expertise.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/mentor/${mentor._id}`)}
                    className="mt-auto w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredMentors.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = idx + 1;
                  } else if (page <= 3) {
                    pageNum = idx + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx;
                  } else {
                    pageNum = page - 2 + idx;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`size-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${page === pageNum
                          ? 'bg-primary text-background-dark'
                          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}