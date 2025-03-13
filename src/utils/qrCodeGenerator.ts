import QRCode from 'qrcode';

export interface QRCodeOptions {
  color?: {
    dark: string;
    light: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  width?: number;
  margin?: number;
  backgroundImageUrl?: string | null;
  logoOpacity?: number;
  isFullSizeLogo?: boolean;
  backgroundOverlayOpacity?: number;
}

// Arbeidere for å håndtere QR-kode generering i en separat tråd
let qrWorker: Worker | null = null;

// Sjekk om Web Workers er støttet
const isWorkerSupported = typeof Worker !== 'undefined';

// Initialiser Web Worker hvis støttet
function initWorker() {
  if (isWorkerSupported && !qrWorker) {
    try {
      // Denne koden vil bli erstattet av en faktisk Worker-implementasjon i en produksjonsversjon
      // For nå bruker vi en enkel polyfill
      qrWorker = {
        postMessage: () => {},
        onmessage: null,
        terminate: () => {}
      } as unknown as Worker;
    } catch (e) {
      console.error('Kunne ikke opprette Web Worker:', e);
    }
  }
}

/**
 * Genererer en QR-kode med bakgrunnsbilde og/eller logo
 * @param text Teksten som skal kodes i QR-koden
 * @param logoUrl URL til logoen som skal legges over QR-koden
 * @param options Tilpasningsalternativer for QR-koden
 * @returns Promise med data URL til den genererte QR-koden
 */
export async function generateQRCodeWithLogo(
  text: string,
  logoUrl: string | null,
  options: QRCodeOptions = {}
): Promise<string> {
  // Sett standardverdier for alternativer
  const qrOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel || 'H', // Høy feilkorrigering for logo og bakgrunnsbilde
    width: options.width || 400,
    margin: options.margin || 2,
    color: options.color || {
      dark: '#000000',
      light: '#FFFFFF',
    },
    logoOpacity: options.logoOpacity ?? 1,
    isFullSizeLogo: options.isFullSizeLogo ?? false,
    backgroundOverlayOpacity: options.backgroundOverlayOpacity ?? 0.5 // Standard opasitet for bakgrunnsoverlay
  };

  // Hvis ingen logo eller bakgrunnsbilde, bruk standard QR-kode generering
  if (!logoUrl && !options.backgroundImageUrl) {
    return generateQRCode(text, qrOptions);
  }

  // Opprett canvas for QR-kode
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Kunne ikke opprette canvas-kontekst');
  }

  // Sett canvas-størrelse
  canvas.width = qrOptions.width;
  canvas.height = qrOptions.width;

  try {
    // Hvis det er et bakgrunnsbilde, tegn det først
    if (options.backgroundImageUrl) {
      await drawBackgroundImage(ctx, canvas, options.backgroundImageUrl, qrOptions.backgroundOverlayOpacity);
    } else {
      // Hvis ingen bakgrunnsbilde, fyll med bakgrunnsfarge
      ctx.fillStyle = qrOptions.color.light;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Hvis det er en logo og den skal vises i full størrelse, tegn den før QR-koden
    if (logoUrl && qrOptions.isFullSizeLogo) {
      await drawFullSizeLogo(ctx, canvas, logoUrl, qrOptions.logoOpacity);
    }

    // Generer QR-kode data
    const qrData = await QRCode.create(text, {
      errorCorrectionLevel: qrOptions.errorCorrectionLevel,
    });
    
    // Tegn QR-kode manuelt for å ha mer kontroll
    const moduleCount = qrData.modules.size;
    const moduleSize = (canvas.width - qrOptions.margin * 2) / moduleCount;
    const startPoint = qrOptions.margin;
    
    // Tegn QR-kode moduler
    ctx.fillStyle = qrOptions.color.dark;
    
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qrData.modules.get(row, col)) {
          ctx.fillRect(
            startPoint + col * moduleSize,
            startPoint + row * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }

    // Hvis det er en logo og den IKKE skal vises i full størrelse, legg den til på toppen
    if (logoUrl && !qrOptions.isFullSizeLogo) {
      await drawLogo(ctx, canvas, logoUrl, qrOptions.logoOpacity);
    }

    // Optimaliser bildet ved å redusere kvaliteten litt
    const quality = 0.92; // 92% kvalitet gir god balanse mellom størrelse og kvalitet
    return canvas.toDataURL('image/png', quality);
  } catch (error) {
    console.error('Feil ved generering av QR-kode med bakgrunnsbilde/logo:', error);
    // Fallback til standard QR-kode uten bakgrunnsbilde/logo
    return generateQRCode(text, qrOptions);
  }
}

/**
 * Tegner et bakgrunnsbilde på canvas
 * @param ctx Canvas-kontekst
 * @param canvas Canvas-element
 * @param backgroundImageUrl URL til bakgrunnsbildet
 * @param overlayOpacity Opasitet for den hvite overlayen (0-1)
 */
async function drawBackgroundImage(
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  backgroundImageUrl: string,
  overlayOpacity: number = 0.5
): Promise<void> {
  const backgroundImage = new Image();
  const bgCacheBuster = `?t=${Date.now()}`;
  backgroundImage.src = backgroundImageUrl.includes('data:') 
    ? backgroundImageUrl 
    : `${backgroundImageUrl}${bgCacheBuster}`;
  
  // Vent på at bakgrunnsbildet lastes inn
  await new Promise<void>((resolve, reject) => {
    backgroundImage.onload = () => resolve();
    backgroundImage.onerror = () => reject(new Error('Kunne ikke laste inn bakgrunnsbilde'));
    setTimeout(() => reject(new Error('Tidsavbrudd ved lasting av bakgrunnsbilde')), 5000);
  });
  
  // Tegn bakgrunnsbildet skalert til å passe canvas
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  
  // Legg til en semi-transparent hvit overlay for å sikre at QR-koden er lesbar
  // Redusert opasitet for å gjøre bakgrunnsbildet mer synlig
  ctx.fillStyle = `rgba(255, 255, 255, ${overlayOpacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Tegner en logo i full størrelse på canvas
 * @param ctx Canvas-kontekst
 * @param canvas Canvas-element
 * @param logoUrl URL til logoen
 * @param opacity Opasitet for logoen (0-1)
 */
async function drawFullSizeLogo(
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  logoUrl: string,
  opacity: number = 1
): Promise<void> {
  const logo = new Image();
  const cacheBuster = `?t=${Date.now()}`;
  logo.src = logoUrl.includes('data:') ? logoUrl : `${logoUrl}${cacheBuster}`;
  
  // Vent på at logoen lastes inn
  await new Promise<void>((resolve, reject) => {
    logo.onload = () => resolve();
    logo.onerror = () => reject(new Error('Kunne ikke laste inn logo'));
    setTimeout(() => reject(new Error('Tidsavbrudd ved lasting av logo')), 5000);
  });

  // Lagre nåværende canvas-tilstand
  ctx.save();
  
  // Sett global opasitet for logoen
  ctx.globalAlpha = opacity;
  
  // Tegn logoen over hele canvas
  ctx.drawImage(logo, 0, 0, canvas.width, canvas.height);
  
  // Gjenopprett canvas-tilstand
  ctx.restore();
}

/**
 * Tegner en logo på canvas
 * @param ctx Canvas-kontekst
 * @param canvas Canvas-element
 * @param logoUrl URL til logoen
 * @param opacity Opasitet for logoen (0-1)
 */
async function drawLogo(
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  logoUrl: string,
  opacity: number = 1
): Promise<void> {
  const logo = new Image();
  const cacheBuster = `?t=${Date.now()}`;
  logo.src = logoUrl.includes('data:') ? logoUrl : `${logoUrl}${cacheBuster}`;
  
  // Vent på at logoen lastes inn
  await new Promise<void>((resolve, reject) => {
    logo.onload = () => resolve();
    logo.onerror = () => reject(new Error('Kunne ikke laste inn logo'));
    setTimeout(() => reject(new Error('Tidsavbrudd ved lasting av logo')), 5000);
  });

  // Beregn logo-størrelse (25% av QR-koden)
  const logoSize = canvas.width * 0.25;
  const logoX = (canvas.width - logoSize) / 2;
  const logoY = (canvas.height - logoSize) / 2;

  // Lagre nåværende canvas-tilstand
  ctx.save();
  
  // Sett global opasitet for logoen
  ctx.globalAlpha = opacity;

  // Tegn hvit bakgrunn bak logoen for bedre synlighet
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
  
  // Tegn logo
  ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
  
  // Gjenopprett canvas-tilstand
  ctx.restore();
}

/**
 * Genererer en QR-kode uten logo
 * @param text Teksten som skal kodes i QR-koden
 * @param options Tilpasningsalternativer for QR-koden
 * @returns Promise med data URL til den genererte QR-koden
 */
export async function generateQRCode(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const qrOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    width: options.width || 400,
    margin: options.margin || 2,
    color: options.color || {
      dark: '#000000',
      light: '#FFFFFF',
    },
  };

  try {
    return await QRCode.toDataURL(text, qrOptions);
  } catch (error) {
    console.error('Feil ved generering av QR-kode:', error);
    throw new Error('Kunne ikke generere QR-kode');
  }
} 