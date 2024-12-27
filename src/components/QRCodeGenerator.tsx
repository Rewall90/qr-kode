import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { QRInput } from './QRInput';
import { useQRCode } from '../../hooks/useQRCode';
import { QRPreview } from './QRPreview';

export function QRCodeGenerator() {
  const [input, setInput] = useState('');
  const { qrCode, generateQRCode } = useQRCode();

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <div className="space-y-4">
          <QRInput
            value={input}
            onChange={setInput}
            placeholder="https://"
          />

          <button
            onClick={() => generateQRCode(input)}
            disabled={!input}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Generate QR Code
          </button>

          {qrCode && <QRPreview qrCode={qrCode} />}
        </div>
      </div>
    </div>
  );
}