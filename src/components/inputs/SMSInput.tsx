import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { translations as t } from '../../constants/translations';

interface SMSInputProps {
  phone: string;
  message: string;
  onPhoneChange: (value: string) => void;
  onMessageChange: (value: string) => void;
}

export function SMSInput({ phone, message, onPhoneChange, onMessageChange }: SMSInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center bg-gray-900 rounded-lg px-4">
        <Phone className="w-6 h-6 text-gray-400 mr-2" />
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder={t.phoneNumber}
          className="w-full bg-transparent text-white py-4 focus:outline-none placeholder-gray-500"
          aria-label={t.phoneNumber}
        />
      </div>
      
      <div className="bg-gray-900 rounded-lg px-4 py-3">
        <div className="flex items-center mb-2">
          <MessageSquare className="w-6 h-6 text-gray-400 mr-2" />
          <span className="text-gray-400">{t.message}</span>
        </div>
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={t.writeMessage}
          rows={4}
          className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 resize-y min-h-[100px]"
          aria-label={t.message}
        />
      </div>
    </div>
  );
}