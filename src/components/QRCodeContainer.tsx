import React, { useState, useEffect, lazy, Suspense } from 'react';
import { IconNav } from './IconNav/IconNav';
import { QRInput } from './QRInput';
import { useQRCode } from '../hooks/useQRCode';
import { QRType } from '../types/qr';
import { qrTypes } from '../constants/qrTypes';
import { ColorPicker } from './ColorPicker';
import { LogoUploader } from './LogoUploader';
import { BackgroundImageUploader } from './BackgroundImageUploader';
import { TemplateSelector } from './TemplateSelector';
import { qrTemplates, QRTemplate } from '../constants/qrTemplates';

// Lazy load QRPreview component
const QRPreview = lazy(() => import('./QRPreview').then(module => ({
  default: module.QRPreview
})));

// Loading fallback component
const PreviewLoadingFallback = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Feilkorrigeringsnivåer med beskrivelser
const errorCorrectionLevels = [
  { value: 'L', label: 'Lav (7%)', description: 'Raskere, men mindre robust' },
  { value: 'M', label: 'Medium (15%)', description: 'Standard balanse' },
  { value: 'Q', label: 'Kvartil (25%)', description: 'God for logo' },
  { value: 'H', label: 'Høy (30%)', description: 'Best for logo og farger' },
];

export function QRCodeContainer() {
  const [activeType, setActiveType] = useState<QRType>(qrTypes[0]);
  const [input, setInput] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoOpacity, setLogoOpacity] = useState<number>(1);
  const [isFullSizeLogo, setIsFullSizeLogo] = useState<boolean>(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [backgroundOverlayOpacity, setBackgroundOverlayOpacity] = useState<number>(0.5);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const { qrCode, generateQRCode, isGenerating, error } = useQRCode();

  const handleTypeChange = (type: QRType) => {
    setActiveType(type);
    setInput('');
    setShowAdvancedOptions(false);
    setSelectedTemplateId(null);
  };

  const handleGenerate = () => {
    generateQRCode(input, {
      color: {
        dark: foregroundColor,
        light: backgroundColor
      },
      logoUrl,
      logoOpacity,
      isFullSizeLogo,
      backgroundImageUrl,
      backgroundOverlayOpacity,
      errorCorrectionLevel
    });
    setShowAdvancedOptions(true);
  };

  const handleTemplateSelect = (template: QRTemplate) => {
    setSelectedTemplateId(template.id);
    setForegroundColor(template.options.color.dark);
    setBackgroundColor(template.options.color.light);
    setErrorCorrectionLevel(template.options.errorCorrectionLevel);
    
    // Oppdater QR-koden med de nye innstillingene
    if (input) {
      generateQRCode(input, {
        color: template.options.color,
        logoUrl,
        logoOpacity,
        isFullSizeLogo,
        backgroundImageUrl,
        backgroundOverlayOpacity,
        errorCorrectionLevel: template.options.errorCorrectionLevel
      });
    }
  };

  // Bruk debounce for å unngå for mange re-renderinger
  useEffect(() => {
    if (foregroundColor && backgroundColor && showAdvancedOptions && input) {
      const debounceTimer = setTimeout(() => {
        generateQRCode(input, {
          color: {
            dark: foregroundColor,
            light: backgroundColor
          },
          logoUrl,
          logoOpacity,
          isFullSizeLogo,
          backgroundImageUrl,
          backgroundOverlayOpacity,
          errorCorrectionLevel
        });
      }, 300); // 300ms debounce
      
      return () => clearTimeout(debounceTimer);
    }
  }, [foregroundColor, backgroundColor, logoUrl, logoOpacity, isFullSizeLogo, backgroundImageUrl, backgroundOverlayOpacity, errorCorrectionLevel, input, showAdvancedOptions, generateQRCode]);

  // Sett høy feilkorrigering når bakgrunnsbilde er valgt eller logo i full størrelse
  useEffect(() => {
    if ((backgroundImageUrl || isFullSizeLogo) && errorCorrectionLevel !== 'H') {
      setErrorCorrectionLevel('H');
    }
  }, [backgroundImageUrl, isFullSizeLogo, errorCorrectionLevel]);

  // Håndterer endring av bakgrunnsbildets opasitet
  const handleBackgroundOverlayOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundOverlayOpacity(parseFloat(e.target.value));
  };

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

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        )}

        {showAdvancedOptions && (
          <div className="space-y-6 animate-fade-in">
            <TemplateSelector 
              onSelectTemplate={handleTemplateSelect}
              selectedTemplateId={selectedTemplateId}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Tilpass QR-koden</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <BackgroundImageUploader 
                    backgroundImageUrl={backgroundImageUrl} 
                    onBackgroundImageChange={setBackgroundImageUrl} 
                  />
                  
                  {backgroundImageUrl && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
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
                      <p className="text-xs text-gray-400">
                        Juster for å gjøre bakgrunnsbildet mer eller mindre synlig. Høyere verdier kan påvirke QR-kodens lesbarhet.
                      </p>
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
              
              {backgroundImageUrl && (
                <div className="bg-blue-500/10 border border-blue-500 text-blue-200 p-4 rounded-lg text-sm">
                  <p>Bakgrunnsbilde er aktivert. Høy feilkorrigering (H) er automatisk valgt for best lesbarhet.</p>
                </div>
              )}
              
              {isFullSizeLogo && (
                <div className="bg-blue-500/10 border border-blue-500 text-blue-200 p-4 rounded-lg text-sm">
                  <p>Logo i full størrelse er aktivert. Høy feilkorrigering (H) er automatisk valgt for best lesbarhet.</p>
                  <p className="mt-1">Juster opasiteten for å sikre at QR-koden fortsatt kan skannes.</p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Feilkorrigeringsnivå
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {errorCorrectionLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setErrorCorrectionLevel(level.value as 'L' | 'M' | 'Q' | 'H')}
                    disabled={(backgroundImageUrl !== null || isFullSizeLogo) && level.value !== 'H'}
                    className={`p-2 rounded-lg text-center transition-colors ${
                      errorCorrectionLevel === level.value
                        ? 'bg-blue-600 text-white'
                        : (backgroundImageUrl !== null || isFullSizeLogo) && level.value !== 'H'
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">{level.label}</div>
                    <div className="text-xs opacity-80">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {qrCode && (
          <Suspense fallback={<PreviewLoadingFallback />}>
            <QRPreview qrCode={qrCode} />
          </Suspense>
        )}
      </div>
    </div>
  );
}