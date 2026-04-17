import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Mail,
  Building,
  Calendar,
  Ticket,
  Star,
  ThumbsUp,
  ChevronRight,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  MapPin,
  UserPlus,
  Award
} from 'lucide-react';
import AgentNavbar from '../components/AgentNavbar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getAllCustomers, selectAllCustomers } from '../features/Auth/authSlice';

// Move interfaces outside component
interface RawUser {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  position?: string | null;
  avatar_url?: string | null;
  avatar?: string | null;
  tier?: string | null;
  status?: string | null;
  location?: string | null;
  created_at?: string | null;
  last_active?: string | null;
  total_tickets?: number | null;
  resolved_tickets?: number | null;
  satisfaction?: number | null;
  open_tickets?: number | null;
  urgent_tickets?: number | null;
  tags?: string[] | null;
}

interface TransformedCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  avatar: string;
  tier: string;
  status: string;
  location: string;
  memberSince: string;
  lastActive: string;
  totalTickets: number;
  resolvedTickets: number;
  satisfaction: number;
  openTickets: number;
  urgentTickets: number;
  tags: string[];
}

// Move helper components outside
const TierBadge = ({ tier }: { tier: string }) => {
  const styles = {
    'enterprise': 'bg-purple-100 text-purple-700 border-purple-200',
    'premium': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'standard': 'bg-blue-100 text-blue-700 border-blue-200',
    'basic': 'bg-gray-100 text-gray-700 border-gray-200',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[tier as keyof typeof styles] || styles.basic}`}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  return status === 'active' ? (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
      Active
    </span>
  ) : (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
      Inactive
    </span>
  );
};

const CustomerListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get customers from Redux
  const reduxCustomers = useAppSelector(selectAllCustomers);
  const isLoadingCustomers = useAppSelector(state => state.auth.isLoadingData);
  const error = useAppSelector(state => state.auth.error);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch customers on component mount
  useEffect(() => {
    dispatch(getAllCustomers()).finally(() => {
      setIsInitialLoad(false);
    });
  }, [dispatch]);

  // Transform Redux users to customer format - only when data is available
  const transformCustomers = (users: RawUser[]): TransformedCustomer[] => {
    return users.map((user: RawUser) => ({
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email || '',
      phone: user.phone || '+1 (555) 000-0000',
      company: user.company || 'N/A',
      position: user.position || 'Employee',
      avatar: user.avatar_url || user.avatar || user.name?.substring(0, 2).toUpperCase() || 'N/A',
      tier: user.tier || 'basic',
      status: user.status || 'active',
      location: user.location || 'Not specified',
      memberSince: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown',
      lastActive: user.last_active || '2 hours ago',
      totalTickets: user.total_tickets || 0,
      resolvedTickets: user.resolved_tickets || 0,
      satisfaction: user.satisfaction || 0,
      openTickets: user.open_tickets || 0,
      urgentTickets: user.urgent_tickets || 0,
      tags: user.tags || []
    }));
  };

  const customers = transformCustomers(reduxCustomers);

  // Stats - only calculate when customers are loaded
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    premium: customers.filter(c => c.tier === 'premium' || c.tier === 'enterprise').length,
    newThisMonth: customers.filter(c => {
      const month = c.memberSince.split(' ')[0];
      return ['Jan', 'Feb', 'Mar', 'Apr'].includes(month);
    }).length
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchQuery === '' || 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = selectedTier === 'all' || customer.tier === selectedTier;
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    
    return matchesSearch && matchesTier && matchesStatus;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return new Date(b.memberSince).getTime() - new Date(a.memberSince).getTime();
      case 'oldest':
        return new Date(a.memberSince).getTime() - new Date(b.memberSince).getTime();
      case 'tickets':
        return b.totalTickets - a.totalTickets;
      case 'satisfaction':
        return b.satisfaction - a.satisfaction;
      default:
        return 0;
    }
  });

  // Loading state - show skeleton loader
  if (isInitialLoad || (isLoadingCustomers && customers.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AgentNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
            <div className="h-5 w-80 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {/* Filters skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Grid skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse mr-4"></div>
                    <div>
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error && customers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AgentNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Customers</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button 
              onClick={() => dispatch(getAllCustomers())}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AgentNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Users size={28} className="mr-3 text-purple-600" />
              Customers
            </h1>
            <p className="text-gray-600">
              Manage and view all customer accounts.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/agent/customers/new')}
              className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <UserPlus size={18} className="mr-2" />
              Add Customer
            </button>
            <button 
              onClick={() => console.log('Export customers')}
              className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={18} className="text-gray-600" />
            </button>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedTier('all');
                setSelectedStatus('all');
                setSortBy('newest');
                dispatch(getAllCustomers());
              }}
              className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-purple-100 rounded-lg">
                <Users size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Customers</p>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-green-100 rounded-lg">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.active}</p>
            <p className="text-sm text-gray-500">Active Accounts</p>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-emerald-100 rounded-lg">
                <Award size={20} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.premium}</p>
            <p className="text-sm text-gray-500">Premium Customers</p>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <Calendar size={20} className="text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.newThisMonth}</p>
            <p className="text-sm text-gray-500">New This Month</p>
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
                placeholder="Search customers by name, email, company, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Tier Filter */}
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none bg-white"
            >
              <option value="all">All Tiers</option>
              <option value="enterprise">Enterprise</option>
              <option value="premium">Premium</option>
              <option value="standard">Standard</option>
              <option value="basic">Basic</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="tickets">Most Tickets</option>
              <option value="satisfaction">Highest Satisfaction</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="space-y-0.5">
                  <div className="w-3 h-0.5 bg-current rounded-sm"></div>
                  <div className="w-3 h-0.5 bg-current rounded-sm"></div>
                  <div className="w-3 h-0.5 bg-current rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{sortedCustomers.length}</span> of <span className="font-medium">{customers.length}</span> customers
          </p>
          {isLoadingCustomers && customers.length > 0 && (
            <span className="text-sm text-purple-600">Refreshing customers...</span>
          )}
        </div>

        {/* Customers Grid/List */}
        {sortedCustomers.length > 0 ? (
          viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCustomers.map((customer) => (
                <Link
                  key={customer.id}
                  to={`/agent/customers/${customer.id}`}
                  state={{ customer }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${
                        customer.tier === 'enterprise' ? 'from-purple-500 to-indigo-500' :
                        customer.tier === 'premium' ? 'from-emerald-500 to-teal-500' :
                        'from-gray-500 to-gray-600'
                      } flex items-center justify-center text-white font-bold text-xl mr-4`}>
                        {customer.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{customer.name}</h3>
                          {customer.urgentTickets > 0 && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{customer.position}</p>
                        <p className="text-xs text-gray-400">{customer.company}</p>
                      </div>
                    </div>
                    <TierBadge tier={customer.tier} />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={14} className="mr-2 text-gray-400" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building size={14} className="mr-2 text-gray-400" />
                      <span>{customer.company}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2 text-gray-400" />
                      <span>{customer.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Ticket size={14} className="text-purple-600 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{customer.openTickets}</span>
                        <span className="text-xs text-gray-500 ml-1">open</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp size={14} className="text-green-600 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{customer.satisfaction}%</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      {customer.lastActive}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {customer.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                        {tag}
                      </span>
                    ))}
                    {customer.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                        +{customer.tags.length - 2}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedCustomers.map((customer) => (
                      <tr 
                        key={customer.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/agent/customers/${customer.id}`, { state: { customer } })}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                              customer.tier === 'enterprise' ? 'from-purple-500 to-indigo-500' :
                              customer.tier === 'premium' ? 'from-emerald-500 to-teal-500' :
                              'from-gray-500 to-gray-600'
                            } flex items-center justify-center text-white font-bold text-sm mr-3`}>
                              {customer.avatar}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                {customer.urgentTickets > 0 && (
                                  <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">{customer.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-700">{customer.email}</p>
                            <p className="text-xs text-gray-500">{customer.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <TierBadge tier={customer.tier} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={customer.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{customer.openTickets}</span>
                            <span className="text-xs text-gray-500 ml-1">/ {customer.totalTickets}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{customer.satisfaction}%</span>
                            <Star size={14} className="ml-1 text-yellow-400 fill-current" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1" />
                            {customer.lastActive}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ChevronRight size={18} className="text-gray-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedTier !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'No customers have been added yet'}
            </p>
            <button 
              onClick={() => navigate('/agent/customers/new')}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors inline-flex items-center"
            >
              <UserPlus size={18} className="mr-2" />
              Add Your First Customer
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerListPage;