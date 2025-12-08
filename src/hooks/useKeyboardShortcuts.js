import { useEffect } from 'react';

/**
 * Keyboard Shortcuts Hook
 * Klavye kısayollarını yönetir
 */
export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
      const modifierKey = ctrlKey || metaKey; // Windows/Linux için Ctrl, Mac için Cmd

      shortcuts.forEach(({ keys, action, description, preventDefault = true }) => {
        const keyMatch = keys.key === key.toLowerCase();
        const ctrlMatch = keys.ctrl === modifierKey;
        const shiftMatch = keys.shift === shiftKey;
        const altMatch = keys.alt === altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

/**
 * Predefined shortcuts config
 */
export const defaultShortcuts = {
  // Navigation
  goToDashboard: { keys: { key: '1', ctrl: true, shift: false, alt: false }, description: 'Dashboard\'a git' },
  goToFiles: { keys: { key: '2', ctrl: true, shift: false, alt: false }, description: 'Dosyalara git' },
  goToInstitutions: { keys: { key: '3', ctrl: true, shift: false, alt: false }, description: 'Kurumlara git' },
  goToExpenses: { keys: { key: '4', ctrl: true, shift: false, alt: false }, description: 'Giderlere git' },
  
  // Actions
  newFile: { keys: { key: 'n', ctrl: true, shift: false, alt: false }, description: 'Yeni dosya' },
  search: { keys: { key: 'f', ctrl: true, shift: false, alt: false }, description: 'Ara' },
  exportPDF: { keys: { key: 'p', ctrl: true, shift: true, alt: false }, description: 'PDF dışa aktar' },
  exportExcel: { keys: { key: 'e', ctrl: true, shift: true, alt: false }, description: 'Excel dışa aktar' },
  
  // UI
  toggleDarkMode: { keys: { key: 'd', ctrl: true, shift: false, alt: false }, description: 'Dark mode' },
  openSettings: { keys: { key: ',', ctrl: true, shift: false, alt: false }, description: 'Ayarlar' },
  openNotifications: { keys: { key: 'b', ctrl: true, shift: false, alt: false }, description: 'Bildirimler' },
  
  // General
  save: { keys: { key: 's', ctrl: true, shift: false, alt: false }, description: 'Kaydet' },
  cancel: { keys: { key: 'escape', ctrl: false, shift: false, alt: false }, description: 'İptal' },
  help: { keys: { key: '/', ctrl: true, shift: false, alt: false }, description: 'Yardım' }
};

/**
 * Format shortcut for display
 */
export const formatShortcut = (shortcut) => {
  const parts = [];
  if (shortcut.keys.ctrl) parts.push('Ctrl');
  if (shortcut.keys.shift) parts.push('Shift');
  if (shortcut.keys.alt) parts.push('Alt');
  parts.push(shortcut.keys.key.toUpperCase());
  return parts.join(' + ');
};
