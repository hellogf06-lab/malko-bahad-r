import * as React from 'react';
import { MoreVertical } from 'lucide-react';

export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical size={16} className="text-gray-600" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {React.Children.map(children, child => 
            React.cloneElement(child, { 
              onClick: (e) => {
                child.props.onClick(e);
                setIsOpen(false);
              }
            })
          )}
        </div>
      )}
    </div>
  );
};

export const DropdownMenuItem = ({ onClick, icon: Icon, children, variant = 'default' }) => {
  const variants = {
    default: 'hover:bg-gray-50 text-gray-700',
    danger: 'hover:bg-red-50 text-red-600'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 ${variants[variant]} transition-colors`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};
