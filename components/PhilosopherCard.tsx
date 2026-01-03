
import React from 'react';
import { Philosopher } from '../types';

interface Props {
  philosopher: Philosopher;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const PhilosopherCard: React.FC<Props> = ({ philosopher, selected, onClick, disabled }) => {
  return (
    <div 
      onClick={disabled ? undefined : onClick}
      className={`
        relative p-4 rounded-xl border-2 transition-all cursor-pointer overflow-hidden
        ${selected ? 'border-amber-600 bg-amber-50 shadow-md' : 'border-gray-200 bg-white hover:border-amber-300'}
        ${disabled && !selected ? 'opacity-40 cursor-not-allowed scale-95' : 'hover:scale-105'}
      `}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <img 
          src={philosopher.avatar} 
          alt={philosopher.name} 
          className="w-16 h-16 rounded-full border-2 border-gray-100 object-cover"
        />
        <h3 className="font-bold text-lg text-gray-800 serif-font">{philosopher.name}</h3>
        <p className="text-xs text-amber-700 font-semibold">{philosopher.era}</p>
        <p className="text-xs text-gray-500 line-clamp-2">{philosopher.description}</p>
      </div>
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="bg-amber-600 text-white rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhilosopherCard;
