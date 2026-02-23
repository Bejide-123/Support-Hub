// components/DashboardNavbar.tsx
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../features/Auth/authSlice';
import { 
  Menu, 
  X, 
  Home, 
  Ticket, 
  HelpCircle, 
  Search, 
  User, 
  LogOut,
  FileText,
  Bell,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';

const DashboardNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  

  const handleLogOut = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (err) {
      // ignore or show toast
      console.error('Logout failed:', err);
    }
    // redirect to login regardless
    navigate('/login');
  };

  const user = useAppSelector((state) => state.auth.user) ?? {
    name: 'Guest',
    email: '',
    avatar: 'G',
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/tickets', label: 'My Tickets', icon: <Ticket size={20} /> },
    { path: '/faq', label: 'Help Center', icon: <HelpCircle size={20} /> },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center">
  <button 
    onClick={() => setIsSidebarOpen(true)}
    className="lg:hidden p-2 mr-3 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <Menu size={24} className="text-gray-600" />
  </button>
  
  <Link to="/dashboard" className="flex items-center space-x-3 group">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
      <MessageSquare 
        size={20} 
        className="text-white"
        strokeWidth={1.5}
      />
    </div>
    <div className="hidden sm:flex sm:flex-col">
      <span className="text-xl font-bold text-gray-900">Support<span className="text-emerald-600">Hub</span></span>
      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full inline-block w-fit mt-0.5">
        Customer
      </span>
    </div>
  </Link>
</div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-emerald-50 text-emerald-600 font-medium'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Search size={20} className="text-gray-600" />
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center space-x-3 p-1.5 rounded-lg transition-colors ${
                    isDropdownOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                    {user.avatar}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info in Dropdown */}
                    <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                    >
                      <User size={16} className="mr-3 text-gray-400" /> 
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      to="/settings" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                    >
                      <FileText size={16} className="mr-3 text-gray-400" /> 
                      <span>Settings</span>
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogOut();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl animate-in slide-in-from-left duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">SupportHub</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
              
              {/* User Info in Mobile */}
              <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-sm">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-emerald-50 text-emerald-600 font-medium'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-50 transition-colors"
                >
                  <User size={20} className="mr-3" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-50 transition-colors"
                >
                  <FileText size={20} className="mr-3" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    handleLogOut();
                    // Add logout logic here
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavbar;