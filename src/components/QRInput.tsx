import React from 'react';
import { QRType } from '../types/qr';
import { SMSInput } from './inputs/SMSInput';
import { WiFiInput } from './inputs/WiFiInput';
import { LocationInput } from './inputs/LocationInput';

interface QRInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: QRType;
}

export function QRInput({ value, onChange, placeholder, type }: QRInputProps) {
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [ssid, setSSID] = React.useState('');
  const [wifiPassword, setWifiPassword] = React.useState('');
  const [encryption, setEncryption] = React.useState<'WPA' | 'WEP' | 'None'>('WPA');

  React.useEffect(() => {
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

  if (type.label === 'LOCATION') {
    return <LocationInput onChange={onChange} />;
  }

  const Icon = type.icon;
  return (
    <div className="flex items-center bg-gray-900 rounded-lg px-4">
      <Icon className="w-6 h-6 text-gray-400 mr-2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-white py-4 focus:outline-none placeholder-gray-500"
        aria-label={`Enter ${type.label} for QR code`}
      />
    </div>
  );
}