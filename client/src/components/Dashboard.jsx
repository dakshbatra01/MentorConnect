import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative flex min-h-screen w-full bg-background-dark">
      {/* SideNavBar */}
      <aside className="flex flex-col w-64 p-4 bg-background-dark border-r border-white/10 fixed h-full z-20">
        <div className="flex items-center gap-2.5 text-white mb-8 px-2">
          <div className="size-8 text-primary flex items-center justify-center">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight">MentorConnect</h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhjURBa14oRHrjnc60wSKWO909MMJ19CcB3NsgK23AZMbwILX7Lhc2rcz0D5g3ppKKO5yt5HNBv0zvJhQl6OFrh64jJsfR_TpdBDe4TJvYIAL5oPc908la57Swwzmz3v43dcYBkdJc8skFiXSKPEysVHcyEdDI2kApCLVzLo_P8CVCehvM132Gn3RWI51xlW0Slz54O9UwWCeGEpv4Xtikz14AOdMqo2CllepmVhPd1Fm0FdNOuL0O4Xn8bKuvJWxNxVZ2Bao04jdZ')" }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">{user?.name || 'Alex Chen'}</h1>
              <p className="text-white/60 text-sm font-normal leading-normal">{user?.role === 'mentor' ? 'Mentor' : 'Student'}</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2 mt-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </NavLink>
            <NavLink
              to="/mentors"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="material-symbols-outlined">group</span>
              <p className="text-sm font-medium leading-normal">Mentors</p>
            </NavLink>
            <NavLink
              to="/sessions"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="material-symbols-outlined">event_upcoming</span>
              <p className="text-sm font-medium leading-normal">Sessions</p>
            </NavLink>
            <NavLink
              to="/messages"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              <p className="text-sm font-medium leading-normal">Messages</p>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="material-symbols-outlined">person</span>
              <p className="text-sm font-medium leading-normal">Profile</p>
            </NavLink>
          </nav>
        </div>
        <div className="mt-auto space-y-2">
          <button
            onClick={() => navigate('/profile')}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-background-dark text-sm font-bold leading-normal tracking-[0.015em] transition-all"
          >
            <span className="truncate">Edit Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-medium leading-normal tracking-[0.015em] transition-all"
          >
            <span className="material-symbols-outlined text-base mr-2">logout</span>
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* TopNavBar */}
        <header className="flex items-center justify-between sticky top-0 z-10 bg-background-dark/80 backdrop-blur-sm whitespace-nowrap border-b border-white/10 px-10 py-3">
          <div className="flex items-center gap-8">
            <label className="flex flex-col min-w-80 !h-10">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-white/60 flex bg-white/5 items-center justify-center pl-4 rounded-l-lg border border-r-0 border-white/10">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary border border-l-0 border-white/10 bg-white/5 h-full placeholder:text-white/40 px-4 rounded-l-none pl-2 text-base font-normal leading-normal"
                  placeholder="Search for mentors..."
                />
              </div>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA00Iyy-fK9Yp-eHv5UplskAePPc_-C4wytVDu0LJhkBRf_o8cZCE8wme2OUJTN0UYliyxe_wXVFAyziCwlfXiKyiSEtZPTyS-dI6UE4Q7y_e4yE73lIRg90mRC3NDU7DyjjWOd0zl17mRR3HPezG_NyMDDUunyBLXDPtK2fco3DVKMCgBlY7-gTyhr4_-E3BSKZ_Qr6umcEmntwqToI4L7OLpRxxEifWedoL4xQZj5DmfmZOV5XkGZtNzx0ALv-bp_54m_IJhIT9gU')" }}
            ></div>
          </div>
        </header>
        <main className="p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}