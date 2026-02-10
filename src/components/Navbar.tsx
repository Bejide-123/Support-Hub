// components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if link is active
  const isActive = (path: string) => {
    if (path.startsWith('#')) {
      return location.hash === path;
    }
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Nav items with paths
  const navItems = [
    { path: '#hero', label: 'Home' },
    { path: '#faq', label: 'FAQ' },
    { path: '#contact', label: 'Contact' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-200' 
        : 'bg-white/90 backdrop-blur-md border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700' 
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600'
              }`}>
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  SupportHub
                </span>
                <div className="text-xs text-gray-500 font-medium transition-opacity duration-300">
                  {isScrolled ? 'Support System' : 'Customer Support System'}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              item.path.startsWith('#') ? (
                <a
                  key={item.path}
                  href={item.path}
                  className={`px-6 py-3 font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`px-6 py-3 font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
            
            {/* Divider */}
            <div className="h-8 w-px bg-gray-200 mx-4"></div>
            
            {/* Auth Buttons */}
            <Link 
              to="/login" 
              className={`px-6 py-3 font-medium border-2 rounded-xl hover:bg-emerald-50 transition-all duration-200 hover:shadow-sm ${
                isActive('/login')
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-600'
                  : 'text-emerald-600 border-emerald-500'
              }`}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className={`ml-2 px-6 py-3 bg-gradient-to-r text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 shadow-md ${
                isScrolled
                  ? 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                  : 'from-emerald-500 to-teal-500'
              }`}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-6 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-4 px-2">
              {navItems.map((item) => (
                item.path.startsWith('#') ? (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`px-5 py-4 font-medium rounded-xl transition-colors text-lg ${
                      isActive(item.path)
                        ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                        : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-5 py-4 font-medium rounded-xl transition-colors text-lg ${
                      isActive(item.path)
                        ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                        : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <Link
                  to="/login"
                  className={`block px-5 py-4 text-center font-medium rounded-xl border-2 transition-colors text-lg ${
                    isActive('/login')
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-600'
                      : 'text-emerald-600 border-emerald-500 hover:bg-emerald-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-5 py-4 text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;