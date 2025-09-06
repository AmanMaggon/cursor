# AyurSutra Deployment Guide

## Overview
This guide covers the deployment of AyurSutra, a government-standard Ayurveda management platform with React Native mobile apps, React.js admin panel, and Node.js backend.

## Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile Apps   │    │   Admin Panel   │    │   Backend API   │
│  (React Native) │    │   (React.js)    │    │   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MongoDB       │
                    │   Database      │
                    └─────────────────┘
```

## Prerequisites

### System Requirements
- Node.js 18+ 
- MongoDB 6.0+
- React Native CLI
- Android Studio / Xcode
- Git

### Environment Setup
1. Clone the repository
2. Install dependencies for all components
3. Set up environment variables
4. Configure database
5. Set up external services

## Backend Deployment

### 1. Server Setup
```bash
cd server
npm install
cp .env.example .env
# Configure .env with your settings
```

### 2. Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/ayursutra

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token

FIREBASE_PROJECT_ID=your-firebase-project-id
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 3. Database Setup
```bash
# Start MongoDB
mongod

# Seed initial data (optional)
npm run seed
```

### 4. Production Deployment
```bash
# Build and start
npm run build
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start index.js --name ayursutra-api
pm2 startup
pm2 save
```

## Admin Panel Deployment

### 1. Build Setup
```bash
cd client
npm install
cp .env.example .env
```

### 2. Environment Variables
```env
REACT_APP_API_URL=https://api.ayursutra.com
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
REACT_APP_FIREBASE_CONFIG=your-firebase-config
```

### 3. Build and Deploy
```bash
# Build for production
npm run build

# Deploy to web server (nginx, apache, etc.)
# Copy build/ folder to web server directory
```

### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name admin.ayursutra.com;
    root /var/www/ayursutra-admin/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Mobile App Deployment

### 1. React Native Setup
```bash
cd mobile
npm install
npx react-native link
```

### 2. Android Configuration
```bash
# Generate signed APK
cd android
./gradlew assembleRelease

# Or build AAB for Play Store
./gradlew bundleRelease
```

### 3. iOS Configuration
```bash
# Open Xcode project
cd ios
open AyurSutra.xcworkspace

# Configure signing and build
# Archive and upload to App Store Connect
```

### 4. Environment Configuration
```javascript
// mobile/src/config/environment.js
export const API_BASE_URL = 'https://api.ayursutra.com';
export const GOOGLE_MAPS_API_KEY = 'your-google-maps-api-key';
export const FIREBASE_CONFIG = {
  // Firebase configuration
};
```

## Database Deployment

### 1. MongoDB Setup
```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb

# Start MongoDB
sudo systemctl start mongod
```

### 2. Database Configuration
```javascript
// server/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
```

### 3. Database Indexes
```javascript
// Create indexes for better performance
db.users.createIndex({ email: 1 });
db.users.createIndex({ phone: 1 });
db.appointments.createIndex({ patient: 1, scheduledDate: -1 });
db.prescriptions.createIndex({ patient: 1, date: -1 });
```

## External Services Setup

### 1. Email Service (SMTP)
- Configure Gmail SMTP or AWS SES
- Set up email templates
- Test email delivery

### 2. SMS Service (Twilio)
- Create Twilio account
- Get Account SID and Auth Token
- Configure phone number

### 3. Payment Gateway (Razorpay)
- Create Razorpay account
- Get API keys
- Configure webhooks

### 4. Maps Service (Google Maps)
- Create Google Cloud project
- Enable Maps API
- Get API key

### 5. Push Notifications (Firebase)
- Create Firebase project
- Download configuration files
- Set up FCM

## Security Configuration

### 1. SSL/TLS Setup
```bash
# Generate SSL certificate
sudo certbot --nginx -d api.ayursutra.com
sudo certbot --nginx -d admin.ayursutra.com
```

### 2. Security Headers
```javascript
// server/middleware/security.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

## Monitoring and Logging

### 1. Application Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-logrotate
pm2 monit
```

### 2. Database Monitoring
```bash
# MongoDB monitoring
mongostat
mongotop
```

### 3. Log Management
```javascript
// server/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## Backup and Recovery

### 1. Database Backup
```bash
# Create backup
mongodump --db ayursutra --out /backup/ayursutra-$(date +%Y%m%d)

# Restore backup
mongorestore --db ayursutra /backup/ayursutra-20240101/ayursutra
```

### 2. Application Backup
```bash
# Backup application files
tar -czf ayursutra-backup-$(date +%Y%m%d).tar.gz /var/www/ayursutra
```

## Performance Optimization

### 1. Database Optimization
- Create appropriate indexes
- Use connection pooling
- Implement caching

### 2. API Optimization
- Implement response caching
- Use compression
- Optimize database queries

### 3. Frontend Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading

## Compliance and Security

### 1. NDHM Compliance
- Implement FHIR-R4 standards
- Ensure data encryption
- Maintain audit logs

### 2. AYUSH Compliance
- Follow Ayurveda guidelines
- Maintain practitioner records
- Ensure medicine authenticity

### 3. Data Privacy
- Implement GDPR compliance
- Ensure data encryption
- Maintain user consent records

## Troubleshooting

### Common Issues
1. **Database Connection Issues**
   - Check MongoDB service status
   - Verify connection string
   - Check firewall settings

2. **API Authentication Issues**
   - Verify JWT secret
   - Check token expiration
   - Validate request headers

3. **Mobile App Issues**
   - Check network connectivity
   - Verify API endpoints
   - Check device permissions

### Log Analysis
```bash
# View application logs
pm2 logs ayursutra-api

# View error logs
tail -f /var/log/ayursutra/error.log
```

## Maintenance

### Regular Tasks
1. **Daily**
   - Monitor system health
   - Check error logs
   - Verify backups

2. **Weekly**
   - Update dependencies
   - Review security logs
   - Performance analysis

3. **Monthly**
   - Security audit
   - Database optimization
   - Capacity planning

## Support and Documentation

### Resources
- API Documentation: `/docs/api`
- User Manual: `/docs/user`
- Admin Guide: `/docs/admin`
- Developer Guide: `/docs/developer`

### Contact
- Technical Support: support@ayursutra.com
- Security Issues: security@ayursutra.com
- General Inquiries: info@ayursutra.com