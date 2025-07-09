# KulturaView Setup Instructions

## Quick Start Guide

### 1. Prerequisites
- Node.js (v16+)
- MySQL (v8.0+)
- Git

### 2. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd kulturaview

# Setup Server
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials

# Setup Client
cd ../client
npm install
cp .env.example .env
# Edit .env if needed (default should work)
```

### 3. Database Setup

```sql
-- Create database in MySQL
CREATE DATABASE kulturaview;
```

### 4. Run the Application

```bash
# Terminal 1 - Start Server
cd server
npm run dev

# Terminal 2 - Start Client
cd client
npm start
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Demo Accounts

### Admin Account
- Email: admin@kulturaview.com
- Password: admin123

### Client Account  
- Email: client@kulturaview.com
- Password: client123

## Troubleshooting

### Missing index.html Error
Make sure all files in `client/public/` are present:
- index.html
- manifest.json
- robots.txt
- favicon.ico

### Database Connection Error
1. Check MySQL is running
2. Verify credentials in `server/.env`
3. Ensure database exists

### Port Already in Use
Change PORT in `server/.env` to a different number (e.g., 5001)

## Next Steps
1. Create your admin account
2. Add your spa services
3. Test the virtual try-on feature
4. Customize the branding and content
