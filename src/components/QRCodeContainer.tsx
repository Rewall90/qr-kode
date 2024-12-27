import React, { useState, useEffect } from 'react';
import { IconNav } from './IconNav/IconNav';
import { QRInput } from './QRInput';
import { useQRCode } from '../hooks/useQRCode';
import { QRPreview } from './QRPreview';
import { QRType } from '../types/qr';
import { qrTypes } from '../constants/qrTypes';
import { ColorPicker } from './ColorPicker';

export function QRCodeContainer() {
  const [activeType, setActiveType] = useState<QRType>(qrTypes[0]);
  const [input, setInput] = useState('');
  const [showColorPickers, setShowColorPickers] = useState(false);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const { qrCode, generateQRCode, isGenerating } = useQRCode();

  const handleTypeChange = (type: QRType) => {
    setActiveType(type);
    setInput('');
    setShowColorPickers(false);
  };

  const handleGenerate = () => {
    generateQRCode(input, {
      color: {
        dark: foregroundColor,
        light: backgroundColor
      }
    });
    setShowColorPickers(true);
  };

  useEffect(() => {
    if (foregroundColor && backgroundColor && showColorPickers) {
      generateQRCode(input, {
        color: {
          dark: foregroundColor,
          light: backgroundColor
        }
      });
    }
  }, [foregroundColor, backgroundColor]);

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full mx-auto">
      <IconNav activeType={activeType} onTypeChange={handleTypeChange} />
      
      <div className="p-8 space-y-6">
        <QRInput
          value={input}
          onChange={setInput}
          placeholder={activeType.placeholder}
          type={activeType}
        />

        <button
          onClick={handleGenerate}
          disabled={!input || isGenerating}
          className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
        >
          {isGenerating ? 'Genererer...' : 'Lag QR-kode'}
        </button>

        {showColorPickers && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
            <ColorPicker
              label="QR-kode farge"
              color={foregroundColor}
              onChange={setForegroundColor}
            />
            <ColorPicker
              label="Bakgrunnsfarge"
              color={backgroundColor}
              onChange={setBackgroundColor}
            />
          </div>
        )}

        {qrCode && <QRPreview qrCode={qrCode} />}
      </div>
    </div>
  );
}