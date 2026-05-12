# 🔧 Vercel Environment Variables Setup

## ✅ Fixed Configuration

### **vercel.json** - Now Correct
```json
{
  "version": 2,
  "builds": [
    {"src": "server.js", "use": "@vercel/node"},
    {"src": "package.json", "use": "@vercel/static-build", "config": {"distDir": "build"}}
  ],
  "routes": [
    {"src": "/api/(.*)", "dest": "/server.js"},
    {"src": "/(.*)", "dest": "/build/$1"}
  ],
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": "build"
}
```

### **✅ What Was Fixed:**
- ❌ **Removed**: `env` section from vercel.json
- ✅ **Now**: Environment variables set in Vercel dashboard
- ✅ **Result**: No more "Secret does not exist" errors

## 🔧 Set Environment Variables in Vercel

### **Method 1: Vercel Dashboard (Recommended)**
1. **Visit**: https://vercel.com/dashboard
2. **Select**: Your project
3. **Go to**: Settings → Environment Variables
4. **Add Variables**:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/fileupload
   JWT_SECRET = your-generated-secret-key-here
   NODE_ENV = production
   ```

### **Method 2: Vercel CLI**
```bash
# Set MongoDB URI
vercel env add MONGODB_URI

# Set JWT Secret
vercel env add JWT_SECRET

# Set Node Environment
vercel env add NODE_ENV production
```

## 🗄️ MongoDB Atlas Setup

### **Get Your Connection String**
1. **Visit**: https://www.mongodb.com/atlas
2. **Go to**: Clusters → Connect
3. **Choose**: Connect your application
4. **Copy**: Connection string
5. **Replace**: `<username>` and `<password>` with your actual credentials

### **Example Connection String**
```
mongodb+srv://your-username:your-password@cluster.mongodb.net/fileupload
```

## 🔐 Generate JWT Secret

### **Create Secure Secret**
```bash
# Generate random 64-character secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **Example Secret**
```
your-secret-key-here-64-characters-long-random-string
```

## 🚀 Deploy After Setting Variables

### **Step 1: Set Environment Variables**
- Use Vercel dashboard or CLI
- Add all three variables
- Wait for propagation (1-2 minutes)

### **Step 2: Deploy**
```bash
# Deploy to Vercel
vercel --prod
```

### **Step 3: Test Your App**
```
Main App: https://your-app-name.vercel.app/
QR Access: https://your-app-name.vercel.app/qr-login
Customer Login: https://your-app-name.vercel.app/login
Admin Panel: https://your-app-name.vercel.app/admin-login
File Upload: https://your-app-name.vercel.app/upload
```

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Connection string obtained
- [ ] JWT secret generated
- [ ] Environment variables set in Vercel
- [ ] App deployed successfully
- [ ] QR codes work on mobile
- [ ] File upload works (20MB)
- [ ] No "Secret does not exist" errors

## 🚨 Troubleshooting

### **Common Issues**
1. **"Secret does not exist"**: Fixed by removing env from vercel.json
2. **Database connection failed**: Check MongoDB URI format
3. **JWT errors**: Verify JWT_SECRET is set
4. **Build fails**: Check environment variables are correct

### **Debug Steps**
1. **Check Vercel Dashboard**: Settings → Environment Variables
2. **Verify MongoDB URI**: Test connection locally
3. **Check Build Logs**: Vercel dashboard → Builds
4. **Test API Endpoints**: Visit `/api/customers` directly

---

## 🎯 Environment Variables Summary

### **Required Variables:**
```
MONGODB_URI: Your MongoDB Atlas connection string
JWT_SECRET: Your generated JWT secret key
NODE_ENV: Set to "production"
```

### **Where to Set:**
- **Vercel Dashboard**: Project → Settings → Environment Variables
- **Vercel CLI**: `vercel env add VARIABLE_NAME`

---

**Environment variables fixed - ready for Vercel deployment!** 🚀
