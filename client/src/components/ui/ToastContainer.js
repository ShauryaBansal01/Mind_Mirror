import React from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast';

const ToastContainer = ({ toasts, onRemove }) => {
  const container = React.useMemo(() => {
    let element = document.getElementById('toast-container');
    if (!element) {
      element = document.createElement('div');
      element.id = 'toast-container';
      element.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(element);
    }
    return element;
  }, []);

  return createPortal(
    <div className="space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>,
    container
  );
};

export default ToastContainer;