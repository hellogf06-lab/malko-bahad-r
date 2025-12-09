import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, FileText, Building2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatPara } from '../utils/helpers.ts';

const AdvancedAnalytics = ({ data, settings }) => {
  const analytics = useMemo(() => {
    if (!data) return null;

    const { dosyalar, kurumHakedisleri, giderler, takipMasraflari, kurumMasraflari } = data;

    // Aylık gelir-gider analizi (Son 6 ay)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' });

      // Dosya tahsilatları
      const monthIncomeDosya = dosyalar?.filter(d => d.tahsilat_tarihi?.startsWith(monthKey))
        .reduce((sum, d) => sum + (d.tahsilat || 0), 0) || 0;
      // Kurum hakedişleri (ödenmişler)
      const monthIncomeKurum = kurumHakedisleri?.filter(k => k.odendi && k.created_at?.startsWith(monthKey))
        .reduce((sum, k) => sum + (k.net_hakedis || ((k.tahsil_tutar || 0) * (k.vekalet_orani || 0) / 100)), 0) || 0;

      const monthIncome = monthIncomeDosya + monthIncomeKurum;
      const monthExpenses = giderler?.filter(g => g.tarih?.startsWith(monthKey))
        .reduce((sum, g) => sum + (g.tutar || 0), 0) || 0;

      monthlyData.push({
        month: monthName,
        gelir: monthIncome,
        gider: monthExpenses,
        kar: monthIncome - monthExpenses
      });
    }

    // Dosya durumu dağılımı
    const fileStatus = [
      { name: 'Devam Eden', value: dosyalar?.filter(d => !d.tamamlandi).length || 0, color: '#3b82f6' },
      { name: 'Tamamlanan', value: dosyalar?.filter(d => d.tamamlandi).length || 0, color: '#10b981' }
    ];

    // Kategori bazlı gider analizi
    const expenseCategories = {};
    giderler?.forEach(g => {
      const category = g.kategori || 'Diğer';
      expenseCategories[category] = (expenseCategories[category] || 0) + g.tutar;
    });
    const categoryData = Object.entries(expenseCategories).map(([name, value]) => ({ name, value }));

    // Ortalamalar
    const allIncomes = [
      ...(dosyalar?.map(d => d.tahsilat || 0) || []),
      ...(kurumHakedisleri?.filter(k => k.odendi).map(k => k.net_hakedis || ((k.tahsil_tutar || 0) * (k.vekalet_orani || 0) / 100)) || [])
    ];
    const avgFileIncome = allIncomes.length ? allIncomes.reduce((sum, v) => sum + v, 0) / allIncomes.length : 0;

    const avgExpense = giderler?.length ?
      giderler.reduce((sum, g) => sum + g.tutar, 0) / giderler.length : 0;

    // Tahsilat oranı (hem dosya hem kurum)
    const totalFee =
      (dosyalar?.reduce((sum, d) => sum + (d.avukatlik_ucreti || 0), 0) || 0) +
      (kurumHakedisleri?.reduce((sum, k) => sum + ((k.tahsil_tutar || 0) * (k.vekalet_orani || 0) / 100), 0) || 0);
    const totalCollected =
      (dosyalar?.reduce((sum, d) => sum + (d.tahsilat || 0), 0) || 0) +
      (kurumHakedisleri?.filter(k => k.odendi).reduce((sum, k) => sum + (k.net_hakedis || ((k.tahsil_tutar || 0) * (k.vekalet_orani || 0) / 100)), 0) || 0);
    const collectionRate = totalFee > 0 ? (totalCollected / totalFee) * 100 : 0;

    return {
      monthlyData,
      fileStatus,
      categoryData,
      avgFileIncome,
      avgExpense,
      collectionRate,
      totalFiles: (dosyalar?.length || 0) + (kurumHakedisleri?.length || 0),
      totalIncome: totalCollected,
      totalExpenses: giderler?.reduce((sum, g) => sum + g.tutar, 0) || 0
    };
  }, [data]);

  if (!analytics) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-2 border-indigo-200 dark:border-indigo-800 p-6 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <BarChart3 size={24} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-extrabold text-2xl">
              Gelişmiş Analitik
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Detaylı iş performans raporu
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <FileText size={20} className="text-blue-600" />
                <TrendingUp size={16} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{analytics.totalFiles}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Dosya</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <DollarSign size={20} className="text-green-600" />
                <TrendingUp size={16} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {formatPara(analytics.totalIncome, settings?.currency)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Gelir</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-xl border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between mb-2">
                <DollarSign size={20} className="text-red-600" />
                <TrendingDown size={16} className="text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {formatPara(analytics.totalExpenses, settings?.currency)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Gider</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-xl border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <Building2 size={20} className="text-purple-600" />
                <TrendingUp size={16} className="text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                %{analytics.collectionRate.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tahsilat Oranı</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aylık Gelir-Gider */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                Aylık Gelir-Gider Trendi (Son 6 Ay)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gelir" fill="#10b981" name="Gelir" />
                  <Bar dataKey="gider" fill="#ef4444" name="Gider" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Dosya Durumu */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                Dosya Durumu Dağılımı
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.fileStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: %${(percent * 100).toFixed(0)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.fileStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Kar Trendi */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                Kar/Zarar Trendi
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="kar" stroke="#8b5cf6" strokeWidth={3} name="Net Kar" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gider Kategorileri */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                Gider Kategorileri
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: %${(percent * 100).toFixed(0)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ortalamalar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dosya Başı Ortalama Gelir</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatPara(analytics.avgFileIncome, settings?.currency)}
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-xl border-2 border-orange-200 dark:border-orange-800">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ortalama Gider</div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatPara(analytics.avgExpense, settings?.currency)}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
