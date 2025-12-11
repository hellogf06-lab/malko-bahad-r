import React from 'react';
import { Keyboard, X } from 'lucide-react';

const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const categories = [
    {
      title: '⚡ Genel',
      items: [
        { name: 'Aramaya Odaklan', keys: ['Ctrl', 'K'] },
        { name: 'Yeni Kayıt', keys: ['Ctrl', 'N'] },
        { name: 'Gelişmiş Filtreleri Aç/Kapat', keys: ['Ctrl', 'F'] },
        { name: 'Ayarları Aç', keys: ['Ctrl', 'S'] },
        { name: 'Dark Mode Aç/Kapat', keys: ['Ctrl', 'D'] },
        { name: 'Takvimi Aç/Kapat', keys: ['Ctrl', 'T'] },
        { name: 'Bu Yardımı Göster', keys: ['Ctrl', '/'] },
        { name: 'Bu Yardımı Göster', keys: ['?'] },
        { name: 'İptal / Kapat', keys: ['Esc'] }
      ]
    },
    {
      title: '📊 Veri İşlemleri',
      items: [
        { name: 'Yeni Dosya (Dashboard)', keys: ['Ctrl', 'N'] },
        { name: 'Yeni Kurum (Kurum sekmesinde)', keys: ['Ctrl', 'N'] },
        { name: 'Yeni Gider (Giderler sekmesinde)', keys: ['Ctrl', 'N'] },
        { name: 'Excel Dışa Aktar', keys: ['Ctrl', 'E'] },
        { name: 'PDF Raporu Oluştur', keys: ['Ctrl', 'P'] }
      ]
    },
    {
      title: '🧭 Navigasyon',
      items: [
        { name: 'Dashboard\'a Git', keys: ['1'] },
        { name: 'Kurum Sekmesine Git', keys: ['2'] },
        { name: 'Dosyalar Sekmesine Git', keys: ['3'] },
        { name: 'Giderler Sekmesine Git', keys: ['4'] },
        { name: 'Modalları ve Panelleri Kapat', keys: ['Esc'] }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border-2 border-purple-200 dark:border-purple-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-b-2 border-purple-200 dark:border-purple-800 sticky top-0 z-10 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Keyboard size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent font-extrabold text-2xl">
                Klavye Kısayolları
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl transition-all text-gray-600 dark:text-gray-400 hover:text-red-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, catIndex) => (
              <div key={catIndex} className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">
                  {category.title}
                </h3>
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          {keyIndex > 0 && <span className="text-gray-400 mx-1">+</span>}
                          <kbd className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                            {key}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-950 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              <span className="font-bold text-purple-600 dark:text-purple-400">💡 İpucu:</span>{' '}
              Herhangi bir sayfada <kbd className="px-2 py-1 mx-1 text-xs font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">Ctrl</kbd>{' '}
              <span className="text-gray-400">+</span>{' '}
              <kbd className="px-2 py-1 mx-1 text-xs font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">/</kbd>{' '}
              veya{' '}
              <kbd className="px-2 py-1 mx-1 text-xs font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">?</kbd>{' '}
              tuşlarına basarak bu yardım ekranını açabilirsiniz.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 p-6 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
