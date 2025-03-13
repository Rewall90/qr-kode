/**
 * Tilgjengelige formater for QR-kode nedlasting
 */
export type QRCodeFormat = 'png' | 'svg';

/**
 * Tilgjengelige størrelser for QR-kode nedlasting
 */
export const QR_CODE_SIZES = [400, 800, 1200, 2000];

// Cache for resized images
const resizeCache = new Map<string, string>();

/**
 * Resizer et bilde til en spesifisert størrelse
 * @param imageUrl Bilde-URL som skal resizes
 * @param size Målstørrelse i piksler
 * @returns Promise med data URL til det resizede bildet
 */
async function resizeImage(imageUrl: string, size: number): Promise<string> {
  // Generer en cache-nøkkel basert på URL og størrelse
  const cacheKey = `${imageUrl}_${size}`;
  
  // Sjekk om bildet allerede er i cachen
  if (resizeCache.has(cacheKey)) {
    return resizeCache.get(cacheKey)!;
  }
  
  return new Promise<string>((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = canvas.height = size;
    
    img.onload = () => {
      if (ctx) {
        // Bruk høykvalitets skalering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, size, size);
        
        // Bruk optimal kvalitet for størrelsen
        const quality = size > 1000 ? 0.85 : 0.92;
        const resizedUrl = canvas.toDataURL('image/png', quality);
        
        // Lagre i cache
        resizeCache.set(cacheKey, resizedUrl);
        
        // Begrens cache-størrelsen
        if (resizeCache.size > 10) {
          const firstKey = resizeCache.keys().next().value;
          if (firstKey) {
            resizeCache.delete(firstKey);
          }
        }
        
        resolve(resizedUrl);
      } else {
        reject(new Error('Kunne ikke opprette canvas-kontekst'));
      }
    };
    
    img.onerror = () => reject(new Error('Kunne ikke laste inn bildet'));
    
    img.src = imageUrl;
  });
}

/**
 * Last ned QR-kode med valgfritt format og størrelse
 * @param qrCode Data URL for QR-koden
 * @param format Filformat for nedlasting (png eller svg)
 * @param size Størrelse på QR-koden i piksler
 */
export async function downloadQRCode(
  qrCode: string, 
  format: QRCodeFormat = 'png', 
  size?: number
) {
  try {
    if (format === 'png') {
      // Hvis størrelse er spesifisert og forskjellig fra original, endre størrelse
      if (size && size !== 400) {
        const resizedQrCode = await resizeImage(qrCode, size);
        
        const link = document.createElement('a');
        link.href = resizedQrCode;
        link.download = `qrkode_${size}x${size}.png`;
        link.click();
        
        // Frigjør minne
        setTimeout(() => {
          link.remove();
        }, 100);
      } else {
        // Original nedlastingskode
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = 'qrkode.png';
        link.click();
        
        // Frigjør minne
        setTimeout(() => {
          link.remove();
        }, 100);
      }
    } else if (format === 'svg') {
      // Konverter PNG data URL til SVG
      // Dette er en forenklet implementasjon - for en fullstendig løsning
      // bør man bruke en dedikert bibliotek for PNG til SVG konvertering
      // eller generere SVG direkte fra QR-kode biblioteket
      
      // For demonstrasjonsformål, vi lager en enkel SVG
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size || 400}" height="${size || 400}" viewBox="0 0 ${size || 400} ${size || 400}">
          <image href="${qrCode}" width="${size || 400}" height="${size || 400}" />
        </svg>
      `;
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrkode.svg';
      link.click();
      
      // Frigjør URL-objektet og minne
      setTimeout(() => {
        URL.revokeObjectURL(url);
        link.remove();
      }, 100);
    }
  } catch (error) {
    console.error('Feil ved nedlasting av QR-kode:', error);
    alert('Det oppstod en feil ved nedlasting av QR-koden. Vennligst prøv igjen.');
  }
}