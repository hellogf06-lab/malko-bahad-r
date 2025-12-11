import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

const CardSkeleton = ({ className = '' }) => {
  return (
    <Card className={`animate-pulse ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg shimmer"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4 shimmer"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2 shimmer"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-1/3 shimmer"></div>
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
