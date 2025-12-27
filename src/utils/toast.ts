import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification utility
 * A wrapper around sonner toast for consistent notifications across the app
 */

export const toast = {
  /**
   * Success notification (green)
   * Auto-dismisses after 4 seconds
   */
  success: (message: string, options?: string | { description?: string; duration?: number;[key: string]: any }) => {
    const toastOptions = typeof options === 'string' ? { description: options } : options;
    sonnerToast.success(message, {
      duration: 4000,
      ...toastOptions,
    });
  },

  /**
   * Error notification (red)
   * Auto-dismisses after 5 seconds
   */
  error: (message: string, options?: string | { description?: string; duration?: number;[key: string]: any }) => {
    const toastOptions = typeof options === 'string' ? { description: options } : options;
    sonnerToast.error(message, {
      duration: 5000,
      ...toastOptions,
    });
  },

  /**
   * Info notification (blue)
   * Auto-dismisses after 4 seconds
   */
  info: (message: string, options?: string | { description?: string; duration?: number;[key: string]: any }) => {
    const toastOptions = typeof options === 'string' ? { description: options } : options;
    sonnerToast.info(message, {
      duration: 4000,
      ...toastOptions,
    });
  },

  /**
   * Warning notification (yellow)
   * Auto-dismisses after 4 seconds
   */
  warning: (message: string, options?: string | { description?: string; duration?: number;[key: string]: any }) => {
    const toastOptions = typeof options === 'string' ? { description: options } : options;
    sonnerToast.warning(message, {
      duration: 4000,
      ...toastOptions,
    });
  },

  /**
   * Generic notification
   * Auto-dismisses after 4 seconds
   */
  message: (message: string, options?: string | { description?: string; duration?: number;[key: string]: any }) => {
    const toastOptions = typeof options === 'string' ? { description: options } : options;
    sonnerToast(message, {
      duration: 4000,
      ...toastOptions,
    });
  },

  /**
   * Promise-based notification
   * Shows loading, then success or error based on promise result
   */
  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, options);
  },

  /**
   * Loading notification
   * Must be manually dismissed
   */
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};

export default toast;
