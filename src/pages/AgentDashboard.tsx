// pages/AgentDashboard.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Ticket, Users, Clock, CheckCircle2, AlertCircle,
  ArrowUp, ArrowDown, UserPlus, ChevronRight, Zap, Star,
} from "lucide-react";
import AgentNavbar from "../components/AgentNavbar";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchTickets, selectAllTickets, selectTicketsLoading, fetchAssignedTickets, selectAssignedTickets } from "../features/Tickets/ticketsSlice";
import { selectCurrentUser } from "../features/Auth/authSlice";
import type { Ticket as TicketType } from "../features/Tickets/ticketsApi";

/* ── helpers ────────────────────────────────────────────────── */
function relTime(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), day = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (day === 1) return "Yesterday";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const STATUS_CFG: Record<string, { label: string; cls: string; dot: string }> = {
  open:          { label: "Open",        cls: "text-sky-600 bg-sky-50 border-sky-200",           dot: "bg-sky-500"    },
  "in-progress": { label: "In Progress", cls: "text-amber-600 bg-amber-50 border-amber-200",     dot: "bg-amber-400"  },
  resolved:      { label: "Resolved",    cls: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500"},
  closed:        { label: "Closed",      cls: "text-gray-400 bg-gray-100 border-gray-200",       dot: "bg-gray-400"   },
};

const PRIORITY_CFG: Record<string, { label: string; cls: string; bar: string }> = {
  urgent: { label: "Urgent", cls: "text-red-600",    bar: "bg-red-500"    },
  high:   { label: "High",   cls: "text-orange-500", bar: "bg-orange-400" },
  medium: { label: "Medium", cls: "text-amber-500",  bar: "bg-amber-400"  },
  low:    { label: "Low",    cls: "text-emerald-600",bar: "bg-emerald-400" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.open;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// const PriorityPill = ({ priority }: { priority: string }) => {
//   const cfg = PRIORITY_CFG[priority] ?? PRIORITY_CFG.medium;
//   return <span className={`text-xs font-bold ${cfg.cls}`}>{cfg.label}</span>;
// };

/* ── team data (mock) ───────────────────────────────────────── */
const TEAM = [
  { name: "Sarah Johnson", role: "Senior Agent", resolved: 24, sat: 99, avatar: "SJ", color: "from-violet-500 to-indigo-600" },
  { name: "Mike Chen",     role: "Support Agent", resolved: 18, sat: 97, avatar: "MC", color: "from-sky-500 to-blue-600"    },
  { name: "Emily R.",      role: "Support Agent", resolved: 21, sat: 98, avatar: "ER", color: "from-emerald-500 to-teal-600"},
  { name: "David Kim",     role: "Junior Agent",  resolved: 12, sat: 95, avatar: "DK", color: "from-rose-500 to-pink-600"   },
  { name: "Lisa Patel",    role: "Support Agent", resolved: 19, sat: 96, avatar: "LP", color: "from-amber-500 to-orange-500"},
];

/* ═══════════════════════════════════════════════════════════════ */
const AgentDashboard = () => {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const [range, setRange] = useState("today");

  const agent      = useAppSelector(s => s.auth.user) ?? { name: "Agent", email: "", avatar: "AG", role: "agent" };
  const user       = useAppSelector(selectCurrentUser);
  const allTickets = useAppSelector(selectAllTickets) as TicketType[];
  const isLoading  = useAppSelector(selectTicketsLoading);
  const assignedTickets = useAppSelector(selectAssignedTickets)

  useEffect(() => {
    if (user?.id){
        dispatch(fetchTickets({ status: "", priority: "" }));
        dispatch(fetchAssignedTickets(user.id))
    } 

  }, [dispatch, user?.id]);

  /* derived metrics */
  const open        = allTickets.filter(t => t.status === "open").length;
  const inProg      = allTickets.filter(t => t.status === "in-progress").length;
  const unassigned  = allTickets.filter(t => !t.assigned_to || t.assigned_to === "Unassigned").length;
  const resolvedTdy = allTickets.filter(t => t.resolved_at && new Date(t.resolved_at).toDateString() === new Date().toDateString()).length;
  const totalResolved = allTickets.filter(t => t.status === "resolved").length;

  const METRICS = [
    { label: "Open",         value: open,        delta: "+12%", up: true,  accent: "bg-sky-500",    light: "bg-sky-50",    text: "text-sky-600"     },
    { label: "Unassigned",   value: unassigned,  delta: "-5%",  up: false, accent: "bg-red-500",    light: "bg-red-50",    text: "text-red-600"     },
    { label: "In Progress",  value: inProg,      delta: "+8%",  up: true,  accent: "bg-amber-500",  light: "bg-amber-50",  text: "text-amber-600"   },
    { label: "Resolved Today",value: resolvedTdy,delta: "+23%", up: true,  accent: "bg-emerald-500",light: "bg-emerald-50",text: "text-emerald-600" },
    { label: "Avg Response", value: "4.2m",      delta: "-1.2m",up: true,  accent: "bg-violet-500", light: "bg-violet-50", text: "text-violet-600"  },
    { label: "Satisfaction", value: "98%",       delta: "+2%",  up: true,  accent: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-600"  },
  ];

  const queue = [...allTickets]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  const activity = allTickets.slice(0, 4).map(t => ({
    id: t.ticket_number || t.id.slice(0,8).toUpperCase(),
    action: t.status === "resolved" ? "resolved" : t.status === "open" ? "created" : "updated",
    subject: t.subject,
    time: relTime(t.created_at),
    color: t.status === "resolved" ? "bg-emerald-500" : t.status === "open" ? "bg-sky-500" : "bg-amber-500",
  }));

  /* loading */
  if (isLoading && allTickets.length === 0) return (
    <div className="min-h-screen bg-[#f4f5f7]"><AgentNavbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-base text-gray-400 font-medium">Loading dashboard…</p>
        </div>
      </div>
    </div>
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <AgentNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* ── Hero header ─────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-violet-700 via-indigo-700 to-indigo-800 rounded-2xl mt-6 mb-6 px-8 py-7 overflow-hidden shadow-lg shadow-indigo-200">
          {/* decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute top-4 right-20 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 right-40 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-indigo-300 text-base font-semibold mb-1">{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
              <h1 className="text-2xl font-extrabold text-white mb-1">{greeting}, {agent.name.split(" ")[0]} 👋</h1>
              <p className="text-indigo-200 text-base">
                You have <span className="text-white font-bold">{assignedTickets.length}</span> tickets assigned · <span className="text-white font-bold">{unassigned}</span> awaiting assignment
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {/* time range */}
              <div className="flex items-center bg-white/10 backdrop-blur rounded-xl border border-white/20 p-1">
                {["today","week","month"].map(r => (
                  <button key={r} onClick={() => setRange(r)}
                    className={`px-3.5 py-1.5 text-base font-bold rounded-lg transition-all ${range===r ? "bg-white text-indigo-700 shadow-sm" : "text-indigo-200 hover:text-white"}`}>
                    {r.charAt(0).toUpperCase()+r.slice(1)}
                  </button>
                ))}
              </div>

              {/* agent pill */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-3.5 py-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center text-white text-base font-extrabold">
                  {agent.name.charAt(0)}
                </div>
                <span className="text-white text-base font-semibold hidden sm:block">{agent.name.split(" ")[0]}</span>
                <span className="flex items-center gap-1 text-base font-bold text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Metric cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
          {METRICS.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow group">
              {/* accent bar top */}
              <div className={`h-1 rounded-full ${m.accent} mb-3 w-8 group-hover:w-full transition-all duration-500`} />
              <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{m.value}</p>
              <p className="text-base text-gray-400 font-semibold mb-2">{m.label}</p>
              <span className={`inline-flex items-center gap-0.5 text-base font-bold ${m.up ? "text-emerald-600" : "text-red-500"}`}>
                {m.up ? <ArrowUp size={11}/> : <ArrowDown size={11}/>}
                {m.delta}
              </span>
            </div>
          ))}
        </div>

        {/* ── Main grid ───────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-5">

          {/* LEFT */}
          <div className="space-y-5">

            {/* Priority Queue */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Ticket size={16} className="text-violet-600" />
                  <span className="font-extrabold text-gray-900 text-base">Priority Queue</span>
                  <span className="px-2 py-0.5 text-base font-bold bg-gray-100 text-gray-500 rounded-full">{queue.length}</span>
                </div>
                <Link to="/agent/tickets" className="flex items-center gap-1 text-base font-bold text-violet-600 hover:text-violet-700 transition-colors">
                  View all <ChevronRight size={13}/>
                </Link>
              </div>

              {queue.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-gray-300" />
                  </div>
                  <p className="text-base text-gray-400 font-medium">Queue is clear 🎉</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {queue.map((t, i) => {
                    const pcfg = PRIORITY_CFG[t.priority] ?? PRIORITY_CFG.medium;
                    return (
                      <div key={t.id}
                        onClick={() => navigate(`/agent/tickets/${t.ticket_number || t.id}`)}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer group">

                        {/* priority bar */}
                        <div className={`w-1 h-10 rounded-full flex-shrink-0 ${pcfg.bar}`} />

                        {/* index */}
                        <span className="text-base font-bold text-gray-300 w-4 flex-shrink-0">{String(i+1).padStart(2,"0")}</span>

                        {/* content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-gray-800 group-hover:text-violet-600 transition-colors truncate">{t.subject}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-base font-mono text-gray-400">#{t.ticket_number || t.id.slice(0,8).toUpperCase()}</span>
                            <span className="text-gray-200 text-base">·</span>
                            <span className="text-base text-gray-400">{relTime(t.created_at)}</span>
                            {t.assigned_to && t.assigned_to !== "Unassigned" && (
                              <>
                                <span className="text-gray-200 text-base">·</span>
                                <span className="text-base text-gray-400">{t.assigned_to}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* badges */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusBadge status={t.status} />
                          <span className={`text-base font-bold ${pcfg.cls} hidden sm:block`}>{pcfg.label}</span>
                        </div>

                        <ChevronRight size={14} className="text-gray-300 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-violet-600" />
                  <span className="font-extrabold text-gray-900 text-base">Recent Activity</span>
                </div>
              </div>
              <div className="space-y-3">
                {activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-700">
                        Ticket <span className="font-mono">#{a.id}</span> was <span className="text-gray-900">{a.action}</span>
                      </p>
                      <p className="text-base text-gray-400 mt-0.5 truncate">{a.subject}</p>
                    </div>
                    <span className="text-base text-gray-400 flex-shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            {/* Agent status card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-base font-bold text-gray-400 uppercase tracking-wider mb-4">Your Status</p>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base flex-shrink-0">
                  {agent.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-base truncate">{agent.name}</p>
                  <p className="text-base text-gray-400">{agent.role === "agent" ? "Support Agent" : agent.role}</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 text-base font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Assigned", value: assignedTickets.length, color: "text-violet-600" },
                  { label: "Resolved",  value: totalResolved, color: "text-emerald-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-base text-gray-400 font-semibold mb-1">{label}</p>
                    <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              <button className="w-full px-4 py-2.5 border border-gray-200 text-base font-bold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                Set as Away
              </button>
            </div>

            {/* Team Performance */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-violet-600" />
                  <span className="font-extrabold text-gray-900 text-base">Team</span>
                </div>
                <Link to="/agent/team" className="text-base font-bold text-violet-600 hover:text-violet-700 transition-colors">
                  Full stats →
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {TEAM.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white text-base font-extrabold flex-shrink-0`}>
                      {m.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-800 truncate">{m.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {/* mini resolve bar */}
                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500 rounded-full" style={{width:`${(m.resolved/30)*100}%`}} />
                        </div>
                        <span className="text-base text-gray-400">{m.resolved} resolved</span>
                      </div>
                    </div>
                    <span className="text-base font-bold text-emerald-600 flex-shrink-0 flex items-center gap-0.5">
                      <Star size={10} className="fill-amber-400 text-amber-400"/>{m.sat}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 shadow-sm shadow-violet-200">
              <p className="text-base font-bold text-violet-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Zap size={11}/> Quick Actions
              </p>
              <div className="space-y-1.5">
                {[
                  { label: "Browse All Tickets", icon: <Ticket size={13}/>,    to: "/agent/tickets" },
                  { label: "Assign Ticket to Me", icon: <UserPlus size={13}/>, to: undefined },
                  { label: "Escalate Ticket",      icon: <AlertCircle size={13}/>, to: undefined },
                ].map((a, i) => (
                  a.to
                    ? <Link key={i} to={a.to} className="flex items-center justify-between px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-base font-bold text-white transition-colors">
                        <span>{a.label}</span>{a.icon}
                      </Link>
                    : <button key={i} className="w-full flex items-center justify-between px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-base font-bold text-white transition-colors">
                        <span>{a.label}</span>{a.icon}
                      </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;