// pages/HelpCenterPage.tsx
import { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Video,
  ChevronRight,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Zap,
  Shield,
  CreditCard,
  Settings,
  Download,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [helpfulFeedback, setHelpfulFeedback] = useState<number | null>(null);

  // Categories
  const categories = [
    { id: 'all', name: 'All Articles', icon: <BookOpen size={20} /> },
    { id: 'getting-started', name: 'Getting Started', icon: <Zap size={20} /> },
    { id: 'account', name: 'Account & Security', icon: <Shield size={20} /> },
    { id: 'billing', name: 'Billing & Payments', icon: <CreditCard size={20} /> },
    { id: 'tickets', name: 'Tickets & Support', icon: <MessageSquare size={20} /> },
    { id: 'features', name: 'Features & Settings', icon: <Settings size={20} /> },
  ];

  // Featured articles
  const featuredArticles = [
    {
      id: 1,
      title: 'How to create your first support ticket',
      description: 'Learn how to submit a ticket and get help from our support team.',
      category: 'Getting Started',
      readTime: '3 min read',
      views: '2.5k views',
      icon: <MessageSquare size={24} />
    },
    {
      id: 2,
      title: 'Understanding ticket statuses',
      description: 'What do Open, In Progress, Resolved, and Closed mean?',
      category: 'Tickets & Support',
      readTime: '2 min read',
      views: '1.8k views',
      icon: <HelpCircle size={24} />
    },
    {
      id: 3,
      title: 'How to reset your password',
      description: 'Step-by-step guide to reset your account password securely.',
      category: 'Account & Security',
      readTime: '2 min read',
      views: '3.2k views',
      icon: <Shield size={24} />
    },
  ];

  // Popular articles
  const popularArticles = [
    { id: 1, title: 'How to update your profile information', views: '1.2k', category: 'Account' },
    { id: 2, title: 'Payment methods we accept', views: '980', category: 'Billing' },
    { id: 3, title: 'How to cancel your subscription', views: '876', category: 'Billing' },
    { id: 4, title: 'Setting up two-factor authentication', views: '754', category: 'Security' },
    { id: 5, title: 'How to attach files to tickets', views: '654', category: 'Tickets' },
    { id: 6, title: 'Understanding priority levels', views: '543', category: 'Tickets' },
  ];

  // All articles by category
  const articlesByCategory = [
    {
      category: 'Getting Started',
      articles: [
        { title: 'Creating your account', description: 'Sign up and set up your profile in minutes.' },
        { title: 'Dashboard overview', description: 'Learn how to navigate your SupportHub dashboard.' },
        { title: 'Submitting your first ticket', description: 'Step-by-step guide to getting help.' },
      ]
    },
    {
      category: 'Account & Security',
      articles: [
        { title: 'Changing your password', description: 'How to update your password regularly.' },
        { title: 'Two-factor authentication', description: 'Add an extra layer of security to your account.' },
        { title: 'Managing team members', description: 'Add or remove users from your organization.' },
      ]
    },
    {
      category: 'Billing & Payments',
      articles: [
        { title: 'Understanding your invoice', description: 'How to read and download your invoices.' },
        { title: 'Updating payment methods', description: 'Add, remove, or update credit cards.' },
        { title: 'Subscription plans', description: 'Compare features across different plans.' },
      ]
    },
    {
      category: 'Tickets & Support',
      articles: [
        { title: 'Ticket priority explained', description: 'How we prioritize and handle tickets.' },
        { title: 'Response time expectations', description: 'When to expect replies from our team.' },
        { title: 'Closing and reopening tickets', description: 'How to manage resolved issues.' },
      ]
    },
  ];

  // Video tutorials
  const videoTutorials = [
    { title: 'Getting Started with SupportHub', duration: '4:32', views: '1.2k' },
    { title: 'How to Submit a Ticket', duration: '2:15', views: '890' },
    { title: 'Dashboard Walkthrough', duration: '5:45', views: '756' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
            <BookOpen size={18} className="mr-2" />
            <span className="font-medium">Help Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How can we help you today?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Search our knowledge base for answers to common questions or browse by category.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
            <input
              type="text"
              placeholder="Search for articles, guides, tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all shadow-sm hover:shadow-md"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-500 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-600 transition-colors font-medium">
              Search
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-emerald-50 border-emerald-200 shadow-md'
                    : 'bg-white border-gray-200 hover:border-emerald-200 hover:shadow-sm'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto ${
                  selectedCategory === category.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {category.icon}
                </div>
                <span className={`text-sm font-medium block text-center ${
                  selectedCategory === category.id ? 'text-emerald-700' : 'text-gray-700'
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Featured Articles</h2>
            <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
              View all
              <ArrowRight size={16} className="ml-1" />
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <div 
                key={article.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                  <div className="text-emerald-600 group-hover:text-white transition-colors">
                    {article.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                  <span className="text-xs text-gray-500">{article.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid: Articles + Popular */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          
          {/* Articles by Category - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {articlesByCategory.map((section, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{section.category}</h3>
                <div className="space-y-4">
                  {section.articles.map((article, index) => (
                    <div 
                      key={index}
                      className="group cursor-pointer border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors mb-1">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-500">{article.description}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
                  View all {section.category} articles
                  <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            ))}

            {/* Video Tutorials Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                  <Video size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Video Tutorials</h3>
                  <p className="text-sm text-gray-600">Learn faster with our step-by-step videos</p>
                </div>
              </div>
              <div className="space-y-3">
                {videoTutorials.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                        <Video size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{video.title}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>{video.duration}</span>
                          <span className="mx-2">•</span>
                          <span>{video.views} views</span>
                        </div>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Popular Articles & Contact */}
          <div className="space-y-6">
            
            {/* Popular Articles */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ThumbsUp size={18} className="mr-2 text-emerald-600" />
                Most Popular
              </h3>
              <div className="space-y-3">
                {popularArticles.map((article) => (
                  <div 
                    key={article.id}
                    className="group cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors mb-1">
                          {article.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{article.category}</span>
                          <span className="ml-2">{article.views} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Still need help?</h3>
              <p className="text-emerald-100 text-sm mb-6">
                Can't find what you're looking for? Our support team is ready to assist you.
              </p>
              
              <div className="space-y-4">
                <button className="w-full py-3 bg-white text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center">
                  <MessageSquare size={18} className="mr-2" />
                  Create a Ticket
                </button>
                
                <div className="flex items-center justify-between pt-4 border-t border-emerald-400">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-500 rounded-lg mr-3">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-100">Email us</p>
                      <p className="text-sm font-medium">support@supporthub.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-500 rounded-lg mr-3">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-100">Call us</p>
                      <p className="text-sm font-medium">1-800-123-4567</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Feedback */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Was this helpful?</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setHelpfulFeedback(1)}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                    helpfulFeedback === 1 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <ThumbsUp size={16} className="mr-2" />
                  Yes
                </button>
                <button 
                  onClick={() => setHelpfulFeedback(0)}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                    helpfulFeedback === 0 
                      ? 'bg-red-50 border-red-500 text-red-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <ThumbsDown size={16} className="mr-2" />
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Download Resources */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Download Resources</h2>
              <p className="text-gray-600 mb-6">
                Get our official guides, quick reference cards, and documentation.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText size={20} className="text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">SupportHub User Guide</p>
                      <p className="text-xs text-gray-500">PDF, 2.4 MB</p>
                    </div>
                  </div>
                  <Download size={18} className="text-gray-500 hover:text-emerald-600 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText size={20} className="text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">API Documentation</p>
                      <p className="text-xs text-gray-500">PDF, 1.8 MB</p>
                    </div>
                  </div>
                  <Download size={18} className="text-gray-500 hover:text-emerald-600 cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                <BookOpen size={64} className="text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Still Need Help Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Our support team is available Monday-Friday, 8:30AM-5PM CST. We typically respond within 2 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:shadow-lg transition-shadow">
              Contact Support
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Browse Community
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpCenterPage;