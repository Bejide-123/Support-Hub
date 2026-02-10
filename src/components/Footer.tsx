// components/Footer.tsx
import { Link } from 'react-router-dom';
import { MessageSquare, Facebook, Twitter, Linkedin, Instagram, Github, Mail, ArrowRight, ExternalLink } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'API', href: '#api' },
      { name: 'Documentation', href: '#docs' },
      { name: 'Integrations', href: '#integrations' }
    ],
    Company: [
      { name: 'About Us', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press Kit', href: '#press' },
      { name: 'Partners', href: '#partners' }
    ],
    Support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'System Status', href: '#status' },
      { name: 'Community', href: '#community' },
      { name: 'FAQs', href: '#faqs' }
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Use', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' },
      { name: 'Security', href: '#security' }
    ]
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: <Github size={20} />, href: '#', label: 'GitHub', color: 'hover:bg-gray-700' }
  ];

//   const stats = [
//     { value: '10k+', label: 'Active Users' },
//     { value: '50k+', label: 'Tickets Solved' },
//     { value: '99.9%', label: 'Uptime' },
//     { value: '24/7', label: 'Support' }
//   ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-300 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Section */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-b border-gray-800">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div> */}

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10 py-16">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/50">
                <MessageSquare className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-white">SupportHub</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Modern customer support ticketing system built with cutting-edge technologies. 
              Streamline your support workflow and delight your customers.
            </p>
            
            {/* Social Links */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 text-sm">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${social.color}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs font-medium text-gray-400 border border-gray-700">
                🔒 SOC 2 Certified
              </div>
              <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs font-medium text-gray-400 border border-gray-700">
                ✓ GDPR Compliant
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center">
                <span className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full mr-2"></span>
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-emerald-400 transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight size={14} className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="relative py-12 border-t border-gray-800">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-emerald-500/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-3">
                  <Mail className="text-emerald-400 mr-2" size={24} />
                  <h3 className="text-2xl font-bold text-white">Stay in the Loop</h3>
                </div>
                <p className="text-gray-400">
                  Get the latest updates, product news, and exclusive support tips delivered to your inbox.
                </p>
              </div>
              <div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-5 py-3.5 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-500 transition-all"
                  />
                  <button className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 whitespace-nowrap flex items-center justify-center">
                    Subscribe
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Join 10,000+ subscribers. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* <div className="text-center md:text-left">
              <p className="text-gray-400 flex items-center justify-center md:justify-start flex-wrap gap-1">
                © {new Date().getFullYear()} SupportHub. Made with 
                <Heart size={16} className="text-red-500 mx-1 animate-pulse" /> 
                as a learning project.
              </p>
              <p className="text-sm text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  Built with React
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                </span>
                <span className="flex items-center gap-1">
                  Redux Toolkit
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                </span>
                <span className="flex items-center gap-1">
                  TypeScript
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                </span>
                <span>Supabase</span>
              </p>
            </div> */}
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1">
                Privacy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1">
                Terms
              </a>
              <a href="#cookies" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1">
                Cookies
              </a>
              <a href="#sitemap" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1">
                Sitemap
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Back to Top Button - Optional */}
        <div className="absolute bottom-8 right-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/70 hover:scale-110 transition-all duration-300"
            aria-label="Back to top"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;