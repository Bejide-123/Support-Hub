// pages/UserSettingsPage.tsx
import { useState } from 'react';
// import { Link } from 'react-router-dom';
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Moon,
  Sun,
  Smartphone,
  CreditCard,
  // FileText,
  Download,
  Save,
  ChevronRight,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Volume2,
  Lock
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const UserSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Account Settings
  const [account, setAccount] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc.',
    position: 'Product Manager',
    language: 'en',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    ticketCreated: true,
    ticketUpdated: true,
    ticketResolved: true,
    agentReplied: true,
    marketingEmails: false,
    productUpdates: true,
    desktopNotifications: false,
    soundEnabled: true
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: '30',
    passwordLastChanged: '30 days ago'
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    compactMode: false,
    reducedMotion: false,
    fontSize: 'medium'
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showActivity: true,
    allowDataCollection: true,
    allowCookies: true
  });

  // Billing Settings setBilling
  const [billing ] = useState({
    plan: 'Pro Annual',
    nextBilling: 'Apr 15, 2024',
    amount: '$49.99',
    paymentMethod: 'Visa •••• 4242',
    expDate: '12/25'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  // Mock sessions
  const sessions = [
    { device: 'iPhone 14 Pro', location: 'San Francisco, CA', lastActive: 'Now', current: true },
    { device: 'MacBook Pro', location: 'San Francisco, CA', lastActive: '2 hours ago', current: false },
    { device: 'iPad Air', location: 'San Francisco, CA', lastActive: '3 days ago', current: false },
  ];

  // Mock connected apps
  const connectedApps = [
    { name: 'Slack', icon: '🔵', status: 'Connected', connectedAt: 'Jan 15, 2024' },
    { name: 'Google Workspace', icon: '🟡', status: 'Connected', connectedAt: 'Feb 20, 2024' },
    { name: 'Salesforce', icon: '🔷', status: 'Disconnected', connectedAt: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Settings size={28} className="mr-3 text-emerald-600" />
              Settings
            </h1>
            <p className="text-gray-600">
              Manage your account preferences and configurations.
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
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center disabled:opacity-50"
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
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <User size={20} className="inline mr-2" />
                <span className="font-medium">{account.name}</span>
                <p className="text-xs text-emerald-100 mt-1">{account.email}</p>
              </div>
              
              <div className="p-3">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'account'
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User size={18} className="mr-3" />
                  Account
                  {activeTab === 'account' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
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
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Shield size={18} className="mr-3" />
                  Security
                  {activeTab === 'security' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'privacy'
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Lock size={18} className="mr-3" />
                  Privacy
                  {activeTab === 'privacy' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'appearance'
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Palette size={18} className="mr-3" />
                  Appearance
                  {activeTab === 'appearance' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'billing'
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard size={18} className="mr-3" />
                  Billing
                  {activeTab === 'billing' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('connected')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'connected'
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Globe size={18} className="mr-3" />
                  Connected Apps
                  {activeTab === 'connected' && <ChevronRight size={16} className="ml-auto" />}
                </button>

                <div className="border-t border-gray-200 my-3"></div>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <AlertCircle size={18} className="mr-3" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={account.name}
                            onChange={(e) => setAccount({...account, name: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={account.email}
                            onChange={(e) => setAccount({...account, email: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={account.phone}
                            onChange={(e) => setAccount({...account, phone: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            value={account.company}
                            onChange={(e) => setAccount({...account, company: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Position
                          </label>
                          <input
                            type="text"
                            value={account.position}
                            onChange={(e) => setAccount({...account, position: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Preferences</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            value={account.language}
                            onChange={(e) => setAccount({...account, language: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="ja">Japanese</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={account.timezone}
                            onChange={(e) => setAccount({...account, timezone: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Format
                          </label>
                          <select
                            value={account.dateFormat}
                            onChange={(e) => setAccount({...account, dateFormat: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time Format
                          </label>
                          <select
                            value={account.timeFormat}
                            onChange={(e) => setAccount({...account, timeFormat: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="12h">12-hour (12:00 PM)</option>
                            <option value="24h">24-hour (14:00)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <label className="relative inline-block w-12 h-6 rounded-full">
                          <input
                            type="checkbox"
                            checked={notifications.emailNotifications}
                            onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                            className="sr-only"
                          />
                          <span className={`block w-12 h-6 rounded-full transition-colors ${
                            notifications.emailNotifications ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}>
                            <span className={`block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                              notifications.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                            }`}></span>
                          </span>
                        </label>
                      </div>
                      
                      {notifications.emailNotifications && (
                        <div className="space-y-3 mt-4">
                          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Ticket Created</p>
                              <p className="text-xs text-gray-500">When you create a new ticket</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notifications.ticketCreated}
                              onChange={(e) => setNotifications({...notifications, ticketCreated: e.target.checked})}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Ticket Updated</p>
                              <p className="text-xs text-gray-500">When an agent responds</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notifications.ticketUpdated}
                              onChange={(e) => setNotifications({...notifications, ticketUpdated: e.target.checked})}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Agent Replied</p>
                              <p className="text-xs text-gray-500">When you receive a reply</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notifications.agentReplied}
                              onChange={(e) => setNotifications({...notifications, agentReplied: e.target.checked})}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Ticket Resolved</p>
                              <p className="text-xs text-gray-500">When your ticket is closed</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notifications.ticketResolved}
                              onChange={(e) => setNotifications({...notifications, ticketResolved: e.target.checked})}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Desktop Notifications */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Desktop Notifications</h3>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Enable Desktop Notifications</p>
                          <p className="text-xs text-gray-500">Receive real-time alerts in your browser</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.desktopNotifications}
                          onChange={(e) => setNotifications({...notifications, desktopNotifications: e.target.checked})}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                      
                      {notifications.desktopNotifications && (
                        <label className="flex items-center justify-between p-4 mt-2">
                          <div className="flex items-center">
                            <Volume2 size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">Play sound</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.soundEnabled}
                            onChange={(e) => setNotifications({...notifications, soundEnabled: e.target.checked})}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                      )}
                    </div>

                    {/* Marketing Preferences */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Marketing Preferences</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Product Updates</p>
                            <p className="text-xs text-gray-500">New features and improvements</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.productUpdates}
                            onChange={(e) => setNotifications({...notifications, productUpdates: e.target.checked})}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                        
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
                            <p className="text-xs text-gray-500">Promotions and special offers</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.marketingEmails}
                            onChange={(e) => setNotifications({...notifications, marketingEmails: e.target.checked})}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Password */}
                    <div className="bg-gray-50 rounded-lg p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Password</h3>
                          <p className="text-xs text-gray-500 mt-1">Last changed {security.passwordLastChanged}</p>
                        </div>
                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                          Change Password
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border border-gray-200 rounded-lg p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <Shield size={20} className="text-emerald-600 mr-3 mt-0.5" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-block w-12 h-6 rounded-full">
                          <input
                            type="checkbox"
                            checked={security.twoFactorEnabled}
                            onChange={(e) => setSecurity({...security, twoFactorEnabled: e.target.checked})}
                            className="sr-only"
                          />
                          <span className={`block w-12 h-6 rounded-full transition-colors ${
                            security.twoFactorEnabled ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}>
                            <span className={`block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                              security.twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                            }`}></span>
                          </span>
                        </label>
                      </div>
                      {security.twoFactorEnabled && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-700">
                            2FA is enabled. You'll need a verification code from your authenticator app each time you sign in.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Session Timeout */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Session Timeout</h3>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                        className="w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                        <option value="240">4 hours</option>
                      </select>
                    </div>

                    {/* Active Sessions */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Active Sessions</h3>
                      <div className="space-y-3">
                        {sessions.map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <Smartphone size={18} className="text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {session.device}
                                  {session.current && (
                                    <span className="ml-2 text-xs text-green-600 font-normal">Current</span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {session.location} • {session.lastActive}
                                </p>
                              </div>
                            </div>
                            {!session.current && (
                              <button className="text-xs text-red-600 hover:text-red-700">
                                Revoke
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Login Alerts */}
                    <div className="pt-4">
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Login Alerts</p>
                          <p className="text-xs text-gray-500">Get notified of new sign-ins</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={security.loginAlerts}
                          onChange={(e) => setSecurity({...security, loginAlerts: e.target.checked})}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Profile Visibility</h3>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <input
                            type="radio"
                            name="visibility"
                            value="public"
                            checked={privacy.profileVisibility === 'public'}
                            onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="ml-3">
                            <span className="text-sm font-medium text-gray-900">Public</span>
                            <p className="text-xs text-gray-500">Your profile is visible to everyone</p>
                          </span>
                        </label>
                        
                        <label className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <input
                            type="radio"
                            name="visibility"
                            value="private"
                            checked={privacy.profileVisibility === 'private'}
                            onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="ml-3">
                            <span className="text-sm font-medium text-gray-900">Private</span>
                            <p className="text-xs text-gray-500">Only visible to support agents</p>
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Data & Privacy */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Data & Privacy</h3>
                      
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Show Activity Status</p>
                          <p className="text-xs text-gray-500">Let others see when you're active</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy.showActivity}
                          onChange={(e) => setPrivacy({...privacy, showActivity: e.target.checked})}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Data Collection</p>
                          <p className="text-xs text-gray-500">Help us improve by sharing usage data</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy.allowDataCollection}
                          onChange={(e) => setPrivacy({...privacy, allowDataCollection: e.target.checked})}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Cookie Consent</p>
                          <p className="text-xs text-gray-500">Allow essential and functional cookies</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy.allowCookies}
                          onChange={(e) => setPrivacy({...privacy, allowCookies: e.target.checked})}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                    </div>

                    {/* Download Data */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Your Data</h3>
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <p className="text-sm text-gray-700 mb-4">
                          You can request a copy of all your data stored in SupportHub.
                        </p>
                        <button className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                          <Download size={16} className="mr-2" />
                          Request Data Export
                        </button>
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
                              ? 'border-emerald-500 bg-emerald-50'
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
                              ? 'border-emerald-500 bg-emerald-50'
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
                              ? 'border-emerald-500 bg-emerald-50'
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
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Display Options */}
                    <div className="pt-6 border-t border-gray-200">
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Compact Mode</p>
                          <p className="text-xs text-gray-500">Show more content with reduced spacing</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appearance.compactMode}
                          onChange={(e) => setAppearance({...appearance, compactMode: e.target.checked})}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Reduced Motion</p>
                          <p className="text-xs text-gray-500">Minimize animations throughout the app</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appearance.reducedMotion}
                          onChange={(e) => setAppearance({...appearance, reducedMotion: e.target.checked})}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Settings */}
              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Billing & Subscription</h2>
                  
                  <div className="space-y-6">
                    {/* Current Plan */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-emerald-100 text-sm">Current Plan</p>
                          <h3 className="text-2xl font-bold">{billing.plan}</h3>
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-lg">
                          <p className="text-sm">Active</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-100 text-sm">Next billing</p>
                          <p className="text-lg font-semibold">{billing.nextBilling}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-100 text-sm">Amount</p>
                          <p className="text-lg font-semibold">{billing.amount}/mo</p>
                        </div>
                      </div>
                      
                      <button className="mt-6 w-full px-4 py-2.5 bg-white text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors">
                        Manage Subscription
                      </button>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Payment Method</h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <CreditCard size={20} className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{billing.paymentMethod}</p>
                            <p className="text-xs text-gray-500">Expires {billing.expDate}</p>
                          </div>
                        </div>
                        <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                          Update
                        </button>
                      </div>
                    </div>

                    {/* Invoice History */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Invoice History</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">March 2024</p>
                            <p className="text-xs text-gray-500">Mar 15, 2024</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-4">$49.99</span>
                            <Download size={16} className="text-gray-400 hover:text-emerald-600 cursor-pointer" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">February 2024</p>
                            <p className="text-xs text-gray-500">Feb 15, 2024</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-4">$49.99</span>
                            <Download size={16} className="text-gray-400 hover:text-emerald-600 cursor-pointer" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">January 2024</p>
                            <p className="text-xs text-gray-500">Jan 15, 2024</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-4">$49.99</span>
                            <Download size={16} className="text-gray-400 hover:text-emerald-600 cursor-pointer" />
                          </div>
                        </div>
                      </div>
                      <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        View all invoices →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Connected Apps */}
              {activeTab === 'connected' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Connected Apps</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle size={18} className="text-yellow-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Manage connected applications</p>
                          <p className="text-xs text-yellow-700 mt-1">
                            Review and revoke access for apps connected to your account.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {connectedApps.map((app, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-emerald-200 transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl mr-4">
                              {app.icon}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h4 className="text-sm font-medium text-gray-900">{app.name}</h4>
                                <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                                  app.status === 'Connected' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {app.status}
                                </span>
                              </div>
                              {app.connectedAt && (
                                <p className="text-xs text-gray-500 mt-1">Connected {app.connectedAt}</p>
                              )}
                            </div>
                          </div>
                          {app.status === 'Connected' ? (
                            <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              Revoke
                            </button>
                          ) : (
                            <button className="px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              Connect
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors flex items-center justify-center">
                        <Globe size={18} className="mr-2" />
                        Browse Integration Directory
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Account Confirmation Modal */}
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
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm font-medium text-gray-900 mb-2">This will:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <X size={12} className="text-red-500 mr-2" />
                    Permanently delete your profile
                  </li>
                  <li className="flex items-center">
                    <X size={12} className="text-red-500 mr-2" />
                    Remove all your tickets and conversations
                  </li>
                  <li className="flex items-center">
                    <X size={12} className="text-red-500 mr-2" />
                    Cancel your subscription
                  </li>
                  <li className="flex items-center">
                    <X size={12} className="text-red-500 mr-2" />
                    Remove access to all connected apps
                  </li>
                </ul>
              </div>
              
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
                    // Handle account deletion
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
  );
};

export default UserSettingsPage;