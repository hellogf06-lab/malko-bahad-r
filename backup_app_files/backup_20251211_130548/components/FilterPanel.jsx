import React, { useState } from 'react';
import { Filter, X, Calendar, DollarSign, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const FilterPanel = ({ onFilterChange, filterOptions = {}, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    category: '',
    status: '',
    search: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const emptyFilters = {
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      category: '',
      status: '',
      search: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
    if (onClear) onClear();
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="mb-6">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900 dark:hover:to-purple-900 font-semibold gap-2"
      >
        <Filter size={18} />
        Gelişmiş Filtreler
        {activeFilterCount > 0 && (
          <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="mt-4 border-2 border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Filter size={20} className="text-indigo-600 dark:text-indigo-400" />
                Filtreler
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tarih Aralığı */}
              {filterOptions.showDateRange !== false && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              {/* Tutar Aralığı */}
              {filterOptions.showAmountRange !== false && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <DollarSign size={16} />
                      Min. Tutar
                    </label>
                    <input
                      type="number"
                      value={filters.minAmount}
                      onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <DollarSign size={16} />
                      Max. Tutar
                    </label>
                    <input
                      type="number"
                      value={filters.maxAmount}
                      onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                      placeholder="999999.99"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              {/* Kategori */}
              {filterOptions.categories && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Tag size={16} />
                    Kategori
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Tümü</option>
                    {filterOptions.categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Durum */}
              {filterOptions.statuses && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Tag size={16} />
                    Durum
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Tümü</option>
                    {filterOptions.statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex-1 bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <X size={16} className="mr-2" />
                Temizle
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              >
                Uygula
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FilterPanel;
