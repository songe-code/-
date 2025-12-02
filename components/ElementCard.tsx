import React from 'react';
import { FuturesElement, ElementCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ElementCardProps {
  element: FuturesElement;
  onClick: (element: FuturesElement) => void;
}

const ElementCard: React.FC<ElementCardProps> = ({ element, onClick }) => {
  const colorClass = CATEGORY_COLORS[element.category];

  return (
    <button
      onClick={() => onClick(element)}
      className={`
        relative flex flex-col items-start justify-between 
        w-full aspect-[4/5] p-2 md:p-3 
        border rounded-lg 
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]
        cursor-pointer text-left
        ${colorClass}
      `}
    >
      <span className="text-xs opacity-70 font-mono">{element.atomicNumber}</span>
      <div className="flex flex-col items-center self-center my-1">
        <span className="text-2xl md:text-3xl font-bold font-serif">{element.symbol}</span>
      </div>
      <div className="w-full">
        <p className="text-xs md:text-sm font-semibold truncate w-full text-center">{element.name}</p>
        <p className="hidden md:block text-[10px] opacity-80 truncate text-center mt-1">{element.shortDesc}</p>
      </div>
    </button>
  );
};

export default ElementCard;