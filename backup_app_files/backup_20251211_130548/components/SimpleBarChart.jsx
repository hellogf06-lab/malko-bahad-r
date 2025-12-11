import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';
import { formatPara } from '../utils/helpers';
import { COLORS } from '../utils/constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { EmptyState } from './ui/avatar';
import { ChartSkeleton } from './skeletons/ChartSkeleton';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700">
        <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="font-semibold dark:text-gray-300">{entry.name}:</span>
            <span className="text-gray-700 dark:text-gray-400">{formatPara(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SimpleBarChart = ({ data, title, isLoading = false }) => {
  // Loading state
  if (isLoading) {
    return <ChartSkeleton type="bar" title={title} />;
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b-2 border-blue-200 dark:border-blue-800">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BarChart2 size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-extrabold">
              {title}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <EmptyState 
            icon={BarChart2}
            title="Veri Bulunamadı"
            description="Henüz gösterilecek nakit akışı verisi yok"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b-2 border-blue-200 dark:border-blue-800">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <BarChart2 size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-extrabold">
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorGelir" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
              </linearGradient>
              <linearGradient id="colorGider" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              stroke="#9ca3af"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              formatter={(value) => <span className="font-semibold text-gray-700">{value}</span>}
            />
            <Bar 
              dataKey="gelir" 
              name="Kasa Girişi" 
              fill="url(#colorGelir)" 
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            />
            <Bar 
              dataKey="gider" 
              name="Kasa Çıkışı" 
              fill="url(#colorGider)" 
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SimpleBarChart;
