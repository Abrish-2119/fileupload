# MongoDB Atlas Setup Instructions

## 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier is sufficient)

## 2. Get Connection String
1. In your cluster, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

## 3. Update Environment Variables
Create a `.env` file in the project root and add:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/filehub?retryWrites=true&w=majority
PORT=5000
```

## 4. Install MongoDB Dependencies (Already Done)
```bash
npm install mongodb mongoose express cors dotenv multer @types/multer
```

## 5. Start the Application

### Option 1: Start Backend and Frontend Separately
```bash
# Terminal 1 - Start Backend Server
npm run server

# Terminal 2 - Start Frontend
npm start
```

### Option 2: Start Both Concurrently
```bash
npm run dev
```

## 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Database Schema

### Customers Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  createdAt: Date
}
```

### Files Collection
```javascript
{
  _id: ObjectId,
  name: String,
  size: Number,
  type: String,
  uploadDate: Date,
  customerId: ObjectId,
  customerName: String,
  filePath: String
}
```

## API Endpoints

### Customer Management
- `POST /api/customers` - Register/login customer

### File Management
- `POST /api/upload` - Upload file
- `GET /api/customers/:customerId/files` - Get customer files
- `GET /api/files` - Get all files (admin)
- `GET /api/files/:id/download` - Download file
- `DELETE /api/files/:id` - Delete file
- `GET /api/stats` - Get statistics

## Features
- ✅ MongoDB Atlas integration
- ✅ File upload with multer
- ✅ Customer-based file management
- ✅ Admin authentication
- ✅ File download and deletion
- ✅ Statistics tracking
- ✅ Search and filter functionality

## Notes
- Files are stored in the `uploads/` directory
- Database connection uses Mongoose ODM
- File metadata is stored in MongoDB
- Admin password: `admin123`
