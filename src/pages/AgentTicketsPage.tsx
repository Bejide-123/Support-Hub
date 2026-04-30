import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronRight,
  Clock,
  Download,
  UserPlus,
  Inbox,
  CheckSquare,
  X,
  SlidersHorizontal,
  RefreshCw,
  Circle,
  CircleDot,
  CheckCircle2,
  MinusCircle,
  AlertTriangle,
} from "lucide-react";
import AgentNavbar from "../components/AgentNavbar";
import {
  fetchTickets,
  selectAllTickets,
  selectTicketsLoading,
  selectTicketStats,
  getUserTicketStats,
  updateTicket,
} from "../features/Tickets/ticketsSlice";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { selectCurrentUser, getUserById, selectUserById } from "../features/Auth/authSlice";
import { authAPI } from "../features/Auth/authApi";
import type { User } from "../features/Auth/authApi";
import AssignAgentsModal from "../components/AssignAgentsModal";

/* ── design tokens (matching AgentDashboard) ─────────────────── */

const STATUS_CFG: Record<
  string,
  { label: string; cls: string; dot: string; icon: React.ReactNode }
> = {
  open: {
    label: "Open",
    dot: "bg-sky-500",
    cls: "text-sky-600 bg-sky-50 border-sky-200",
    icon: <Circle size={10} className="fill-sky-500 text-sky-500" />,
  },
  "in-progress": {
    label: "In Progress",
    dot: "bg-amber-400",
    cls: "text-amber-600 bg-amber-50 border-amber-200",
    icon: <CircleDot size={10} className="text-amber-500" />,
  },
  resolved: {
    label: "Resolved",
    dot: "bg-emerald-500",
    cls: "text-emerald-600 bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 size={10} className="text-emerald-500" />,
  },
  closed: {
    label: "Closed",
    dot: "bg-gray-400",
    cls: "text-gray-400 bg-gray-100 border-gray-200",
    icon: <MinusCircle size={10} className="text-gray-400" />,
  },
  urgent: {
    label: "Urgent",
    dot: "bg-red-500",
    cls: "text-red-600 bg-red-50 border-red-200",
    icon: <AlertTriangle size={10} className="text-red-500" />,
  },
};

const PRIORITY_CFG: Record<
  string,
  { label: string; cls: string; bar: string; text: string }
> = {
  urgent: {
    label: "Urgent",
    cls: "text-red-600 bg-red-50 border-red-200",
    bar: "bg-red-500",
    text: "text-red-600",
  },
  high: {
    label: "High",
    cls: "text-orange-600 bg-orange-50 border-orange-200",
    bar: "bg-orange-400",
    text: "text-orange-500",
  },
  medium: {
    label: "Medium",
    cls: "text-amber-600 bg-amber-50 border-amber-200",
    bar: "bg-amber-400",
    text: "text-amber-500",
  },
  low: {
    label: "Low",
    cls: "text-emerald-600 bg-emerald-50 border-emerald-200",
    bar: "bg-emerald-400",
    text: "text-emerald-600",
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.open;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const cfg = PRIORITY_CFG[priority] ?? PRIORITY_CFG.medium;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.bar}`} />
      {cfg.label}
    </span>
  );
};

function relTime(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000),
    h = Math.floor(diff / 3600000),
    day = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (day === 1) return "Yesterday";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* ── filter checkbox ─────────────────────────────────────────── */
const FilterCheck = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <label className="flex items-center gap-2.5 cursor-pointer group">
    <div
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
        checked
          ? "bg-violet-600 border-violet-600"
          : "border-gray-300 group-hover:border-violet-400"
      }`}
    >
      {checked && <CheckCircle2 size={10} className="text-white" />}
    </div>
    <span className="text-sm text-gray-600 capitalize">
      {label === "in-progress" ? "In Progress" : label}
    </span>
  </label>
);

const AssignedAgentName = ({ userId }: { userId: string }) => {
  const agent = useAppSelector((state) => selectUserById(state, userId));
  return (
    <span className="text-sm text-gray-600 font-medium">
      {agent?.name || userId}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
const AgentTicketQueue = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
  const [customerMap, setCustomerMap] = useState<Record<string, User>>({});
  const [sortBy, setSortBy] = useState("newest");

  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    category: [] as string[],
    assignedTo: [] as string[],
  });

  const user = useAppSelector(selectCurrentUser);
  const tickets = useAppSelector(selectAllTickets);
  const isLoading = useAppSelector(selectTicketsLoading);
  const ticketStats = useAppSelector(selectTicketStats);

  /* derived */
  const stats = {
    total: tickets.length,
    urgent: tickets.filter((t) => t.priority === "urgent").length,
    unassigned: tickets.filter(
      (t) => !t.assigned_to || t.assigned_to === "Unassigned",
    ).length,
    open: ticketStats?.open || 0,
  };

  const filtered = tickets
    .filter((t) => {
      const cName = customerMap[t.customer_id]?.name || "";
      const q = searchQuery.toLowerCase();
      return (
        (!q ||
          t.subject.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          cName.toLowerCase().includes(q)) &&
        (!filters.status.length || filters.status.includes(t.status)) &&
        (!filters.priority.length || filters.priority.includes(t.priority)) &&
        (!filters.category.length ||
          filters.category.includes(t.category || "")) &&
        (viewMode === "all" ||
          (viewMode === "unassigned" &&
            (!t.assigned_to || t.assigned_to === "Unassigned")) ||
          (viewMode === "assigned-to-me" && t.assigned_to === user?.id) ||
          (viewMode === "urgent" && t.priority === "urgent"))
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      if (sortBy === "priority") {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 };
        return (
          (order[a.priority as keyof typeof order] ?? 9) -
          (order[b.priority as keyof typeof order] ?? 9)
        );
      }
      if (sortBy === "updated")
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      return 0;
    });

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTickets({ status: "", priority: "" }));
      dispatch(getUserTicketStats(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const ids = [...new Set(tickets.map((t) => t.customer_id))];
      const map: Record<string, User> = {};
      for (const id of ids) {
        if (!customerMap[id]) {
          const c = await authAPI.getProfileById(id);
          if (c) map[id] = c;
        }
      }
      setCustomerMap((prev) => ({ ...prev, ...map }));
    };
    if (tickets.length > 0) fetchCustomers();
  }, [tickets]);

  useEffect(() => {
    const fetchAssignedAgents = () => {
      const agentIdsToFetch = new Set<string>();
      filtered.forEach((ticket) => {
        if (
          ticket.assigned_to &&
          ticket.assigned_to !== "Unassigned" &&
          ticket.assigned_to !== user?.id
        ) {
          agentIdsToFetch.add(ticket.assigned_to);
        }
      });

      agentIdsToFetch.forEach((agentId) => {
        dispatch(getUserById(agentId));
      });
    };

    if (filtered.length > 0) {
      fetchAssignedAgents();
    }
  }, [dispatch, filtered, user?.id]);

  /* handlers */
  const handleAssignTickets = async (agentId: string) => {
    for (const tid of selectedTicketIds) {
      await dispatch(
        updateTicket({ ticketId: tid, updates: { assigned_to: agentId } }),
      );
    }
    dispatch(fetchTickets({ status: "", priority: "" }));
    setSelectedTickets([]);
    setSelectedTicketIds([]);
    toast.success("Tickets assigned successfully!");
  };

  const handleAssignToMe = async (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) return toast.error("User not logged in.");
    try {
      await dispatch(
        updateTicket({ ticketId, updates: { assigned_to: user.id } }),
      );
      toast.success("Ticket assigned to you!");
      dispatch(fetchTickets({ status: "", priority: "" }));
    } catch {
      toast.error("Failed to assign ticket.");
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.assigned_to &&
      (viewMode === "all" ||
        (viewMode === "unassigned" &&
          (!t.assigned_to || t.assigned_to === "Unassigned")) ||
        (viewMode === "assigned-to-me" && t.assigned_to === user?.id) ||
        (viewMode === "urgent" && t.priority === "urgent")),
  );
  const toggleTicket = (id: string) =>
    setSelectedTickets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleAll = () =>
    setSelectedTickets(
      selectedTickets.length === filteredTickets.length
        ? []
        : filteredTickets.map((t) => t.id),
    );

  const clearFilters = () => {
    setFilters({ status: [], priority: [], category: [], assignedTo: [] });
    setViewMode("all");
    setSearchQuery("");
    setSelectedTickets([]);
  };

  const toggleFilter = (
    key: "status" | "priority" | "category" | "assignedTo",
    val: string,
  ) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(val)
        ? prev[key].filter((x) => x !== val)
        : [...prev[key], val],
    }));

  

  const activeFilterCount =
    filters.status.length +
    filters.priority.length +
    filters.category.length +
    filters.assignedTo.length;

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <AgentNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* ── Page header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Inbox size={20} className="text-violet-600" />
              <h1 className="text-xl font-extrabold text-gray-900">
                Ticket Queue
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-600 rounded-full">
                {tickets.length}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Manage and respond to customer support tickets
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                showFilters || activeFilterCount > 0
                  ? "bg-violet-50 border-violet-300 text-violet-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-violet-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                clearFilters();
                dispatch(fetchTickets({ status: "", priority: "" }));
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 active:scale-95 transition-all shadow-sm shadow-violet-200"
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            {
              label: "Total Tickets",
              value: stats.total,
              accent: "bg-violet-500",
              delta: null,
              up: true,
            },
            {
              label: "Urgent",
              value: stats.urgent,
              accent: "bg-red-500",
              delta: null,
              up: false,
            },
            {
              label: "Unassigned",
              value: stats.unassigned,
              accent: "bg-amber-500",
              delta: null,
              up: false,
            },
            {
              label: "Open",
              value: stats.open,
              accent: "bg-sky-500",
              delta: "+12%",
              up: true,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 group hover:shadow-md transition-shadow"
            >
              <div
                className={`h-1 rounded-full ${s.accent} mb-3 w-8 group-hover:w-full transition-all duration-500`}
              />
              <p className="text-2xl font-extrabold text-gray-900 mb-0.5">
                {s.value}
              </p>
              <p className="text-xs text-gray-400 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── View mode tabs ───────────────────────────────────── */}
        <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-1 mb-5 shadow-sm w-fit">
          {[
            { key: "all", label: "All Tickets" },
            { key: "unassigned", label: "Unassigned" },
            { key: "assigned-to-me", label: "Mine" },
            { key: "urgent", label: "Urgent" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                viewMode === key
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Filters panel ───────────────────────────────────── */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <div className="flex items-center justify-between mb-5">
              <span className="font-bold text-gray-900 text-sm">
                Filter Tickets
              </span>
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Status
                </p>
                <div className="space-y-2.5">
                  {["open", "in-progress", "resolved", "closed"].map((s) => (
                    <FilterCheck
                      key={s}
                      label={s}
                      checked={filters.status.includes(s)}
                      onChange={() => toggleFilter("status", s)}
                    />
                  ))}
                </div>
              </div>
              {/* Priority */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Priority
                </p>
                <div className="space-y-2.5">
                  {["urgent", "high", "medium", "low"].map((p) => (
                    <FilterCheck
                      key={p}
                      label={p}
                      checked={filters.priority.includes(p)}
                      onChange={() => toggleFilter("priority", p)}
                    />
                  ))}
                </div>
              </div>
              {/* Category */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Category
                </p>
                <div className="space-y-2.5">
                  {[
                    "Billing",
                    "Technical Issue",
                    "Feature Request",
                    "Account Management",
                    "API",
                  ].map((c) => (
                    <FilterCheck
                      key={c}
                      label={c}
                      checked={filters.category.includes(c)}
                      onChange={() => toggleFilter("category", c)}
                    />
                  ))}
                </div>
              </div>
              {/* Assignment */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Assignment
                </p>
                <div className="space-y-2.5">
                  {[
                    { key: "unassigned", label: "Unassigned" },
                    { key: "me", label: "Assigned to me" },
                  ].map((a) => (
                    <FilterCheck
                      key={a.key}
                      label={a.label}
                      checked={filters.assignedTo.includes(a.key)}
                      onChange={() => toggleFilter("assignedTo", a.key)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Search + bulk actions bar ────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by ticket ID, subject, or customer…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none placeholder-gray-400 transition-all"
              />
            </div>

            {/* Bulk selection banner */}
            {selectedTickets.length > 0 && (
              <div className="flex items-center gap-3 bg-violet-50 border border-violet-200 px-4 py-2.5 rounded-xl">
                <CheckSquare
                  size={15}
                  className="text-violet-600 flex-shrink-0"
                />
                <span className="text-sm font-bold text-violet-700">
                  {selectedTickets.length} selected
                </span>
                <button
                  onClick={() => {
                    setSelectedTicketIds(selectedTickets);
                    setShowAssignModal(true);
                  }}
                  className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors"
                >
                  Assign
                </button>
                <button
                  onClick={() => setSelectedTickets([])}
                  className="p-1.5 hover:bg-violet-200 rounded-lg transition-colors"
                >
                  <X size={13} className="text-violet-600" />
                </button>
              </div>
            )}

            {/* Export */}
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
              <Download size={15} /> Export
            </button>
          </div>
        </div>

        {/* ── Results row ─────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-700">{filtered.length}</span>{" "}
            of <span className="font-bold text-gray-700">{tickets.length}</span>{" "}
            tickets
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 bg-white rounded-xl px-3 py-1.5 text-gray-600 font-semibold focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="priority">Priority</option>
              <option value="updated">Recently updated</option>
            </select>
          </div>
        </div>

        {/* ── Loading ──────────────────────────────────────────── */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            <p className="text-sm text-gray-400 font-medium">
              Loading tickets…
            </p>
          </div>
        )}

        {/* ── Tickets table ────────────────────────────────────── */}
        {!isLoading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-5 py-3.5 text-left w-10">
                      <div
                        onClick={toggleAll}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                          selectedTickets.length === filtered.length &&
                          filtered.length > 0
                            ? "bg-violet-600 border-violet-600"
                            : "border-gray-300 hover:border-violet-400"
                        }`}
                      >
                        {selectedTickets.length === filtered.length &&
                          filtered.length > 0 && (
                            <CheckCircle2 size={10} className="text-white" />
                          )}
                      </div>
                    </th>
                    {[
                      "Ticket ID",
                      "Subject",
                      "Customer",
                      "Status",
                      "Priority",
                      "Assigned",
                      "Updated",
                      "",
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="px-4 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {filtered.length > 0 ? (
                    filtered.map((ticket) => {
                      const pcfg =
                        PRIORITY_CFG[ticket.priority] ?? PRIORITY_CFG.medium;
                      const isUrgent = ticket.priority === "urgent";
                      const isSelected = selectedTickets.includes(ticket.id);
                      const customer = customerMap[ticket.customer_id];

                      return (
                        <tr
                          key={ticket.id}
                          onClick={() =>
                            navigate(`/agent/tickets/${ticket.id}`)
                          }
                          className={`cursor-pointer group transition-colors ${
                            isSelected
                              ? "bg-violet-50/60"
                              : isUrgent
                                ? "bg-red-50/30 hover:bg-red-50/60"
                                : "hover:bg-gray-50/80"
                          }`}
                        >
                          {/* Checkbox */}
                          <td
                            className="px-5 py-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTicket(ticket.id);
                            }}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-violet-600 border-violet-600"
                                  : "border-gray-300 hover:border-violet-400"
                              }`}
                            >
                              {isSelected && (
                                <CheckCircle2
                                  size={10}
                                  className="text-white"
                                />
                              )}
                            </div>
                          </td>

                          {/* ID */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-1 h-8 rounded-full flex-shrink-0 ${pcfg.bar}`}
                              />
                              <span className="text-xs font-mono font-bold text-gray-500">
                                {ticket.ticket_number}
                              </span>
                            </div>
                          </td>

                          {/* Subject */}
                          <td className="px-4 py-4 max-w-xs">
                            <p className="text-sm font-bold text-gray-800 group-hover:text-violet-600 transition-colors truncate">
                              {ticket.subject}
                            </p>
                            {ticket.tags && ticket.tags.length > 0 && (
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {ticket.tags.map((tag: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Customer */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-[10px] font-extrabold flex-shrink-0">
                                {(customer?.name || "C")
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                  {customer?.name || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                  {customer?.email || ""}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <StatusBadge status={ticket.status} />
                          </td>

                          {/* Priority */}
                          <td className="px-4 py-4">
                            <PriorityBadge priority={ticket.priority} />
                          </td>

                          {/* Assigned */}
                          <td className="px-4 py-4">
                            {ticket.assigned_to === user?.id ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 border border-violet-200 text-violet-700 rounded-full text-xs font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />{" "}
                                You
                              </span>
                            ) : !ticket.assigned_to ||
                              ticket.assigned_to === "Unassigned" ? (
                              <div
                                className="flex items-center gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    setSelectedTicketIds([ticket.id]);
                                    setShowAssignModal(true);
                                    e.stopPropagation();
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                                >
                                  <UserPlus size={11} /> Assign
                                </button>
                                <button
                                  onClick={(e) =>
                                    handleAssignToMe(ticket.id, e)
                                  }
                                  className="flex items-center gap-1 px-2.5 py-1 bg-violet-50 border border-violet-200 text-violet-700 rounded-lg text-xs font-bold hover:bg-violet-100 transition-colors"
                                >
                                  Me
                                </button>
                              </div>
                            ) : (
                              <AssignedAgentName userId={ticket.assigned_to} />
                            )}
                          </td>

                          {/* Updated */}
                          <td className="px-4 py-4">
                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                              <Clock size={11} className="text-gray-300" />
                              {relTime(ticket.updated_at)}
                            </span>
                          </td>

                          {/* Chevron */}
                          <td className="px-4 py-4">
                            <ChevronRight
                              size={15}
                              className="text-gray-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all"
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                            <Inbox size={26} className="text-gray-300" />
                          </div>
                          <div>
                            <p className="text-base font-bold text-gray-700 mb-1">
                              No tickets found
                            </p>
                            <p className="text-sm text-gray-400">
                              Try adjusting your filters or search query
                            </p>
                          </div>
                          <button
                            onClick={clearFilters}
                            className="px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors"
                          >
                            Clear Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <AssignAgentsModal
              isOpen={showAssignModal}
              onClose={() => setShowAssignModal(false)}
              ticketIds={selectedTicketIds}
              onAssign={handleAssignTickets}
            />

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-bold text-gray-700">1</span>–
                  <span className="font-bold text-gray-700">
                    {filtered.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-700">
                    {filtered.length}
                  </span>
                </p>
                <div className="flex items-center gap-1.5">
                  {["Previous", "1", "2", "3", "Next"].map((p, i) => (
                    <button
                      key={i}
                      className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                        p === "1"
                          ? "bg-violet-600 text-white shadow-sm"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AgentTicketQueue;
