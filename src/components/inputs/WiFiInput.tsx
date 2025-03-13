import React from 'react';
import { Wifi, Lock, Tag } from 'lucide-react';
import { translations as t } from '../../constants/translations';

interface WiFiInputProps {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'None';
  onSSIDChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onEncryptionChange: (value: 'WPA' | 'WEP' | 'None') => void;
}

export function WiFiInput({ 
  ssid, 
  password, 
  encryption, 
  onSSIDChange, 
  onPasswordChange, 
  onEncryptionChange 
}: WiFiInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center bg-gray-900 rounded-lg px-4">
        <Tag className="w-6 h-6 text-gray-400 mr-2" />
        <input
          type="text"
          value={ssid}
          onChange={(e) => onSSIDChange(e.target.value)}
          placeholder={t.networkName}
          className="w-full bg-transparent text-white py-4 focus:outline-none placeholder-gray-500"
          aria-label={t.networkName}
        />
      </div>

      <div className="flex items-center bg-gray-900 rounded-lg px-4">
        <Lock className="w-6 h-6 text-gray-400 mr-2" />
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder={t.password}
          className="w-full bg-transparent text-white py-4 focus:outline-none placeholder-gray-500"
          aria-label={t.password}
        />
      </div>

      <div className="flex items-center gap-4">
        {(['WPA', 'WEP', 'None'] as const).map((type) => (
          <button
            key={type}
            onClick={() => onEncryptionChange(type)}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              encryption === type 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}