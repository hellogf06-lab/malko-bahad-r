import { useState } from "react";
import { format as formatDate, setMonth, setYear } from "date-fns";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Gavel, Wallet, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function CalendarView({ files = [], expenses = [], kurumHakedisleri = [], kurumMasraflari = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 1. Ayın Günlerini Hesapla
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Pazartesi başlasın
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // 2. Verileri Birleştir (Duruşmalar + Giderler + Kurum Hakedişi + Kurum Masrafı)
  const getEventsForDay = (date) => {
    const dayEvents = [];

    // A) Duruşmalar (Mavi)
    files.forEach(file => {
      if (file.durusma_tarihi) {
        try {
          const fileDate = parseISO(file.durusma_tarihi);
          if (isSameDay(fileDate, date)) {
            dayEvents.push({
              id: `file-${file.id}`,
              title: `Duruşma: ${file.dosya_no}`,
              desc: `Müvekkil: ${file.muvekkil_adi}\nMahkeme: ${file.mahkeme || 'Yok'}\nAçıklama: ${file.aciklama || '-'}\nNot: ${file.notes || '-'}`,
              type: 'durusma',
              extra: file
            });
          }
        } catch (e) {}
      }
    });

    // B) Giderler (Kırmızı)
    expenses.forEach(expense => {
      if (expense.tarih) {
        try {
          const expDate = parseISO(expense.tarih);
          if (isSameDay(expDate, date)) {
            dayEvents.push({
              id: `expense-${expense.id}`,
              title: `Gider: ${expense.kategori}`,
              desc: `Açıklama: ${expense.aciklama || '-'}\nTutar: ${expense.tutar}₺\nNot: ${expense.notes || '-'}\nÖdeme Durumu: ${expense.odendi ? 'Ödendi' : 'Bekliyor'}`,
              type: 'odeme',
              extra: expense
            });
          }
        } catch (e) {}
      }
    });

    // C) Kurum Hakedişleri (Yeşil)
    kurumHakedisleri.forEach(hakedis => {
      if (hakedis.hakedis_tarihi) {
        try {
          const hakTarih = parseISO(hakedis.hakedis_tarihi);
          if (isSameDay(hakTarih, date)) {
            dayEvents.push({
              id: `kurum-hakedis-${hakedis.id}`,
              title: `Kurum Hakedişi: ${hakedis.kurum_adi}`,
              desc: `Dosya No: ${hakedis.dosya_no || '-'}\nTutar: ${hakedis.net_hakedis || hakedis.tahsil_tutar}₺\nVekalet Oranı: %${hakedis.vekalet_orani || '-'}\nNot: ${hakedis.notes || '-'}\nÖdeme Durumu: ${hakedis.odendi ? 'Tahsil Edildi' : 'Bekliyor'}`,
              type: 'kurum_hakedis',
              extra: hakedis
            });
          }
        } catch (e) {}
      }
    });

    // D) Kurum Masrafları (Turuncu)
    kurumMasraflari.forEach(masraf => {
      if (masraf.tarih) {
        try {
          const masrafTarih = parseISO(masraf.tarih);
          if (isSameDay(masrafTarih, date)) {
            dayEvents.push({
              id: `kurum-masraf-${masraf.id}`,
              title: `Kurum Masrafı: ${masraf.masraf_turu}`,
              desc: `Açıklama: ${masraf.aciklama || '-'}\nTutar: ${masraf.tutar}₺\nNot: ${masraf.notes || '-'}\nÖdeme Durumu: ${masraf.odendi ? 'Ödendi' : 'Tahsil Edilmedi'}`,
              type: 'kurum_masraf',
              extra: masraf
            });
          }
        } catch (e) {}
      }
    });

    return dayEvents;
  };

  return (
    <Card className="h-full border-slate-200 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon size={20} className="text-blue-600" />
          Ofis Ajandası
        </CardTitle>
        
        {/* Ay Değiştirme Butonları */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="h-8 w-8">
            <ChevronLeft size={18} />
          </Button>
          <span className="text-sm font-semibold w-32 text-center select-none capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: tr })}
          </span>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="h-8 w-8">
            <ChevronRight size={18} />
          </Button>
          {/* Ay/Yıl seçici */}
          <select
            className="ml-2 px-2 py-1 border rounded text-sm bg-white"
            value={currentMonth.getMonth()}
            onChange={e => setCurrentMonth(setMonth(currentMonth, Number(e.target.value)))}
          >
            {[...Array(12).keys()].map(m => (
              <option key={m} value={m}>{formatDate(new Date(2000, m, 1), "MMMM", { locale: tr })}</option>
            ))}
          </select>
          <select
            className="ml-2 px-2 py-1 border rounded text-sm bg-white"
            value={currentMonth.getFullYear()}
            onChange={e => setCurrentMonth(setYear(currentMonth, Number(e.target.value)))}
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Gün Başlıkları */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map(day => (
            <div key={day} className="py-2 text-center text-xs font-bold text-slate-600 uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Takvim Izgarası */}
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {calendarDays.map((day) => {
            const events = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={day.toString()} 
                className={`
                  relative border-b border-r border-slate-100 p-2 transition-all
                  ${!isCurrentMonth ? "bg-slate-50/50 text-slate-400" : "bg-white hover:bg-slate-50"}
                  ${isToday ? "bg-blue-50/40 ring-2 ring-blue-200 ring-inset" : ""}
                `}
              >
                {/* Gün Numarası */}
                <div className={`
                  text-sm font-semibold mb-1 flex items-center justify-between
                  ${isToday ? "text-blue-600" : "text-slate-700"}
                `}>
                  <span>{format(day, "d")}</span>
                  {events.length > 0 && (
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded-full font-bold">
                      {events.length}
                    </span>
                  )}
                </div>

                {/* Olaylar Listesi (Maksimum 3 tane göster) */}
                <div className="space-y-1">
                  {events.slice(0, 2).map((event) => (
                    <HoverCard key={event.id} openDelay={200}>
                      <HoverCardTrigger asChild>
                        <div className={`
                          text-[10px] px-1.5 py-1 rounded truncate cursor-pointer font-medium flex items-center gap-1 transition-all
                          ${event.type === 'durusma'
                            ? "bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 hover:shadow-sm"
                            : event.type === 'kurum_hakedis'
                              ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 hover:shadow-sm"
                              : event.type === 'kurum_masraf'
                                ? "bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200 hover:shadow-sm"
                                : "bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200 hover:shadow-sm"
                          }
                        `}>
                          {event.type === 'durusma' ? <Gavel size={10} /> : event.type === 'kurum_hakedis' ? <Wallet size={10} /> : event.type === 'kurum_masraf' ? <Wallet size={10} /> : <Wallet size={10} />}
                          <span className="truncate">{event.title}</span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-72 z-50 bg-white shadow-xl border-slate-200">
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {event.type === 'durusma' ? <Gavel size={14} className="text-blue-600" /> : event.type === 'kurum_hakedis' ? <Wallet size={14} className="text-green-600" /> : event.type === 'kurum_masraf' ? <Wallet size={14} className="text-orange-600" /> : <Wallet size={14} className="text-rose-600" />}
                            {event.title}
                          </h4>
                          <pre className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{event.desc}</pre>
                          <Badge variant="outline" className="text-[10px] mt-2 bg-slate-50">
                            📅 {format(day, "d MMMM yyyy, EEEE", { locale: tr })}
                          </Badge>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                  
                  {events.length > 2 && (
                    <div className="text-[10px] text-slate-500 font-semibold pl-1 bg-slate-100 rounded px-1.5 py-0.5 inline-block">
                      +{events.length - 2} diğer
                    </div>
                  )}
                </div>

                {/* Bugün İşareti */}
                {isToday && (
                  <div className="absolute bottom-1 right-1 text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                    BUGÜN
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
