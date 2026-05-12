const mongoose = require('mongoose');
require('dotenv').config();

// Define schemas
const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const FileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', CustomerSchema);
const File = mongoose.model('File', FileSchema);

async function cleanupDatabase() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/filehub');
    console.log('Connected to database');

    // Get all files from database
    const allFiles = await File.find({});
    console.log(`Found ${allFiles.length} files in database`);

    const fs = require('fs');
    let deletedCount = 0;

    // Check each file and delete if it doesn't exist on disk
    for (const file of allFiles) {
      if (!fs.existsSync(file.filePath)) {
        console.log(`Removing orphaned file record: ${file.name} (${file.filePath})`);
        await File.findByIdAndDelete(file._id);
        deletedCount++;
      } else {
        console.log(`File exists: ${file.name} (${file.filePath})`);
      }
    }

    console.log(`Cleanup completed. Removed ${deletedCount} orphaned file records.`);
    
    // Show remaining files
    const remainingFiles = await File.find({});
    console.log(`Remaining files in database: ${remainingFiles.length}`);
    
    await mongoose.disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Cleanup error:', error);
    process.exit(1);
  }
}

cleanupDatabase();
