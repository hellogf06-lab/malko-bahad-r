
import { format, isValid, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

export const calculateMonthlyData = (
  dosyalar: any[] = [], 
  kurumDosyalari: any[] = [], 
  giderler: any[] = [], 
  kurumMasraflari: any[] = [], 
  takipMasraflari: any[] = []
) => {
  console.log("Hesaplama Başladı - Gelen Veri Sayıları:", {
    dosyalar: dosyalar.length,
    kurumDosyalar: kurumDosyalari.length,
    giderler: giderler.length
  });

  const monthlyStats: Record<string, { name: string; income: number; expense: number; profit: number; orderDate: Date }> = {};

  const processItem = (dateInput: string | null, amount: any, type: 'income' | 'expense', source: string) => {
    if (!dateInput || !amount) return;
    let date: Date;
    try {
      date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      if (!isValid(date)) {
        date = parseISO(dateInput as string);
      }
      if (!isValid(date)) {
        console.warn(`Geçersiz Tarih Atlandı (${source}):`, dateInput);
        return;
      }
    } catch (e) {
      return;
    }
    const key = format(date, "MMMM yyyy", { locale: tr });
    if (!monthlyStats[key]) {
      monthlyStats[key] = {
        name: key,
        income: 0,
        expense: 0,
        profit: 0,
        orderDate: date
      };
    }
    const val = Number(amount) || 0;
    if (type === 'income') monthlyStats[key].income += val;
    else monthlyStats[key].expense += val;
    monthlyStats[key].profit = monthlyStats[key].income - monthlyStats[key].expense;
  };

  dosyalar.forEach(d => processItem(d.created_at, d.tahsil_edilen, 'income', 'Dosya'));
  kurumDosyalari.forEach(k => {
    const tarih = k.odeme_tarihi || k.created_at;
    if(k.odendi) processItem(tarih, k.net_hakedis, 'income', 'Kurum');
  });
  giderler.forEach(g => processItem(g.tarih, g.tutar, 'expense', 'Ofis Gideri'));
  kurumMasraflari.forEach(m => processItem(m.tarih, m.tutar, 'expense', 'Kurum Masrafı'));
  takipMasraflari.forEach(m => processItem(m.tarih, m.tutar, 'expense', 'Takip Masrafı'));

  const result = Object.values(monthlyStats).sort((a, b) => a.orderDate.getTime() - b.orderDate.getTime());
  console.log("Hesaplama Bitti - Oluşan Grafik Verisi:", result);
  return result;
};
