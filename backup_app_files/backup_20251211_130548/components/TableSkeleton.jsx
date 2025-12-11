import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const TableSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-32 mt-2" />
              <Skeleton className="h-3 w-20 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table Skeleton */}
      <Card className="shadow-sm">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Search and Filter Bar */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 flex-1 max-w-md" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Table Headers */}
          <div className="flex items-center px-4 py-3 bg-slate-50 border-b border-slate-200">
            <Skeleton className="h-4 w-8 mr-4" />
            <Skeleton className="h-4 w-24 mr-6" />
            <Skeleton className="h-4 w-32 mr-6" />
            <Skeleton className="h-4 w-28 mr-6" />
            <Skeleton className="h-4 w-28 mr-6" />
            <Skeleton className="h-4 w-24 mr-6" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Table Rows */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center px-4 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <Skeleton className="h-4 w-8 mr-4" />
              <Skeleton className="h-4 w-24 mr-6" />
              <Skeleton className="h-4 w-32 mr-6" />
              <Skeleton className="h-4 w-28 mr-6" />
              <Skeleton className="h-4 w-28 mr-6" />
              <Skeleton className="h-4 w-24 mr-6" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white">
            <Skeleton className="h-4 w-40" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
