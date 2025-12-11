import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

/**
 * Accessibility utilities for keyboard navigation, focus management, and ARIA labels
 */

// Keyboard navigation hook
export const useKeyboardNavigation = (items, onSelect) => {
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (items[focusedIndex]) {
            onSelect(items[focusedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setFocusedIndex(-1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, focusedIndex, onSelect]);

  return { focusedIndex, setFocusedIndex };
};

// Focus trap for modals/dialogs
export const useFocusTrap = (isActive) => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    firstElement?.focus();
    containerRef.current.addEventListener('keydown', handleTab);

    return () => {
      containerRef.current?.removeEventListener('keydown', handleTab);
    };
  }, [isActive]);

  return containerRef;
};

// Screen reader announcements
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Accessible form field component
export const AccessibleField = ({ 
  id, 
  label, 
  error, 
  required, 
  helpText,
  children 
}) => {
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  return (
    <div className="space-y-2">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="zorunlu">*</span>}
      </label>
      
      {React.cloneElement(children, {
        id,
        'aria-describedby': `${error ? errorId : ''} ${helpText ? helpId : ''}`.trim() || undefined,
        'aria-invalid': error ? 'true' : 'false',
        'aria-required': required ? 'true' : 'false',
      })}

      {helpText && (
        <p id={helpId} className="text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible table component
export const AccessibleTable = ({ 
  caption, 
  headers, 
  data, 
  ariaLabel 
}) => {
  return (
    <table aria-label={ariaLabel} className="w-full">
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th 
              key={index}
              scope="col"
              className="px-4 py-2 text-left text-sm font-medium"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td 
                key={cellIndex}
                className="px-4 py-2 text-sm"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Skip to content link
export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    >
      Ana içeriğe atla
    </a>
  );
};

// ARIA live region for dynamic updates
export const LiveRegion = ({ 
  children, 
  priority = 'polite' 
}) => {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
};

// Accessible button with loading state
export const AccessibleButton = ({
  children,
  onClick,
  loading,
  disabled,
  ariaLabel,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading ? 'true' : 'false'}
      {...props}
    >
      {loading && (
        <span className="sr-only">Yükleniyor...</span>
      )}
      {children}
    </button>
  );
};

// Tooltip component with ARIA
export const AccessibleTooltip = ({ 
  content, 
  children 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const id = React.useId();

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-describedby={id}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          id={id}
          role="tooltip"
          className="absolute z-10 px-2 py-1 text-xs bg-gray-900 text-white rounded shadow-lg -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          {content}
        </div>
      )}
    </div>
  );
};
