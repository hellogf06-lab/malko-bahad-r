import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './ui/button';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Overlay tıklaması ile modalı kapat
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 9999
      }}
      onClick={handleOverlayClick}
    >
      <div
        data-modal-box
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          width: '100%',
          maxWidth: '672px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>{title}</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
          >
            <X size={20} />
          </Button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
