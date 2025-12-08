import React, { useState, useMemo, useRef, useEffect, useCallback, useReducer } from 'react';
import { createPortal } from 'react-dom';
import { Download, Plus, Calculator, FileText, TrendingUp, DollarSign, Trash2, X, Upload, AlertCircle, Check, Save, RotateCcw, Home, Briefcase, Building2 } from 'lucide-react';
import * as XLSX from 'xlsx';

const FIRM_NAME = 'MALKOÇ & BAHADIR HUKUK VE DANIŞMANLIK';
const STORAGE_KEY = 'hukuk_buro_data';

const formatPara = (tutar) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(tutar || 0);
};

// Data reducer for centralized state management with undo/redo
const dataReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FILE':
      return {
        ...state,
        dosyalar: [...state.dosyalar, action.payload],
        history: [...state.history, state.dosyalar]
      };
    case 'DELETE_FILE':
      return {
        ...state,
        dosyalar: state.dosyalar.filter(d => d.id !== action.payload),
        history: [...state.history, state.dosyalar]
      };
    case 'UPDATE_FILE':
      return {
        ...state,
        dosyalar: state.dosyalar.map(d => d.id === action.payload.id ? action.payload : d),
        history: [...state.history, state.dosyalar]
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        giderler: [...state.giderler, action.payload],
        history: [...state.history, state.giderler]
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        giderler: state.giderler.filter(g => g.id !== action.payload),
        history: [...state.history, state.giderler]
      };
    case 'ADD_INSTITUTION':
      return {
        ...state,
        kurumDosyalari: [...state.kurumDosyalari, action.payload],
        history: [...state.history, state.kurumDosyalari]
      };
    case 'DELETE_INSTITUTION':
      return {
        ...state,
        kurumDosyalari: state.kurumDosyalari.filter(k => k.id !== action.payload),
        history: [...state.history, state.kurumDosyalari]
      };
    case 'LOAD_FILES':
      return { ...state, dosyalar: action.payload };
    case 'LOAD_EXPENSES':
      return { ...state, giderler: action.payload };
    case 'LOAD_INSTITUTIONS':
      return { ...state, kurumDosyalari: action.payload };
    case 'BULK_ADD_FILES':
      return {
        ...state,
        dosyalar: [...state.dosyalar, ...action.payload],
        history: [...state.history, state.dosyalar]
      };
    case 'BULK_ADD_EXPENSES':
      return {
        ...state,
        giderler: [...state.giderler, ...action.payload],
        history: [...state.history, state.giderler]
      };
    case 'BULK_ADD_INSTITUTIONS':
      return {
        ...state,
        kurumDosyalari: [...state.kurumDosyalari, ...action.payload],
        history: [...state.history, state.kurumDosyalari]
      };
    case 'RESET':
      return action.payload;
    default:
      return state;
  }
};

// Initial data state
const getInitialDataState = () => ({
  dosyalar: [
    {
      id: 1,
      dosyaNo: 'D-2024-001',
      muvekkilAdi: 'Ahmet Yılmaz',
      dosyaTuru: 'İcra Takibi',
      acilisTarihi: '2024-01-15',
      kapanisTarihi: '',
      durum: 'Devam Ediyor',
      tahsilEdilen: 25000,
      tahsilEdilecek: 15000,
      karsiTarafVekalet: 8000,
      icraMasraf: 3500,
      digerGider: 1200
    }
  ],
  kurumDosyalari: [
    {
      id: 1,
      kurumAdi: 'ABC Finans A.Ş.',
      sozlesmeNo: 'SZ-2024-01',
      dosyaNo: 'İ-2024-100',
      borcluAdi: 'Mehmet Demir',
      asilAlacak: 50000,
      takipBaslangic: '2024-02-01',
      tahsilatTarihi: '2024-03-15',
      tahsilTutar: 50000,
      vekaletOrani: 10,
      faturaKesildi: 'Evet',
      tahsilEdildi: 'Evet',
      odenenmMasraf: 2500,
      geriAlinacakMasraf: 2500
    }
  ],
  giderler: [
    {
      id: 1,
      tarih: '2024-01-05',
      aciklama: 'Büro Kirası',
      kategori: 'Kira',
      tutar: 15000,
      faturaNo: 'F-2024-001',
      odendi: 'Evet'
    },
    {
      id: 2,
      tarih: '2024-01-10',
      aciklama: 'Sekreter Maaşı',
      kategori: 'Personel',
      tutar: 20000,
      faturaNo: '',
      odendi: 'Evet'
    }
  ],
  history: []
});

// Modal Component with portal, focus trap, ESC handling and accessibility improvements
const Modal = ({ isOpen, onClose, title, children, size = 'max-w-2xl' }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement;

    // small timeout to ensure elements are mounted
    setTimeout(() => {
      const nodes = contentRef.current?.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (nodes && nodes.length > 0) nodes[0].focus();
      else if (contentRef.current) contentRef.current.focus();
    }, 0);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        console.log('Modal ESC pressed - closing', title);
        onClose();
      }

      if (e.key === 'Tab') {
        const nodes = contentRef.current?.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    console.log('Modal opened:', title);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow || '';
      try {
        if (previouslyFocused.current && previouslyFocused.current.focus) previouslyFocused.current.focus();
      } catch (err) {
        // ignore
      }
      console.log('Modal closed:', title);
    };
  }, [isOpen, onClose, title]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (e) => {
    if (e.target === overlayRef.current) {
      console.log('Modal overlay clicked - closing', title);
      onClose();
    }
  };

  return createPortal(
    <div ref={overlayRef} onMouseDown={handleOverlayMouseDown} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={contentRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1} className={`bg-white rounded-lg shadow-xl ${size} w-full max-h-[80vh] overflow-y-auto`}>
        <div className="flex justify-between items-center sticky top-0 bg-white p-6 border-b">
          <h2 id="modal-title" className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={() => { console.log('Modal close button clicked', title); onClose(); }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Kapat"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Alert component for notifications
const Alert = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                  type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                  'bg-blue-50 border-blue-200 text-blue-800';

  const icon = type === 'success' ? <Check size={20} /> :
               type === 'error' ? <AlertCircle size={20} /> :
               <AlertCircle size={20} />;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg border ${bgColor} flex items-center gap-3 z-40`}>
      {icon}
      <span>{message}</span>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  const [showNewInstitutionModal, setShowNewInstitutionModal] = useState(false);
  const [alert, setAlert] = useState(null);

  // Data state with reducer
  const [dataState, dispatch] = useReducer(dataReducer, getInitialDataState(), (initial) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initial;
    } catch (e) {
      return initial;
    }
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataState));
  }, [dataState]);

  const { dosyalar, kurumDosyalari, giderler } = dataState;

  // Refs for modal inputs
  const fileFormRef = useRef({
    dosyaNo: '',
    muvekkilAdi: '',
    dosyaTuru: 'İcra Takibi',
    acilisTarihi: new Date().toISOString().split('T')[0],
    kapanisTarihi: '',
    durum: 'Devam Ediyor',
    tahsilEdilen: 0,
    tahsilEdilecek: 0,
    karsiTarafVekalet: 0,
    icraMasraf: 0,
    digerGider: 0
  });

  const expenseFormRef = useRef({
    tarih: new Date().toISOString().split('T')[0],
    aciklama: '',
    kategori: 'Kira',
    tutar: 0,
    faturaNo: '',
    odendi: 'Hayır'
  });

  const institutionFormRef = useRef({
    kurumAdi: '',
    sozlesmeNo: '',
    dosyaNo: '',
    borcluAdi: '',
    asilAlacak: 0,
    takipBaslangic: new Date().toISOString().split('T')[0],
    tahsilatTarihi: '',
    tahsilTutar: 0,
    vekaletOrani: 10,
    faturaKesildi: 'Hayır',
    tahsilEdildi: 'Hayır',
    odenenmMasraf: 0,
    geriAlinacakMasraf: 0
  });

  const [fileForm, setFileForm] = useState(fileFormRef.current);
  const [expenseForm, setExpenseForm] = useState(expenseFormRef.current);
  const [institutionForm, setInstitutionForm] = useState(institutionFormRef.current);

  const fileInputRef = useRef(null);
  const expenseInputRef = useRef(null);
  const institutionInputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (showNewFileModal && fileInputRef.current) {
      setTimeout(() => fileInputRef.current?.focus(), 50);
    }
  }, [showNewFileModal]);

  useEffect(() => {
    if (showNewExpenseModal && expenseInputRef.current) {
      setTimeout(() => expenseInputRef.current?.focus(), 50);
    }
  }, [showNewExpenseModal]);

  useEffect(() => {
    if (showNewInstitutionModal && institutionInputRef.current) {
      setTimeout(() => institutionInputRef.current?.focus(), 50);
    }
  }, [showNewInstitutionModal]);

  // Memoized calculations
  const hesaplamalar = useMemo(() => {
    const serbestTahsilEdilen = dosyalar.reduce((sum, d) => sum + (d.tahsilEdilen || 0), 0);
    const serbestTahsilEdilecek = dosyalar.reduce((sum, d) => sum + (d.tahsilEdilecek || 0), 0);
    const karsiTarafVekalet = dosyalar.reduce((sum, d) => sum + (d.karsiTarafVekalet || 0), 0);

    const kurumHakedisler = kurumDosyalari.map(k => {
      const brutHakedis = (k.tahsilTutar || 0) * (k.vekaletOrani || 0) / 100;
      const kdv = brutHakedis * 0.20;
      const stopaj = brutHakedis * 0.20;
      const netHakedis = brutHakedis + kdv - stopaj;

      return {
        ...k,
        brutHakedis,
        kdv,
        stopaj,
        netHakedis
      };
    });

    const kurumToplamNet = kurumHakedisler.reduce((sum, k) => sum + k.netHakedis, 0);
    const kurumFaturaKesilmemis = kurumHakedisler.filter(k => k.faturaKesildi !== 'Evet').reduce((sum, k) => sum + k.netHakedis, 0);
    const kurumTahsilEdilmemis = kurumHakedisler.filter(k => k.tahsilEdildi !== 'Evet').reduce((sum, k) => sum + k.netHakedis, 0);

    const dosyaGiderleri = dosyalar.reduce((sum, d) => sum + (d.icraMasraf || 0) + (d.digerGider || 0), 0);
    const buroGiderleri = giderler.reduce((sum, g) => sum + (g.tutar || 0), 0);

    const toplamGelir = serbestTahsilEdilen + karsiTarafVekalet + kurumToplamNet;
    const toplamGider = dosyaGiderleri + buroGiderleri;
    const netKar = toplamGelir - toplamGider;

    return {
      serbestTahsilEdilen,
      serbestTahsilEdilecek,
      karsiTarafVekalet,
      kurumHakedisler,
      kurumToplamNet,
      kurumFaturaKesilmemis,
      kurumTahsilEdilmemis,
      dosyaGiderleri,
      buroGiderleri,
      toplamGelir,
      toplamGider,
      netKar
    };
  }, [dosyalar, kurumDosyalari, giderler]);

  // Callbacks for form handling
  const handleFileFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFileForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleExpenseFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleInstitutionFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setInstitutionForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const addNewFile = useCallback(() => {
    if (!fileForm.dosyaNo.trim() || !fileForm.muvekkilAdi.trim()) {
      setAlert({ type: 'error', message: 'Lütfen Dosya No ve Müvekkil Adı girin.' });
      return;
    }

    const newFile = {
      id: Math.max(...dosyalar.map(d => d.id), 0) + 1,
      ...fileForm,
      tahsilEdilen: parseFloat(fileForm.tahsilEdilen) || 0,
      tahsilEdilecek: parseFloat(fileForm.tahsilEdilecek) || 0,
      karsiTarafVekalet: parseFloat(fileForm.karsiTarafVekalet) || 0,
      icraMasraf: parseFloat(fileForm.icraMasraf) || 0,
      digerGider: parseFloat(fileForm.digerGider) || 0
    };

    dispatch({ type: 'ADD_FILE', payload: newFile });
    setFileForm(fileFormRef.current);
    setShowNewFileModal(false);
    setAlert({ type: 'success', message: 'Dosya başarıyla eklendi.' });
  }, [fileForm, dosyalar]);

  const addNewExpense = useCallback(() => {
    if (!expenseForm.aciklama.trim()) {
      setAlert({ type: 'error', message: 'Lütfen Açıklama girin.' });
      return;
    }

    const newExpense = {
      id: Math.max(...giderler.map(g => g.id), 0) + 1,
      ...expenseForm,
      tutar: parseFloat(expenseForm.tutar) || 0
    };

    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
    setExpenseForm(expenseFormRef.current);
    setShowNewExpenseModal(false);
    setAlert({ type: 'success', message: 'Gider başarıyla eklendi.' });
  }, [expenseForm, giderler]);

  const addNewInstitution = useCallback(() => {
    if (!institutionForm.kurumAdi.trim()) {
      setAlert({ type: 'error', message: 'Lütfen Kurum Adı girin.' });
      return;
    }

    const newInst = {
      id: Math.max(...kurumDosyalari.map(k => k.id), 0) + 1,
      ...institutionForm,
      asilAlacak: parseFloat(institutionForm.asilAlacak) || 0,
      tahsilTutar: parseFloat(institutionForm.tahsilTutar) || 0,
      vekaletOrani: parseFloat(institutionForm.vekaletOrani) || 0,
      odenenmMasraf: parseFloat(institutionForm.odenenmMasraf) || 0,
      geriAlinacakMasraf: parseFloat(institutionForm.geriAlinacakMasraf) || 0
    };

    dispatch({ type: 'ADD_INSTITUTION', payload: newInst });
    setInstitutionForm(institutionFormRef.current);
    setShowNewInstitutionModal(false);
    setAlert({ type: 'success', message: 'Kurum dosyası başarıyla eklendi.' });
  }, [institutionForm, kurumDosyalari]);

  const deleteFile = useCallback((id) => {
    dispatch({ type: 'DELETE_FILE', payload: id });
    setAlert({ type: 'success', message: 'Dosya silindi.' });
  }, []);

  const deleteExpense = useCallback((id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
    setAlert({ type: 'success', message: 'Gider silindi.' });
  }, []);

  const deleteInstitution = useCallback((id) => {
    dispatch({ type: 'DELETE_INSTITUTION', payload: id });
    setAlert({ type: 'success', message: 'Kurum dosyası silindi.' });
  }, []);

  // Excel export with improved formatting
  const excelIndir = useCallback(() => {
    try {
      const wb = XLSX.utils.book_new();

      const dashboardData = [
        ['Hukuk Bürosu Mali Takip Sistemi - Dashboard Özeti'],
        [''],
        ['Toplam Gelir', hesaplamalar.toplamGelir],
        ['Toplam Gider', hesaplamalar.toplamGider],
        ['Net Kar/Zarar', hesaplamalar.netKar],
        [''],
        ['Serbest Müvekkil - Tahsil Edilen', hesaplamalar.serbestTahsilEdilen],
        ['Serbest Müvekkil - Tahsil Edilecek', hesaplamalar.serbestTahsilEdilecek],
        ['Karşı Taraf Vekalet', hesaplamalar.karsiTarafVekalet],
        [''],
        ['Kurum Avukatlığı - Toplam Net Hakediş', hesaplamalar.kurumToplamNet],
        ['Kurum Avukatlığı - Fatura Kesilmemiş', hesaplamalar.kurumFaturaKesilmemis],
        ['Kurum Avukatlığı - Tahsil Edilmemiş', hesaplamalar.kurumTahsilEdilmemis]
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(dashboardData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Dashboard');

      const dosyaHeaders = ['Dosya No', 'Müvekkil Adı', 'Dosya Türü', 'Açılış Tarihi', 'Kapanış Tarihi', 'Durum', 'Tahsil Edilen', 'Tahsil Edilecek', 'Karşı Taraf Vekalet', 'İcra Masrafı', 'Diğer Gider'];
      const dosyaData = dosyalar.map(d => [d.dosyaNo, d.muvekkilAdi, d.dosyaTuru, d.acilisTarihi, d.kapanisTarihi, d.durum, d.tahsilEdilen, d.tahsilEdilecek, d.karsiTarafVekalet, d.icraMasraf, d.digerGider]);
      const ws2 = XLSX.utils.aoa_to_sheet([dosyaHeaders, ...dosyaData]);
      XLSX.utils.book_append_sheet(wb, ws2, 'Dosya Takip');

      const kurumHeaders = ['Kurum Adı', 'Sözleşme No', 'Dosya No', 'Borçlu Adı', 'Asıl Alacak', 'Takip Başlangıç', 'Tahsil Tarihi', 'Tahsil Tutarı', 'Vekalet %', 'Brüt Hakediş', 'KDV', 'Stopaj', 'Net Hakediş', 'Fatura', 'Tahsil'];
      const kurumData = hesaplamalar.kurumHakedisler.map(k => [k.kurumAdi, k.sozlesmeNo, k.dosyaNo, k.borcluAdi, k.asilAlacak, k.takipBaslangic, k.tahsilatTarihi, k.tahsilTutar, k.vekaletOrani, k.brutHakedis, k.kdv, k.stopaj, k.netHakedis, k.faturaKesildi, k.tahsilEdildi]);
      const ws3 = XLSX.utils.aoa_to_sheet([kurumHeaders, ...kurumData]);
      XLSX.utils.book_append_sheet(wb, ws3, 'Kurum Avukatlığı');

      const giderHeaders = ['Tarih', 'Açıklama', 'Kategori', 'Tutar', 'Fatura No', 'Ödendi mi?'];
      const giderData = giderler.map(g => [g.tarih, g.aciklama, g.kategori, g.tutar, g.faturaNo, g.odendi]);
      const ws4 = XLSX.utils.aoa_to_sheet([giderHeaders, ...giderData]);
      XLSX.utils.book_append_sheet(wb, ws4, 'Büro Giderleri');

      XLSX.writeFile(wb, `Mali_Takip_${new Date().toISOString().split('T')[0]}.xlsx`);
      setAlert({ type: 'success', message: 'Excel dosyası indirildi.' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Excel indirirken hata oluştu.' });
    }
  }, [hesaplamalar, dosyalar, giderler]);

  // Excel template indir (kullanıcının dolduracağı şablon)
  const excelTemplateIndir = useCallback(() => {
    try {
      const wb = XLSX.utils.book_new();

      const dosyaTemplate = [
        ['Dosya No', 'Müvekkil Adı', 'Dosya Türü', 'Açılış Tarihi', 'Kapanış Tarihi', 'Durum', 'Tahsil Edilen', 'Tahsil Edilecek', 'Karşı Taraf Vekalet', 'İcra Masrafı', 'Diğer Gider'],
        ['D-2025-001', 'Örnek Müvekkil', 'İcra Takibi', '2025-01-01', '', 'Devam Ediyor', 0, 0, 0, 0, 0]
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(dosyaTemplate);
      XLSX.utils.book_append_sheet(wb, ws1, 'Dosya Takip');

      const kurumTemplate = [
        ['Kurum Adı', 'Sözleşme No', 'Dosya No', 'Borçlu Adı', 'Asıl Alacak', 'Takip Başlangıç', 'Tahsil Tarihi', 'Tahsil Tutarı', 'Vekalet %', 'Fatura', 'Tahsil'],
        ['Örnek Kurum', 'SZ-2025-01', 'İ-2025-001', 'Örnek Borçlu', 0, '2025-01-01', '', 0, 10, 'Hayır', 'Hayır']
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(kurumTemplate);
      XLSX.utils.book_append_sheet(wb, ws2, 'Kurum Avukatlığı');

      const giderTemplate = [
        ['Tarih', 'Açıklama', 'Kategori', 'Tutar', 'Fatura No', 'Ödendi mi?'],
        ['2025-01-01', 'Örnek Gider', 'Kira', 0, '', 'Hayır']
      ];
      const ws3 = XLSX.utils.aoa_to_sheet(giderTemplate);
      XLSX.utils.book_append_sheet(wb, ws3, 'Büro Giderleri');

      XLSX.writeFile(wb, `Mali_Takip_Template_${new Date().toISOString().split('T')[0]}.xlsx`);
      setAlert({ type: 'success', message: 'Template indirildi.' });
    } catch (e) {
      setAlert({ type: 'error', message: 'Template indirme sırasında hata oluştu.' });
    }
  }, []);

  // Excel import with validation
  const handleExcelUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        let filesAdded = 0, expensesAdded = 0, institutionsAdded = 0;

        if (workbook.SheetNames.includes('Dosya Takip')) {
          const dosyaSheet = workbook.Sheets['Dosya Takip'];
          const dosyaData = XLSX.utils.sheet_to_json(dosyaSheet).filter(d => d['Dosya No']);
          const newDosyalar = dosyaData.map((d, idx) => ({
            id: Math.max(...dosyalar.map(x => x.id), 0) + idx + 1,
            dosyaNo: d['Dosya No'] || '',
            muvekkilAdi: d['Müvekkil Adı'] || '',
            dosyaTuru: d['Dosya Türü'] || 'İcra Takibi',
            acilisTarihi: d['Açılış Tarihi'] || '',
            kapanisTarihi: d['Kapanış Tarihi'] || '',
            durum: d['Durum'] || 'Devam Ediyor',
            tahsilEdilen: parseFloat(d['Tahsil Edilen']) || 0,
            tahsilEdilecek: parseFloat(d['Tahsil Edilecek']) || 0,
            karsiTarafVekalet: parseFloat(d['Karşı Taraf Vekalet']) || 0,
            icraMasraf: parseFloat(d['İcra Masrafı']) || 0,
            digerGider: parseFloat(d['Diğer Gider']) || 0
          }));
          if (newDosyalar.length > 0) {
            dispatch({ type: 'BULK_ADD_FILES', payload: newDosyalar });
            filesAdded = newDosyalar.length;
          }
        }

        if (workbook.SheetNames.includes('Kurum Avukatlığı')) {
          const kurumSheet = workbook.Sheets['Kurum Avukatlığı'];
          const kurumData = XLSX.utils.sheet_to_json(kurumSheet).filter(k => k['Kurum Adı']);
          const newKurum = kurumData.map((k, idx) => ({
            id: Math.max(...kurumDosyalari.map(x => x.id), 0) + idx + 1,
            kurumAdi: k['Kurum Adı'] || '',
            sozlesmeNo: k['Sözleşme No'] || '',
            dosyaNo: k['Dosya No'] || '',
            borcluAdi: k['Borçlu Adı'] || '',
            asilAlacak: parseFloat(k['Asıl Alacak']) || 0,
            takipBaslangic: k['Takip Başlangıç'] || '',
            tahsilatTarihi: k['Tahsil Tarihi'] || '',
            tahsilTutar: parseFloat(k['Tahsil Tutarı']) || 0,
            vekaletOrani: parseFloat(k['Vekalet %']) || 10,
            faturaKesildi: k['Fatura'] || 'Hayır',
            tahsilEdildi: k['Tahsil'] || 'Hayır',
            odenenmMasraf: 0,
            geriAlinacakMasraf: 0
          }));
          if (newKurum.length > 0) {
            dispatch({ type: 'BULK_ADD_INSTITUTIONS', payload: newKurum });
            institutionsAdded = newKurum.length;
          }
        }

        if (workbook.SheetNames.includes('Büro Giderleri')) {
          const giderSheet = workbook.Sheets['Büro Giderleri'];
          const giderData = XLSX.utils.sheet_to_json(giderSheet).filter(g => g['Açıklama']);
          const newGiderler = giderData.map((g, idx) => ({
            id: Math.max(...giderler.map(x => x.id), 0) + idx + 1,
            tarih: g['Tarih'] || '',
            aciklama: g['Açıklama'] || '',
            kategori: g['Kategori'] || 'Diğer',
            tutar: parseFloat(g['Tutar']) || 0,
            faturaNo: g['Fatura No'] || '',
            odendi: g['Ödendi mi?'] || 'Hayır'
          }));
          if (newGiderler.length > 0) {
            dispatch({ type: 'BULK_ADD_EXPENSES', payload: newGiderler });
            expensesAdded = newGiderler.length;
          }
        }

        setAlert({
          type: 'success',
          message: `Excel yüklendi: ${filesAdded} dosya, ${expensesAdded} gider, ${institutionsAdded} kurum`
        });
        event.target.value = '';
      } catch (error) {
        setAlert({ type: 'error', message: 'Excel dosyasını okurken hata oluştu.' });
      }
    };
    reader.readAsBinaryString(file);
  }, [dosyalar, giderler, kurumDosyalari]);

  const resetAllData = useCallback(() => {
    if (window.confirm('Tüm verileri sıfırlamak istediğinize emin misiniz?')) {
      dispatch({ type: 'RESET', payload: getInitialDataState() });
      setAlert({ type: 'success', message: 'Veriler sıfırlandı.' });
    }
  }, []);

  // KPI Card Component
  const KPICard = ({ title, value, icon: Icon, color }) => (
    <div className={`${color} rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <Icon size={32} className="opacity-20" />
      </div>
    </div>
  );

  // Table component with responsive design
  const TableContainer = ({ headers, rows, onDelete }) => (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-100 border-b sticky top-0">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                {h}
              </th>
            ))}
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length + 1} className="px-4 py-8 text-center text-gray-500">
                Veri bulunamadı
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                {row.cells.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-sm text-gray-700">
                    {cell}
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onDelete(row.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                    title="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-700 to-blue-900 text-white transition-all duration-300 shadow-lg flex flex-col`}>
        <div className="p-4 border-b border-blue-600">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center text-blue-200 hover:text-white transition-colors"
          >
            <Download size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'dosyalar', label: 'Dosya Takip', icon: Briefcase },
            { id: 'kurum', label: 'Kurum Avukatlığı', icon: Building2 },
            { id: 'giderler', label: 'Büro Giderleri', icon: Calculator }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 border-r-4 border-white'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
                title={tab.label}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="border-t border-blue-600 p-4 text-xs text-blue-200">
            <p className="font-semibold text-white text-center mb-2">{FIRM_NAME}</p>
            <p className="text-center">© 2024</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{FIRM_NAME}</h1>
              <p className="text-sm text-gray-500 mt-1">Mali Takip Sistemi</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetAllData}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="Verileri Sıfırla"
              >
                <RotateCcw size={20} />
              </button>

              <button
                onClick={excelIndir}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={18} />
                <span className="hidden sm:inline">İndir</span>
              </button>

              <button
                onClick={excelTemplateIndir}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Boş Excel Şablonu İndir"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Template İndir</span>
              </button>

              <label className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer">
                <Upload size={16} />
                <span className="hidden sm:inline">Yükle</span>
                <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard
                    title="Toplam Gelir"
                    value={formatPara(hesaplamalar.toplamGelir)}
                    icon={TrendingUp}
                    color="bg-gradient-to-br from-green-50 to-green-100 text-green-700"
                  />
                  <KPICard
                    title="Toplam Gider"
                    value={formatPara(hesaplamalar.toplamGider)}
                    icon={DollarSign}
                    color="bg-gradient-to-br from-red-50 to-red-100 text-red-700"
                  />
                  <KPICard
                    title="Net Kar/Zarar"
                    value={formatPara(hesaplamalar.netKar)}
                    icon={Calculator}
                    color={`bg-gradient-to-br ${hesaplamalar.netKar >= 0 ? 'from-blue-50 to-blue-100 text-blue-700' : 'from-orange-50 to-orange-100 text-orange-700'}`}
                  />
                  <KPICard
                    title="Tahsil Edilecek"
                    value={formatPara(hesaplamalar.serbestTahsilEdilecek)}
                    icon={FileText}
                    color="bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-700"
                  />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Kurum Avukatlığı Özeti</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                      <p className="text-sm text-purple-700 font-medium">Toplam Net Hakediş</p>
                      <p className="text-xl font-bold text-purple-900 mt-2">{formatPara(hesaplamalar.kurumToplamNet)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                      <p className="text-sm text-orange-700 font-medium">Fatura Kesilmemiş</p>
                      <p className="text-xl font-bold text-orange-900 mt-2">{formatPara(hesaplamalar.kurumFaturaKesilmemis)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
                      <p className="text-sm text-pink-700 font-medium">Tahsil Edilmemiş</p>
                      <p className="text-xl font-bold text-pink-900 mt-2">{formatPara(hesaplamalar.kurumTahsilEdilmemis)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dosyalar' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Serbest Müvekkil Dosyaları ({dosyalar.length})</h2>
                  <button
                    onClick={() => setShowNewFileModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    Yeni Dosya
                  </button>
                </div>

                <TableContainer
                  headers={['Dosya No', 'Müvekkil', 'Türü', 'Durum', 'Tahsil Edilen', 'Tahsil Edilecek']}
                  rows={dosyalar.map(d => ({
                    id: d.id,
                    cells: [
                      d.dosyaNo,
                      d.muvekkilAdi,
                      d.dosyaTuru,
                      <span className={`px-2 py-1 rounded text-xs font-medium ${d.durum === 'Devam Ediyor' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {d.durum}
                      </span>,
                      formatPara(d.tahsilEdilen),
                      formatPara(d.tahsilEdilecek)
                    ]
                  }))}
                  onDelete={deleteFile}
                />
              </div>
            )}

            {activeTab === 'kurum' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Kurum Avukatlığı Dosyaları ({kurumDosyalari.length})</h2>
                  <button
                    onClick={() => setShowNewInstitutionModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    Yeni Kurum
                  </button>
                </div>

                <TableContainer
                  headers={['Kurum', 'Dosya No', 'Borçlu', 'Tahsil', 'Vekalet %', 'Net Hakediş']}
                  rows={hesaplamalar.kurumHakedisler.map(k => ({
                    id: k.id,
                    cells: [
                      k.kurumAdi,
                      k.dosyaNo,
                      k.borcluAdi,
                      formatPara(k.tahsilTutar),
                      `${k.vekaletOrani}%`,
                      <span className="font-bold text-blue-600">{formatPara(k.netHakedis)}</span>
                    ]
                  }))}
                  onDelete={deleteInstitution}
                />
              </div>
            )}

            {activeTab === 'giderler' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h2 className="text-xl font-bold text-gray-800">Büro Giderleri ({giderler.length})</h2>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer">
                      <Upload size={18} />
                      <span className="hidden sm:inline">Yükle</span>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleExcelUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => setShowNewExpenseModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={18} />
                      Yeni Gider
                    </button>
                  </div>
                </div>

                <TableContainer
                  headers={['Tarih', 'Açıklama', 'Kategori', 'Tutar', 'Ödendi']}
                  rows={giderler.map(g => ({
                    id: g.id,
                    cells: [
                      g.tarih,
                      g.aciklama,
                      g.kategori,
                      formatPara(g.tutar),
                      <span className={`px-2 py-1 rounded text-xs font-medium ${g.odendi === 'Evet' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {g.odendi}
                      </span>
                    ]
                  }))}
                  onDelete={deleteExpense}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showNewFileModal}
        onClose={() => setShowNewFileModal(false)}
        title="Yeni Dosya Ekle"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              ref={fileInputRef}
              type="text"
              name="dosyaNo"
              placeholder="Dosya No"
              value={fileForm.dosyaNo}
              onChange={handleFileFormChange}
              className="col-span-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="muvekkilAdi"
              placeholder="Müvekkil Adı"
              value={fileForm.muvekkilAdi}
              onChange={handleFileFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="dosyaTuru"
              value={fileForm.dosyaTuru}
              onChange={handleFileFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>İcra Takibi</option>
              <option>Arabuluculuk</option>
              <option>Davacılık</option>
            </select>
            <input
              type="date"
              name="acilisTarihi"
              value={fileForm.acilisTarihi}
              onChange={handleFileFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="tahsilEdilen"
              placeholder="Tahsil Edilen"
              value={fileForm.tahsilEdilen}
              onChange={handleFileFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="tahsilEdilecek"
              placeholder="Tahsil Edilecek"
              value={fileForm.tahsilEdilecek}
              onChange={handleFileFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => setShowNewFileModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={addNewFile}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={18} />
              Kaydet
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showNewExpenseModal}
        onClose={() => setShowNewExpenseModal(false)}
        title="Yeni Gider Ekle"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              name="tarih"
              value={expenseForm.tarih}
              onChange={handleExpenseFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              ref={expenseInputRef}
              type="text"
              name="aciklama"
              placeholder="Açıklama"
              value={expenseForm.aciklama}
              onChange={handleExpenseFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="kategori"
              value={expenseForm.kategori}
              onChange={handleExpenseFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Kira</option>
              <option>Personel</option>
              <option>Elektrik</option>
              <option>Su</option>
              <option>İnternet</option>
              <option>Diğer</option>
            </select>
            <input
              type="number"
              name="tutar"
              placeholder="Tutar"
              value={expenseForm.tutar}
              onChange={handleExpenseFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="faturaNo"
              placeholder="Fatura No"
              value={expenseForm.faturaNo}
              onChange={handleExpenseFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="odendi"
              value={expenseForm.odendi}
              onChange={handleExpenseFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Evet</option>
              <option>Hayır</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => setShowNewExpenseModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={addNewExpense}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={18} />
              Kaydet
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showNewInstitutionModal}
        onClose={() => setShowNewInstitutionModal(false)}
        title="Yeni Kurum Dosyası Ekle"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              ref={institutionInputRef}
              type="text"
              name="kurumAdi"
              placeholder="Kurum Adı"
              value={institutionForm.kurumAdi}
              onChange={handleInstitutionFormChange}
              className="col-span-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="dosyaNo"
              placeholder="Dosya No"
              value={institutionForm.dosyaNo}
              onChange={handleInstitutionFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="sozlesmeNo"
              placeholder="Sözleşme No"
              value={institutionForm.sozlesmeNo}
              onChange={handleInstitutionFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="borcluAdi"
              placeholder="Borçlu Adı"
              value={institutionForm.borcluAdi}
              onChange={handleInstitutionFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="tahsilTutar"
              placeholder="Tahsil Tutarı"
              value={institutionForm.tahsilTutar}
              onChange={handleInstitutionFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="vekaletOrani"
              placeholder="Vekalet %"
              value={institutionForm.vekaletOrani}
              onChange={handleInstitutionFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="takipBaslangic"
              value={institutionForm.takipBaslangic}
              onChange={handleInstitutionFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="tahsilatTarihi"
              placeholder="Tahsilat Tarihi"
              value={institutionForm.tahsilatTarihi}
              onChange={handleInstitutionFormChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => setShowNewInstitutionModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={addNewInstitution}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={18} />
              Kaydet
            </button>
          </div>
        </div>
      </Modal>

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default App;
