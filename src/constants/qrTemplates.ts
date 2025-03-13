import { QRCodeOptions } from '../utils/qrCodeGenerator';

export interface QRTemplate {
  id: string;
  name: string;
  description: string;
  options: QRCodeOptions & { 
    color: {
      dark: string;
      light: string;
    };
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    backgroundImageUrl?: string | null;
  };
}

export const qrTemplates: QRTemplate[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Klassisk svart på hvit QR-kode',
    options: {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    }
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Profesjonell blå stil for bedrifter',
    options: {
      color: {
        dark: '#0056b3',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    }
  },
  {
    id: 'social-media',
    name: 'Sosiale Medier',
    description: 'Livlig rosa stil for sosiale medier',
    options: {
      color: {
        dark: '#e91e63',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'Q'
    }
  },
  {
    id: 'eco',
    name: 'Miljøvennlig',
    description: 'Grønn stil for miljøbevisste',
    options: {
      color: {
        dark: '#4CAF50',
        light: '#F1F8E9'
      },
      errorCorrectionLevel: 'M'
    }
  },
  {
    id: 'dark-mode',
    name: 'Mørk Modus',
    description: 'Hvit på svart for mørke bakgrunner',
    options: {
      color: {
        dark: '#FFFFFF',
        light: '#121212'
      },
      errorCorrectionLevel: 'H'
    }
  },
  {
    id: 'high-contrast',
    name: 'Høy Kontrast',
    description: 'Maksimal lesbarhet for skannere',
    options: {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    }
  },
  {
    id: 'modern',
    name: 'Moderne',
    description: 'Stilig lilla design',
    options: {
      color: {
        dark: '#673AB7',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'Q'
    }
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro brun stil',
    options: {
      color: {
        dark: '#795548',
        light: '#EFEBE9'
      },
      errorCorrectionLevel: 'M'
    }
  }
]; 