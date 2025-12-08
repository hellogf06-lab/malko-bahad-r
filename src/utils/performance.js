import React from 'react';

/**
 * Performance monitoring utilities for React applications
 * Tracks render times, network requests, and custom metrics
 */

// Custom performance observer hook
export const usePerformanceMonitor = (componentName) => {
  React.useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (renderTime > 16) { // 60fps = ~16ms per frame
        console.warn(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
};

// Track component render count
export const useRenderCount = (componentName) => {
  const renderCount = React.useRef(0);

  React.useEffect(() => {
    renderCount.current += 1;
    if (renderCount.current > 10) {
      console.warn(`[Performance] ${componentName} has rendered ${renderCount.current} times`);
    }
  });

  return renderCount.current;
};

// Measure first paint, first contentful paint
export const measurePageLoad = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');

    console.log('[Performance Metrics]');
    console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
    console.log('Load Complete:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');

    paintEntries.forEach((entry) => {
      console.log(`${entry.name}:`, entry.startTime, 'ms');
    });
  });
};

// Network request tracker
class NetworkMonitor {
  constructor() {
    this.requests = [];
  }

  trackRequest(url, method = 'GET') {
    const startTime = performance.now();
    const requestId = `${method}-${url}-${Date.now()}`;

    this.requests.push({
      id: requestId,
      url,
      method,
      startTime,
      endTime: null,
      duration: null,
    });

    return {
      complete: () => {
        const request = this.requests.find(r => r.id === requestId);
        if (request) {
          request.endTime = performance.now();
          request.duration = request.endTime - request.startTime;

          if (request.duration > 1000) {
            console.warn(`[Network] Slow request: ${method} ${url} took ${request.duration.toFixed(2)}ms`);
          }
        }
      },
      error: (err) => {
        console.error(`[Network] Failed request: ${method} ${url}`, err);
      },
    };
  }

  getStats() {
    const completed = this.requests.filter(r => r.endTime !== null);
    const avgDuration = completed.reduce((sum, r) => sum + r.duration, 0) / completed.length;

    return {
      totalRequests: this.requests.length,
      completedRequests: completed.length,
      averageDuration: avgDuration.toFixed(2),
      slowRequests: completed.filter(r => r.duration > 1000).length,
    };
  }
}

export const networkMonitor = new NetworkMonitor();

// React Profiler wrapper
export const ProfiledComponent = ({ id, children, onRender }) => {
  const handleRender = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  ) => {
    console.log(`[Profiler] ${id} - ${phase} phase:`);
    console.log(`  Actual duration: ${actualDuration.toFixed(2)}ms`);
    console.log(`  Base duration: ${baseDuration.toFixed(2)}ms`);
    console.log(`  Start time: ${startTime.toFixed(2)}ms`);
    console.log(`  Commit time: ${commitTime.toFixed(2)}ms`);

    if (onRender) {
      onRender(id, phase, actualDuration, baseDuration, startTime, commitTime);
    }
  };

  return (
    <React.Profiler id={id} onRender={handleRender}>
      {children}
    </React.Profiler>
  );
};

// Bundle size analyzer (development only)
export const logBundleSize = () => {
  if (process.env.NODE_ENV !== 'production') {
    const scripts = document.querySelectorAll('script[src]');
    const styles = document.querySelectorAll('link[rel="stylesheet"]');

    console.log('[Bundle Analysis]');
    console.log(`Total scripts: ${scripts.length}`);
    console.log(`Total stylesheets: ${styles.length}`);

    scripts.forEach((script) => {
      console.log(`Script: ${script.src}`);
    });

    styles.forEach((style) => {
      console.log(`Stylesheet: ${style.href}`);
    });
  }
};

// Memory usage tracker
export const useMemoryMonitor = (interval = 5000) => {
  React.useEffect(() => {
    if (!performance.memory) {
      console.warn('[Memory] Performance.memory API not available');
      return;
    }

    const checkMemory = setInterval(() => {
      const memory = performance.memory;
      const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
      const totalMB = (memory.totalJSHeapSize / 1048576).toFixed(2);
      const limitMB = (memory.jsHeapSizeLimit / 1048576).toFixed(2);

      console.log(`[Memory] Used: ${usedMB}MB / Total: ${totalMB}MB / Limit: ${limitMB}MB`);

      if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
        console.error('[Memory] Warning: Approaching memory limit!');
      }
    }, interval);

    return () => clearInterval(checkMemory);
  }, [interval]);
};

// Custom performance mark utilities
export const performanceMark = {
  start: (name) => {
    performance.mark(`${name}-start`);
  },

  end: (name) => {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name)[0];
    console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);

    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
  },
};

// HOC for performance tracking
export const withPerformanceTracking = (Component, componentName) => {
  return React.memo((props) => {
    usePerformanceMonitor(componentName);
    const renderCount = useRenderCount(componentName);

    return <Component {...props} />;
  });
};
