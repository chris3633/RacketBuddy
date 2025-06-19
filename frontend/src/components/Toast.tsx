import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`px-4 py-2 rounded-md shadow-lg ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}
      >
        {message}
      </div>
    </div>
  );
}; 