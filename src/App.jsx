import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Upload, Plus, Building2, Briefcase, FileText, TrendingUp, DollarSign, Trash2, Home, BarChart2, BarChart3, Wallet, CheckCircle, Clock, RefreshCw, Edit2, Eye, Search, Settings, Bell, ChevronUp, ChevronDown, X, Filter, Calendar } from 'lucide-react';
// Modern ikon stilleri için
const iconButtonStyle = "rounded-lg shadow-sm border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700";
import * as XLSX from 'xlsx';
import { useAuth } from './contexts/AuthContext';

// Components
import Layout from './components/Layout';
import Header from './components/Header';
import Modal from './components/Modal';
import SummaryCard from './components/SummaryCard';
import SimpleBarChart from './components/SimpleBarChart';
import PieChart from './components/PieChart';
import KPICard from './components/KPICard';
import SortableHeader from './components/SortableHeader';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { HearingReminders } from './components/HearingReminders';
import { Drawer, DetailField, DrawerBadge } from './components/ui/drawer';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import TableSkeleton from './components/TableSkeleton';
import UserManagement from './components/UserManagement';

// Advanced Components
import { CalendarView } from './components/CalendarView';
import EmailNotifications from './components/EmailNotifications';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import BackupManager from './components/BackupManager';
import AuditLogViewer from './components/AuditLogViewer';
import ReminderSystem from './components/ReminderSystem';
import SettingsPanel from './components/SettingsPanel';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import NotificationCenter from './components/NotificationCenter';
import FileAttachments from './components/FileAttachments';
import DataImporter from './components/DataImporter';

// Form Components
import FileForm from './components/forms/FileForm';
import LegalExpenseForm from './components/forms/LegalExpenseForm';
import InstitutionForm from './components/forms/InstitutionForm';
import InstitutionExpenseForm from './components/forms/InstitutionExpenseForm';
import ExpenseForm from './components/forms/ExpenseForm';
import { ExpenseSheet } from './components/forms/ExpenseSheet';

// Hooks
import { useAllDataQueries } from './hooks/useQuery';
import { useAddData, useUpdateData, useDeleteData, useTogglePaid } from './hooks/useQuery';
import { useCalculations } from './hooks/useCalculations';
import { usePDFExport } from './hooks/usePDFExport';

// Utils
import { formatPara, searchInObject, sortData, isDateInRange } from './utils/helpers.ts';
import { EXPENSE_CATEGORIES, STORAGE_KEY, COLORS } from './utils/constants.ts';

// --- ANA UYGULAMA ---
const App = () => {
      // Kullanıcı ve profil bilgisini AuthContext'ten al
      const { profile, user, isAdmin } = useAuth();
    // Kullanıcı yönetimi paneli için state
    const [showUserManagement, setShowUserManagement] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Modals
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewLegalExpenseModal, setShowNewLegalExpenseModal] = useState(false);
  const [showNewInstitutionModal, setShowNewInstitutionModal] = useState(false);
  const [showNewInstitutionExpenseModal, setShowNewInstitutionExpenseModal] = useState(false);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  
  // Advanced Feature Modals
  const [showCalendar, setShowCalendar] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBackupManager, setShowBackupManager] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  
  const [detailModal, setDetailModal] = useState({ isOpen: false, item: null, type: null });
  const [editMode, setEditMode] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Filtreleme & Arama
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all'); // all, paid, unpaid
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Sıralama
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Toplu İşlemler
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Ayarlar
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('hukuk_settings');
    return saved ? JSON.parse(saved) : {
      firmName: 'MALKOÇ & BAHADIR HUKUK VE DANIŞMANLIK',
      logo: '',
      currency: 'TRY',
      kdvRate: 20,
      notificationDays: 7
    };
  });
  
  useEffect(() => {
    localStorage.setItem('hukuk_settings', JSON.stringify(settings));
  }, [settings]);

  // React Query ile veri çekme
  const { 
    dosyalar, 
    kurumDosyalari, 
    takipMasraflari, 
    kurumMasraflari, 
    giderler,
    isLoading,
    isError,
    error
  } = useAllDataQueries();

  // Edit mode için state (form componentleri kendi state'lerini yönetecek)
  const [editingItem, setEditingItem] = useState(null);

  // React Query Mutations
  const addFileMutation = useAddData('dosyalar');
  const updateFileMutation = useUpdateData('dosyalar');
  const deleteFileMutation = useDeleteData('dosyalar');
  
  const addLegalExpenseMutation = useAddData('takipMasraflari');
  const updateLegalExpenseMutation = useUpdateData('takipMasraflari');
  const deleteLegalExpenseMutation = useDeleteData('takipMasraflari');
  const toggleLegalExpenseMutation = useTogglePaid('takipMasraflari');
  
  const addInstitutionMutation = useAddData('kurumDosyalari');
  const updateInstitutionMutation = useUpdateData('kurumDosyalari');
  const deleteInstitutionMutation = useDeleteData('kurumDosyalari');
  const toggleInstitutionMutation = useTogglePaid('kurumDosyalari');
  
  const addInstitutionExpenseMutation = useAddData('kurumMasraflari');
  const updateInstitutionExpenseMutation = useUpdateData('kurumMasraflari');
  const deleteInstitutionExpenseMutation = useDeleteData('kurumMasraflari');
  const toggleInstitutionExpenseMutation = useTogglePaid('kurumMasraflari');
  
  const addExpenseMutation = useAddData('giderler');
  const updateExpenseMutation = useUpdateData('giderler');
  const deleteExpenseMutation = useDeleteData('giderler');

  // --- HESAPLAMALAR ---
  const hesaplamalar = useCalculations(dosyalar, kurumDosyalari, kurumMasraflari, giderler, takipMasraflari);
  const { generatePDFReport } = usePDFExport(hesaplamalar, dosyalar, giderler, settings);

  // Bildirim kontrolü - akıllı bildirimler
  useEffect(() => {
    const checkNotifications = () => {
      const notifs = [];
      const today = new Date();
      const notifDays = settings.notificationDays || 7;
      
      // 1. KÂR/ZARAR DURUMU - En önemli bildirim
      const toplamGelir = hesaplamalar.toplamTahsilat + hesaplamalar.toplamKurumHakedis;
      const toplamGider = hesaplamalar.toplamGiderler + hesaplamalar.toplamTakipMasraflari + hesaplamalar.toplamKurumMasraflari;
      const netKar = toplamGelir - toplamGider;
      
      if (netKar > 0) {
        notifs.push({ 
          type: 'success', 
          message: `✅ Kâr Durumu: ${formatPara(netKar, settings.currency)} (Gelir: ${formatPara(toplamGelir, settings.currency)}, Gider: ${formatPara(toplamGider, settings.currency)})`,
          priority: 1
        });
      } else if (netKar < 0) {
        notifs.push({ 
          type: 'error', 
          message: `⚠️ ZARAR DURUMU: ${formatPara(Math.abs(netKar), settings.currency)} (Gelir: ${formatPara(toplamGelir, settings.currency)}, Gider: ${formatPara(toplamGider, settings.currency)})`,
          priority: 1
        });
      } else {
        notifs.push({ 
          type: 'info', 
          message: `⚖️ Başa Baş Durum (Gelir = Gider: ${formatPara(toplamGelir, settings.currency)})`,
          priority: 1
        });
      }
      
      // 2. BÜYÜK ÖDENMEMİŞ HAKEDİŞLER (50.000 TL üzeri)
      const buyukHakedisler = kurumDosyalari.filter(k => !k.odendi && (k.net_hakedis || 0) > 50000);
      if (buyukHakedisler.length > 0) {
        const toplam = buyukHakedisler.reduce((sum, k) => sum + (k.net_hakedis || 0), 0);
        notifs.push({ 
          type: 'warning', 
          message: `💰 ${buyukHakedisler.length} adet büyük ödenmemiş hakediş (Toplam: ${formatPara(toplam, settings.currency)})`,
          priority: 2
        });
      }
      
      // 3. TOPLAM ÖDENMEMİŞ HAKEDİŞLER
      const odenmemisHakedisler = kurumDosyalari.filter(k => !k.odendi);
      if (odenmemisHakedisler.length > 0) {
        const toplam = odenmemisHakedisler.reduce((sum, k) => sum + (k.net_hakedis || 0), 0);
        notifs.push({ 
          type: 'info', 
          message: `📋 ${odenmemisHakedisler.length} ödenmemiş hakediş (${formatPara(toplam, settings.currency)})`,
          priority: 3
        });
      }
      
      // 4. YÜKSEK GİDERLER (10.000 TL üzeri)
      const yuksekGiderler = giderler.filter(g => parseFloat(g.tutar || 0) > 10000);
      if (yuksekGiderler.length > 0) {
        const toplam = yuksekGiderler.reduce((sum, g) => sum + parseFloat(g.tutar || 0), 0);
        notifs.push({ 
          type: 'warning', 
          message: `💸 ${yuksekGiderler.length} yüksek gider (${formatPara(toplam, settings.currency)})`,
          priority: 4
        });
      }
      
      // 5. ÖDENMEMİŞ MASRAFLAR
      const odenmemisMasraflar = [...takipMasraflari, ...kurumMasraflari].filter(m => !m.odendi);
      if (odenmemisMasraflar.length > 0) {
        const toplam = odenmemisMasraflar.reduce((sum, m) => sum + parseFloat(m.tutar || 0), 0);
        notifs.push({ 
          type: 'warning', 
          message: `📌 ${odenmemisMasraflar.length} ödenmemiş masraf (${formatPara(toplam, settings.currency)})`,
          priority: 5
        });
      }
      
      // 6. AKTİF DOSYA SAYISI
      const aktifDosyalar = dosyalar.length + kurumDosyalari.length;
      notifs.push({ 
        type: 'info', 
        message: `📁 ${aktifDosyalar} aktif dosya (${dosyalar.length} takip + ${kurumDosyalari.length} kurum)`,
        priority: 6
      });
      
      // Priority'e göre sırala (düşük sayı = yüksek öncelik)
      notifs.sort((a, b) => (a.priority || 999) - (b.priority || 999));
      
      setNotifications(notifs);
    };
    
    if (!isLoading && !isError && hesaplamalar) {
      checkNotifications();
    }
  }, [kurumDosyalari, takipMasraflari, kurumMasraflari, giderler, dosyalar, hesaplamalar, settings, isLoading, isError]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <Header 
          toggleSidebar={() => {}}
          sidebarOpen={true}
          activeTab="overview"
          onTabChange={() => {}}
        />
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Skeleton */}
          <div className="w-64 bg-slate-900 border-r border-slate-800" />
          
          {/* Main Content with TableSkeleton */}
          <div className="flex-1 overflow-auto bg-slate-50">
            <TableSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-600">
        <div className="text-center p-6 bg-red-100 rounded-xl">
          <p className="font-bold mb-2">❌ Hata Oluştu</p>
          <p>{error?.message || 'Veriler yüklenirken bir hata oluştu'}</p>
        </div>
      </div>
    );
  }

  // --- FORM ACTIONS (React Hook Form ile) ---
  const handleFileSubmit = async (data) => {
    try {
      if (editingItem) {
        await updateFileMutation.mutateAsync({ id: editingItem.id, data });
        toast.success('Dosya başarıyla güncellendi', {
          description: `${data.dosyaNo} numaralı dosya düzenlendi`
        });
      } else {
        await addFileMutation.mutateAsync(data);
        toast.success('Dosya başarıyla eklendi', {
          description: `${data.dosyaNo} numaralı dosya oluşturuldu`
        });
      }
      setShowNewFileModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('İşlem başarısız', {
        description: error.message || 'Bir hata oluştu'
      });
    }
  };

  const handleLegalExpenseSubmit = async (data) => {
    try {
      const processedData = {
        ...data,
        dosyaId: parseInt(data.dosyaId),
        odendi: editingItem?.odendi || false
      };
      
      if (editingItem) {
        await updateLegalExpenseMutation.mutateAsync({ id: editingItem.id, data: processedData });
        toast.success('Masraf başarıyla güncellendi', {
          description: 'Dosya masrafı düzenlendi'
        });
      } else {
        await addLegalExpenseMutation.mutateAsync(processedData);
        toast.success('Masraf başarıyla eklendi', {
          description: 'Yeni dosya masrafı oluşturuldu'
        });
      }
      setShowNewLegalExpenseModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('İşlem başarısız', {
        description: error.message || 'Bir hata oluştu'
      });
    }
  };

  const handleInstitutionSubmit = async (data) => {
    try {
      const processedData = {
        ...data,
        odendi: editingItem?.odendi || false
      };
      
      if (editingItem) {
        await updateInstitutionMutation.mutateAsync({ id: editingItem.id, data: processedData });
        toast.success('Tahsilat başarıyla güncellendi', {
          description: 'Kurum hakediş kaydı düzenlendi'
        });
      } else {
        await addInstitutionMutation.mutateAsync(processedData);
        toast.success('Tahsilat başarıyla eklendi', {
          description: 'Yeni kurum hakediş kaydı oluşturuldu'
        });
      }
      setShowNewInstitutionModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('İşlem başarısız', {
        description: error.message || 'Bir hata oluştu'
      });
    }
  };

  const handleInstitutionExpenseSubmit = async (data) => {
    try {
      const processedData = {
        ...data,
        odendi: editingItem?.odendi || false
      };
      
      if (editingItem) {
        await updateInstitutionExpenseMutation.mutateAsync({ id: editingItem.id, data: processedData });
        toast.success('Masraf başarıyla güncellendi', {
          description: 'Kurum masraf kaydı düzenlendi'
        });
      } else {
        await addInstitutionExpenseMutation.mutateAsync(processedData);
        toast.success('Masraf başarıyla eklendi', {
          description: 'Yeni kurum masraf kaydı oluşturuldu'
        });
      }
      setShowNewInstitutionExpenseModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('İşlem başarısız', {
        description: error.message || 'Bir hata oluştu'
      });
    }
  };

  const handleExpenseSubmit = async (data) => {
    try {
      // ExpenseSheet'ten gelen veriyi API formatına çevir
      const formattedData = {
        aciklama: data.title,
        tutar: data.amount,
        kategori: data.category,
        tarih: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date,
        belge_no: data.docNo || null,
        // file handling burada eklenebilir
      };

      if (editingItem) {
        await updateExpenseMutation.mutateAsync({ id: editingItem.id, data: formattedData });
        toast.success('Gider başarıyla güncellendi', {
          description: 'Ofis gideri düzenlendi'
        });
      } else {
        await addExpenseMutation.mutateAsync(formattedData);
        toast.success('Gider başarıyla eklendi', {
          description: 'Yeni ofis gideri oluşturuldu'
        });
      }
      setShowNewExpenseModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('İşlem başarısız', {
        description: error.message || 'Bir hata oluştu'
      });
    }
  };

  const openDetailModal = (item, type) => {
    setDetailModal({ isOpen: true, item, type });
  };

  const closeDetailModal = () => {
    setDetailModal({ isOpen: false, item: null, type: null });
  };

  const openEditModal = (item, type) => {
    setEditingItem(item);
    if (type === 'file') {
      setShowNewFileModal(true);
    } else if (type === 'legalExpense') {
      setShowNewLegalExpenseModal(true);
    } else if (type === 'institution') {
      setShowNewInstitutionModal(true);
    } else if (type === 'institutionExpense') {
      setShowNewInstitutionExpenseModal(true);
    } else if (type === 'expense') {
      setShowNewExpenseModal(true);
    }
  };

  // Sıralama fonksiyonu
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Toplu işlemler
  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (items) => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(i => i.id));
    }
  };

  const handleBulkDelete = async (type) => {
    if (selectedItems.length === 0) return;
    if (!window.confirm(`${selectedItems.length} kayıt silinecek. Emin misiniz?`)) return;
    
    const count = selectedItems.length;
    for (const id of selectedItems) {
      if (type === 'file') await deleteFileMutation.mutateAsync(id);
      else if (type === 'legalExpense') await deleteLegalExpenseMutation.mutateAsync(id);
      else if (type === 'institution') await deleteInstitutionMutation.mutateAsync(id);
      else if (type === 'institutionExpense') await deleteInstitutionExpenseMutation.mutateAsync(id);
      else if (type === 'expense') await deleteExpenseMutation.mutateAsync(id);
    }
    
    setSelectedItems([]);
    toast.success('Toplu silme işlemi tamamlandı', {
      description: `${count} kayıt başarıyla silindi`
    });
  };

  const handleBulkExport = (data, filename) => {
    const selectedData = data.filter(item => selectedItems.includes(item.id));
    if (selectedData.length === 0) return;
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(selectedData), "Data");
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel dışa aktarma tamamlandı', {
      description: `${selectedData.length} kayıt başarıyla aktarıldı`
    });
  };

  const excelIndir = () => {
    exportAllData(dosyalar, kurumDosyalari, giderler);
    toast.success('Tüm veriler Excel olarak indirildi.');
  };

  // Bildirim ve ayar açma fonksiyonları
  const handleOpenNotifications = () => setShowNotifications(true);
  const handleOpenSettings = () => setShowSettingsModal(true);

  // Layout'a fonksiyonları window objesiyle geçiriyoruz (Vite HMR için)
  if (typeof window !== 'undefined') {
    window.__layoutProps = {
      onOpenNotifications: handleOpenNotifications,
      onOpenSettings: handleOpenSettings
    };
  }

  // DEBUG: Yüklenme, hata ve profil durumu
  if (isLoading) {
    return <div style={{padding:40, color:'blue', fontWeight:'bold'}}>Yükleniyor... (isLoading=true)</div>;
  }
  if (isError) {
    return <div style={{padding:40, color:'red', fontWeight:'bold'}}>Hata: {error?.message || 'Veri çekilemedi'} (isError=true)</div>;
  }
  if (!dosyalar || !kurumDosyalari || !giderler) {
    return <div style={{padding:40, color:'orange', fontWeight:'bold'}}>Veri eksik! dosyalar/kurumDosyalari/giderler yok.</div>;
  }
  // Profil veya context eksikse uyarı
  if (typeof profile === 'undefined') {
    return <div style={{padding:40, color:'purple', fontWeight:'bold'}}>Profil/context eksik! (profile undefined)</div>;
  }
  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Sadece adminler için kullanıcı yönetimi erişimi */}
      {profile?.role === 'admin' && (
        <div className="flex justify-end p-4">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700"
            onClick={() => setShowUserManagement(true)}
          >
            <span>Kullanıcı Yönetimi</span>
          </button>
        </div>
      )}
      {/* Modern Export/Upload Butonları */}
      <div className="flex gap-3 p-4 justify-end">
        <button
          className={iconButtonStyle + " text-green-700 border-green-300"}
          onClick={() => setShowImporter(true)}
        >
          <Upload size={20} className="text-green-600" />
          <span>Yükle (Excel/CSV)</span>
        </button>
        <button
          className={iconButtonStyle + " text-blue-700 border-blue-300"}
          onClick={excelIndir}
        >
          <Download size={20} className="text-blue-600" />
          <span>Excel İndir</span>
        </button>
        <button
          className={iconButtonStyle + " text-rose-700 border-rose-300"}
          onClick={generatePDFReport}
        >
          <Download size={20} className="text-rose-600" />
          <span>PDF İndir</span>
        </button>
      </div>
      {/* Kullanıcı Yönetimi Modalı */}
      {showUserManagement && (
        <Modal isOpen={showUserManagement} onClose={() => setShowUserManagement(false)} title="Kullanıcı Yönetimi">
          <div className="p-2">
            <UserManagement />
          </div>
        </Modal>
      )}
      {/* Ana İçerik Bölgesi - Sadece Tab İçerikleri */}
          
          {/* KURUM İŞLEMLERİ */}
          {activeTab === 'kurum' && (
             <div className="flex flex-col gap-8">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
                    <SummaryCard title="Reel Kurum Tahsilatı (Kasa)" value={hesaplamalar.kurumReelGelir} type="income" />
                    <SummaryCard title="Bekleyen Alacak (Kurum)" value={hesaplamalar.kurumBekleyenAlacak} type="pending" />
                    <SummaryCard title="Kurum Net Bakiye" value={hesaplamalar.kurumReelGelir - (hesaplamalar.kurumMasrafToplam - hesaplamalar.kurumMasrafIade)} type="net" subValue={hesaplamalar.kurumMasrafIade} subLabel="İade Alınan Masraf" />
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-8">
                    {/* Tahsilatlar TABLOSU */}
                    <Card className="flex flex-col h-[600px]">
                        <CardHeader className="bg-gray-50">
                            <div className="flex justify-between items-center mb-3">
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="text-indigo-600" size={20}/>
                                    Kurum Hakedişleri
                                </CardTitle>
                                <Button onClick={() => setShowNewInstitutionModal(true)} className="flex items-center gap-1" size="sm">
                                    <Plus size={16}/> Ekle
                                </Button>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"/>
                                    <input 
                                        type="text"
                                        placeholder="Ara..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tümü</option>
                                    <option value="paid">Ödenmiş</option>
                                    <option value="unpaid">Ödenmemiş</option>
                                </select>
                                {selectedItems.length > 0 && (
                                    <div className="flex gap-1">
                                        <Button 
                                            onClick={() => handleBulkDelete('institution')} 
                                            variant="outline"
                                            size="sm"
                                            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                        >
                                            Seçilileri Sil ({selectedItems.length})
                                        </Button>
                                        <Button 
                                          onClick={() => handleBulkExport(hesaplamalar.kurumHakedisler, 'kurum_hakedisler')} 
                                          variant="outline"
                                          size="sm"
                                          className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 flex items-center gap-1"
                                        >
                                          <Download size={16}/> Excel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-auto p-2 flex-1">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                                        <TableRow>
                                            <TableHead className="text-center w-12">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedItems.length === hesaplamalar.kurumHakedisler.length && hesaplamalar.kurumHakedisler.length > 0}
                                                    onChange={() => handleSelectAll(hesaplamalar.kurumHakedisler)}
                                                    className="cursor-pointer"
                                                />
                                            </TableHead>
                                            <SortableHeader label="Kurum" sortKey="kurumAdi" currentSort={sortConfig} onSort={handleSort}/>
                                            <SortableHeader label="Dosya" sortKey="dosyaNo" currentSort={sortConfig} onSort={handleSort}/>
                                            <SortableHeader label="Hakediş" sortKey="netHakedis" currentSort={sortConfig} onSort={handleSort}/>
                                            <TableHead>Not</TableHead>
                                            <TableHead className="text-center">Durum</TableHead>
                                            <TableHead className="text-center">Detay</TableHead>
                                            <TableHead className="text-center">Düzenle</TableHead>
                                            <TableHead className="text-center">Sil</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortData(
                                            hesaplamalar.kurumHakedisler.filter(k => {
                                                if (statusFilter === 'paid' && !k.odendi) return false;
                                                if (statusFilter === 'unpaid' && k.odendi) return false;
                                                return searchInObject(k, searchTerm);
                                            }),
                                            sortConfig.key,
                                            sortConfig.direction
                                        ).map(k => (
                                            <TableRow key={k.id} className={k.odendi ? 'bg-indigo-50' : ''}>
                                                <TableCell className="text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedItems.includes(k.id)}
                                                        onChange={() => handleSelectItem(k.id)}
                                                        className="cursor-pointer"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{k.kurum_adi}</TableCell>
                                                <TableCell className="text-gray-500">{k.dosya_no}</TableCell>
                                                <TableCell className="text-right font-bold text-indigo-600">{formatPara(k.net_hakedis, settings.currency)}</TableCell>
                                                <TableCell className="text-xs text-gray-500 max-w-[120px] truncate">{k.notes ? (k.notes.length > 20 ? k.notes.substring(0, 20) + '...' : k.notes) : '-'}</TableCell>
                                                <TableCell className="text-center">
                                                    <button 
                                                        onClick={() => toggleInstitutionMutation.mutate(k.id)} 
                                                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-full transition-all ${
                                                            k.odendi 
                                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                                                                : 'bg-orange-50 text-orange-600 border border-orange-300 hover:bg-orange-100'
                                                        }`}
                                                    >
                                                        {k.odendi ? <><CheckCircle size={12}/> Tahsil Edildi</> : <><Clock size={12}/> Bekliyor</>}
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button onClick={() => openDetailModal(k, 'institution')} className="text-blue-400 hover:text-blue-600 transition-colors">
                                                        <Eye size={16}/>
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button onClick={() => openEditModal(k, 'institution')} className="text-purple-400 hover:text-purple-600 transition-colors">
                                                        <Edit2 size={16}/>
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button onClick={() => deleteInstitutionMutation.mutate(k.id)} className="text-red-300 hover:text-red-600 transition-colors">
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {hesaplamalar.kurumHakedisler.length === 0 && <div className="text-center text-gray-400 mt-10">Kayıt yok.</div>}
                        </CardContent>
                    </Card>

                    {/* Masraflar TABLOSU */}
                    <Card className="flex flex-col h-[500px]">
                        <CardHeader className="flex flex-row items-center justify-between bg-gray-50">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="text-rose-600" size={20}/> 
                                Kurum Masraf
                            </CardTitle>
                            <Button onClick={() => setShowNewInstitutionExpenseModal(true)} className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700" size="sm">
                                <Plus size={16}/> Ekle
                            </Button>
                        </CardHeader>
                        <CardContent className="overflow-auto p-2 flex-1">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                                        <TableRow>
                                            <TableHead>Tarih</TableHead>
                                            <TableHead>Açıklama</TableHead>
                                            <TableHead className="text-right">Tutar</TableHead>
                                            <TableHead>Not</TableHead>
                                            <TableHead className="text-center">Durum</TableHead>
                                            <TableHead className="text-center">Detay</TableHead>
                                            <TableHead className="text-center">Düzenle</TableHead>
                                            <TableHead className="text-center">Sil</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {kurumMasraflari.map(m => (
                                            <TableRow key={m.id} className={m.odendi ? 'bg-emerald-50' : 'hover:bg-orange-50'}>
                                                <TableCell className="text-gray-500 text-xs">{m.tarih || '-'}</TableCell>
                                                <TableCell className="font-medium text-xs">{m.aciklama}</TableCell>
                                                <TableCell className="text-right font-bold text-rose-600">{formatPara(m.tutar)}</TableCell>
                                                <TableCell className="text-xs text-gray-500 max-w-[120px] truncate">{m.notes ? (m.notes.length > 20 ? m.notes.substring(0, 20) + '...' : m.notes) : '-'}</TableCell>
                                                <TableCell className="text-center">
                                                    <button 
                                                        onClick={() => toggleInstitutionExpenseMutation.mutate(m.id)} 
                                                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-full transition-all ${
                                                            m.odendi 
                                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                                                                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {m.odendi ? 'Ödendi' : 'Tahsil Et'}
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button onClick={() => openDetailModal(m, 'institutionExpense')} className="text-blue-400 hover:text-blue-600 transition-colors">
                                                        <Eye size={16}/>
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button onClick={() => openEditModal(m, 'institutionExpense')} className="text-purple-400 hover:text-purple-600 transition-colors">
                                                        <Edit2 size={16}/>
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button onClick={() => deleteInstitutionExpenseMutation.mutate(m.id)} className="text-red-300 hover:text-red-600 transition-colors">
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
             </div>
          )}

          {/* DOSYA İŞLEMLERİ */}
          {activeTab === 'dosyalar' && (
             <div className="flex flex-col gap-8">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
                    <SummaryCard title="Dosya Tahsilatı" value={hesaplamalar.dosyaTahsilat} type="income" />
                    <SummaryCard title="Toplam Takip Masrafı" value={hesaplamalar.dosyaMasrafToplam} type="expense" />
                    <SummaryCard title="Dosya Net Bakiye" value={hesaplamalar.dosyaTahsilat - (hesaplamalar.dosyaMasrafToplam - hesaplamalar.dosyaMasrafIade)} type="net" subValue={hesaplamalar.dosyaMasrafIade} subLabel="Müvekkilden Alınan"/>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-8">
                   <Card className="flex flex-col h-[500px]">
                        <CardHeader className="flex flex-row items-center justify-between bg-gray-50">
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="text-blue-600" size={20}/> 
                                Serbest Dosyalar
                            </CardTitle>
                            <Button onClick={() => setShowNewFileModal(true)} className="flex items-center gap-1" size="sm">
                                <Plus size={16}/> Ekle
                            </Button>
                        </CardHeader>
                        <CardContent className="overflow-auto p-2 flex-1">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                                        <TableRow>
                                            <TableHead>No</TableHead>
                                            <TableHead>Müvekkil</TableHead>
                                            <TableHead className="text-right">Tahsilat</TableHead>
                                            <TableHead>Not</TableHead>
                                            <TableHead className="text-center">Detay</TableHead>
                                            <TableHead className="text-center">Düzenle</TableHead>
                                            <TableHead className="text-center">Sil</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dosyalar.map(d => (
                                            <TableRow key={d.id} className="hover:bg-blue-50">
                                                <TableCell className="font-bold text-blue-900">{d.dosya_no}</TableCell>
                                                <TableCell>{d.muvekkil_adi}</TableCell>
                                                <TableCell className="text-right font-bold text-emerald-600">{formatPara(d.tahsil_edilen)}</TableCell>
                                                <TableCell className="text-xs text-gray-500 max-w-[120px] truncate">{d.notes ? (d.notes.length > 20 ? d.notes.substring(0, 20) + '...' : d.notes) : '-'}</TableCell>
                                                <TableCell className="text-center">
                                                    <button onClick={() => openDetailModal(d, 'file')} className="text-blue-400 hover:text-blue-600 transition-colors">
                                                        <Eye size={16}/>
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button onClick={() => openEditModal(d, 'file')} className="text-purple-400 hover:text-purple-600 transition-colors">
                                                        <Edit2 size={16}/>
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button onClick={() => deleteFileMutation.mutate(d.id)} className="text-red-300 hover:text-red-600 transition-colors">
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                   </Card>
                   <Card className="flex flex-col h-[500px]">
                        <CardHeader className="flex flex-row items-center justify-between bg-gray-50">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="text-orange-600" size={20}/> 
                                Dosya Masrafları
                            </CardTitle>
                            <Button onClick={() => setShowNewLegalExpenseModal(true)} className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700" size="sm">
                                <Plus size={16}/> Ekle
                            </Button>
                        </CardHeader>
                        <CardContent className="overflow-auto p-2 flex-1">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                                        <TableRow>
                                            <TableHead>Tarih</TableHead>
                                            <TableHead>Dosya</TableHead>
                                            <TableHead>Tür</TableHead>
                                            <TableHead className="text-right">Tutar</TableHead>
                                            <TableHead>Not</TableHead>
                                            <TableHead className="text-center">Durum</TableHead>
                                            <TableHead className="text-center">Detay</TableHead>
                                            <TableHead className="text-center">Düzenle</TableHead>
                                            <TableHead className="text-center">Sil</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {takipMasraflari.map(m => {
                                            const file = dosyalar.find(d => d.id === m.dosya_id);
                                            return (
                                                <TableRow key={m.id} className={m.odendi ? 'bg-emerald-50' : 'hover:bg-orange-50'}>
                                                    <TableCell className="text-gray-500 text-xs">{m.tarih || '-'}</TableCell>
                                                    <TableCell className="text-xs font-medium text-gray-500">{file ? file.dosya_no : 'Silinmiş'}</TableCell>
                                                    <TableCell>{m.masraf_turu}</TableCell>
                                                    <TableCell className="text-right font-bold text-red-600">{formatPara(m.tutar)}</TableCell>
                                                    <TableCell className="text-xs text-gray-500 max-w-[120px] truncate">{m.notes ? (m.notes.length > 20 ? m.notes.substring(0, 20) + '...' : m.notes) : '-'}</TableCell>
                                                    <TableCell className="text-center">
                                                        <button 
                                                            onClick={() => toggleLegalExpenseMutation.mutate(m.id)} 
                                                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-full transition-all ${
                                                                m.odendi 
                                                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                                                                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {m.odendi ? <><CheckCircle size={12}/> Ödendi</> : 'Tahsil Et'}
                                                        </button>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <button onClick={() => openDetailModal(m, 'legalExpense')} className="text-blue-400 hover:text-blue-600 transition-colors">
                                                            <Eye size={16}/>
                                                        </button>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <button onClick={() => openEditModal(m, 'legalExpense')} className="text-purple-400 hover:text-purple-600 transition-colors">
                                                            <Edit2 size={16}/>
                                                        </button>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <button onClick={() => deleteLegalExpenseMutation.mutate(m.id)} className="text-red-300 hover:text-red-600 transition-colors">
                                                            <Trash2 size={16}/>
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                   </Card>
                </div>
             </div>
          )}

          {/* OFİS GİDERLERİ */}
          {activeTab === 'giderler' && (
             <Card>
                <CardHeader className="bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-rose-100 rounded-lg text-rose-600">
                                <Wallet size={24}/>
                            </div>
                            <div>
                                <CardTitle className="text-xl">Ofis Gider Listesi</CardTitle>
                                <p className="text-sm text-gray-500">Maaş, kira, fatura ve diğer operasyonel giderler</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Toplam Gider</p>
                            <p className="text-2xl font-bold text-rose-600">{formatPara(hesaplamalar.ofisGiderToplam)}</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowNewExpenseModal(true)} className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2" size="sm">
                        <Plus size={18}/> Yeni Ofis Gideri Ekle
                    </Button>
                </CardHeader>
                <CardContent className="p-2">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Tarih</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Açıklama</TableHead>
                                    <TableHead className="text-right">Tutar</TableHead>
                                    <TableHead>Not</TableHead>
                                    <TableHead className="text-center">Detay</TableHead>
                                    <TableHead className="text-center">Düzenle</TableHead>
                                    <TableHead className="text-center">Sil</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {giderler.map(g => (
                                    <TableRow key={g.id}>
                                        <TableCell className="text-gray-500">{g.tarih}</TableCell>
                                        <TableCell>
                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300">
                                                {g.kategori}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium">{g.aciklama}</TableCell>
                                        <TableCell className="text-right font-bold text-rose-600">{formatPara(g.tutar)}</TableCell>
                                        <TableCell className="text-sm text-gray-500 max-w-[150px] truncate">{g.notes ? (g.notes.length > 20 ? g.notes.substring(0, 20) + '...' : g.notes) : '-'}</TableCell>
                                        <TableCell className="text-center">
                                            <button onClick={() => openDetailModal(g, 'expense')} className="text-blue-400 hover:text-blue-600 transition-colors">
                                                <Eye size={18}/>
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <button onClick={() => openEditModal(g, 'expense')} className="text-purple-400 hover:text-purple-600 transition-colors">
                                                <Edit2 size={18}/>
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <button onClick={() => deleteExpenseMutation.mutate(g.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={18}/>
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
             </Card>
          )}

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
                <KPICard title="Net Kâr (Kasa)" value={formatPara(hesaplamalar.netKar, settings.currency)} icon={TrendingUp} color={hesaplamalar.netKar >= 0 ? "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"} sub="Sadece Kasaya Girenler" />
                <KPICard title="Reel Gelir" value={formatPara(hesaplamalar.toplamReelGelir, settings.currency)} icon={DollarSign} color="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border-blue-200" sub="Tahsil Edilenler" />
                <KPICard title="Bekleyen Alacak" value={formatPara(hesaplamalar.kurumBekleyenAlacak, settings.currency)} icon={Clock} color="bg-gradient-to-br from-orange-50 to-orange-100 text-orange-800 border-orange-200" sub="Kurum Hakedişleri" />
                <KPICard title="İade Alınan Masraf" value={formatPara(hesaplamalar.toplamIade, settings.currency)} icon={RefreshCw} color="bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-200" sub="Kasaya Geri Giren" />
              </div>
              
              <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
                <SimpleBarChart data={hesaplamalar.chartData} title="Nakit Akışı (Cash Flow)" />
                <PieChart 
                  data={[
                    { name: 'Ofis Giderleri', value: hesaplamalar.ofisGiderToplam, color: '#ef4444' },
                    { name: 'Kurum Masrafları', value: hesaplamalar.kurumMasrafToplam, color: '#f97316' },
                    { name: 'Dosya Masrafları', value: hesaplamalar.dosyaMasrafToplam, color: '#f59e0b' }
                  ]} 
                  title="Gider Dağılımı"
                />
              </div>

              <HearingReminders dosyalar={dosyalar} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="text-gray-600" size={20}/>
                    Gelir Kaynak Analizi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-xs text-gray-600 font-semibold">Kurum Tahsilatı</p>
                    <p className="text-xl font-bold text-blue-900">{formatPara(hesaplamalar.kurumReelGelir, settings.currency)}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {hesaplamalar.toplamReelGelir > 0 ? ((hesaplamalar.kurumReelGelir / hesaplamalar.toplamReelGelir) * 100).toFixed(1) : 0}% toplam gelir
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="text-xs text-gray-600 font-semibold">Dosya Tahsilatı</p>
                    <p className="text-xl font-bold text-green-900">{formatPara(hesaplamalar.dosyaTahsilat, settings.currency)}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {hesaplamalar.toplamReelGelir > 0 ? ((hesaplamalar.dosyaTahsilat / hesaplamalar.toplamReelGelir) * 100).toFixed(1) : 0}% toplam gelir
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {/* AJANDA & TAKVİM */}
          {activeTab === 'ajanda' && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="text-indigo-600" size={24}/>
                    Duruşma Takvimi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarView files={dosyalar} expenses={giderler} />
                </CardContent>
              </Card>
              
              <HearingReminders dosyalar={dosyalar} />
            </div>
          )}

          {/* ANALİTİK & RAPORLAR */}
          {activeTab === 'analitik' && (
            <div className="flex flex-col gap-6">
              <AdvancedAnalytics 
                data={{
                  dosyalar,
                  kurumDosyalari,
                  giderler,
                  takipMasraflari,
                  kurumMasraflari
                }}
                settings={settings}
              />
            </div>
          )}

      {/* FORM DRAWERS */}
      <Drawer 
        isOpen={showNewInstitutionModal} 
        onClose={() => { setShowNewInstitutionModal(false); setEditingItem(null); }} 
        title={editingItem ? "Kurum Hakedişini Düzenle" : "Yeni Kurum Hakedişi"}
        size="lg"
      >
        <InstitutionForm 
          onSubmit={handleInstitutionSubmit}
          initialData={editingItem}
          onCancel={() => { setShowNewInstitutionModal(false); setEditingItem(null); }}
        />
      </Drawer>

      <Drawer 
        isOpen={showNewInstitutionExpenseModal} 
        onClose={() => { setShowNewInstitutionExpenseModal(false); setEditingItem(null); }} 
        title={editingItem ? "Kurum Masrafını Düzenle" : "Yeni Kurum Masrafı"}
        size="lg"
      >
        <InstitutionExpenseForm 
          onSubmit={handleInstitutionExpenseSubmit}
          initialData={editingItem}
          onCancel={() => { setShowNewInstitutionExpenseModal(false); setEditingItem(null); }}
        />
      </Drawer>

      <Drawer 
        isOpen={showNewFileModal} 
        onClose={() => { setShowNewFileModal(false); setEditingItem(null); }} 
        title={editingItem ? "Dosyayı Düzenle" : "Yeni Serbest Dosya"}
        size="lg"
      >
        <FileForm 
          onSubmit={handleFileSubmit}
          initialData={editingItem}
          onCancel={() => { setShowNewFileModal(false); setEditingItem(null); }}
        />
      </Drawer>

      <Drawer 
        isOpen={showNewLegalExpenseModal} 
        onClose={() => { setShowNewLegalExpenseModal(false); setEditingItem(null); }} 
        title={editingItem ? "Dosya Masrafını Düzenle" : "Serbest Dosya Masrafı"}
        size="lg"
      >
        <LegalExpenseForm 
          onSubmit={handleLegalExpenseSubmit}
          initialData={editingItem}
          onCancel={() => { setShowNewLegalExpenseModal(false); setEditingItem(null); }}
          dosyalar={dosyalar}
        />
      </Drawer>

      <ExpenseSheet 
        open={showNewExpenseModal} 
        onOpenChange={(open) => { 
          setShowNewExpenseModal(open); 
          if (!open) setEditingItem(null); 
        }} 
        onSubmit={handleExpenseSubmit}
        initialData={editingItem}
      />

      {/* AYARLAR MODAL */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="⚙️ Ayarlar">
        <div className="flex flex-col gap-5">
          <div>
            <Label htmlFor="firmName" className="text-sm font-semibold text-gray-700 mb-2 block">Firma Adı</Label>
            <Input 
              id="firmName"
              className="w-full" 
              value={settings.firmName} 
              onChange={(e) => setSettings({...settings, firmName: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="currency" className="text-sm font-semibold text-gray-700 mb-2 block">Para Birimi</Label>
            <select 
              id="currency"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-white"
              value={settings.currency}
              onChange={(e) => setSettings({...settings, currency: e.target.value})}
            >
              <option value="TRY">₺ Türk Lirası (TRY)</option>
              <option value="USD">$ Amerikan Doları (USD)</option>
              <option value="EUR">€ Euro (EUR)</option>
            </select>
          </div>
          <div>
            <Label htmlFor="kdvRate" className="text-sm font-semibold text-gray-700 mb-2 block">KDV Oranı (%)</Label>
            <Input 
              id="kdvRate"
              type="number"
              className="w-full" 
              value={settings.kdvRate} 
              onChange={(e) => setSettings({...settings, kdvRate: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <Label htmlFor="notificationDays" className="text-sm font-semibold text-gray-700 mb-2 block">Bildirim Günü (Ödenmemiş işlemler için)</Label>
            <Input 
              id="notificationDays"
              type="number"
              className="w-full" 
              value={settings.notificationDays} 
              onChange={(e) => setSettings({...settings, notificationDays: parseInt(e.target.value)})}
            />
          </div>
          <Button 
            onClick={() => {
              setShowSettingsModal(false);
              toast.success('Ayarlar başarıyla kaydedildi', {
                description: 'Değişiklikler uygulandı'
              });
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Kaydet
          </Button>
        </div>
      </Modal>

      {/* DETAY DRAWER - Sağdan açılır */}
      <Drawer 
        isOpen={detailModal.isOpen} 
        onClose={closeDetailModal} 
        size="lg"
        title={
          detailModal.type === 'file' ? '📁 Dosya Detayları' :
          detailModal.type === 'institution' ? '🏢 Kurum Hakediş Detayları' :
          detailModal.type === 'institutionExpense' ? '💼 Kurum Masraf Detayları' :
          detailModal.type === 'legalExpense' ? '⚖️ Dosya Masraf Detayları' :
          detailModal.type === 'expense' ? '💰 Gider Detayları' : 'Detaylar'
        }
      >
        <div className="space-y-1">
          {detailModal.item && detailModal.type === 'file' && (
            <div className="bg-white rounded-lg">
              <DetailField 
                label="Dosya Numarası" 
                value={<span className="text-blue-600 font-bold">{detailModal.item.dosya_no}</span>}
                icon={FileText}
              />
              <DetailField 
                label="Müvekkil Adı" 
                value={detailModal.item.muvekkil_adi}
                icon={Briefcase}
              />
              <div className="bg-green-50 p-4 rounded-lg my-2">
                <DetailField 
                  label="Tahsil Edilen" 
                  value={<span className="text-xl text-green-700 font-bold">{formatPara(detailModal.item.tahsil_edilen)}</span>}
                  icon={CheckCircle}
                />
              </div>
              <div className="bg-amber-50 p-4 rounded-lg my-2">
                <DetailField 
                  label="Tahsil Edilecek" 
                  value={<span className="text-xl text-amber-700 font-bold">{formatPara(detailModal.item.tahsil_edilecek)}</span>}
                  icon={Clock}
                />
              </div>
              {detailModal.item.notes && (
                <DetailField 
                  label="Notlar" 
                  value={<p className="text-sm text-gray-700 whitespace-pre-wrap">{detailModal.item.notes}</p>}
                />
              )}
              {detailModal.item.created_at && (
                <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                  Oluşturulma: {new Date(detailModal.item.created_at).toLocaleString('tr-TR')}
                </div>
              )}
            </div>
          )}

          {detailModal.item && detailModal.type === 'institution' && (
            <div className="bg-white rounded-lg">
              <DetailField 
                label="Kurum Adı" 
                value={<span className="text-indigo-600 font-bold text-lg">{detailModal.item.kurum_adi}</span>}
                icon={Building2}
              />
              <DetailField 
                label="Dosya Numarası" 
                value={detailModal.item.dosya_no}
                icon={FileText}
              />
              <div className="bg-blue-50 p-4 rounded-lg my-2">
                <DetailField 
                  label="Tahsil Tutarı" 
                  value={<span className="text-xl text-blue-900 font-bold">{formatPara(detailModal.item.tahsil_tutar)}</span>}
                  icon={DollarSign}
                />
              </div>
              <DetailField 
                label="Vekalet Oranı" 
                value={<span className="font-semibold">%{detailModal.item.vekalet_orani}</span>}
              />
              <div className="bg-green-50 p-4 rounded-lg my-2">
                <DetailField 
                  label="Net Hakediş" 
                  value={<span className="text-2xl text-green-700 font-bold">{formatPara(detailModal.item.net_hakedis)}</span>}
                  icon={TrendingUp}
                />
              </div>
              <DetailField 
                label="Ödeme Durumu" 
                value={
                  <DrawerBadge variant={detailModal.item.odendi ? 'success' : 'warning'}>
                    {detailModal.item.odendi ? '✓ Tahsil Edildi' : '⏳ Bekliyor'}
                  </DrawerBadge>
                }
              />
              {detailModal.item.notes && (
                <DetailField 
                  label="Notlar" 
                  value={<p className="text-sm text-gray-700 whitespace-pre-wrap">{detailModal.item.notes}</p>}
                />
              )}
              {detailModal.item.created_at && (
                <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                  Oluşturulma: {new Date(detailModal.item.created_at).toLocaleString('tr-TR')}
                </div>
              )}
            </div>
          )}

          {detailModal.item && detailModal.type === 'institutionExpense' && (
            <div className="bg-white rounded-lg">
              <DetailField 
                label="Açıklama" 
                value={<span className="font-bold text-gray-800">{detailModal.item.aciklama}</span>}
                icon={FileText}
              />
              <DetailField 
                label="Masraf Türü" 
                value={<DrawerBadge variant="info">{detailModal.item.masraf_turu}</DrawerBadge>}
              />
              <div className="bg-red-50 p-4 rounded-lg my-2">
                <DetailField 
                  label="Tutar" 
                  value={<span className="text-2xl text-red-600 font-bold">{formatPara(detailModal.item.tutar)}</span>}
                  icon={DollarSign}
                />
              </div>
              <DetailField 
                label="Masraf Tarihi" 
                value={detailModal.item.tarih ? new Date(detailModal.item.tarih).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                icon={Clock}
              />
              <DetailField 
                label="Ödeme Durumu" 
                value={
                  <DrawerBadge variant={detailModal.item.odendi ? 'success' : 'danger'}>
                    {detailModal.item.odendi ? '✓ Ödendi' : '⏳ Ödenmedi'}
                  </DrawerBadge>
                }
              />
              {detailModal.item.notes && (
                <DetailField 
                  label="Notlar" 
                  value={<p className="text-sm text-gray-700 whitespace-pre-wrap">{detailModal.item.notes}</p>}
                />
              )}
              {detailModal.item.created_at && (
                <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                  Oluşturulma: {new Date(detailModal.item.created_at).toLocaleString('tr-TR')}
                </div>
              )}
            </div>
          )}

          {detailModal.item && detailModal.type === 'legalExpense' && (
            <div className="bg-white rounded-lg">
              <DetailField 
                label="İlgili Dosya" 
                value={
                  <span className="text-blue-600 font-bold">
                    {dosyalar.find(d => d.id === detailModal.item.dosya_id)?.dosya_no || 'Dosya Bulunamadı'}
                  </span>
                }
                icon={Briefcase}
              />
              <DetailField 
                label="Masraf Türü" 
                value={<DrawerBadge variant="warning">{detailModal.item.masraf_turu}</DrawerBadge>}
              />
              <div className="bg-red-50 p-4 rounded-lg my-2">
                <DetailField 
                  label="Tutar" 
                  value={<span className="text-2xl text-red-600 font-bold">{formatPara(detailModal.item.tutar)}</span>}
                  icon={DollarSign}
                />
              </div>
              <DetailField 
                label="Masraf Tarihi" 
                value={detailModal.item.tarih ? new Date(detailModal.item.tarih).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                icon={Clock}
              />
              <DetailField 
                label="Ödeme Durumu" 
                value={
                  <DrawerBadge variant={detailModal.item.odendi ? 'success' : 'danger'}>
                    {detailModal.item.odendi ? '✓ Ödendi' : '⏳ Ödenmedi'}
                  </DrawerBadge>
                }
              />
              {detailModal.item.notes && (
                <DetailField 
                  label="Notlar" 
                  value={<p className="text-sm text-gray-700 whitespace-pre-wrap">{detailModal.item.notes}</p>}
                />
              )}
              {detailModal.item.created_at && (
                <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                  Oluşturulma: {new Date(detailModal.item.created_at).toLocaleString('tr-TR')}
                </div>
              )}
            </div>
          )}

          {detailModal.item && detailModal.type === 'expense' && (
            <div className="bg-white rounded-lg">
              <DetailField 
                label="Kategori" 
                value={<DrawerBadge variant="info">{detailModal.item.kategori}</DrawerBadge>}
                icon={Wallet}
              />
              <DetailField 
                label="Açıklama" 
                value={<span className="font-bold text-gray-800">{detailModal.item.aciklama}</span>}
                icon={FileText}
              />
              <div className="bg-red-50 p-4 rounded-lg my-2">
                <DetailField 
                  label="Tutar" 
                  value={<span className="text-2xl text-red-600 font-bold">{formatPara(detailModal.item.tutar)}</span>}
                  icon={DollarSign}
                />
              </div>
              <DetailField 
                label="Gider Tarihi" 
                value={detailModal.item.tarih ? new Date(detailModal.item.tarih).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                icon={Clock}
              />
              {detailModal.item.notes && (
                <DetailField 
                  label="Notlar" 
                  value={<p className="text-sm text-gray-700 whitespace-pre-wrap">{detailModal.item.notes}</p>}
                />
              )}
              {detailModal.item.created_at && (
                <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                  Oluşturulma: {new Date(detailModal.item.created_at).toLocaleString('tr-TR')}
                </div>
              )}
            </div>
          )}
        </div>
      </Drawer>
      
      {/* Advanced Feature Modals */}
      {showCalendar && (
        <Modal isOpen={showCalendar} onClose={() => setShowCalendar(false)} title="Takvim & Hatırlatmalar">
          <CalendarView 
            files={dosyalar}
            expenses={giderler}
          />
        </Modal>
      )}
      
      {showEmailSettings && (
        <Modal isOpen={showEmailSettings} onClose={() => setShowEmailSettings(false)} title="E-posta Bildirimleri">
          <EmailNotifications 
            isOpen={showEmailSettings}
            onClose={() => setShowEmailSettings(false)}
            emailData={{ dosyalar, giderler }}
          />
        </Modal>
      )}
      
      {showAnalytics && (
        <Modal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} title="Gelişmiş Analizler">
          <AdvancedAnalytics 
            isOpen={showAnalytics}
            onClose={() => setShowAnalytics(false)}
            data={{ dosyalar, kurumDosyalari, giderler, takipMasraflari, kurumMasraflari }}
            settings={settings}
          />
        </Modal>
      )}
      
      {showBackupManager && (
        <Modal isOpen={showBackupManager} onClose={() => setShowBackupManager(false)} title="Yedekleme Yöneticisi">
          <BackupManager 
            isOpen={showBackupManager}
            onClose={() => setShowBackupManager(false)}
          />
        </Modal>
      )}
      
      {showAuditLog && (
        <Modal isOpen={showAuditLog} onClose={() => setShowAuditLog(false)} title="İşlem Geçmişi">
          <AuditLogViewer 
            isOpen={showAuditLog}
            onClose={() => setShowAuditLog(false)}
            logs={[]}
          />
        </Modal>
      )}
      
      {showReminders && (
        <Modal isOpen={showReminders} onClose={() => setShowReminders(false)} title="Hatırlatma Sistemi">
          <ReminderSystem 
            dosyalar={dosyalar}
            kurumDosyalari={kurumDosyalari}
          />
        </Modal>
      )}
      
      {showImporter && (
        <Modal isOpen={showImporter} onClose={() => setShowImporter(false)} title="Veri Yükle (Excel/CSV)">
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <button
              className={iconButtonStyle + " text-green-700 border-green-300 w-full justify-center"}
              style={{ fontSize: '1.1rem' }}
              disabled
            >
              <Upload size={24} className="text-green-600" />
              <span>Excel/CSV Yükle</span>
            </button>
            <div className="w-full max-w-xl">
              <DataImporter 
                isOpen={showImporter}
                onClose={() => setShowImporter(false)}
                onImport={(data) => console.log('İçe aktarılan veri:', data)}
              />
            </div>
          </div>
        </Modal>
      )}
      
      {showSettingsModal && (
        <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Sistem Ayarları">
          <SettingsPanel 
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            settings={settings}
            onSave={setSettings}
          />
        </Modal>
      )}
      
      {showKeyboardHelp && (
        <Modal isOpen={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)} title="Klavye Kısayolları">
          <KeyboardShortcutsHelp 
            isOpen={showKeyboardHelp}
            onClose={() => setShowKeyboardHelp(false)}
          />
        </Modal>
      )}
      
      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter 
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
      
      {/* Toast Notifications */}
      <Toaster position="bottom-right" richColors closeButton />
      
    </Layout>
  );
};

export default App;