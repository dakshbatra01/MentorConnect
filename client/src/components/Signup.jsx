import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup({ setIsLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'student',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
  <div className="flex flex-col items-center justify-center px-4 py-6 mx-auto min-h-screen sm:px-6 lg:py-0">
      <a href="#" className="flex items-center mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          <div className="w-6 h-6 sm:w-8 sm:h-8 mr-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">M</div>
          <span className="hidden sm:inline">MentorConnect</span>
          <span className="sm:hidden">MentorConnect</span>    
      </a>
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 space-y-3 sm:p-6 sm:space-y-4 md:space-y-6 md:p-8">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                  Join MentorConnect
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                Create your account and start your learning journey
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <form className="space-y-3 sm:space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                      <label htmlFor="name" className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="John Doe" 
                        required 
                      />
                  </div>
                  <div>
                      <label htmlFor="role" className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Role</label>
                      <select 
                        name="role" 
                        id="role" 
                        value={formData.role}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                  </div>
                  <div>
                      <label htmlFor="email" className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="name@company.com" 
                        required 
                      />
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        required 
                      />
                      {formData.password && (
                        <div className="mt-1 sm:mt-2 text-xs">
                          {/* My password strength indicators for better user experience */}
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                              formData.password.length >= 8 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {formData.password.length >= 8 ? '✓' : '✗'} 8+ chars
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                              /\d/.test(formData.password) 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {/\d/.test(formData.password) ? '✓' : '✗'} Number
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                              /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✓' : '✗'} Special
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                  <div>
                      <label htmlFor="confirmPassword" className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                      <input 
                        type="password" 
                        name="confirmPassword" 
                        id="confirmPassword" 
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        required 
                      />
                  </div>
                  <div className="flex items-start">
                      <div className="flex items-center h-4 sm:h-5">
                        <input id="terms" aria-describedby="terms" type="checkbox" className="w-3 h-3 sm:w-4 sm:h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                      </div>
                      <div className="ml-2 sm:ml-3 text-xs sm:text-sm">
                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-blue-600 hover:underline dark:text-blue-500" href="#">Terms and Conditions</a></label>
                      </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create an account'}
                  </button>
                  <p className="text-xs sm:text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                      Already have an account? <span className="font-medium text-blue-600 hover:underline dark:text-blue-500 underline cursor-pointer" onClick={() => setIsLogin(true)}>Login here</span>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
  )
}
