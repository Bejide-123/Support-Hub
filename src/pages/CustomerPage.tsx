// pages/CustomerProfilePage.tsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Building, Ticket, Clock,
  MessageSquare, Star, ThumbsUp, ThumbsDown, Edit, Save, X,
  Download, Search, ChevronRight, User,
  Shield, CreditCard, Activity, Settings, Circle, 
} from 'lucide-react';
import AgentNavbar from '../components/AgentNavbar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCustomerById, getCustomerById } from '../features/Auth/authSlice';

/* ── design tokens ──────────────────────────────────────────── */
const STATUS_CFG: Record<string, { cls: string; dot: string; label: string }> = {
  open:       { cls: "text-sky-600 bg-sky-50 border-sky-200",           dot: "bg-sky-500",     label: "Open"       },
  'in-progress':{ cls: "text-amber-600 bg-amber-50 border-amber-200",   dot: "bg-amber-400",   label: "In Progress"},
  resolved:   { cls: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500",label: "Resolved"   },
  closed:     { cls: "text-gray-400 bg-gray-100 border-gray-200",       dot: "bg-gray-400",    label: "Closed"     },
  active:     { cls: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500",label: "Active"     },
  inactive:   { cls: "text-gray-500 bg-gray-100 border-gray-200",       dot: "bg-gray-400",    label: "Inactive"   },
  suspended:  { cls: "text-red-600 bg-red-50 border-red-200",           dot: "bg-red-500",     label: "Suspended"  },
};

const StatusBadge = ({ status }: { status?: string }) => {
  const key = status?.toLowerCase() || '';
  const cfg = STATUS_CFG[key] ?? { cls: "text-gray-500 bg-gray-100 border-gray-200", dot: "bg-gray-400", label: status || "Unknown" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const SatisfactionBadge = ({ rating }: { rating?: string }) => {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    positive: { cls: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: <ThumbsUp size={10} /> },
    neutral:  { cls: "text-amber-600 bg-amber-50 border-amber-200",       icon: <span className="text-[10px]">–</span> },
    negative: { cls: "text-red-600 bg-red-50 border-red-200",             icon: <ThumbsDown size={10} /> },
  };
  const cfg = map[rating || ''] ?? map.neutral;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.cls}`}>
      {cfg.icon}
      {rating ? rating.charAt(0).toUpperCase() + rating.slice(1) : '—'}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────── */
const CustomerProfilePage = () => {
  const dispatch  = useAppDispatch();
  const { id }    = useParams();
  const [tab, setTab]         = useState('overview');
  const [editing, setEditing] = useState(false);

  const customer = useAppSelector(s => selectCustomerById(s, id || ''));

  const [editForm, setEditForm] = useState({
    name: customer?.name || '', email: customer?.email || '',
    phone: customer?.phone || '', company: customer?.company || '',
    position: customer?.position || '', location: customer?.location || '',
    timezone: customer?.timezone || 'PST (UTC-8)', language: customer?.language || 'English',
  });

  useEffect(() => { if (id) dispatch(getCustomerById(id)); }, [dispatch, id]);

  /* mock data */
  const tickets = [
    { id: 'TKT-1242', subject: 'Subscription downgrade not reflecting', status: 'in-progress', priority: 'high',   created: '2024-03-14', satisfaction: null        },
    { id: 'TKT-1189', subject: 'Login issues with 2FA',                  status: 'resolved',    priority: 'medium', created: '2024-02-28', satisfaction: 'positive'  },
    { id: 'TKT-1123', subject: 'Feature request: Dark mode',             status: 'closed',      priority: 'low',    created: '2024-01-15', satisfaction: 'positive'  },
    { id: 'TKT-1087', subject: 'Billing invoice correction',             status: 'resolved',    priority: 'medium', created: '2024-01-03', satisfaction: 'positive'  },
    { id: 'TKT-1054', subject: 'Team member invitation not sending',      status: 'resolved',    priority: 'high',   created: '2023-12-12', satisfaction: 'neutral'   },
  ];

  const activities = [
    { id: 1, type: 'ticket-created',  description: 'Created ticket #TKT-1242',                    timestamp: '2 hours ago',  agent: null          },
    { id: 2, type: 'login',           description: 'Logged in from San Francisco, CA',             timestamp: '2 hours ago',  agent: null          },
    { id: 3, type: 'ticket-updated',  description: 'Ticket #TKT-1242 updated by Sarah Johnson',   timestamp: '1 hour ago',   agent: 'Sarah Johnson'},
    { id: 4, type: 'payment',         description: 'Subscription payment processed — $49.99',     timestamp: '3 days ago',   agent: null          },
    { id: 5, type: 'plan-changed',    description: 'Changed plan from Basic to Pro',               timestamp: 'Jan 15, 2024', agent: null          },
  ];

  const [notes, setNotes] = useState([
    { id: 1, author: 'Sarah Johnson', avatar: 'SJ', content: 'Customer prefers email. Usually responds within 2 hours.', timestamp: 'Feb 28, 2024', pinned: true  },
    { id: 2, author: 'Mike Chen',     avatar: 'MC', content: 'Similar billing issue last month — check subscription sync.', timestamp: 'Mar 14, 2024', pinned: false },
  ]);
  const [newNote, setNewNote] = useState('');

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([{ id: notes.length + 1, author: 'Sarah Johnson', avatar: 'SJ', content: newNote, timestamp: 'Just now', pinned: false }, ...notes]);
    setNewNote('');
  };

  const activityIcon = (type: string) => {
    const map: Record<string, React.ReactNode> = {
      'ticket-created':  <Ticket size={13} className="text-sky-500" />,
      'ticket-updated':  <Edit size={13} className="text-amber-500" />,
      'login':           <User size={13} className="text-emerald-500" />,
      'payment':         <CreditCard size={13} className="text-violet-500" />,
      'plan-changed':    <Settings size={13} className="text-gray-400" />,
    };
    return map[type] ?? <Circle size={13} className="text-gray-400" />;
  };

  const TABS = [
    { key: 'overview',  label: 'Overview',       icon: <Activity size={13}  /> },
    { key: 'tickets',   label: 'Ticket History', icon: <Ticket size={13}    /> },
    { key: 'activity',  label: 'Activity Log',   icon: <Clock size={13}     /> },
    { key: 'billing',   label: 'Billing',        icon: <CreditCard size={13}/> },
  ];

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <AgentNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* Back */}
        <div className="pt-6 mb-5">
          <Link to="/agent/customers" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-violet-600 transition-colors font-medium">
            <ArrowLeft size={15} /> Back to Customers
          </Link>
        </div>

        {/* ── Profile hero card ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

            {/* Avatar + info */}
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
                {(customer?.avatar || customer?.name?.substring(0,2) || '??').slice(0,2).toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  {editing ? (
                    <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="text-xl font-extrabold text-gray-900 border border-gray-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-violet-400 outline-none" />
                  ) : (
                    <h1 className="text-xl font-extrabold text-gray-900">{customer?.name || '—'}</h1>
                  )}
                  <StatusBadge status={customer?.status} />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 mb-3">
                  <span>{customer?.position || 'Employee'}</span>
                  <span className="text-gray-300">·</span>
                  <span>{customer?.company || 'N/A'}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs">Member since {customer?.created_at || '—'}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a href={`mailto:${customer?.email}`}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 transition-colors">
                    <Mail size={13} className="text-gray-300" /> {customer?.email || '—'}
                  </a>
                  <a href={`tel:${customer?.phone}`}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 transition-colors">
                    <Phone size={13} className="text-gray-300" /> {customer?.phone || '—'}
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors">
                    <X size={14} /> Cancel
                  </button>
                  <button onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors">
                    <Save size={14} /> Save
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors">
                  <Edit size={14} /> Edit
                </button>
              )}
              <button className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 active:scale-95 transition-all shadow-sm shadow-violet-200">
                <MessageSquare size={14} /> New Ticket
              </button>
            </div>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
          {[
            { label: "Total Tickets",  value: customer?.total_tickets    || 0,     accent: "bg-violet-500",  color: "text-gray-900"    },
            { label: "Resolved",       value: customer?.resolved_tickets || 0,     accent: "bg-emerald-500", color: "text-emerald-600" },
            { label: "Satisfaction",   value: `${customer?.satisfaction  || 0}%`,  accent: "bg-amber-400",   color: "text-amber-600"   },
            { label: "LTV",            value: "$1,240",                            accent: "bg-indigo-500",  color: "text-indigo-600"  },
            { label: "Last Active",    value: customer?.updated_at       || "N/A", accent: "bg-sky-500",     color: "text-gray-700", small: true },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 group hover:shadow-md transition-shadow">
              <div className={`h-1 rounded-full ${s.accent} mb-3 w-8 group-hover:w-full transition-all duration-500`} />
              <p className={`${s.small ? 'text-sm font-bold mt-1' : 'text-2xl font-extrabold'} ${s.color} mb-0.5`}>{s.value}</p>
              <p className="text-xs text-gray-400 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Main grid ───────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-5">

          {/* LEFT ── tabs + content */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Tab bar */}
            <div className="flex border-b border-gray-100 bg-gray-50/60 overflow-x-auto">
              {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`relative px-5 py-3.5 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                    tab === t.key ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'
                  }`}>
                  {t.icon} {t.label}
                  {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="p-6">

              {/* ── Overview ──────────────────────────────────── */}
              {tab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Information</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        { icon: <Building size={14}/>, label: "Company",  val: customer?.company  || 'N/A' },
                        { icon: <MapPin size={14}/>,   label: "Location", val: customer?.location || 'N/A' },
                        { icon: <Clock size={14}/>,    label: "Timezone", val: customer?.timezone || 'PST (UTC-8)' },
                        { icon: <MessageSquare size={14}/>, label: "Language", val: customer?.language || 'English' },
                      ].map(({ icon, label, val }) => (
                        <div key={label} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-gray-300 flex-shrink-0">{icon}</span>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                            <p className="text-sm font-semibold text-gray-700">{val}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Activity</p>
                      <button onClick={() => setTab('activity')} className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors">View all →</button>
                    </div>
                    <div className="space-y-2">
                      {activities.slice(0,3).map(a => (
                        <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            {activityIcon(a.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 font-medium">{a.description}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{a.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tickets ──────────────────────────────────── */}
              {tab === 'tickets' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ticket History</p>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search tickets…"
                          className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-violet-400 outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {tickets.map(t => (
                      <Link key={t.id} to={`/agent/tickets/${t.id}`}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-violet-50 hover:border-violet-100 border border-transparent transition-all group">
                        <div className={`w-1 h-10 rounded-full flex-shrink-0 ${
                          t.priority === 'high' ? 'bg-red-400' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold text-gray-400">{t.id}</span>
                            <StatusBadge status={t.status} />
                            {t.satisfaction && <SatisfactionBadge rating={t.satisfaction} />}
                          </div>
                          <p className="text-sm font-bold text-gray-800 group-hover:text-violet-600 transition-colors truncate">{t.subject}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Created {t.created}</p>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 group-hover:text-violet-500 flex-shrink-0 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Activity ─────────────────────────────────── */}
              {tab === 'activity' && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Activity Log</p>
                  <div className="space-y-1">
                    {activities.map(a => (
                      <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {activityIcon(a.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-700">{a.description}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-gray-400">{a.timestamp}</span>
                            {a.agent && <><span className="text-gray-300 text-xs">·</span><span className="text-xs text-gray-500">by {a.agent}</span></>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Billing ──────────────────────────────────── */}
              {tab === 'billing' && (
                <div className="space-y-6">
                  {/* Plan */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Current Plan</p>
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-violet-300 font-semibold mb-1">Subscription</p>
                          <p className="text-xl font-extrabold capitalize">{customer?.tier || 'Basic'}</p>
                          <p className="text-xs text-violet-300 mt-1">Next billing: April 15, 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-violet-300 font-semibold mb-1">Monthly</p>
                          <p className="text-2xl font-extrabold">$49.99</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment method */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Method</p>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-9 h-9 bg-white rounded-xl border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <CreditCard size={16} className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">Visa •••• 4242</p>
                        <p className="text-xs text-gray-400">Expires 12/25</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">Default</span>
                    </div>
                  </div>

                  {/* Invoices */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Invoice History</p>
                    <div className="space-y-2">
                      {[{ month: "March 2024", date: "Mar 15, 2024" }, { month: "February 2024", date: "Feb 15, 2024" }].map(inv => (
                        <div key={inv.month} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                          <div>
                            <p className="text-sm font-bold text-gray-800">{inv.month}</p>
                            <p className="text-xs text-gray-400">{inv.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-800">$49.99</span>
                            <button className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notes</p>
                <span className="text-xs text-gray-400">{notes.length}</span>
              </div>

              {/* Add note */}
              <form onSubmit={addNote} className="mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                  <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
                    placeholder="Add a note…" rows={2}
                    className="w-full px-3.5 py-3 text-sm text-gray-800 placeholder-gray-400 bg-transparent resize-none outline-none" />
                  <div className="flex justify-end px-3 pb-2">
                    <button type="submit" disabled={!newNote.trim()}
                      className="px-3.5 py-1.5 bg-violet-600 text-white text-xs font-bold rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40">
                      Add Note
                    </button>
                  </div>
                </div>
              </form>

              {/* Notes list */}
              <div className="space-y-3">
                {[...notes].sort((a,b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map(note => (
                  <div key={note.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      note.pinned ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'
                    }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[9px] font-extrabold flex-shrink-0">
                          {note.avatar}
                        </div>
                        <span className="text-xs font-bold text-gray-700 truncate">{note.author}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">{note.timestamp}</span>
                      </div>
                      <button onClick={() => setNotes(notes.map(n => n.id === note.id ? {...n, pinned: !n.pinned} : n))}
                        className={`flex-shrink-0 ml-1 transition-colors ${note.pinned ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 hover:text-amber-500'}`}>
                        <Star size={12} className={note.pinned ? 'fill-current' : ''} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact preferences */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Preferences</p>
              <div className="space-y-3">
                {[
                  { label: "Email",     val: "Opted in",   ok: true  },
                  { label: "SMS",       val: "Not opted",  ok: false },
                  { label: "Marketing", val: "Opted out",  ok: false },
                ].map(({ label, val, ok }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className={`text-xs font-bold ${ok ? 'text-emerald-600' : 'text-gray-400'}`}>{val}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors">Update preferences</button>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={14} className="text-violet-600" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: "2FA Enabled",          val: "Yes",       ok: true  },
                  { label: "Last Password Change",  val: "30 days ago", ok: null },
                  { label: "Active Sessions",       val: "2 devices",   ok: null },
                ].map(({ label, val, ok }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className={`text-xs font-bold ${ok === true ? 'text-emerald-600' : 'text-gray-700'}`}>{val}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors">View security settings</button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfilePage;