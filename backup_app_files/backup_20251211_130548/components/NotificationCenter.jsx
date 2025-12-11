import React, { useState, useMemo } from 'react';
import { Bell, X, Trash2, CheckCircle, AlertCircle, Info, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const NotificationCenter = ({ notifications, onClose, onClear, onMarkAsRead }) => {
  const [filter, setFilter] = useState('all'); // all, success, warning, error, info
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    if (filter !== 'all') {
      filtered = filtered.filter(n => n.type === filter);
    }

    if (showOnlyUnread) {
      filtered = filtered.filter(n => !n.read);
    }

    return filtered;
  }, [notifications, filter, showOnlyUnread]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgClass: 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950',
      borderClass: 'border-emerald-300 dark:border-emerald-700',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      emoji: '✅'
    },
    warning: {
      icon: AlertCircle,
      bgClass: 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950',
      borderClass: 'border-amber-300 dark:border-amber-700',
      iconColor: 'text-amber-600 dark:text-amber-400',
      emoji: '⚠️'
    },
    error: {
      icon: AlertCircle,
      bgClass: 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950',
      borderClass: 'border-red-300 dark:border-red-700',
      iconColor: 'text-red-600 dark:text-red-400',
      emoji: '🚨'
    },
    info: {
      icon: Info,
      bgClass: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950',
      borderClass: 'border-blue-300 dark:border-blue-700',
      iconColor: 'text-blue-600 dark:text-blue-400',
      emoji: 'ℹ️'
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute top-14 right-0 w-[550px] max-h-[700px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 z-50 overflow-hidden flex flex-col backdrop-blur-lg">
      {/* Header */}
      <div className="p-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
              <Bell size={22} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
            Bildirim Merkezi
            {unreadCount > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {unreadCount} Yeni
              </span>
            )}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl transition-all text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'success', 'warning', 'error', 'info'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === type
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {type === 'all' ? '📋 Tümü' :
               type === 'success' ? '✅ Başarılı' :
               type === 'warning' ? '⚠️ Uyarı' :
               type === 'error' ? '🚨 Hata' : 'ℹ️ Bilgi'}
              {type !== 'all' && (
                <span className="ml-1">
                  ({notifications.filter(n => n.type === type).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setShowOnlyUnread(!showOnlyUnread)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              showOnlyUnread
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            {showOnlyUnread ? '👁️ Tümünü Göster' : '📬 Sadece Okunmamış'}
          </button>
          {notifications.length > 0 && (
            <button
              onClick={onClear}
              className="px-3 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
            >
              <Trash2 size={14} />
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={48} className="text-gray-300 dark:text-gray-500" />
            </div>
            <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">
              {showOnlyUnread ? 'Okunmamış bildirim yok' : 'Bildirim bulunmuyor'}
            </p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
              {filter !== 'all' ? 'Bu kategoride bildirim yok' : 'Yeni işlemler burada görünecek'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif, index) => {
            const config = typeConfig[notif.type] || typeConfig.info;
            const Icon = config.icon;

            return (
              <div
                key={index}
                className={`p-4 mb-3 ${config.bgClass} border-2 ${config.borderClass} rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${
                  notif.read ? 'opacity-60' : ''
                }`}
                onClick={() => onMarkAsRead && onMarkAsRead(index)}
              >
                <div className="flex gap-4 items-start">
                  <div className={`p-2 rounded-xl ${config.iconColor} bg-white/50 dark:bg-gray-800/50 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                        {notif.message}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    {notif.priority && (
                      <span className="text-xs text-gray-600 dark:text-gray-400 inline-block bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-3 py-1 rounded-full font-semibold border border-gray-200 dark:border-gray-600 mt-2">
                        🔥 Öncelik: {notif.priority}
                      </span>
                    )}
                    {notif.timestamp && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(notif.timestamp).toLocaleString('tr-TR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Stats */}
      {notifications.length > 0 && (
        <div className="p-4 border-t-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Toplam</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{notifications.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Okunmamış</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{unreadCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Gösterilen</p>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{filteredNotifications.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
