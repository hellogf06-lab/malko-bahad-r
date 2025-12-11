// SABİTLER

export const FIRM_NAME = 'MALKOÇ & BAHADIR HUKUK VE DANIŞMANLIK';
export const STORAGE_KEY = 'hukuk_buro_data_v9_final';

export const EXPENSE_CATEGORIES: readonly string[] = [
  'Kira', 'Aidat', 'Elektrik', 'Su', 'İnternet', 
  'Maaş', 'Sigorta', 'Kırtasiye', 'Mutfak', 
  'Vergi', 'Ulaşım', 'Temsil/Ağırlama', 'Diğer'
] as const;

interface ColorTheme {
  light: string;
  border: string;
  text: string;
  bg: string;
}

interface Colors {
  income: ColorTheme;
  profit: ColorTheme;
  expense: ColorTheme;
  pending: ColorTheme;
}

export const COLORS: Colors = {
  income: {
    light: '#10b981',
    border: '#10b981',
    text: '#059669',
    bg: '#10b981'
  },
  profit: {
    light: '#10b981',
    border: '#10b981',
    text: '#059669',
    bg: '#10b981'
  },
  expense: {
    light: '#ef4444',
    border: '#ef4444',
    text: '#dc2626',
    bg: '#ef4444'
  },
  pending: {
    light: '#f97316',
    border: '#f97316',
    text: '#ea580c',
    bg: '#f97316'
  }
};
