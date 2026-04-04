// pages/AgentTicketQueue.tsx
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // Add this import
import {
  Search,
  ChevronRight,
  Clock,
  Download,
  UserPlus,
  Inbox,
  CheckSquare,
  X,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import AgentNavbar from '../components/AgentNavbar';
import { fetchTickets, selectAllTickets, selectTicketsLoading, selectTicketStats, getUserTicketStats } from "../features/Tickets/ticketsSlice";
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectCurrentUser } from '../features/Auth/authSlice';
import { authAPI } from '../features/Auth/authApi';
import type { User } from '../features/Auth/authApi';

const AgentTicketQueue = () => {
  // const navigate = useNavigate(); // Add this hook
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [customerMap, setCustomerMap] = useState<Record<string, User>>({});

  const user = useAppSelector(selectCurrentUser);
  const tickets = useAppSelector(selectAllTickets);
   const isLoading = useAppSelector(selectTicketsLoading);
  const ticketStats = useAppSelector(selectTicketStats);

  useEffect(() => {
      if (user?.id) {
        dispatch(fetchTickets({ status: '', priority: '' }));
        dispatch(getUserTicketStats(user.id));
      }
    }, [dispatch, user?.id]);

  // Fetch customer data for all tickets
  useEffect(() => {
    const fetchCustomerData = async () => {
      const uniqueCustomerIds = [...new Set(tickets.map(t => t.customer_id))];
      const customers: Record<string, User> = {};

      for (const customerId of uniqueCustomerIds) {
        if (!customerMap[customerId]) {
          const customer = await authAPI.getProfileById(customerId);
          if (customer) {
            customers[customerId] = customer;
          }
        }
      }

      setCustomerMap(prev => ({ ...prev, ...customers }));
    };

    if (tickets.length > 0) {
      fetchCustomerData();
    }
  }, [tickets]);

  // Filter states
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    category: [] as string[],
    assignedTo: [] as string[],
    dateRange: 'all'
  });

  const stats = {
    total: ticketStats?.total || 0,
    open: ticketStats?.open || 0,
    inProgress: ticketStats?.inProgress || 0,
    resolved: ticketStats?.resolved || 0,
    urgent: tickets.filter(t => t.priority === 'urgent').length,
    unassigned: tickets.filter(t => !t.assigned_to || t.assigned_to === 'Unassigned').length,
    avgResponse: '4.2m' // This could be added to ticketStats if available
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      'open': 'bg-blue-100 text-blue-700 border-blue-200',
      'in-progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'resolved': 'bg-green-100 text-green-700 border-green-200',
      'closed': 'bg-gray-100 text-gray-700 border-gray-200',
      'urgent': 'bg-red-100 text-red-700 border-red-200',
    };
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
        {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: string }) => {
    const styles = {
      'urgent': 'bg-red-100 text-red-700 border-red-200',
      'high': 'bg-orange-100 text-orange-700 border-orange-200',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'low': 'bg-green-100 text-green-700 border-green-200',
    };
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[priority as keyof typeof styles]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Handle ticket selection
  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const toggleAllTickets = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const customerName = customerMap[ticket.customer_id]?.name || '';
    
    // Search
    const matchesSearch = searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status.length === 0 || filters.status.includes(ticket.status);
    
    // Priority filter
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(ticket.priority);
    
    // Category filter
    const matchesCategory = filters.category.length === 0 || filters.category.includes(ticket.category || '');
    
    // Assigned filter - fixed for real data
    const matchesAssigned = filters.assignedTo.length === 0 || 
                           (filters.assignedTo.includes('unassigned') && !ticket.assigned_to) ||
                           (filters.assignedTo.includes('me') && ticket.assigned_to === user?.name) ||
                           filters.assignedTo.includes(ticket.assigned_to || '');
    
    // View mode
    const matchesView = viewMode === 'all' || 
                       (viewMode === 'unassigned' && !ticket.assigned_to) ||
                       (viewMode === 'assigned-to-me' && ticket.assigned_to === user?.name) ||
                       (viewMode === 'urgent' && ticket.priority === 'urgent');
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssigned && matchesView;
  });

  // Filter options
  const filterOptions = {
    status: ['open', 'in-progress', 'resolved', 'closed', 'urgent'],
    priority: ['urgent', 'high', 'medium', 'low'],
    category: ['Billing', 'Technical Issue', 'Feature Request', 'Account Management', 'API'],
    assignedTo: ['Unassigned', 'You', 'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Kim']
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      category: [],
      assignedTo: [],
      dateRange: 'all'
    });
    setViewMode('all');
    setSearchQuery('');
    setSelectedTickets([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AgentNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Inbox size={28} className="mr-3 text-purple-600" />
              Ticket Queue
            </h1>
            <p className="text-gray-600">
              Manage and respond to customer support tickets.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            >
              <SlidersHorizontal size={18} className="mr-2" />
              Filters
            </button>
            <button 
              onClick={() => {
                clearFilters();
                // You can add refresh logic here
              }}
              className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Tickets</p>
            <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Urgent</p>
            <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Unassigned</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.unassigned}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Avg Response</p>
            <p className="text-2xl font-bold text-green-600">{stats.avgResponse}</p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 mb-6 inline-flex">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'all' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Tickets
          </button>
          <button
            onClick={() => setViewMode('unassigned')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'unassigned' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Unassigned
          </button>
          <button
            onClick={() => setViewMode('assigned-to-me')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'assigned-to-me' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Assigned to Me
          </button>
          <button
            onClick={() => setViewMode('urgent')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'urgent' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Urgent
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Filter Tickets</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-2">
                  {filterOptions.status.map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, status: [...filters.status, status]});
                          } else {
                            setFilters({...filters, status: filters.status.filter(s => s !== status)});
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <div className="space-y-2">
                  {filterOptions.priority.map(priority => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.priority.includes(priority)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, priority: [...filters.priority, priority]});
                          } else {
                            setFilters({...filters, priority: filters.priority.filter(p => p !== priority)});
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="space-y-2">
                  {filterOptions.category.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, category: [...filters.category, category]});
                          } else {
                            setFilters({...filters, category: filters.category.filter(c => c !== category)});
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Assignment Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.assignedTo.includes('unassigned')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, assignedTo: [...filters.assignedTo, 'unassigned']});
                        } else {
                          setFilters({...filters, assignedTo: filters.assignedTo.filter(a => a !== 'unassigned')});
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">Unassigned</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.assignedTo.includes('me')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, assignedTo: [...filters.assignedTo, 'me']});
                        } else {
                          setFilters({...filters, assignedTo: filters.assignedTo.filter(a => a !== 'me')});
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">Assigned to me</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Bulk Actions Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by ticket ID, subject, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Bulk Actions */}
            {selectedTickets.length > 0 && (
              <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                <CheckSquare size={18} className="text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  {selectedTickets.length} selected
                </span>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 bg-white text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                >
                  Assign
                </button>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 bg-white text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                >
                  Change Status
                </button>
                <button 
                  onClick={() => setSelectedTickets([])}
                  className="p-1.5 hover:bg-purple-200 rounded-lg transition-colors"
                >
                  <X size={16} className="text-purple-600" />
                </button>
              </div>
            )}

            {/* Export */}
            <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
              <Download size={18} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredTickets.length}</span> of <span className="font-medium">{tickets.length}</span> tickets
          </p>
          
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select 
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onChange={(e) => {
                // Add sort logic here
                console.log('Sort by:', e.target.value);
              }}
            >
              <option>Newest first</option>
              <option>Oldest first</option>
              <option>Priority (highest)</option>
              <option>Recently updated</option>
              <option>Response time</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading tickets...</p>
            </div>
          </div>
        )}

        {/* Tickets Table */}
        {!isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                      onChange={toggleAllTickets}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr 
                      key={ticket.id} 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer group ${
                        ticket.priority === 'urgent' ? 'bg-red-50/30' : ''
                      }`}
                      // onClick={() => navigate(`/agent/tickets/${ticket.id}`)} // Fixed navigation
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedTickets.includes(ticket.id)}
                          onChange={() => toggleTicketSelection(ticket.id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{ticket.ticket_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                            {ticket.subject}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {ticket.tags && ticket.tags.map((tag, i) => (
                              <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium text-gray-700">
                              {(customerMap[ticket.customer_id]?.name || 'C').split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{customerMap[ticket.customer_id]?.name || 'Unknown Customer'}</p>
                            <p className="text-xs text-gray-500">{customerMap[ticket.customer_id]?.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-6 py-4">
                        {!ticket.assigned_to || ticket.assigned_to === 'Unassigned' ? (
                          <button 
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex items-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <UserPlus size={12} className="mr-1" />
                            Assign
                          </button>
                        ) : (
                          <span className="text-sm text-gray-700">
                            {ticket.assigned_to}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {new Date(ticket.updated_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {/* {ticket.message_count || 0} */}
                          </span>
                          <ChevronRight size={18} className="text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Inbox size={48} className="text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                        <p className="text-gray-500 mb-6">
                          Try adjusting your filters or search query
                        </p>
                        <button
                          onClick={clearFilters}
                          className="px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredTickets.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTickets.length}</span> of <span className="font-medium">{filteredTickets.length}</span> tickets
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
                  Previous
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
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
        )}
      </main>
    </div>
  );
};

export default AgentTicketQueue;