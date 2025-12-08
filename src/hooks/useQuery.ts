import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import * as api from '../services/api';
import type { Dosya, TakipMasrafi, KurumDosyasi, KurumMasrafi, Gider, AllDataResponse } from '../types';

// Query Keys
export const QUERY_KEYS = {
  ALL_DATA: ['allData'],
  DOSYALAR: ['dosyalar'],
  KURUM_DOSYALARI: ['kurumDosyalari'],
  TAKIP_MASRAFLARI: ['takipMasraflari'],
  KURUM_MASRAFLARI: ['kurumMasraflari'],
  GIDERLER: ['giderler'],
};

// ============================================
// QUERIES
// ============================================

export const useAllData = (): UseQueryResult<AllDataResponse> => {
  return useQuery({
    queryKey: QUERY_KEYS.ALL_DATA,
    queryFn: api.fetchAllData,
  });
};

export const useDosyalar = (): UseQueryResult<Dosya[]> => {
  return useQuery({
    queryKey: QUERY_KEYS.DOSYALAR,
    queryFn: api.fetchDosyalar,
  });
};

export const useKurumDosyalari = (): UseQueryResult<KurumDosyasi[]> => {
  return useQuery({
    queryKey: QUERY_KEYS.KURUM_DOSYALARI,
    queryFn: api.fetchKurumDosyalari,
  });
};

export const useTakipMasraflari = (): UseQueryResult<TakipMasrafi[]> => {
  return useQuery({
    queryKey: QUERY_KEYS.TAKIP_MASRAFLARI,
    queryFn: api.fetchTakipMasraflari,
  });
};

export const useKurumMasraflari = (): UseQueryResult<KurumMasrafi[]> => {
  return useQuery({
    queryKey: QUERY_KEYS.KURUM_MASRAFLARI,
    queryFn: api.fetchKurumMasraflari,
  });
};

export const useGiderler = (): UseQueryResult<Gider[]> => {
  return useQuery({
    queryKey: QUERY_KEYS.GIDERLER,
    queryFn: api.fetchGiderler,
  });
};

// ============================================
// MUTATIONS - DOSYALAR
// ============================================

export const useAddDosya = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addDosya,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOSYALAR });
    },
  });
};

export const useUpdateDosya = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Dosya> }) => api.updateDosya(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOSYALAR });
    },
  });
};

export const useDeleteDosya = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteDosya,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOSYALAR });
    },
  });
};

// ============================================
// MUTATIONS - TAKİP MASRAFLARI
// ============================================

export const useAddTakipMasrafi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addTakipMasraf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TAKIP_MASRAFLARI });
    },
  });
};

export const useUpdateTakipMasrafi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TakipMasrafi> }) => api.updateTakipMasraf(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TAKIP_MASRAFLARI });
    },
  });
};

export const useDeleteTakipMasrafi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTakipMasraf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TAKIP_MASRAFLARI });
    },
  });
};

export const useToggleTakipMasrafiPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, odendi }: { id: string; odendi: boolean }) => api.toggleTakipMasrafPaid(id, odendi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TAKIP_MASRAFLARI });
    },
  });
};

// ============================================
// MUTATIONS - KURUM DOSYALARI
// ============================================

export const useAddKurumDosyasi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addKurumDosya,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.KURUM_DOSYALARI });
    },
  });
};

export const useUpdateKurumDosyasi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<KurumDosyasi> }) => api.updateKurumDosya(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.KURUM_DOSYALARI });
    },
  });
};

export const useDeleteKurumDosyasi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteKurumDosya,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.KURUM_DOSYALARI });
    },
  });
};

export const useToggleKurumDosyasiPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, odendi }: { id: string; odendi: boolean }) => api.toggleKurumDosyaPaid(id, odendi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.KURUM_DOSYALARI });
    },
  });
};

// ============================================
// MUTATIONS - KURUM MASRAFLARI
// ============================================

export const useAddKurumMasrafi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addKurumMasraf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.KURUM_MASRAFLARI });
    },
  });
};

export const useUpdateKurumMasrafi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<KurumMasrafi> }) => api.updateKurumMasraf(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.KURUM_MASRAFLARI });
    },
  });
};

export const useDeleteKurumMasrafi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteKurumMasraf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.KURUM_MASRAFLARI });
    },
  });
};

export const useToggleKurumMasrafiPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, odendi }: { id: string; odendi: boolean }) => api.toggleKurumMasrafPaid(id, odendi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.KURUM_MASRAFLARI });
    },
  });
};

// ============================================
// MUTATIONS - GİDERLER
// ============================================

export const useAddGider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addGider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GIDERLER });
    },
  });
};

export const useUpdateGider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Gider> }) => api.updateGider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GIDERLER });
    },
  });
};

export const useDeleteGider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteGider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_DATA });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GIDERLER });
    },
  });
};

// ============================================
// BACKWARD COMPATIBILITY - Generic hooks
// ============================================

// Map old generic hooks to new specific ones
export const useAddData = (type: string) => {
  const hooks = {
    dosyalar: useAddDosya,
    takipMasraflari: useAddTakipMasrafi,
    kurumDosyalari: useAddKurumDosyasi,
    kurumMasraflari: useAddKurumMasrafi,
    giderler: useAddGider,
  };
  return hooks[type as keyof typeof hooks]();
};

export const useUpdateData = (type: string) => {
  const hooks = {
    dosyalar: useUpdateDosya,
    takipMasraflari: useUpdateTakipMasrafi,
    kurumDosyalari: useUpdateKurumDosyasi,
    kurumMasraflari: useUpdateKurumMasrafi,
    giderler: useUpdateGider,
  };
  return hooks[type as keyof typeof hooks]();
};

export const useDeleteData = (type: string) => {
  const hooks = {
    dosyalar: useDeleteDosya,
    takipMasraflari: useDeleteTakipMasrafi,
    kurumDosyalari: useDeleteKurumDosyasi,
    kurumMasraflari: useDeleteKurumMasrafi,
    giderler: useDeleteGider,
  };
  return hooks[type as keyof typeof hooks]();
};

export const useTogglePaid = (type: string) => {
  const hooks = {
    takipMasraflari: useToggleTakipMasrafiPaid,
    kurumDosyalari: useToggleKurumDosyasiPaid,
    kurumMasraflari: useToggleKurumMasrafiPaid,
  };
  return hooks[type as keyof typeof hooks]();
};

// ============================================
// COMBINED DATA HOOK
// ============================================

export const useAllDataQueries = () => {
  const dosyalarQuery = useDosyalar();
  const kurumDosyalariQuery = useKurumDosyalari();
  const takipMasraflariQuery = useTakipMasraflari();
  const kurumMasraflariQuery = useKurumMasraflari();
  const giderlerQuery = useGiderler();

  return {
    dosyalar: dosyalarQuery.data || [],
    kurumDosyalari: kurumDosyalariQuery.data || [],
    takipMasraflari: takipMasraflariQuery.data || [],
    kurumMasraflari: kurumMasraflariQuery.data || [],
    giderler: giderlerQuery.data || [],
    isLoading: false, // Auth olmadığı için loading'i false yapıyoruz
    isError: dosyalarQuery.isError || kurumDosyalariQuery.isError || takipMasraflariQuery.isError || kurumMasraflariQuery.isError || giderlerQuery.isError,
    error: dosyalarQuery.error || kurumDosyalariQuery.error || takipMasraflariQuery.error || kurumMasraflariQuery.error || giderlerQuery.error,
  };
};
