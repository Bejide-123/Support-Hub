// pages/CustomerProfilePage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  Ticket,
  Clock,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Save,
  X,
  FileText,
  Download,
  Filter,
  Search,
  ChevronRight,
  User,
  Shield,
  CreditCard,
  Activity,
  Settings,
} from 'lucide-react';
import AgentNavbar from '../components/AgentNavbar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCustomerById, getCustomerById } from "../features/Auth/authSlice";

const StatusBadge = ({ status }: { status?: string }) => {
  const styles = {
    'open': 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    'resolved': 'bg-green-100 text-green-700',
    'closed': 'bg-gray-100 text-gray-700',
    'active': 'bg-green-100 text-green-700',
    'inactive': 'bg-gray-100 text-gray-700',
    'suspended': 'bg-red-100 text-red-700',
  };
  
  const statusKey = status?.toLowerCase() || '';
  const style = styles[statusKey as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};

// ✅ SatisfactionBadge component - MOVED OUTSIDE
const SatisfactionBadge = ({ rating }: { rating?: string }) => {
  const styles = {
    'positive': 'bg-green-100 text-green-700',
    'neutral': 'bg-yellow-100 text-yellow-700',
    'negative': 'bg-red-100 text-red-700',
  };
  
  const style = styles[rating as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {rating === 'positive' && <ThumbsUp size={12} className="inline mr-1" />}
      {rating === 'neutral' && <span>•</span>}
      {rating === 'negative' && <ThumbsDown size={12} className="inline mr-1" />}
      {rating ? rating.charAt(0).toUpperCase() + rating.slice(1) : 'Unknown'}
    </span>
  );
};

const CustomerProfilePage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  

  const customer = useAppSelector((state) => selectCustomerById(state, id || ''));

  const [editForm, setEditForm] = useState({
    name: customer?.name || '',           
    email: customer?.email || '',         
    phone: customer?.phone || '',         
    company: customer?.company || '',     
    position: customer?.position || '',   
    location: customer?.location || '',  
    timezone: customer?.timezone || 'PST (UTC-8)',
    language: customer?.language || 'English'
  });

  useEffect(() => {
    if (id) {
      dispatch(getCustomerById(id));
    }
  }, [dispatch, id]);

  // Mock ticket history
  const tickets = [
    { id: 'TKT-1242', subject: 'Subscription downgrade not reflecting', status: 'in-progress', priority: 'high', created: '2024-03-14', satisfaction: null },
    { id: 'TKT-1189', subject: 'Login issues with 2FA', status: 'resolved', priority: 'medium', created: '2024-02-28', satisfaction: 'positive' },
    { id: 'TKT-1123', subject: 'Feature request: Dark mode', status: 'closed', priority: 'low', created: '2024-01-15', satisfaction: 'positive' },
    { id: 'TKT-1087', subject: 'Billing invoice correction', status: 'resolved', priority: 'medium', created: '2024-01-03', satisfaction: 'positive' },
    { id: 'TKT-1054', subject: 'Team member invitation not sending', status: 'resolved', priority: 'high', created: '2023-12-12', satisfaction: 'neutral' },
  ];

  // Mock activity log
  const activities = [
    { id: 1, type: 'ticket-created', description: 'Created ticket #TKT-1242', timestamp: '2 hours ago', agent: null },
    { id: 2, type: 'login', description: 'Logged in from San Francisco, CA', timestamp: '2 hours ago', agent: null },
    { id: 3, type: 'ticket-updated', description: 'Ticket #TKT-1242 updated by Sarah Johnson', timestamp: '1 hour ago', agent: 'Sarah Johnson' },
    { id: 4, type: 'payment', description: 'Subscription payment processed - $49.99', timestamp: '3 days ago', agent: null },
    { id: 5, type: 'plan-changed', description: 'Changed plan from Basic to Pro', timestamp: 'Jan 15, 2024', agent: null },
  ];

  // Mock notes
  const [notes, setNotes] = useState([
    { id: 1, author: 'Sarah Johnson', avatar: 'SJ', content: 'Customer prefers email communication. Usually responds within 2 hours.', timestamp: 'Feb 28, 2024', pinned: true },
    { id: 2, author: 'Mike Chen', avatar: 'MC', content: 'Had a similar billing issue last month. Make sure to check the subscription sync.', timestamp: 'Mar 14, 2024', pinned: false },
  ]);

  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    const note = {
      id: notes.length + 1,
      author: 'Sarah Johnson',
      avatar: 'SJ',
      content: newNote,
      timestamp: 'Just now',
      pinned: false
    };
    
    setNotes([note, ...notes]);
    setNewNote('');
  };

  const togglePinNote = (noteId: number) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const handleSaveEdit = () => {
    // Save logic here
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AgentNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back button */}
        <Link 
          to="/agent/tickets" 
          className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Queue
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Customer Info */}
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl mr-6">
                {customer?.avatar || customer?.name?.substring(0, 2).toUpperCase() || 'N/A'}
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {customer?.name}
                    </h1>
                  )}
                  <StatusBadge status={customer?.status} />
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-gray-600">{customer?.position}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{customer?.company}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">Customer since {customer?.created_at}</span>
                </div>
                
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={14} className="mr-1" />
                    <a href={`mailto:${customer?.email}`} className="hover:text-purple-600">
                      {customer?.email}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={14} className="mr-1" />
                    <a href={`tel:${customer?.phone}`} className="hover:text-purple-600">
                      {customer?.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                {isEditing ? (
                  <>
                    <X size={16} className="mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
              {isEditing && (
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              )}
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                <MessageSquare size={16} className="mr-2" />
                New Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Tickets</p>
            <p className="text-2xl font-bold text-gray-900">{customer?.total_tickets || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-600">{customer?.resolved_tickets || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Satisfaction</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-yellow-600">{customer?.satisfaction || 0}%</p>
              <Star size={16} className="ml-2 text-yellow-400 fill-current" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">LTV</p>
            <p className="text-2xl font-bold text-purple-600">$1,240</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Last Active</p>
            <p className="text-sm font-medium text-gray-900 mt-2">{customer?.updated_at || 'N/A'}</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Tabs Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === 'overview'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Activity size={16} className="inline mr-2" />
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('tickets')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === 'tickets'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Ticket size={16} className="inline mr-2" />
                    Ticket History
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === 'activity'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Clock size={16} className="inline mr-2" />
                    Activity Log
                  </button>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === 'billing'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <CreditCard size={16} className="inline mr-2" />
                    Billing
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Building size={16} className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-xs text-gray-500">Company</p>
                            <p className="text-sm font-medium text-gray-900">{customer?.company || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <MapPin size={16} className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm font-medium text-gray-900">{customer?.location || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Clock size={16} className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-xs text-gray-500">Timezone</p>
                            <p className="text-sm font-medium text-gray-900">{customer?.timezone || 'PST (UTC-8)'}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <MessageSquare size={16} className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-xs text-gray-500">Language</p>
                            <p className="text-sm font-medium text-gray-900">{customer?.language || 'English'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity Preview */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                        <button 
                          onClick={() => setActiveTab('activity')}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-4">
                        {activities.slice(0, 3).map((activity) => (
                          <div key={activity.id} className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                              {activity.type === 'ticket-created' && <Ticket size={16} className="text-blue-600" />}
                              {activity.type === 'login' && <User size={16} className="text-green-600" />}
                              {activity.type === 'payment' && <CreditCard size={16} className="text-purple-600" />}
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">{activity.description}</p>
                              <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tickets Tab */}
                {activeTab === 'tickets' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Ticket History</h3>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search tickets..."
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Filter size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {tickets.map((ticket) => (
                        <Link
                          key={ticket.id}
                          to={`/agent/tickets/${ticket.id}`}
                          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                                <StatusBadge status={ticket.status} />
                                {ticket.satisfaction && (
                                  <SatisfactionBadge rating={ticket.satisfaction} />
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mb-1">{ticket.subject}</p>
                              <p className="text-xs text-gray-500">Created {ticket.created}</p>
                            </div>
                            <ChevronRight size={18} className="text-gray-400" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Activity Log</h3>
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            {activity.type === 'ticket-created' && <Ticket size={16} className="text-blue-600" />}
                            {activity.type === 'ticket-updated' && <Edit size={16} className="text-yellow-600" />}
                            {activity.type === 'login' && <User size={16} className="text-green-600" />}
                            {activity.type === 'payment' && <CreditCard size={16} className="text-purple-600" />}
                            {activity.type === 'plan-changed' && <Settings size={16} className="text-gray-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.description}</p>
                            <div className="flex items-center mt-1">
                              <p className="text-xs text-gray-500">{activity.timestamp}</p>
                              {activity.agent && (
                                <>
                                  <span className="text-xs text-gray-400 mx-2">•</span>
                                  <span className="text-xs text-gray-600">by {activity.agent}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Current Plan</h3>
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Subscription Plan</p>
                            <p className="text-2xl font-bold text-gray-900 mb-2">{customer?.tier || 'Basic'}</p>
                            <p className="text-sm text-gray-600">Next billing: April 15, 2024</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Monthly Cost</p>
                            <p className="text-2xl font-bold text-purple-600">$49.99</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <CreditCard size={20} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Visa •••• 4242</p>
                          <p className="text-xs text-gray-500">Expires 12/25</p>
                        </div>
                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Default
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice History</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">March 2024</p>
                            <p className="text-xs text-gray-500">Mar 15, 2024</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-4">$49.99</span>
                            <Download size={16} className="text-gray-400 hover:text-purple-600 cursor-pointer" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">February 2024</p>
                            <p className="text-xs text-gray-500">Feb 15, 2024</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-4">$49.99</span>
                            <Download size={16} className="text-gray-400 hover:text-purple-600 cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Notes & Additional Info */}
          <div className="space-y-6">
            
            {/* Customer Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FileText size={18} className="mr-2 text-purple-600" />
                  Notes
                </h3>
                <span className="text-xs text-gray-500">{notes.length} notes</span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="mb-6">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this customer..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none resize-none text-sm"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    Add Note
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-4">
                {notes.filter(n => n.pinned).map((note) => (
                  <div key={note.id} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium mr-2">
                          {note.avatar}
                        </div>
                        <span className="text-xs font-medium text-gray-900">{note.author}</span>
                        <span className="text-xs text-gray-500 ml-2">{note.timestamp}</span>
                      </div>
                      <button 
                        onClick={() => togglePinNote(note.id)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <Star size={14} className="fill-current" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">{note.content}</p>
                  </div>
                ))}

                {notes.filter(n => !n.pinned).map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium mr-2">
                          {note.avatar}
                        </div>
                        <span className="text-xs font-medium text-gray-900">{note.author}</span>
                        <span className="text-xs text-gray-500 ml-2">{note.timestamp}</span>
                      </div>
                      <button 
                        onClick={() => togglePinNote(note.id)}
                        className="text-gray-400 hover:text-yellow-600"
                      >
                        <Star size={14} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Preferences */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-green-600">Opted in</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SMS</span>
                  <span className="text-sm font-medium text-gray-500">Not opted in</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Marketing</span>
                  <span className="text-sm font-medium text-gray-500">Opted out</span>
                </div>
              </div>
              <button className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium">
                Update preferences
              </button>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Shield size={18} className="mr-2 text-purple-600" />
                Security
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">2FA Enabled</span>
                  <span className="text-sm font-medium text-green-600">Yes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Password Change</span>
                  <span className="text-sm text-gray-900">30 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="text-sm text-gray-900">2 devices</span>
                </div>
              </div>
              <button className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium">
                View security settings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfilePage;