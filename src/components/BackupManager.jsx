import React, { useState } from 'react';
import { Download, Upload, Database, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import toast from 'react-hot-toast';

const BackupManager = ({ isOpen, onClose }) => {
  const [lastBackup, setLastBackup] = useState(() => {
    return localStorage.getItem('last_backup_date') || null;
  });

  const createBackup = () => {
    try {
      const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
          dosyalar: JSON.parse(localStorage.getItem('dosyalar') || '[]'),
          kurumDosyalari: JSON.parse(localStorage.getItem('kurumDosyalari') || '[]'),
          takipMasraflari: JSON.parse(localStorage.getItem('takipMasraflari') || '[]'),
          kurumMasraflari: JSON.parse(localStorage.getItem('kurumMasraflari') || '[]'),
          giderler: JSON.parse(localStorage.getItem('giderler') || '[]'),
          settings: JSON.parse(localStorage.getItem('hukuk_settings') || '{}'),
          auditLogs: JSON.parse(localStorage.getItem('auditLogs') || '[]'),
          auth_user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
          auth_profile: JSON.parse(localStorage.getItem('auth_profile') || 'null'),
        }
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hukuk_yedek_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const now = new Date().toISOString();
      localStorage.setItem('last_backup_date', now);
      setLastBackup(now);

      toast.success('Yedek başarıyla oluşturuldu!', { icon: '💾' });
    } catch (error) {
      console.error('Yedekleme hatası:', error);
      toast.error('Yedekleme sırasında hata oluştu!');
    }
  };

  const restoreBackup = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target.result);
        
        if (!backupData.version || !backupData.data) {
          throw new Error('Geçersiz yedek dosyası formatı');
        }

        // Tüm verileri geri yükle
        Object.entries(backupData.data).forEach(([key, value]) => {
          if (value !== null) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        });

        toast.success('Yedek başarıyla geri yüklendi! Sayfa yenileniyor...', { icon: '✅' });
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('Geri yükleme hatası:', error);
        toast.error('Yedek geri yüklenirken hata oluştu!');
      }
    };
    reader.readAsText(file);
  };

  const autoBackup = () => {
    localStorage.setItem('auto_backup_enabled', 'true');
    localStorage.setItem('last_auto_backup', new Date().toISOString());
    toast.success('Otomatik yedekleme aktifleştirildi!', { 
      duration: 5000,
      icon: '⏰' 
    });
    toast('Not: Tarayıcı açıkken düzenli olarak yedek alınacak', { 
      duration: 6000,
      icon: 'ℹ️' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database size={24} className="text-blue-600" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-extrabold text-2xl">
                Yedekleme Yöneticisi
              </span>
            </CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Son Yedek Bilgisi */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Clock className="text-gray-600" size={20} />
            <div>
              <p className="text-sm font-semibold text-gray-700">Son Yedekleme</p>
              <p className="text-xs text-gray-500">
                {lastBackup ? new Date(lastBackup).toLocaleString('tr-TR') : 'Henüz yedek alınmadı'}
              </p>
            </div>
          </div>

          {/* Yedek Oluştur */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Download size={18} />
              Yedek Oluştur
            </h3>
            <p className="text-sm text-gray-600">
              Tüm verilerinizi JSON formatında bilgisayarınıza indirin
            </p>
            <Button
              onClick={createBackup}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download size={18} className="mr-2" />
              Yedek İndir
            </Button>
          </div>

          {/* Yedek Geri Yükle */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Upload size={18} />
              Yedek Geri Yükle
            </h3>
            <p className="text-sm text-gray-600">
              Önceden alınmış yedeği sisteme geri yükleyin
            </p>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".json"
                onChange={restoreBackup}
                className="hidden"
                id="restore-input"
              />
              <label
                htmlFor="restore-input"
                className="flex-1 cursor-pointer"
              >
                <div className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <Upload size={18} />
                  Dosya Seç ve Geri Yükle
                </div>
              </label>
            </div>
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-800">
                <strong>Uyarı:</strong> Geri yükleme işlemi mevcut tüm verilerin üzerine yazacaktır!
              </p>
            </div>
          </div>

          {/* Otomatik Yedekleme */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle size={18} />
              Otomatik Yedekleme
            </h3>
            <p className="text-sm text-gray-600">
              Her 24 saatte bir otomatik yedek alın
            </p>
            <Button
              onClick={autoBackup}
              variant="outline"
              className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            >
              <CheckCircle size={18} className="mr-2" />
              Otomatik Yedeklemeyi Aktifleştir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupManager;
