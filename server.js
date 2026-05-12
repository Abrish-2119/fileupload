const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/filehub')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Server will continue running without database connection...');
});

// Define schemas
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const uploadedFileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  filePath: { type: String, required: true }
});

const Customer = mongoose.model('Customer', customerSchema);
const UploadedFile = mongoose.model('UploadedFile', uploadedFileSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.originalname || 'file';
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// API Routes

// Customer Registration/Login
app.post('/api/customers', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if customer already exists
    let customer = await Customer.findOne({ email });
    if (!customer) {
      customer = new Customer({ name, email });
      await customer.save();
    }
    
    // Return customer with id field for frontend compatibility
    const customerResponse = {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      createdAt: customer.createdAt
    };
    
    res.json(customerResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UploadedFile Upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('=== Upload Request Started ===');
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    
    const { customerId, customerName } = req.body;
    
    if (!customerId || !customerName) {
      console.log('Missing customer data:', { customerId, customerName });
      return res.status(400).json({ error: 'Customer ID and name are required' });
    }

    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('UploadedFile details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    // Enhanced MIME type detection and validation
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      console.log('UploadedFile type not allowed:', req.file.mimetype);
      // Clean up uploaded file if type is not allowed
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'UploadedFile type not supported' });
    }

    const fileName = req.file.originalname || `file-${Date.now()}`;
    console.log('Processing file:', fileName, 'MIME type:', req.file.mimetype);
    
    const uploadedFile = new UploadedFile({
      name: fileName,
      size: req.file.size,
      type: req.file.mimetype,
      customerId: customerId,
      customerName: customerName,
      filePath: req.file.path
    });

    await uploadedFile.save();
    
    // Return file with id field for frontend compatibility
    const fileResponse = {
      id: uploadedFile._id,
      name: uploadedFile.name,
      size: uploadedFile.size,
      type: uploadedFile.type,
      uploadDate: uploadedFile.uploadDate,
      customerId: uploadedFile.customerId,
      customerName: uploadedFile.customerName,
      filePath: uploadedFile.filePath
    };
    
    console.log(`UploadedFile uploaded successfully: ${uploadedFile.name} (${uploadedFile.size} bytes) by ${customerName}`);
    console.log('=== Upload Request Completed ===');
    res.json(fileResponse);
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Get Customer UploadedFiles
app.get('/api/customers/:customerId/files', async (req, res) => {
  try {
    const { customerId } = req.params;
    const files = await UploadedFile.find({ customerId }).sort({ uploadDate: -1 });
    
    const filesResponse = files.map(file => ({
      id: file._id,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: file.uploadDate,
      customerId: file.customerId,
      customerName: file.customerName,
      filePath: file.filePath
    }));
    
    res.json(filesResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All UploadedFiles (Admin)
app.get('/api/files', async (req, res) => {
  try {
    const files = await UploadedFile.find({}).populate('customerId', 'name email').sort({ uploadDate: -1 });
    
    // Transform files to use id field for frontend compatibility
    const filesResponse = files.map(file => ({
      id: file._id,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: file.uploadDate,
      customerId: file.customerId,
      customerName: file.customerName,
      filePath: file.filePath
    }));
    
    res.json(filesResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download UploadedFile
app.get('/api/files/:id/download', async (req, res) => {
  try {
    console.log(`Download request for file ID: ${req.params.id}`);
    
    const file = await UploadedFile.findById(req.params.id);
    if (!file) {
      console.log('UploadedFile not found in database');
      return res.status(404).json({ error: 'UploadedFile not found' });
    }

    console.log(`UploadedFile found: ${file.name}, path: ${file.filePath}`);

    // Check if file exists on disk
    if (!fs.existsSync(file.filePath)) {
      console.log('UploadedFile not found on disk:', file.filePath);
      return res.status(404).json({ error: 'UploadedFile not found on disk' });
    }

    // Get file stats to verify size
    const stats = fs.statSync(file.filePath);
    console.log(`UploadedFile size on disk: ${stats.size}, database size: ${file.size}`);

    // Set proper headers for file download
    res.setHeader('Content-Type', file.type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Length', stats.size);

    // Stream the file to the client
    const fileStream = fs.createReadStream(file.filePath);
    
    fileStream.on('error', (error) => {
      console.error('UploadedFile stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error reading file' });
      }
    });

    fileStream.on('end', () => {
      console.log(`UploadedFile download completed: ${file.name}`);
    });

    res.on('finish', () => {
      console.log(`Response sent for: ${file.name}`);
    });

    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete UploadedFile
app.delete('/api/files/:id', async (req, res) => {
  try {
    const file = await UploadedFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'UploadedFile not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    await UploadedFile.findByIdAndDelete(req.params.id);
    res.json({ message: 'UploadedFile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Statistics
app.get('/api/stats', async (req, res) => {
  try {
    const { customerId } = req.query;
    
    let matchQuery = {};
    if (customerId) {
      matchQuery = { customerId };
    }

    const files = await UploadedFile.find(matchQuery);
    
    const totalUploadedFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const imageCount = files.filter(f => f.type.startsWith('image/')).length;
    const documentCount = totalUploadedFiles - imageCount;

    res.json({
      totalUploadedFiles,
      totalSize,
      imageCount,
      documentCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('='.repeat(50));
  console.log('🔐 ADMIN CREDENTIALS:');
  console.log('Username: admin');
  console.log('Password: admin123');
  console.log('Admin Login: http://localhost:3001/admin-login');
  console.log('Customer Login: http://localhost:3001/login');
  console.log('QR Code Access: http://localhost:3001/qr-login');
  console.log('='.repeat(50));
  console.log('📱 File Upload System Ready!');
});
