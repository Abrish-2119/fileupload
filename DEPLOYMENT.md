# File Upload App Deployment Guide

## Local Development (Single Command)

To run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:3001

## Production Deployment

### **Recommended: Vercel (Full Stack)**

Vercel is perfect for your File Upload System:
- ✅ **Full Stack**: Frontend + Backend together
- ✅ **Serverless**: No server management
- ✅ **Global CDN**: Fast worldwide loading
- ✅ **QR Code Friendly**: Perfect for mobile access
- ✅ **20MB Upload**: Optimized for file handling
- ✅ **Free SSL**: Automatic HTTPS

### **Quick Deploy**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy your app
vercel --prod
```

### **Your Live URLs**
```
Main App: https://your-app-name.vercel.app/
QR Access: https://your-app-name.vercel.app/qr-login
Customer Login: https://your-app-name.vercel.app/login
Admin Panel: https://your-app-name.vercel.app/admin-login
File Upload: https://your-app-name.vercel.app/upload
```

### **Environment Variables**
```bash
# Set MongoDB URI
vercel env add MONGODB_URI

# Set JWT Secret
vercel env add JWT_SECRET

# Set Production Mode
vercel env add NODE_ENV production
```

### **Alternative: Traditional VPS/Dedicated Server**

1. **Build the app**:
```bash
npm run build
```

2. **Install PM2** for process management:
```bash
npm install -g pm2
```

3. **Start with PM2**:
```bash
pm2 start server.js --name "file-upload-app"
```

4. **Setup Nginx** (optional) for reverse proxy.

## Environment Variables

Create `.env` file in production:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fileupload
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

## Security Considerations

1. **File Upload Limits**: Already set to 10MB
2. **File Type Validation**: Only allows specific file types
3. **CORS**: Configured for your domain
4. **MongoDB**: Use MongoDB Atlas with authentication
5. **HTTPS**: Always use HTTPS in production

## Domain Configuration

After deployment, update the CORS origin in `server.js`:

```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

## Monitoring

For production monitoring:
- Use Heroku's built-in monitoring
- Add error tracking (Sentry)
- Set up uptime monitoring

## Scaling

For high traffic:
- Use CDN for file uploads (AWS S3)
- Implement file compression
- Add rate limiting
- Use load balancers
