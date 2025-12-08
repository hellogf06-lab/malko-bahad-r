import { useReducer, useEffect } from 'react';
import { STORAGE_KEY } from '../utils/constants';

// STATE YÖNETİMİ
const dataReducer = (state, action) => {
  switch (action.type) {
    // DOSYA
    case 'ADD_FILE': return { ...state, dosyalar: [...state.dosyalar, action.payload] };
    case 'EDIT_FILE': return { ...state, dosyalar: state.dosyalar.map(d => d.id === action.payload.id ? action.payload : d) };
    case 'DELETE_FILE': return { ...state, dosyalar: state.dosyalar.filter(d => d.id !== action.payload) };
    case 'ADD_LEGAL_EXPENSE': return { ...state, takipMasraflari: [...state.takipMasraflari, action.payload] };
    case 'EDIT_LEGAL_EXPENSE': return { ...state, takipMasraflari: state.takipMasraflari.map(m => m.id === action.payload.id ? action.payload : m) };
    case 'DELETE_LEGAL_EXPENSE': return { ...state, takipMasraflari: state.takipMasraflari.filter(m => m.id !== action.payload) };
    case 'TOGGLE_LEGAL_EXPENSE_PAID': return { 
        ...state, 
        takipMasraflari: state.takipMasraflari.map(m => m.id === action.payload ? { ...m, odendi: !m.odendi } : m) 
    };
    
    // KURUM
    case 'ADD_INSTITUTION': return { ...state, kurumDosyalari: [...state.kurumDosyalari, action.payload] };
    case 'EDIT_INSTITUTION': return { ...state, kurumDosyalari: state.kurumDosyalari.map(k => k.id === action.payload.id ? action.payload : k) };
    case 'DELETE_INSTITUTION': return { ...state, kurumDosyalari: state.kurumDosyalari.filter(k => k.id !== action.payload) };
    case 'TOGGLE_INSTITUTION_INCOME_PAID': return {
        ...state,
        kurumDosyalari: state.kurumDosyalari.map(k => k.id === action.payload ? { ...k, odendi: !k.odendi } : k)
    };

    case 'ADD_INSTITUTION_EXPENSE': return { ...state, kurumMasraflari: [...state.kurumMasraflari, action.payload] };
    case 'EDIT_INSTITUTION_EXPENSE': return { ...state, kurumMasraflari: state.kurumMasraflari.map(m => m.id === action.payload.id ? action.payload : m) };
    case 'DELETE_INSTITUTION_EXPENSE': return { ...state, kurumMasraflari: state.kurumMasraflari.filter(k => k.id !== action.payload) };
    case 'TOGGLE_INSTITUTION_EXPENSE_PAID': return { 
        ...state, 
        kurumMasraflari: state.kurumMasraflari.map(m => m.id === action.payload ? { ...m, odendi: !m.odendi } : m) 
    };

    // OFİS GİDER
    case 'ADD_EXPENSE': return { ...state, giderler: [...state.giderler, action.payload] };
    case 'EDIT_EXPENSE': return { ...state, giderler: state.giderler.map(g => g.id === action.payload.id ? action.payload : g) };
    case 'DELETE_EXPENSE': return { ...state, giderler: state.giderler.filter(g => g.id !== action.payload) };
    
    // GENEL
    case 'RESET': return action.payload;
    default: return state;
  }
};

const getInitialDataState = () => ({
  dosyalar: [
    { id: 1701612000001, dosyaNo: 'D-2023/001', muvekkilAdi: 'Ahmet Yılmaz', tahsilEdilen: 15000, not: 'İlk tahsilat yapıldı' },
    { id: 1701612000002, dosyaNo: 'D-2023/002', muvekkilAdi: 'Ayşe Kaya', tahsilEdilen: 8500, not: '' },
    { id: 1701612000003, dosyaNo: 'D-2023/003', muvekkilAdi: 'Mehmet Demir', tahsilEdilen: 12000, not: 'Dosya devam ediyor' }
  ],
  takipMasraflari: [
    { id: 1701612000004, dosyaId: 1701612000001, masrafTuru: 'Harç', tutar: 2500, odendi: true, tarih: '2023-11-15', not: 'Dava harçları' },
    { id: 1701612000005, dosyaId: 1701612000002, masrafTuru: 'Tebligat', tutar: 350, odendi: false, tarih: '2023-11-20', not: '' },
    { id: 1701612000006, dosyaId: 1701612000003, masrafTuru: 'Diğer', tutar: 1200, odendi: true, tarih: '2023-11-25', not: 'Bilirkişi ücreti' }
  ], 
  kurumDosyalari: [
    { id: 1701612000007, kurumAdi: 'Adalet Bakanlığı', dosyaNo: 'K-2023/001', tahsilTutar: 45000, vekaletOrani: 10, odendi: true, not: 'İlk ödeme alındı' },
    { id: 1701612000008, kurumAdi: 'SGK', dosyaNo: 'K-2023/002', tahsilTutar: 32000, vekaletOrani: 12, odendi: false, not: 'Ödeme bekleniyor' },
    { id: 1701612000009, kurumAdi: 'Maliye Bakanlığı', dosyaNo: 'K-2023/003', tahsilTutar: 68000, vekaletOrani: 15, odendi: true, not: 'Tamamlandı' }
  ],
  kurumMasraflari: [
    { id: 1701612000010, aciklama: 'Dosya Masrafı', masrafTuru: 'Dosya Masrafı', tutar: 1800, odendi: true, tarih: '2023-11-10', not: 'İdare mahkemesi' },
    { id: 1701612000011, aciklama: 'Harç Ödemesi', masrafTuru: 'Harç', tutar: 3500, odendi: false, tarih: '2023-11-18', not: '' },
    { id: 1701612000012, aciklama: 'Tebligat Gideri', masrafTuru: 'Tebligat', tutar: 450, odendi: true, tarih: '2023-11-22', not: 'İl dışı tebligat' }
  ], 
  giderler: [
    { id: 1701612000013, kategori: 'Kira', aciklama: 'Ofis Kirası - Kasım', tutar: 12000, tarih: '2023-11-01', not: 'Aylık ofis kirası' },
    { id: 1701612000014, kategori: 'Maaş', aciklama: 'Avukat Maaşı', tutar: 25000, tarih: '2023-11-05', not: '' },
    { id: 1701612000015, kategori: 'Elektrik', aciklama: 'Elektrik Faturası', tutar: 850, tarih: '2023-11-15', not: '' },
    { id: 1701612000016, kategori: 'İnternet', aciklama: 'İnternet + Telefon', tutar: 650, tarih: '2023-11-20', not: 'Kurumsal hat' },
    { id: 1701612000017, kategori: 'Kırtasiye', aciklama: 'Ofis Malzemeleri', tutar: 1200, tarih: '2023-11-25', not: 'Kağıt, kalem, dosya' }
  ]
});

export const useDataState = () => {
  const [dataState, dispatch] = useReducer(dataReducer, getInitialDataState(), (initial) => {
    try { 
      const saved = localStorage.getItem(STORAGE_KEY); 
      return saved ? JSON.parse(saved) : initial; 
    } catch (e) { 
      return initial; 
    }
  });

  useEffect(() => { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataState)); 
  }, [dataState]);

  return [dataState, dispatch];
};
