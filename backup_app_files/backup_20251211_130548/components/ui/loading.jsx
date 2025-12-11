import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} animate-spin rounded-full border-gray-300 border-t-blue-600`}
      />
    </div>
  );
};

export const LoadingCard = ({ text = 'Yükleniyor...' }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <LoadingSpinner size="lg" />
    <p className="text-gray-600 text-sm animate-pulse">{text}</p>
  </div>
);

export const LoadingOverlay = ({ text = 'Yükleniyor...' }) => (
  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 shadow-2xl flex flex-col items-center space-y-4">
      <LoadingSpinner size="xl" />
      <p className="text-gray-700 font-medium">{text}</p>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: columns }).map((_, j) => (
          <div key={j} className="h-8 bg-gray-200 rounded flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const EmptyState = ({ 
  icon: Icon, 
  title = 'Veri Bulunamadı', 
  description = 'Henüz eklenmiş bir kayıt yok',
  actionLabel,
  onAction 
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {Icon && (
      <div className="mb-4 p-4 bg-gray-100 rounded-full">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-6 max-w-sm">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export const ErrorAlert = ({ 
  message = 'Bir hata oluştu', 
  onRetry, 
  onDismiss 
}) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-red-800">Hata</h3>
        <p className="text-sm text-red-700 mt-1">{message}</p>
      </div>
      <div className="flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Tekrar Dene
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-sm text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  </div>
);

export const SuccessToast = ({ message = 'Başarılı!' }) => (
  <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up z-50">
    <div className="flex items-center gap-2">
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="font-medium">{message}</span>
    </div>
  </div>
);

export const WarningBanner = ({ message, onClose }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
    <div className="flex items-start gap-3">
      <svg className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <div className="flex-1">
        <p className="text-sm text-yellow-800">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-yellow-600 hover:text-yellow-800">
          ✕
        </button>
      )}
    </div>
  </div>
);
