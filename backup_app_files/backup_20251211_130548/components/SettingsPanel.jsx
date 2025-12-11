import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Save, Building2, Palette, Bell, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import toast from 'react-hot-toast';

const SettingsPanel = ({ isOpen, onClose, settings, onSave }) => {
  const [formData, setFormData] = useState({
    firmName: settings?.firmName || 'M&B Hukuk Bürosu',
    address: settings?.address || '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    taxNumber: settings?.taxNumber || '',
    theme: settings?.theme || 'light',
    language: settings?.language || 'tr',
    currency: settings?.currency || 'TRY',
    notifications: settings?.notifications !== false
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    toast.success('Ayarlar kaydedildi!', {
      icon: '⚙️',
      duration: 3000
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-white dark:bg-gray-800 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-b-2 border-indigo-200 dark:border-indigo-800 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <SettingsIcon size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-extrabold text-2xl">
                Sistem Ayarları
              </span>
            </CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl transition-all text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <X size={24} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Firma Bilgileri */}
          <div className="pb-6 border-b-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-indigo-600 dark:text-indigo-400" />
              Firma Bilgileri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firmName" className="text-gray-700 dark:text-gray-300">Firma Adı *</Label>
                <Input
                  id="firmName"
                  value={formData.firmName}
                  onChange={(e) => handleChange('firmName', e.target.value)}
                  placeholder="M&B Hukuk Bürosu"
                  className="mt-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="mt-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="info@mbhukuk.com"
                  className="mt-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="taxNumber" className="text-gray-700 dark:text-gray-300">Vergi No</Label>
                <Input
                  id="taxNumber"
                  value={formData.taxNumber}
                  onChange={(e) => handleChange('taxNumber', e.target.value)}
                  placeholder="1234567890"
                  className="mt-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">Adres</Label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Firma adresinizi giriniz..."
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Görünüm Ayarları */}
          <div className="pb-6 border-b-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Palette size={20} className="text-indigo-600 dark:text-indigo-400" />
              Görünüm Ayarları
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="theme" className="text-gray-700 dark:text-gray-300">Tema</Label>
                <select
                  id="theme"
                  value={formData.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="light">Açık Tema</option>
                  <option value="dark">Koyu Tema</option>
                  <option value="auto">Sistem</option>
                </select>
              </div>
              <div>
                <Label htmlFor="language" className="text-gray-700 dark:text-gray-300">Dil</Label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <Label htmlFor="currency" className="text-gray-700 dark:text-gray-300">Para Birimi</Label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="TRY">₺ TRY</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bildirim Ayarları */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Bell size={20} className="text-indigo-600 dark:text-indigo-400" />
              Bildirim Ayarları
            </h3>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                type="checkbox"
                id="notifications"
                checked={formData.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <Label htmlFor="notifications" className="text-gray-700 dark:text-gray-300 cursor-pointer">
                Masraf ve ödeme bildirimleri göster
              </Label>
            </div>
          </div>
        </CardContent>

        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 p-6 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          >
            İptal
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 font-semibold"
          >
            <Save size={18} className="mr-2" />
            Kaydet
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;
