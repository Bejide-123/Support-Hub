// src/pages/LoginPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, demoLogin, clearError } from '../features/Auth/authSlice';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle,
  MessageSquare,
  Github,
  Twitter,
  Facebook,
  ArrowRight
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Normalize role check (handle 'Agent', 'agent', 'user', 'customer', etc.)
      const role = (user.role ?? '').toString().toLowerCase();
      console.debug('Login redirect - user role:', role, user);
      if (role.includes('agent')) {
        navigate('/agent/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const handleDemoLogin = (role: 'user' | 'agent') => {
    dispatch(demoLogin(role));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* SupportHub Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
              <MessageSquare className="text-white" size={32} />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Support<span className="text-emerald-600">Hub</span>
              </span>
              <span className="text-xs text-gray-500 tracking-wider">CUSTOMER SUPPORT SYSTEM</span>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-gray-100 backdrop-blur-sm bg-white/90">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-gray-600">
              Sign in to your SupportHub account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-shadow"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-shadow"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Quick Demo Access</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('user')}
                disabled={isLoading}
                className="px-4 py-3 border-2 border-emerald-200 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all duration-200 text-sm font-medium flex items-center justify-center group"
              >
                <span>👤 Customer Demo</span>
                <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
              <button
                onClick={() => handleDemoLogin('agent')}
                disabled={isLoading}
                className="px-4 py-3 border-2 border-purple-200 rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all duration-200 text-sm font-medium flex items-center justify-center group"
              >
                <span>👨‍💼 Agent Demo</span>
                <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              Use demo accounts to explore the platform
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <Github size={20} className="text-gray-700 group-hover:text-gray-900" />
              </button>
              <button
                type="button"
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <Twitter size={20} className="text-blue-400 group-hover:text-blue-500" />
              </button>
              <button
                type="button"
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <Facebook size={20} className="text-blue-600 group-hover:text-blue-700" />
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors inline-flex items-center">
                Sign up for free
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-6">
            <Link to="/" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              Home
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              Privacy
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              Terms
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/contact" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              Contact
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            © 2024 SupportHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;