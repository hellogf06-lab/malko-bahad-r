import { useMemo, useState } from "react";
import { usePeriod } from "../contexts/PeriodContext";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { calculateMonthlyData } from "../utils/monthlyAnalysis";
import { formatPara } from "../utils/formatters";

interface MonthlyChartProps {
  dosyalar: any[];
  kurumDosyalari: any[];
  giderler: any[];
  kurumMasraflari: any[];
  takipMasraflari: any[];
}


export function MonthlyChart({ dosyalar, kurumDosyalari, giderler, kurumMasraflari, takipMasraflari }: MonthlyChartProps) {
    // Sadece ödenmemiş kurum masrafları toplamı
    const kurumOdenmemisMasrafToplam = useMemo(() => {
      if (!kurumMasraflari || kurumMasraflari.length === 0) return 0;
      return kurumMasraflari.filter(m => !m.odendi).reduce((sum, m) => sum + (Number(m.tutar) || 0), 0);
    }, [kurumMasraflari]);
  const { period, customRange } = usePeriod();

  // Yardımcı: Tarih aralığına göre filtreleme fonksiyonu
  function isInRange(dateStr: string | Date) {
    const d = new Date(dateStr);
    let start: Date, end: Date;
    const now = new Date();
    if (period === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    } else if (period === 'thisWeek') {
      const day = now.getDay() || 7;
      start = new Date(now);
      start.setDate(now.getDate() - day + 1);
      start.setHours(0,0,0,0);
      end = new Date(now);
      end.setHours(23,59,59,999);
    } else if (period === 'thisMonth') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (period === 'last3Months') {
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (period === 'thisYear') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    } else if (period === 'custom') {
      start = new Date(customRange.start);
      end = new Date(customRange.end);
      end.setHours(23,59,59,999);
    } else {
      return true;
    }
    return d >= start && d <= end;
  }

  // Tüm veri setlerini seçilen periyoda göre filtrele
  const filteredDosyalar = dosyalar.filter(d => isInRange(d.created_at || d.tarih));
  const filteredKurumDosyalari = kurumDosyalari.filter(d => isInRange(d.created_at || d.tarih));
  const filteredGiderler = giderler.filter(d => isInRange(d.created_at || d.tarih));
  const filteredKurumMasraflari = kurumMasraflari.filter(d => isInRange(d.created_at || d.tarih));
  const filteredTakipMasraflari = takipMasraflari.filter(d => isInRange(d.created_at || d.tarih));

  const allData = useMemo(() => {
    return calculateMonthlyData(filteredDosyalar, filteredKurumDosyalari, filteredGiderler, filteredKurumMasraflari, filteredTakipMasraflari);
  }, [filteredDosyalar, filteredKurumDosyalari, filteredGiderler, filteredKurumMasraflari, filteredTakipMasraflari]);

  // X ekseni için dinamik periyot (gün/hafta/ay/yıl)
  // Şimdilik mevcut mantık korunuyor, gerekirse daha dinamik yapılabilir
  const data = allData;

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-4 border-slate-200 shadow-sm border-dashed">
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-slate-400">
           <p>📊 Analiz Grafiği</p>
           <span className="text-sm">Bu dönemde kayıt bulunmamaktadır.</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Kurum Masrafı Kutucuğu */}
      <Card className="md:col-span-1 bg-red-50 border-red-200 shadow-sm flex flex-col items-center justify-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-red-700 font-semibold">Kurum Masrafı</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-red-600">₺{formatPara(kurumOdenmemisMasrafToplam)}</span>
          <span className="text-xs text-red-500 mt-1">Ödenmemiş Kurum Masrafı</span>
        </CardContent>
      </Card>
      {/* Aylık Mali Performans Grafiği */}
      <Card className="md:col-span-3 border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aylık Mali Performans (Gelir vs Gider)</CardTitle>
              <p className="text-sm text-slate-500">Seçili periyot: {period === '1m' ? 'Son 1 Ay' : period === '3m' ? 'Son 3 Ay' : period === '6m' ? 'Son 6 Ay' : period === '12m' ? 'Son 12 Ay' : 'Tüm Dönem'}</p>
            </div>
            <select
              className="border rounded px-2 py-1 text-sm bg-white"
              value={period}
              onChange={e => setPeriod(e.target.value as any)}
            >
              <option value="1m">1 Ay</option>
              <option value="3m">3 Ay</option>
              <option value="6m">6 Ay</option>
              <option value="12m">12 Ay</option>
              <option value="all">Tümü</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="pl-0">
          <div style={{ minHeight: 350, width: '100%' }}>
            <ResponsiveContainer width="100%" height={350} minWidth={300} minHeight={200}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `₺${value / 1000}k`} 
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  formatter={(value: number) => formatPara(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="income" name="Toplam Gelir" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                <Bar dataKey="expense" name="Toplam Gider" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
