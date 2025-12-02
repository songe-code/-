import React from 'react';
import { ELEMENTS } from '../constants';
import { FuturesElement, ElementCategory } from '../types';
import ElementCard from './ElementCard';

interface PeriodicTableProps {
  onElementSelect: (element: FuturesElement) => void;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onElementSelect }) => {
  // Group elements by category for legend or just render grid
  const categories = Object.values(ElementCategory);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getCategoryColorDot(cat)}`}></div>
            <span className="text-sm text-gray-300">{cat}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
        {ELEMENTS.map((element) => (
          <ElementCard 
            key={element.symbol} 
            element={element} 
            onClick={onElementSelect} 
          />
        ))}
      </div>
    </div>
  );
};

// Helper for legend dots
function getCategoryColorDot(cat: ElementCategory): string {
  switch (cat) {
    case ElementCategory.BASIC: return 'bg-blue-500';
    case ElementCategory.MECHANISM: return 'bg-emerald-500';
    case ElementCategory.RISK: return 'bg-rose-500';
    case ElementCategory.STRATEGY: return 'bg-purple-500';
    case ElementCategory.ASSET: return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
}

export default PeriodicTable;