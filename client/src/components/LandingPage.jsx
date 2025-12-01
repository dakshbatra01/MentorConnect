import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LiquidEther from './LiquidEther';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      name: "Alex Johnson",
      role: "Software Engineer, TechCorp",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBGcX386klwNIVo-1zdps9dtuZdL1EYQOrALnHKtX3GQvIMmxUEZMtBRUq96fWWJ4BJ1x9d2qD60xYwT4cta2kCnc3R69cCcDhSPyDCKEpLqKSfs8oide-E1ZOdu96QPiA4LA9EIjZFLgPI58Dv8JgczErEkLMvlnBODaYNpm-xaWNDCItBQjyfqyRq819k6738kJ2jBqm-C38JbIonvDsbdznviFp5ipbWJqeMuXRdqgSR1rfKccRzFuv5_oHZir3NhTXDfMQr-p7",
      text: "MentorConnect was a game-changer for my career transition. My mentor provided invaluable insights that I couldn't find anywhere else. Highly recommended!"
    },
    {
      name: "Sarah Martinez",
      role: "Product Designer, InnovateLab",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      text: "Finding the right mentor was seamless! The platform connected me with an expert who understood my goals and helped me level up my design skills tremendously."
    },
    {
      name: "Michael Chen",
      role: "Data Scientist, Analytics Co",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      text: "As a mentor, I love how MentorConnect makes it easy to share my knowledge. The scheduling system is intuitive, and I've met so many motivated learners."
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Manager, BrandWorks",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      text: "The quality of mentors on this platform is outstanding. I've gained practical marketing strategies that immediately impacted my campaigns. Worth every session!"
    },
    {
      name: "David Thompson",
      role: "Startup Founder, TechVentures",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      text: "MentorConnect helped me navigate the challenging early stages of my startup. My mentor's guidance on fundraising and product development was invaluable."
    }
  ];

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    // Scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-slide testimonials every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextReview();
    }, 7000);

    return () => clearInterval(interval);
  }, [currentReview]);


  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* LiquidEther Background */}
      <div className="fixed inset-0 z-0">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Content Layer */}
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <div className="flex flex-1 justify-center px-4 sm:px-8 md:px-20 lg:px-40 py-5">
          <div className="layout-content-container flex flex-col max-w-5xl flex-1">
            {/* Header */}
            <header className="sticky top-5 z-50 flex items-center justify-between whitespace-nowrap rounded-full bg-background-dark/50 backdrop-blur-lg border border-solid border-white/10 px-4 py-2">
              <a className="flex items-center gap-3 text-white" href="#">
                <div className="size-8 text-primary flex items-center justify-center">
                  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                  </svg>
                </div>
                <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">MentorConnect</h2>
              </a>
              <div className="hidden md:flex flex-1 justify-end gap-6 items-center">
                <nav className="flex items-center gap-6">
                  <a className="text-white/80 hover:text-white transition-colors text-sm font-medium leading-normal" href="#features">How it Works</a>
                  <a className="text-white/80 hover:text-white transition-colors text-sm font-medium leading-normal" href="#features">Features</a>
                  <a className="text-white/80 hover:text-white transition-colors text-sm font-medium leading-normal" href="#testimonials">Testimonials</a>
                </nav>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 ease-in-out active:scale-95"
                  >
                    <span className="truncate">Login</span>
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-primary hover:bg-opacity-90 text-background-dark text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 ease-in-out active:scale-95"
                  >
                    <span className="truncate">Sign Up</span>
                  </button>
                </div>
              </div>
              <div className="md:hidden">
                <button className="text-white p-2">
                  <span className="material-symbols-outlined">menu</span>
                </button>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col gap-24 md:gap-32 mt-16 md:mt-20">
              {/* Hero Section */}
              <section className="scroll-animate in-view @container">
                <div className="@[480px]:p-0">
                  <div
                    className="flex min-h-[480px] flex-col gap-6 @[480px]:gap-8 @[480px]:rounded-2xl items-center justify-center px-4 py-8 @[480px]:px-10 text-center relative overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10"
                  >
                    <div className="flex flex-col gap-4 items-center z-10">
                      <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl max-w-3xl">
                        Unlock Your Full Potential Through Mentorship
                      </h1>
                      <h2 className="text-white/80 text-base font-normal leading-normal @[480px]:text-lg max-w-2xl">
                        Connect with expert mentors dedicated to helping you achieve your personal and professional goals.
                      </h2>
                    </div>
                    <button
                      onClick={() => navigate('/signup')}
                      className="z-10 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 @[480px]:h-14 @[480px]:px-6 bg-primary hover:bg-opacity-90 text-background-dark text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg transition-all duration-300 ease-in-out active:scale-95 transform hover:scale-105"
                    >
                      <span className="truncate">Get Started for Free</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section className="flex flex-col gap-12 px-4 py-10 @container" id="features">
                <div className="scroll-animate flex flex-col gap-4 text-center items-center">
                  <h2 className="text-white tracking-light text-3xl font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                    Personalized Guidance for Your Journey
                  </h2>
                  <p className="text-white/70 text-base font-normal leading-normal max-w-[720px]">
                    We provide the tools and connections you need to succeed. Our platform is built to foster meaningful mentorships that drive real results.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-0">
                  <div className="scroll-animate scroll-animate-delay-1 flex flex-1 gap-4 rounded-xl border border-white/10 bg-white/5 p-6 flex-col items-start text-left backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                    <div className="text-primary p-3 bg-primary/20 rounded-lg">
                      <span className="material-symbols-outlined !text-3xl">groups</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold leading-tight">Personalized Matching</h3>
                      <p className="text-[#92bbc9] text-sm font-normal leading-normal">Our smart algorithm connects you with mentors who align with your goals and industry.</p>
                    </div>
                  </div>
                  <div className="scroll-animate scroll-animate-delay-2 flex flex-1 gap-4 rounded-xl border border-white/10 bg-white/5 p-6 flex-col items-start text-left backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                    <div className="text-primary p-3 bg-primary/20 rounded-lg">
                      <span className="material-symbols-outlined !text-3xl">trending_up</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold leading-tight">Skill Development</h3>
                      <p className="text-[#92bbc9] text-sm font-normal leading-normal">Access curated resources and track your progress as you learn new skills.</p>
                    </div>
                  </div>
                  <div className="scroll-animate scroll-animate-delay-3 flex flex-1 gap-4 rounded-xl border border-white/10 bg-white/5 p-6 flex-col items-start text-left backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                    <div className="text-primary p-3 bg-primary/20 rounded-lg">
                      <span className="material-symbols-outlined !text-3xl">work</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold leading-tight">Career Guidance</h3>
                      <p className="text-[#92bbc9] text-sm font-normal leading-normal">Receive expert advice and insights to navigate your career path with confidence.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Testimonials Section */}
              <section className="scroll-animate flex flex-col gap-8 items-center px-4" id="testimonials">
                <h2 className="text-white text-3xl font-bold leading-tight tracking-[-0.015em]">Trusted by Students & Mentors</h2>
                <div className="relative w-full max-w-3xl">
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentReview * 100}%)` }}
                    >
                      {reviews.map((review, index) => (
                        <div
                          key={index}
                          className="min-w-full flex flex-col items-center gap-6 p-8 md:p-12 text-center"
                        >
                          <img
                            className="w-24 h-24 rounded-full object-cover border-4 border-white/10"
                            alt={`Portrait of ${review.name}`}
                            src={review.image}
                          />
                          <p className="text-white/90 text-lg md:text-xl italic">"{review.text}"</p>
                          <div>
                            <p className="text-white font-bold">{review.name}</p>
                            <p className="text-[#92bbc9] text-sm">{review.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6">
                    <button
                      onClick={prevReview}
                      className="p-3 rounded-full bg-background-dark/80 hover:bg-background-dark text-white transition-all hover:scale-110 shadow-lg"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
                    </button>
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6">
                    <button
                      onClick={nextReview}
                      className="p-3 rounded-full bg-background-dark/80 hover:bg-background-dark text-white transition-all hover:scale-110 shadow-lg"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_forward_ios</span>
                    </button>
                  </div>
                  <div className="flex gap-2 justify-center mt-6">
                    {reviews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentReview(index)}
                        className={`h-2 rounded-full transition-all ${index === currentReview ? 'bg-primary w-6' : 'bg-white/30 w-2 hover:bg-white/50'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="scroll-animate bg-white/5 rounded-xl border border-white/10 p-8 md:p-12 my-10 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-white text-3xl font-bold leading-tight tracking-[-0.015em]">Ready to Start Your Journey?</h2>
                    <p className="text-[#92bbc9] max-w-lg">Join a community of ambitious learners and experienced mentors. Your future self will thank you.</p>
                  </div>
                  <button
                    onClick={() => navigate('/signup')}
                    className="flex-shrink-0 w-full md:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary hover:bg-opacity-90 text-background-dark text-base font-bold leading-normal tracking-[0.015em] transition-all duration-300 ease-in-out active:scale-95 transform hover:scale-105 flex"
                  >
                    <span className="truncate">Join MentorConnect Today</span>
                  </button>
                </div>
              </section>
            </main>

            {/* Footer */}
            <footer className="text-white/60 border-t border-solid border-white/10 pt-8 pb-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="size-6 text-primary">
                    <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                    </svg>
                  </div>
                  <h2 className="text-white/80 text-base font-bold leading-tight">MentorConnect</h2>
                </div>
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                  <a className="hover:text-white transition-colors" href="#">About Us</a>
                  <a className="hover:text-white transition-colors" href="#">Contact</a>
                  <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
                  <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
                </nav>
                <p className="text-sm text-center md:text-right">© 2025 MentorConnect. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
