const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  // Reference to User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Professional Information
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    uppercase: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'General Ayurveda',
      'Panchakarma',
      'Kayachikitsa',
      'Shalya Tantra',
      'Shalakya Tantra',
      'Prasuti Tantra',
      'Kaumarabhritya',
      'Agada Tantra',
      'Rasayana',
      'Vajikarana'
    ]
  },
  qualification: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    certificate: {
      url: String,
      publicId: String
    }
  }],
  
  // Government Verification
  governmentVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['registration_certificate', 'degree_certificate', 'identity_proof', 'address_proof']
    },
    url: String,
    publicId: String,
    uploadedAt: Date,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Practice Information
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  followUpFee: {
    type: Number,
    default: 0
  },
  
  // Clinic Information
  clinics: [{
    name: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    phone: String,
    email: String,
    timings: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      startTime: String,
      endTime: String,
      isAvailable: {
        type: Boolean,
        default: true
      }
    }],
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Services Offered
  services: [{
    name: String,
    description: String,
    duration: Number, // in minutes
    price: Number
  }],
  
  // Panchakarma Specialization
  panchakarmaServices: [{
    therapy: {
      type: String,
      enum: [
        'Vamana',
        'Virechana',
        'Basti',
        'Nasya',
        'Raktamokshana',
        'Abhyanga',
        'Shirodhara',
        'Pizhichil',
        'Kizhi',
        'Udvartana'
      ]
    },
    certification: String,
    experience: Number
  }],
  
  // Availability
  availability: {
    monday: {
      isAvailable: { type: Boolean, default: true },
      slots: [{
        startTime: String,
        endTime: String,
        maxPatients: Number,
        isOnline: Boolean
      }]
    },
    tuesday: {
      isAvailable: { type: Boolean, default: true },
      slots: [{
        startTime: String,
        endTime: String,
        maxPatients: Number,
        isOnline: Boolean
      }]
    },
    wednesday: {
      isAvailable: { type: Boolean, default: true },
      slots: [{
        startTime: String,
        endTime: String,
        maxPatients: Number,
        isOnline: Boolean
      }]
    },
    thursday: {
      isAvailable: { type: Boolean, default: true },
      slots: [{
        startTime: String,
        endTime: String,
        maxPatients: Number,
        isOnline: Boolean
      }]
    },
    friday: {
      isAvailable: { type: Boolean, default: true },
      slots: [{
        startTime: String,
        endTime: String,
        maxPatients: Number,
        isOnline: Boolean
      }]
    },
    saturday: {
      isAvailable: { type: Boolean, default: true },
      slots: [{
        startTime: String,
        endTime: String,
        maxPatients: Number,
        isOnline: Boolean
      }]
    },
    sunday: {
      isAvailable: { type: Boolean, default: true },
      slots: [{
        startTime: String,
        endTime: String,
        maxPatients: Number,
        isOnline: Boolean
      }]
    }
  },
  
  // Online Consultation
  onlineConsultation: {
    isAvailable: {
      type: Boolean,
      default: false
    },
    platform: {
      type: String,
      enum: ['zoom', 'google_meet', 'custom']
    },
    meetingLink: String,
    consultationFee: Number
  },
  
  // Ratings and Reviews
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    breakdown: {
      '5': { type: Number, default: 0 },
      '4': { type: Number, default: 0 },
      '3': { type: Number, default: 0 },
      '2': { type: Number, default: 0 },
      '1': { type: Number, default: 0 }
    }
  },
  
  // Statistics
  statistics: {
    totalPatients: {
      type: Number,
      default: 0
    },
    totalConsultations: {
      type: Number,
      default: 0
    },
    totalPrescriptions: {
      type: Number,
      default: 0
    },
    averageConsultationTime: {
      type: Number,
      default: 0
    }
  },
  
  // Research and Publications
  research: {
    isParticipating: {
      type: Boolean,
      default: false
    },
    researchAreas: [String],
    publications: [{
      title: String,
      journal: String,
      year: Number,
      link: String
    }],
    caseStudies: [{
      title: String,
      description: String,
      date: Date,
      isPublic: {
        type: Boolean,
        default: false
      }
    }]
  },
  
  // Government Integration
  ndhmIntegration: {
    isRegistered: {
      type: Boolean,
      default: false
    },
    ndhmId: String,
    registrationDate: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'inactive'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
doctorSchema.virtual('fullName').get(function() {
  return this.user ? `${this.user.firstName} ${this.user.lastName}` : '';
});

// Virtual for primary clinic
doctorSchema.virtual('primaryClinic').get(function() {
  return this.clinics.find(clinic => clinic.isPrimary) || this.clinics[0];
});

// Index for better performance
doctorSchema.index({ user: 1 });
doctorSchema.index({ registrationNumber: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ 'clinics.address.city': 1, 'clinics.address.state': 1 });
doctorSchema.index({ governmentVerified: 1, status: 1 });
doctorSchema.index({ 'ratings.average': -1 });

// Pre-save middleware to update timestamps
doctorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to update ratings
doctorSchema.methods.updateRating = function(newRating) {
  const oldRating = this.ratings.average;
  const totalRatings = this.ratings.count;
  
  // Update breakdown
  this.ratings.breakdown[newRating.toString()]++;
  
  // Calculate new average
  const newTotal = (oldRating * totalRatings) + newRating;
  this.ratings.average = newTotal / (totalRatings + 1);
  this.ratings.count = totalRatings + 1;
  
  return this.save();
};

// Method to check availability
doctorSchema.methods.isAvailable = function(date, time) {
  const day = date.toLowerCase();
  const dayAvailability = this.availability[day];
  
  if (!dayAvailability || !dayAvailability.isAvailable) {
    return false;
  }
  
  return dayAvailability.slots.some(slot => {
    return time >= slot.startTime && time <= slot.endTime;
  });
};

module.exports = mongoose.model('Doctor', doctorSchema);