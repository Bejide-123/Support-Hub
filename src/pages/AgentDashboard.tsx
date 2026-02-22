// pages/AgentDashboard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  UserPlus,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import AgentNavbar from '../components/AgentNavbar';

const AgentDashboard = () => {
  const [timeRange, setTimeRange] = useState('today');

  // Performance metrics
  const metrics = [
    {
      title: 'Open Tickets',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: <Ticket size={22} />,
      color: 'blue',
      bg: 'bg-blue-100',
      text: 'text-blue-600'
    },
    {
      title: 'Unassigned',
      value: '8',
      change: '-5%',
      trend: 'down',
      icon: <AlertCircle size={22} />,
      color: 'red',
      bg: 'bg-red-100',
      text: 'text-red-600'
    },
    {
      title: 'In Progress',
      value: '16',
      change: '+8%',
      trend: 'up',
      icon: <Clock size={22} />,
      color: 'yellow',
      bg: 'bg-yellow-100',
      text: 'text-yellow-600'
    },
    {
      title: 'Resolved Today',
      value: '32',
      change: '+23%',
      trend: 'up',
      icon: <CheckCircle size={22} />,
      color: 'green',
      bg: 'bg-green-100',
      text: 'text-green-600'
    },
    {
      title: 'Avg Response',
      value: '4.2m',
      change: '-1.2m',
      trend: 'down',
      icon: <Clock size={22} />,
      color: 'purple',
      bg: 'bg-purple-100',
      text: 'text-purple-600'
    },
    {
      title: 'Satisfaction',
      value: '98%',
      change: '+2%',
      trend: 'up',
      icon: <TrendingUp size={22} />,
      color: 'emerald',
      bg: 'bg-emerald-100',
      text: 'text-emerald-600'
    }
  ];

  // Recent tickets
  const recentTickets = [
    { id: 'TKT-1245', subject: 'Unable to process payment', customer: 'John Smith', status: 'urgent', priority: 'high', time: '2 min ago', assignee: 'You' },
    { id: 'TKT-1243', subject: 'Account login issues', customer: 'Emily Davis', status: 'in-progress', priority: 'medium', time: '15 min ago', assignee: 'Mike' },
    { id: 'TKT-1240', subject: 'Feature request: Dark mode', customer: 'Alex Wong', status: 'open', priority: 'low', time: '34 min ago', assignee: 'Unassigned' },
    { id: 'TKT-1238', subject: 'Billing discrepancy', customer: 'Sarah Miller', status: 'in-progress', priority: 'high', time: '1 hour ago', assignee: 'You' },
    { id: 'TKT-1235', subject: 'Mobile app crash', customer: 'James Wilson', status: 'urgent', priority: 'urgent', time: '2 hours ago', assignee: 'Sarah' },
  ];

  // Team performance
  const teamPerformance = [
    { name: 'Sarah Johnson', role: 'Senior Agent', resolved: 24, avgTime: '3.2m', satisfaction: '99%', avatar: 'SJ' },
    { name: 'Mike Chen', role: 'Support Agent', resolved: 18, avgTime: '4.5m', satisfaction: '97%', avatar: 'MC' },
    { name: 'Emily Rodriguez', role: 'Support Agent', resolved: 21, avgTime: '3.8m', satisfaction: '98%', avatar: 'ER' },
    { name: 'David Kim', role: 'Junior Agent', resolved: 12, avgTime: '5.2m', satisfaction: '95%', avatar: 'DK' },
    { name: 'Lisa Patel', role: 'Support Agent', resolved: 19, avgTime: '4.1m', satisfaction: '96%', avatar: 'LP' },
  ];

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      'open': 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      'resolved': 'bg-green-100 text-green-700',
      'closed': 'bg-gray-100 text-gray-700',
      'urgent': 'bg-red-100 text-red-700',
    };
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
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
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AgentNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Good morning, Sarah! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your support queue today.
            </p>
          </div>
          
          {/* Time Range Filter */}
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            {['today', 'week', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${metric.bg}`}>
                  <span className={metric.text}>{metric.icon}</span>
                </div>
                <span className={`text-xs font-medium flex items-center ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-xs text-gray-500">{metric.title}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Ticket Queue */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Priority Queue */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Ticket size={20} className="mr-2 text-purple-600" />
                  Priority Queue
                </h2>
                <Link to="/agent/tickets" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center">
                  View all
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
              
              <div className="divide-y divide-gray-200">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-gray-900">#{ticket.id}</span>
                          <StatusBadge status={ticket.status} />
                          <PriorityBadge priority={ticket.priority} />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">{ticket.subject}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{ticket.customer}</span>
                          <span className="mx-2">•</span>
                          <span>{ticket.time}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <Users size={12} className="mr-1" />
                            {ticket.assignee}
                          </span>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-gray-200 rounded-lg">
                        <MoreHorizontal size={18} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock size={20} className="mr-2 text-purple-600" />
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Ticket #TKT-1245</span> was resolved by <span className="font-medium">Sarah Johnson</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <UserPlus size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">David Kim</span> was assigned to <span className="font-medium">Ticket #TKT-1240</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <MessageSquare size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Mike Chen</span> replied to <span className="font-medium">Ticket #TKT-1238</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">32 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Agent Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Status</h2>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                    SJ
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Senior Support Agent</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                  Online
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Assigned</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">24</p>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                Set as Away
              </button>
            </div>

            {/* Team Performance */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Users size={20} className="mr-2 text-purple-600" />
                  Team Performance
                </h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  {teamPerformance.map((member, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-medium mr-3">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{member.resolved}</p>
                        <p className="text-xs text-gray-500">resolved</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link to="/agent/team" className="mt-4 block text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View full team stats →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <span className="text-sm font-medium">Create New Ticket</span>
                  <Ticket size={18} />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <span className="text-sm font-medium">Assign to Me</span>
                  <UserPlus size={18} />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <span className="text-sm font-medium">Escalate Ticket</span>
                  <AlertCircle size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;