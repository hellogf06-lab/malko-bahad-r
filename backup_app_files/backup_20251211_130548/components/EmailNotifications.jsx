import React, { useState } from 'react';
import { Mail, Send, X, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import toast from 'react-hot-toast';

const EmailNotifications = ({ isOpen, onClose, emailData }) => {
  const [emailSettings, setEmailSettings] = useState({
    enabled: localStorage.getItem('emailNotificationsEnabled') === 'true' || false,
    email: localStorage.getItem('notificationEmail') || '',
    notifyOnDeadline: true,
    notifyOnPayment: true,
    notifyOnNewFile: false,
    daysBeforeDeadline: 3
  });

  const [isSending, setIsSending] = useState(false);

  const handleSave = () => {
    localStorage.setItem('emailNotificationsEnabled', emailSettings.enabled);
    localStorage.setItem('notificationEmail', emailSettings.email);
    localStorage.setItem('emailNotificationSettings', JSON.stringify(emailSettings));
    toast.success('Email bildirimi ayarları kaydedildi');
    onClose();
  };

  const simulateSendEmail = () => {
    if (!emailSettings.email) {
      toast.error('Email adresi giriniz');
      return;
    }

    setIsSending(true);
    
    // Simüle edilmiş email gönderimi
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Test email gönderildi: ${emailSettings.email}`);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border-2 border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b-2 border-blue-200 dark:border-blue-800 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Mail size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-extrabold text-2xl">
                Email Bildirimleri
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
        <div className="p-6 space-y-6">
          {/* Email Etkinleştir */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200">Email Bildirimlerini Etkinleştir</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Önemli olaylar için email bildirimi al</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailSettings.enabled}
                onChange={(e) => setEmailSettings({ ...emailSettings, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Email Adresi */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
              Email Adresi
            </label>
            <input
              type="email"
              value={emailSettings.email}
              onChange={(e) => setEmailSettings({ ...emailSettings, email: e.target.value })}
              placeholder="ornek@email.com"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
              disabled={!emailSettings.enabled}
            />
          </div>

          {/* Bildirim Türleri */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Bildirim Türleri</h3>
            
            <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <input
                type="checkbox"
                checked={emailSettings.notifyOnDeadline}
                onChange={(e) => setEmailSettings({ ...emailSettings, notifyOnDeadline: e.target.checked })}
                disabled={!emailSettings.enabled}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800 dark:text-gray-200">Teslim Tarihi Hatırlatması</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Teslim tarihi yaklaşan dosyalar için bildirim</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <input
                type="checkbox"
                checked={emailSettings.notifyOnPayment}
                onChange={(e) => setEmailSettings({ ...emailSettings, notifyOnPayment: e.target.checked })}
                disabled={!emailSettings.enabled}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800 dark:text-gray-200">Ödeme Hatırlatması</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Bekleyen ödemeler için bildirim</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <input
                type="checkbox"
                checked={emailSettings.notifyOnNewFile}
                onChange={(e) => setEmailSettings({ ...emailSettings, notifyOnNewFile: e.target.checked })}
                disabled={!emailSettings.enabled}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800 dark:text-gray-200">Yeni Dosya Bildirimi</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Yeni dosya eklendiğinde bildirim</div>
              </div>
            </label>
          </div>

          {/* Kaç Gün Önceden */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
              Teslim Tarihinden Kaç Gün Önce Bildir
            </label>
            <select
              value={emailSettings.daysBeforeDeadline}
              onChange={(e) => setEmailSettings({ ...emailSettings, daysBeforeDeadline: parseInt(e.target.value) })}
              disabled={!emailSettings.enabled}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 gün önce</option>
              <option value="2">2 gün önce</option>
              <option value="3">3 gün önce</option>
              <option value="5">5 gün önce</option>
              <option value="7">7 gün önce</option>
            </select>
          </div>

          {/* Test Email */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              <strong>Not:</strong> Bu uygulama demo amaçlıdır. Gerçek email göndermez, sadece simüle eder.
              Gerçek email entegrasyonu için SMTP servisi veya Email API (SendGrid, AWS SES vb.) gereklidir.
            </p>
            <Button
              onClick={simulateSendEmail}
              disabled={!emailSettings.enabled || !emailSettings.email || isSending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSending ? (
                <>
                  <RefreshCw className="animate-spin mr-2" size={18} />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="mr-2" size={18} />
                  Test Email Gönder
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 p-6 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            İptal
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <CheckCircle className="mr-2" size={18} />
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailNotifications;
