import React, { useEffect, useState } from 'react';

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000); // Start exit animation after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 500); // Wait for exit animation to complete before closing

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  let bgColor;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      break;
    case 'error':
      bgColor = 'bg-red-500';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      break;
    case 'info':
      bgColor = 'bg-blue-500';
      break;
    default:
      bgColor = 'bg-gray-500';
      break;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${bgColor} ${visible ? 'animate-toast-in' : 'animate-toast-out'}`}
      style={{ minWidth: '200px' }}
    >
      {message}
    </div>
  );
};

export default Toast;