import { useState, useCallback, useRef } from 'react';
import { generateQRCode, generateQRCodeWithLogo, QRCodeOptions } from '../utils/qrCodeGenerator';

interface CacheKey {
  input: string;
  options: string; // JSON stringified options
}

// Extended options interface for the hook
interface ExtendedQRCodeOptions extends QRCodeOptions {
  logoUrl?: string | null;
  backgroundImageUrl?: string | null;
  logoOpacity?: number;
  isFullSizeLogo?: boolean;
  backgroundOverlayOpacity?: number;
}

export function useQRCode() {
  const [qrCode, setQrCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cache for QR codes to avoid regenerating the same QR code
  const qrCodeCache = useRef<Map<string, string>>(new Map());

  // Generer en cache-nøkkel basert på input og options
  const generateCacheKey = (input: string, options?: ExtendedQRCodeOptions): string => {
    return JSON.stringify({ input, options });
  };

  const generateQRCodeWithOptions = useCallback(async (
    input: string, 
    options?: ExtendedQRCodeOptions
  ) => {
    if (!input) {
      setQrCode('');
      return;
    }
    
    // Sjekk om QR-koden allerede er i cachen
    const cacheKey = generateCacheKey(input, options);
    const cachedQRCode = qrCodeCache.current.get(cacheKey);
    
    if (cachedQRCode) {
      setQrCode(cachedQRCode);
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      let url: string;
      
      if (options?.logoUrl || options?.backgroundImageUrl) {
        // Generer QR-kode med logo og/eller bakgrunnsbilde
        url = await generateQRCodeWithLogo(input, options.logoUrl || null, {
          color: options.color,
          errorCorrectionLevel: options.errorCorrectionLevel || 'H', // Høy feilkorrigering for logo/bakgrunnsbilde
          width: options.width,
          margin: options.margin,
          backgroundImageUrl: options.backgroundImageUrl,
          logoOpacity: options.logoOpacity,
          isFullSizeLogo: options.isFullSizeLogo,
          backgroundOverlayOpacity: options.backgroundOverlayOpacity
        });
      } else {
        // Generer standard QR-kode
        url = await generateQRCode(input, {
          color: options?.color,
          errorCorrectionLevel: options?.errorCorrectionLevel,
          width: options?.width,
          margin: options?.margin
        });
      }
      
      // Lagre QR-koden i cachen
      qrCodeCache.current.set(cacheKey, url);
      
      // Begrens cache-størrelsen til 20 elementer
      if (qrCodeCache.current.size > 20) {
        const firstKey = qrCodeCache.current.keys().next().value;
        if (firstKey) {
          qrCodeCache.current.delete(firstKey);
        }
      }
      
      setQrCode(url);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Kunne ikke generere QR-kode');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { 
    qrCode, 
    generateQRCode: generateQRCodeWithOptions, 
    isGenerating,
    error,
    // Legg til en metode for å tømme cachen
    clearCache: () => qrCodeCache.current.clear()
  };
}