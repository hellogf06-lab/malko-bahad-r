import { useState, useEffect } from 'react';

/**
 * Audit Log Hook
 * Tüm işlemleri kaydet ve takip et
 */
export const useAuditLog = () => {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('auditLogs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('auditLogs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (action, details) => {
    const log = {
      id: Date.now(),
      action,
      details,
      timestamp: new Date().toISOString(),
      user: localStorage.getItem('currentUser') || 'Sistem'
    };

    setLogs(prev => [log, ...prev].slice(0, 1000)); // Son 1000 kaydı tut
  };

  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem('auditLogs');
  };

  const filterLogs = (filters) => {
    let filtered = logs;

    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filters.dateTo));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchLower) ||
        JSON.stringify(log.details).toLowerCase().includes(searchLower) ||
        log.user.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const getRecentLogs = (limit = 50) => {
    return logs.slice(0, limit);
  };

  return {
    logs,
    addLog,
    clearLogs,
    filterLogs,
    getRecentLogs
  };
};

/**
 * Audit Log Actions
 */
export const AUDIT_ACTIONS = {
  // Dosya işlemleri
  FILE_CREATED: 'Dosya Oluşturuldu',
  FILE_UPDATED: 'Dosya Güncellendi',
  FILE_DELETED: 'Dosya Silindi',
  
  // Kurum işlemleri
  INSTITUTION_CREATED: 'Kurum Oluşturuldu',
  INSTITUTION_UPDATED: 'Kurum Güncellendi',
  INSTITUTION_DELETED: 'Kurum Silindi',
  
  // Masraf işlemleri
  EXPENSE_CREATED: 'Masraf Oluşturuldu',
  EXPENSE_UPDATED: 'Masraf Güncellendi',
  EXPENSE_DELETED: 'Masraf Silindi',
  EXPENSE_PAID: 'Masraf Ödendi',
  
  // Gider işlemleri
  COST_CREATED: 'Gider Oluşturuldu',
  COST_UPDATED: 'Gider Güncellendi',
  COST_DELETED: 'Gider Silindi',
  
  // Sistem işlemleri
  SETTINGS_UPDATED: 'Ayarlar Güncellendi',
  PDF_EXPORTED: 'PDF Dışa Aktarıldı',
  EXCEL_EXPORTED: 'Excel Dışa Aktarıldı',
  LOGIN: 'Giriş Yapıldı',
  LOGOUT: 'Çıkış Yapıldı'
};
