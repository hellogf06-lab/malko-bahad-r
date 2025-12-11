import React, { useState } from 'react';
import { History, X, Trash2, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AUDIT_ACTIONS } from '../hooks/useAuditLog';

const AuditLogViewer = ({ isOpen, onClose, logs, onClear, onFilter }) => {
  const [filters, setFilters] = useState({
    action: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  if (!isOpen) return null;

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilter) onFilter(newFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters = { action: '', dateFrom: '', dateTo: '', search: '' };
    setFilters(emptyFilters);
    if (onFilter) onFilter(emptyFilters);
  };

  const exportLogs = () => {
    const csv = [
      ['Tarih', 'Saat', 'İşlem', 'Kullanıcı', 'Detaylar'],
      ...logs.map(log => [
        new Date(log.timestamp).toLocaleDateString('tr-TR'),
        new Date(log.timestamp).toLocaleTimeString('tr-TR'),
        log.action,
        log.user,
        JSON.stringify(log.details)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `islem-gecmisi-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getActionColor = (action) => {
    if (action.includes('Oluşturuldu')) return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700';
    if (action.includes('Güncellendi')) return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700';
    if (action.includes('Silindi')) return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700';
    if (action.includes('Dışa Aktarıldı')) return 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700';
    return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
  };

  const getActionIcon = (action) => {
    if (action.includes('Oluşturuldu')) return '✨';
    if (action.includes('Güncellendi')) return '✏️';
    if (action.includes('Silindi')) return '🗑️';
    if (action.includes('Ödendi')) return '💰';
    if (action.includes('Dışa Aktarıldı')) return '📥';
    if (action.includes('Giriş')) return '🔓';
    if (action.includes('Çıkış')) return '🔒';
    return '📋';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 shadow-2xl flex flex-col">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-b-2 border-indigo-200 dark:border-indigo-800 flex-shrink-0">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <History size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-extrabold text-2xl">
                İşlem Geçmişi
              </span>
              <span className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                {logs.length} Kayıt
              </span>
            </CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl transition-all text-gray-600 dark:text-gray-400 hover:text-red-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className="bg-white dark:bg-gray-700"
            >
              <Filter size={16} className="mr-2" />
              Filtrele
            </Button>
            <Button
              onClick={exportLogs}
              variant="outline"
              size="sm"
              className="bg-white dark:bg-gray-700"
            >
              <Download size={16} className="mr-2" />
              CSV İndir
            </Button>
            <Button
              onClick={onClear}
              variant="outline"
              size="sm"
              className="bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
            >
              <Trash2 size={16} className="mr-2" />
              Geçmişi Temizle
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Ara..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg text-sm"
                />
                <select
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg text-sm"
                >
                  <option value="">Tüm İşlemler</option>
                  {Object.values(AUDIT_ACTIONS).map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg text-sm"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg text-sm"
                />
              </div>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Filtreleri Temizle
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-6">
          {logs.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <History size={48} className="text-gray-300 dark:text-gray-500" />
              </div>
              <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">İşlem kaydı bulunmuyor</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getActionColor(log.action)}`}>
                      <span className="text-2xl">{getActionIcon(log.action)}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{log.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {JSON.stringify(log.details).substring(0, 100)}...
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getActionColor(log.action)}`}>
                        {log.user}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      📅 {new Date(log.timestamp).toLocaleDateString('tr-TR')} ⏰ {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogViewer;
