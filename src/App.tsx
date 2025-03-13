import React, { lazy, Suspense } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Header } from './components/Header/Header';

// Lazy load the QRCodeContainer component
const QRCodeContainer = lazy(() => import('./components/QRCodeContainer').then(module => ({
  default: module.QRCodeContainer
})));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-900">
        <Helmet>
          <title>Beste Gratis QR Kode Generator</title>
          <meta name="description" content="Lag QR-koder raskt med AI. Du kan legge til logoer og farger. Perfekt for nettsider, WiFi, PDF-er, YouTube og mer!" />
        </Helmet>

        <Header />
        
        <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<LoadingFallback />}>
            <QRCodeContainer />
          </Suspense>
        </main>
      </div>
    </HelmetProvider>
  );
}
