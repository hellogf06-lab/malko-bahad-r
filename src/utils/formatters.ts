// 1. Para Formatlama (Noktalı ve TL Simgeli)
export const formatPara = (tutar: number | string) => {
  const sayi = Number(tutar);
  if (isNaN(sayi)) return "0 ₺";

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0, // Kuruş sıfırsa gösterme
    maximumFractionDigits: 2,
  }).format(sayi);
};

// 2. Sayıyı Yazıya Çevirme Motoru
export const sayiyiYaziyaCevir = (sayi: number) => {
  if (sayi === 0) return "Sıfır TL";

  const birler = ["", "Bir", "İki", "Üç", "Dört", "Beş", "Altı", "Yedi", "Sekiz", "Dokuz"];
  const onlar = ["", "On", "Yirmi", "Otuz", "Kırk", "Elli", "Altmış", "Yetmiş", "Seksen", "Doksan"];
  const basamaklar = ["", "Bin", "Milyon", "Milyar", "Trilyon"];

  let tamKisim = Math.floor(Math.abs(sayi));
  const ondalikKisim = Math.round((Math.abs(sayi) - tamKisim) * 100);
  
  if (tamKisim === 0 && ondalikKisim === 0) return "Sıfır TL";

  let yazi = "";
  let basamakIndex = 0;

  while (tamKisim > 0) {
    const ucluGrup = tamKisim % 1000;
    
    if (ucluGrup !== 0) {
      let grupYazisi = "";
      const yuzler = Math.floor(ucluGrup / 100);
      const onluk = Math.floor((ucluGrup % 100) / 10);
      const birlik = ucluGrup % 10;

      if (yuzler > 0) {
        grupYazisi += (yuzler > 1 ? birler[yuzler] + " " : "") + "Yüz ";
      }
      
      if (onluk > 0) grupYazisi += onlar[onluk] + " ";
      if (birlik > 0) {
        // "Bir Bin" denmez, sadece "Bin" denir kuralı
        if (basamakIndex === 1 && ucluGrup === 1) {
            // Boş bırak (Sadece Bin eklenecek)
        } else {
            grupYazisi += birler[birlik] + " ";
        }
      }

      yazi = grupYazisi + basamaklar[basamakIndex] + " " + yazi;
    }
    
    tamKisim = Math.floor(tamKisim / 1000);
    basamakIndex++;
  }

  // Negatif kontrolü
  const baslangic = sayi < 0 ? "Eksi " : "";
  const sonuc = baslangic + yazi.trim() + " TL";

  // Kuruş varsa ekle
  if (ondalikKisim > 0) {
     // Basit kuruş hesabı (Detaylı istenirse burası da yazıya çevrilebilir)
     return `${sonuc} ${ondalikKisim} Kuruş`;
  }

  return sonuc;
};
