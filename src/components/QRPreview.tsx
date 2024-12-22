import React from 'react';
import { Download } from 'lucide-react';
import { downloadQRCode } from '../utils/download';
import { translations as t } from '../constants/translations';

interface QRPreviewProps {
  qrCode: string;
}

export function QRPreview({ qrCode }: QRPreviewProps) {
  return (
    <div className="flex flex-col items-center space-y-4 mt-6">
      <img
        src={qrCode}
        alt="Generated QR code"
        className="w-64 h-64 bg-white p-4 rounded-lg"
      />
      <button
        onClick={() => downloadQRCode(qrCode)}
        className="inline-flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
      >
        <Download className="w-5 h-5" />
        {t.download}
      </button>
    </div>
  );
}