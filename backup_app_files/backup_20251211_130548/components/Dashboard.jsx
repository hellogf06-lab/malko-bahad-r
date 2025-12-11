import React from 'react';
import { TrendingUp, Calculator, FileText, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Dashboard = ({ hesaplamalar, formatPara }) => {
  const { isAdmin, profile } = useAuth();

  // User (personel) görünümü - sadece basit bilgiler
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-blue-900">
                Hoş Geldiniz, {profile?.full_name || 'Kullanıcı'}
              </h3>
            </div>
            <p className="text-blue-700">
              Personel hesabı ile giriş yaptınız. Dosyalar ve masraflar bölümlerini kullanabilirsiniz.
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Finansal raporlar ve özet bilgiler için admin yetkisi gereklidir.
            </p>
          </CardContent>
        </Card>

        {/* Basit istatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Toplam Dosya</p>
                  <p className="text-3xl font-bold text-gray-700 mt-1">
                    {hesaplamalar.dosyaSayisi || 0}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="text-gray-500" size={28} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Aktif İşlemler</p>
                  <p className="text-3xl font-bold text-gray-700 mt-1">
                    {hesaplamalar.aktifIslemler || 0}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Calculator className="text-gray-500" size={28} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Admin görünümü - tüm finansal detaylar
  return (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-2 hover:shadow-xl transition-all" style={{ backgroundColor: '#dcfce7', borderColor: '#4ade80' }}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-semibold uppercase tracking-wide">Toplam Gelir</p>
              <p className="text-2xl font-bold text-green-800 mt-2">{formatPara(hesaplamalar.toplamGelir)}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}>
              <TrendingUp className="text-green-700" size={28} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 hover:shadow-xl transition-all" style={{ backgroundColor: '#fecdd3', borderColor: '#fb7185' }}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-semibold uppercase tracking-wide">Toplam Gider</p>
              <p className="text-2xl font-bold text-red-800 mt-2">{formatPara(hesaplamalar.toplamGider)}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
              <DollarSign className="text-red-700" size={28} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 hover:shadow-xl transition-all" style={{ backgroundColor: '#dbeafe', borderColor: '#60a5fa' }}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-semibold uppercase tracking-wide">Net Kar/Zarar</p>
              <p className={`text-2xl font-bold mt-2 ${hesaplamalar.netKar >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                {formatPara(hesaplamalar.netKar)}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>
              <Calculator className="text-blue-700" size={28} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 hover:shadow-xl transition-all" style={{ backgroundColor: '#fef08a', borderColor: '#facc15' }}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-semibold uppercase tracking-wide">Tahsil Edilecek</p>
              <p className="text-2xl font-bold text-yellow-800 mt-2">{formatPara(hesaplamalar.serbestTahsilEdilecek)}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)' }}>
              <FileText className="text-yellow-700" size={28} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">Kurum Avukatlığı Özeti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2" style={{ backgroundColor: '#e9d5ff', borderColor: '#a78bfa' }}>
            <CardContent className="p-4">
              <p className="text-sm text-purple-700 font-semibold">Toplam Net Hakediş</p>
              <p className="text-xl font-bold text-purple-800 mt-1">{formatPara(hesaplamalar.kurumToplamNet)}</p>
            </CardContent>
          </Card>
          <Card className="border-2" style={{ backgroundColor: '#fed7aa', borderColor: '#fb923c' }}>
            <CardContent className="p-4">
              <p className="text-sm text-orange-700 font-semibold">Fatura Kesilmemiş</p>
              <p className="text-xl font-bold text-orange-800 mt-1">{formatPara(hesaplamalar.kurumFaturaKesilmemis)}</p>
            </CardContent>
          </Card>
          <Card className="border-2" style={{ backgroundColor: '#fbcfe8', borderColor: '#f472b6' }}>
            <CardContent className="p-4">
              <p className="text-sm text-pink-700 font-semibold">Tahsil Edilmemiş</p>
              <p className="text-xl font-bold text-pink-800 mt-1">{formatPara(hesaplamalar.kurumTahsilEdilmemis)}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </div>
  );
};

export default Dashboard;
