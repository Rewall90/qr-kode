import React, { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { translations as t } from '../../constants/translations';

interface LocationInputProps {
  onChange: (value: string) => void;
}

interface Coordinates {
  lat: string;
  lng: string;
}

export function LocationInput({ onChange }: LocationInputProps) {
  const [mode, setMode] = useState<'address' | 'coordinates'>('address');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat: '', lng: '' });

  useEffect(() => {
    if (mode === 'address' && address) {
      onChange(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
    } else if (mode === 'coordinates' && coordinates.lat && coordinates.lng) {
      onChange(`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`);
    }
  }, [mode, address, coordinates, onChange]);

  const handleCoordinatesPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const coords = pastedText.split(',').map(s => s.trim());
    
    if (coords.length === 2 && !isNaN(Number(coords[0])) && !isNaN(Number(coords[1]))) {
      setCoordinates({
        lat: coords[0],
        lng: coords[1]
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={() => setMode('address')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            mode === 'address'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          {t.address}
        </button>
        <button
          onClick={() => setMode('coordinates')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            mode === 'coordinates'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          {t.coordinates}
        </button>
      </div>

      {mode === 'address' ? (
        <div className="flex items-center bg-gray-900 rounded-lg px-4">
          <Search className="w-6 h-6 text-gray-400 mr-2" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t.enterAddress}
            className="w-full bg-transparent text-white py-4 focus:outline-none placeholder-gray-500"
            aria-label={t.address}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center bg-gray-900 rounded-lg px-4">
            <MapPin className="w-6 h-6 text-gray-400 mr-2" />
            <input
              type="text"
              value={`${coordinates.lat}${coordinates.lat && coordinates.lng ? ', ' : ''}${coordinates.lng}`}
              onChange={(e) => {
                const [lat, lng] = e.target.value.split(',').map(s => s.trim());
                setCoordinates({ lat: lat || '', lng: lng || '' });
              }}
              onPaste={handleCoordinatesPaste}
              placeholder={t.coordinatesExample}
              className="w-full bg-transparent text-white py-4 focus:outline-none placeholder-gray-500"
              aria-label={t.coordinates}
            />
          </div>
          <p className="text-sm text-gray-400 px-2">
            {t.coordinatesExample}
          </p>
        </div>
      )}
    </div>
  );
}