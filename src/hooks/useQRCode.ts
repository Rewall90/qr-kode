import { useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeOptions {
  color?: {
    dark: string;
    light: string;
  };
}

export function useQRCode() {
  const [qrCode, setQrCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async (input: string, options?: QRCodeOptions) => {
    if (!input) {
      setQrCode('');
      return;
    }
    
    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(input, {
        width: 400,
        margin: 2,
        color: options?.color ?? {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCode(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { qrCode, generateQRCode, isGenerating };
}