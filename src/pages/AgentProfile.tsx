// pages/AgentProfilePage.tsx
import { useState } from 'react';
// import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  Calendar,
  Github,
  Twitter,
  Linkedin,
  Save,
  Edit,
  Camera,
  Check,
  X,
  RefreshCw,
  Star,
  Ticket,
  ThumbsUp,
  TrendingUp,
  Users,
  Medal,
  Crown
} from 'lucide-react';
import AgentNavbar from '../components/AgentNavbar';

const AgentProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile data
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@supporthub.com',
    phone: '+1 (555) 987-6543',
    role: 'Senior Support Agent',
    department: 'Customer Support',
    team: 'Enterprise Support',
    manager: 'Michael Chen',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    avatar: 'SJ',
    bio: 'Senior support agent with 5+ years of experience in SaaS customer service. Specialized in billing and technical issues. Passionate about helping customers and improving support processes.',
    skills: ['Billing', 'Technical Support', 'API', 'Customer Success', 'Documentation'],
    languages: ['English (Native)', 'Spanish (Conversational)'],
    certifications: ['Support Hero Certified', 'Advanced Troubleshooting', 'Customer Success Manager'],
    social: {
      github: 'sarahjohnson',
      twitter: 'sarah_support',
      linkedin: 'sarahjohnson'
    },
    employment: {
      startDate: 'Jan 15, 2022',
      employeeId: 'EMP-2022-0842',
      shift: 'Morning (8AM - 5PM PST)'
    }
  });

  // Performance metrics
  const performance = {
    ticketsResolved: 1248,
    satisfaction: 99,
    responseTime: '2.8m',
    resolutionTime: '4.2h',
    currentTickets: 8,
    achievements: [
      { id: 1, name: '1000 Tickets Milestone', date: 'Feb 2024', icon: <Medal size={16} /> },
      { id: 2, name: 'Customer Hero - Q1 2024', date: 'Mar 2024', icon: <Crown size={16} /> },
      { id: 3, name: 'Perfect CSAT - 6 months', date: 'Jan 2024', icon: <Star size={16} /> }
    ]
  };

  // Recent activity
  const recentActivity = [
    { id: 1, action: 'Resolved ticket #TKT-1245', time: '15 minutes ago' },
    { id: 2, action: 'Assigned to ticket #TKT-1248', time: '1 hour ago' },
    { id: 3, action: 'Updated knowledge base article', time: '3 hours ago' },
    { id: 4, action: 'Completed training: Advanced Billing', time: '2 days ago' },
  ];

  // Team members
  const team = [
    { name: 'Mike Chen', role: 'Support Agent', avatar: 'MC' },
    { name: 'Emily Rodriguez', role: 'Support Agent', avatar: 'ER' },
    { name: 'David Kim', role: 'Junior Agent', avatar: 'DK' },
    { name: 'Lisa Patel', role: 'Support Agent', avatar: 'LP' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AgentNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <User size={28} className="mr-3 text-purple-600" />
              Agent Profile
            </h1>
            <p className="text-gray-600">
              View and manage your professional profile.
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
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Edit size={16} className="mr-2" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
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
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
                <div className="relative inline-block">
                  <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-purple-600 mx-auto mb-3 border-4 border-white shadow-lg">
                    {profile.avatar}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Camera size={16} className="text-gray-600" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                <p className="text-purple-100 text-sm mt-1">{profile.role}</p>
                <div className="mt-3 inline-flex items-center bg-white/20 px-3 py-1 rounded-full">
                  <Award size={14} className="mr-1 text-white" />
                  <span className="text-xs text-white">Top Performer 2024</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Ticket size={18} className="mx-auto text-purple-600 mb-1" />
                    <p className="text-xs text-gray-500">Resolved</p>
                    <p className="text-lg font-bold text-gray-900">{performance.ticketsResolved}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <ThumbsUp size={18} className="mx-auto text-green-600 mb-1" />
                    <p className="text-xs text-gray-500">CSAT</p>
                    <p className="text-lg font-bold text-gray-900">{performance.satisfaction}%</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock size={18} className="mx-auto text-blue-600 mb-1" />
                    <p className="text-xs text-gray-500">Response</p>
                    <p className="text-lg font-bold text-gray-900">{performance.responseTime}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <TrendingUp size={18} className="mx-auto text-emerald-600 mb-1" />
                    <p className="text-xs text-gray-500">Resolution</p>
                    <p className="text-lg font-bold text-gray-900">{performance.resolutionTime}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail size={16} className="text-gray-400 mr-3" />
                    <span className="text-gray-600">{profile.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone size={16} className="text-gray-400 mr-3" />
                    <span className="text-gray-600">{profile.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="text-gray-400 mr-3" />
                    <span className="text-gray-600">{profile.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock size={16} className="text-gray-400 mr-3" />
                    <span className="text-gray-600">{profile.timezone}</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Social</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Github size={16} className="text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">GitHub</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.social.github}
                        onChange={(e) => setProfile({
                          ...profile, 
                          social: {...profile.social, github: e.target.value}
                        })}
                        className="text-sm border border-gray-300 rounded px-2 py-1 w-32"
                      />
                    ) : (
                      <span className="text-sm text-purple-600">{profile.social.github}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Twitter size={16} className="text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Twitter</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.social.twitter}
                        onChange={(e) => setProfile({
                          ...profile, 
                          social: {...profile.social, twitter: e.target.value}
                        })}
                        className="text-sm border border-gray-300 rounded px-2 py-1 w-32"
                      />
                    ) : (
                      <span className="text-sm text-purple-600">{profile.social.twitter}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Linkedin size={16} className="text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">LinkedIn</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.social.linkedin}
                        onChange={(e) => setProfile({
                          ...profile, 
                          social: {...profile.social, linkedin: e.target.value}
                        })}
                        className="text-sm border border-gray-300 rounded px-2 py-1 w-32"
                      />
                    ) : (
                      <span className="text-sm text-purple-600">{profile.social.linkedin}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === 'profile'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <User size={16} className="inline mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('performance')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === 'performance'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <TrendingUp size={16} className="inline mr-2" />
                    Performance
                  </button>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === 'skills'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Award size={16} className="inline mr-2" />
                    Skills & Certifications
                  </button>
                  <button
                    onClick={() => setActiveTab('team')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === 'team'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Users size={16} className="inline mr-2" />
                    Team
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
                    Activity
                  </button>
                </div>
              </div>

              <div className="p-6">
                
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Bio</h3>
                      {isEditing ? (
                        <textarea
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                        />
                      ) : (
                        <p className="text-gray-600 p-4 bg-gray-50 rounded-lg">{profile.bio}</p>
                      )}
                    </div>

                    {/* Employment Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Employment</h3>
                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Employee ID</span>
                            <span className="text-sm font-medium text-gray-900">{profile.employment.employeeId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Start Date</span>
                            <span className="text-sm text-gray-900">{profile.employment.startDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Department</span>
                            <span className="text-sm text-gray-900">{profile.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Team</span>
                            <span className="text-sm text-gray-900">{profile.team}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Manager</span>
                            <span className="text-sm text-purple-600">{profile.manager}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Shift</span>
                            <span className="text-sm text-gray-900">{profile.employment.shift}</span>
                          </div>
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Languages</h3>
                        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                          {profile.languages.map((lang, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-gray-900">{lang}</span>
                              {isEditing && (
                                <button className="text-xs text-red-600">Remove</button>
                              )}
                            </div>
                          ))}
                          {isEditing && (
                            <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                              + Add Language
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg p-5 text-white">
                        <p className="text-purple-100 text-xs mb-1">This Month</p>
                        <p className="text-2xl font-bold mb-1">142</p>
                        <p className="text-xs text-purple-200">Tickets Resolved</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <p className="text-gray-500 text-xs mb-1">Avg Response</p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">2.8m</p>
                        <span className="text-xs text-green-600">↓ 0.3m vs last month</span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <p className="text-gray-500 text-xs mb-1">CSAT Score</p>
                        <div className="flex items-end gap-2">
                          <p className="text-2xl font-bold text-gray-900">99%</p>
                          <span className="text-xs text-green-600 mb-1">↑ 2%</span>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <p className="text-gray-500 text-xs mb-1">Currently Assigned</p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{performance.currentTickets}</p>
                        <span className="text-xs text-yellow-600">3 urgent</span>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Achievements</h3>
                      <div className="space-y-3">
                        {performance.achievements.map((achievement) => (
                          <div key={achievement.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                              <span className="text-purple-600">{achievement.icon}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                              <p className="text-xs text-gray-500">Earned {achievement.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekly Stats */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Weekly Performance</h3>
                      <div className="h-32 flex items-end justify-between gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                          <div key={day} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-purple-500 rounded-t"
                              style={{ height: `${[32, 28, 35, 30, 38, 22, 18][i]}px` }}
                            ></div>
                            <span className="text-xs text-gray-600 mt-2">{day}</span>
                            <span className="text-xs font-medium text-gray-900">{20 + i * 2}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    {/* Skills */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium flex items-center"
                          >
                            {skill}
                            {isEditing && (
                              <button className="ml-2 text-purple-600 hover:text-purple-800">
                                <X size={14} />
                              </button>
                            )}
                          </span>
                        ))}
                        {isEditing && (
                          <button className="px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors text-sm">
                            + Add Skill
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Certifications</h3>
                      <div className="space-y-3">
                        {profile.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <Award size={18} className="text-purple-600 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{cert}</p>
                                <p className="text-xs text-gray-500">Issued by SupportHub Academy</p>
                              </div>
                            </div>
                            {isEditing && (
                              <button className="text-red-600 hover:text-red-700">
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                            + Add Certification
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Tab */}
                {activeTab === 'team' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">My Team</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {team.map((member, index) => (
                          <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                              {member.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-xs text-gray-500">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                      <div className="flex items-start">
                        <Users size={20} className="text-purple-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-purple-900">Team Performance</h4>
                          <p className="text-xs text-purple-800 mt-1">
                            Your team has resolved 342 tickets this week with 98% satisfaction rate.
                          </p>
                          <button className="mt-3 text-xs text-purple-700 font-medium underline">
                            View team dashboard
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <Clock size={16} className="text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium">
                      View all activity →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Calendar size={20} className="mr-2 text-purple-600" />
                  Upcoming Schedule
                </h3>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View full schedule
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-sm font-bold text-purple-600">9</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Morning Standup</p>
                      <p className="text-xs text-gray-500">9:00 AM - 9:30 AM</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Today
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-sm font-bold text-purple-600">14</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Team Training</p>
                      <p className="text-xs text-gray-500">2:00 PM - 3:00 PM</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    Today
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-sm font-bold text-purple-600">21</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">1:1 with Manager</p>
                      <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentProfilePage;