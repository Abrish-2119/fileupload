export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  preview?: string;
  downloadUrl?: string;
  customerId: string;
  customerName?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
}

class FileService {
  private static instance: FileService;
  private files: UploadedFile[] = [];
  private customers: Customer[] = [];
  private currentCustomer: Customer | null = null;

  static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  // Customer management
  setCurrentCustomer(customer: Customer | null) {
    this.currentCustomer = customer;
  }

  getCurrentCustomer(): Customer | null {
    return this.currentCustomer;
  }

  addCustomer(customer: Customer): void {
    this.customers.push(customer);
  }

  getAllCustomers(): Customer[] {
    return [...this.customers];
  }

  // Mock upload - in real app, this would send to server
  async uploadFile(file: File, customerId: string, customerName: string): Promise<UploadedFile> {
    const uploadedFile: UploadedFile = {
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      downloadUrl: URL.createObjectURL(file),
      customerId: customerId,
      customerName: customerName
    };

    this.files.push(uploadedFile);
    
    // Simulate server delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return uploadedFile;
  }

  // Get files for current customer
  async getCustomerFiles(customerId?: string): Promise<UploadedFile[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const targetCustomerId = customerId || this.currentCustomer?.id;
    if (!targetCustomerId) {
      return [];
    }
    
    return this.files.filter(file => file.customerId === targetCustomerId);
  }

  // Get all files (for admin)
  async getAllFiles(): Promise<UploadedFile[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.files];
  }

  // Download file
  async downloadFile(fileId: string): Promise<void> {
    const file = this.files.find(f => f.id === fileId);
    if (!file) {
      throw new Error('File not found');
    }

    // In a real app, this would download from server
    // For demo, we'll create a download link
    if (file.downloadUrl) {
      const link = document.createElement('a');
      link.href = file.downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Delete file
  async deleteFile(fileId: string): Promise<void> {
    const fileIndex = this.files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) {
      throw new Error('File not found');
    }

    const file = this.files[fileIndex];
    
    // Clean up object URLs
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    if (file.downloadUrl) {
      URL.revokeObjectURL(file.downloadUrl);
    }

    this.files.splice(fileIndex, 1);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Get file statistics
  async getStats(customerId?: string) {
    const targetCustomerId = customerId || this.currentCustomer?.id;
    const filesToAnalyze = targetCustomerId 
      ? this.files.filter(file => file.customerId === targetCustomerId)
      : this.files;
    
    const totalFiles = filesToAnalyze.length;
    const totalSize = filesToAnalyze.reduce((sum, file) => sum + file.size, 0);
    const imageCount = filesToAnalyze.filter(f => f.type.startsWith('image/')).length;
    const documentCount = totalFiles - imageCount;

    return {
      totalFiles,
      totalSize,
      imageCount,
      documentCount
    };
  }

  // Get customer statistics (for admin)
  async getCustomerStats() {
    const customerFileCounts = this.files.reduce((acc, file) => {
      acc[file.customerId] = (acc[file.customerId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(customerFileCounts).map(([customerId, fileCount]) => {
      const customer = this.customers.find(c => c.id === customerId);
      return {
        customerId,
        customerName: customer?.name || 'Unknown',
        email: customer?.email || '',
        fileCount
      };
    });
  }
}

export default FileService;
