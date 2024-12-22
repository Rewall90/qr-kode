import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Header } from './components/Header/Header';
import { QRCodeContainer } from './components/QRCodeContainer';

export default function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-900">
        <Helmet>
          <title>Beste Gratis QR Kode Generator | Create Free QR Codes</title>
          <meta name="description" content="Generate QR codes instantly with AI. Add logos, colors, and create QR codes for URLs, WiFi, PDF, YouTube and more!" />
        </Helmet>

        <Header />
        
        <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <QRCodeContainer />
        </main>
      </div>
    </HelmetProvider>
  );
}