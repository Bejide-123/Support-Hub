// pages/AgentSettings.tsx
import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Smartphone,
  MessageSquare,
  Save,
  ChevronRight,
  Moon,
  Sun,
  Trash2,
  AlertCircle,
  Check,
  RefreshCw,
  FileText,
  MoreHorizontal,
  Copy,
} from 'lucide-react';
import AgentNavbar from '../components/AgentNavbar';

const AgentSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Profile Settings
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@supporthub.com',
    role: 'Senior Support Agent',
    department: 'Customer Support',
    avatar: 'SJ',
    phone: '+1 (555) 987-6543',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    language: 'en',
    bio: 'Senior support agent with 5+ years of experience in SaaS customer service. Specialized in billing and technical issues.'
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    ticketAssigned: true,
    ticketUpdated: true,
    newMessage: true,
    slaBreach: true,
    mentions: true,
    weeklyReport: true,
    desktopNotifications: false,
    soundEnabled: true
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginAlerts: true,
    deviceTracking: true
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    compactMode: false,
    reducedMotion: false,
    fontSize: 'medium'
  });

  // Signature
  const [signature, setSignature] = useState('Sarah Johnson\nSenior Support Agent\nSupportHub');

  // API Keys setApiKeys
  const [apiKeys ] = useState([
    { id: 1, name: 'Production API Key', key: 'sk_live_••••••••••••••••', created: '2024-01-15', lastUsed: '2 hours ago' },
    { id: 2, name: 'Development API Key', key: 'sk_test_••••••••••••••••', created: '2024-02-20', lastUsed: '3 days ago' },
  ]);

  // Quick Responses
  const [quickResponses, setQuickResponses] = useState([
    { id: 1, title: 'Password Reset', content: 'To reset your password, please visit the login page and click "Forgot Password". You\'ll receive an email with instructions within 5 minutes.', shortcut: '!pw' },
    { id: 2, title: 'Refund Policy', content: 'Our refund policy allows for full refunds within 30 days of purchase. I\'ve gone ahead and processed your refund - you should see it in 3-5 business days.', shortcut: '!refund' },
    { id: 3, title: 'Technical Issue', content: 'I\'m sorry you\'re experiencing this technical issue. Could you please provide the following information: 1) Browser version, 2) Operating system, 3) Steps to reproduce?', shortcut: '!tech' },
  ]);

  const [newResponse, setNewResponse] = useState({ title: '', content: '', shortcut: '' });

  // Handle save
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  // Handle add quick response
  const handleAddResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newResponse.title && newResponse.content) {
      setQuickResponses([
        ...quickResponses,
        {
          id: quickResponses.length + 1,
          title: newResponse.title,
          content: newResponse.content,
          shortcut: newResponse.shortcut || `!${newResponse.title.toLowerCase().replace(/\s+/g, '')}`
        }
      ]);
      setNewResponse({ title: '', content: '', shortcut: '' });
    }
  };

  // Handle delete quick response
  const handleDeleteResponse = (id: number) => {
    setQuickResponses(quickResponses.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AgentNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Settings size={28} className="mr-3 text-purple-600" />
              Settings
            </h1>
            <p className="text-gray-600">
              Manage your account preferences and configuration.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {showSuccess && (
              <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                <Check size={16} className="mr-2" />
                Settings saved successfully!
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <User size={20} className="inline mr-2" />
                <span className="font-medium">{profile.name}</span>
                <p className="text-xs text-purple-200 mt-1">{profile.role}</p>
              </div>
              
              <div className="p-3">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User size={18} className="mr-3" />
                  Profile
                  {activeTab === 'profile' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell size={18} className="mr-3" />
                  Notifications
                  {activeTab === 'notifications' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'security'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Shield size={18} className="mr-3" />
                  Security
                  {activeTab === 'security' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'appearance'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Palette size={18} className="mr-3" />
                  Appearance
                  {activeTab === 'appearance' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('signature')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'signature'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText size={18} className="mr-3" />
                  Signature
                  {activeTab === 'signature' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('quick-responses')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'quick-responses'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare size={18} className="mr-3" />
                  Quick Responses
                  {activeTab === 'quick-responses' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('api')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'api'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Key size={18} className="mr-3" />
                  API Keys
                  {activeTab === 'api' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <div className="border-t border-gray-200 my-3"></div>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} className="mr-3" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl mr-6">
                        {profile.avatar}
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                          Change Avatar
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          JPG, PNG or GIF. Max 2MB.
                        </p>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          value={profile.department}
                          onChange={(e) => setProfile({...profile, department: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Location & Timezone */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={profile.timezone}
                          onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="Europe/London">GMT</option>
                        </select>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Brief description for your profile. Supports Markdown.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Email Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Enable Email Notifications</p>
                            <p className="text-xs text-gray-500">Receive notifications via email</p>
                          </div>
                          <div className="relative inline-block w-12 h-6 rounded-full">
                            <input
                              type="checkbox"
                              checked={notifications.emailNotifications}
                              onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                              className="sr-only"
                            />
                            <span className={`block w-12 h-6 rounded-full transition-colors ${
                              notifications.emailNotifications ? 'bg-purple-600' : 'bg-gray-300'
                            }`}>
                              <span className={`block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                                notifications.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                              }`}></span>
                            </span>
                          </div>
                        </label>

                        {notifications.emailNotifications && (
                          <>
                            <label className="flex items-center justify-between p-3">
                              <div>
                                <p className="text-sm text-gray-700">Ticket assigned to me</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={notifications.ticketAssigned}
                                onChange={(e) => setNotifications({...notifications, ticketAssigned: e.target.checked})}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                            </label>
                            <label className="flex items-center justify-between p-3">
                              <div>
                                <p className="text-sm text-gray-700">Ticket updates</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={notifications.ticketUpdated}
                                onChange={(e) => setNotifications({...notifications, ticketUpdated: e.target.checked})}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                            </label>
                            <label className="flex items-center justify-between p-3">
                              <div>
                                <p className="text-sm text-gray-700">New messages</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={notifications.newMessage}
                                onChange={(e) => setNotifications({...notifications, newMessage: e.target.checked})}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                            </label>
                            <label className="flex items-center justify-between p-3">
                              <div>
                                <p className="text-sm text-gray-700">SLA breach alerts</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={notifications.slaBreach}
                                onChange={(e) => setNotifications({...notifications, slaBreach: e.target.checked})}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                            </label>
                            <label className="flex items-center justify-between p-3">
                              <div>
                                <p className="text-sm text-gray-700">Mentions (@username)</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={notifications.mentions}
                                onChange={(e) => setNotifications({...notifications, mentions: e.target.checked})}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                            </label>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Weekly Report</h3>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Send weekly performance summary</p>
                          <p className="text-xs text-gray-500">Every Monday at 9:00 AM</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.weeklyReport}
                          onChange={(e) => setNotifications({...notifications, weeklyReport: e.target.checked})}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </label>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Desktop Notifications</h3>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Enable desktop notifications</p>
                          <p className="text-xs text-gray-500">Receive real-time alerts in your browser</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.desktopNotifications}
                          onChange={(e) => setNotifications({...notifications, desktopNotifications: e.target.checked})}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between p-3">
                        <div>
                          <p className="text-sm text-gray-700">Play sound for new notifications</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.soundEnabled}
                          onChange={(e) => setNotifications({...notifications, soundEnabled: e.target.checked})}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <AlertCircle size={18} className="text-yellow-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Security Checkup Recommended</p>
                          <p className="text-xs text-yellow-700 mt-1">
                            Your account hasn't had a security review in 90 days.
                          </p>
                          <button className="mt-2 text-xs text-yellow-800 font-medium underline">
                            Start security checkup
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Password</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-700">Last changed 30 days ago</p>
                          </div>
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start">
                          <Shield size={20} className="text-purple-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Enable 2FA</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full">
                          <input
                            type="checkbox"
                            checked={security.twoFactorEnabled}
                            onChange={(e) => setSecurity({...security, twoFactorEnabled: e.target.checked})}
                            className="sr-only"
                          />
                          <span className={`block w-12 h-6 rounded-full transition-colors ${
                            security.twoFactorEnabled ? 'bg-purple-600' : 'bg-gray-300'
                          }`}>
                            <span className={`block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                              security.twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                            }`}></span>
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Session Settings */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Session Settings</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <select
                            value={security.sessionTimeout}
                            onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                            className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="120">2 hours</option>
                          </select>
                        </div>

                        <label className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-700">Login alerts</p>
                            <p className="text-xs text-gray-500">Get notified of new sign-ins</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={security.loginAlerts}
                            onChange={(e) => setSecurity({...security, loginAlerts: e.target.checked})}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-700">Device tracking</p>
                            <p className="text-xs text-gray-500">Track trusted devices</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={security.deviceTracking}
                            onChange={(e) => setSecurity({...security, deviceTracking: e.target.checked})}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </label>
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Smartphone size={18} className="text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">iPhone 14 Pro</p>
                              <p className="text-xs text-gray-500">San Francisco, CA • Last active 2 hours ago</p>
                            </div>
                          </div>
                          <button className="text-xs text-red-600 hover:text-red-700">
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Appearance</h2>
                  
                  <div className="space-y-6">
                    {/* Theme */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          onClick={() => setAppearance({...appearance, theme: 'light'})}
                          className={`p-4 border-2 rounded-xl text-center transition-all ${
                            appearance.theme === 'light'
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Sun size={24} className="mx-auto mb-2 text-yellow-600" />
                          <span className="text-sm font-medium">Light</span>
                        </button>
                        
                        <button
                          onClick={() => setAppearance({...appearance, theme: 'dark'})}
                          className={`p-4 border-2 rounded-xl text-center transition-all ${
                            appearance.theme === 'dark'
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Moon size={24} className="mx-auto mb-2 text-gray-700" />
                          <span className="text-sm font-medium">Dark</span>
                        </button>
                        
                        <button
                          onClick={() => setAppearance({...appearance, theme: 'system'})}
                          className={`p-4 border-2 rounded-xl text-center transition-all ${
                            appearance.theme === 'system'
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Settings size={24} className="mx-auto mb-2 text-gray-600" />
                          <span className="text-sm font-medium">System</span>
                        </button>
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Font Size</h3>
                      <div className="flex items-center gap-4">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            onClick={() => setAppearance({...appearance, fontSize: size})}
                            className={`px-4 py-2 rounded-lg border ${
                              appearance.fontSize === size
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Other Settings */}
                    <div className="pt-6 border-t border-gray-200">
                      <label className="flex items-center justify-between p-3">
                        <div>
                          <p className="text-sm text-gray-700">Compact mode</p>
                          <p className="text-xs text-gray-500">Reduce spacing between elements</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appearance.compactMode}
                          onChange={(e) => setAppearance({...appearance, compactMode: e.target.checked})}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between p-3">
                        <div>
                          <p className="text-sm text-gray-700">Reduced motion</p>
                          <p className="text-xs text-gray-500">Minimize animations</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appearance.reducedMotion}
                          onChange={(e) => setAppearance({...appearance, reducedMotion: e.target.checked})}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Signature Settings */}
              {activeTab === 'signature' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Email Signature</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Signature
                      </label>
                      <textarea
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                        placeholder="Enter your email signature..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Supports plain text and HTML. This signature will be appended to all your replies.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Preview</h3>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                            SJ
                          </div>
                          <div className="whitespace-pre-line text-sm text-gray-700">
                            {signature.split('\n').map((line, i) => (
                              <p key={i} className={i === 0 ? 'font-bold text-gray-900' : ''}>
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Responses */}
              {activeTab === 'quick-responses' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Responses</h2>
                  
                  <div className="space-y-6">
                    {/* Add New Response */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Add New Response</h3>
                      <form onSubmit={handleAddResponse} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Title</label>
                            <input
                              type="text"
                              value={newResponse.title}
                              onChange={(e) => setNewResponse({...newResponse, title: e.target.value})}
                              placeholder="e.g., Welcome Message"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Shortcut (optional)</label>
                            <input
                              type="text"
                              value={newResponse.shortcut}
                              onChange={(e) => setNewResponse({...newResponse, shortcut: e.target.value})}
                              placeholder="!welcome"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Content</label>
                          <textarea
                            value={newResponse.content}
                            onChange={(e) => setNewResponse({...newResponse, content: e.target.value})}
                            rows={4}
                            placeholder="Type your response..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={!newResponse.title || !newResponse.content}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                          >
                            Add Response
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Existing Responses */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Saved Responses</h3>
                      <div className="space-y-4">
                        {quickResponses.map((response) => (
                          <div key={response.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-medium text-gray-900">{response.title}</h4>
                                  {response.shortcut && (
                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-mono">
                                      {response.shortcut}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 whitespace-pre-line">
                                  {response.content}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteResponse(response.id)}
                                className="ml-4 p-1 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <MessageSquare size={18} className="text-purple-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-purple-900">Pro Tip</p>
                          <p className="text-xs text-purple-800 mt-1">
                            Use shortcuts like "!pw" in your replies to automatically expand quick responses. You can also type "/" to see all available shortcuts.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* API Keys */}
              {activeTab === 'api' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">API Keys</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle size={18} className="text-yellow-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Keep your API keys secure</p>
                          <p className="text-xs text-yellow-700 mt-1">
                            Never share your API keys or commit them to version control. Regenerate keys if they are compromised.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                      <Key size={16} className="mr-2" />
                      Generate New API Key
                    </button>

                    <div className="space-y-4">
                      {apiKeys.map((key) => (
                        <div key={key.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-gray-900">{key.name}</h4>
                                <span className="text-xs text-gray-500">Created {key.created}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <code className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono">
                                  {key.key}
                                </code>
                                <button className="p-1.5 text-gray-400 hover:text-gray-600">
                                  <Copy size={14} />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500">Last used {key.lastUsed}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                Revoke
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-gray-600">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Account Confirmation */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="fixed inset-0 bg-black/30" onClick={() => setShowDeleteConfirm(false)}></div>
                  <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
                      <p className="text-gray-600 mb-6">
                        Are you sure you want to delete your account? This action cannot be undone.
                      </p>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            // Handle delete
                          }}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentSettings;