import React, { useState } from 'react';
import { useQRCode } from '../hooks/useQRCode';
import { BackgroundImageUploader } from './BackgroundImageUploader';
import { LogoUploader } from './LogoUploader';

export function QRCodeTest() {
  const [input, setInput] = useState('https://qrgen.no');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [backgroundOverlayOpacity, setBackgroundOverlayOpacity] = useState<number>(0.5);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoOpacity, setLogoOpacity] = useState<number>(1);
  const [isFullSizeLogo, setIsFullSizeLogo] = useState<boolean>(false);
  const { qrCode, generateQRCode, isGenerating } = useQRCode();

  const handleGenerate = () => {
    generateQRCode(input, {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      logoUrl,
      logoOpacity,
      isFullSizeLogo,
      backgroundImageUrl,
      backgroundOverlayOpacity,
      errorCorrectionLevel: 'H'
    });
  };

  const handleBackgroundOverlayOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundOverlayOpacity(parseFloat(e.target.value));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">QR-kode Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <BackgroundImageUploader
              backgroundImageUrl={backgroundImageUrl}
              onBackgroundImageChange={setBackgroundImageUrl}
            />
            
            {backgroundImageUrl && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Bakgrunnsbilde synlighet: {Math.round((1 - backgroundOverlayOpacity) * 100)}%
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="0.8"
                  step="0.05"
                  value={backgroundOverlayOpacity}
                  onChange={handleBackgroundOverlayOpacityChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
          
          <LogoUploader
            logoUrl={logoUrl}
            onLogoChange={setLogoUrl}
            logoOpacity={logoOpacity}
            onLogoOpacityChange={setLogoOpacity}
            isFullSizeLogo={isFullSizeLogo}
            onFullSizeLogoChange={setIsFullSizeLogo}
          />
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Genererer...' : 'Generer QR-kode'}
        </button>
        
        {qrCode && (
          <div className="flex flex-col items-center space-y-4 mt-6">
            <div className="bg-white p-4 rounded-lg">
              <img
                src={qrCode}
                alt="Generert QR-kode"
                className="w-64 h-64"
              />
            </div>
            <div className="text-sm text-gray-400">
              {backgroundImageUrl ? `QR-kode med bakgrunnsbilde (${Math.round((1 - backgroundOverlayOpacity) * 100)}% synlighet)` : 'Standard QR-kode'}
              {logoUrl ? (isFullSizeLogo ? ' og logo i full størrelse' : ' og logo') : ''}
              {logoUrl && logoOpacity < 1 ? ` (${Math.round(logoOpacity * 100)}% opasitet)` : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 