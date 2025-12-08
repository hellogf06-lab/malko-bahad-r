type Currency = 'TRY' | 'USD' | 'EUR';

export const formatPara = (tutar: number | string, currency: Currency = 'TRY'): string => {
  const numericValue = typeof tutar === 'string' ? parseFloat(tutar) : tutar;
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(numericValue || 0);
};
