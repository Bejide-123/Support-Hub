// pages/AnalyticsDashboard.tsx
import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  CreditCard,
  Settings,
  FileText // Added missing import
} from 'lucide-react';
import AgentNavbar from '../components/AgentNavbar';

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('week');
  const [selectedView, setSelectedView] = useState('overview');

  // Mock KPIs
  const kpis = [
    {
      title: 'Total Tickets',
      value: '1,284',
      change: '+12.3%',
      trend: 'up',
      icon: <Ticket size={22} />,
      color: 'purple',
      bg: 'bg-purple-100',
      text: 'text-purple-600'
    },
    {
      title: 'Resolution Rate',
      value: '94.2%',
      change: '+5.1%',
      trend: 'up',
      icon: <CheckCircle size={22} />,
      color: 'green',
      bg: 'bg-green-100',
      text: 'text-green-600'
    },
    {
      title: 'Avg Response Time',
      value: '4.2m',
      change: '-32s',
      trend: 'down',
      icon: <Clock size={22} />,
      color: 'yellow',
      bg: 'bg-yellow-100',
      text: 'text-yellow-600'
    },
    {
      title: 'CSAT Score',
      value: '4.8/5',
      change: '+0.3',
      trend: 'up',
      icon: <Star size={22} />,
      color: 'emerald',
      bg: 'bg-emerald-100',
      text: 'text-emerald-600'
    },
    {
      title: 'Active Agents',
      value: '12',
      change: '0',
      trend: 'neutral',
      icon: <Users size={22} />,
      color: 'blue',
      bg: 'bg-blue-100',
      text: 'text-blue-600'
    },
    {
      title: 'Tickets per Agent',
      value: '107',
      change: '-3.2%',
      trend: 'down',
      icon: <BarChart3 size={22} />,
      color: 'orange',
      bg: 'bg-orange-100',
      text: 'text-orange-600'
    }
  ];

  // Mock daily ticket volume
  const ticketVolume = [
    { day: 'Mon', volume: 145, resolved: 132 },
    { day: 'Tue', volume: 162, resolved: 148 },
    { day: 'Wed', volume: 158, resolved: 151 },
    { day: 'Thu', volume: 184, resolved: 170 },
    { day: 'Fri', volume: 176, resolved: 165 },
    { day: 'Sat', volume: 98, resolved: 92 },
    { day: 'Sun', volume: 76, resolved: 71 },
  ];

  // Mock top agents
  const topAgents = [
    { name: 'Sarah Johnson', avatar: 'SJ', tickets: 142, satisfaction: 99, responseTime: '2.8m', role: 'Senior Agent' },
    { name: 'Mike Chen', avatar: 'MC', tickets: 128, satisfaction: 98, responseTime: '3.2m', role: 'Support Agent' },
    { name: 'Emily Rodriguez', avatar: 'ER', tickets: 115, satisfaction: 97, responseTime: '3.5m', role: 'Support Agent' },
    { name: 'David Kim', avatar: 'DK', tickets: 98, satisfaction: 96, responseTime: '4.1m', role: 'Junior Agent' },
    { name: 'Lisa Patel', avatar: 'LP', tickets: 95, satisfaction: 98, responseTime: '3.8m', role: 'Support Agent' },
  ];

  // Mock category breakdown
  const categories = [
    { name: 'Technical Issues', count: 412, percentage: 32, trend: '+5%' },
    { name: 'Billing & Payments', count: 298, percentage: 23, trend: '-2%' },
    { name: 'Account Management', count: 245, percentage: 19, trend: '+8%' },
    { name: 'Feature Requests', count: 187, percentage: 15, trend: '+12%' },
    { name: 'General Inquiries', count: 142, percentage: 11, trend: '-3%' },
  ];

  // Mock priority distribution
  const priorities = [
    { name: 'Urgent', count: 89, percentage: 7, color: 'bg-red-500' },
    { name: 'High', count: 234, percentage: 18, color: 'bg-orange-500' },
    { name: 'Medium', count: 487, percentage: 38, color: 'bg-yellow-500' },
    { name: 'Low', count: 474, percentage: 37, color: 'bg-green-500' },
  ];

  // Mock customer satisfaction trend
  const satisfactionTrend = [
    { month: 'Jan', score: 4.6 },
    { month: 'Feb', score: 4.7 },
    { month: 'Mar', score: 4.7 },
    { month: 'Apr', score: 4.8 },
    { month: 'May', score: 4.8 },
    { month: 'Jun', score: 4.9 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AgentNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <BarChart3 size={28} className="mr-3 text-purple-600" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor your support performance and track key metrics.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              {['today', 'week', 'month', 'quarter'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    dateRange === range
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={18} className="text-gray-600" />
            </button>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                  <span className={kpi.text}>{kpi.icon}</span>
                </div>
                <span className={`text-xs font-medium flex items-center ${
                  kpi.trend === 'up' ? 'text-green-600' : 
                  kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {kpi.trend === 'up' && <ArrowUp size={14} />}
                  {kpi.trend === 'down' && <ArrowDown size={14} />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
              <p className="text-xs text-gray-500">{kpi.title}</p>
            </div>
          ))}
        </div>

        {/* View Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 mb-6 inline-flex">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center ${
              selectedView === 'overview'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Activity size={16} className="mr-2" />
            Overview
          </button>
          <button
            onClick={() => setSelectedView('agents')}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center ${
              selectedView === 'agents'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users size={16} className="mr-2" />
            Agent Performance
          </button>
          <button
            onClick={() => setSelectedView('satisfaction')}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center ${
              selectedView === 'satisfaction'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Star size={16} className="mr-2" />
            Customer Satisfaction
          </button>
          <button
            onClick={() => setSelectedView('trends')}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center ${
              selectedView === 'trends'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp size={16} className="mr-2" />
            Trends
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Ticket Volume Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Ticket Volume</h2>
                  <p className="text-sm text-gray-500 mt-1">Daily ticket creation vs resolution</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                    <span className="text-xs text-gray-600">Created</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-xs text-gray-600">Resolved</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-2">
                {ticketVolume.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center gap-1">
                      <div 
                        className="w-full max-w-[40px] bg-purple-500 rounded-t-lg"
                        style={{ height: `${(day.volume / 200) * 160}px` }}
                      ></div>
                      <div 
                        className="w-full max-w-[40px] bg-green-500 rounded-t-lg"
                        style={{ height: `${(day.resolved / 200) * 140}px` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">{day.day}</span>
                    <span className="text-xs font-medium text-gray-900">{day.volume}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category & Priority Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Category Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
                <div className="space-y-4">
                  {categories.map((cat) => (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{cat.name}</span>
                        <div>
                          <span className="font-medium text-gray-900">{cat.count}</span>
                          <span className={`text-xs ml-2 ${
                            cat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {cat.trend}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${cat.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{cat.percentage}% of total</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Priority Distribution</h2>
                <div className="space-y-4">
                  {priorities.map((priority) => (
                    <div key={priority.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{priority.name}</span>
                        <span className="font-medium text-gray-900">{priority.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${priority.color} h-2 rounded-full`}
                          style={{ width: `${priority.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{priority.percentage}% of total</p>
                    </div>
                  ))}
                </div>

                {/* SLA Compliance */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">SLA Compliance</h3>
                  <div className="flex items-center">
                    <div className="w-24 h-24 rounded-full border-8 border-green-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">92%</span>
                    </div>
                    <div className="ml-6">
                      <div className="flex items-center mb-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm text-gray-600">Within SLA: 92%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        <span className="text-sm text-gray-600">Breached: 8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Performance Table */}
            {selectedView === 'agents' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <Users size={18} className="mr-2 text-purple-600" />
                    Agent Performance Leaderboard
                  </h2>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View Full Report
                  </button>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {topAgents.map((agent, index) => (
                    <div key={agent.name} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-400 w-8">{index + 1}</span>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm mr-4">
                            {agent.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{agent.name}</p>
                            <p className="text-xs text-gray-500">{agent.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{agent.tickets}</p>
                            <p className="text-xs text-gray-500">Tickets</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{agent.satisfaction}%</p>
                            <p className="text-xs text-gray-500">CSAT</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{agent.responseTime}</p>
                            <p className="text-xs text-gray-500">Response</p>
                          </div>
                          <div className="w-20">
                            <span className={`px-3 py-1 text-xs rounded-full ${
                              index === 0 ? 'bg-yellow-100 text-yellow-700' :
                              index === 1 ? 'bg-gray-100 text-gray-700' :
                              index === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-50 text-gray-600'
                            }`}>
                              {index === 0 ? '🥇 Top Performer' :
                               index === 1 ? '🥈 Silver' :
                               index === 2 ? '🥉 Bronze' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Satisfaction Trends */}
            {selectedView === 'satisfaction' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">CSAT Trend</h2>
                    <p className="text-sm text-gray-500 mt-1">Monthly customer satisfaction scores</p>
                  </div>
                  <div className="flex items-center bg-green-100 px-3 py-1.5 rounded-full">
                    <Star size={14} className="text-yellow-500 fill-current mr-1" />
                    <span className="text-sm font-medium text-green-700">4.8/5.0</span>
                  </div>
                </div>
                
                <div className="h-48 flex items-end justify-between gap-4">
                  {satisfactionTrend.map((month) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full max-w-[50px] bg-gradient-to-t from-purple-500 to-indigo-500 rounded-t-lg"
                        style={{ height: `${(month.score / 5) * 120}px` }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{month.month}</span>
                      <span className="text-xs font-medium text-gray-900">{month.score}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <ThumbsUp size={18} className="text-green-600 mr-1" />
                      <span className="text-lg font-bold text-gray-900">78%</span>
                    </div>
                    <p className="text-xs text-gray-500">Positive</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <MessageSquare size={18} className="text-yellow-600 mr-1" />
                      <span className="text-lg font-bold text-gray-900">15%</span>
                    </div>
                    <p className="text-xs text-gray-500">Neutral</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <ThumbsDown size={18} className="text-red-600 mr-1" />
                      <span className="text-lg font-bold text-gray-900">7%</span>
                    </div>
                    <p className="text-xs text-gray-500">Negative</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Insights */}
          <div className="space-y-6">
            
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Period Summary</h3>
                <Target size={20} />
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-purple-200 text-sm">Total Tickets</p>
                  <p className="text-3xl font-bold">1,284</p>
                  <p className="text-purple-200 text-sm mt-1">
                    <TrendingUp size={14} className="inline mr-1" />
                    +12.3% vs last period
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-400">
                  <div>
                    <p className="text-purple-200 text-xs">Resolution Rate</p>
                    <p className="text-xl font-bold">94.2%</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-xs">Avg Response</p>
                    <p className="text-xl font-bold">4.2m</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-xs">CSAT Score</p>
                    <p className="text-xl font-bold">4.8/5</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-xs">SLA</p>
                    <p className="text-xl font-bold">92%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Busiest Hours */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Busiest Hours</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">10:00 - 11:00</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">142</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">14:00 - 15:00</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">121</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">09:00 - 10:00</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">102</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">11:00 - 12:00</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">97</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Issues</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-1.5 bg-red-100 rounded-lg mr-3">
                    <AlertCircle size={14} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Login & Authentication</p>
                    <p className="text-xs text-gray-500 mt-1">156 tickets (+12%)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                    <CreditCard size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Processing</p>
                    <p className="text-xs text-gray-500 mt-1">124 tickets (-5%)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-1.5 bg-yellow-100 rounded-lg mr-3">
                    <Zap size={14} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Performance Issues</p>
                    <p className="text-xs text-gray-500 mt-1">98 tickets (+23%)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-1.5 bg-purple-100 rounded-lg mr-3">
                    <Settings size={14} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Feature Requests</p>
                    <p className="text-xs text-gray-500 mt-1">87 tickets (+8%)</p>
                  </div>
                </div>
              </div>
              
              <button className="mt-4 w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                View all categories →
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">First response</span>
                  <span className="text-sm font-medium text-gray-900">4.2 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resolution time</span>
                  <span className="text-sm font-medium text-gray-900">3.5 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reopen rate</span>
                  <span className="text-sm font-medium text-gray-900">12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Escalation rate</span>
                  <span className="text-sm font-medium text-gray-900">8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Self-service rate</span>
                  <span className="text-sm font-medium text-gray-900">34%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Report */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Need a detailed report?</h3>
              <p className="text-sm text-gray-600">Export comprehensive analytics data for deeper analysis</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                <FileText size={16} className="mr-2" />
                Export as PDF
              </button>
              <button className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                <Download size={16} className="mr-2" />
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;