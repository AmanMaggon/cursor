# AyurSutra - Government-Standard Ayurveda Management Platform

AyurSutra is a comprehensive, government-compliant Ayurveda management platform that integrates best practices from Indian healthcare apps and leading ayurvedic solutions, ensuring authentic Ayurveda delivery, strong compliance, and elderly-friendly accessibility.

## Key Features

### 🔐 Government-Grade Security & Compliance
- National Digital Health Blueprint (NDHB) compliance
- NDHM (National Digital Health Mission) integration
- AYUSH ministry standards
- Health data privacy and EHR interoperability
- Patient ownership of records

### 🌿 Ayurveda-Centric Workflow
- Dosha-based consultation templates
- Panchakarma therapy tracking
- Herbal medicine inventory management
- Outcome analytics and reporting

### 📱 Multilingual & Accessible
- Regional language support
- Elderly-friendly interface
- Offline-ready functionality
- Mobile-first design

### 🗺️ Maps-Integrated Ecosystem
- Navigation to verified doctors and chemists
- Government badge and licensing verification
- Proximity-based service matching

## Architecture

```
ayursutra/
├── server/          # Node.js backend API
├── client/          # React.js admin panel
├── mobile/          # React Native mobile apps
├── shared/          # Shared utilities and types
└── docs/           # Documentation
```

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js (Admin Panel)
- **Mobile**: React Native (Patient, Doctor, Chemist apps)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Aadhaar integration
- **Payments**: Razorpay, UPI integration
- **Maps**: Google Maps API
- **Notifications**: FCM, SMS integration

## Getting Started

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env` in each directory
   - Configure database, API keys, and service credentials

3. **Development**
   ```bash
   npm run dev
   ```

4. **Mobile Development**
   ```bash
   npm run mobile:dev
   ```

## Compliance Standards

- **NDHM**: National Digital Health Mission standards
- **AYUSH**: Ministry of AYUSH guidelines
- **NDHB**: National Digital Health Blueprint
- **FHIR-R4**: Health data interoperability
- **Accessibility**: Government accessibility guidelines

## User Roles

1. **Patients**: Aadhaar-verified onboarding, therapy management, prescription access
2. **Doctors**: Government-verified practitioners, prescription management, research integration
3. **Chemists**: Licensed pharmacies, inventory management, prescription fulfillment
4. **Admins**: System management, verification, analytics, compliance monitoring

## Contributing

This project follows government standards for healthcare applications. Please ensure all contributions maintain compliance with NDHM and AYUSH guidelines.

## License

MIT License - See LICENSE file for details