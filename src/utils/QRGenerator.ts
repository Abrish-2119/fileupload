export interface QRCodeOptions {
  size?: number;
  level?: string;
  bgColor?: string;
  fgColor?: string;
}

export class QRGenerator {
  static generateCustomerURL(customerId: string, baseUrl: string): string {
    return `${baseUrl}/login?customer=${customerId}`;
  }

  static generateDirectUploadURL(baseUrl: string): string {
    return `${baseUrl}/upload`;
  }

  static generateCurrentPageURL(): string {
    return window.location.origin;
  }

  static getQRCodeOptions(customOptions: QRCodeOptions = {}): QRCodeOptions {
    const defaultOptions: QRCodeOptions = {
      size: 256,
      level: 'H',
      bgColor: '#ffffff',
      fgColor: '#000000'
    };

    return { ...defaultOptions, ...customOptions };
  }

  static downloadQRCode(elementId: string, filename: string = 'qr-code.png'): void {
    const element = document.getElementById(elementId);
    if (element) {
      const svgData = new XMLSerializer().serializeToString(element);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = filename;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  }
}
