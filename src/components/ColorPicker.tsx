import React from 'react';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-4 bg-gray-900 rounded-lg px-4 py-3">
      <div className="flex items-center gap-2 text-gray-400">
        <Palette className="w-6 h-6" />
        <span>{label}</span>
      </div>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 bg-transparent cursor-pointer"
        aria-label={`Choose ${label.toLowerCase()}`}
      />
    </div>
  );
}