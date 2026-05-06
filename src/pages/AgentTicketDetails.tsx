// pages/AgentTicketDetailPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MessageSquare, Paperclip, CheckCircle2,
  MoreVertical, ChevronDown,  Calendar, Edit, 
  UserPlus, Archive, Copy, Phone, Mail, Star, AlertTriangle,
  X, FileText, Ticket, RefreshCw, Reply, Smile, Mic,
  Flag, Clock,  Link2, Printer, BookOpen, Zap, Lock,
  Ban, Save, SendHorizontal, Circle, CircleDot, MinusCircle,
  ChevronRight
} from 'lucide-react';
import AgentNavbar from '../components/AgentNavbar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchTicketById, fetchMessages, addMessage, updateTicket,
  selectCurrentTicket, selectTicketMessages, selectTicketsLoading
} from '../features/Tickets/ticketsSlice';
import { selectCurrentUser, getUserById, selectUserById } from '../features/Auth/authSlice';
import { showSuccess, showError, showLoading } from '../components/CustomToast';
import toast from 'react-hot-toast';
/* ── Config maps ──────────────────────────────────────────────── */

const STATUS_CFG: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  open:          { label: 'Open',        cls: 'text-sky-600 bg-sky-50 border-sky-200',         icon: <Circle size={10} className="fill-sky-500 text-sky-500" /> },
  'in-progress': { label: 'In Progress', cls: 'text-amber-600 bg-amber-50 border-amber-200',   icon: <CircleDot size={10} className="text-amber-500" /> },
  resolved:      { label: 'Resolved',    cls: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle2 size={10} className="text-emerald-500" /> },
  closed:        { label: 'Closed',      cls: 'text-gray-400 bg-gray-100 border-gray-200',    icon: <MinusCircle size={10} className="text-gray-400" /> },
};

const PRIORITY_CFG: Record<string, { label: string; bar: string; text: string }> = {
  urgent: { label: 'Urgent', bar: 'bg-red-500',    text: 'text-red-600' },
  high:   { label: 'High',   bar: 'bg-orange-400', text: 'text-orange-600' },
  medium: { label: 'Medium', bar: 'bg-amber-400',  text: 'text-amber-600' },
  low:    { label: 'Low',    bar: 'bg-emerald-400',text: 'text-emerald-600' },
};

const CANNED = [
  { title: 'Password Reset',  content: "To reset your password, visit the login page and click \"Forgot Password\". You'll receive an email within 5 minutes." },
  { title: 'Refund Processed', content: 'Your refund has been processed. The amount will reflect in your account within 3–5 business days.' },
  { title: 'Technical Issue',  content: 'I apologize for the inconvenience. Our engineering team has been notified and is working on a fix. I will update you as soon as it\'s resolved.' },
  { title: 'Billing Question', content: 'I understand your concern about billing. Let me walk you through how our billing cycle works...' },
];

/* ── Tiny shared components ──────────────────────────────────── */

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.open;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const PriorityDot = ({ priority }: { priority: string }) => {
  const cfg = PRIORITY_CFG[priority] ?? PRIORITY_CFG.medium;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${cfg.text}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.bar}`} />
      {cfg.label}
    </span>
  );
};

const Avatar = ({ name, size = 8, gradient }: { name: string; size?: number; gradient: string }) => (
  <div className={`w-${size} h-${size} rounded-full ${gradient} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
    {name.charAt(0).toUpperCase()}
  </div>
);

const formatDate = (d: string) => {
  const date = new Date(d), now = new Date();
  const diff = now.getTime() - date.getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), day = Math.floor(diff / 86400000);
  if (m < 1)   return 'Just now';
  if (m < 60)  return `${m}m ago`;
  if (h < 24)  return `${h}h ago`;
  if (day ===1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/* ── Dropdown wrapper ────────────────────────────────────────── */
const Dropdown = ({ open, children }: { open: boolean; children: React.ReactNode }) =>
  open ? (
    <div className="absolute top-full right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 min-w-[160px] animate-[fadeIn_0.1s_ease]">
      {children}
    </div>
  ) : null;

const DropItem = ({ icon, label, danger, onClick }: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition-colors ${danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}>
    {icon}{label}
  </button>
);

/* ═══════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                */
/* ═══════════════════════════════════════════════════════════════ */

const AgentTicketDetailPage = () => {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const dispatch   = useAppDispatch();
  const endRef     = useRef<HTMLDivElement>(null);
  const fileRef    = useRef<HTMLInputElement>(null);
  const textRef    = useRef<HTMLTextAreaElement>(null);

  const [tab, setTab]               = useState<'conversation'|'internal'|'activity'>('conversation');
  const [msg, setMsg]               = useState('');
  const [note, setNote]             = useState('');
  const [showNote, setShowNote]     = useState(false);
  const [files, setFiles]           = useState<File[]>([]);
  const [sending, setSending]       = useState(false);
  const [replyTo, setReplyTo]       = useState<{id: string; author: string}|null>(null);
  const [canned, setCanned]         = useState(false);
  const [editing, setEditing]       = useState(false);
  const [editForm, setEditForm]     = useState({ subject: '', description: '', category: '' });
  const [slaWarning, setSlaWarning] = useState(true);
  const [fwdModal, setFwdModal]     = useState(false);
  const [fwdEmail, setFwdEmail]     = useState('');
  const [snooze, setSnooze]         = useState(false);

  // dropdowns — only one open at a time
  const [dd, setDd] = useState<string|null>(null);
  const toggleDd = (name: string) => setDd(prev => prev === name ? null : name);

  const ticket      = useAppSelector(selectCurrentTicket);
  const messages    = useAppSelector(selectTicketMessages);
  const isLoading   = useAppSelector(selectTicketsLoading);
  const currentUser = useAppSelector(selectCurrentUser);

  const assignedAgent = useAppSelector(state => ticket?.assigned_to ? selectUserById(state, ticket.assigned_to) : null);
  const customer = useAppSelector(state => ticket?.customer_id ? selectUserById(state, ticket.customer_id) : null);

  useEffect(() => {
    if(ticket?.customer_id && !customer) {
      dispatch(getUserById(ticket.customer_id));
    }
  }, [dispatch, ticket?.customer_id, customer]);

  useEffect(() => {
    if (ticket?.assigned_to && !assignedAgent) {
      dispatch(getUserById(ticket.assigned_to));
    }
  }, [dispatch, ticket?.assigned_to, assignedAgent]);

  useEffect(() => {
    if (id) { dispatch(fetchTicketById(id)); dispatch(fetchMessages(id)); }
  }, [dispatch, id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);


  /* handlers */
 const changeStatus = async (s: string) => {
  const map: Record<string, 'open' | 'in-progress' | 'resolved' | 'closed'> = { 
    Open: 'open',
    'In Progress': 'in-progress', 
    Resolved: 'resolved', 
    Closed: 'closed' 
  };
  const mappedStatus = map[s] ?? s as 'open' | 'in-progress' | 'resolved' | 'closed';
  try { 
    await dispatch(updateTicket({ ticketId: id!, updates: { status: mappedStatus } })).unwrap(); 
    showSuccess(`Status → ${s}`);
  } catch { 
    showError('Failed'); 
  }
  setDd(null);
};

const changePriority = async (p: string) => {
  const validPriorities: ('low' | 'medium' | 'high' | 'urgent')[] = ['low', 'medium', 'high', 'urgent'];
  const mappedPriority = p as 'low' | 'medium' | 'high' | 'urgent';
  
  // Optional: Validate that p is a valid priority
  if (!validPriorities.includes(mappedPriority)) {
    showError('Invalid priority');
    return;
  }
  
  try { 
    await dispatch(updateTicket({ ticketId: id!, updates: { priority: mappedPriority } })).unwrap(); 
    showSuccess(`Priority → ${p}`); 
  } catch { 
    showError('Failed'); 
  }
  setDd(null);
};

  const assignToMe = async () => {
    try { await dispatch(updateTicket({ ticketId: id!, updates: { assigned_to: currentUser?.name } })).unwrap(); showSuccess('Assigned to you'); }
    catch { showError('Failed'); }
    setDd(null);
  };

  const markResolved = async () => {
    try { await dispatch(updateTicket({ ticketId: id!, updates: { status: 'resolved' } })).unwrap(); showSuccess('Ticket resolved'); }
    catch { showError('Failed'); }
  };

  const handleSend = async (e: React.FormEvent) => {
    const loadingId = showLoading('Sending message…');
    e.preventDefault();
    if (!msg.trim() && files.length === 0) return;
    setSending(true);
    try {
      await dispatch(addMessage({
        ticketId: id!, message: replyTo ? `@${replyTo.author} ${msg}` : msg,
        authorId: currentUser!.id, authorName: currentUser!.name,
        authorAvatar: currentUser!.avatar, isInternal: false,
      })).unwrap();
      setMsg(''); setFiles([]); setReplyTo(null);
    } catch { showError('Failed to send'); }
    finally { setSending(false); 
      setTimeout(() => {
        toast.dismiss(loadingId)
      }, 500);
    }
  };

  const handleNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    try {
      await dispatch(addMessage({
        ticketId: id!, message: `[INTERNAL] ${note}`,
        authorId: currentUser!.id, authorName: currentUser!.name,
        authorAvatar: currentUser!.avatar, isInternal: true,
      })).unwrap();
      setNote(''); setShowNote(false); showSuccess('Note saved');
    } catch { showError('Failed'); }
  };

  const doSnooze = async (dur: string) => {
    const d = new Date();
    if (dur === '1h')       d.setHours(d.getHours() + 1);
    if (dur === '4h')       d.setHours(d.getHours() + 4);
    if (dur === 'tomorrow') d.setDate(d.getDate() + 1);
    try { await dispatch(updateTicket({ ticketId: id!, updates: { snoozed_until: d.toISOString() } })).unwrap(); showSuccess(`Snoozed until ${d.toLocaleTimeString()}`); }
    catch { showError('Failed'); }
    setSnooze(false);
  };

  /* ── loading ────────────────────────────────────────────────── */
  if (isLoading && !ticket) return (
    <div className="min-h-screen bg-[#f4f5f7]"><AgentNavbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading ticket…</p>
        </div>
      </div>
    </div>
  );

  if (!ticket) return (
    <div className="min-h-screen bg-[#f4f5f7]"><AgentNavbar />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
          <AlertTriangle size={28} className="text-gray-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Ticket not found</h2>
        <button onClick={() => navigate('/agent/tickets')} className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
          Back to Queue
        </button>
      </div>
    </div>
  );

  const convMsgs = messages.filter(m => !m.is_internal);
  const intlMsgs = messages.filter(m => m.is_internal);

  /* ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f4f5f7]" onClick={() => setDd(null)}>
      <AgentNavbar />

      {/* SLA Banner */}
      {slaWarning && ticket.priority === 'urgent' && ticket.status !== 'resolved' && (
        <div className="bg-red-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <AlertTriangle size={15} className="flex-shrink-0" />
              <span className="font-semibold">SLA Breach Warning</span>
              <span className="text-red-200">·</span>
              <span className="text-red-100">Response due in <span className="font-bold text-white">45 min</span></span>
              <button className="text-xs underline text-red-200 hover:text-white transition-colors">Escalate now</button>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setSlaWarning(false); }} className="text-red-200 hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb / top nav */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <button onClick={() => navigate('/agent/tickets')} className="hover:text-violet-600 transition-colors font-medium">Queue</button>
            <ChevronRight size={13} />
            <span className="text-gray-700 font-semibold truncate max-w-xs">{ticket.subject}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => window.location.reload()} className="p-2 text-gray-400 hover:text-violet-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200">
              <RefreshCw size={15} />
            </button>
            <button onClick={() => window.print()} className="p-2 text-gray-400 hover:text-violet-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200">
              <Printer size={15} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_288px] gap-5">

          {/* ══ LEFT ══════════════════════════════════════════════ */}
          <div className="space-y-4">

            {/* Ticket Header Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              {editing ? (
                <div className="space-y-3">
                  <input type="text" value={editForm.subject} onChange={e => setEditForm({...editForm, subject: e.target.value})}
                    placeholder="Subject"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none" />
                  <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none bg-white">
                    {['Technical Issue','Billing','Account','Feature Request'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <textarea value={editForm.description} rows={3} onChange={e => setEditForm({...editForm, description: e.target.value})}
                    placeholder="Description"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none resize-none" />
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      await dispatch(updateTicket({ ticketId: id!, updates: { subject: editForm.subject, category: editForm.category, description: editForm.description } })).unwrap();
                      setEditing(false); toast.success('Ticket updated');
                    }} className="px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-1.5">
                      <Save size={13} /> Save Changes
                    </button>
                    <button onClick={() => setEditing(false)} className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-mono font-bold text-gray-400 tracking-widest">
                          #{ticket.ticket_number || ticket.id.slice(0,8).toUpperCase()}
                        </span>
                        <span className="text-gray-200">|</span>
                        <span className="text-[11px] text-gray-400 capitalize">{ticket.category || 'General'}</span>
                      </div>
                      <h1 className="text-lg font-bold text-gray-900 leading-snug mb-2.5">{ticket.subject}</h1>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={ticket.status} />
                        <PriorityDot priority={ticket.priority} />
                        <span className="text-[11px] text-gray-400 flex items-center gap-1"><Calendar size={10}/> {new Date(ticket.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1"><Clock size={10}/> {formatDate(ticket.updated_at)}</span>
                      </div>
                    </div>

                    {/* Top actions */}
                    <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={markResolved}
                        className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 active:scale-95 transition-all shadow-sm shadow-violet-200">
                        <CheckCircle2 size={13} /> Mark Resolved
                      </button>

                      {/* Snooze */}
                      <div className="relative">
                        <button onClick={() => { setSnooze(!snooze); setDd(null); }}
                          className="p-2 text-gray-500 hover:text-violet-600 bg-gray-50 hover:bg-violet-50 border border-gray-200 rounded-xl transition-all">
                          <Clock size={15} />
                        </button>
                        {snooze && (
                          <div className="absolute right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 min-w-[160px]">
                            {[['1h','Snooze 1 hour'],['4h','Snooze 4 hours'],['tomorrow','Until tomorrow']].map(([k,l]) => (
                              <button key={k} onClick={() => doSnooze(k)} className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50">
                                <Clock size={11} className="text-gray-400"/>{l}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Edit */}
                      <button onClick={() => { setEditForm({ subject: ticket.subject, description: ticket.description, category: ticket.category||'' }); setEditing(true); }}
                        className="p-2 text-gray-500 hover:text-violet-600 bg-gray-50 hover:bg-violet-50 border border-gray-200 rounded-xl transition-all">
                        <Edit size={15} />
                      </button>

                      {/* More */}
                      <div className="relative">
                        <button onClick={() => toggleDd('more')}
                          className="p-2 text-gray-500 hover:text-violet-600 bg-gray-50 hover:bg-violet-50 border border-gray-200 rounded-xl transition-all">
                          <MoreVertical size={15} />
                        </button>
                        <Dropdown open={dd === 'more'}>
                          <DropItem icon={<Copy size={12}/>}    label="Duplicate" />
                          <DropItem icon={<Link2 size={12}/>}   label="Copy Link" />
                          <DropItem icon={<Archive size={12}/>} label="Archive" />
                          <DropItem icon={<Flag size={12}/>}    label="Escalate" />
                          <div className="my-1 mx-3 border-t border-gray-100" />
                          <DropItem icon={<Ban size={12}/>}     label="Block User" danger />
                        </Dropdown>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                  </div>
                </>
              )}
            </div>

            {/* ── Tabs + Messages ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Tab bar */}
              <div className="flex border-b border-gray-100 bg-gray-50/60">
                {(['conversation','internal','activity'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`relative px-5 py-3.5 text-xs font-bold transition-colors capitalize flex items-center gap-1.5 ${
                      tab === t ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'
                    }`}>
                    {t === 'conversation' && <MessageSquare size={13} />}
                    {t === 'internal'     && <Lock size={13} />}
                    {t === 'activity'     && <Clock size={13} />}
                    {t === 'conversation' ? 'Conversation' : t === 'internal' ? 'Internal Notes' : 'Activity'}
                    {t === 'conversation' && <span className="px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded-full text-[10px]">{convMsgs.length}</span>}
                    {t === 'internal'     && intlMsgs.length > 0 && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[10px]">{intlMsgs.length}</span>}
                    {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-t-full" />}
                  </button>
                ))}
              </div>

              {/* ── Conversation Tab ─────────────────────────────── */}
              {tab === 'conversation' && (
                <>
                  <div className="h-[440px] overflow-y-auto px-5 py-5 space-y-5" style={{scrollbarWidth:'thin',scrollbarColor:'#e5e7eb transparent'}}>
                    {convMsgs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                          <MessageSquare size={22} className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400">No messages yet</p>
                      </div>
                    ) : convMsgs.map((m, i) => {
                      const isAgent = m.author_id === currentUser?.id;
                      const firstInGroup = i === 0 || convMsgs[i-1]?.author_id !== m.author_id;
                      return (
                        <div key={m.id} className={`flex gap-3 ${isAgent ? 'flex-row-reverse' : ''}`}>
                          {firstInGroup
                            ? <Avatar name={m.author_name} size={8}
                                gradient={isAgent ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : 'bg-gradient-to-br from-slate-500 to-slate-700'} />
                            : <div className="w-8 flex-shrink-0" />}
                          <div className={`flex flex-col max-w-[70%] ${isAgent ? 'items-end' : 'items-start'}`}>
                            {firstInGroup && (
                              <div className={`flex items-center gap-2 mb-1.5 ${isAgent ? 'flex-row-reverse' : ''}`}>
                                <span className="text-xs font-bold text-gray-800">{m.author_name}</span>
                                {isAgent && <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-bold">You</span>}
                                <span className="text-[11px] text-gray-400">{formatDate(m.created_at)}</span>
                              </div>
                            )}
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                              isAgent
                                ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm'
                                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                            }`}>
                              <p className="whitespace-pre-wrap">{m.message}</p>
                            </div>
                            <button onClick={() => { setReplyTo({id: m.id, author: m.author_name}); textRef.current?.focus(); }}
                              className={`flex items-center gap-1 text-[11px] text-gray-400 hover:text-violet-600 mt-1.5 transition-colors ${isAgent ? 'flex-row-reverse' : ''}`}>
                              <Reply size={11}/> Reply
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={endRef} />
                  </div>

                  {/* Reply indicator */}
                  {replyTo && (
                    <div className="px-5 py-2.5 bg-violet-50 border-t border-violet-100 flex items-center justify-between">
                      <span className="text-xs text-violet-700">Replying to <span className="font-bold">@{replyTo.author}</span></span>
                      <button onClick={() => setReplyTo(null)} className="text-violet-400 hover:text-violet-700"><X size={13}/></button>
                    </div>
                  )}

                  {/* File previews */}
                  {files.length > 0 && (
                    <div className="px-5 py-2.5 border-t border-gray-100 flex flex-wrap gap-2">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-gray-600">
                          <FileText size={11}/><span className="max-w-[100px] truncate">{f.name}</span>
                          <button onClick={() => setFiles(files.filter((_,j)=>j!==i))} className="text-gray-400 hover:text-red-500"><X size={11}/></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Canned responses */}
                  {canned && (
                    <div className="mx-5 mb-2 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="px-3 py-2 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                        Canned Responses
                        <button onClick={() => setCanned(false)} className="text-gray-400 hover:text-gray-600"><X size={12}/></button>
                      </div>
                      {CANNED.map((r,i) => (
                        <button key={i} onClick={() => { setMsg(r.content); setCanned(false); textRef.current?.focus(); }}
                          className="w-full text-left px-3 py-2.5 text-xs text-gray-700 hover:bg-violet-50 hover:text-violet-700 border-t border-gray-100 transition-colors">
                          <span className="font-semibold">{r.title}</span>
                          <span className="text-gray-400 ml-2 font-normal">{r.content.slice(0,60)}…</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message input */}
                  <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                    <form onSubmit={handleSend}>
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                        <textarea ref={textRef} value={msg} onChange={e => setMsg(e.target.value)} rows={3}
                          placeholder="Reply to customer… (Enter to send · Shift+Enter for new line · / for canned)"
                          className="w-full px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none"
                          onKeyDown={e => { if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); handleSend(e); } }} />
                        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
                          <div className="flex items-center gap-0.5">
                            {[
                              { icon: <Paperclip size={15}/>,  fn: () => fileRef.current?.click() },
                              { icon: <BookOpen size={15}/>,   fn: () => setCanned(!canned) },
                              { icon: <Mic size={15}/>,        fn: undefined },
                              { icon: <Smile size={15}/>,      fn: undefined },
                            ].map((b,i) => (
                              <button key={i} type="button" onClick={b.fn}
                                className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                                {b.icon}
                              </button>
                            ))}
                            <input ref={fileRef} type="file" multiple className="hidden" onChange={e => setFiles(prev=>[...prev,...Array.from(e.target.files||[])])} />
                          </div>
                          <button type="submit" disabled={(!msg.trim()&&files.length===0)||sending}
                            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-lg hover:bg-violet-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            {sending ? <RefreshCw size={13} className="animate-spin"/> : <SendHorizontal size={13}/>}
                            Send Reply
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              )}

              {/* ── Internal Notes Tab ──────────────────────────── */}
              {tab === 'internal' && (
                <div className="p-5">
                  <div className="space-y-3 max-h-[360px] overflow-y-auto mb-4" style={{scrollbarWidth:'thin'}}>
                    {intlMsgs.length === 0 ? (
                      <div className="text-center py-10 text-sm text-gray-400">No internal notes yet</div>
                    ) : intlMsgs.map(n => (
                      <div key={n.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2.5">
                          <Avatar name={n.author_name} size={7} gradient="bg-gradient-to-br from-amber-400 to-orange-500" />
                          <div>
                            <p className="text-xs font-bold text-gray-800">{n.author_name}</p>
                            <p className="text-[11px] text-gray-500">{formatDate(n.created_at)}</p>
                          </div>
                          <span className="ml-auto text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">Internal</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{n.message.replace('[INTERNAL] ','')}</p>
                      </div>
                    ))}
                  </div>

                  {showNote ? (
                    <form onSubmit={handleNote}>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
                        <div className="px-3 py-2 bg-amber-100/50 border-b border-amber-200">
                          <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1.5"><Lock size={11}/> Internal — only visible to agents</span>
                        </div>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                          placeholder="Type your internal note…"
                          className="w-full px-4 py-3 text-sm text-gray-800 bg-transparent placeholder-amber-400/70 resize-none outline-none" />
                        <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-amber-200">
                          <button type="button" onClick={() => setShowNote(false)} className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                          <button type="submit" disabled={!note.trim()} className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-40">
                            <Save size={12}/> Save Note
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => setShowNote(true)}
                      className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-xs font-semibold text-gray-400 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all flex items-center justify-center gap-2">
                      <Lock size={13}/> Add Internal Note
                    </button>
                  )}
                </div>
              )}

              {/* ── Activity Log ─────────────────────────────────── */}
              {tab === 'activity' && (
                <div className="p-5 space-y-2 max-h-[480px] overflow-y-auto" style={{scrollbarWidth:'thin'}}>
                  {[
                    { action: 'Ticket created', user: ticket.customer_id, time: ticket.created_at, color: 'bg-sky-500' },
                    { action: `Status set to ${ticket.status}`, user: 'System', time: ticket.updated_at, color: 'bg-gray-400' },
                    ...convMsgs.slice(0,5).map(m => ({ action: 'Message sent', user: m.author_name, time: m.created_at, color: 'bg-violet-500' })),
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700">{a.action}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-gray-400">by {a.user}</span>
                          <span className="text-gray-300 text-[10px]">·</span>
                          <span className="text-[11px] text-gray-400">{formatDate(a.time)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT SIDEBAR ═════════════════════════════════════ */}
          <div className="space-y-4">

            {/* Assignment & Management */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" onClick={e => e.stopPropagation()}>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Management</p>

              {/* Assigned to */}
              <div className="mb-4">
                <p className="text-[11px] text-gray-400 font-semibold mb-1.5">Assigned to</p>
                <div className="relative">
                  <button onClick={() => toggleDd('assign')}
                    className="w-full flex items-center gap-2.5 p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors">
                    <Avatar name={assignedAgent?.name || ticket.assigned_to || '?'} size={7} gradient="bg-gradient-to-br from-violet-500 to-indigo-600" />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{assignedAgent?.name || 'Unassigned'}</p>
                      <p className="text-[10px] text-gray-400">{assignedAgent?.name ? 'Support Agent' : 'Click to assign'}</p>
                    </div>
                    <ChevronDown size={13} className="text-gray-400 flex-shrink-0" />
                  </button>
                  <Dropdown open={dd === 'assign'}>
                    <DropItem icon={<UserPlus size={12}/>} label="Assign to me" onClick={assignToMe} />
                    <DropItem icon={<X size={12}/>}        label="Unassign" onClick={async () => { await dispatch(updateTicket({ticketId:id!,updates:{assigned_to:null}})).unwrap(); setDd(null); }} />
                  </Dropdown>
                </div>
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5">Status</p>
                  <div className="relative">
                    <button onClick={() => toggleDd('status')}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs transition-colors">
                      <StatusBadge status={ticket.status} />
                      <ChevronDown size={11} className="text-gray-400" />
                    </button>
                    <Dropdown open={dd === 'status'}>
                      {['Open','In Progress','Resolved','Closed'].map(s => (
                        <button key={s} onClick={() => changeStatus(s)} className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50">
                          {STATUS_CFG[s.toLowerCase().replace(' ','-')]?.icon} {s}
                        </button>
                      ))}
                    </Dropdown>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5">Priority</p>
                  <div className="relative">
                    <button onClick={() => toggleDd('priority')}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs transition-colors">
                      <PriorityDot priority={ticket.priority} />
                      <ChevronDown size={11} className="text-gray-400" />
                    </button>
                    <Dropdown open={dd === 'priority'}>
                      {['urgent','high','medium','low'].map(p => (
                        <button key={p} onClick={() => changePriority(p)}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 capitalize">
                          <span className={`w-2 h-2 rounded-full ${PRIORITY_CFG[p].bar}`} />{p}
                        </button>
                      ))}
                    </Dropdown>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-[11px] text-gray-400 font-semibold mb-1.5">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {(ticket.tags||[]).map((tag: string, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-medium">
                      {tag}<button className="text-gray-400 hover:text-red-500 ml-0.5"><X size={10}/></button>
                    </span>
                  ))}
                  <button className="px-2.5 py-1 border border-dashed border-gray-300 text-[11px] text-gray-400 rounded-lg hover:border-violet-400 hover:text-violet-600 transition-colors font-medium">
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer</p>
                <button className="text-[11px] font-semibold text-violet-600 hover:text-violet-700 transition-colors">View Profile</button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {customer?.name?.charAt(0) || 'C'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{customer?.name || 'Customer'}</p>
                  {/* <p className="text-xs text-gray-500 truncate">{ticket.customer_company || 'Individual'}</p> */}
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-[11px] text-gray-500">98% satisfaction</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 border-t border-gray-100 pt-3.5">
                {[
                  { icon: <Mail size={12}/>,    val: customer?.email || '—', href: `mailto:${customer?.email}` },
                  { icon: <Phone size={12}/>,   val: customer?.phone || 'No phone provided' },
                  { icon: <Ticket size={12}/>,  val: '3 total tickets' },
                ].map((row,i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-gray-300 flex-shrink-0">{row.icon}</span>
                    {row.href
                      ? <a href={row.href} className="text-xs text-gray-600 hover:text-violet-600 truncate transition-colors">{row.val}</a>
                      : <span className="text-xs text-gray-600 truncate">{row.val}</span>}
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 px-3 py-2 text-xs font-bold text-violet-600 border border-violet-200 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                <Mail size={12}/> Send Email
              </button>
            </div>

            {/* SLA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">SLA Status</p>
              <div className="space-y-4">
                {[
                  { label: 'First Response', pct: 45, color: 'bg-emerald-500', textColor: 'text-emerald-600', timeLeft: '2 hours' },
                  { label: 'Resolution',     pct: 30, color: 'bg-amber-400',   textColor: 'text-amber-600',   timeLeft: '22 hours' },
                ].map(({label,pct,color,textColor,timeLeft}) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-600 font-medium">{label}</span>
                      <span className={`text-xs font-bold ${textColor}`}>{timeLeft} left</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`${color} h-1.5 rounded-full transition-all`} style={{width:`${pct}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white shadow-sm shadow-violet-200">
              <p className="text-[11px] font-bold uppercase tracking-wider text-violet-300 mb-3 flex items-center gap-1.5">
                <Zap size={12}/> Quick Actions
              </p>
              <div className="space-y-1.5">
                {[
                  { label: 'Mark as Resolved', icon: <CheckCircle2 size={13}/>, fn: markResolved },
                  { label: 'Forward via Email', icon: <Mail size={13}/>,        fn: () => setFwdModal(true) },
                  { label: 'Escalate to Manager',icon: <Flag size={13}/>,       fn: undefined },
                ].map((a,i) => (
                  <button key={i} onClick={a.fn}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition-colors">
                    <span>{a.label}</span>
                    {a.icon}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Forward Modal */}
      {fwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFwdModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Forward Ticket</h3>
              <button onClick={() => setFwdModal(false)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><X size={16}/></button>
            </div>
            <div className="space-y-3">
              <input type="email" value={fwdEmail} onChange={e => setFwdEmail(e.target.value)}
                placeholder="Recipient email address"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none" />
              <textarea rows={3} placeholder="Additional message (optional)"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none resize-none" />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setFwdModal(false)} className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button className="px-5 py-2 text-xs font-bold bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-1.5">
                <SendHorizontal size={13}/> Forward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentTicketDetailPage;