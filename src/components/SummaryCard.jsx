import React from 'react';
import { Card, CardContent } from './ui/card';
import { COLORS } from '../utils/constants';
import { TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { formatPara, sayiyiYaziyaCevir } from '../utils/formatters';

const SummaryCard = ({ title, value, type, subValue, subLabel }) => {
    const colors = type === 'income' ? COLORS.income : type === 'expense' ? COLORS.expense : type === 'pending' ? COLORS.pending : COLORS.profit;
    
    const icons = {
        income: TrendingUp,
        expense: TrendingDown,
        pending: Clock,
        net: DollarSign
    };
    
    const Icon = icons[type] || DollarSign;
    
    const colorClasses = {
        income: 'border-l-emerald-500 dark:border-l-emerald-400 border-t-emerald-200 dark:border-t-emerald-700 border-r-emerald-200 dark:border-r-emerald-700 border-b-emerald-200 dark:border-b-emerald-700 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 shadow-emerald-200 dark:shadow-emerald-900',
        expense: 'border-l-red-500 dark:border-l-red-400 border-t-red-200 dark:border-t-red-700 border-r-red-200 dark:border-r-red-700 border-b-red-200 dark:border-b-red-700 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 shadow-red-200 dark:shadow-red-900',
        pending: 'border-l-amber-500 dark:border-l-amber-400 border-t-amber-200 dark:border-t-amber-700 border-r-amber-200 dark:border-r-amber-700 border-b-amber-200 dark:border-b-amber-700 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 shadow-amber-200 dark:shadow-amber-900',
        net: 'border-l-indigo-500 dark:border-l-indigo-400 border-t-indigo-200 dark:border-t-indigo-700 border-r-indigo-200 dark:border-r-indigo-700 border-b-indigo-200 dark:border-b-indigo-700 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 shadow-indigo-200 dark:shadow-indigo-900'
    };
    
    const iconBgClasses = {
        income: 'bg-emerald-200/30 dark:bg-emerald-700/30',
        expense: 'bg-red-200/30 dark:bg-red-700/30',
        pending: 'bg-amber-200/30 dark:bg-amber-700/30',
        net: 'bg-indigo-200/30 dark:bg-indigo-700/30'
    };
    
    const textClasses = {
        income: 'text-emerald-700 dark:text-emerald-300',
        expense: 'text-red-700 dark:text-red-300',
        pending: 'text-amber-700 dark:text-amber-300',
        net: 'text-indigo-700 dark:text-indigo-300'
    };
    
    return (
        <Card 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer group border-l-[5px] border-t border-r border-b ${colorClasses[type]}`}
        >
            {/* Animated gradient overlay */}
            <div 
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 ${iconBgClasses[type]}`}
            ></div>
            
            <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">{title}</p>
                        <p 
                            className={`text-3xl font-extrabold tracking-tight group-hover:scale-105 transition-transform duration-300 ${textClasses[type]}`}
                        >
                            {formatPara(value)}
                        </p>
                        <div className="text-xs font-medium text-gray-400 mt-1 italic border-t border-gray-200/50 pt-1">
                            {sayiyiYaziyaCevir(Number(value))}
                        </div>
                        {subValue > 0 && (
                            <div className="flex items-center gap-1.5 text-xs pt-2">
                                <span className="font-semibold text-gray-500 dark:text-gray-400">{subLabel}:</span>
                                <span 
                                    className={`font-bold px-2 py-1 rounded-full ${textClasses[type]} ${iconBgClasses[type]}`}
                                >
                                    {formatPara(subValue)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div 
                        className={`p-3 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ${iconBgClasses[type]}`}
                    >
                        <Icon size={24} className={`opacity-80 ${textClasses[type]}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SummaryCard;
