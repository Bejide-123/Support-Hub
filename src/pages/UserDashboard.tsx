import { useState, useEffect } from 'react';
import {
  Ticket, Plus, Clock,  ChevronRight,
  MessageSquare, Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import DashboardNavbar from '../components/DashboardNavbar';
import NewTicketModal from '../components/NewTicketModal';
import {
  fetchUserTickets, selectUserTickets, selectTicketsLoading,
  selectTicketStats, getUserTicketStats,
} from '../features/Tickets/ticketsSlice';
import { selectCurrentUser } from '../features/Auth/authSlice';

/* ── design tokens ──────────────────────────────────────────── */
const STATUS_CFG: Record<string, { cls: string; dot: string; label: string }> = {
  open:          { cls: "text-sky-600 bg-sky-50 border-sky-200",             dot: "bg-sky-500",     label: "Open"        },
  'in-progress': { cls: "text-amber-600 bg-amber-50 border-amber-200",       dot: "bg-amber-400",   label: "In Progress" },
  resolved:      { cls: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500", label: "Resolved"    },
  closed:        { cls: "text-gray-400 bg-gray-100 border-gray-200",         dot: "bg-gray-400",    label: "Closed"      },
};

const PRIORITY_CFG: Record<string, { bar: string; text: string; label: string }> = {
  urgent: { bar: "bg-red-500",    text: "text-red-600",    label: "Urgent" },
  high:   { bar: "bg-orange-400", text: "text-orange-500", label: "High"   },
  medium: { bar: "bg-amber-400",  text: "text-amber-500",  label: "Medium" },
  low:    { bar: "bg-emerald-400",text: "text-emerald-600",label: "Low"    },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CFG[status];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const PriorityDot = ({ priority }: { priority: string }) => {
  const cfg = PRIORITY_CFG[priority] ?? PRIORITY_CFG.medium;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${cfg.text}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.bar}`} />
      {cfg.label}
    </span>
  );
};

function relTime(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), day = Math.floor(diff / 86400000);
  if (m < 1)   return 'Just now';
  if (m < 60)  return `${m}m ago`;
  if (h < 24)  return `${h}h ago`;
  if (day ===1) return 'Yesterday';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const FAQ = [
  { question: 'How to reset my password?',   views: '1.2k views' },
  { question: 'What payment methods are accepted?', views: '890 views' },
  { question: 'How to update my profile?',   views: '756 views' },
  { question: 'What are the ticket response times?', views: '645 views' },
];

/* ═══════════════════════════════════════════════════════════════ */
const UserDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const user        = useAppSelector(selectCurrentUser);
  const tickets     = useAppSelector(s => user?.id ? selectUserTickets(s, user.id) : []);
  const isLoading   = useAppSelector(selectTicketsLoading);
  const ticketStats = useAppSelector(selectTicketStats);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserTickets(user.id));
      dispatch(getUserTicketStats(user.id));
    }
  }, [dispatch, user?.id]);

  const METRICS = [
    { label: "Open",        value: ticketStats?.open       || 0, accent: "bg-sky-500",     delta: null,   up: true  },
    { label: "In Progress", value: ticketStats?.inProgress || 0, accent: "bg-amber-400",   delta: null,   up: true  },
    { label: "Resolved",    value: ticketStats?.resolved   || 0, accent: "bg-emerald-500", delta: "+3",   up: true  },
    { label: "Total",       value: ticketStats?.total      || 0, accent: "bg-indigo-500",  delta: null,   up: true  },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* ── Hero banner ─────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700 rounded-2xl mt-6 mb-6 px-8 py-7 overflow-hidden shadow-lg shadow-teal-200">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute top-4 right-20 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 right-40 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-teal-300 text-sm font-semibold mb-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-2xl font-extrabold text-white mb-1">
                {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
              </h1>
              <p className="text-teal-200 text-sm">
                {user?.position
                  ? user.position
                  : `You have ${ticketStats?.open || 0} open tickets · ${ticketStats?.inProgress || 0} in progress`}
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 text-sm font-extrabold rounded-xl hover:bg-emerald-50 active:scale-95 transition-all shadow-sm flex-shrink-0">
              <Plus size={16} /> New Ticket
            </button>
          </div>
        </div>

        {/* ── Metric cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {METRICS.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 group hover:shadow-md transition-shadow">
              <div className={`h-1 rounded-full ${m.accent} mb-3 w-8 group-hover:w-full transition-all duration-500`} />
              <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{m.value}</p>
              <p className="text-xs text-gray-400 font-semibold">{m.label}</p>
            </div>
          ))}
        </div>

        {/* ── Main grid ───────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-5">

          {/* LEFT — tickets */}
          <div className="space-y-4">

            {/* Section header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket size={16} className="text-emerald-600" />
                <span className="font-extrabold text-gray-900 text-sm">Recent Tickets</span>
                <span className="px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-600 rounded-full">{tickets.length}</span>
              </div>
              <Link to="/tickets" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
                View all <ChevronRight size={13} />
              </Link>
            </div>

            {/* Tickets card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {isLoading ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <div className="w-9 h-9 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  <p className="text-sm text-gray-400 font-medium">Loading tickets…</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <Ticket size={26} className="text-gray-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-700 mb-1">No tickets yet</p>
                    <p className="text-sm text-gray-400">Create your first ticket to get started</p>
                  </div>
                  <button onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors">
                    <Plus size={14} /> Create Ticket
                  </button>
                </div>
              ) : (
                <>
                  {/* Table header */}
                  <div className="border-b border-gray-100 bg-gray-50/60">
                    <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center px-5 py-3.5 gap-4">
                      {["ID","Subject","Status","Priority","Updated",""].map((h, i) => (
                        <span key={i} className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</span>
                      ))}
                    </div>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {tickets.map(t => {
                      const pcfg = PRIORITY_CFG[t.priority] ?? PRIORITY_CFG.medium;
                      return (
                        <Link key={t.id} to={`/tickets/${t.id}`}
                          className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center px-5 py-3.5 gap-4 hover:bg-gray-50/80 transition-colors group cursor-pointer">

                          {/* ID + priority bar */}
                          <div className="flex items-center gap-2">
                            <div className={`w-1 h-8 rounded-full flex-shrink-0 ${pcfg.bar}`} />
                            <span className="text-xs font-mono font-bold text-gray-400 whitespace-nowrap">{t.ticket_number}</span>
                          </div>

                          {/* Subject */}
                          <p className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors truncate">
                            {t.subject}
                          </p>

                          {/* Status */}
                          <StatusBadge status={t.status} />

                          {/* Priority */}
                          <PriorityDot priority={t.priority} />

                          {/* Updated */}
                          <span className="text-xs text-gray-400 font-medium flex items-center gap-1 whitespace-nowrap">
                            <Clock size={11} className="text-gray-300" />
                            {relTime(t.updated_at)}
                          </span>

                          {/* Arrow */}
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT sidebar */}
          <div className="space-y-4">

            {/* Common issues */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={14} className="text-emerald-600" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Common Issues</p>
              </div>

              <div className="divide-y divide-gray-50">
                {FAQ.map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 py-3 group cursor-pointer">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors leading-snug">
                        {item.question}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.views}</p>
                    </div>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-emerald-500 flex-shrink-0 mt-0.5 transition-colors" />
                  </div>
                ))}
              </div>

              <button className="mt-3 w-full text-center text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors py-2 hover:bg-emerald-50 rounded-xl">
                View all FAQs →
              </button>
            </div>

            {/* Quick tip */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-sm shadow-teal-200">
              <p className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Zap size={11} /> Quick Tip
              </p>
              <p className="text-sm font-semibold leading-relaxed text-teal-50">
                For urgent issues, select <span className="text-white font-extrabold">"High"</span> priority when creating a ticket to get faster response times.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl transition-colors">
                <Plus size={13} /> Create Ticket
              </button>
            </div>

            {/* Status legend */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Status Guide</p>
              <div className="space-y-2.5">
                {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    <span className="text-sm text-gray-600 font-medium">{cfg.label}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {key === 'open' && 'Awaiting agent'}
                      {key === 'in-progress' && 'Being handled'}
                      {key === 'resolved' && 'Issue fixed'}
                      {key === 'closed' && 'Ticket closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <NewTicketModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default UserDashboard;