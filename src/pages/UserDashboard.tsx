// pages/UserDashboard.tsx
import { useState } from 'react';
import {
  Ticket,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import DashboardNavbar from '../components/DashboardNavbar';
import NewTicketModal from '../components/NewTicketModal';

const UserDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get user from Redux state
  const { user } = useAppSelector((state) => state.auth);

  // Mock tickets data
  const tickets = [
    { id: 'TKT-001', subject: 'Unable to login to account', status: 'open', priority: 'high', created: '2024-03-15', updated: '2 hours ago' },
    { id: 'TKT-002', subject: 'Payment not processed', status: 'in-progress', priority: 'urgent', created: '2024-03-14', updated: '1 hour ago' },
    { id: 'TKT-003', subject: 'Feature request: Dark mode', status: 'resolved', priority: 'low', created: '2024-03-10', updated: '2 days ago' },
    { id: 'TKT-004', subject: 'Billing invoice error', status: 'closed', priority: 'medium', created: '2024-03-08', updated: '3 days ago' },
  ];

  // Stats data
  const stats = [
    { label: 'Open Tickets', value: '3', icon: <Ticket size={20} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'In Progress', value: '1', icon: <Clock size={20} />, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Resolved', value: '1', icon: <CheckCircle size={20} />, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Tickets', value: '5', icon: <FileText size={20} />, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  // FAQ items
  const faqItems = [
    { question: 'How to reset password?', views: '1.2k views' },
    { question: 'Payment methods accepted?', views: '890 views' },
    { question: 'How to update profile?', views: '756 views' },
    { question: 'Ticket response times?', views: '645 views' },
  ];

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      'open': 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      'resolved': 'bg-green-100 text-green-700',
      'closed': 'bg-gray-100 text-gray-700',
      'urgent': 'bg-red-100 text-red-700',
      'high': 'bg-orange-100 text-orange-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-green-100 text-green-700',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          {user?.position && (
            <p className="text-gray-600">
              {user.position}
            </p>
          )}
          {!user?.position && (
            <p className="text-gray-600">
              Here's an overview of your support tickets and recent activity.
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Grid: Tickets + FAQ */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Tickets List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tickets Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Ticket size={22} className="mr-2 text-emerald-600" />
                Recent Tickets
              </h2>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 whitespace-nowrap"
              >
                <Plus size={18} className="mr-2" />
                New Ticket
              </button>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{ticket.subject}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={ticket.priority} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{ticket.updated}</td>
                        <td className="px-6 py-4">
                          <ChevronRight size={18} className="text-gray-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* View All Link */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <a href="/tickets" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-end">
                  View all tickets
                  <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: FAQ & Common Issues */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MessageSquare size={20} className="mr-2 text-emerald-600" />
                Common Issues
              </h3>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {item.question}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{item.views}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-500" />
                    </div>
                    {index < faqItems.length - 1 && (
                      <hr className="mt-4 border-gray-100" />
                    )}
                  </div>
                ))}
              </div>
              
              <button className="mt-6 w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                View all FAQs →
              </button>
            </div>

            {/* Quick Tip Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <AlertCircle size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Quick Tip</h4>
                  <p className="text-sm text-gray-600">
                    For urgent issues, select "High" priority to get faster response times.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New Ticket Modal */}
      <NewTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default UserDashboard;