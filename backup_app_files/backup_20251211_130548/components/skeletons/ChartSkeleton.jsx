import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

const ChartSkeleton = ({ type = 'bar', className = '' }) => {
  return (
    <Card className={`animate-pulse ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg shimmer"></div>
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/3 shimmer"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {type === 'bar' ? (
          <div className="h-[300px] flex items-end justify-around gap-4 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end h-full">
                  <div 
                    className="flex-1 bg-gradient-to-t from-green-200 to-green-300 dark:from-green-900 dark:to-green-700 rounded-t-lg shimmer"
                    style={{ 
                      height: `${Math.random() * 60 + 40}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                  <div 
                    className="flex-1 bg-gradient-to-t from-red-200 to-red-300 dark:from-red-900 dark:to-red-700 rounded-t-lg shimmer"
                    style={{ 
                      height: `${Math.random() * 60 + 40}%`,
                      animationDelay: `${i * 0.1 + 0.05}s`
                    }}
                  ></div>
                </div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full shimmer"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[280px] flex items-center gap-8 p-4">
            <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 shimmer relative">
              <div className="absolute inset-[30%] bg-white dark:bg-gray-800 rounded-full"></div>
            </div>
            <div className="flex-1 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 shimmer"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/3 shimmer"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-24 shimmer"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-16 ml-auto shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { ChartSkeleton };
export default ChartSkeleton;
