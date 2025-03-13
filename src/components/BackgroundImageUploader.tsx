import React, { useState, useRef, memo } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface BackgroundImageUploaderProps {
  onBackgroundImageChange: (backgroundImageUrl: string | null) => void;
  backgroundImageUrl: string | null;
}

export const BackgroundImageUploader = memo(function BackgroundImageUploader({ 
  onBackgroundImageChange, 
  backgroundImageUrl 
}: BackgroundImageUploaderProps) {
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
            onBackgroundImageChange(optimizedImage);
          })
          .catch(() => {
            // If optimization fails, use original
            onBackgroundImageChange(e.target.result);
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
        
        // Calculate new dimensions (max 1200px width/height)
        const maxDimension = 1200;
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
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(optimizedDataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  };

  const handleRemoveBackgroundImage = () => {
    onBackgroundImageChange(null);
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Bakgrunnsbilde (valgfritt)
      </label>
      
      {backgroundImageUrl ? (
        <div className="relative w-full flex items-center justify-center p-4 bg-gray-700 rounded-lg">
          <div className="relative w-full h-24 overflow-hidden rounded">
            <img 
              src={backgroundImageUrl} 
              alt="Bakgrunnsbilde" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-white text-sm font-medium">Bakgrunnsbilde</div>
            </div>
          </div>
          <button
            onClick={handleRemoveBackgroundImage}
            className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 bg-gray-800 rounded-full"
            aria-label="Fjern bakgrunnsbilde"
          >
            <X size={16} />
          </button>
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
            Dra og slipp bakgrunnsbilde her, eller <span className="text-blue-500">klikk for å velge</span>
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