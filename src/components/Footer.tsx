import React from 'react';

export function Footer() {
  return (
    <footer className="mt-12 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} QR Kode Generator. Alle rettigheter reservert.
          </p>
          <nav className="flex space-x-4">
            <a
              href="/personvern"
              className="text-gray-500 hover:text-gray-600 text-sm"
            >
              Personvern
            </a>
            <a
              href="/vilkar"
              className="text-gray-500 hover:text-gray-600 text-sm"
            >
              Vilkår
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}