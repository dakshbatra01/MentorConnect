import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LiquidEther from './LiquidEther'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    role: 'student',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();

  // My validation functions to ensure data quality
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasNumber && hasSpecial;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // I clear the error when user starts typing for better UX
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('My signup form submitted');
    setError('');
    setIsSubmitting(true);

    try {
      // I validate the name field first
      if (!formData.name.trim()) {
        console.log('My validation error: name required');
        setError('Please enter your full name');
        return;
      }

      // I validate the email format
      if (!validateEmail(formData.email)) {
        console.log('My validation error: invalid email');
        setError('Please enter a valid email address');
        return;
      }

      // I validate password strength requirements
      if (!validatePassword(formData.password)) {
        console.log('My validation error: invalid password');
        setError('Password must be at least 8 characters long and include at least 1 number and 1 special character');
        return;
      }

      // I check if passwords match
      if (formData.password !== formData.confirmPassword) {
        console.log('My validation error: passwords do not match');
        setError('Passwords do not match!');
        return;
      }

      console.log('All my validations passed, calling my signup API');
      const result = await signup(formData.name, formData.email, formData.password, formData.role);

      if (!result.success) {
        console.log('My signup failed:', result.error);
        setError(result.error);
      } else {
        console.log('My signup successful');
      }
      // I redirect the user automatically via my AuthContext when successful
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
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

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl shadow-2xl md:grid-cols-2 backdrop-blur-sm bg-white/5 border border-white/10 animate-fadeInUp">
        {/* Left Panel: Branding */}
        <div className="hidden flex-col justify-center p-12 text-white md:flex">
          <div className="flex items-center gap-3">
            <div className="size-8 text-primary flex items-center justify-center">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
              </svg>
            </div>
            <p className="text-2xl font-bold">MentorConnect</p>
          </div>
          <h1 className="text-white tracking-light text-[32px] font-bold leading-tight pt-10 pb-3">Guiding Your Growth, Together.</h1>
          <p className="text-base font-normal leading-normal text-slate-300">Connect with experienced mentors to accelerate your career and learning journey.</p>
        </div>
        {/* Right Panel: Authentication Form */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <div className="layout-content-container flex flex-col w-full max-w-md mx-auto">
            <div className="flex flex-wrap justify-between gap-3">
              <p className="text-slate-800 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Create Account</p>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pt-4 pb-6">Sign up to start your journey.</p>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">Full Name</p>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-[#325a67] bg-white dark:bg-[#192d33] focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#92bbc9] p-[15px] text-base font-normal leading-normal"
                    placeholder="Enter your full name"
                    required
                  />
                </label>
              </div>
              <div className="flex flex-col">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">I am a</p>
                  <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="form-select flex w-full min-w-0 flex-1 overflow-hidden rounded-lg text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-[#325a67] bg-white dark:bg-[#192d33] focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#92bbc9] px-[15px] text-base font-normal leading-normal"
                    required
                  >
                    <option value="student">Student (Looking for mentorship)</option>
                    <option value="mentor">Mentor (Want to guide others)</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-col">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">Email Address</p>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-[#325a67] bg-white dark:bg-[#192d33] focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#92bbc9] p-[15px] text-base font-normal leading-normal"
                    placeholder="Enter your email"
                    required
                  />
                </label>
              </div>
              <div className="flex flex-col">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">Password</p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-[#325a67] bg-white dark:bg-[#192d33] focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#92bbc9] p-[15px] pr-12 text-base font-normal leading-normal"
                      required
                    />
                    <button
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 dark:text-[#92bbc9] hover:text-slate-700 dark:hover:text-white transition-colors"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">{showPassword ? "visibility" : "visibility_off"}</span>
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-1 sm:mt-2 text-xs">
                      {/* My password strength indicators for better user experience */}
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${formData.password.length >= 8
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {formData.password.length >= 8 ? '✓' : '✗'} 8+ chars
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${/\d/.test(formData.password)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {/\d/.test(formData.password) ? '✓' : '✗'} Number
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✓' : '✗'} Special
                        </span>
                      </div>
                    </div>
                  )}
                </label>
              </div>
              <div className="flex flex-col">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">Confirm Password</p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Enter your password again"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-[#325a67] bg-white dark:bg-[#192d33] focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#92bbc9] p-[15px] pr-12 text-base font-normal leading-normal"
                      required
                    />
                    <button
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 dark:text-[#92bbc9] hover:text-slate-700 dark:hover:text-white transition-colors"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <span className="material-symbols-outlined">{showConfirmPassword ? "visibility" : "visibility_off"}</span>
                    </button>
                  </div>
                </label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center rounded-lg bg-primary h-14 px-6 text-base font-bold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary mt-4"
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </button>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                Already have an account?
                <Link className="font-semibold text-primary hover:underline ml-1" to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
