import React, { useState } from 'react';
import { PieChart as RechartsePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChartIcon, TrendingUp } from 'lucide-react';
import { formatPara } from '../utils/helpers';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { EmptyState } from './ui/avatar';
import { ChartSkeleton } from './skeletons/ChartSkeleton';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border-2 dark:border-gray-700" style={{ borderColor: data.payload.color }}>
        <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">{data.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Tutar:</span> {formatPara(data.value)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Oran:</span> {data.payload.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show label if slice is too small

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="font-bold text-sm drop-shadow-lg"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const PieChart = ({ data, title, isLoading = false }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Loading state
  if (isLoading) {
    return <ChartSkeleton type="pie" title={title} />;
  }

  // Empty state
  if (!data || data.length === 0 || data.every(item => item.value === 0)) {
    return (
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-b-2 border-purple-200 dark:border-purple-800">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <PieChartIcon size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-extrabold">
              {title}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <EmptyState 
            icon={PieChartIcon}
            title="Veri Bulunamadı"
            description="Henüz gösterilecek gider dağılımı verisi yok"
          />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Add percentage to data
  const chartData = data.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card className="hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-b-2 border-purple-200 dark:border-purple-800">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <PieChartIcon size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-extrabold">
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex gap-8 items-center">
          <ResponsiveContainer width="50%" height={280}>
            <RechartsePieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationDuration={1000}
                animationBegin={0}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{
                      filter: activeIndex === index ? 'brightness(1.1) drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none',
                      transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RechartsePieChart>
          </ResponsiveContainer>
          
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800 mb-2">
              <TrendingUp size={24} className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Toplam</p>
                <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {formatPara(total)}
                </p>
              </div>
            </div>
            
            {chartData.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{
                  transform: activeIndex === index ? 'translateX(4px)' : 'translateX(0)',
                  boxShadow: activeIndex === index ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full transition-transform duration-300 group-hover:scale-125" 
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: activeIndex === index ? `0 0 12px ${item.color}` : 'none'
                    }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                    {item.name}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{formatPara(item.value)}</span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChart;
