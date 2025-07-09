# 🚀 KulturaView Deployment Guide

## Free Hosting Options

### 1. 🟢 **Heroku (Recommended for Full-Stack)**

#### Setup:
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-kulturaview-app

# Add MySQL addon (Free tier: JawsDB)
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_super_secure_jwt_secret_here

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Database Setup:
```bash
# Get database URL
heroku config:get JAWSDB_URL

# The URL format: mysql://username:password@hostname:port/database_name
# App will automatically use JAWSDB_URL if available
```

### 2. 🔵 **Railway (Great Alternative)**

#### Setup:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Environment Variables:
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_jwt_secret
railway variables set DB_HOST=your_db_host
railway variables set DB_USER=your_db_user
railway variables set DB_PASSWORD=your_db_password
railway variables set DB_NAME=kulturaview
```

### 3. 🟡 **Render (Good for Backend)**

#### Setup:
1. Connect GitHub repository
2. Choose "Web Service"
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables in dashboard

### 4. 🟠 **Netlify + Heroku (Split Deployment)**

#### Frontend (Netlify):
```bash
# Build settings
Build command: npm run build
Publish directory: client/build
```

#### Backend (Heroku):
Deploy only the server folder to Heroku

### 5. 🔴 **Vercel (Serverless)**

#### Setup:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NODE_ENV
vercel env add JWT_SECRET
vercel env add DB_HOST
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_NAME
```

## Database Options (Free Tier)

### 1. **PlanetScale** (Recommended)
- MySQL-compatible
- 5GB free storage
- Automatic scaling

### 2. **Supabase**
- PostgreSQL
- 500MB free storage
- Built-in auth

### 3. **MongoDB Atlas**
- 512MB free storage
- Global clusters

### 4. **JawsDB (Heroku Addon)**
- MySQL
- 5MB free storage
- Easy Heroku integration

## Environment Variables for Production

### Server (.env):
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=kulturaview
JWT_SECRET=your_super_secure_production_jwt_secret_make_it_very_long
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

### Client (.env.production):
```env
REACT_APP_API_URL=https://your-api-domain.herokuapp.com/api
```

## Quick Deploy Commands

### Heroku (Full-Stack):
```bash
git add .
git commit -m "Deploy to production"
git push heroku main
heroku open
```

### Netlify (Frontend Only):
```bash
cd client
npm run build
# Upload build folder to Netlify
```

### Vercel:
```bash
vercel --prod
```

## Post-Deployment Checklist

- [ ] ✅ App loads without errors
- [ ] ✅ Database connection works
- [ ] ✅ User registration/login works
- [ ] ✅ Image upload works
- [ ] ✅ Virtual try-on processes images
- [ ] ✅ Services page loads data
- [ ] ✅ Admin login works
- [ ] ✅ HTTPS is enabled
- [ ] ✅ Environment variables are set
- [ ] ✅ File uploads work (check uploads directory)

## Troubleshooting

### Common Issues:

#### 1. **Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. **Database Connection Error**
- Check environment variables
- Verify database credentials
- Ensure database server is running

#### 3. **File Upload Issues**
- Check uploads directory permissions
- Verify file size limits
- Ensure Sharp library is installed

#### 4. **CORS Errors**
- Update CORS origins in server
- Check API URL in client

## Performance Optimization

### 1. **Enable Compression**
```js
const compression = require('compression');
app.use(compression());
```

### 2. **Add Caching Headers**
```js
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));
```

### 3. **Optimize Images**
- Use WebP format when possible
- Implement lazy loading
- Compress images before upload

## Monitoring

### 1. **Health Checks**
- `/health` endpoint included
- Monitor uptime with UptimeRobot (free)

### 2. **Error Tracking**
- Integrate Sentry (free tier available)
- Monitor logs in hosting platform

### 3. **Analytics**
- Google Analytics
- Hotjar for user behavior

## Security

### 1. **HTTPS**
- Enabled by default on most platforms
- Use Let's Encrypt for custom domains

### 2. **Environment Variables**
- Never commit secrets to Git
- Use platform-specific secret management

### 3. **Rate Limiting**
```js
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## Custom Domain Setup

### 1. **Heroku**
```bash
heroku domains:add www.kulturaview.com
# Configure DNS CNAME record
```

### 2. **Netlify**
- Add domain in Netlify dashboard
- Configure DNS settings

### 3. **Vercel**
```bash
vercel domains add kulturaview.com
```

---

**Choose the platform that best fits your needs:**
- **Heroku**: Best for full-stack apps with database
- **Railway**: Modern alternative to Heroku
- **Vercel**: Great for serverless deployment
- **Netlify**: Perfect for frontend-only deployment
