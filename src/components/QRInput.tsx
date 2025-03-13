import React, { useState, useEffect } from 'react';
import { QRType } from '../types/qr';
import { SMSInput } from './inputs/SMSInput';
import { WiFiInput } from './inputs/WiFiInput';
import { LocationInput } from './inputs/LocationInput';
import { validateQRContent } from '../utils/validation';
import { AlertCircle } from 'lucide-react';

interface QRInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: QRType;
}

export function QRInput({ value, onChange, placeholder, type }: QRInputProps) {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [ssid, setSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [encryption, setEncryption] = useState<'WPA' | 'WEP' | 'None'>('WPA');
  const [validationError, setValidationError] = useState<string | undefined>(undefined);

  // Valider innholdet når det endres
  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    
    // Valider bare hvis det er innhold
    if (newValue.trim()) {
      const validation = validateQRContent(newValue, type);
      setValidationError(validation.isValid ? undefined : validation.message);
    } else {
      setValidationError(undefined);
    }
  };

  useEffect(() => {
    // Nullstill validering når type endres
    setValidationError(undefined);
    
    // Generate the appropriate QR code content based on type
    if (type.label === 'SMS') {
      onChange(`SMSTO:${phone}:${message}`);
    } else if (type.label === 'WIFI') {
      const wifiString = `WIFI:T:${encryption};S:${ssid};P:${wifiPassword};;`;
      onChange(wifiString);
    }
  }, [type.label, phone, message, ssid, wifiPassword, encryption, onChange]);

  if (type.label === 'SMS') {
    return (
      <SMSInput
        phone={phone}
        message={message}
        onPhoneChange={setPhone}
        onMessageChange={setMessage}
      />
    );
  }

  if (type.label === 'WIFI') {
    return (
      <WiFiInput
        ssid={ssid}
        password={wifiPassword}
        encryption={encryption}
        onSSIDChange={setSSID}
        onPasswordChange={setWifiPassword}
        onEncryptionChange={setEncryption}
      />
    );
  }

  if (type.label === 'GEOLOKASJON') {
    return <LocationInput onChange={handleInputChange} />;
  }

  const Icon = type.icon;
  return (
    <div className="space-y-2">
      <div className={`flex items-center bg-gray-900 rounded-lg px-4 ${validationError ? 'border border-red-500' : ''}`}>
        <Icon className="w-6 h-6 text-gray-400 mr-2" />
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-white py-4 focus:outline-none placeholder-gray-500"
          aria-label={`Skriv inn ${type.label.toLowerCase()} for QR-kode`}
        />
      </div>
      
      {validationError && (
        <div className="flex items-center text-red-400 text-sm mt-1">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}