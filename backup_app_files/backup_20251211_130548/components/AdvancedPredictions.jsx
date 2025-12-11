import React, { useState, useMemo } from 'react';
import { X, TrendingUp, TrendingDown, Calendar, BarChart3, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatPara } from '../utils/format';

const AdvancedPredictions = ({ isOpen, onClose, data }) => {
  const [predictionPeriod, setPredictionPeriod] = useState(3); // 3, 6, or 12 months
  const [predictionType, setPredictionType] = useState('both'); // 'income', 'expense', 'both'

  // Calculate monthly statistics from historical data
  const monthlyStats = useMemo(() => {
    if (!data || (!data.giderler && !data.kurumDosyalari)) return [];

    const stats = {};
    const now = new Date();

    // Process expenses
    if (data.giderler) {
      data.giderler.forEach(gider => {
        if (!gider.tarih) return;
        const date = new Date(gider.tarih);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!stats[monthKey]) {
          stats[monthKey] = { month: monthKey, income: 0, expense: 0 };
        }
        stats[monthKey].expense += Number(gider.tutar) || 0;
      });
    }

    // Process institution files for income
    if (data.kurumDosyalari) {
      data.kurumDosyalari.forEach(dosya => {
        const isPaid = dosya.odendi === true || dosya.odenmeDurumu === 'Ödendi';
        const paidDate = dosya.odenenTarih || dosya.odeme_tarihi || dosya.created_at;
        
        if (!isPaid || !paidDate) return;
        
        const date = new Date(paidDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!stats[monthKey]) {
          stats[monthKey] = { month: monthKey, income: 0, expense: 0 };
        }
        const amount = Number(dosya.net_hakedis || dosya.ucret || 0);
        stats[monthKey].income += amount;
      });
    }

    // Convert to array and sort by date
    const sortedStats = Object.values(stats)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months

    return sortedStats;
  }, [data]);

  // Simple linear regression for trend prediction
  const predictFuture = useMemo(() => {
    if (monthlyStats.length < 3) return [];

    const predictions = [];
    const lastMonth = monthlyStats[monthlyStats.length - 1];
    const lastDate = new Date(lastMonth.month + '-01');

    // Calculate trends for income and expense
    const calculateTrend = (key) => {
      const values = monthlyStats.map((stat, i) => ({ x: i, y: stat[key] }));
      const n = values.length;
      
      const sumX = values.reduce((sum, v) => sum + v.x, 0);
      const sumY = values.reduce((sum, v) => sum + v.y, 0);
      const sumXY = values.reduce((sum, v) => sum + v.x * v.y, 0);
      const sumX2 = values.reduce((sum, v) => sum + v.x * v.x, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      return { slope, intercept };
    };

    const incomeTrend = calculateTrend('income');
    const expenseTrend = calculateTrend('expense');

    // Generate predictions
    for (let i = 1; i <= predictionPeriod; i++) {
      const futureDate = new Date(lastDate);
      futureDate.setMonth(futureDate.getMonth() + i);
      const monthKey = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`;
      
      const xValue = monthlyStats.length + i - 1;
      const predictedIncome = Math.max(0, incomeTrend.intercept + incomeTrend.slope * xValue);
      const predictedExpense = Math.max(0, expenseTrend.intercept + expenseTrend.slope * xValue);
      
      predictions.push({
        month: monthKey,
        income: Math.round(predictedIncome),
        expense: Math.round(predictedExpense),
        net: Math.round(predictedIncome - predictedExpense),
        isPrediction: true
      });
    }

    return predictions;
  }, [monthlyStats, predictionPeriod]);

  // Combine historical and predicted data
  const combinedData = useMemo(() => {
    const historical = monthlyStats.map(stat => ({
      ...stat,
      net: stat.income - stat.expense,
      isPrediction: false
    }));
    return [...historical, ...predictFuture];
  }, [monthlyStats, predictFuture]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (monthlyStats.length === 0) return null;

    const avgIncome = monthlyStats.reduce((sum, stat) => sum + stat.income, 0) / monthlyStats.length;
    const avgExpense = monthlyStats.reduce((sum, stat) => sum + stat.expense, 0) / monthlyStats.length;
    
    const incomeTrend = monthlyStats.length > 1 
      ? ((monthlyStats[monthlyStats.length - 1].income - monthlyStats[0].income) / monthlyStats[0].income) * 100 
      : 0;
    const expenseTrend = monthlyStats.length > 1 
      ? ((monthlyStats[monthlyStats.length - 1].expense - monthlyStats[0].expense) / monthlyStats[0].expense) * 100 
      : 0;

    const predictedIncome = predictFuture.reduce((sum, stat) => sum + stat.income, 0);
    const predictedExpense = predictFuture.reduce((sum, stat) => sum + stat.expense, 0);

    return {
      avgIncome: Math.round(avgIncome),
      avgExpense: Math.round(avgExpense),
      incomeTrend,
      expenseTrend,
      predictedIncome: Math.round(predictedIncome),
      predictedExpense: Math.round(predictedExpense),
      predictedNet: Math.round(predictedIncome - predictedExpense)
    };
  }, [monthlyStats, predictFuture]);

  // Format month for display
  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-lg z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Gelir/Gider Tahminleri</h2>
                <p className="text-purple-100 text-sm">Yapay zeka destekli finansal öngörüler</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {monthlyStats.length < 3 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Yetersiz Veri</h3>
              <p className="text-yellow-700">
                Tahmin yapabilmek için en az 3 aylık geçmiş veri gereklidir.
                Lütfen daha fazla gelir ve gider kaydı ekleyin.
              </p>
            </div>
          ) : (
            <>
              {/* Controls */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Tahmin Süresi:</span>
                  <div className="flex gap-2">
                    {[3, 6, 12].map(period => (
                      <Button
                        key={period}
                        onClick={() => setPredictionPeriod(period)}
                        variant={predictionPeriod === period ? 'default' : 'outline'}
                        size="sm"
                      >
                        {period} Ay
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Gösterim:</span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setPredictionType('both')}
                      variant={predictionType === 'both' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Her İkisi
                    </Button>
                    <Button
                      onClick={() => setPredictionType('income')}
                      variant={predictionType === 'income' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Gelir
                    </Button>
                    <Button
                      onClick={() => setPredictionType('expense')}
                      variant={predictionType === 'expense' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Gider
                    </Button>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              {summaryStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700">Ort. Gelir</span>
                      <TrendingUp className={`w-5 h-5 ${summaryStats.incomeTrend >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div className="text-2xl font-bold text-green-900">{formatPara(summaryStats.avgIncome)}</div>
                    <div className={`text-xs mt-1 ${summaryStats.incomeTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summaryStats.incomeTrend >= 0 ? '↑' : '↓'} {Math.abs(summaryStats.incomeTrend).toFixed(1)}% trend
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-700">Ort. Gider</span>
                      <TrendingDown className={`w-5 h-5 ${summaryStats.expenseTrend >= 0 ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    <div className="text-2xl font-bold text-red-900">{formatPara(summaryStats.avgExpense)}</div>
                    <div className={`text-xs mt-1 ${summaryStats.expenseTrend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {summaryStats.expenseTrend >= 0 ? '↑' : '↓'} {Math.abs(summaryStats.expenseTrend).toFixed(1)}% trend
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">Tahmini Gelir</span>
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{formatPara(summaryStats.predictedIncome)}</div>
                    <div className="text-xs text-blue-600 mt-1">{predictionPeriod} ay toplam</div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-700">Tahmini Net</span>
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className={`text-2xl font-bold ${summaryStats.predictedNet >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                      {formatPara(summaryStats.predictedNet)}
                    </div>
                    <div className={`text-xs mt-1 ${summaryStats.predictedNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summaryStats.predictedNet >= 0 ? 'Pozitif' : 'Negatif'} bakiye
                    </div>
                  </Card>
                </div>
              )}

              {/* Line Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Tarihsel Veriler ve Tahminler
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={formatMonth}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      formatter={(value) => formatPara(value)}
                      labelFormatter={formatMonth}
                    />
                    <Legend />
                    {(predictionType === 'income' || predictionType === 'both') && (
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Gelir"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {(predictionType === 'expense' || predictionType === 'both') && (
                      <Line 
                        type="monotone" 
                        dataKey="expense" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        name="Gider"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  * Son {predictionPeriod} ay tahmin değerlerini içerir
                </p>
              </Card>

              {/* Bar Chart for Net Predictions */}
              {predictionType === 'both' && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Tahmini Net Kazanç/Kayıp
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={predictFuture}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tickFormatter={formatMonth}
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        formatter={(value) => formatPara(value)}
                        labelFormatter={formatMonth}
                      />
                      <Bar 
                        dataKey="net" 
                        fill="#8b5cf6"
                        name="Net Kazanç"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Tahmin Metodolojisi</p>
                    <p>
                      Bu tahminler, geçmiş {monthlyStats.length} aylık verilerinize dayalı basit doğrusal regresyon 
                      analizi kullanılarak hesaplanmıştır. Gerçek sonuçlar mevsimsel faktörler, ekonomik değişimler 
                      ve iş stratejilerinize bağlı olarak farklılık gösterebilir.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdvancedPredictions;
