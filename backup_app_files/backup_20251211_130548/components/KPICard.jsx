import React from 'react';
import { Card, CardContent } from './ui/card';

const KPICard = ({ title, value, icon: Icon, color, sub }) => {
  const colorClasses = {
    'emerald': 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700 shadow-emerald-200 dark:shadow-emerald-900',
    'blue': 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 shadow-blue-200 dark:shadow-blue-900',
    'orange': 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700 shadow-orange-200 dark:shadow-orange-900',
    'indigo': 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700 shadow-indigo-200 dark:shadow-indigo-900',
    'red': 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700 shadow-red-200 dark:shadow-red-900'
  };
  
  const iconBgClasses = {
    'emerald': 'bg-emerald-100 dark:bg-emerald-900/50',
    'blue': 'bg-blue-100 dark:bg-blue-900/50',
    'orange': 'bg-orange-100 dark:bg-orange-900/50',
    'indigo': 'bg-indigo-100 dark:bg-indigo-900/50',
    'red': 'bg-red-100 dark:bg-red-900/50'
  };
  
  // Extract color name from the old color prop
  const colorKey = color?.includes('emerald') ? 'emerald' :
                   color?.includes('blue') ? 'blue' :
                   color?.includes('orange') ? 'orange' :
                   color?.includes('indigo') ? 'indigo' :
                   color?.includes('red') ? 'red' : 'blue';
  
  return (
    <Card 
      className={`transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer group overflow-hidden relative border-2 ${colorClasses[colorKey]}`}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      
      <CardContent className="p-6 flex justify-between items-center relative z-10">
        <div className="space-y-2 flex-1">
          <p className="text-xs font-bold opacity-70 uppercase tracking-widest">
            {title}
          </p>
          <p className="text-3xl font-extrabold group-hover:scale-105 transition-transform duration-300">
            {value}
          </p>
          {sub && (
            <div className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
              ✓ {sub}
            </div>
          )}
        </div>
        <div 
          className={`p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg ${iconBgClasses[colorKey]}`}
        >
          <Icon size={28} className="opacity-90" />
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
