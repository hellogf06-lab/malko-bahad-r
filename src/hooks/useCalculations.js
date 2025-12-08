import { useMemo } from 'react';

export const useCalculations = (dosyalar, kurumDosyalari, kurumMasraflari, giderler, takipMasraflari) => {
  return useMemo(() => {
    // 1. Serbest Dosyalar
    const dosyaTahsilat = dosyalar.reduce((sum, d) => sum + (d.tahsil_edilen || 0), 0);
    const dosyaMasrafToplam = takipMasraflari.reduce((sum, m) => sum + (m.tutar || 0), 0);
    const dosyaMasrafIade = takipMasraflari.filter(m => m.odendi).reduce((sum, m) => sum + (m.tutar || 0), 0);

    // 2. Kurum İşlemleri
    const kurumHakedisler = kurumDosyalari.map(k => {
      const brut = (k.tahsil_tutar || 0) * (k.vekalet_orani || 0) / 100;
      return { ...k, net_hakedis: k.net_hakedis || brut };
    });

    const kurumReelGelir = kurumHakedisler.filter(k => k.odendi).reduce((sum, k) => sum + (k.net_hakedis || 0), 0);
    const kurumBekleyenAlacak = kurumHakedisler.filter(k => !k.odendi).reduce((sum, k) => sum + (k.net_hakedis || 0), 0);

    const kurumMasrafToplam = kurumMasraflari.reduce((sum, m) => sum + (m.tutar || 0), 0);
    const kurumMasrafIade = kurumMasraflari.filter(m => m.odendi).reduce((sum, m) => sum + (m.tutar || 0), 0);

    // 3. Ofis Giderleri
    const ofisGiderToplam = giderler.reduce((sum, g) => sum + (g.tutar || 0), 0);

    // 4. Genel Toplamlar
    const toplamReelGelir = dosyaTahsilat + kurumReelGelir;
    const toplamGider = dosyaMasrafToplam + kurumMasrafToplam + ofisGiderToplam;
    const toplamIade = dosyaMasrafIade + kurumMasrafIade;
    const netKar = toplamReelGelir - (toplamGider - toplamIade);

    const chartData = [
      { name: 'Kurum (Reel)', gelir: kurumReelGelir, gider: kurumMasrafToplam },
      { name: 'Dosya Takip', gelir: dosyaTahsilat, gider: dosyaMasrafToplam },
      { name: 'Ofis Genel', gelir: 0, gider: ofisGiderToplam },
      { name: 'Kasa Toplam', gelir: toplamReelGelir, gider: toplamGider }
    ];

    return { 
      toplamReelGelir, 
      toplamGider, 
      netKar, 
      toplamIade,
      dosyaTahsilat, 
      dosyaMasrafToplam, 
      dosyaMasrafIade,
      kurumReelGelir, 
      kurumBekleyenAlacak, 
      kurumMasrafToplam, 
      kurumMasrafIade, 
      kurumHakedisler,
      ofisGiderToplam,
      chartData 
    };
  }, [dosyalar, kurumDosyalari, kurumMasraflari, giderler, takipMasraflari]);
};
