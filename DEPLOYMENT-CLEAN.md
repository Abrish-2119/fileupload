# 🚀 Deployment Guide

## 📋 Prerequisites

### **Required Accounts**
1. **Vercel Account**: https://vercel.com/signup
2. **MongoDB Atlas**: https://www.mongodb.com/atlas

### **Required Tools**
```bash
# Install Vercel CLI
npm install -g vercel
```

## 🔧 Step 1: Setup MongoDB Atlas

### **Create Database**
1. **Visit**: https://www.mongodb.com/atlas
2. **Sign Up**: Free account
3. **Create Project**: "file-upload-app"
4. **Create Cluster**: M0 Sandbox (free)
5. **Database User**: Create username/password
6. **Network Access**: Allow from anywhere (0.0.0.0/0)
7. **Connection String**: Get your MongoDB URI

## 🔧 Step 2: Deploy to Vercel

### **Deploy Full Stack**
```bash
# Navigate to project
cd c:\Users\HP\Desktop\fileuplode\file-upload-app

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### **Vercel Configuration**
Your `vercel.json` is already configured for deployment:
- Backend: `server.js` → Node.js serverless
- Routes: `/api/*` → server.js
- Environment: MongoDB URI + JWT secret

## 🌐 Your Live URLs

### **After Deployment**
```
Main App: https://your-app-name.vercel.app/
QR Access: https://your-app-name.vercel.app/qr-login
Customer Login: https://your-app-name.vercel.app/login
Admin Panel: https://your-app-name.vercel.app/admin-login
File Upload: https://your-app-name.vercel.app/upload
```

## ✅ Features

- ✅ **Free SSL Certificate** (automatic HTTPS)
- ✅ **Global CDN** (fast loading)
- ✅ **QR Code Scanning** (works on mobile)
- ✅ **Mobile Responsive** (all devices)
- ✅ **20MB File Upload** (as configured)
- ✅ **Automatic Deployments** (Git integration)

## 🎯 Success Checklist

- [ ] Vercel account created
- [ ] MongoDB Atlas cluster created
- [ ] Deployed to Vercel
- [ ] QR codes work on mobile
- [ ] File upload works (20MB)
- [ ] Admin panel accessible

---

## 🚀 Quick Deploy Commands

```bash
# 1. Install CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Done! Your app is live!
```

---

**Your File Upload System is ready for Vercel deployment!** 🚀
