// pages/TicketsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket, Search, ChevronRight, Clock, 
  Calendar, Download, PlusCircle,
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import NewTicketModal from '../components/NewTicketModal';
import {
  fetchUserTickets, selectUserTickets, selectTicketsLoading,
  selectTicketStats, getUserTicketStats,
} from '../features/Tickets/ticketsSlice';
import { selectCurrentUser } from '../features/Auth/authSlice';
import { useAppSelector, useAppDispatch } from '../store/hooks';

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
  if (m < 1)    return 'Just now';
  if (m < 60)   return `${m}m ago`;
  if (h < 24)   return `${h}h ago`;
  if (day === 1) return 'Yesterday';
  if (day < 7)  return `${day}d ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ═══════════════════════════════════════════════════════════════ */
const TicketsPage = () => {
  const [modalOpen,       setModalOpen]       = useState(false);
  const [searchQuery,     setSearchQuery]     = useState('');
  const [statusFilter,    setStatusFilter]    = useState('all');
  const [priorityFilter,  setPriorityFilter]  = useState('all');
  const [sortBy,          setSortBy]          = useState('newest');

  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();

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

  const stats = {
    total:      ticketStats?.total      || 0,
    open:       ticketStats?.open       || 0,
    inProgress: ticketStats?.inProgress || 0,
    resolved:   ticketStats?.resolved   || 0,
    urgent:     tickets.filter(t => t.priority === 'urgent').length,
  };

  const filtered = tickets
    .filter(t => {
      const q = searchQuery.toLowerCase();
      return (
        (!q || t.subject?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q)) &&
        (statusFilter === 'all'   || t.status   === statusFilter) &&
        (priorityFilter === 'all' || t.priority === priorityFilter)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest')   return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest')   return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'updated')  return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sortBy === 'priority') {
        const o = { urgent:1, high:2, medium:3, low:4 };
        return (o[a.priority as keyof typeof o]||5) - (o[b.priority as keyof typeof o]||5);
      }
      return 0;
    });

  const activeFilters = (statusFilter !== 'all' ? 1 : 0) + (priorityFilter !== 'all' ? 1 : 0);

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* ── Page header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Ticket size={18} className="text-emerald-600" />
              <h1 className="text-xl font-extrabold text-gray-900">My Tickets</h1>
              <span className="px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-600 rounded-full">{tickets.length}</span>
            </div>
            <p className="text-sm text-gray-500">View and manage all your support tickets in one place</p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-extrabold rounded-xl hover:shadow-lg hover:shadow-emerald-200 active:scale-95 transition-all shadow-sm whitespace-nowrap">
            <PlusCircle size={15} /> New Ticket
          </button>
        </div>

        {/* ── Stat cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          {[
            { label: "Total",       value: stats.total,      accent: "bg-indigo-500",  color: "text-gray-900"    },
            { label: "Open",        value: stats.open,       accent: "bg-sky-500",     color: "text-sky-600"     },
            { label: "In Progress", value: stats.inProgress, accent: "bg-amber-400",   color: "text-amber-600"   },
            { label: "Resolved",    value: stats.resolved,   accent: "bg-emerald-500", color: "text-emerald-600" },
            { label: "Urgent",      value: stats.urgent,     accent: "bg-red-500",     color: "text-red-600"     },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 group hover:shadow-md transition-shadow">
              <div className={`h-1 rounded-full ${s.accent} mb-3 w-8 group-hover:w-full transition-all duration-500`} />
              <p className={`text-2xl font-extrabold mb-0.5 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── View mode tabs ───────────────────────────────────── */}
        <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-1 mb-5 shadow-sm w-fit">
          {[
            { key: 'all',         label: 'All' },
            { key: 'open',        label: 'Open' },
            { key: 'in-progress', label: 'In Progress' },
            { key: 'resolved',    label: 'Resolved' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setStatusFilter(key === 'all' ? 'all' : key)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                (key === 'all' && statusFilter === 'all') || statusFilter === key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Search + filters bar ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ticket ID or subject…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none placeholder-gray-400 transition-all"
              />
            </div>

            {/* Priority filter */}
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-semibold bg-white focus:ring-2 focus:ring-emerald-400 outline-none">
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-semibold bg-white focus:ring-2 focus:ring-emerald-400 outline-none">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="updated">Recently updated</option>
              <option value="priority">Priority</option>
            </select>

            {/* Export */}
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* ── Results row ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-700">{filtered.length}</span> of <span className="font-bold text-gray-700">{tickets.length}</span> tickets
          </p>
          {activeFilters > 0 && (
            <button onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setSearchQuery(''); }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              Clear filters ×
            </button>
          )}
        </div>

        {/* ── Tickets table ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {isLoading ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading tickets…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Ticket size={26} className="text-gray-300" />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-gray-700 mb-1">No tickets found</p>
                <p className="text-sm text-gray-400">
                  {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : "You haven't created any tickets yet"}
                </p>
              </div>
              <button onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors">
                <PlusCircle size={14} /> Create Ticket
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["Ticket ID","Subject","Status","Priority","Created","Updated",""].map((h, i) => (
                      <th key={i} className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(ticket => {
                    const pcfg = PRIORITY_CFG[ticket.priority] ?? PRIORITY_CFG.medium;
                    return (
                      <tr
                        key={ticket.id}
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                        className="cursor-pointer group hover:bg-gray-50/80 transition-colors">

                        {/* ID + priority bar */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1 h-8 rounded-full flex-shrink-0 ${pcfg.bar}`} />
                            <span className="text-xs font-mono font-bold text-gray-500">{ticket.ticket_number}</span>
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors truncate">
                            {ticket.subject}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4"><StatusBadge status={ticket.status} /></td>

                        {/* Priority */}
                        <td className="px-5 py-4"><PriorityDot priority={ticket.priority} /></td>

                        {/* Created */}
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-1 text-xs text-gray-400 font-medium whitespace-nowrap">
                            <Calendar size={11} className="text-gray-300" />
                            {relTime(ticket.created_at)}
                          </span>
                        </td>

                        {/* Updated */}
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-1 text-xs text-gray-400 font-medium whitespace-nowrap">
                            <Clock size={11} className="text-gray-300" />
                            {relTime(ticket.updated_at)}
                          </span>
                        </td>

                        {/* Chevron */}
                        <td className="px-5 py-4">
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <NewTicketModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default TicketsPage;