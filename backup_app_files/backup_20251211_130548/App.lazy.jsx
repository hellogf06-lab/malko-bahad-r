import React, { lazy, Suspense } from 'react';

// Lazy loaded components for code splitting
export const LazyDosyalar = lazy(() => import('./components/Dosyalar'));
export const LazyGiderler = lazy(() => import('./components/Giderler'));
export const LazyKurum = lazy(() => import('./components/Kurum'));
export const LazyAdvancedAnalytics = lazy(() => import('./components/AdvancedAnalytics'));
export const LazyAuditLogViewer = lazy(() => import('./components/AuditLogViewer'));
export const LazyBackupManager = lazy(() => import('./components/BackupManager'));
export const LazyDataImporter = lazy(() => import('./components/DataImporter'));
export const LazyReportTemplates = lazy(() => import('./components/ReportTemplates'));
export const LazyAdvancedPredictions = lazy(() => import('./components/AdvancedPredictions'));

// Loading fallback component
export const ComponentLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// HOC for lazy loading with suspense
export const withLazyLoad = (Component) => (props) => (
  <Suspense fallback={<ComponentLoader />}>
    <Component {...props} />
  </Suspense>
);
