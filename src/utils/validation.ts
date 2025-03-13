import { QRType } from '../types/qr';

/**
 * Validerer QR-kode innhold basert på type
 * @param content Innholdet som skal valideres
 * @param type QR-kode typen
 * @returns Valideringsresultat med status og feilmelding
 */
export function validateQRContent(content: string, type: QRType): { isValid: boolean; message?: string } {
  if (!content.trim()) {
    return { isValid: false, message: 'Innholdet kan ikke være tomt' };
  }

  switch (type.label) {
    case 'NETTSIDE':
      // Enkel URL-validering
      try {
        // Legg til https:// hvis det mangler en protokoll
        const urlToTest = content.match(/^https?:\/\//) ? content : `https://${content}`;
        new URL(urlToTest);
        return { isValid: true };
      } catch (e) {
        return { isValid: false, message: 'Ugyldig nettadresse format' };
      }

    case 'E-POST':
      // E-post validering
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return { 
        isValid: emailRegex.test(content),
        message: emailRegex.test(content) ? undefined : 'Ugyldig e-postformat'
      };

    case 'TELEFON':
      // Telefonnummer validering (enkel)
      const phoneRegex = /^[+]?[\d\s()-]{8,20}$/;
      return { 
        isValid: phoneRegex.test(content),
        message: phoneRegex.test(content) ? undefined : 'Ugyldig telefonnummer format'
      };

    case 'WIFI':
      // Enkel validering for WiFi (sjekker bare at det ikke er tomt)
      return { isValid: content.length > 0 };

    case 'GEOLOKASJON':
      // Validering for koordinater (enkel)
      const coordRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
      // Hvis det er koordinater, valider dem, ellers anta at det er en adresse
      if (content.match(/^[-+]?[\d.,\s]+$/)) {
        return { 
          isValid: coordRegex.test(content),
          message: coordRegex.test(content) ? undefined : 'Ugyldig koordinatformat (bruk lat,lng)'
        };
      }
      return { isValid: content.length > 3 };

    case 'INSTAGRAM':
    case 'TIKTOK':
    case 'FACEBOOK':
    case 'TWITTER':
      // Validering for sosiale medier brukernavn
      const usernameRegex = /^@?[\w.]{2,30}$/;
      return { 
        isValid: usernameRegex.test(content),
        message: usernameRegex.test(content) ? undefined : 'Ugyldig brukernavn format'
      };

    case 'YOUTUBE':
      // YouTube URL validering (enkel)
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      return { 
        isValid: youtubeRegex.test(content),
        message: youtubeRegex.test(content) ? undefined : 'Ugyldig YouTube URL'
      };

    case 'WHATSAPP':
      // WhatsApp nummer validering (enkel)
      const whatsappRegex = /^[+]?[\d\s()-]{8,20}$/;
      return { 
        isValid: whatsappRegex.test(content),
        message: whatsappRegex.test(content) ? undefined : 'Ugyldig telefonnummer format'
      };

    default:
      // For andre typer, anta at det er gyldig
      return { isValid: true };
  }
} 