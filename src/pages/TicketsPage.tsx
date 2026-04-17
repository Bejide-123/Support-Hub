// pages/TicketsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ticket, 
  Search, 
  Filter, 
  ChevronRight,
  Clock,
  ArrowUpDown,
  Calendar,
  Download,
  PlusCircle,
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import NewTicketModal from '../components/NewTicketModal';
import { fetchUserTickets, selectUserTickets, selectTicketsLoading, selectTicketStats, getUserTicketStats } from "../features/Tickets/ticketsSlice";
import { selectCurrentUser } from '../features/Auth/authSlice';
import { useAppSelector, useAppDispatch } from '../store/hooks';

const TicketsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectCurrentUser);
  const tickets = useAppSelector((state) => 
  user?.id ? selectUserTickets(state, user.id) : []
);
  const isLoading = useAppSelector(selectTicketsLoading);
  const ticketStats = useAppSelector(selectTicketStats);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserTickets(user.id));
      dispatch(getUserTicketStats(user.id));
    }
  }, [dispatch, user?.id]);

  // Stats for cards - using actual data from Redux
  const stats = {
    total: ticketStats?.total || 0,
    open: ticketStats?.open || 0,
    inProgress: ticketStats?.inProgress || 0,
    resolved: ticketStats?.resolved || 0,
    urgent: tickets.filter(t => t.priority === 'urgent').length,
  };

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
    const matchesSearch = ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ticket.id?.toLowerCase().includes(searchQuery.toLowerCase());
    
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
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'updated':
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      case 'priority': {
        const priorityOrder = { 'urgent': 1, 'high': 2, 'medium': 3, 'low': 4 };
        return (priorityOrder[a.priority as keyof typeof priorityOrder] || 5) - 
               (priorityOrder[b.priority as keyof typeof priorityOrder] || 5);
      }
      default:
        return 0;
    }
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : sortedTickets.length > 0 ? (
                  sortedTickets.map((ticket) => (
                    <tr 
                      key={ticket.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/tickets/${ticket.id}`)} // Navigate to ticket details page
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{ticket.ticket_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {ticket.subject}
                        </p>
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
                          {formatDate(ticket.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {formatDate(ticket.updated_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ChevronRight size={18} className="text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
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