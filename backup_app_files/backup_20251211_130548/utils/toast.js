import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message, options = {}) => {
    sonnerToast.success(message, {
      duration: 3000,
      position: 'bottom-right',
      ...options
    });
  },

  error: (message, options = {}) => {
    sonnerToast.error(message, {
      duration: 4000,
      position: 'bottom-right',
      ...options
    });
  },

  info: (message, options = {}) => {
    sonnerToast.info(message, {
      duration: 3000,
      position: 'bottom-right',
      ...options
    });
  },

  warning: (message, options = {}) => {
    sonnerToast.warning(message, {
      duration: 3500,
      position: 'bottom-right',
      ...options
    });
  },

  loading: (message, options = {}) => {
    return sonnerToast.loading(message, {
      position: 'bottom-right',
      ...options
    });
  },

  promise: (promise, messages) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading || 'İşlem yapılıyor...',
      success: messages.success || 'Başarılı!',
      error: messages.error || 'Hata oluştu',
      position: 'bottom-right'
    });
  },

  dismiss: (toastId) => {
    sonnerToast.dismiss(toastId);
  },

  // Özel toast mesajları
  saved: () => {
    sonnerToast.success('✅ Kaydedildi', {
      duration: 2000,
      position: 'bottom-right'
    });
  },

  deleted: () => {
    sonnerToast.success('🗑️ Silindi', {
      duration: 2000,
      position: 'bottom-right'
    });
  },

  updated: () => {
    sonnerToast.success('✏️ Güncellendi', {
      duration: 2000,
      position: 'bottom-right'
    });
  },

  exported: () => {
    sonnerToast.success('📊 Excel dosyası indirildi', {
      duration: 2500,
      position: 'bottom-right'
    });
  }
};
