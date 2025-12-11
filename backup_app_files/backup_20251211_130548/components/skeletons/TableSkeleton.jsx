import React from 'react';

const TableSkeleton = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="overflow-x-auto rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b-2 border-blue-200 dark:border-blue-800">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-4">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full shimmer animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div 
                    className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded shimmer animate-pulse"
                    style={{ 
                      width: `${Math.random() * 40 + 60}%`,
                      animationDelay: `${rowIndex * 0.1 + colIndex * 0.05}s`
                    }}
                  ></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
