import React, { useState, useCallback, memo } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { downloadQRCode, QRCodeFormat, QR_CODE_SIZES } from '../utils/download';

interface QRPreviewProps {
  qrCode: string;
}

// Bruk memo for å unngå unødvendige re-renderinger
export const QRPreview = memo(function QRPreview({ qrCode }: QRPreviewProps) {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<QRCodeFormat>('png');
  const [selectedSize, setSelectedSize] = useState<number>(400);

  // Bruk useCallback for å unngå unødvendige re-renderinger
  const handleDownload = useCallback(() => {
    downloadQRCode(qrCode, selectedFormat, selectedSize);
  }, [qrCode, selectedFormat, selectedSize]);

  const toggleDownloadOptions = useCallback(() => {
    setShowDownloadOptions(prev => !prev);
  }, []);

  const handleFormatChange = useCallback((format: QRCodeFormat) => {
    setSelectedFormat(format);
  }, []);

  const handleSizeChange = useCallback((size: number) => {
    setSelectedSize(size);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 mt-6">
      <img
        src={qrCode}
        alt="Generert QR-kode"
        className="w-64 h-64 bg-white p-4 rounded-lg"
        loading="lazy" // Legg til lazy loading for bildet
      />
      
      <div className="w-full max-w-xs">
        <div className="flex flex-col space-y-2">
          <button
            onClick={toggleDownloadOptions}
            className="inline-flex items-center justify-between gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            <span className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Last ned QR-kode
            </span>
            <ChevronDown className={`w-5 h-5 transition-transform ${showDownloadOptions ? 'rotate-180' : ''}`} />
          </button>
          
          {showDownloadOptions && (
            <div className="bg-gray-700 rounded-lg p-4 space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleFormatChange('png')}
                    className={`p-2 rounded-lg text-center transition-colors ${
                      selectedFormat === 'png'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => handleFormatChange('svg')}
                    className={`p-2 rounded-lg text-center transition-colors ${
                      selectedFormat === 'svg'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    SVG
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Størrelse
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {QR_CODE_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`p-2 rounded-lg text-center transition-colors ${
                        selectedSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {size}x{size}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleDownload}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Last ned ({selectedFormat.toUpperCase()}, {selectedSize}x{selectedSize})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});