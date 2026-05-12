# 🔐 Credentials & Authentication Guide

## Overview
Your File Upload System uses different authentication methods for customers and admin access. Here's how to get and use credentials.

## 👤 Customer Access (No Credentials Required)

### **Method 1: Direct Access**
```
1. Visit: http://localhost:3001/login
2. Enter any name and email
3. Click "Start Uploading"
4. Instant access granted!
```

### **Method 2: QR Code Access**
```
1. Visit: http://localhost:3001/qr-login
2. Scan QR code with phone camera
3. Click the link that appears
4. Start uploading immediately!
```

### **Method 3: Customer QR Login**
```
1. Visit: http://localhost:3001/customer-qr
2. Choose QR code option
3. Scan or simulate scan
4. Access granted!
```

**Customer Access Features:**
- ✅ No registration required
- ✅ No password needed
- ✅ Email/name only for identification
- ✅ Files stored per customer
- ✅ Can download own files

## 👑 Admin Access (Credentials Required)

### **Default Admin Credentials**
```
Username: admin
Password: admin123
```

### **How to Access Admin Panel**
```
1. Visit: http://localhost:3001/admin-login
2. Enter admin credentials
3. Click "Login to Admin Dashboard"
4. Access all customer files!
```

### **Admin Features**
- 👑 View all customer uploads
- 📊 Download any files
- 🗂️ Delete files
- 📈 View statistics
- 🔍 Search by customer
- 📱 Mobile responsive

## 🔧 Environment Variables

### **Current Configuration**
Check your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/filehub
PORT=5000
```

### **For Production Deployment**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fileupload
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

## 🌐 Production Credentials

### **MongoDB Atlas Setup**
1. **Create Account**: https://www.mongodb.com/atlas
2. **Create Cluster**: Free tier (M0)
3. **Get Connection String**: 
   ```
   mongodb+srv://username:password@cluster.mongodb.net/fileupload
   ```
4. **Update .env**: Replace MONGODB_URI

### **JWT Secret**
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🔒 Security Best Practices

### **Customer Security**
- Files stored by customer ID
- No access to other customer files
- Session-based identification
- File type validation

### **Admin Security**
- Change default admin password
- Use strong passwords
- Enable HTTPS in production
- Regular password updates

### **File Security**
- Size limits (20MB max)
- Type validation (images, PDFs, docs)
- Virus scanning (recommended)
- Secure file storage

## 🚀 Deployment Credentials

### **Heroku Environment Variables**
```bash
heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/fileupload"
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set NODE_ENV="production"
```

### **Vercel Environment Variables**
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV
```

## 📱 Mobile Access Credentials

### **QR Code Authentication**
```
📱 Scan QR Code → Direct Access
🔐 No Password Required
👤 Customer ID Generated Automatically
📁 Files Organized by Customer
```

### **Mobile Browser Access**
```
1. Open mobile browser
2. Go to your app URL
3. Enter name & email
4. Start uploading immediately
```

## 🔍 Testing Credentials

### **Test Customer Access**
```bash
# Test 1: Direct Login
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Test 2: File Upload
curl -X POST http://localhost:5000/api/upload \
  -F "file=@test.txt" \
  -F "customerId=test-id" \
  -F "customerName=Test User"
```

### **Test Admin Access**
```bash
# Test Admin Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🛠️ Development Credentials

### **Local Development**
```env
MONGODB_URI=mongodb://localhost:27017/filehub
PORT=5000
NODE_ENV=development
```

### **Database Credentials**
- **Local**: MongoDB running on localhost:27017
- **Cloud**: MongoDB Atlas with authentication
- **Database Name**: filehub (or your choice)

## 🔐 Custom Authentication

### **Add Customer Registration**
```javascript
// In CustomerLogin.tsx
const handleRegister = async (name, email) => {
  const customer = await ApiService.getInstance().registerCustomer(name, email);
  localStorage.setItem('currentCustomer', JSON.stringify(customer));
  navigate('/upload');
};
```

### **Add Admin User Management**
```javascript
// In AdminLogin.tsx
const handleLogin = async (username, password) => {
  const admin = await ApiService.getInstance().adminLogin(username, password);
  localStorage.setItem('adminToken', admin.token);
  navigate('/admin');
};
```

## 📊 Access Levels

### **Customer Access**
```
✅ Upload files (20MB max)
✅ View own files
✅ Download own files
✅ Delete own files
❌ View other customer files
❌ Access admin panel
❌ Modify system settings
```

### **Admin Access**
```
✅ View all customer files
✅ Download any files
✅ Delete any files
✅ View statistics
✅ Manage customers
✅ System configuration
❌ Modify file content
❌ Access customer passwords
```

## 🚨 Troubleshooting Credentials

### **Common Issues**
1. **"Invalid Credentials"**: Check admin password
2. **"Database Connection Failed": Verify MONGODB_URI
3. **"Cannot Upload": Check file size (20MB limit)
4. **"Access Denied": Verify user permissions

### **Reset Admin Password**
```javascript
// In server.js, temporarily add:
console.log('Current admin users:', [
  { username: 'admin', password: 'admin123' }
]);
```

### **Clear Browser Data**
```bash
# Clear localStorage
localStorage.clear();

# Clear cookies
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
```

---

## 🎯 Quick Start

### **For Testing:**
1. **Customer**: Any name + email works
2. **Admin**: Use `admin` / `admin123`
3. **QR Code**: Scan with phone camera
4. **Mobile**: Works on all devices

### **For Production:**
1. **Setup MongoDB Atlas**
2. **Generate JWT secret**
3. **Update environment variables**
4. **Deploy to hosting platform**

**Your file upload system is ready with flexible authentication!** 🔐
