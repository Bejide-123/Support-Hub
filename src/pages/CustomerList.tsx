import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Search, Mail, Building, Ticket, Star,
  ChevronRight, Download, RefreshCw,
  Clock, MapPin, AlertCircle, UserPlus, LayoutGrid, List,
} from 'lucide-react';
import AgentNavbar from '../components/AgentNavbar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getAllCustomers, selectAllCustomers } from '../features/Auth/authSlice';

/* ── interfaces ─────────────────────────────────────────────── */
interface RawUser {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  position?: string | null;
  avatar_url?: string | null;
  avatar?: string | null;
  tier?: string | null;
  status?: string | null;
  location?: string | null;
  created_at?: string | null;
  last_active?: string | null;
  total_tickets?: number | null;
  resolved_tickets?: number | null;
  satisfaction?: number | null;
  open_tickets?: number | null;
  urgent_tickets?: number | null;
  tags?: string[] | null;
}

interface TransformedCustomer {
  id: string; name: string; email: string; phone: string;
  company: string; position: string; avatar: string; tier: string;
  status: string; location: string; memberSince: string; lastActive: string;
  totalTickets: number; resolvedTickets: number; satisfaction: number;
  openTickets: number; urgentTickets: number; tags: string[];
}

/* ── design tokens ──────────────────────────────────────────── */
const TIER_CFG: Record<string, { cls: string; gradient: string }> = {
  enterprise: { cls: "text-violet-700 bg-violet-50 border-violet-200",   gradient: "from-violet-500 to-indigo-600"  },
  premium:    { cls: "text-emerald-700 bg-emerald-50 border-emerald-200", gradient: "from-emerald-500 to-teal-600"   },
  standard:   { cls: "text-sky-700 bg-sky-50 border-sky-200",             gradient: "from-sky-500 to-blue-600"       },
  basic:      { cls: "text-gray-600 bg-gray-100 border-gray-200",         gradient: "from-slate-400 to-slate-600"   },
};

const TierBadge = ({ tier }: { tier: string }) => {
  const cfg = TIER_CFG[tier] ?? TIER_CFG.basic;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) =>
  status === 'active' ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border text-emerald-700 bg-emerald-50 border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border text-gray-500 bg-gray-100 border-gray-200">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Inactive
    </span>
  );

const avatarGradient = (tier: string) => TIER_CFG[tier]?.gradient ?? TIER_CFG.basic.gradient;

/* ─────────────────────────────────────────────────────────── */
const CustomerListPage = () => {
  const navigate   = useNavigate();
  const dispatch   = useAppDispatch();

  const reduxCustomers    = useAppSelector(selectAllCustomers);
  const isLoadingCustomers = useAppSelector((state) => state.auth.isLoadingData);
  const error             = useAppSelector((state) => state.auth.error);

  const [searchQuery,    setSearchQuery]    = useState('');
  const [selectedTier,   setSelectedTier]   = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy,         setSortBy]         = useState('newest');
  const [viewMode,       setViewMode]       = useState<'grid'|'list'>('grid');
  const [isInitialLoad,  setIsInitialLoad]  = useState(true);

  useEffect(() => {
    dispatch(getAllCustomers()).finally(() => setIsInitialLoad(false));
  }, [dispatch]);

  const transform = (users: RawUser[]): TransformedCustomer[] =>
    users.map(u => ({
      id: u.id,
      name: u.name || 'Unknown',
      email: u.email || '',
      phone: u.phone || '',
      company: u.company || 'N/A',
      position: u.position || 'Employee',
      avatar: u.avatar_url || u.avatar || (u.name?.substring(0, 2).toUpperCase() || '?'),
      tier: u.tier || 'basic',
      status: u.status || 'active',
      location: u.location || 'Not specified',
      memberSince: u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—',
      lastActive: u.last_active || '—',
      totalTickets: u.total_tickets || 0,
      resolvedTickets: u.resolved_tickets || 0,
      satisfaction: u.satisfaction || 0,
      openTickets: u.open_tickets || 0,
      urgentTickets: u.urgent_tickets || 0,
      tags: u.tags || [],
    }));

  const customers = transform(reduxCustomers as RawUser[]);

  const stats = {
    total:        customers.length,
    active:       customers.filter(c => c.status === 'active').length,
    premium:      customers.filter(c => c.tier === 'premium' || c.tier === 'enterprise').length,
    newThisMonth: customers.filter(c => ['Jan','Feb','Mar','Apr'].includes(c.memberSince.split(' ')[0])).length,
  };

  const sorted = [...customers]
    .filter(c => {
      const q = searchQuery.toLowerCase();
      return (
        (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)) &&
        (selectedTier === 'all' || c.tier === selectedTier) &&
        (selectedStatus === 'all' || c.status === selectedStatus)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest')       return new Date(b.memberSince).getTime() - new Date(a.memberSince).getTime();
      if (sortBy === 'oldest')       return new Date(a.memberSince).getTime() - new Date(b.memberSince).getTime();
      if (sortBy === 'tickets')      return b.totalTickets - a.totalTickets;
      if (sortBy === 'satisfaction') return b.satisfaction - a.satisfaction;
      return 0;
    });

  const resetFilters = () => {
    setSearchQuery(''); setSelectedTier('all'); setSelectedStatus('all'); setSortBy('newest');
    dispatch(getAllCustomers());
  };

  /* ── loading skeleton ───────────────────────────────────── */
  if (isInitialLoad || (isLoadingCustomers && customers.length === 0)) return (
    <div className="min-h-screen bg-[#f4f5f7]"><AgentNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse mb-2" />
        <div className="h-4 w-72 bg-gray-200 rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-1 w-8 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-16 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1"><div className="h-4 bg-gray-200 rounded mb-1" /><div className="h-3 w-2/3 bg-gray-200 rounded" /></div>
              </div>
              <div className="space-y-2"><div className="h-3 bg-gray-200 rounded" /><div className="h-3 w-3/4 bg-gray-200 rounded" /></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  /* ── error ──────────────────────────────────────────────── */
  if (error && customers.length === 0) return (
    <div className="min-h-screen bg-[#f4f5f7]"><AgentNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={26} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">Error Loading Customers</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button onClick={() => dispatch(getAllCustomers())}
            className="px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors">
            Try Again
          </button>
        </div>
      </main>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <AgentNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={20} className="text-violet-600" />
              <h1 className="text-xl font-extrabold text-gray-900">Customers</h1>
              <span className="px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-600 rounded-full">{customers.length}</span>
            </div>
            <p className="text-sm text-gray-500">Manage and view all customer accounts</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/agent/customers/new')}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 active:scale-95 transition-all shadow-sm shadow-violet-200">
              <UserPlus size={15} /> Add Customer
            </button>
            <button onClick={() => {}}
              className="p-2.5 border border-gray-200 bg-white text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">
              <Download size={15} />
            </button>
            <button onClick={resetFilters}
              className="p-2.5 border border-gray-200 bg-white text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Customers",   value: stats.total,        accent: "bg-violet-500"  },
            { label: "Active Accounts",   value: stats.active,       accent: "bg-emerald-500" },
            { label: "Premium",           value: stats.premium,      accent: "bg-amber-500"   },
            { label: "New This Month",    value: stats.newThisMonth, accent: "bg-sky-500"     },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 group hover:shadow-md transition-shadow">
              <div className={`h-1 rounded-full ${s.accent} mb-3 w-8 group-hover:w-full transition-all duration-500`} />
              <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{s.value}</p>
              <p className="text-xs text-gray-400 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Filters bar ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or company…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none placeholder-gray-400 transition-all"
              />
            </div>

            {/* Selects */}
            {[
              { value: selectedTier,   onChange: setSelectedTier,   options: [["all","All Tiers"],["enterprise","Enterprise"],["premium","Premium"],["standard","Standard"],["basic","Basic"]] },
              { value: selectedStatus, onChange: setSelectedStatus, options: [["all","All Status"],["active","Active"],["inactive","Inactive"]] },
              { value: sortBy,         onChange: setSortBy,         options: [["newest","Newest First"],["oldest","Oldest First"],["tickets","Most Tickets"],["satisfaction","Highest Sat."]] },
            ].map((s, i) => (
              <select key={i} value={s.value} onChange={e => s.onChange(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-semibold bg-white focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none">
                {s.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ))}

            {/* View toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1 flex-shrink-0">
              <button onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <LayoutGrid size={15} />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Results row ─────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-700">{sorted.length}</span> of <span className="font-bold text-gray-700">{customers.length}</span> customers
          </p>
          {isLoadingCustomers && customers.length > 0 && (
            <span className="text-xs font-semibold text-violet-600 flex items-center gap-1.5">
              <RefreshCw size={12} className="animate-spin" /> Refreshing…
            </span>
          )}
        </div>

        {/* ── Empty state ─────────────────────────────────────── */}
        {sorted.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
              <Users size={26} className="text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-gray-700 mb-1">No customers found</p>
              <p className="text-sm text-gray-400">
                {searchQuery || selectedTier !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'No customers have been added yet'}
              </p>
            </div>
            <button onClick={() => navigate('/agent/customers/new')}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors">
              <UserPlus size={14} /> Add First Customer
            </button>
          </div>
        )}

        {/* ── Grid view ───────────────────────────────────────── */}
        {sorted.length > 0 && viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map(c => (
              <Link
                key={c.id}
                to={`/agent/customers/${c.id}`}
                state={{ customer: c }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-violet-200 transition-all duration-200 group">

                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradient(c.tier)} flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0`}>
                      {c.avatar.slice(0,2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-gray-900 text-sm truncate group-hover:text-violet-600 transition-colors">{c.name}</p>
                        {c.urgentTickets > 0 && <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{c.position}</p>
                      <p className="text-xs text-gray-400 truncate">{c.company}</p>
                    </div>
                  </div>
                  <TierBadge tier={c.tier} />
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {[
                    { icon: <Mail size={12} />,     val: c.email    },
                    { icon: <Building size={12} />, val: c.company  },
                    { icon: <MapPin size={12} />,   val: c.location },
                  ].map(({ icon, val }, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-gray-300 flex-shrink-0">{icon}</span>
                      <span className="truncate">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                      <Ticket size={12} className="text-violet-400" />
                      {c.openTickets} <span className="font-normal text-gray-400">open</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      {c.satisfaction}%
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} /> {c.lastActive}
                  </span>
                </div>

                {/* Tags */}
                {c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {c.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-medium">{tag}</span>
                    ))}
                    {c.tags.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-lg text-[10px] font-medium">+{c.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* ── List view ───────────────────────────────────────── */}
        {sorted.length > 0 && viewMode === 'list' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["Customer","Contact","Tier","Status","Tickets","Satisfaction","Last Active",""].map((h, i) => (
                      <th key={i} className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sorted.map(c => (
                    <tr key={c.id}
                      onClick={() => navigate(`/agent/customers/${c.id}`, { state: { customer: c } })}
                      className="cursor-pointer group hover:bg-gray-50/80 transition-colors">

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient(c.tier)} flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0`}>
                            {c.avatar.slice(0,2)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-bold text-gray-800 group-hover:text-violet-600 transition-colors truncate">{c.name}</p>
                              {c.urgentTickets > 0 && <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />}
                            </div>
                            <p className="text-xs text-gray-400 font-mono">{c.id.slice(0,12)}…</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 truncate max-w-[180px]">{c.email}</p>
                        <p className="text-xs text-gray-400">{c.phone}</p>
                      </td>

                      {/* Tier */}
                      <td className="px-5 py-4"><TierBadge tier={c.tier} /></td>

                      {/* Status */}
                      <td className="px-5 py-4"><StatusBadge status={c.status} /></td>

                      {/* Tickets */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-gray-800">{c.openTickets}</span>
                        <span className="text-xs text-gray-400 ml-1">/ {c.totalTickets}</span>
                      </td>

                      {/* Satisfaction */}
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-sm font-bold text-gray-800">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          {c.satisfaction}%
                        </span>
                      </td>

                      {/* Last active */}
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={11} /> {c.lastActive}
                        </span>
                      </td>

                      {/* Arrow */}
                      <td className="px-5 py-4">
                        <ChevronRight size={15} className="text-gray-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerListPage;