// components/CustomToast.tsx
import { toast, type ToastOptions } from 'react-hot-toast';
import { 
  SuccessToast, 
  ErrorToast, 
  WarningToast, 
  InfoToast, 
  LoadingToast 
} from './ToastComponent';

// Toast container styles to match your app
export const toastContainerStyle: ToastOptions = {
  position: 'top-right',
  duration: 4000,
  style: {
    background: 'transparent',
    boxShadow: 'none',
    padding: 0,
  },
  className: 'custom-toast-container',
};

// Toast functions
export const showSuccess = (title: string, message?: string, duration?: number) => {
  toast.custom(
    (t) => (
      <SuccessToast
        title={title}
        message={message}
        onClose={() => toast.dismiss(t.id)}
      />
    ),
    { duration: duration || 4000, position: 'top-right' }
  );
};

export const showError = (title: string, message?: string, duration?: number) => {
  toast.custom(
    (t) => (
      <ErrorToast
        title={title}
        message={message}
        onClose={() => toast.dismiss(t.id)}
      />
    ),
    { duration: duration || 4000, position: 'top-right' }
  );
};

export const showWarning = (title: string, message?: string, duration?: number) => {
  toast.custom(
    (t) => (
      <WarningToast
        title={title}
        message={message}
        onClose={() => toast.dismiss(t.id)}
      />
    ),
    { duration: duration || 4000, position: 'top-right' }
  );
};

export const showInfo = (title: string, message?: string, duration?: number) => {
  toast.custom(
    (t) => (
      <InfoToast
        title={title}
        message={message}
        onClose={() => toast.dismiss(t.id)}
      />
    ),
    { duration: duration || 4000, position: 'top-right' }
  );
};

export const showLoading = (title: string, message?: string) => {
  return toast.custom(
    () => <LoadingToast title={title} message={message} />,
    { duration: Infinity, position: 'top-right' }
  );
};

// Promise wrapper
// Promise wrapper - FIXED
export const showPromiseToast = async <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  successMessage?: string
): Promise<T> => {
  const loadingId = showLoading(messages.loading);
  
  try {
    const result = await promise;
    toast.dismiss(loadingId);
    showSuccess(messages.success, successMessage);
    return result;
  } catch (error: unknown) {  
    toast.dismiss(loadingId);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    showError(messages.error, errorMessage);
    throw error;
  }
};