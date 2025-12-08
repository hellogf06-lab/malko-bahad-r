import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TableHead } from './ui/table';

const SortableHeader = ({ label, sortKey, currentSort, onSort }) => {
  const isActive = currentSort.key === sortKey;
  
  return (
    <TableHead 
      onClick={() => onSort(sortKey)}
      className={`cursor-pointer select-none transition-colors ${
        isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'
      }`}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive && (
          currentSort.direction === 'asc' 
            ? <ChevronUp size={14} className="text-indigo-600"/> 
            : <ChevronDown size={14} className="text-indigo-600"/>
        )}
      </div>
    </TableHead>
  );
};

export default SortableHeader;
