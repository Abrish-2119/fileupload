import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import ApiService, { Customer } from '../services/ApiService';
import './FileUpload.css';
import './FileIcons.css';

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

interface UploadProgress {
  [key: string]: number;
}

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const customer = ApiService.getInstance().getCurrentCustomer();
    if (!customer) {
      navigate('/login');
      return;
    }
    setCurrentCustomer(customer);
    loadCustomerFiles();
  }, [navigate]);

  const loadCustomerFiles = async () => {
    try {
      console.log('Loading customer files...');
      const customerFiles = await ApiService.getInstance().getCustomerFiles();
      console.log('Loaded customer files:', customerFiles);
      setUploadedFiles(customerFiles);
    } catch (error) {
      console.error('Failed to load customer files:', error);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    
    const filesWithPreview = acceptedFiles.map(file => {
      console.log('Processing file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        constructor: file.constructor.name,
        isFile: file instanceof File
      });
      
      // Create a new File object that extends the original with additional properties
      const fileObj = new File([file], file.name, {
        type: file.type || 'application/octet-stream',
        lastModified: file.lastModified
      }) as FileWithPreview;
      
      // Add custom properties
      fileObj.preview = file.type && file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
      fileObj.id = Math.random().toString(36).substring(7);
      
      console.log('Created file object:', fileObj);
      return fileObj;
    });
    
    console.log('Files with preview:', filesWithPreview);
    setFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  const testSimpleUpload = async () => {
    console.log('=== Testing Simple Upload ===');
    
    if (!currentCustomer) {
      console.error('No customer logged in');
      alert('Please log in again');
      navigate('/login');
      return;
    }
    
    // Create a simple test file
    const testContent = 'This is a test file for simple upload testing.\nCreated at: ' + new Date().toISOString();
    const testFile = new File([testContent], 'simple-test.txt', { type: 'text/plain' });
    
    console.log('Created test file:', {
      name: testFile.name,
      type: testFile.type,
      size: testFile.size,
      isFile: testFile instanceof File
    });
    
    try {
      setIsUploading(true);
      const uploadedFile = await ApiService.getInstance().uploadFile(testFile, currentCustomer.id, currentCustomer.name);
      console.log('Simple upload successful:', uploadedFile);
      alert('Simple upload successful!');
      await loadCustomerFiles();
    } catch (error) {
      console.error('Simple upload failed:', error);
      alert('Simple upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFiles = async () => {
    console.log('=== Upload Process Started ===');
    console.log('Files to upload:', files.length, files);
    
    if (files.length === 0) {
      console.log('No files to upload');
      return;
    }
    
    setIsUploading(true);
    
    for (const fileObj of files) {
      try {
        console.log('Customer data:', currentCustomer);
        
        // Check if customer exists
        if (!currentCustomer) {
          console.error('No customer logged in');
          alert('Please log in again');
          navigate('/login');
          return;
        }
        
        // Validate file object
        console.log('File object validation:', {
          hasName: !!fileObj.name,
          hasType: !!fileObj.type,
          hasSize: !!fileObj.size,
          isFile: fileObj instanceof File,
          fileKeys: Object.keys(fileObj)
        });
        
        // Use the original file object directly (it's already a File object)
        console.log('Uploading file:', {
          name: fileObj.name,
          type: fileObj.type,
          size: fileObj.size,
          lastModified: fileObj.lastModified,
          customerId: currentCustomer.id,
          customerName: currentCustomer.name
        });
        
        // Extract the original File object from our extended object
        const originalFile = fileObj as File;
        console.log('Extracted original File object:', {
          name: originalFile.name,
          type: originalFile.type,
          size: originalFile.size,
          isFile: originalFile instanceof File
        });
        
        // Actually upload file to our service
        console.log('Calling ApiService.uploadFile...');
        const uploadedFile = await ApiService.getInstance().uploadFile(originalFile, currentCustomer.id, currentCustomer.name);
        console.log('File uploaded successfully:', uploadedFile);
        
        // Simulate upload progress for UI
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({ ...prev, [fileObj.id]: progress }));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
      } catch (error) {
        console.error('Upload failed for file:', fileObj.name, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`Failed to upload ${fileObj.name || 'unknown file'}: ${errorMessage}`);
      }
    }
    
    setIsUploading(false);
    // Clear uploaded files
    setFiles([]);
    setUploadProgress({});
    // Refresh customer files
    await loadCustomerFiles();
    alert('Files uploaded successfully!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: any) => {
    console.log('getFileIcon called with:', file);
    
    // Check if file exists and has properties
    if (!file || !file.name) {
      console.log('File or file.name is undefined:', { file, hasFile: !!file, hasName: !!file?.name });
      return (
        <div className="file-icon default-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    }
    
    if (file.type && file.type.startsWith('image/')) {
      return (
        <div className="file-icon image-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return (
          <div className="file-icon pdf-icon">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
        );
      case 'doc':
      case 'docx':
        return (
          <div className="file-icon doc-icon">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M7,17H17V19H7V17M7,13H17V15H7V13M7,9H11V11H7V9Z"/>
            </svg>
          </div>
        );
      case 'xls':
      case 'xlsx':
        return (
          <div className="file-icon excel-icon">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19H7V17H10V19M10,16H7V14H10V16M10,13H7V11H10V13M14,19H11V17H14V19M14,16H11V14H14V16M14,13H11V11H14V13M17,19H15V17H17V19M17,16H15V14H17V16M17,13H15V11H17V13Z"/>
            </svg>
          </div>
        );
      case 'txt':
        return (
          <div className="file-icon text-icon">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,12H16V14H8V12M8,16H13V18H8V16Z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="file-icon default-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-header">
        <div>
          <h2>File Upload Center</h2>
          <p>Upload your files and images securely</p>
          {currentCustomer && (
            <div className="customer-info">
              <span className="customer-badge">
                👤 {currentCustomer.name}
              </span>
              <span className="customer-email">{currentCustomer.email}</span>
            </div>
          )}
        </div>
        <div className="header-actions">
          <button 
            className="logout-btn"
            onClick={() => {
              ApiService.getInstance().setCurrentCustomer(null);
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="dropzone-text">
            {isDragActive
              ? 'Drop files here...'
              : 'Drag & drop files here, or click to select files'
            }
          </p>
          <p className="dropzone-hint">
            Supported formats: Images, PDF, Word, Excel (Max 10MB)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <h3>Files to Upload ({files.length})</h3>
            <button
              className="upload-btn"
              onClick={uploadFiles}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload All Files'}
            </button>
            <button
              className="upload-btn"
              onClick={testSimpleUpload}
              disabled={isUploading}
              style={{ marginLeft: '10px', backgroundColor: '#28a745' }}
            >
              Test Simple Upload
            </button>
          </div>
          
          <div className="file-items">
            {files.map(file => (
              <div key={file.id} className="file-item">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="file-preview"
                  />
                ) : (
                  getFileIcon(file)
                )}
                
                <div className="file-info">
                  <p className="file-name" title={file.name}>{file.name}</p>
                  <p className="file-meta">
                    {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                  </p>
                </div>
                
                <button
                  className="remove-btn"
                  onClick={() => removeFile(file.id)}
                  disabled={isUploading}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {Object.keys(uploadProgress).length > 0 && (
            <div className="progress-container">
              {files.map(file => (
                uploadProgress[file.id] !== undefined && (
                  <div key={file.id} className="progress-item">
                    <span className="progress-filename">{file.name}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${uploadProgress[file.id]}%` }}
                      />
                    </div>
                    <span className="progress-text">{uploadProgress[file.id]}%</span>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <div className="files-header">
            <h3>Your Uploaded Files ({uploadedFiles.length})</h3>
            <div className="files-stats">
              <span className="stat-badge">
                📁 {uploadedFiles.length} files
              </span>
              <span className="stat-badge">
                💾 {formatFileSize(uploadedFiles.reduce((total, file) => total + file.size, 0))}
              </span>
            </div>
          </div>
          <div className="files-grid">
            {uploadedFiles.map((file, index) => {
              console.log(`Processing uploaded file ${index}:`, file);
              return (
              <div key={file.id || index} className="uploaded-file-card">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="uploaded-file-preview"
                  />
                ) : (
                  <div className="uploaded-file-icon">
                    {getFileIcon(file)}
                  </div>
                )}
                <div className="uploaded-file-info">
                  <h4 title={file.name}>{file.name}</h4>
                  <p className="file-meta">
                    {formatFileSize(file.size)} • {file.type || 'Unknown type'} • {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                  <div className="file-actions">
                    <button 
                      className="download-btn"
                      onClick={() => ApiService.getInstance().downloadFile(file.id)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
