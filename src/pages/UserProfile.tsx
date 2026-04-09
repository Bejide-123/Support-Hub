// pages/UserProfilePage.tsx
import { useState, useEffect } from 'react';
import {
  User,
  Clock,
  Shield,
  Bell,
  Moon,
  Sun,
  Save,
  Edit,
  Camera,
  Smartphone,
  Globe,
  Check,
  X,
  RefreshCw,
  ChevronRight,
  Ticket,
  Star,
  Settings,
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectCurrentUser, updateProfile } from '../features/Auth/authSlice';
import toast from 'react-hot-toast';

const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const user = useAppSelector(selectCurrentUser);

  // Profile data - initialize from Redux user
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    location: '',
    avatar: '',
    bio: '',
    timezone: 'America/Los_Angeles',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  // Initialize profile from user when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        position: user.position || '',
        location: user.location || '',
        avatar: user.avatar || user.name?.charAt(0) || 'U',
        bio: user.bio || '',
        timezone: user.timezone || 'America/Los_Angeles',
        language: user.language || 'en',
        dateFormat: user.dateFormat || 'MM/DD/YYYY',
        timeFormat: user.timeFormat || '12h'
      });
    }
  }, [user]);

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    marketingEmails: false
  });

  // Appearance
  const [appearance, setAppearance] = useState({
    theme: 'light',
    compactView: false,
    reducedMotion: false
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    ticketCreated: true,
    ticketUpdated: true,
    ticketResolved: true,
    newsletter: false,
    productUpdates: true
  });

  // Mock activity
  const recentActivity = [
    { id: 1, action: 'Created ticket #TKT-1242', time: '2 hours ago' },
    { id: 2, action: 'Updated profile information', time: '1 day ago' },
    { id: 3, action: 'Resolved ticket #TKT-1189', time: '3 days ago' },
    { id: 4, action: 'Changed password', time: '1 week ago' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Dispatch update to Redux
      const result = await dispatch(updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        company: profile.company,
        position: profile.position,
        location: profile.location,
        bio: profile.bio,
        timezone: profile.timezone,
        language: profile.language,
        dateFormat: profile.dateFormat,
        timeFormat: profile.timeFormat
      })).unwrap();
      
      // Show success message
      toast.success('Profile updated successfully!');
      setShowSuccess(true);
      setIsEditing(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        position: user.position || '',
        location: user.location || '',
        avatar: user.avatar || user.name?.charAt(0) || 'U',
        bio: user.bio || '',
        timezone: user.timezone || 'America/Los_Angeles',
        language: user.language || 'en',
        dateFormat: user.dateFormat || 'MM/DD/YYYY',
        timeFormat: user.timeFormat || '12h'
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <User size={28} className="mr-3 text-emerald-600" />
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your account settings and preferences.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {showSuccess && (
              <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                <Check size={16} className="mr-2" />
                Profile updated successfully!
              </div>
            )}
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center"
              >
                <Edit size={16} className="mr-2" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
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
              </>
            )}
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
              {/* Avatar Section */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-emerald-600 mx-auto mb-3 border-4 border-white shadow-lg">
                    {profile.avatar}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Camera size={16} className="text-gray-600" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                <p className="text-emerald-100 text-sm mt-1">{profile.position}</p>
                <p className="text-emerald-100 text-xs mt-1">{profile.company}</p>
              </div>

              {/* Quick Stats */}
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Ticket size={18} className="mx-auto text-emerald-600 mb-1" />
                    <p className="text-xs text-gray-500">Tickets</p>
                    <p className="text-lg font-bold text-gray-900">23</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Star size={18} className="mx-auto text-yellow-500 mb-1" />
                    <p className="text-xs text-gray-500">Satisfaction</p>
                    <p className="text-lg font-bold text-gray-900">98%</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-3">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User size={18} className="mr-3" />
                  Profile
                  {activeTab === 'profile' && <ChevronRight size={16} className="ml-auto" />}
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
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'appearance'
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Moon size={18} className="mr-3" />
                  Appearance
                  {activeTab === 'appearance' && <ChevronRight size={16} className="ml-auto" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'activity'
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Clock size={18} className="mr-3" />
                  Recent Activity
                  {activeTab === 'activity' && <ChevronRight size={16} className="ml-auto" />}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2.5">{profile.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2.5">{profile.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2.5">{profile.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2.5">{profile.location}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.company}
                            onChange={(e) => setProfile({...profile, company: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2.5">{profile.company}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.position}
                            onChange={(e) => setProfile({...profile, position: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2.5">{profile.position}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                        />
                      ) : (
                        <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">{profile.bio}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        {isEditing ? (
                          <select
                            value={profile.timezone}
                            onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/New_York">Eastern Time</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 py-2.5">Pacific Time</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        {isEditing ? (
                          <select
                            value={profile.language}
                            onChange={(e) => setProfile({...profile, language: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 py-2.5">English</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Format
                        </label>
                        {isEditing ? (
                          <select
                            value={profile.dateFormat}
                            onChange={(e) => setProfile({...profile, dateFormat: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 py-2.5">MM/DD/YYYY</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Password */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Password</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-700">••••••••</p>
                            <p className="text-xs text-gray-500 mt-1">Last changed 30 days ago</p>
                          </div>
                          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex items-start">
                          <Shield size={20} className="text-emerald-600 mr-3" />
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
                            security.twoFactorEnabled ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}>
                            <span className={`block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                              security.twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                            }`}></span>
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Login Alerts */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Login Alerts</h3>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-700">Email me when a new device logs in</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={security.loginAlerts}
                          onChange={(e) => setSecurity({...security, loginAlerts: e.target.checked})}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                    </div>

                    {/* Active Sessions */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Smartphone size={18} className="text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">iPhone 14 Pro</p>
                              <p className="text-xs text-gray-500">San Francisco, CA • Current device</p>
                            </div>
                          </div>
                          <span className="text-xs text-green-600 font-medium">Active now</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Globe size={18} className="text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">MacBook Pro</p>
                              <p className="text-xs text-gray-500">San Francisco, CA • 2 days ago</p>
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

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Email Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                        
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Ticket Updated</p>
                            <p className="text-xs text-gray-500">When an agent responds to your ticket</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.ticketUpdated}
                            onChange={(e) => setNotifications({...notifications, ticketUpdated: e.target.checked})}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                        
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Ticket Resolved</p>
                            <p className="text-xs text-gray-500">When your ticket is marked as resolved</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.ticketResolved}
                            onChange={(e) => setNotifications({...notifications, ticketResolved: e.target.checked})}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Marketing & Updates</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                        
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Newsletter</p>
                            <p className="text-xs text-gray-500">Monthly tips and best practices</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.newsletter}
                            onChange={(e) => setNotifications({...notifications, newsletter: e.target.checked})}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
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

                    {/* Other Settings */}
                    <div className="pt-6 border-t border-gray-200">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Compact View</p>
                          <p className="text-xs text-gray-500">Show more content with reduced spacing</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appearance.compactView}
                          onChange={(e) => setAppearance({...appearance, compactView: e.target.checked})}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                  
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                          <Clock size={16} className="text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    View all activity →
                  </button>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            {activeTab === 'profile' && (
              <div className="mt-6 bg-white rounded-xl border border-red-200 p-6">
                <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delete Account</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;