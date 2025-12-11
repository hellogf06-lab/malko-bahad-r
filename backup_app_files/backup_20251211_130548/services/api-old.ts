// Mock data API - development mode without Supabase

export const fetchAllData = async () => {
  return {
    dosyalar: [],
    kurumDosyalari: [],
    takipMasraflari: [],
    kurumMasraflari: [],
    giderler: []
  };
};

export const fetchDosyalar = async () => [];
export const fetchKurumDosyalari = async () => [];
export const fetchTakipMasraflari = async () => [];
export const fetchKurumMasraflari = async () => [];
export const fetchGiderler = async () => [];

export const addDosya = async (data: any) => data;
export const updateDosya = async (id: string, data: any) => ({ id, ...data });
export const deleteDosya = async (id: string) => ({ id });
export const toggleDosyaPaid = async (id: string, paid: boolean) => ({ id, odendi: paid });

export const addKurumDosya = async (data: any) => data;
export const updateKurumDosya = async (id: string, data: any) => ({ id, ...data });
export const deleteKurumDosya = async (id: string) => ({ id });
export const toggleKurumDosyaPaid = async (id: string, paid: boolean) => ({ id, odendi: paid });

export const addTakipMasraf = async (data: any) => data;
export const updateTakipMasraf = async (id: string, data: any) => ({ id, ...data });
export const deleteTakipMasraf = async (id: string) => ({ id });
export const toggleTakipMasrafPaid = async (id: string, paid: boolean) => ({ id, odendi: paid });

export const addKurumMasraf = async (data: any) => data;
export const updateKurumMasraf = async (id: string, data: any) => ({ id, ...data });
export const deleteKurumMasraf = async (id: string) => ({ id });
export const toggleKurumMasrafPaid = async (id: string, paid: boolean) => ({ id, odendi: paid });

export const addGider = async (data: any) => data;
export const updateGider = async (id: string, data: any) => ({ id, ...data });
export const deleteGider = async (id: string) => ({ id });
