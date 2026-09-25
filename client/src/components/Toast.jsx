import React from 'react';
import { useCart } from '../context/CartContext';

const Toast = () => {
  const { toastMessage } = useCart();

  return (
    <div
      className={`toast ${toastMessage ? 'is-visible' : ''}`}
      id="toast"
      role="status"
      aria-live="polite"
    >
      <span className="toast__icon">✓</span>
      <span id="toastMessage">{toastMessage || 'Added to your order'}</span>
    </div>
  );
};

export default Toast;
