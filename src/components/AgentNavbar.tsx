// components/AgentNavbar.tsx
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../features/Auth/authSlice';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Settings,
  Search, 
  User, 
  LogOut,
  Bell,
  BarChart3,
  ChevronDown,
  MessageSquare
} from 'lucide-react';

const AgentNavbar = () => {
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
    }
    navigate('/login');
  };

  const agent = useAppSelector((state) => state.auth.user) ?? {
    name: 'Agent',
    email: '',
    avatar: 'AG',
    role: 'Agent'
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

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navLinks = [
    { path: '/agent/dashboard', label: 'Dashboard', shortLabel: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/agent/tickets', label: 'Ticket Queue', shortLabel: 'Tickets', icon: <Ticket size={20} /> },
    { path: '/agent/customers', label: 'Customers', shortLabel: 'Customers', icon: <Users size={20} /> },
    { path: '/agent/analytics', label: 'Analytics', shortLabel: 'Analytics', icon: <BarChart3 size={20} /> },
    { path: '/agent/settings', label: 'Settings', shortLabel: 'Settings', icon: <Settings size={20} /> },
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
    className="lg:hidden p-2 mr-2 sm:mr-3 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <Menu size={24} className="text-gray-600" />
  </button>
  
  <Link to="/agent/dashboard" className="flex items-center space-x-2 sm:space-x-3 group">
    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
      <MessageSquare 
        size={18} 
        className="text-white"
        strokeWidth={1.5}
      />
    </div>
    <div className="hidden sm:flex sm:flex-col">
      <span className="text-lg sm:text-xl font-bold text-gray-900">SupportHub</span>
      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full inline-block w-fit mt-0.5">
        Agent
      </span>
    </div>
  </Link>
</div>

            {/* Desktop Navigation - Responsive text */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 xl:px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  <span className="hidden xl:inline">{link.label}</span>
                  <span className="xl:hidden">{link.shortLabel}</span>
                </Link>
              ))}
            </div>

            {/* Right: Notifications & User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors hidden sm:block">
                <Search size={20} className="text-gray-600" />
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
              </button>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center space-x-2 sm:space-x-3 p-1.5 rounded-lg transition-colors ${
                    isDropdownOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                    {agent.avatar}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.role}</p>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform hidden sm:block ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                      <p className="text-xs text-gray-500">{agent.email}</p>
                      <p className="text-xs text-purple-600 mt-1 font-medium">{agent.role}</p>
                    </div>
                    <Link 
                      to="/agent/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                    >
                      <User size={16} className="mr-3 text-gray-400" /> 
                      <span>Your Profile</span>
                    </Link>
                    <Link 
                      to="/agent/settings" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                    >
                      <Settings size={16} className="mr-3 text-gray-400" /> 
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
                      <span>Sign Out</span>
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
          <div className="fixed top-0 left-0 w-72 h-full bg-white shadow-xl animate-in slide-in-from-left duration-300">
            <div className="flex flex-col h-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                      <span className="text-xl font-bold text-gray-900">SupportHub</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full block mt-1">
                        Agent Portal
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>
                
                {/* Agent Info */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-6 border border-purple-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg mr-3 shadow-sm">
                      {agent.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{agent.name}</p>
                      <p className="text-xs text-gray-600">{agent.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive(link.path)
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 mt-auto">
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    handleLogOut();
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentNavbar;