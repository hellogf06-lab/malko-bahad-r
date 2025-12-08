import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';

const Calendar = ({ events = [], onDateClick, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentDate]);

  const firstDayOfMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    // Pazar = 0, ama Pazartesi başlatmak için 0 -> 6 olmalı
    return firstDay === 0 ? 6 : firstDay - 1;
  }, [currentDate]);

  const monthName = currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const renderCalendar = () => {
    const days = [];
    const totalSlots = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalSlots; i++) {
      const day = i - firstDayOfMonth + 1;
      const isCurrentMonth = day > 0 && day <= daysInMonth;
      const isToday = isCurrentMonth && 
        day === new Date().getDate() && 
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();
      
      const dayEvents = isCurrentMonth ? getEventsForDate(day) : [];
      const hasEvents = dayEvents.length > 0;

      days.push(
        <div
          key={i}
          onClick={() => isCurrentMonth && onDateClick && onDateClick(day, currentDate.getMonth(), currentDate.getFullYear())}
          className={`
            min-h-[80px] p-2 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all
            ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800 cursor-default' : 'hover:bg-blue-50 dark:hover:bg-blue-900'}
            ${isToday ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' : ''}
          `}
        >
          {isCurrentMonth && (
            <>
              <div className={`text-sm font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {day}
              </div>
              {hasEvents && (
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 2).map((event, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick && onEventClick(event);
                      }}
                      className={`text-xs p-1 rounded truncate cursor-pointer ${
                        event.type === 'deadline' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' :
                        event.type === 'payment' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      }`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{dayEvents.length - 2} daha
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <CalendarIcon size={24} className="text-blue-600" />
          {monthName}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentDate(new Date())}
          >
            Bugün
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-4 justify-center flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900 border border-red-300"></div>
          <span className="text-gray-600 dark:text-gray-400">Teslim Tarihi</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900 border border-green-300"></div>
          <span className="text-gray-600 dark:text-gray-400">Ödeme</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900 border border-blue-300"></div>
          <span className="text-gray-600 dark:text-gray-400">Diğer</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
