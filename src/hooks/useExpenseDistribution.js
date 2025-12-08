import { useMemo } from 'react';

export const useExpenseDistribution = (giderler) => {
  return useMemo(() => {
    const categoryTotals = {};
    
    giderler.forEach(g => {
      const category = g.kategori || 'Diğer';
      categoryTotals[category] = (categoryTotals[category] || 0) + (g.tutar || 0);
    });
    
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308', 
      '#84cc16', '#22c55e', '#10b981', '#14b8a6',
      '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
      '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
    ];
    
    return Object.entries(categoryTotals).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [giderler]);
};
