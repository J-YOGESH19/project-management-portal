import { useEffect } from "react";
import "./toast.css";

const ICONS = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
};

const Toast = ({ type = "success", message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`pmp-toast pmp-toast-${type}`} role="status">
      <span className="pmp-toast-icon">{ICONS[type]}</span>
      <span className="pmp-toast-msg">{message}</span>
      <button className="pmp-toast-close" onClick={onClose} aria-label="Dismiss">×</button>
    </div>
  );
};

export default Toast;