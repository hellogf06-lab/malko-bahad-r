// Para formatla
export const formatPara = (tutar, currency = 'TRY') => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(tutar || 0);
};

// Tarih filtreleme
export const isDateInRange = (itemDate, startDate, endDate) => {
  if (!itemDate) return true;
  const date = new Date(itemDate);
  if (startDate && new Date(startDate) > date) return false;
  if (endDate && new Date(endDate) < date) return false;
  return true;
};

// Arama fonksiyonu
export const searchInObject = (obj, searchTerm) => {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();
  return Object.values(obj).some(val => 
    String(val).toLowerCase().includes(term)
  );
};

// Sıralama fonksiyonu
export const sortData = (data, key, direction) => {
  if (!key) return data;
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return direction === 'asc' 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
};
