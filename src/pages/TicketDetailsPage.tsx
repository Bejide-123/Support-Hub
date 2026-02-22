// pages/TicketDetailPage.tsx
import { useState } from 'react';
import {  Link } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  Paperclip,
  Send,
  Clock,
  User,
  Download,
  ChevronDown,
  Tag,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const TicketDetailPage = () => {
  // const { id } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Mock ticket data
  const ticket = {
    id: 'TKT-002',
    subject: 'Payment not processed',
    status: 'in-progress',
    priority: 'urgent',
    category: 'Billing',
    created: '2024-03-14',
    updated: '1 hour ago',
    description: 'I tried to make a payment for my subscription but the transaction keeps failing. I have tried multiple cards and all of them get declined. My subscription is about to expire and I don\'t want to lose access.',
    attachments: [
      { name: 'error-screenshot.png', size: '2.3 MB' },
      { name: 'payment-receipt.pdf', size: '1.1 MB' }
    ]
  };

  // Mock conversation thread
  const messages = [
    {
      id: 1,
      author: 'John Doe',
      avatar: 'JD',
      role: 'customer',
      message: 'I tried to make a payment for my subscription but the transaction keeps failing. I have tried multiple cards and all of them get declined. My subscription is about to expire and I don\'t want to lose access.',
      timestamp: '2024-03-14 10:23 AM',
      isCustomer: true
    },
    {
      id: 2,
      author: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'support agent',
      message: 'Hi John, I\'m sorry to hear you\'re having trouble with your payment. Let me look into this for you. Could you confirm which payment method you were trying to use?',
      timestamp: '2024-03-14 11:45 AM',
      isCustomer: false
    },
    {
      id: 3,
      author: 'John Doe',
      avatar: 'JD',
      role: 'customer',
      message: 'I was trying to use my Visa credit card ending in 4242. It worked fine last month.',
      timestamp: '2024-03-14 12:15 PM',
      isCustomer: true
    },
    {
      id: 4,
      author: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'support agent',
      message: 'Thank you for that information. I can see the failed attempts in our system. It looks like your card might have expired. Can you verify the expiration date?',
      timestamp: '2024-03-14 01:30 PM',
      isCustomer: false
    },
    {
      id: 5,
      author: 'John Doe',
      avatar: 'JD',
      role: 'customer',
      message: 'Oh you\'re right! My card expired last month. I completely forgot to update it. I\'ve just added my new card details. Can you try the payment again?',
      timestamp: '2024-03-14 02:00 PM',
      isCustomer: true
    },
    {
      id: 6,
      author: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'support agent',
      message: 'Perfect! I\'ve just processed the payment and it went through successfully. Your subscription is now active and you\'re all set. Is there anything else I can help you with?',
      timestamp: '2024-03-14 02:15 PM',
      isCustomer: false
    }
  ];

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      'open': 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      'resolved': 'bg-green-100 text-green-700',
      'closed': 'bg-gray-100 text-gray-700',
    };
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
        {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: string }) => {
    const styles = {
      'urgent': 'bg-red-100 text-red-700',
      'high': 'bg-orange-100 text-orange-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-green-100 text-green-700',
    };
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Message sent:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back button */}
        <Link 
          to="/tickets" 
          className="inline-flex items-center text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Tickets
        </Link>

        {/* Ticket Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            
            {/* Left: Title and ID */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>
                <span className="text-sm text-gray-500">#{ticket.id}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                <span className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  Created {ticket.created}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  Updated {ticket.updated}
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                  Change Status
                  <ChevronDown size={16} className="ml-2" />
                </button>
                
                {showStatusDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                    {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                      <button
                        key={status}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowStatusDropdown(false)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Edit size={18} />
              </button>
              
              <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Description</h3>
            <p className="text-gray-600">{ticket.description}</p>
          </div>

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Paperclip size={16} className="mr-2" />
                Attachments
              </h3>
              <div className="flex flex-wrap gap-3">
                {ticket.attachments.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer group"
                  >
                    <div className="p-2 bg-white rounded-lg mr-3">
                      <Paperclip size={16} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                    <Download size={16} className="ml-4 text-gray-400 group-hover:text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Conversation Thread */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <MessageSquare size={20} className="mr-2 text-emerald-600" />
              Conversation
              <span className="ml-3 text-sm font-normal text-gray-500">
                {messages.length} messages
              </span>
            </h2>
          </div>

          {/* Messages */}
          <div className="p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isCustomer ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex max-w-3xl ${msg.isCustomer ? '' : 'flex-row-reverse'}`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${msg.isCustomer ? 'mr-4' : 'ml-4'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                      msg.isCustomer 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                    }`}>
                      {msg.avatar}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 ${msg.isCustomer ? '' : 'items-end'}`}>
                    <div className={`flex items-center mb-1 ${msg.isCustomer ? '' : 'flex-row-reverse'}`}>
                      <span className="text-sm font-medium text-gray-900">
                        {msg.author}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {msg.timestamp}
                      </span>
                      {!msg.isCustomer && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          Agent
                        </span>
                      )}
                    </div>
                    
                    <div className={`rounded-2xl p-4 ${
                      msg.isCustomer
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    }`}>
                      <p className="text-sm leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <div className="px-6 py-5 border-t border-gray-200 bg-gray-50">
            <form onSubmit={handleSendMessage}>
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none resize-none"
                  />
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        className="flex items-center text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <Paperclip size={16} className="mr-1" />
                        Attach files
                      </button>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} className="mr-2" />
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Ticket Info Sidebar - For desktop you could add this as a right column */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <User size={16} className="mr-2 text-emerald-600" />
              Customer Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium mr-3">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">john.doe@example.com</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Account created</p>
                <p className="text-sm text-gray-900">March 1, 2024</p>
              </div>
            </div>
          </div>

          {/* Agent Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <User size={16} className="mr-2 text-purple-600" />
              Assigned Agent
            </h3>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium mr-3">
                SJ
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                <p className="text-xs text-gray-500">Support Specialist</p>
              </div>
            </div>
          </div>

          {/* Ticket Metadata */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <Tag size={16} className="mr-2 text-emerald-600" />
              Ticket Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Category:</span>
                <span className="text-gray-900 font-medium">{ticket.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-900">{ticket.created}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last updated:</span>
                <span className="text-gray-900">{ticket.updated}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetailPage;