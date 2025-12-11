// Temel veri modelleri

export interface Dosya {
  id: number;
  user_id?: string;
  dosya_no: string;
  muvekkil_adi: string;
  tahsil_edilen: number;
  tahsil_edilecek: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TakipMasrafi {
  id: number;
  user_id?: string;
  dosya_id: number;
  masraf_turu: string;
  tutar: number;
  tarih: string;
  odendi: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KurumDosyasi {
  id: number;
  user_id?: string;
  kurum_adi: string;
  dosya_no: string;
  tahsil_tutar: number;
  vekalet_orani: number;
  net_hakedis?: number;
  odendi: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KurumMasrafi {
  id: number;
  user_id?: string;
  aciklama: string;
  masraf_turu: string;
  tutar: number;
  tarih: string;
  odendi: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Gider {
  id: number;
  user_id?: string;
  aciklama: string;
  kategori: string;
  tutar: number;
  tarih: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Ayarlar
export interface Settings {
  firmName: string;
  logo: string;
  currency: 'TRY' | 'USD' | 'EUR';
  kdvRate: number;
  notificationDays: number;
}

// Hesaplama sonuçları
export interface Calculations {
  toplamTahsilat: number;
  toplamMasraf: number;
  toplamGider: number;
  netKar: number;
  kurumHakedis: number;
  kurumMasraf: number;
  kurumNet: number;
  takipTahsilat: number;
  takipMasraf: number;
  odenmemisHakedis: number;
  odenmemisMasraf: number;
}

// Alert/Bildirim
export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface Notification {
  type: 'warning' | 'info';
  message: string;
}

// Filtreleme & Sıralama
export interface DateFilter {
  start: string;
  end: string;
}

export interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

// Modal state
export interface DetailModal {
  isOpen: boolean;
  item: any | null;
  type: string | null;
}

// Form tipleri
export interface FileFormData {
  dosyaNo: string;
  muvekkilAdi: string;
  tahsilEdilen: number;
  tahsilEdilecek: number;
  not?: string;
}

export interface LegalExpenseFormData {
  dosyaId: string | number;
  masrafTuru: string;
  tutar: number;
  tarih: string;
  not?: string;
}

export interface InstitutionFormData {
  kurumAdi: string;
  dosyaNo: string;
  tahsilTutar: number;
  vekaletOrani: number;
  not?: string;
}

export interface InstitutionExpenseFormData {
  aciklama: string;
  masrafTuru: string;
  tutar: number;
  tarih: string;
  not?: string;
}

export interface ExpenseFormData {
  aciklama: string;
  kategori: string;
  tutar: number;
  tarih: string;
  not?: string;
}

// API response types
export interface AllDataResponse {
  dosyalar: Dosya[];
  kurumDosyalari: KurumDosyasi[];
  takipMasraflari: TakipMasrafi[];
  kurumMasraflari: KurumMasrafi[];
  giderler: Gider[];
}

// Data state type (reducer)
export type DataState = AllDataResponse;

export type DataType = 'dosyalar' | 'kurumDosyalari' | 'takipMasraflari' | 'kurumMasraflari' | 'giderler';

export interface DataAction {
  type: 'SET_DATA' | 'ADD_ITEM' | 'UPDATE_ITEM' | 'DELETE_ITEM' | 'TOGGLE_PAID';
  payload: any;
  dataType?: DataType;
}
