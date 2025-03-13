import React, { useState } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';
import { QRInput } from './QRInput';
import { useQRCode } from '../hooks/useQRCode';

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

          {qrCode && (
            <div className="flex flex-col items-center space-y-4 mt-6">
              <img
                src={qrCode}
                alt="Generated QR code"
                className="w-64 h-64"
              />
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = qrCode;
                  link.download = 'qrcode.png';
                  link.click();
                }}
                className="inline-flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                <Download className="w-5 h-5" />
                Download QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}