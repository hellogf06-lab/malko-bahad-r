import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Alert = ({ type, message, onClose }) => {
  if (!message) return null;
  
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle
    }
  };

  const config = styles[type] || styles.success;
  const Icon = config.icon;

  return (
    <div className={`fixed top-4 right-4 ${config.bg} ${config.text} border ${config.border} rounded-lg shadow-lg z-50 flex items-center gap-3 p-4 min-w-[300px] max-w-md animate-in slide-in-from-top-2 fade-in duration-300`}>
      <Icon size={20} className="flex-shrink-0"/>
      <span className="font-medium flex-1">{message}</span>
      <button 
        onClick={onClose} 
        className="flex-shrink-0 hover:bg-black/5 rounded p-1 transition-colors"
      >
        <X size={16}/>
      </button>
    </div>
  );
};

export default Alert;
