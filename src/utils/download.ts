export function downloadQRCode(qrCode: string) {
  const link = document.createElement('a');
  link.href = qrCode;
  link.download = 'qrcode.png';
  link.click();
}