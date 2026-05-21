import React, { createContext, useContext, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext({ notify: () => {} });

export const ToastProvider = ({ children }) => {
  const notify = useCallback((message, type = 'info', options = {}) => {
    // Generate a unique toastId based on message content and type to prevent duplicate concurrent toasts
    const toastId = options.toastId || (message + type);

    // Set dynamic dismiss rates based on notification severity
    let autoClose = 2000;
    if (type === 'error') {
      autoClose = 5000;
    } else if (type === 'warning' || type === 'warn') {
      autoClose = 4000;
    }

    const defaultOptions = {
      position: 'top-right',
      autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      rtl: false,
      theme: 'light', // Standardized base theme for CSS override consistency
      toastId,
      ...options
    };

    switch (type) {
      case 'success':
        return toast.success(message, defaultOptions);
      case 'error':
        return toast.error(message, defaultOptions);
      case 'warning':
      case 'warn':
        return toast.warning(message, defaultOptions);
      case 'info':
        return toast.info(message, defaultOptions);
      default:
        return toast(message, defaultOptions);
    }
  }, []);

  // Get theme from document or localStorage
  const getTheme = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  };

  const theme = getTheme();

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <ToastContainer 
        theme={theme}
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);