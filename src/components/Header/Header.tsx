import React from 'react';
import { translations as t } from '../../constants/translations';

export function Header() {
  return (
    <header className="text-center py-12 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
        {t.title}
      </h1>
      <p className="text-gray-300 max-w-3xl mx-auto text-lg">
        {t.subtitle}
      </p>
    </header>
  );
}