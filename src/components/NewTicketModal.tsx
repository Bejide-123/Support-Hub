// components/NewTicketModal.tsx
import { useState } from 'react';
import { X, Send, Paperclip, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createTicket } from '../features/Tickets/ticketsSlice';
import { uploadMultipleFiles, type UploadedFile } from '../utils/uploadFile';
import toast from 'react-hot-toast';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { value: 'technical', label: 'Technical Issue'      },
  { value: 'billing',   label: 'Billing & Payments'   },
  { value: 'account',   label: 'Account Management'   },
  { value: 'feature',   label: 'Feature Request'      },
  { value: 'other',     label: 'Other'                },
];

const PRIORITIES = [
  { value: 'low',    label: 'Low',    dot: 'bg-emerald-400', text: 'text-emerald-600' },
  { value: 'medium', label: 'Medium', dot: 'bg-amber-400',   text: 'text-amber-600'  },
  { value: 'high',   label: 'High',   dot: 'bg-orange-400',  text: 'text-orange-500' },
  { value: 'urgent', label: 'Urgent', dot: 'bg-red-500',     text: 'text-red-600'    },
];

const NewTicketModal = ({ isOpen, onClose }: NewTicketModalProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.auth);
  const { isLoading } = useAppSelector(s => s.tickets);
  
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'technical',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    description: '',
  });

  const [errors, setErrors] = useState({ subject: '', description: '' });
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Helper to validate file types and sizes
  const isValidFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  };

  const validate = () => {
    const e = { subject: '', description: '' };
    let ok = true;
    if (!formData.subject.trim()) { e.subject = 'Subject is required'; ok = false; }
    if (!formData.description.trim()) { e.description = 'Description is required'; ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user?.id) return;
    
    setUploadingFiles(true);
    let attachments: UploadedFile[] = [];
    
    // Upload files first if any
    if (files.length > 0) {
      const tempTicketId = `temp_${Date.now()}`;
      const uploaded = await uploadMultipleFiles(files, tempTicketId, user.id);
      attachments = uploaded;
      
      if (uploaded.length !== files.length) {
        toast.error(`${files.length - uploaded.length} file(s) failed to upload`);
      }
    }
    
    try {
      const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      await dispatch(createTicket({
        ticketData: {
          subject: formData.subject,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          ticket_number: `TKT-${randomDigits}`,
          attachments: attachments,
        },
        userId: user.id,
      })).unwrap();
      
      toast.success('Ticket created successfully!');
      setFormData({ subject: '', category: 'technical', priority: 'medium', description: '' });
      setFiles([]);
      onClose();
    } catch (err) {
      console.error('Failed to create ticket:', err);
      toast.error('Failed to create ticket');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    Array.from(incoming).forEach(file => {
      if (isValidFile(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} file(s) skipped: Only JPG, PNG, GIF, PDF, TXT up to 10MB`);
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const selectedPriority = PRIORITIES.find(p => p.value === formData.priority)!;
  const isSubmitting = isLoading || uploadingFiles;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

        {/* Coloured top strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Create New Ticket</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the details and we'll get back to you</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5 max-h-[75vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief description of your issue"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-xl text-sm font-medium placeholder-gray-400 outline-none transition-all ${
                errors.subject
                  ? 'border-red-300 focus:ring-2 focus:ring-red-100 bg-red-50'
                  : 'border-gray-200 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400'
              }`}
            />
            {errors.subject && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500 font-semibold">
                <AlertCircle size={11} /> {errors.subject}
              </p>
            )}
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white appearance-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 outline-none transition-all pr-9"
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Priority</label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white appearance-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 outline-none transition-all pr-9"
                >
                  {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {/* priority indicator */}
              <div className={`flex items-center gap-1.5 mt-1.5 ${selectedPriority.text}`}>
                <span className={`w-2 h-2 rounded-full ${selectedPriority.dot}`} />
                <span className="text-xs font-bold">{selectedPriority.label} priority</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <div className={`border rounded-xl overflow-hidden transition-all ${
              errors.description
                ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-100'
                : 'border-gray-200 focus-within:ring-2 focus-within:ring-emerald-300 focus-within:border-emerald-400'
            }`}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Please provide detailed information about your issue — steps to reproduce, error messages, screenshots…"
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none bg-transparent"
              />
              <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50/50">
                <span className="text-[11px] text-gray-400">{formData.description.length} characters</span>
                <span className="text-[11px] text-gray-400">Be as detailed as possible</span>
              </div>
            </div>
            {errors.description && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500 font-semibold">
                <AlertCircle size={11} /> {errors.description}
              </p>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Attachments <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                dragOver
                  ? 'border-emerald-400 bg-emerald-50'
                  : isSubmitting
                  ? 'border-gray-200 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50/50 cursor-pointer'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                multiple
                disabled={isSubmitting}
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
                accept="image/jpeg,image/png,image/gif,application/pdf,text/plain"
              />
              <label htmlFor="file-upload" className={isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  {uploadingFiles ? (
                    <Loader2 size={18} className="text-emerald-500 animate-spin" />
                  ) : (
                    <Paperclip size={18} className="text-gray-400" />
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-600">
                  {dragOver ? 'Drop files here' : uploadingFiles ? 'Uploading files...' : 'Click to upload or drag & drop'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, GIF, PDF, TXT up to 10MB</p>
              </label>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-medium text-gray-600">
                    <Paperclip size={11} />
                    <span className="max-w-[180px] truncate">{f.name}</span>
                    <span className="text-gray-400 text-[10px]">({(f.size / 1024).toFixed(0)} KB)</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      disabled={uploadingFiles}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-0.5 disabled:opacity-50"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-5 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            Fields marked <span className="text-red-400 font-bold">*</span> are required
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-extrabold rounded-xl hover:shadow-lg hover:shadow-emerald-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {uploadingFiles ? 'Uploading files...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Send size={14} />
                  Submit Ticket
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTicketModal;