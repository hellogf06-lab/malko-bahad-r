import { usePeriod } from "../contexts/PeriodContext";

export function useFilteredFinancialData({ dosyalar, kurumDosyalari, giderler, kurumMasraflari, takipMasraflari }) {
  const { period, customRange } = usePeriod();
  function isInRange(dateStr) {
    const d = new Date(dateStr);
    let start, end;
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
  return {
    dosyalar: dosyalar.filter(d => isInRange(d.created_at || d.tarih)),
    kurumDosyalar: kurumDosyalari.filter(d => isInRange(d.created_at || d.tarih)),
    giderler: giderler.filter(d => isInRange(d.created_at || d.tarih)),
    kurumMasraflari: kurumMasraflari.filter(d => isInRange(d.created_at || d.tarih)),
    takipMasraflari: takipMasraflari.filter(d => isInRange(d.created_at || d.tarih)),
  };
}
