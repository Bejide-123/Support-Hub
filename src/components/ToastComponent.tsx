// components/ToastComponents.tsx
import { CheckCircle, XCircle, AlertCircle, Info, Loader2, X } from 'lucide-react';

interface ToastContentProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

export const SuccessToast = ({ title, message, onClose }: ToastContentProps) => (
  <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 min-w-[320px] max-w-md animate-in slide-in-from-right-5 duration-300">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle size={18} className="text-emerald-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        {message && <p className="text-xs text-gray-500 mt-0.5">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
    <div className="mt-3 h-0.5 w-full bg-emerald-100 rounded-full overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-[shrink_4s_linear_forwards]" />
    </div>
  </div>
);

export const ErrorToast = ({ title, message, onClose }: ToastContentProps) => (
  <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 min-w-[320px] max-w-md animate-in slide-in-from-right-5 duration-300">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle size={18} className="text-red-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        {message && <p className="text-xs text-gray-500 mt-0.5">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
    <div className="mt-3 h-0.5 w-full bg-red-100 rounded-full overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-red-500 to-rose-500 animate-[shrink_4s_linear_forwards]" />
    </div>
  </div>
);

export const WarningToast = ({ title, message, onClose }: ToastContentProps) => (
  <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 min-w-[320px] max-w-md animate-in slide-in-from-right-5 duration-300">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <AlertCircle size={18} className="text-amber-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        {message && <p className="text-xs text-gray-500 mt-0.5">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
    <div className="mt-3 h-0.5 w-full bg-amber-100 rounded-full overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-amber-500 to-orange-500 animate-[shrink_4s_linear_forwards]" />
    </div>
  </div>
);

export const InfoToast = ({ title, message, onClose }: ToastContentProps) => (
  <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 min-w-[320px] max-w-md animate-in slide-in-from-right-5 duration-300">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Info size={18} className="text-blue-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        {message && <p className="text-xs text-gray-500 mt-0.5">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
    <div className="mt-3 h-0.5 w-full bg-blue-100 rounded-full overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-[shrink_4s_linear_forwards]" />
    </div>
  </div>
);

export const LoadingToast = ({ title, message }: ToastContentProps) => (
  <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 min-w-[320px] max-w-md">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <Loader2 size={18} className="text-purple-600 animate-spin" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        {message && <p className="text-xs text-gray-500 mt-0.5">{message}</p>}
      </div>
    </div>
    <div className="mt-3 h-0.5 w-full bg-purple-100 rounded-full overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse" />
    </div>
  </div>
);