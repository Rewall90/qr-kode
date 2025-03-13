import React from 'react';
import { QRTemplate, qrTemplates } from '../constants/qrTemplates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: QRTemplate) => void;
  selectedTemplateId: string | null;
}

export function TemplateSelector({ onSelectTemplate, selectedTemplateId }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        Velg mal
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {qrTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`p-3 rounded-lg border transition-colors ${
              selectedTemplateId === template.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-center mb-2">
              <div 
                className="w-8 h-8 rounded-md" 
                style={{ backgroundColor: template.options.color.dark }}
              />
            </div>
            <div className="font-medium text-sm">{template.name}</div>
            <div className="text-xs text-gray-400 mt-1">{template.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
} 