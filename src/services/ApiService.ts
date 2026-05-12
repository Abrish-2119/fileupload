const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Will use same domain in production
  : 'http://localhost:5000/api';

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

class ApiService {
  private static instance: ApiService;
  private currentCustomer: Customer | null = null;

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Customer management
  setCurrentCustomer(customer: Customer | null) {
    this.currentCustomer = customer;
  }

  getCurrentCustomer(): Customer | null {
    return this.currentCustomer;
  }

  // Customer registration/login
  async registerCustomer(name: string, email: string): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      throw new Error('Failed to register customer');
    }

    return response.json();
  }

  // File upload
  async uploadFile(file: File, customerId: string, customerName: string): Promise<UploadedFile> {
    console.log('=== ApiService.uploadFile Started ===');
    console.log('Input parameters:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      customerId,
      customerName,
      isFile: file instanceof File
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('customerId', customerId);
    formData.append('customerName', customerName);

    // Log FormData contents (can't directly log FormData, but we can check size)
    console.log('FormData created, checking entries...');
    console.log('File object details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      constructor: file.constructor.name,
      isFile: file instanceof File
    });
    
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`FormData entry: ${key} = File(${value.name}, ${value.size}, ${value.type})`);
      } else {
        console.log(`FormData entry: ${key} = ${value}`);
      }
    });

    console.log('Sending request to:', `${API_BASE_URL}/upload`);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it automatically for FormData
    });

    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed with status:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    const uploadedFile = await response.json();
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      uploadedFile.preview = URL.createObjectURL(file);
    }

    return uploadedFile;
  }

  // Get files for current customer
  async getCustomerFiles(customerId?: string): Promise<UploadedFile[]> {
    const targetCustomerId = customerId || this.currentCustomer?.id;
    if (!targetCustomerId) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/customers/${targetCustomerId}/files`);
    if (!response.ok) {
      throw new Error('Failed to fetch customer files');
    }

    return response.json();
  }

  // Get all files (for admin)
  async getAllFiles(): Promise<UploadedFile[]> {
    const response = await fetch(`${API_BASE_URL}/files`);
    if (!response.ok) {
      throw new Error('Failed to fetch all files');
    }

    return response.json();
  }

  // Download file
  async downloadFile(fileId: string): Promise<void> {
    try {
      console.log(`Starting download for file ID: ${fileId}`);
      
      const response = await fetch(`${API_BASE_URL}/files/${fileId}/download`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download failed with status:', response.status, errorText);
        throw new Error(`Failed to download file: ${response.status} ${errorText}`);
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'downloaded-file';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      console.log('Response headers:', {
        'Content-Type': response.headers.get('Content-Type'),
        'Content-Length': response.headers.get('Content-Length'),
        'Content-Disposition': contentDisposition
      });

      const blob = await response.blob();
      console.log(`Blob created, size: ${blob.size} bytes`);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`File downloaded successfully: ${filename}`);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  // Delete file
  async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  }

  // Get file statistics
  async getStats(customerId?: string) {
    const targetCustomerId = customerId || this.currentCustomer?.id;
    const url = targetCustomerId 
      ? `${API_BASE_URL}/stats?customerId=${targetCustomerId}`
      : `${API_BASE_URL}/stats`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }

    return response.json();
  }
}

export default ApiService;
