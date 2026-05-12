# File Upload App Deployment Guide

## Local Development (Single Command)

To run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:3001

## Production Deployment Options

### Option 1: Netlify + Vercel (Recommended for React)

#### **Frontend to Netlify (Static Hosting)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build React app
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=build

# Or drag & drop build folder to:
# https://app.netlify.com/drop
```

#### **Backend to Vercel (Serverless)**
```bash
# Deploy backend to Vercel
npm install -g vercel
cd server
vercel --prod
```

#### **Update API Configuration**:
```typescript
// Update src/services/ApiService.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-name.vercel.app/api'
  : 'http://localhost:5000/api';
```

#### **Your Live URLs**:
```
Frontend: https://your-app-name.netlify.app/
Backend: https://your-backend-name.vercel.app/api
QR Access: https://your-app-name.netlify.app/qr-login
```

### Option 2: Vercel + MongoDB Atlas

1. **Deploy Backend to Vercel**:
```bash
npm install -g vercel
vercel --prod
```

2. **Update API URLs** in `src/services/ApiService.ts`:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.vercel.app/api' 
  : 'http://localhost:5000/api';
```

### Option 3: Traditional VPS/Dedicated Server

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
