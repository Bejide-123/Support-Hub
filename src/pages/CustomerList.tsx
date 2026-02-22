// pages/CustomerListPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
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

const CustomerListPage = () => {
  const navigate = useNavigate(); // Added for navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Mock customers data
  const customers = [
    {
      id: 'CUST-78945',
      name: 'Sarah Miller',
      email: 'sarah.miller@email.com',
      phone: '+1 (555) 123-4567',
      company: 'Miller Designs',
      position: 'Creative Director',
      avatar: 'SM',
      tier: 'premium',
      status: 'active',
      location: 'San Francisco, CA',
      memberSince: 'Jan 15, 2024',
      lastActive: '2 hours ago',
      totalTickets: 23,
      resolvedTickets: 19,
      satisfaction: 98,
      openTickets: 2,
      urgentTickets: 1,
      tags: ['design-agency', 'enterprise', 'priority-support']
    },
    {
      id: 'CUST-78932',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 987-6543',
      company: 'Smith & Co',
      position: 'CEO',
      avatar: 'JS',
      tier: 'enterprise',
      status: 'active',
      location: 'New York, NY',
      memberSince: 'Dec 03, 2023',
      lastActive: '15 minutes ago',
      totalTickets: 45,
      resolvedTickets: 42,
      satisfaction: 96,
      openTickets: 3,
      urgentTickets: 0,
      tags: ['enterprise', 'ceo', 'priority']
    },
    {
      id: 'CUST-78891',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      company: 'Tech Solutions Inc',
      position: 'CTO',
      avatar: 'ED',
      tier: 'premium',
      status: 'active',
      location: 'Austin, TX',
      memberSince: 'Mar 22, 2024',
      lastActive: '1 hour ago',
      totalTickets: 12,
      resolvedTickets: 11,
      satisfaction: 100,
      openTickets: 1,
      urgentTickets: 0,
      tags: ['tech', 'cto', 'new']
    },
    {
      id: 'CUST-78845',
      name: 'Alex Wong',
      email: 'alex.wong@email.com',
      phone: '+1 (555) 234-5678',
      company: 'Creative Labs',
      position: 'Product Manager',
      avatar: 'AW',
      tier: 'standard',
      status: 'active',
      location: 'Seattle, WA',
      memberSince: 'Feb 10, 2024',
      lastActive: '3 hours ago',
      totalTickets: 8,
      resolvedTickets: 7,
      satisfaction: 95,
      openTickets: 1,
      urgentTickets: 0,
      tags: ['design', 'product']
    },
    {
      id: 'CUST-78812',
      name: 'Lisa Patel',
      email: 'lisa.patel@email.com',
      phone: '+1 (555) 876-5432',
      company: 'HealthPlus',
      position: 'Operations Director',
      avatar: 'LP',
      tier: 'enterprise',
      status: 'active',
      location: 'Chicago, IL',
      memberSince: 'Nov 18, 2023',
      lastActive: '5 hours ago',
      totalTickets: 34,
      resolvedTickets: 32,
      satisfaction: 97,
      openTickets: 2,
      urgentTickets: 1,
      tags: ['healthcare', 'enterprise']
    },
    {
      id: 'CUST-78789',
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      phone: '+1 (555) 345-6789',
      company: 'Wilson Consulting',
      position: 'Independent Consultant',
      avatar: 'JW',
      tier: 'basic',
      status: 'inactive',
      location: 'Denver, CO',
      memberSince: 'Apr 05, 2024',
      lastActive: '2 days ago',
      totalTickets: 3,
      resolvedTickets: 2,
      satisfaction: 89,
      openTickets: 1,
      urgentTickets: 0,
      tags: ['consulting']
    },
    {
      id: 'CUST-78756',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1 (555) 567-8901',
      company: 'Garcia Enterprises',
      position: 'Owner',
      avatar: 'MG',
      tier: 'premium',
      status: 'active',
      location: 'Miami, FL',
      memberSince: 'Jan 30, 2024',
      lastActive: '45 minutes ago',
      totalTickets: 18,
      resolvedTickets: 16,
      satisfaction: 94,
      openTickets: 2,
      urgentTickets: 1,
      tags: ['small-business', 'owner']
    },
    {
      id: 'CUST-78723',
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+1 (555) 678-9012',
      company: 'Kim Development',
      position: 'Lead Developer',
      avatar: 'DK',
      tier: 'standard',
      status: 'active',
      location: 'Portland, OR',
      memberSince: 'Mar 12, 2024',
      lastActive: '1 day ago',
      totalTickets: 9,
      resolvedTickets: 8,
      satisfaction: 92,
      openTickets: 1,
      urgentTickets: 0,
      tags: ['developer', 'tech']
    },
    {
      id: 'CUST-78698',
      name: 'Rachel Chen',
      email: 'rachel.chen@email.com',
      phone: '+1 (555) 789-0123',
      company: 'Chen Analytics',
      position: 'Data Scientist',
      avatar: 'RC',
      tier: 'premium',
      status: 'active',
      location: 'Boston, MA',
      memberSince: 'Feb 25, 2024',
      lastActive: '4 hours ago',
      totalTickets: 15,
      resolvedTickets: 14,
      satisfaction: 99,
      openTickets: 1,
      urgentTickets: 0,
      tags: ['analytics', 'data']
    }
  ];

  // Stats
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    premium: customers.filter(c => c.tier === 'premium' || c.tier === 'enterprise').length,
    newThisMonth: customers.filter(c => {
      const month = c.memberSince.split(' ')[0];
      return month === 'Jan' || month === 'Feb' || month === 'Mar' || month === 'Apr';
    }).length
  };

  // Customer tier badge
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

  // Status badge
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

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tier filter
    const matchesTier = selectedTier === 'all' || customer.tier === selectedTier;
    
    // Status filter
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
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +12% this month
              </span>
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
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
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
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
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
            </div>

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
                        onClick={() => navigate(`/agent/customers/${customer.id}`)}
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

        {/* Pagination */}
        {sortedCustomers.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedCustomers.length}</span> of <span className="font-medium">{sortedCustomers.length}</span> customers
            </p>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => console.log('Previous page')}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                1
              </button>
              <button 
                onClick={() => console.log('Page 2')}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                2
              </button>
              <button 
                onClick={() => console.log('Page 3')}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                3
              </button>
              <button 
                onClick={() => console.log('Next page')}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerListPage;