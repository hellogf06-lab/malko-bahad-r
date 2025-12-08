type Currency = 'TRY' | 'USD' | 'EUR';

// Para formatla
export const formatPara = (tutar: number | string, currency: Currency = 'TRY'): string => {
  const numericValue = typeof tutar === 'string' ? parseFloat(tutar) : tutar;
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue || 0);
};

// Tarih filtreleme
export const isDateInRange = (
  itemDate: string | undefined, 
  startDate: string, 
  endDate: string
): boolean => {
  if (!itemDate) return true;
  const date = new Date(itemDate);
  if (startDate && new Date(startDate) > date) return false;
  if (endDate && new Date(endDate) < date) return false;
  return true;
};

// Arama fonksiyonu
export const searchInObject = (obj: Record<string, any>, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();
  return Object.values(obj).some(val => 
    String(val).toLowerCase().includes(term)
  );
};

// Fuzzy search - daha esnek arama
export const fuzzySearch = (text: string, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanTerm = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Exact match
  if (cleanText.includes(cleanTerm)) return true;
  
  // Character by character fuzzy match
  let termIndex = 0;
  for (let i = 0; i < cleanText.length && termIndex < cleanTerm.length; i++) {
    if (cleanText[i] === cleanTerm[termIndex]) {
      termIndex++;
    }
  }
  return termIndex === cleanTerm.length;
};

// Multi-field search
export const multiFieldSearch = (
  obj: Record<string, any>, 
  searchTerm: string, 
  fields: string[]
): boolean => {
  if (!searchTerm) return true;
  return fields.some(field => {
    const value = obj[field];
    return value && fuzzySearch(String(value), searchTerm);
  });
};

// Advanced filter function
export const applyFilters = <T extends Record<string, any>>(
  data: T[],
  filters: {
    dateFrom?: string;
    dateTo?: string;
    minAmount?: string | number;
    maxAmount?: string | number;
    category?: string;
    status?: string;
    search?: string;
  },
  config: {
    dateField?: string;
    amountField?: string;
    categoryField?: string;
    statusField?: string;
    searchFields?: string[];
  }
): T[] => {
  return data.filter(item => {
    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      const dateField = config.dateField || 'tarih';
      if (!isDateInRange(item[dateField], filters.dateFrom || '', filters.dateTo || '')) {
        return false;
      }
    }

    // Amount range filter
    if (filters.minAmount !== undefined && filters.minAmount !== '') {
      const amountField = config.amountField || 'tutar';
      const amount = parseFloat(String(item[amountField] || 0));
      if (amount < parseFloat(String(filters.minAmount))) return false;
    }

    if (filters.maxAmount !== undefined && filters.maxAmount !== '') {
      const amountField = config.amountField || 'tutar';
      const amount = parseFloat(String(item[amountField] || 0));
      if (amount > parseFloat(String(filters.maxAmount))) return false;
    }

    // Category filter
    if (filters.category) {
      const categoryField = config.categoryField || 'kategori';
      if (item[categoryField] !== filters.category) return false;
    }

    // Status filter
    if (filters.status) {
      const statusField = config.statusField || 'durum';
      if (item[statusField] !== filters.status) return false;
    }

    // Search filter
    if (filters.search) {
      if (config.searchFields) {
        return multiFieldSearch(item, filters.search, config.searchFields);
      }
      return searchInObject(item, filters.search);
    }

    return true;
  });
};

// Sıralama fonksiyonu
export const sortData = <T extends Record<string, any>>(
  data: T[], 
  key: string | null, 
  direction: 'asc' | 'desc'
): T[] => {
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
