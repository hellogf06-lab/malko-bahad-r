import React, { useState, useEffect } from 'react';
import { toggleKurumHakedisiPaid } from '../services/supabaseApi';
import { Bell, Calendar, X, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import toast from 'react-hot-toast';

const ReminderSystem = ({ dosyalar, kurumHakedisleri }) => {
  const [reminders, setReminders] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Her dakika kontrol
    return () => clearInterval(interval);
  }, [dosyalar, kurumHakedisleri]);

  const checkReminders = () => {
    const now = new Date();
    const newReminders = [];

    // Dosya teslim tarihleri kontrolü
    dosyalar.forEach(dosya => {
      if (dosya.teslim_tarihi) {
        const teslimDate = new Date(dosya.teslim_tarihi);
        const daysUntil = Math.ceil((teslimDate - now) / (1000 * 60 * 60 * 24));

        if (daysUntil >= 0 && daysUntil <= 7) {
          newReminders.push({
            id: `dosya-${dosya.id}`,
            type: 'deadline',
            severity: daysUntil <= 2 ? 'urgent' : 'warning',
            title: `Teslim Tarihi Yaklaşıyor: ${dosya.dosya_no}`,
            message: `${dosya.muvekkil_adi} - ${daysUntil} gün kaldı`,
            date: dosya.teslim_tarihi,
            daysUntil,
          });
        }
      }
    });

    // Check kurum dosyaları for unpaid items
    if (kurumHakedisleri && kurumHakedisleri.length > 0) {
      kurumHakedisleri.forEach(dosya => {
        const amount = dosya.net_hakedis || dosya.ucret || 0;
        const isPaid = dosya.odendi === true || dosya.odenmeDurumu === 'Ödendi';
        
        if (!isPaid && amount > 0) {
          newReminders.push({
            id: `kurum-${dosya.id}`,
            type: 'payment',
            severity: 'info',
            title: `Ödenmemiş Hakediş: ${dosya.kurum_adi || 'Kurum'}`,
            message: `${dosya.dosya_no || 'Dosya'} - ${formatPara(amount)}`,
            amount: amount,
          });
        }
      });
    }

    setReminders(newReminders);

    // Yeni acil hatırlatıcılar için bildirim
    const urgent = newReminders.filter(r => r.severity === 'urgent' && !isReminderShown(r.id));
    urgent.forEach(reminder => {
      toast.error(reminder.title, {
        icon: '⚠️',
        duration: 5000,
      });
      markReminderShown(reminder.id);
    });
  };

  const isReminderShown = (id) => {
    const shown = JSON.parse(localStorage.getItem('shown_reminders') || '[]');
    return shown.includes(id);
  };

  const markReminderShown = (id) => {
    const shown = JSON.parse(localStorage.getItem('shown_reminders') || '[]');
    shown.push(id);
    localStorage.setItem('shown_reminders', JSON.stringify(shown));
  };

  const dismissReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    markReminderShown(id);
  };

  // Kurum hakedişi için ödendi güncelleme
  const handleMarkPaid = async (reminder) => {
    if (!reminder.id.startsWith('kurum-')) return;
    const kurumId = parseInt(reminder.id.replace('kurum-', ''));
    try {
      await toggleKurumHakedisiPaid(kurumId, true);
      toast.success('Hakediş ödendi olarak işaretlendi!');
      dismissReminder(reminder.id);
    } catch (err) {
      toast.error('Güncelleme başarısız: ' + (err.message || err));
    }
  };

  const formatPara = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(value || 0);
  };

  const urgentCount = reminders.filter(r => r.severity === 'urgent').length;
  const warningCount = reminders.filter(r => r.severity === 'warning').length;

  return (
    <>
      {/* Floating Badge */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-40 animate-pulse"
      >
        <Bell size={24} />
        {reminders.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
            {reminders.length}
          </span>
        )}
      </button>

      {/* Reminder Panel */}
      {showPanel && (
        <div className="fixed bottom-24 right-6 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl z-40 overflow-hidden border-2 border-gray-200">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell size={20} />
                <h3 className="font-bold text-lg">Hatırlatıcılar</h3>
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-3 mt-2 text-sm">
              {urgentCount > 0 && (
                <div className="flex items-center gap-1 bg-red-600/50 px-2 py-1 rounded">
                  <AlertTriangle size={14} />
                  <span>{urgentCount} Acil</span>
                </div>
              )}
              {warningCount > 0 && (
                <div className="flex items-center gap-1 bg-yellow-500/50 px-2 py-1 rounded">
                  <Clock size={14} />
                  <span>{warningCount} Uyarı</span>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[500px] p-4 space-y-3">
            {reminders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle size={48} className="mx-auto mb-2 text-green-500" />
                <p className="font-semibold">Tüm hatırlatıcılar tamamlandı!</p>
                <p className="text-sm">Yeni görev yok</p>
              </div>
            ) : (
              reminders.map(reminder => (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    reminder.severity === 'urgent'
                      ? 'bg-red-50 border-red-500'
                      : reminder.severity === 'warning'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      {reminder.type === 'deadline' ? (
                        <Calendar size={16} className="mt-1 flex-shrink-0" />
                      ) : (
                        <Bell size={16} className="mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900">
                          {reminder.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {reminder.message}
                        </p>
                        {reminder.daysUntil !== undefined && (
                          <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold">
                            <Clock size={12} />
                            <span
                              className={
                                reminder.daysUntil <= 2
                                  ? 'text-red-600'
                                  : 'text-yellow-600'
                              }
                            >
                              {reminder.daysUntil === 0
                                ? 'BUGÜN'
                                : reminder.daysUntil === 1
                                ? 'YARIN'
                                : `${reminder.daysUntil} GÜN KALDI`}
                            </span>
                          </div>
                        )}
                        {/* Kurum hakedişi için ödendi butonu */}
                        {reminder.id.startsWith('kurum-') && (
                          <Button
                            size="sm"
                            variant="success"
                            className="mt-2"
                            onClick={() => handleMarkPaid(reminder)}
                          >
                            Ödendi olarak işaretle
                          </Button>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => dismissReminder(reminder.id)}
                      className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReminderSystem;
