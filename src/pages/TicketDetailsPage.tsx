// pages/TicketDetailPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  Paperclip,
  Send,
  Clock,
  ChevronDown,
  Tag,
  Calendar,
  Edit,
  Trash2,
  AlertCircle,
  XCircle,
  RefreshCw,
  MoreVertical,
  Reply,
  Star,
  Users,
  File,
  Mic,
  Smile,
  Image as ImageIcon,
  CheckCircle2,
  CircleDot,
  Circle,
  MinusCircle,
  FileImage,
  FileText,
  Download,
  Eye,
  X,
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchTicketById,
  fetchMessages,
  addMessage,
  updateTicket,
  selectCurrentTicket,
  selectTicketMessages,
  selectTicketsLoading,
  clearCurrentTicket,
  fetchUserTickets, selectUserTickets
} from '../features/Tickets/ticketsSlice';
import { selectCurrentUser, getUserById, selectUserById } from '../features/Auth/authSlice';
import toast from 'react-hot-toast';
import React from 'react';

/* ─── tiny helpers ─────────────────────────────────────────── */

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  open:        { label: 'Open',        color: 'text-sky-600 bg-sky-50 border-sky-200',       icon: React.createElement(Circle, { size: 11, className: "fill-sky-500 text-sky-500" }) },
  'in-progress':{ label: 'In Progress', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: React.createElement(CircleDot, { size: 11, className: "text-amber-500" }) },
  resolved:    { label: 'Resolved',    color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: React.createElement(CheckCircle2, { size: 11, className: "text-emerald-500" }) },
  closed:      { label: 'Closed',      color: 'text-gray-500 bg-gray-100 border-gray-200',   icon: React.createElement(MinusCircle, { size: 11, className: "text-gray-400" }) },
};

const PRIORITY_CONFIG: Record<string, { label: string; dot: string }> = {
  urgent: { label: 'Urgent', dot: 'bg-red-500'    },
  high:   { label: 'High',   dot: 'bg-orange-400' },
  medium: { label: 'Medium', dot: 'bg-amber-400'  },
  low:    { label: 'Low',    dot: 'bg-emerald-400' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;
  return React.createElement('span', {
    className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.color}`
  }, cfg.icon, cfg.label);
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
  return React.createElement('span', {
    className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-gray-200 bg-white text-gray-700"
  }, 
    React.createElement('span', { className: `w-1.5 h-1.5 rounded-full ${cfg.dot}` }),
    cfg.label
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now  = new Date();
  const diff = now.getTime() - date.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/* ─── Avatar ────────────────────────────────────────────────── */
const Avatar = ({ name, gradient }: { name: string; gradient: string }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${gradient}`}>
    {name.charAt(0).toUpperCase()}
  </div>
);

// Define the Attachment type
interface Attachment {
  name: string;
  size: string;
  url: string;
  type?: string;
  path?: string;
}

/* ── Parse attachments — handles both JSON string and array ──── */
function parseAttachments(raw: unknown): Attachment[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* ── File type helpers ───────────────────────────────────────── */
const isImage = (type?: string) => type?.startsWith('image/');
const isPDF   = (type?: string) => type === 'application/pdf';

const fileIcon = (type?: string) => {
  if (isImage(type)) return <FileImage size={16} className="text-sky-500" />;
  if (isPDF(type))   return <FileText  size={16} className="text-red-500" />;
  return                    <File      size={16} className="text-gray-400" />;
};

const fileBg = (type?: string) => {
  if (isImage(type)) return 'bg-sky-50 border-sky-100';
  if (isPDF(type))   return 'bg-red-50 border-red-100';
  return                    'bg-gray-50 border-gray-100';
};

/* ── AttachmentsPanel ────────────────────────────────────────── */
const AttachmentsPanel = ({ attachments }: { attachments: Attachment[] }) => {
  const [lightbox, setLightbox] = useState<Attachment | null>(null);

  if (attachments.length === 0) return null;

  return (
    <>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Paperclip size={11} />
          Attachments
          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold">
            {attachments.length}
          </span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {attachments.map((att, i) => (
            <div key={i}
              className={`relative group rounded-xl border overflow-hidden ${fileBg(att.type)} transition-all hover:shadow-sm`}>

              {/* Image preview */}
              {isImage(att.type) ? (
                <div
                  className="aspect-video bg-gray-100 relative overflow-hidden cursor-pointer"
                  onClick={() => setLightbox(att)}>
                  <img
                    src={att.url}
                    alt={att.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <Eye size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

              ) : isPDF(att.type) ? (
                /* PDF tile */
                <div
                  className="aspect-video flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-red-50"
                  onClick={() => window.open(att.url, '_blank')}>
                  <FileText size={28} className="text-red-400" />
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">PDF</span>
                </div>

              ) : (
                /* Generic file tile */
                <div
                  className="aspect-video flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                  onClick={() => window.open(att.url, '_blank')}>
                  {fileIcon(att.type)}
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                    {att.type?.split('/')[1] || 'file'}
                  </span>
                </div>
              )}

              {/* Footer row */}
              <div className="px-2.5 py-2 flex items-center justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-gray-700 truncate">{att.name}</p>
                  <p className="text-[10px] text-gray-400">{att.size}</p>
                </div>
                <a
                  href={att.url}
                  download={att.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex-shrink-0">
                  <Download size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox for images */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-1.5 text-sm font-medium">
              <X size={16} /> Close
            </button>
            <img
              src={lightbox.url}
              alt={lightbox.name}
              className="w-full h-full object-contain rounded-xl shadow-2xl max-h-[80vh]"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-white/80 text-sm font-medium truncate">{lightbox.name}</p>
              <a
                href={lightbox.url}
                download={lightbox.name}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors flex-shrink-0 ml-3">
                <Download size={13} /> Download
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ─── Main Component ─────────────────────────────────────────── */
const TicketDetailPage = () => {
  const { id }         = useParams<{ id: string }>();
  const navigate       = useNavigate();
  const dispatch       = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  const [newMessage,           setNewMessage]           = useState('');
  const [showStatusDropdown,   setShowStatusDropdown]   = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showMoreMenu,         setShowMoreMenu]         = useState(false);
  const [attachments,          setAttachments]          = useState<File[]>([]);
  const [isSubmitting,         setIsSubmitting]         = useState(false);
  const [replyTo,              setReplyTo]              = useState<{ id: string; author: string } | null>(null);

  const ticket      = useAppSelector(selectCurrentTicket);
  const messages    = useAppSelector(selectTicketMessages);
  const isLoading   = useAppSelector(selectTicketsLoading);
  const currentUser = useAppSelector(selectCurrentUser);
  const tickets     = useAppSelector(s => currentUser?.id ? selectUserTickets(s, currentUser.id) : []);

  const assignedAgent = useAppSelector(state => ticket?.assigned_to ? selectUserById(state, ticket.assigned_to) : null);
  const customer = useAppSelector(state => ticket?.customer_id ? selectUserById(state, ticket.customer_id) : null);

  useEffect(() => {
    if (ticket?.customer_id && !customer) {
      dispatch(getUserById(ticket.customer_id));
      dispatch(fetchUserTickets(ticket.customer_id));
    }
  }, [dispatch, ticket?.customer_id, customer]);

  useEffect(() => {
    if (ticket?.assigned_to && !assignedAgent) {
      dispatch(getUserById(ticket.assigned_to));
    }
  }, [dispatch, ticket?.assigned_to, assignedAgent]);

  useEffect(() => {
    if (id) {
      dispatch(fetchTicketById(id));
      dispatch(fetchMessages(id));
    }
    return () => { dispatch(clearCurrentTicket()); };
  }, [dispatch, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Parse attachments from ticket
  const ticketAttachments = parseAttachments(ticket?.attachments);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    
    const map: Record<string, 'open' | 'in-progress' | 'resolved' | 'closed'> = { 
      'Open': 'open', 
      'In Progress': 'in-progress', 
      'Resolved': 'resolved', 
      'Closed': 'closed' 
    };
    
    const mappedStatus = map[newStatus];
    
    if (!mappedStatus) {
      toast.error('Invalid status');
      return;
    }
    
    try {
      await dispatch(updateTicket({ ticketId: id, updates: { status: mappedStatus } })).unwrap();
      toast.success(`Status → ${newStatus}`);
    } catch { 
      toast.error('Failed to update status'); 
    }
    setShowStatusDropdown(false);
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!id) return;
    
    const validPriorities: ('low' | 'medium' | 'high' | 'urgent')[] = ['low', 'medium', 'high', 'urgent'];
    const mappedPriority = newPriority.toLowerCase() as 'low' | 'medium' | 'high' | 'urgent';
    
    if (!validPriorities.includes(mappedPriority)) {
      toast.error('Invalid priority');
      return;
    }
    
    try {
      await dispatch(updateTicket({ ticketId: id, updates: { priority: mappedPriority } })).unwrap();
      toast.success(`Priority → ${newPriority}`);
    } catch { 
      toast.error('Failed to update priority'); 
    }
    setShowPriorityDropdown(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!id || !currentUser) return;
    setIsSubmitting(true);
    try {
      const text = replyTo ? `@${replyTo.author} ${newMessage}` : newMessage;
      await dispatch(addMessage({
        ticketId: id, message: text,
        authorId: currentUser.id, authorName: currentUser.name,
        authorAvatar: currentUser.avatar, isInternal: false,
      })).unwrap();
      setNewMessage(''); setAttachments([]); setReplyTo(null);
    } catch { toast.error('Failed to send message'); }
    finally { setIsSubmitting(false); }
  };

  const handleFileAttach  = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachments(prev => [...prev, ...Array.from(e.target.files || [])]);
  };

  const handleDeleteTicket = async () => {
    if (!id || !window.confirm('Close this ticket? This cannot be undone.')) return;
    try {
      await dispatch(updateTicket({ ticketId: id, updates: { status: 'closed' } })).unwrap();
      toast.success('Ticket closed');
      navigate('/tickets');
    } catch { toast.error('Failed to close ticket'); }
  };

  const handleReplyTo = (author: string, messageId: string) => {
    setReplyTo({ id: messageId, author });
    setNewMessage(`@${author} `);
    textareaRef.current?.focus();
  };

  /* ── loading / not-found ───────────────────────────────────── */
  if (isLoading && !ticket) return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <DashboardNavbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading ticket…</p>
        </div>
      </div>
    </div>
  );

  if (!ticket) return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <DashboardNavbar />
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <AlertCircle size={28} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ticket not found</h2>
        <p className="text-gray-500 mb-8">This ticket doesn't exist or has been removed.</p>
        <Link to="/tickets" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors">
          <ArrowLeft size={16} /> Back to Tickets
        </Link>
      </main>
    </div>
  );

  /* ─── render ───────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/tickets" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors font-medium">
            <ArrowLeft size={15} /> Back to Tickets
          </Link>
          <button onClick={() => window.location.reload()} className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-white transition-all">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">

          {/* ── LEFT COLUMN ─────────────────────────────────── */}
          <div className="space-y-5">

            {/* Ticket Header Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              {/* Title row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="gap-2 flex items-center mb-1">
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">{ticket.subject}</h1>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold text-gray-400 tracking-wider">
                      #{ticket.ticket_number || ticket.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Calendar size={11} /> {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock size={11} /> Updated {formatDate(ticket.updated_at)}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">

                  {/* Status dropdown */}
                  <div className="relative">
                    <button onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowPriorityDropdown(false); setShowMoreMenu(false); }}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
                      Status <ChevronDown size={12} />
                    </button>
                    {showStatusDropdown && (
                      <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20">
                        {['Open','In Progress','Resolved','Closed'].map(s => (
                          <button key={s} onClick={() => handleStatusChange(s)}
                            className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            {STATUS_CONFIG[s.toLowerCase().replace(' ', '-')]?.icon}
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Priority dropdown */}
                  <div className="relative">
                    <button onClick={() => { setShowPriorityDropdown(!showPriorityDropdown); setShowStatusDropdown(false); setShowMoreMenu(false); }}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
                      Priority <ChevronDown size={12} />
                    </button>
                    {showPriorityDropdown && (
                      <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20">
                        {['Low','Medium','High','Urgent'].map(p => (
                          <button key={p} onClick={() => handlePriorityChange(p)}
                            className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_CONFIG[p.toLowerCase()]?.dot}`} />
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* More menu */}
                  <div className="relative">
                    <button onClick={() => { setShowMoreMenu(!showMoreMenu); setShowStatusDropdown(false); setShowPriorityDropdown(false); }}
                      className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
                      <MoreVertical size={15} />
                    </button>
                    {showMoreMenu && (
                      <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20">
                        <button className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Edit size={12} /> Edit Ticket
                        </button>
                        <button className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Star size={12} /> Star Ticket
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                        <button onClick={handleDeleteTicket} className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2">
                          <Trash2 size={12} /> Close Ticket
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-sm text-gray-500 font-medium mb-2">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
              </div>

              {ticket.category && (
                <div className="mt-4 flex items-center gap-1.5">
                  <Tag size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Category: <span className="text-gray-700 font-medium">{ticket.category}</span></span>
                </div>
              )}

              {/* Attachments */}
              <AttachmentsPanel attachments={ticketAttachments} />
            </div>

            {/* ── Conversation ─────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-emerald-600" />
                  <span className="font-bold text-gray-900 text-sm">Conversation</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-500 rounded-full">
                    {messages.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Users size={12} /> Customer & Agent
                </div>
              </div>

              {/* Messages feed */}
              <div className="h-[480px] overflow-y-auto px-6 py-5 space-y-5">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                      <MessageSquare size={22} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isAgent = msg.author_id === currentUser?.id;
                    const isFirstInGroup = index === 0 || messages[index - 1]?.author_id !== msg.author_id;
                    
                    // Safe check for attachments
                    const hasAttachments = msg.attachments && msg.attachments.length > 0;

                    return (
                      <div key={msg.id} className={`flex gap-3 ${isAgent ? 'flex-row-reverse' : ''}`}>

                        {/* Avatar */}
                        {isFirstInGroup ? (
                          <Avatar
                            name={msg.author_name}
                            gradient={isAgent
                              ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
                              : 'bg-gradient-to-br from-emerald-400 to-teal-500'}
                          />
                        ) : (
                          <div className="w-8 flex-shrink-0" />
                        )}

                        <div className={`flex flex-col max-w-[72%] ${isAgent ? 'items-end' : 'items-start'}`}>
                          {/* Meta */}
                          {isFirstInGroup && (
                            <div className={`flex items-center gap-2 mb-1.5 ${isAgent ? 'flex-row-reverse' : ''}`}>
                              <span className="text-xs font-semibold text-gray-800">{msg.author_name}</span>
                              {isAgent && (
                                <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-semibold">Agent</span>
                              )}
                              <span className="text-[11px] text-gray-400">{formatDate(msg.created_at)}</span>
                            </div>
                          )}

                          {/* Bubble */}
                          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            isAgent
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-tr-sm'
                              : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                            {/* Fixed: Safe check for attachments */}
                            {hasAttachments && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {msg.attachments!.map((att: Attachment, i: number) => (
                                  <div key={i} className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg ${isAgent ? 'bg-white/20' : 'bg-white'}`}>
                                    <File size={11} /> {att.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Reply */}
                          <button
                            onClick={() => handleReplyTo(msg.author_name, msg.id)}
                            className={`flex items-center gap-1 text-[11px] text-gray-400 hover:text-emerald-600 mt-1.5 transition-colors ${isAgent ? 'flex-row-reverse' : ''}`}>
                            <Reply size={11} /> Reply
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply indicator */}
              {replyTo && (
                <div className="px-6 py-2.5 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-700">
                    Replying to <span className="font-semibold">@{replyTo.author}</span>
                  </span>
                  <button onClick={() => setReplyTo(null)} className="text-emerald-400 hover:text-emerald-600">
                    <XCircle size={14} />
                  </button>
                </div>
              )}

              {/* Attachment preview */}
              {attachments.length > 0 && (
                <div className="px-6 py-2.5 border-t border-gray-100 flex flex-wrap gap-2">
                  {attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600">
                      <File size={11} />
                      <span className="max-w-[120px] truncate">{file.name}</span>
                      <button type="button" onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                        className="text-gray-400 hover:text-red-500 ml-0.5">
                        <XCircle size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/70">
                <form onSubmit={handleSendMessage}>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                    <textarea
                      ref={textareaRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                      rows={3}
                      className="w-full px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none bg-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }
                      }}
                    />
                    <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
                      <div className="flex items-center gap-0.5">
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Paperclip size={15} />
                        </button>
                        <button type="button" className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <ImageIcon size={15} />
                        </button>
                        <button type="button" className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Mic size={15} />
                        </button>
                        <button type="button" className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Smile size={15} />
                        </button>
                        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileAttach} />
                      </div>
                      <button
                        type="submit"
                        disabled={(!newMessage.trim() && attachments.length === 0) || isSubmitting}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-emerald-200 hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                      >
                        {isSubmitting
                          ? <RefreshCw size={13} className="animate-spin" />
                          : <Send size={13} />}
                        Send
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ────────────────────────────────── */}
          <div className="space-y-4">

            {/* Customer Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Customer</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {customer?.name?.charAt(0) || 'C'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{customer?.name || 'Customer'}</p>
                  <p className="text-xs text-gray-400 truncate">{customer?.email || 'customer@example.com'}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Total Tickets</span>
                  <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">{tickets.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Member Since</span>
                  <span className="text-xs font-semibold text-gray-700">Jan 2024</span>
                </div>
              </div>
              <button className="w-full mt-4 px-3 py-2 text-xs font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                View Profile
              </button>
            </div>

            {/* Assigned Agent */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Assigned Agent</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {ticket.assigned_to?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{assignedAgent?.name || 'Unassigned'}</p>
                    <p className="text-xs text-gray-400">{assignedAgent?.name ? 'Support Agent' : 'No agent assigned'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Details</p>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-400">Category</span>
                  <span className="text-xs font-semibold text-gray-700 capitalize">{ticket.category || 'General'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-400">Created</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-400">Last Updated</span>
                  <span className="text-xs font-semibold text-gray-700">{formatDate(ticket.updated_at)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">SLA</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={11} /> 2 hours
                  </span>
                </div>
              </div>
            </div>

            {/* Suggested Articles */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Suggested Articles</p>
              <div className="space-y-1">
                <a href="#" className="flex items-start gap-2 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                  <File size={12} className="text-gray-300 group-hover:text-emerald-500 mt-0.5 flex-shrink-0 transition-colors" />
                  <span className="text-xs text-gray-600 group-hover:text-emerald-600 transition-colors leading-relaxed">How to update payment method</span>
                </a>
                <a href="#" className="flex items-start gap-2 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                  <File size={12} className="text-gray-300 group-hover:text-emerald-500 mt-0.5 flex-shrink-0 transition-colors" />
                  <span className="text-xs text-gray-600 group-hover:text-emerald-600 transition-colors leading-relaxed">Understanding billing cycles</span>
                </a>
                <a href="#" className="flex items-start gap-2 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                  <File size={12} className="text-gray-300 group-hover:text-emerald-500 mt-0.5 flex-shrink-0 transition-colors" />
                  <span className="text-xs text-gray-600 group-hover:text-emerald-600 transition-colors leading-relaxed">Payment troubleshooting guide</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetailPage;