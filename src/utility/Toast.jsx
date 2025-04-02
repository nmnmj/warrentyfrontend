// src/components/Toast.js
import React from 'react';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToast = (type, message) => {
  const toastOptions = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };

  // Show different toast types based on input
  if (type === 'info') {
    toast.info(message, toastOptions);
  } else if (type === 'error') {
    toast.error(message, toastOptions);
  }  else if (type === 'success') {
    toast.success(message, toastOptions);
  }
};

const Toast = () => {
  return null; // This component is just to call the toast function
};

export { Toast, showToast };
