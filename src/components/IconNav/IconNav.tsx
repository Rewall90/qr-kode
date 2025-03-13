import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { QRTypeButton } from './QRTypeButton';
import { qrTypes } from '../../constants/qrTypes';
import { QRType } from '../../types/qr';

interface IconNavProps {
  activeType: QRType;
  onTypeChange: (type: QRType) => void;
}

export function IconNav({ activeType, onTypeChange }: IconNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    checkScroll();

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      {/* Left scroll button */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-gray-800 via-gray-800/95 to-transparent w-16 flex items-center pl-2">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors"
            aria-label="Show previous options"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}

      <div 
        ref={containerRef}
        className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {qrTypes.map((type) => (
          <QRTypeButton
            key={type.label}
            {...type}
            isActive={activeType.label === type.label}
            onClick={() => onTypeChange(type)}
          />
        ))}
      </div>

      {/* Right scroll button */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-gray-800 via-gray-800/95 to-transparent w-16 flex items-center justify-end pr-2">
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors"
            aria-label="Show more options"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
}