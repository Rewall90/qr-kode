import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Tooltip } from '../UI/Tooltip';

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  tooltip: string;
  onClick: () => void;
  isActive?: boolean;
}

export function IconButton({ icon: Icon, label, tooltip, onClick, isActive = false }: IconButtonProps) {
  return (
    <Tooltip content={tooltip}>
      <button
        onClick={onClick}
        className={`
          flex flex-col items-center p-3 rounded-lg transition-all
          hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2
          ${isActive 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }
        `}
        aria-label={tooltip}
      >
        <Icon className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">{label}</span>
      </button>
    </Tooltip>
  );
}