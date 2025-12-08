import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export const Drawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'default' // 'sm' | 'default' | 'lg' | 'xl' | 'full'
}) => {
  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Arka planın kaymasını engelle
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  };

  const drawerContent = (
    <>
      {/* Overlay - Karartma efekti */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer Panel - Sağdan açılır */}
      <div 
        className={`fixed right-0 top-0 bottom-0 ${sizeClasses[size]} w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/60 transition-colors text-gray-600 hover:text-gray-900"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Kaydırılabilir */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Footer (opsiyonel) */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(drawerContent, document.body);
};

// Detail Field Component - Detay alanları için
export const DetailField = ({ label, value, icon: Icon }) => (
  <div className="py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center gap-2 mb-1">
      {Icon && <Icon size={14} className="text-gray-400" />}
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
    <div className="text-base text-gray-900 font-medium pl-5">
      {value || <span className="text-gray-400 italic">-</span>}
    </div>
  </div>
);

// Badge Component - Durum göstergesi
export const DrawerBadge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-300',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    warning: 'bg-orange-100 text-orange-800 border-orange-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Drawer;
