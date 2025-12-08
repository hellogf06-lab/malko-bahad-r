import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bell, Calendar, Clock, AlertCircle } from 'lucide-react';
import { format, differenceInDays, isPast, isToday, isTomorrow } from 'date-fns';
import { tr } from 'date-fns/locale';

export const HearingReminders = ({ dosyalar = [] }) => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    // Duruşma tarihi olan dosyaları filtrele ve sırala
    const hearingsWithDates = dosyalar
      .filter(d => d.durusma_tarihi)
      .map(d => ({
        ...d,
        hearingDate: new Date(d.durusma_tarihi)
      }))
      .filter(d => !isPast(d.hearingDate) || isToday(d.hearingDate))
      .sort((a, b) => a.hearingDate - b.hearingDate)
      .slice(0, 10); // İlk 10 duruşma

    setReminders(hearingsWithDates);
  }, [dosyalar]);

  const getReminderStatus = (date) => {
    if (isToday(date)) {
      return { label: 'BUGÜN', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-300' };
    }
    if (isTomorrow(date)) {
      return { label: 'YARIN', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-700', borderColor: 'border-orange-300' };
    }
    const daysLeft = differenceInDays(date, new Date());
    if (daysLeft <= 7) {
      return { label: `${daysLeft} GÜN`, color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', borderColor: 'border-yellow-300' };
    }
    return { label: `${daysLeft} GÜN`, color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-300' };
  };

  if (reminders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} className="text-gray-400" />
            Duruşma Hatırlatıcıları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Yaklaşan duruşma yok</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell size={20} className="text-orange-500" />
          Duruşma Hatırlatıcıları
          <span className="ml-auto text-sm font-normal text-gray-500">
            {reminders.length} duruşma
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reminders.map((reminder) => {
            const status = getReminderStatus(reminder.hearingDate);
            
            return (
              <div
                key={reminder.id}
                className={`p-4 rounded-lg border ${status.bgColor} ${status.borderColor} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${status.bgColor} ${status.textColor} border ${status.borderColor}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(reminder.hearingDate, 'EEEE, d MMMM yyyy', { locale: tr })}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {reminder.dosya_no} - {reminder.muvekkil_adi}
                    </h4>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>{reminder.mahkeme || 'Mahkeme bilgisi yok'}</span>
                    </div>
                    
                    {reminder.karsi_taraf && (
                      <p className="text-xs text-gray-500 mt-1">
                        Karşı taraf: {reminder.karsi_taraf}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <AlertCircle size={20} className={status.textColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Bildirim bildirimi için hook
export const useHearingNotifications = (dosyalar) => {
  useEffect(() => {
    // Bugün duruşma olanları kontrol et
    const todayHearings = dosyalar.filter(d => {
      if (!d.durusma_tarihi) return false;
      return isToday(new Date(d.durusma_tarihi));
    });

    if (todayHearings.length > 0 && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          todayHearings.forEach(d => {
            new Notification('Bugün Duruşma Var! ⚖️', {
              body: `${d.dosya_no} - ${d.muvekkil_adi}\n${d.mahkeme}`,
              icon: '/favicon.ico',
              tag: d.id
            });
          });
        }
      });
    }
  }, [dosyalar]);
};
