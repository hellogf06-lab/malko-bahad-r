import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import toast from 'react-hot-toast';

const MultiTenancyManager = ({ isOpen, onClose, onOfficeChange }) => {
  const [offices, setOffices] = useState(() => {
    const saved = localStorage.getItem('lawOffices');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'M&B Hukuk Bürosu', isActive: true }
    ];
  });

  const [activeOfficeId, setActiveOfficeId] = useState(() => {
    const saved = localStorage.getItem('activeOfficeId');
    return saved ? parseInt(saved) : 1;
  });

  const [newOfficeName, setNewOfficeName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('lawOffices', JSON.stringify(offices));
  }, [offices]);

  useEffect(() => {
    localStorage.setItem('activeOfficeId', activeOfficeId.toString());
  }, [activeOfficeId]);

  const handleAddOffice = () => {
    if (!newOfficeName.trim()) {
      toast.error('Büro adı giriniz');
      return;
    }

    const newOffice = {
      id: Date.now(),
      name: newOfficeName.trim(),
      isActive: false
    };

    setOffices([...offices, newOffice]);
    setNewOfficeName('');
    setShowAddForm(false);
    toast.success(`${newOffice.name} eklendi`);
  };

  const handleDeleteOffice = (id) => {
    if (offices.length === 1) {
      toast.error('En az bir büro olmalıdır');
      return;
    }

    if (id === activeOfficeId) {
      toast.error('Aktif büroyu silemezsiniz');
      return;
    }

    setOffices(offices.filter(o => o.id !== id));
    toast.success('Büro silindi');
  };

  const handleActivateOffice = (id) => {
    setActiveOfficeId(id);
    const office = offices.find(o => o.id === id);
    toast.success(`Aktif büro: ${office.name}`);
    
    // Parent'a bildir
    if (onOfficeChange) {
      onOfficeChange(id, office);
    }

    // Modal'ı kapat
    setTimeout(() => onClose(), 500);
  };

  const activeOffice = offices.find(o => o.id === activeOfficeId);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-b-2 border-purple-200 dark:border-purple-800 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Building2 size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent font-extrabold text-2xl">
                  Büro Yönetimi
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Birden fazla hukuk bürosu yönetin
                </p>
              </div>
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
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Aktif Büro */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-300 dark:border-green-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Check size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Aktif Büro</div>
                <div className="font-bold text-lg text-gray-800 dark:text-gray-200">
                  {activeOffice?.name}
                </div>
              </div>
            </div>
          </div>

          {/* Büro Listesi */}
          <div className="space-y-2">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Tüm Bürolar</h3>
            {offices.map(office => (
              <div
                key={office.id}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  office.id === activeOfficeId
                    ? 'bg-purple-50 dark:bg-purple-950 border-purple-300 dark:border-purple-700'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-800'
                }`}
                onClick={() => handleActivateOffice(office.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 
                      size={20} 
                      className={office.id === activeOfficeId ? 'text-purple-600' : 'text-gray-500'} 
                    />
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {office.name}
                      </div>
                      {office.id === activeOfficeId && (
                        <div className="text-xs text-purple-600 dark:text-purple-400">Aktif</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {office.id === activeOfficeId && (
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">
                        AKTİF
                      </div>
                    )}
                    {offices.length > 1 && office.id !== activeOfficeId && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOffice(office.id);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Yeni Büro Ekle */}
          <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
            {!showAddForm ? (
              <Button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                <Plus size={18} className="mr-2" />
                Yeni Büro Ekle
              </Button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newOfficeName}
                  onChange={(e) => setNewOfficeName(e.target.value)}
                  placeholder="Büro adı"
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleAddOffice()}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddOffice}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check size={18} className="mr-2" />
                    Ekle
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewOfficeName('');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <X size={18} className="mr-2" />
                    İptal
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Bilgilendirme */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>💡 Not:</strong> Her büronun verileri ayrı olarak saklanır. Büro değiştirdiğinizde,
              o büroya ait dosyalar, kurumlar ve giderler görüntülenir.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 p-6">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
          >
            Kapat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiTenancyManager;
