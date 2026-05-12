# 🔧 Customer Login Troubleshooting Guide

## 🚨 Problem: Customer Login Fails on Vercel

### **Symptoms:**
- Customer enters name and email
- Clicks login button
- Shows "Login failed. Please try again." error
- No navigation to upload page

### **Root Causes & Solutions**

## 🔍 Step 1: Check Environment Variables

### **Verify MongoDB Connection**
1. **Vercel Dashboard** → Project → Settings → Environment Variables
2. **Check these variables are set:**
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/fileupload
   JWT_SECRET = your-64-character-secret-key
   NODE_ENV = production
   ```

### **Test MongoDB Connection**
```bash
# Test your MongoDB URI locally
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://username:password@cluster.mongodb.net/fileupload')
  .then(() => console.log('✅ MongoDB connection successful'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));
"
```

## 🔍 Step 2: Test API Endpoints

### **Check if Backend is Working**
Visit these URLs in your browser:
```
https://your-app-name.vercel.app/api/customers
https://your-app-name.vercel.app/api/
```

**Expected Response:** 
- If working: Should see JSON response or error message
- If not working: Should see "Function not found" or 404 error

### **Test with curl**
```bash
curl -X POST https://your-app-name.vercel.app/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

## 🔍 Step 3: Check Vercel Functions

### **Verify Serverless Functions Deployed**
1. **Vercel Dashboard** → Project → Functions
2. **Check if `server.js` is listed**
3. **Check function logs for errors**

### **Common Issues:**
- ❌ Server.js not deployed as serverless function
- ❌ MongoDB connection string incorrect
- ❌ Environment variables not set
- ❌ CORS issues

## 🔧 Solutions

### **Solution 1: Fix API Base URL**
<tool_call>edit
<arg_key>file_path</arg_key>
<arg_value>c:\Users\HP\Desktop\fileuplode\file-upload-app\src\services\ApiService.ts
