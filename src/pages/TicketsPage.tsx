// pages/TicketsPage.tsx
import { useState } from 'react';
import { 
  Ticket, 
  Search, 
  Filter, 
  ChevronRight,
  Clock,
  ArrowUpDown,
  Calendar,
  Download,
  PlusCircle
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import NewTicketModal from '../components/NewTicketModal';

const TicketsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock tickets data
  const tickets = [
    { 
      id: 'TKT-001', 
      subject: 'Unable to login to account', 
      status: 'open', 
      priority: 'high', 
      created: '2024-03-15', 
      updated: '2 hours ago',
      category: 'Technical Issue',
      messages: 8
    },
    { 
      id: 'TKT-002', 
      subject: 'Payment not processed', 
      status: 'in-progress', 
      priority: 'urgent', 
      created: '2024-03-14', 
      updated: '1 hour ago',
      category: 'Billing',
      messages: 12
    },
    { 
      id: 'TKT-003', 
      subject: 'Feature request: Dark mode', 
      status: 'resolved', 
      priority: 'low', 
      created: '2024-03-10', 
      updated: '2 days ago',
      category: 'Feature Request',
      messages: 5
    },
    { 
      id: 'TKT-004', 
      subject: 'Billing invoice error', 
      status: 'closed', 
      priority: 'medium', 
      created: '2024-03-08', 
      updated: '3 days ago',
      category: 'Billing',
      messages: 3
    },
    { 
      id: 'TKT-005', 
      subject: 'Mobile app crash on startup', 
      status: 'open', 
      priority: 'high', 
      created: '2024-03-15', 
      updated: '30 mins ago',
      category: 'Technical Issue',
      messages: 4
    },
    { 
      id: 'TKT-006', 
      subject: 'Email notifications not working', 
      status: 'in-progress', 
      priority: 'medium', 
      created: '2024-03-13', 
      updated: '5 hours ago',
      category: 'Technical Issue',
      messages: 6
    },
    { 
      id: 'TKT-007', 
      subject: 'Subscription upgrade failed', 
      status: 'open', 
      priority: 'urgent', 
      created: '2024-03-15', 
      updated: '15 mins ago',
      category: 'Billing',
      messages: 2
    },
    { 
      id: 'TKT-008', 
      subject: 'Cannot add team members', 
      status: 'resolved', 
      priority: 'low', 
      created: '2024-03-09', 
      updated: '4 days ago',
      category: 'Account Management',
      messages: 7
    },
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    // Search filter
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      case 'oldest':
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      case 'updated':
        return b.updated.localeCompare(a.updated);
      case 'priority':
        const priorityOrder = { 'urgent': 1, 'high': 2, 'medium': 3, 'low': 4 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      default:
        return 0;
    }
  });

  // Stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Ticket className="mr-3 text-emerald-600" size={28} />
              My Tickets
            </h1>
            <p className="text-gray-600">
              View and manage all your support tickets in one place.
            </p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 whitespace-nowrap"
          >
            <PlusCircle size={20} className="mr-2" />
            New Ticket
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Tickets</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Open</p>
            <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Urgent</p>
            <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by ticket ID or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none bg-white"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <ArrowUpDown size={18} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="updated">Recently Updated</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Export Button */}
            <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Download size={18} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{sortedTickets.length}</span> of <span className="font-medium">{tickets.length}</span> tickets
          </p>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedTickets.length > 0 ? (
                  sortedTickets.map((ticket) => (
                    <tr 
                      key={ticket.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() => window.location.href = `/tickets/${ticket.id}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {ticket.subject}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{ticket.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {ticket.created}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {ticket.updated}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {ticket.messages}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ChevronRight size={18} className="text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Ticket size={48} className="text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                        <p className="text-gray-500 mb-6">
                          {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                            ? 'Try adjusting your filters or search query' 
                            : "You haven't created any tickets yet"}
                        </p>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                          Create Your First Ticket
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sortedTickets.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedTickets.length}</span> of <span className="font-medium">{sortedTickets.length}</span> tickets
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
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

export default TicketsPage;