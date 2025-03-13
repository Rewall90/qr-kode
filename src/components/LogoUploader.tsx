import React, { useState, useRef, memo } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface LogoUploaderProps {
  onLogoChange: (logoUrl: string | null) => void;
  logoUrl: string | null;
  onLogoOpacityChange?: (opacity: number) => void;
  logoOpacity?: number;
  onFullSizeLogoChange?: (isFullSize: boolean) => void;
  isFullSizeLogo?: boolean;
}

export const LogoUploader = memo(function LogoUploader({ 
  onLogoChange, 
  logoUrl,
  onLogoOpacityChange = () => {},
  logoOpacity = 1,
  onFullSizeLogoChange = () => {},
  isFullSizeLogo = false
}: LogoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Vennligst velg et bilde');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Bildet er for stort. Maksimal størrelse er 2MB.');
      return;
    }

    // Use FileReader to convert to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        // Optimize image before passing it up
        optimizeImage(e.target.result)
          .then(optimizedImage => {
            onLogoChange(optimizedImage);
          })
          .catch(() => {
            // If optimization fails, use original
            onLogoChange(e.target.result);
          });
      }
    };
    reader.readAsDataURL(file);
  };

  // Function to optimize image size/quality
  const optimizeImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Calculate new dimensions (max 800px width/height)
        const maxDimension = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round(height * (maxDimension / width));
            width = maxDimension;
          } else {
            width = Math.round(width * (maxDimension / height));
            height = maxDimension;
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw image with high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL with reduced quality
        const optimizedDataUrl = canvas.toDataURL('image/png', 0.9);
        resolve(optimizedDataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLogoOpacityChange(parseFloat(e.target.value));
  };

  const handleFullSizeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFullSizeLogoChange(e.target.checked);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Logo (valgfritt)
      </label>
      
      {logoUrl ? (
        <div className="space-y-4">
          <div className="relative w-full flex items-center justify-center p-4 bg-gray-700 rounded-lg">
            <div className="relative w-full h-24 overflow-hidden rounded">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-full h-full object-contain"
                style={{ opacity: logoOpacity }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-white text-sm font-medium">Logo</div>
              </div>
            </div>
            <button
              onClick={handleRemoveLogo}
              className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 bg-gray-800 rounded-full"
              aria-label="Fjern logo"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Logo opasitet: {Math.round(logoOpacity * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={logoOpacity}
                onChange={handleOpacityChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="fullSizeLogo"
                checked={isFullSizeLogo}
                onChange={handleFullSizeToggle}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="fullSizeLogo" className="ml-2 text-sm font-medium text-gray-300">
                Vis logo over hele QR-koden
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-400">
            Dra og slipp logo her, eller <span className="text-blue-500">klikk for å velge</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG eller SVG (maks 2MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}); 