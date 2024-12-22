import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QRTypeButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export function QRTypeButton({ icon: Icon, label, isActive = false, onClick }: QRTypeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center min-w-[84px] px-4 py-3 rounded-lg transition-all ${
        isActive 
          ? 'text-blue-400 bg-blue-500/10' 
          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
      }`}
      aria-label={`Generate ${label} QR code`}
    >
      <Icon className="w-7 h-7 mb-1.5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}