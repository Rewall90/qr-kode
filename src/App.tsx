import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Header } from './components/Header/Header';
import { QRCodeContainer } from './components/QRCodeContainer';

export default function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-900">
        <Helmet>
          <title>Beste Gratis QR Kode Generator a | Create Free QR Codes</title>
          <meta name="description" content="Lag QR-koder raskt med AI. Du kan legge til logoer og farger. Perfekt for nettsider, WiFi, PDF-er, YouTube og mer!" />
        </Helmet>

        <Header />
        
        <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <QRCodeContainer />
        </main>
      </div>
    </HelmetProvider>
  );
}
