# 🚂 Railway Deployment Guide for KulturaView

## 🎯 Quick Railway Deployment

### 1. **Prepare Your Repository**
```bash
# Make sure all files are committed
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. **Deploy to Railway**

#### Option A: Using Railway CLI (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Option B: Using Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select your KulturaView repository
5. Railway will auto-detect and deploy

### 3. **Add Database**
```bash
# Add MySQL database
railway add mysql

# Or add PostgreSQL (if you prefer)
railway add postgresql
```

### 4. **Set Environment Variables**
```bash
# Set production environment
railway variables set NODE_ENV=production

# Set JWT secret (generate a secure one)
railway variables set JWT_SECRET=your_super_secure_jwt_secret_here

# Railway automatically sets DATABASE_URL
# No need to set individual DB variables
```

### 5. **Custom Domain (Optional)**
```bash
# Add custom domain
railway domain add kulturaview.com
```

## 🔧 Environment Variables for Railway

Railway will automatically provide:
- \`DATABASE_URL\` (when you add a database)
- \`PORT\` (automatically assigned)
- \`RAILWAY_STATIC_URL\` (your app URL)

You need to set:
- \`NODE_ENV=production\`
- \`JWT_SECRET=your_secure_secret\`

## 🏠 Local Development Setup

### 1. **Install Dependencies**
```bash
# Install all dependencies
npm run install:all
```

### 2. **Setup Local Database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE kulturaview;
exit
```

### 3. **Environment Files**
Create \`.env\` files:

**server/.env:**
```env
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=kulturaview
JWT_SECRET=dev_jwt_secret_for_local_only
PORT=5000
```

**client/.env:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. **Start Development**
```bash
# Start both client and server
npm run dev

# Or start separately:
# Terminal 1: npm run server:dev
# Terminal 2: npm run client:dev
```

## 🔄 Development vs Production

### **Development (Local):**
- Uses local MySQL database
- Hot reload for both client and server
- Detailed error messages
- CORS allows localhost:3000
- Files stored in \`server/uploads/\`

### **Production (Railway):**
- Uses Railway's managed database
- Optimized builds
- Error messages are sanitized
- CORS configured for production domain
- Files stored in \`/tmp/uploads/\`

## 🚀 Deployment Commands

### **Deploy Updates:**
```bash
# Push to trigger auto-deploy
git add .
git commit -m "Update features"
git push origin main

# Or manual deploy
railway up
```

### **View Logs:**
```bash
railway logs
```

### **Open App:**
```bash
railway open
```

## 🔍 Troubleshooting

### **Database Connection Issues:**
```bash
# Check database status
railway status

# View database URL
railway variables
```

### **Build Failures:**
```bash
# Check build logs
railway logs --deployment

# Redeploy
railway up --detach
```

### **File Upload Issues:**
- Railway uses ephemeral storage
- Files in \`/tmp/\` are temporary
- Consider using Railway's volume mounts for persistent storage

## 📊 Monitoring

### **Built-in Monitoring:**
- Railway provides metrics dashboard
- CPU, Memory, Network usage
- Request logs and errors

### **Health Checks:**
- \`/health\` endpoint included
- Automatic restart on failures

## 💰 Railway Pricing

### **Free Tier:**
- $5 credit per month
- Enough for small to medium apps
- Automatic scaling

### **Pro Plan:**
- $20/month
- More resources and credits
- Priority support

## 🔐 Security

### **Automatic HTTPS:**
- Railway provides SSL certificates
- Custom domains get automatic HTTPS

### **Environment Variables:**
- Securely stored and encrypted
- Not visible in logs

## 📈 Scaling

Railway automatically scales based on:
- CPU usage
- Memory usage
- Request volume

No configuration needed!

---

## 🎉 You're Ready!

Your KulturaView app is now configured for:
- ✅ **Local Development** with hot reload
- ✅ **Railway Production** deployment
- ✅ **Database** management (dev/prod)
- ✅ **Environment** separation
- ✅ **File uploads** handling
- ✅ **Monitoring** and health checks

**Next Steps:**
1. Test locally: \`npm run dev\`
2. Deploy to Railway: \`railway up\`
3. Add your database
4. Set environment variables
5. Your app is live! 🚀
