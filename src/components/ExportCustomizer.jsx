import React, { useState } from 'react';
import { FileDown, Download, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import toast from 'react-hot-toast';

const ExportCustomizer = ({ isOpen, onClose, onExport, exportType = 'pdf' }) => {
  const [options, setOptions] = useState({
    includeCharts: true,
    includeKPIs: true,
    includeSummary: true,
    includeTables: true,
    dateRange: 'all',
    customDateFrom: '',
    customDateTo: '',
    orientation: 'portrait',
    pageSize: 'A4',
    includeHeader: true,
    includeFooter: true,
    colorScheme: 'color'
  });

  const handleExport = () => {
    onExport(options);
    toast.success(`${exportType.toUpperCase()} raporu hazırlanıyor...`, {
      icon: exportType === 'pdf' ? '📄' : '📊',
      duration: 2000
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-white dark:bg-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-b-2 border-purple-200 dark:border-purple-800 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                {exportType === 'pdf' ? (
                  <FileDown size={24} className="text-purple-600 dark:text-purple-400" />
                ) : (
                  <Download size={24} className="text-green-600 dark:text-green-400" />
                )}
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-extrabold text-xl">
                {exportType === 'pdf' ? 'PDF' : 'Excel'} Dışa Aktarma Ayarları
              </span>
            </CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl transition-all text-gray-600 dark:text-gray-400 hover:text-red-600"
            >
              <X size={20} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* İçerik Seçimi */}
          <div className="pb-6 border-b-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              📋 Raporda Görünsün
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'includeKPIs', label: 'KPI Kartları', icon: '📊' },
                { key: 'includeSummary', label: 'Özet Bilgiler', icon: '📈' },
                { key: 'includeCharts', label: 'Grafikler', icon: '📉' },
                { key: 'includeTables', label: 'Tablolar', icon: '📋' }
              ].map(({ key, label, icon }) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                    options[key]
                      ? 'bg-purple-50 dark:bg-purple-950 border-purple-300 dark:border-purple-700'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={options[key]}
                    onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {icon} {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tarih Aralığı */}
          <div className="pb-6 border-b-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              📅 Tarih Aralığı
            </h3>
            <div className="space-y-3">
              {[
                { value: 'all', label: 'Tüm Veriler' },
                { value: 'today', label: 'Bugün' },
                { value: 'week', label: 'Bu Hafta' },
                { value: 'month', label: 'Bu Ay' },
                { value: 'year', label: 'Bu Yıl' },
                { value: 'custom', label: 'Özel Aralık' }
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="dateRange"
                    value={value}
                    checked={options.dateRange === value}
                    onChange={(e) => setOptions({ ...options, dateRange: e.target.value })}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
              
              {options.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-3 mt-3 pl-7">
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Başlangıç</Label>
                    <input
                      type="date"
                      value={options.customDateFrom}
                      onChange={(e) => setOptions({ ...options, customDateFrom: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Bitiş</Label>
                    <input
                      type="date"
                      value={options.customDateTo}
                      onChange={(e) => setOptions({ ...options, customDateTo: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PDF Özel Ayarları */}
          {exportType === 'pdf' && (
            <div className="pb-6 border-b-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                🎨 PDF Ayarları
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Sayfa Yönü</Label>
                  <select
                    value={options.orientation}
                    onChange={(e) => setOptions({ ...options, orientation: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="portrait">Dikey</option>
                    <option value="landscape">Yatay</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Sayfa Boyutu</Label>
                  <select
                    value={options.pageSize}
                    onChange={(e) => setOptions({ ...options, pageSize: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                    <option value="Letter">Letter</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Renk Şeması</Label>
                  <select
                    value={options.colorScheme}
                    onChange={(e) => setOptions({ ...options, colorScheme: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="color">Renkli</option>
                    <option value="grayscale">Siyah-Beyaz</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeHeader}
                    onChange={(e) => setOptions({ ...options, includeHeader: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Başlık Ekle</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeFooter}
                    onChange={(e) => setOptions({ ...options, includeFooter: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Alt Bilgi Ekle</span>
                </label>
              </div>
            </div>
          )}
        </CardContent>

        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 p-6 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-white dark:bg-gray-700"
          >
            İptal
          </Button>
          <Button
            onClick={handleExport}
            className={`flex-1 ${
              exportType === 'pdf'
                ? 'bg-gradient-to-r from-red-600 to-pink-600'
                : 'bg-gradient-to-r from-green-600 to-emerald-600'
            } text-white font-semibold`}
          >
            {exportType === 'pdf' ? <FileDown size={18} className="mr-2" /> : <Download size={18} className="mr-2" />}
            Dışa Aktar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ExportCustomizer;
