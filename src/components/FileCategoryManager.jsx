import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Tag, Save, Folder } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import toast from 'react-hot-toast';

const FileCategoryManager = ({ isOpen, onClose, onCategoriesChange }) => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6', icon: 'Folder' });
  const [editForm, setEditForm] = useState({ name: '', color: '', icon: '' });

  // Color options
  const colorOptions = [
    { value: '#3b82f6', label: 'Mavi' },
    { value: '#10b981', label: 'Yeşil' },
    { value: '#f59e0b', label: 'Turuncu' },
    { value: '#ef4444', label: 'Kırmızı' },
    { value: '#8b5cf6', label: 'Mor' },
    { value: '#ec4899', label: 'Pembe' },
    { value: '#06b6d4', label: 'Camgöbeği' },
    { value: '#84cc16', label: 'Lime' },
  ];

  // Load categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('fileCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Default categories
      const defaultCategories = [
        { id: '1', name: 'Boşanma', color: '#ef4444', icon: 'Folder', createdAt: new Date().toISOString() },
        { id: '2', name: 'Miras', color: '#f59e0b', icon: 'Folder', createdAt: new Date().toISOString() },
        { id: '3', name: 'Ticari', color: '#3b82f6', icon: 'Folder', createdAt: new Date().toISOString() },
        { id: '4', name: 'Ceza', color: '#8b5cf6', icon: 'Folder', createdAt: new Date().toISOString() },
        { id: '5', name: 'İdare', color: '#10b981', icon: 'Folder', createdAt: new Date().toISOString() },
        { id: '6', name: 'İcra', color: '#ec4899', icon: 'Folder', createdAt: new Date().toISOString() },
      ];
      setCategories(defaultCategories);
      localStorage.setItem('fileCategories', JSON.stringify(defaultCategories));
    }
  }, []);

  // Save categories to localStorage
  const saveCategories = (updatedCategories) => {
    setCategories(updatedCategories);
    localStorage.setItem('fileCategories', JSON.stringify(updatedCategories));
    if (onCategoriesChange) {
      onCategoriesChange(updatedCategories);
    }
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Kategori adı boş olamaz!');
      return;
    }

    const category = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      color: newCategory.color,
      icon: newCategory.icon,
      createdAt: new Date().toISOString()
    };

    const updatedCategories = [...categories, category];
    saveCategories(updatedCategories);
    setNewCategory({ name: '', color: '#3b82f6', icon: 'Folder' });
    toast.success('Kategori eklendi!');
  };

  // Start editing category
  const startEdit = (category) => {
    setEditingId(category.id);
    setEditForm({ name: category.name, color: category.color, icon: category.icon });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', color: '', icon: '' });
  };

  // Save edited category
  const saveEdit = (id) => {
    if (!editForm.name.trim()) {
      toast.error('Kategori adı boş olamaz!');
      return;
    }

    const updatedCategories = categories.map(cat =>
      cat.id === id
        ? { ...cat, name: editForm.name.trim(), color: editForm.color, icon: editForm.icon }
        : cat
    );

    saveCategories(updatedCategories);
    setEditingId(null);
    setEditForm({ name: '', color: '', icon: '' });
    toast.success('Kategori güncellendi!');
  };

  // Delete category
  const handleDelete = (id) => {
    // Check if category is in use
    const dosyalar = JSON.parse(localStorage.getItem('dosyalar') || '[]');
    const kurumDosyalari = JSON.parse(localStorage.getItem('kurumDosyalari') || '[]');
    
    const category = categories.find(c => c.id === id);
    const isInUse = [...dosyalar, ...kurumDosyalari].some(
      file => file.kategori === category?.name
    );

    if (isInUse) {
      const confirmed = window.confirm(
        'Bu kategori bazı dosyalarda kullanılıyor. Silmek istediğinize emin misiniz? ' +
        'Kategorisi bu olan dosyaların kategori bilgisi silinecektir.'
      );
      if (!confirmed) return;

      // Remove category from files
      const updatedDosyalar = dosyalar.map(file =>
        file.kategori === category.name ? { ...file, kategori: '' } : file
      );
      const updatedKurumDosyalari = kurumDosyalari.map(file =>
        file.kategori === category.name ? { ...file, kategori: '' } : file
      );

      localStorage.setItem('dosyalar', JSON.stringify(updatedDosyalar));
      localStorage.setItem('kurumDosyalari', JSON.stringify(updatedKurumDosyalari));
    }

    const updatedCategories = categories.filter(cat => cat.id !== id);
    saveCategories(updatedCategories);
    toast.success('Kategori silindi!');
  };

  // Get category usage count
  const getCategoryUsageCount = (categoryName) => {
    const dosyalar = JSON.parse(localStorage.getItem('dosyalar') || '[]');
    const kurumDosyalari = JSON.parse(localStorage.getItem('kurumDosyalari') || '[]');
    
    return [...dosyalar, ...kurumDosyalari].filter(
      file => file.kategori === categoryName
    ).length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Dosya Kategorileri</h2>
                <p className="text-indigo-100 text-sm">Kategori oluştur ve yönet</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Add New Category */}
          <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Yeni Kategori Ekle
            </h3>
            <div className="flex flex-wrap gap-3">
              <Input
                placeholder="Kategori Adı"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="flex-1 min-w-[200px]"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Renk:</span>
                <select
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: newCategory.color }}
                />
              </div>
              <Button onClick={handleAddCategory} className="gap-2">
                <Plus className="w-4 h-4" />
                Ekle
              </Button>
            </div>
          </Card>

          {/* Categories List */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Folder className="w-5 h-5 text-gray-600" />
              Mevcut Kategoriler ({categories.length})
            </h3>
            
            {categories.length === 0 ? (
              <Card className="p-8 text-center">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Henüz kategori eklenmemiş</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {categories.map(category => (
                  <Card key={category.id} className="p-4 hover:shadow-md transition-shadow">
                    {editingId === category.id ? (
                      // Edit mode
                      <div className="flex flex-wrap items-center gap-3">
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="flex-1 min-w-[200px]"
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit(category.id)}
                        />
                        <div className="flex items-center gap-2">
                          <select
                            value={editForm.color}
                            onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {colorOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: editForm.color }}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => saveEdit(category.id)}
                            size="sm"
                            className="gap-1"
                          >
                            <Save className="w-4 h-4" />
                            Kaydet
                          </Button>
                          <Button
                            onClick={cancelEdit}
                            variant="outline"
                            size="sm"
                          >
                            İptal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: category.color + '20', color: category.color }}
                          >
                            <Folder className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{category.name}</h4>
                              <span
                                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: category.color }}
                              >
                                {getCategoryUsageCount(category.name)} dosya
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Oluşturulma: {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEdit(category)}
                            variant="outline"
                            size="sm"
                            className="gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Düzenle
                          </Button>
                          <Button
                            onClick={() => handleDelete(category.id)}
                            variant="outline"
                            size="sm"
                            className="gap-1 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Sil
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Tag className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Kategori Kullanımı</p>
                <p>
                  Kategoriler, dosyalarınızı düzenli bir şekilde gruplandırmanıza yardımcı olur.
                  Dosya eklerken veya düzenlerken kategori seçebilir, filtreleme ve raporlama
                  işlemlerinde bu kategorileri kullanabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FileCategoryManager;
